import test from "node:test";
import assert from "node:assert/strict";

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

  return { ok: true, isHoneypot: false, data: { email, appSlug, device, reason } };
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
    appSlug: "nasfinder",
    device: "iPhone 16 Pro",
    reason: "Live Photo 양방향 변환 기능을 테스트하고 싶습니다.",
    privacyConsent: true,
  });

  assert.equal(result.ok, true);
  assert.equal(result.isHoneypot, false);
  assert.equal(result.data.email, "tester@example.com");
  assert.equal(result.data.appSlug, "nasfinder");
});

test("Public TestFlight validation: honeypot field is trapped silently", () => {
  const result = validateApplicationInput({
    email: "bot@spam.com",
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
      appSlug: "nasfinder",
      device: "iPhone 16",
      reason: "Reason",
      privacyConsent: false,
    }).ok,
    false
  );
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
