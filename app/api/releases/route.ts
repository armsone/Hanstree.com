import { DOWNLOAD_KEYS } from "../../releases";
import { readRelease } from "../../../db/releases";
export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  const key = DOWNLOAD_KEYS.find((key) => key === new URL(request.url).searchParams.get("app"));
  if (!key) return Response.json({ error: "지원하지 않는 다운로드입니다." }, { status: 404 });
  try {
    return Response.json(await readRelease(key), { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ error: "배포 정보를 불러오지 못했습니다." }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
