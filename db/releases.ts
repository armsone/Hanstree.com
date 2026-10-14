import { getD1 } from "./index";
import { RELEASE_DOWNLOADS, type DownloadKey } from "../app/releases";
import type { ReleaseInfo } from "../app/releaseInfo";

type Asset = { name: string; state: string; size: number; browser_download_url: string; digest?: string | null };
type Release = { id: number; tag_name: string; html_url: string; published_at: string | null; draft: boolean; prerelease: boolean; assets: Asset[] };
const TTL = 5 * 60_000;

async function github<T>(path: string): Promise<T> {
  const response = await fetch(`https://api.github.com${path}`, { headers: { Accept: "application/vnd.github+json", "User-Agent": "Hanstree-release-info", "X-GitHub-Api-Version": "2026-03-10" }, signal: AbortSignal.timeout(8000) });
  if (!response.ok) throw new Error(`GitHub release lookup: ${response.status}`);
  return response.json() as Promise<T>;
}

function assetUrlAllowed(key: DownloadKey, url: string) {
  return url.startsWith(`https://github.com/armsone/${RELEASE_DOWNLOADS[key].repo}/releases/download/`);
}

function bootstrap(key: DownloadKey): ReleaseInfo {
  const config = RELEASE_DOWNLOADS[key];
  const url = new URL(config.fallbackUrl, "https://hanstree.com");
  const parts = url.pathname.split("/");
  const tagName = config.fallbackUrl.startsWith("/") ? "" : decodeURIComponent(parts[5] || "");
  const name = decodeURIComponent(parts.at(-1) || "");
  return { key, releaseId: null, tagName, version: (tagName || name).match(/\d+\.\d+\.\d+/)?.[0] ?? null, publishedAt: null, checkedAt: null, source: "bootstrap", preview: Boolean(config.allowPreview), downloadUrl: config.fallbackUrl, releaseUrl: tagName ? `https://github.com/armsone/${config.repo}/releases/tag/${encodeURIComponent(tagName)}` : "https://github.com/armsone/Hanstree.com/releases", asset: config.releasePage ? null : { name, size: null, sha256: null }, build: null, versionCode: null, minimumOS: null };
}

async function fromRelease(key: DownloadKey, release: Release): Promise<ReleaseInfo | null> {
  const config = RELEASE_DOWNLOADS[key];
  if (release.draft || (release.prerelease && !config.allowPreview && !config.pinnedPreviewTag) ||
    (config.tagPattern && !config.tagPattern.test(release.tag_name)) ||
    !release.html_url.startsWith(`https://github.com/armsone/${config.repo}/releases/tag/`)) return null;
  const assets = release.assets.filter((asset) => asset.state === "uploaded" && asset.size > 0 && config.assetPattern.test(asset.name) && assetUrlAllowed(key, asset.browser_download_url));
  if (!config.releasePage && assets.length !== 1) {
    if (assets.length > 1) throw new Error(`Ambiguous release assets: ${key}`);
    return null;
  }
  const asset = assets[0];
  const info: ReleaseInfo = { key, releaseId: release.id, tagName: release.tag_name, version: release.tag_name.match(/\d+\.\d+\.\d+/)?.[0] ?? asset?.name.match(/\d+\.\d+\.\d+/)?.[0] ?? null, publishedAt: release.published_at, checkedAt: new Date().toISOString(), source: "github", preview: release.prerelease, downloadUrl: config.releasePage ? release.html_url : asset.browser_download_url, releaseUrl: release.html_url, asset: asset ? { name: asset.name, size: asset.size, sha256: asset.digest?.replace(/^sha256:/, "") ?? null } : null, build: asset?.name.match(/-(\d{12})(?:\.|-)/)?.[1] ?? null, versionCode: null, minimumOS: null };
  const metadata = release.assets.find((item) => item.name === "release.json" && item.state === "uploaded" && item.size > 0 && item.size <= 65536 && assetUrlAllowed(key, item.browser_download_url));
  if (metadata && asset) {
    const response = await fetch(metadata.browser_download_url, { signal: AbortSignal.timeout(8000) });
    if (!response.ok) throw new Error("Release metadata unavailable");
    const body = await response.text();
    if (body.length > 65536) throw new Error("Release metadata too large");
    const data = JSON.parse(body) as { schemaVersion: number; downloads: { key: string; version: string; build?: string; versionCode?: number; minimumOS?: string; asset: { name: string; size: number; sha256: string } }[] };
    if (data.schemaVersion !== 1 || !Array.isArray(data.downloads)) throw new Error("Invalid release metadata");
    const entries = data.downloads.filter((item) => item.key === key);
    if (entries.length !== 1) throw new Error("Missing or ambiguous release metadata");
    const entry = entries[0];
    if (entry.version !== info.version || entry.asset.name !== asset.name || entry.asset.size !== asset.size || !/^[a-f0-9]{64}$/i.test(entry.asset.sha256) || (info.asset?.sha256 && info.asset.sha256 !== entry.asset.sha256)) throw new Error("Release metadata does not match asset");
    info.asset!.sha256 = entry.asset.sha256;
    info.build = typeof entry.build === "string" && /^\d{1,20}$/.test(entry.build) ? entry.build : info.build;
    info.versionCode = Number.isSafeInteger(entry.versionCode) && entry.versionCode! > 0 ? entry.versionCode! : null;
    info.minimumOS = typeof entry.minimumOS === "string" && entry.minimumOS.length <= 100 ? entry.minimumOS : null;
  }
  return info;
}

async function current(key: DownloadKey): Promise<ReleaseInfo> {
  const config = RELEASE_DOWNLOADS[key];
  const base = `/repos/armsone/${encodeURIComponent(config.repo)}/releases`;
  if (config.pinnedPreviewTag) {
    const info = await fromRelease(key, await github<Release>(`${base}/tags/${encodeURIComponent(config.pinnedPreviewTag)}`));
    if (!info) throw new Error("Pinned release asset missing");
    return info;
  }
  // Mixed product/preview repositories need their own channel, not the repository-wide Latest.
  if (!config.tagPattern && !config.allowPreview) {
    const latest = await github<Release>(`${base}/latest`);
    const info = await fromRelease(key, latest);
    if (info) return info;
  }
  const releases = await github<Release[]>(`${base}?per_page=100`);
  for (const release of releases) {
    const info = await fromRelease(key, release);
    if (info) return info;
  }
  throw new Error(`No published release for ${key}`);
}

export async function readRelease(key: DownloadKey): Promise<ReleaseInfo> {
  let saved: ReleaseInfo | null = null;
  const db = getD1();
  const row = await db.prepare("SELECT record_json, retry_after FROM release_snapshots WHERE key = ?").bind(key).first<{ record_json: string; retry_after: string }>();
  if (row) {
    try { saved = JSON.parse(row.record_json) as ReleaseInfo; } catch { /* Keep the bootstrap address available if a stored row is invalid. */ }
    if (saved && Date.parse(row.retry_after) > Date.now()) return saved;
  }
  const previous = saved ?? bootstrap(key);
  const now = new Date().toISOString();
  // One refresh lease per product across Workers. Other requests keep the previous coherent snapshot.
  const lease = await db.prepare(`INSERT INTO release_snapshots (key, record_json, checked_at, retry_after) VALUES (?, ?, ?, ?)
    ON CONFLICT(key) DO UPDATE SET retry_after = excluded.retry_after WHERE release_snapshots.retry_after <= ? RETURNING key`)
    .bind(key, JSON.stringify(previous), previous.checkedAt ?? "", new Date(Date.now() + 60_000).toISOString(), now).first();
  if (!lease) return { ...previous, source: previous.releaseId ? "saved" : "bootstrap" };
  try {
    const info = await current(key);
    await db.prepare("UPDATE release_snapshots SET record_json = ?, checked_at = ?, retry_after = ? WHERE key = ?")
      .bind(JSON.stringify(info), info.checkedAt, new Date(Date.now() + TTL).toISOString(), key).run();
    return info;
  } catch (error) {
    console.warn("Release refresh failed", key, error instanceof Error ? error.message : "unknown");
    const fallback = { ...previous, source: previous.releaseId ? "saved" as const : "bootstrap" as const };
    await db.prepare("UPDATE release_snapshots SET record_json = ?, retry_after = ? WHERE key = ?")
      .bind(JSON.stringify(fallback), new Date(Date.now() + 60_000).toISOString(), key).run();
    return fallback;
  }
}

export async function readSelectedRelease(key: DownloadKey, selected: string | null): Promise<ReleaseInfo> {
  if (selected === "bootstrap") return bootstrap(key);
  const info = await readRelease(key);
  if (!selected || String(info.releaseId) === selected) return info;
  if (!/^\d{1,16}$/.test(selected)) throw new Error("Invalid release selection");
  const release = await github<Release>(`/repos/armsone/${encodeURIComponent(RELEASE_DOWNLOADS[key].repo)}/releases/${selected}`);
  const pinned = await fromRelease(key, release);
  if (!pinned) throw new Error("Selected release no longer available");
  return pinned;
}
