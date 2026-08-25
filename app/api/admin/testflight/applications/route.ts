import {
  deleteTestFlightApplication,
  getTestFlightSummaryStats,
  listTestFlightApplications,
  updateTestFlightApplicantName,
  updateTestFlightStatus,
  type TestFlightStatus,
} from "../../../../../db/testflight";
import { isTrustedSameSiteEvent } from "../../../../requestTraffic";
import { isRequestAuthenticated } from "../../../../testflight-auth";
import { isValidTesterName, normalizeTesterName, TESTER_NAME_MAX_LENGTH } from "../../../../testflight-shared";

export const dynamic = "force-dynamic";

const VALID_STATUSES: TestFlightStatus[] = ["pending", "selected", "rejected", "invited"];

export async function GET(request: Request) {
  const isAuthenticated = await isRequestAuthenticated(request);
  if (!isAuthenticated) {
    return Response.json(
      { error: "관리자 인증이 필요합니다. 다시 로그인해 주세요." },
      { status: 401, headers: { "Cache-Control": "no-store" } }
    );
  }

  try {
    const url = new URL(request.url);
    const statusParam = url.searchParams.get("status") || undefined;
    const appSlugParam = url.searchParams.get("appSlug") || undefined;

    const [applications, stats] = await Promise.all([
      listTestFlightApplications({
        status: statusParam,
        appSlug: appSlugParam,
      }),
      getTestFlightSummaryStats(),
    ]);

    return Response.json(
      { applications, stats },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("Failed to load TestFlight applications:", error);
    return Response.json(
      { error: "신청자 목록을 불러오지 못했습니다." },
      { status: 503, headers: { "Cache-Control": "no-store" } }
    );
  }
}

export async function PATCH(request: Request) {
  if (!isTrustedSameSiteEvent(request)) {
    return Response.json({ error: "허용되지 않은 요청입니다." }, { status: 403 });
  }

  const isAuthenticated = await isRequestAuthenticated(request);
  if (!isAuthenticated) {
    return Response.json({ error: "관리자 인증이 필요합니다." }, { status: 401 });
  }

  let body: { id?: unknown; status?: unknown; lastName?: unknown; firstName?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "올바른 JSON 요청이 아닙니다." }, { status: 400 });
  }

  const id = typeof body.id === "number" ? body.id : parseInt(String(body.id), 10);
  const status = typeof body.status === "string" ? (body.status as TestFlightStatus) : null;

  if (!id || Number.isNaN(id) || id <= 0) {
    return Response.json({ error: "올바른 신청 ID가 아닙니다." }, { status: 400 });
  }

  // 이름 보완: 이름 칸이 없던 시기의 기존 신청 행에 관리자가 성·이름을 직접 채웁니다.
  if (body.lastName !== undefined || body.firstName !== undefined) {
    const lastName = normalizeTesterName(body.lastName);
    const firstName = normalizeTesterName(body.firstName);
    if (!isValidTesterName(lastName) || !isValidTesterName(firstName)) {
      return Response.json(
        { error: `성과 이름을 각각 ${TESTER_NAME_MAX_LENGTH}자 이내로 모두 입력해 주세요.` },
        { status: 400 }
      );
    }

    try {
      const success = await updateTestFlightApplicantName(id, lastName, firstName);
      if (!success) {
        return Response.json({ error: "해당 신청 기록을 찾을 수 없습니다." }, { status: 404 });
      }

      return Response.json({ ok: true, message: "성·이름이 저장되었습니다.", lastName, firstName });
    } catch (error) {
      console.error("Failed to update applicant name:", error);
      return Response.json(
        { error: "이름 저장 중 데이터베이스 오류가 발생했습니다." },
        { status: 503 }
      );
    }
  }

  if (!status || !VALID_STATUSES.includes(status)) {
    return Response.json(
      { error: "올바른 상태(pending, selected, rejected, invited)를 지정해 주세요." },
      { status: 400 }
    );
  }

  try {
    const success = await updateTestFlightStatus(id, status);
    if (!success) {
      return Response.json({ error: "해당 신청 기록을 찾을 수 없습니다." }, { status: 404 });
    }

    return Response.json({ ok: true, message: "상태가 성공적으로 변경되었습니다." });
  } catch (error) {
    console.error("Failed to update status:", error);
    return Response.json(
      { error: "상태 변경 중 데이터베이스 오류가 발생했습니다." },
      { status: 503 }
    );
  }
}

export async function DELETE(request: Request) {
  if (!isTrustedSameSiteEvent(request)) {
    return Response.json({ error: "허용되지 않은 요청입니다." }, { status: 403 });
  }

  const isAuthenticated = await isRequestAuthenticated(request);
  if (!isAuthenticated) {
    return Response.json({ error: "관리자 인증이 필요합니다." }, { status: 401 });
  }

  let id: number | null = null;

  try {
    const url = new URL(request.url);
    const idFromQuery = url.searchParams.get("id");
    if (idFromQuery) {
      id = parseInt(idFromQuery, 10);
    } else {
      const body = await request.json();
      id = typeof body.id === "number" ? body.id : parseInt(String(body.id), 10);
    }
  } catch {
    // If request has no JSON body and no query param
  }

  if (!id || Number.isNaN(id) || id <= 0) {
    return Response.json({ error: "삭제할 신청 ID를 지정해 주세요." }, { status: 400 });
  }

  try {
    const success = await deleteTestFlightApplication(id);
    if (!success) {
      return Response.json({ error: "해당 신청 기록을 찾을 수 없습니다." }, { status: 404 });
    }

    return Response.json({ ok: true, message: "신청 기록이 영구 삭제되었습니다." });
  } catch (error) {
    console.error("Failed to delete application:", error);
    return Response.json(
      { error: "삭제 중 데이터베이스 오류가 발생했습니다." },
      { status: 503 }
    );
  }
}
