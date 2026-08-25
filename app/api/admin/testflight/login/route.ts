import { isTrustedSameSiteEvent } from "../../../../requestTraffic";
import {
  ADMIN_USER_ID,
  checkLoginThrottling,
  createAdminCookieHeader,
  createAdminSessionToken,
  createClearAdminCookieHeader,
  getClientIp,
  hashClientIp,
  isRequestAuthenticated,
  isTestFlightAdminConfigured,
  recordFailedLoginAttempt,
  resetFailedLoginAttempts,
  verifyAdminPassword,
} from "../../../../testflight-auth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const configured = isTestFlightAdminConfigured();
  const authenticated = configured ? await isRequestAuthenticated(request) : false;

  return Response.json(
    {
      configured,
      authenticated,
      userId: authenticated ? ADMIN_USER_ID : null,
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    }
  );
}

export async function POST(request: Request) {
  if (!isTrustedSameSiteEvent(request)) {
    return Response.json(
      { error: "허용되지 않은 요청입니다. 브라우저에서 직접 로그인해 주세요." },
      { status: 403 }
    );
  }

  let body: {
    action?: string;
    userId?: unknown;
    password?: unknown;
  };

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "올바른 JSON 요청이 아닙니다." }, { status: 400 });
  }

  // Handle Logout
  if (body.action === "logout") {
    return new Response(JSON.stringify({ ok: true, message: "로그아웃되었습니다." }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": createClearAdminCookieHeader(),
        "Cache-Control": "no-store",
      },
    });
  }

  // Handle Login
  if (!isTestFlightAdminConfigured()) {
    return Response.json(
      {
        error:
          "서버에 TESTFLIGHT_ADMIN_PASSWORD 환경변수가 설정되지 않아 관리자 로그인이 비활성화되어 있습니다.",
      },
      { status: 503 }
    );
  }

  const rawIp = getClientIp(request);
  const ipHash = await hashClientIp(rawIp);

  // Throttling check
  const throttleStatus = checkLoginThrottling(ipHash);
  if (!throttleStatus.allowed) {
    return Response.json(
      {
        error: `로그인 시도 횟수를 초과했습니다. 약 ${throttleStatus.remainingLockoutSeconds}초 후 다시 시도해 주세요.`,
      },
      { status: 429 }
    );
  }

  const userId = typeof body.userId === "string" ? body.userId.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";

  const isUserMatch = userId === ADMIN_USER_ID;
  const isPasswordMatch = await verifyAdminPassword(password);

  if (!isUserMatch || !isPasswordMatch) {
    recordFailedLoginAttempt(ipHash);
    return Response.json(
      { error: "관리자 아이디 또는 비밀번호가 올바르지 않습니다." },
      { status: 401 }
    );
  }

  // Successful login
  resetFailedLoginAttempts(ipHash);
  const token = await createAdminSessionToken(ADMIN_USER_ID);
  if (!token) {
    return Response.json({ error: "세션 토큰 생성에 실패했습니다." }, { status: 500 });
  }

  return new Response(
    JSON.stringify({ ok: true, userId: ADMIN_USER_ID, message: "로그인되었습니다." }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": createAdminCookieHeader(token),
        "Cache-Control": "no-store",
      },
    }
  );
}
