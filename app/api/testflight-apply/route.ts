import {
  countRecentApplicationsByIpHash,
  createTestFlightApplication,
  findRecentDuplicateApplication,
} from "../../../db/testflight";
import { isTrustedSameSiteEvent } from "../../requestTraffic";
import { testFlightBuilds } from "../../testflight";
import { getClientIp, hashClientIp } from "../../testflight-auth";
import { isValidTesterName, normalizeTesterName, TESTER_NAME_MAX_LENGTH } from "../../testflight-shared";

export const dynamic = "force-dynamic";

const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

export async function POST(request: Request) {
  if (!isTrustedSameSiteEvent(request)) {
    return Response.json(
      { error: "허용되지 않은 요청입니다. 브라우저에서 직접 신청해 주세요." },
      { status: 403 }
    );
  }

  let body: {
    email?: unknown;
    lastName?: unknown;
    firstName?: unknown;
    appSlug?: unknown;
    device?: unknown;
    reason?: unknown;
    privacyConsent?: unknown;
    hp_website?: unknown;
  };

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "올바른 JSON 요청이 아닙니다." }, { status: 400 });
  }

  // Honeypot spam trap
  if (typeof body.hp_website === "string" && body.hp_website.trim().length > 0) {
    // Pretend success to deceive bots without writing to database
    return Response.json({
      ok: true,
      message: "신청이 정상적으로 접수되었습니다.",
    });
  }

  // Validate Privacy Consent
  if (body.privacyConsent !== true && body.privacyConsent !== "true") {
    return Response.json(
      { error: "개인정보 수집 및 이용에 동의해야 신청하실 수 있습니다." },
      { status: 400 }
    );
  }

  // Validate Email
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!email || email.length > 254 || !EMAIL_REGEX.test(email)) {
    return Response.json(
      { error: "App Store Connect 사용자 초대를 받을 유효한 이메일 주소를 입력해 주세요." },
      { status: 400 }
    );
  }

  // Validate Last / First name (App Store Connect 사용자 초대에 필수)
  const lastName = normalizeTesterName(body.lastName);
  if (!isValidTesterName(lastName)) {
    return Response.json(
      { error: `App Store Connect 사용자 초대에 사용할 성(Last name)을 ${TESTER_NAME_MAX_LENGTH}자 이내로 입력해 주세요.` },
      { status: 400 }
    );
  }

  const firstName = normalizeTesterName(body.firstName);
  if (!isValidTesterName(firstName)) {
    return Response.json(
      { error: `App Store Connect 사용자 초대에 사용할 이름(First name)을 ${TESTER_NAME_MAX_LENGTH}자 이내로 입력해 주세요.` },
      { status: 400 }
    );
  }

  // Validate Desired App against real inventory
  const appSlug = typeof body.appSlug === "string" ? body.appSlug.trim() : "";
  const matchedBuild = testFlightBuilds.find((item) => item.slug === appSlug);
  if (!matchedBuild) {
    return Response.json(
      { error: "선택하신 앱은 현재 TestFlight 신청 대상이 아닙니다." },
      { status: 400 }
    );
  }

  // Validate Device
  const device = typeof body.device === "string" ? body.device.trim() : "";
  if (!device || device.length < 2 || device.length > 100) {
    return Response.json(
      { error: "테스트에 사용할 기기 모델명을 입력해 주세요. (예: iPhone 16 Pro, iPad Air)" },
      { status: 400 }
    );
  }

  // Validate Participation Reason
  const reason = typeof body.reason === "string" ? body.reason.trim() : "";
  if (!reason || reason.length < 2 || reason.length > 500) {
    return Response.json(
      { error: "참여 동기를 500자 이내로 간단히 입력해 주세요." },
      { status: 400 }
    );
  }

  try {
    const rawIp = getClientIp(request);
    const ipHash = await hashClientIp(rawIp);

    // Abuse / Rate-limiting check: max 5 applications per hour per IP hash
    const recentCount = await countRecentApplicationsByIpHash(ipHash, 60);
    if (recentCount >= 5) {
      return Response.json(
        { error: "단시간에 너무 많은 신청이 접수되었습니다. 잠시 후 다시 시도해 주세요." },
        { status: 429 }
      );
    }

    // Duplicate check: prevent duplicate active applications for same email and app
    const duplicate = await findRecentDuplicateApplication(email, appSlug);
    if (duplicate) {
      return Response.json(
        { error: "이미 해당 앱의 TestFlight 참여 신청이 접수되어 있습니다." },
        { status: 409 }
      );
    }

    await createTestFlightApplication({
      email,
      lastName,
      firstName,
      appSlug,
      appName: matchedBuild.appName,
      device,
      reason,
      ipHash,
    });

    return Response.json({
      ok: true,
      message: `${matchedBuild.appName} 내부 테스터 사전 신청이 접수되었습니다. 신청이 선정을 보장하지는 않으며, 선정되면 입력하신 이메일로 App Store Connect 사용자 초대(해당 앱만 접근)와 TestFlight 안내가 전달됩니다.`,
    });
  } catch (error) {
    console.error("TestFlight application failed:", error);
    return Response.json(
      { error: "데이터베이스 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요." },
      { status: 503 }
    );
  }
}
