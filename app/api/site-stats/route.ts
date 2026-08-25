import { countDownload, countVisit, DOWNLOAD_REPOS, readSiteStats, type DownloadRepo } from "../../../db/siteStats";
import { classifyTrafficSource, isTrustedSameSiteEvent } from "../../requestTraffic";
import { isRequestAuthenticated } from "../../testflight-auth";

export const dynamic = "force-dynamic";

function requestedMonth(request: Request) {
  const month = new URL(request.url).searchParams.get("month");
  return month && /^20\d{2}-(0[1-9]|1[0-2])$/.test(month) ? month : undefined;
}

export async function GET(request: Request) {
  try {
    const stats = await readSiteStats(requestedMonth(request));
    const includeSources = new URL(request.url).searchParams.get("includeSources") === "1"
      && await isRequestAuthenticated(request);
    return Response.json(includeSources ? stats : { ...stats, sources: [] }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ error: "통계를 불러올 수 없습니다." }, { status: 503 });
  }
}

export async function POST(request: Request) {
  if (!isTrustedSameSiteEvent(request)) {
    return Response.json({ error: "허용되지 않은 요청입니다." }, { status: 403 });
  }

  let body: { event?: string; repo?: string; referrer?: string; utmSource?: string; utmMedium?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "올바르지 않은 요청입니다." }, { status: 400 });
  }

  try {
    if (body.event === "visit") {
      const { key } = classifyTrafficSource(request, body.referrer, body.utmSource, body.utmMedium);
      await countVisit(key);
    } else if (body.event === "download" && DOWNLOAD_REPOS.includes(body.repo as DownloadRepo)) {
      await countDownload(body.repo as DownloadRepo);
    } else {
      return Response.json({ error: "지원하지 않는 집계 항목입니다." }, { status: 400 });
    }
    const stats = await readSiteStats();
    return Response.json({ ...stats, sources: [] }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ error: "통계를 기록할 수 없습니다." }, { status: 503 });
  }
}
