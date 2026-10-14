import { DOWNLOAD_KEYS, RELEASE_DOWNLOADS } from "../../releases";
import { readSelectedRelease } from "../../../db/releases";
import { requestLooksAutomated } from "../../requestTraffic";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const requested = new URL(request.url).searchParams.get("app");
  const normalizedRequest = requested === "StarManager-Android" || requested === "iManager-Android" || requested === "iManagerAI-Android"
    ? "Stargram-Android"
    : requested === "button-Android" || requested === "Button-Android"
      ? "OurButton-Android"
      : requested;
  const key = DOWNLOAD_KEYS.find((candidate) => candidate === normalizedRequest);
  if (!key) return Response.json({ error: "지원하지 않는 다운로드 항목입니다." }, { status: 404 });

  // 라우터 prefetch·RSC 조회는 실제 다운로드가 아니므로 집계와 GitHub 조회 없이 응답합니다.
  const routerFetch = request.headers.has("rsc") ||
    request.headers.has("next-router-prefetch") ||
    /prefetch/i.test(request.headers.get("purpose") || request.headers.get("sec-purpose") || "");
  if (routerFetch) {
    return Response.json({ download: RELEASE_DOWNLOADS[key].fallbackUrl }, { headers: { "Cache-Control": "no-store" } });
  }

  // QR 스캔은 이전 페이지 주소를 보내지 않으므로, 허용 목록의 공개 파일은
  // 일반 브라우저에서 직접 열 수 있게 합니다. 자동화 요청만 차단합니다.
  if (requestLooksAutomated(request)) {
    return Response.json(
      { error: "홈페이지의 다운로드 버튼을 직접 눌러 주세요." },
      { status: 403, headers: { "Cache-Control": "no-store" } },
    );
  }

  try {
    const { countDownload } = await import("../../../db/siteStats");
    await countDownload(key);
  } catch { /* 집계 실패가 다운로드를 막지 않습니다 */ }

  let target: string;
  try {
    const selected = new URL(request.url).searchParams.get("release");
    target = (await readSelectedRelease(key, selected)).downloadUrl;
  } catch {
    return Response.json({ error: "선택한 버전을 확인하지 못했습니다. 제품 페이지에서 다시 확인해 주세요." }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }

  return new Response(null, { status: 302, headers: { Location: target, "Cache-Control": "no-store" } });
}
