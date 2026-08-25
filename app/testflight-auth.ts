export const ADMIN_USER_ID = "armsone";
export const SESSION_COOKIE_NAME = "tf_admin_session";
export const SESSION_MAX_AGE_SECONDS = 8 * 60 * 60; // 8 hours

const IP_HASH_SALT = "nasfinder-testflight-salt-2026";
const MAX_LOGIN_ATTEMPTS = 5;
const LOGIN_LOCKOUT_MS = 10 * 60 * 1000; // 10 minutes

// In-memory record of failed login attempts for brute-force throttling
type FailedAttemptRecord = { count: number; lastAttempt: number };
const failedLoginAttempts = new Map<string, FailedAttemptRecord>();

export function isTestFlightAdminConfigured(): boolean {
  const secret = process.env.TESTFLIGHT_ADMIN_PASSWORD;
  return typeof secret === "string" && secret.trim().length > 0;
}

export function getClientIp(request: Request): string {
  const cfConnectingIp = request.headers.get("cf-connecting-ip");
  if (cfConnectingIp?.trim()) return cfConnectingIp.trim();

  const xRealIp = request.headers.get("x-real-ip");
  if (xRealIp?.trim()) return xRealIp.trim();

  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded?.trim()) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }

  return "127.0.0.1";
}

export async function hashClientIp(ip: string): Promise<string> {
  const data = new TextEncoder().encode(`${IP_HASH_SALT}:${ip.trim()}`);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return bufferToHex(new Uint8Array(hashBuffer));
}

function bufferToHex(buffer: Uint8Array): string {
  let hex = "";
  for (let i = 0; i < buffer.length; i++) {
    hex += buffer[i].toString(16).padStart(2, "0");
  }
  return hex;
}

function hexToBuffer(hex: string): Uint8Array | null {
  if (hex.length % 2 !== 0) return null;
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    const byte = parseInt(hex.slice(i, i + 2), 16);
    if (Number.isNaN(byte)) return null;
    bytes[i / 2] = byte;
  }
  return bytes;
}

export function constantTimeCompare(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a[i] ^ b[i];
  }
  return mismatch === 0;
}

export async function constantTimeStringCompare(a: string, b: string): Promise<boolean> {
  const encoder = new TextEncoder();
  const [hashA, hashB] = await Promise.all([
    crypto.subtle.digest("SHA-256", encoder.encode(a)),
    crypto.subtle.digest("SHA-256", encoder.encode(b)),
  ]);
  return constantTimeCompare(new Uint8Array(hashA), new Uint8Array(hashB));
}

export function checkLoginThrottling(ipHash: string): { allowed: boolean; remainingLockoutSeconds?: number } {
  const now = Date.now();
  const record = failedLoginAttempts.get(ipHash);
  if (!record) return { allowed: true };

  if (record.count >= MAX_LOGIN_ATTEMPTS) {
    const elapsed = now - record.lastAttempt;
    if (elapsed < LOGIN_LOCKOUT_MS) {
      const remainingSeconds = Math.ceil((LOGIN_LOCKOUT_MS - elapsed) / 1000);
      return { allowed: false, remainingLockoutSeconds: remainingSeconds };
    }
    // Lockout expired, reset
    failedLoginAttempts.delete(ipHash);
    return { allowed: true };
  }

  return { allowed: true };
}

export function recordFailedLoginAttempt(ipHash: string): void {
  const now = Date.now();
  const record = failedLoginAttempts.get(ipHash) || { count: 0, lastAttempt: now };
  record.count += 1;
  record.lastAttempt = now;
  failedLoginAttempts.set(ipHash, record);
}

export function resetFailedLoginAttempts(ipHash: string): void {
  failedLoginAttempts.delete(ipHash);
}

export async function verifyAdminPassword(passwordCandidate: string): Promise<boolean> {
  if (!isTestFlightAdminConfigured()) return false;
  const configuredPassword = process.env.TESTFLIGHT_ADMIN_PASSWORD!;
  return constantTimeStringCompare(passwordCandidate, configuredPassword);
}

async function getHmacKey(secret: string): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const secretKeyData = encoder.encode(secret);
  return crypto.subtle.importKey(
    "raw",
    secretKeyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

export async function createAdminSessionToken(
  userId = ADMIN_USER_ID,
  durationSeconds = SESSION_MAX_AGE_SECONDS
): Promise<string | null> {
  if (!isTestFlightAdminConfigured()) return null;
  const secret = process.env.TESTFLIGHT_ADMIN_PASSWORD!;

  const now = Math.floor(Date.now() / 1000);
  const expiresAt = now + durationSeconds;
  const message = `${userId}:${now}:${expiresAt}`;

  const key = await getHmacKey(secret);
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));
  const signatureHex = bufferToHex(new Uint8Array(signature));

  return `${userId}.${now}.${expiresAt}.${signatureHex}`;
}

export async function verifyAdminSessionToken(token: string | null | undefined): Promise<{
  valid: boolean;
  userId?: string;
}> {
  if (!token || !isTestFlightAdminConfigured()) return { valid: false };
  const secret = process.env.TESTFLIGHT_ADMIN_PASSWORD!;

  const parts = token.split(".");
  if (parts.length !== 4) return { valid: false };

  const [userId, issuedAtStr, expiresAtStr, signatureHex] = parts;
  if (userId !== ADMIN_USER_ID) return { valid: false };

  const issuedAt = parseInt(issuedAtStr, 10);
  const expiresAt = parseInt(expiresAtStr, 10);
  if (Number.isNaN(issuedAt) || Number.isNaN(expiresAt)) return { valid: false };

  const now = Math.floor(Date.now() / 1000);
  // Token must not be expired and must have been issued in the past (allowing 60s clock skew)
  if (now > expiresAt || issuedAt > now + 60) return { valid: false };

  const message = `${userId}:${issuedAt}:${expiresAt}`;
  const signatureBytes = hexToBuffer(signatureHex);
  if (!signatureBytes) return { valid: false };

  try {
    const key = await getHmacKey(secret);
    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      signatureBytes as BufferSource,
      new TextEncoder().encode(message)
    );
    return { valid: isValid, userId: isValid ? userId : undefined };
  } catch {
    return { valid: false };
  }
}

export function parseCookie(cookieHeader: string | null, name: string): string | null {
  if (!cookieHeader) return null;
  const cookies = cookieHeader.split(";");
  for (const cookie of cookies) {
    const [rawKey, ...rawValue] = cookie.trim().split("=");
    if (rawKey === name) {
      return decodeURIComponent(rawValue.join("="));
    }
  }
  return null;
}

export async function isRequestAuthenticated(request: Request): Promise<boolean> {
  const cookieHeader = request.headers.get("cookie");
  const token = parseCookie(cookieHeader, SESSION_COOKIE_NAME);
  if (!token) return false;

  const result = await verifyAdminSessionToken(token);
  return result.valid;
}

export function createAdminCookieHeader(token: string, maxAge = SESSION_MAX_AGE_SECONDS): string {
  return `${SESSION_COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${maxAge}`;
}

export function createClearAdminCookieHeader(): string {
  return `${SESSION_COOKIE_NAME}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}
