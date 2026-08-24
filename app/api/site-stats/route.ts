import { countDownload, countVisit, DOWNLOAD_REPOS, readSiteStats, type DownloadRepo } from "../../../db/siteStats";
import { isTrustedSameSiteEvent } from "../../requestTraffic";

export const dynamic = "force-dynamic";

function requestedMonth(request: Request) {
  const month = new URL(request.url).searchParams.get("month");
  return month && /^20\d{2}-(0[1-9]|1[0-2])$/.test(month) ? month : undefined;
}

export async function GET(request: Request) {
  try {
    return Response.json(await readSiteStats(requestedMonth(request)), { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ error: "통계를 불러올 수 없습니다." }, { status: 503 });
  }
}

export async function POST(request: Request) {
  if (!isTrustedSameSiteEvent(request)) {
    return Response.json({ error: "허용되지 않은 요청입니다." }, { status: 403 });
  }

  let body: { event?: string; repo?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "올바르지 않은 요청입니다." }, { status: 400 });
  }

  try {
    if (body.event === "visit") {
      await countVisit();
    } else if (body.event === "download" && DOWNLOAD_REPOS.includes(body.repo as DownloadRepo)) {
      await countDownload(body.repo as DownloadRepo);
    } else {
      return Response.json({ error: "지원하지 않는 집계 항목입니다." }, { status: 400 });
    }
    return Response.json(await readSiteStats(), { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ error: "통계를 기록할 수 없습니다." }, { status: 503 });
  }
}
