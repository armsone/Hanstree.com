import test from "node:test";
import assert from "node:assert/strict";
import {
  buildCodexInternalTesterRequest,
  formatSeoulDateTime,
  hasCompleteTesterName,
  isValidTesterName,
  missingTesterNameParts,
  normalizeTesterName,
  parseStoredTimestamp,
} from "../app/testflight-shared.ts";

// Helper functions mirroring the logic in app/testflight-auth.ts and app/api/testflight-apply/route.ts
const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

const INVENTORY_SLUGS = [
  "nasfinder",
  "hanclip",
  "stand",
  "htoms-brief",
  "starmanager",
  "button",
  "whattoeat",
];

const VALID_STATUSES = ["pending", "selected", "rejected", "invited"];

function validateApplicationInput(body) {
  if (typeof body.hp_website === "string" && body.hp_website.trim().length > 0) {
    return { ok: true, isHoneypot: true };
  }

  if (body.privacyConsent !== true && body.privacyConsent !== "true") {
    return { ok: false, error: "개인정보 수집 및 이용에 동의해야 신청하실 수 있습니다." };
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!email || email.length > 254 || !EMAIL_REGEX.test(email)) {
    return { ok: false, error: "유효한 이메일 주소를 입력해 주세요." };
  }

  const lastName = normalizeTesterName(body.lastName);
  if (!isValidTesterName(lastName)) {
    return { ok: false, error: "성(Last name)을 입력해 주세요." };
  }

  const firstName = normalizeTesterName(body.firstName);
  if (!isValidTesterName(firstName)) {
    return { ok: false, error: "이름(First name)을 입력해 주세요." };
  }

  const appSlug = typeof body.appSlug === "string" ? body.appSlug.trim() : "";
  if (!INVENTORY_SLUGS.includes(appSlug)) {
    return { ok: false, error: "선택하신 앱은 현재 TestFlight 신청 대상이 아닙니다." };
  }

  const device = typeof body.device === "string" ? body.device.trim() : "";
  if (!device || device.length < 2 || device.length > 100) {
    return { ok: false, error: "테스트에 사용할 기기 모델명을 입력해 주세요." };
  }

  const reason = typeof body.reason === "string" ? body.reason.trim() : "";
  if (!reason || reason.length < 2 || reason.length > 500) {
    return { ok: false, error: "참여 동기를 500자 이내로 간단히 입력해 주세요." };
  }

  return { ok: true, isHoneypot: false, data: { email, lastName, firstName, appSlug, device, reason } };
}

async function hashIp(ip, salt = "nasfinder-testflight-salt-2026") {
  const data = new TextEncoder().encode(`${salt}:${ip.trim()}`);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function constantTimeCompare(a, b) {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a[i] ^ b[i];
  }
  return mismatch === 0;
}

async function constantTimeStringCompare(a, b) {
  const encoder = new TextEncoder();
  const [hashA, hashB] = await Promise.all([
    crypto.subtle.digest("SHA-256", encoder.encode(a)),
    crypto.subtle.digest("SHA-256", encoder.encode(b)),
  ]);
  return constantTimeCompare(new Uint8Array(hashA), new Uint8Array(hashB));
}

async function createHmacToken(userId, secret, issuedAt, expiresAt) {
  const message = `${userId}:${issuedAt}:${expiresAt}`;
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));
  const hex = Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return `${userId}.${issuedAt}.${expiresAt}.${hex}`;
}

async function verifyHmacToken(token, expectedUserId, secret) {
  if (!token || !secret) return { valid: false };
  const parts = token.split(".");
  if (parts.length !== 4) return { valid: false };

  const [userId, issuedAtStr, expiresAtStr, signatureHex] = parts;
  if (userId !== expectedUserId) return { valid: false };

  const issuedAt = parseInt(issuedAtStr, 10);
  const expiresAt = parseInt(expiresAtStr, 10);
  if (Number.isNaN(issuedAt) || Number.isNaN(expiresAt)) return { valid: false };

  const now = Math.floor(Date.now() / 1000);
  if (now > expiresAt || issuedAt > now + 60) return { valid: false };

  const message = `${userId}:${issuedAt}:${expiresAt}`;
  const bytes = new Uint8Array(signatureHex.length / 2);
  for (let i = 0; i < signatureHex.length; i += 2) {
    bytes[i / 2] = parseInt(signatureHex.slice(i, i + 2), 16);
  }

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"]
  );

  const isValid = await crypto.subtle.verify(
    "HMAC",
    key,
    bytes,
    new TextEncoder().encode(message)
  );

  return { valid: isValid, userId: isValid ? userId : undefined };
}

test("Public TestFlight validation: valid submission passes", () => {
  const result = validateApplicationInput({
    email: "tester@example.com",
    lastName: "홍",
    firstName: "길동",
    appSlug: "nasfinder",
    device: "iPhone 16 Pro",
    reason: "Live Photo 양방향 변환 기능을 테스트하고 싶습니다.",
    privacyConsent: true,
  });

  assert.equal(result.ok, true);
  assert.equal(result.isHoneypot, false);
  assert.equal(result.data.email, "tester@example.com");
  assert.equal(result.data.lastName, "홍");
  assert.equal(result.data.firstName, "길동");
  assert.equal(result.data.appSlug, "nasfinder");
});

test("Public TestFlight validation: last and first name are both required", () => {
  const base = {
    email: "tester@example.com",
    appSlug: "nasfinder",
    device: "iPhone 16 Pro",
    reason: "테스트 참여 희망",
    privacyConsent: true,
  };

  assert.equal(validateApplicationInput({ ...base, firstName: "길동" }).ok, false);
  assert.equal(validateApplicationInput({ ...base, lastName: "홍" }).ok, false);
  assert.equal(validateApplicationInput({ ...base, lastName: "  ", firstName: "길동" }).ok, false);
  assert.equal(validateApplicationInput({ ...base, lastName: "홍", firstName: "tester@example.com" }).ok, false);
  assert.equal(validateApplicationInput({ ...base, lastName: "홍", firstName: "길동" }).ok, true);
});

test("Tester name normalization keeps compound names and rejects unsafe input", () => {
  assert.equal(normalizeTesterName("  Van   Der  "), "Van Der");
  assert.equal(isValidTesterName("Van Der"), true);
  assert.equal(isValidTesterName(""), false);
  assert.equal(isValidTesterName("a".repeat(51)), false);
  assert.equal(isValidTesterName("<script>"), false);
  assert.equal(isValidTesterName("line\nbreak"), false);
});

test("Public TestFlight validation: honeypot field is trapped silently", () => {
  const result = validateApplicationInput({
    email: "bot@spam.com",
    lastName: "Bot",
    firstName: "Spam",
    appSlug: "nasfinder",
    device: "iPhone",
    reason: "Spam",
    privacyConsent: true,
    hp_website: "https://spam.website.com",
  });

  assert.equal(result.ok, true);
  assert.equal(result.isHoneypot, true);
});

test("Public TestFlight validation: rejects invalid email, non-inventory app and missing consent", () => {
  assert.equal(
    validateApplicationInput({
      email: "invalid-email",
      lastName: "홍",
      firstName: "길동",
      appSlug: "nasfinder",
      device: "iPhone 16",
      reason: "Reason",
      privacyConsent: true,
    }).ok,
    false
  );

  assert.equal(
    validateApplicationInput({
      email: "tester@example.com",
      lastName: "홍",
      firstName: "길동",
      appSlug: "nonexistent-app",
      device: "iPhone 16",
      reason: "Reason",
      privacyConsent: true,
    }).ok,
    false
  );

  assert.equal(
    validateApplicationInput({
      email: "tester@example.com",
      lastName: "홍",
      firstName: "길동",
      appSlug: "nasfinder",
      device: "iPhone 16",
      reason: "Reason",
      privacyConsent: false,
    }).ok,
    false
  );
});

// 회귀 테스트: D1의 CURRENT_TIMESTAMP('YYYY-MM-DD HH:MM:SS', UTC)를 로컬 시각으로 잘못 해석해
// 관리자 화면에서 실제 제출 시각보다 9시간 이른 "오전 03:35"로 표시되던 문제.
test("Stored SQLite timestamps are parsed as UTC, not local time", () => {
  const parsed = parseStoredTimestamp("2026-08-25 03:35:12");
  assert.ok(parsed);
  assert.equal(parsed.toISOString(), "2026-08-25T03:35:12.000Z");

  const seoul = formatSeoulDateTime("2026-08-25 03:35:12");
  assert.match(seoul, /2026\. 08\. 25\./);
  assert.match(seoul, /12:35/);
  assert.doesNotMatch(seoul, /03:35/);

  // 'T' 구분자만 있고 시간대 표기가 없는 값도 UTC로 취급합니다.
  assert.equal(parseStoredTimestamp("2026-08-25T03:35:12")?.toISOString(), "2026-08-25T03:35:12.000Z");
  assert.equal(parseStoredTimestamp("2026-08-25 03:35:12.250")?.toISOString(), "2026-08-25T03:35:12.250Z");
});

test("Timestamps that already carry an offset are not shifted twice", () => {
  assert.equal(parseStoredTimestamp("2026-08-25T12:35:12+09:00")?.toISOString(), "2026-08-25T03:35:12.000Z");
  assert.equal(parseStoredTimestamp("2026-08-25T03:35:12Z")?.toISOString(), "2026-08-25T03:35:12.000Z");
  assert.match(formatSeoulDateTime("2026-08-25T12:35:12+09:00"), /12:35/);
  assert.equal(parseStoredTimestamp("not-a-date"), null);
  assert.equal(parseStoredTimestamp(""), null);
  assert.equal(formatSeoulDateTime("not-a-date"), "not-a-date");
});

test("Legacy rows without both names are incomplete and excluded from registration", () => {
  assert.equal(hasCompleteTesterName({ lastName: "홍", firstName: "길동" }), true);
  assert.equal(hasCompleteTesterName({ lastName: null, firstName: null }), false);
  assert.equal(hasCompleteTesterName({ lastName: "홍", firstName: "" }), false);
  assert.equal(hasCompleteTesterName({}), false);
  assert.deepEqual(missingTesterNameParts({ lastName: null, firstName: null }), ["성", "이름"]);
  assert.deepEqual(missingTesterNameParts({ lastName: "홍", firstName: " " }), ["이름"]);
});

test("Codex internal tester request groups complete pending applicants by app and lists incomplete ones as blocked", () => {
  const applicants = [
    { id: 1, email: "A@Example.com", lastName: "홍", firstName: "길동", appSlug: "nasfinder", appName: "나스파인더", status: "pending", device: "iPhone 16 Pro", reason: "비밀 동기" },
    { id: 2, email: "b@example.com", lastName: "Kim", firstName: "Min Jun", appSlug: "hanclip", appName: "한클립", status: "pending", device: "iPad Air", reason: "비밀 동기" },
    { id: 3, email: "c@example.com", lastName: "이", firstName: "영희", appSlug: "nasfinder", appName: "나스파인더", status: "pending", device: "iPhone 15", reason: "비밀 동기" },
    { id: 4, email: "legacy@example.com", lastName: null, firstName: null, appSlug: "stand", appName: "S.tand", status: "pending", device: "iPhone 14", reason: "비밀 동기" },
    { id: 5, email: "selected@example.com", lastName: "박", firstName: "철수", appSlug: "nasfinder", appName: "나스파인더", status: "selected", device: "iPhone 16", reason: "비밀 동기" },
  ];

  const summary = buildCodexInternalTesterRequest(applicants, { generatedAt: new Date("2026-08-25T04:00:00Z") });

  assert.equal(summary.readyCount, 3);
  assert.equal(summary.blockedCount, 1);
  assert.equal(summary.appCount, 2);

  const { text } = summary;
  assert.match(text, /생성 시각: 2026\. 08\. 25\. 오후 01:00 \(Asia\/Seoul\)/);
  assert.match(text, /== 앱: 나스파인더 \(nasfinder\) — 2명/);
  assert.match(text, /== 앱: 한클립 \(hanclip\) — 1명/);
  assert.match(text, /- 성: 홍 \/ 이름: 길동 \/ 이메일: a@example\.com/);
  assert.match(text, /- 성: Kim \/ 이름: Min Jun \/ 이메일: b@example\.com/);
  assert.match(text, /- 성: 이 \/ 이름: 영희 \/ 이메일: c@example\.com/);

  // Least-privilege App Store Connect user setup, duplicate avoidance, internal group and verification instructions.
  assert.match(text, /App Store Connect 사용자/);
  assert.match(text, /Marketing/);
  assert.match(text, /앱 하나만/);
  assert.match(text, /보고서\(Reports\) 접근 없음/);
  assert.match(text, /Certificates\/Identifiers\/Profiles 등 추가 리소스 접근 없음/);
  assert.match(text, /중복으로 만들지 말고/);
  assert.match(text, /내부\(Internal\) TestFlight 그룹/);
  assert.match(text, /내부 TestFlight 그룹 포함 여부를 확인/);

  // Incomplete applicants are listed separately and explicitly must not be registered yet.
  assert.match(text, /== 등록 보류 \(성 또는 이름 누락\) — 1명 ==/);
  assert.match(text, /아직 아무도 등록하지 말고/);
  assert.match(text, /개인정보는 이 요청문에 포함하지 않았습니다/);
  assert.doesNotMatch(text, /legacy@example\.com/);

  // Non-pending rows, device and motivation must never be included.
  assert.doesNotMatch(text, /selected@example\.com/);
  assert.doesNotMatch(text, /iPhone|iPad|비밀 동기/);
});

test("Codex internal tester request handles an empty pending list explicitly", () => {
  const summary = buildCodexInternalTesterRequest([], { generatedAt: new Date("2026-08-25T04:00:00Z") });
  assert.equal(summary.readyCount, 0);
  assert.equal(summary.blockedCount, 0);
  assert.equal(summary.appCount, 0);
  assert.match(summary.text, /== 등록 대상 없음 ==/);
  assert.match(summary.text, /아무도 등록하지 마세요/);
  assert.match(summary.text, /== 등록 보류 \(성 또는 이름 누락\) — 0명 ==\n없음\./);
});

test("Privacy & IP Hashing: raw IP is hashed and deterministic", async () => {
  const hash1 = await hashIp("203.0.113.195");
  const hash2 = await hashIp("203.0.113.195");
  const hashDifferent = await hashIp("198.51.100.42");

  assert.equal(hash1.length, 64);
  assert.equal(hash1, hash2);
  assert.notEqual(hash1, hashDifferent);
  assert.equal(hash1.includes("203.0.113.195"), false);
});

test("Constant-time comparison: handles matches and mismatches securely", async () => {
  const secret = "SuperSecretAdminPass2026!";
  const same = "SuperSecretAdminPass2026!";
  const wrong = "WrongPassword!";

  assert.equal(await constantTimeStringCompare(secret, same), true);
  assert.equal(await constantTimeStringCompare(secret, wrong), false);
});

test("Admin HMAC Session Token: issuance and verification", async () => {
  const secret = "test_admin_secret_key_12345";
  const now = Math.floor(Date.now() / 1000);
  const expiresAt = now + 3600;

  const token = await createHmacToken("armsone", secret, now, expiresAt);
  const verifyResult = await verifyHmacToken(token, "armsone", secret);

  assert.equal(verifyResult.valid, true);
  assert.equal(verifyResult.userId, "armsone");
});

test("Admin HMAC Session Token: rejects invalid user, wrong secret, or tampered signature", async () => {
  const secret = "test_admin_secret_key_12345";
  const now = Math.floor(Date.now() / 1000);
  const expiresAt = now + 3600;

  const token = await createHmacToken("armsone", secret, now, expiresAt);

  // Wrong user
  assert.equal((await verifyHmacToken(token, "otheruser", secret)).valid, false);

  // Wrong secret
  assert.equal((await verifyHmacToken(token, "armsone", "wrong_secret")).valid, false);

  // Tampered signature
  const tamperedToken = token.slice(0, -4) + "0000";
  assert.equal((await verifyHmacToken(tamperedToken, "armsone", secret)).valid, false);

  // Expired token
  const expiredToken = await createHmacToken("armsone", secret, now - 7200, now - 3600);
  assert.equal((await verifyHmacToken(expiredToken, "armsone", secret)).valid, false);
});

test("Admin Status Transitions: only valid statuses accepted", () => {
  assert.equal(VALID_STATUSES.includes("pending"), true);
  assert.equal(VALID_STATUSES.includes("selected"), true);
  assert.equal(VALID_STATUSES.includes("invited"), true);
  assert.equal(VALID_STATUSES.includes("rejected"), true);
  assert.equal(VALID_STATUSES.includes("approved"), false);
  assert.equal(VALID_STATUSES.includes("deleted"), false);
});
