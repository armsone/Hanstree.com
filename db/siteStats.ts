import { DOWNLOAD_KEYS, type DownloadKey } from "../app/releases";
import { describeSourceKey } from "../app/requestTraffic";
import { getD1 } from "./index";

// 기존 키(NasFinder-Android 등)를 그대로 포함하므로 누적된 집계는 계속 읽힙니다.
export const DOWNLOAD_REPOS = DOWNLOAD_KEYS;
export type DownloadRepo = DownloadKey;

function today() {
  return new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

function downloadKey(repo: DownloadRepo) {
  return `download:${repo}`;
}

async function increment(keys: string[]) {
  const db = getD1();
  await db.batch(keys.map((key) => db.prepare(`
    INSERT INTO site_counters (key, value, updated_at)
    VALUES (?, 1, CURRENT_TIMESTAMP)
    ON CONFLICT(key) DO UPDATE SET
      value = site_counters.value + 1,
      updated_at = CURRENT_TIMESTAMP
  `).bind(key)));
}

function sourceKeyFor(month: string, sourceKey: string) {
  return `source:${month}:${sourceKey}`;
}

export async function countVisit(sourceKey = "direct") {
  await increment(["visits:total", `visits:${today()}`, sourceKeyFor(today().slice(0, 7), sourceKey)]);
}

export async function countDownload(repo: DownloadRepo) {
  await increment([downloadKey(repo), `${downloadKey(repo)}:${today()}`]);
}

function daysInMonth(month: string) {
  const [year, monthNumber] = month.split("-").map(Number);
  const length = new Date(Date.UTC(year, monthNumber, 0)).getUTCDate();
  const currentDay = today();
  const lastDay = month === currentDay.slice(0, 7) ? Number(currentDay.slice(8)) : length;
  return Array.from({ length: lastDay }, (_, index) => `${month}-${String(index + 1).padStart(2, "0")}`);
}

export async function readSiteStats(month = today().slice(0, 7)) {
  const days = daysInMonth(month);
  const keys = ["visits:total", `visits:${today()}`, ...DOWNLOAD_REPOS.map(downloadKey)];
  const placeholders = keys.map(() => "?").join(",");
  const sourcePrefix = `source:${month}:`;
  const result = await getD1().prepare(
    `SELECT key, value FROM site_counters
     WHERE key IN (${placeholders})
        OR key LIKE ?
        OR key LIKE ?
        OR key LIKE ?`
  ).bind(...keys, `visits:${month}-%`, `download:%:${month}-%`, `${sourcePrefix}%`).all<{ key: string; value: number }>();
  const values = new Map(result.results.map((row) => [row.key, row.value]));
  const downloads = Object.fromEntries(DOWNLOAD_REPOS.map((repo) => [repo, values.get(downloadKey(repo)) || 0]));

  const sources = result.results
    .filter((row) => row.key.startsWith(sourcePrefix))
    .map((row) => {
      const info = describeSourceKey(row.key.slice(sourcePrefix.length));
      return { ...info, count: row.value };
    })
    .sort((a, b) => b.count - a.count);

  return {
    todayVisits: values.get(`visits:${today()}`) || 0,
    totalVisits: values.get("visits:total") || 0,
    totalDownloadClicks: Object.values(downloads).reduce((sum, value) => sum + value, 0),
    downloads,
    month,
    sources,
    daily: days.map((date) => {
      const dailyDownloads = Object.fromEntries(DOWNLOAD_REPOS.map((repo) => [repo, values.get(`${downloadKey(repo)}:${date}`) || 0]));
      return {
        date,
        visits: values.get(`visits:${date}`) || 0,
        downloadClicks: Object.values(dailyDownloads).reduce((sum, value) => sum + value, 0),
        downloads: dailyDownloads,
      };
    }),
  };
}
