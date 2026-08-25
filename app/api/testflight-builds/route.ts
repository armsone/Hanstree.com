import { NextResponse } from "next/server";
import { testFlightBuilds, type TestFlightBuild } from "../../testflight";

const APP_STORE_CONNECT_API = "https://api.appstoreconnect.apple.com/v1";
const APP_SOURCES = [
  { slug: "nasfinder", appName: "나스파인더", bundleId: "com.armsone.nasfinder" },
  { slug: "hanclip", appName: "한클립", bundleId: "com.intosharp.hanclip" },
  { slug: "stand", appName: "S.tand", bundleId: "com.armsone.stand" },
  { slug: "htoms-brief", appName: "HtOMS 브리프", bundleId: "com.htoms.brief" },
  { slug: "starmanager", appName: "스타메니저", bundleId: "com.armsone.StarManager" },
] as const;

type AppStoreResource<T> = { id: string; attributes: T };
type AppStoreResponse<T> = { data: Array<AppStoreResource<T>> };

function base64Url(bytes: Uint8Array) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

function encodeJson(value: unknown) {
  return base64Url(new TextEncoder().encode(JSON.stringify(value)));
}

function decodePrivateKey(pem: string) {
  const body = pem
    .replace(/\\n/g, "\n")
    .replace(/-----BEGIN PRIVATE KEY-----|-----END PRIVATE KEY-----|\s/g, "");
  const binary = atob(body);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

async function createToken() {
  const issuerId = process.env.APP_STORE_CONNECT_ISSUER_ID;
  const keyId = process.env.APP_STORE_CONNECT_KEY_ID;
  const privateKey = process.env.APP_STORE_CONNECT_PRIVATE_KEY;
  if (!issuerId || !keyId || !privateKey) throw new Error("App Store Connect credentials are unavailable");

  const now = Math.floor(Date.now() / 1000);
  const header = encodeJson({ alg: "ES256", kid: keyId, typ: "JWT" });
  const payload = encodeJson({ iss: issuerId, iat: now, exp: now + 10 * 60, aud: "appstoreconnect-v1" });
  const signingInput = `${header}.${payload}`;
  const key = await crypto.subtle.importKey(
    "pkcs8",
    decodePrivateKey(privateKey),
    { name: "ECDSA", namedCurve: "P-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    { name: "ECDSA", hash: "SHA-256" },
    key,
    new TextEncoder().encode(signingInput),
  );
  return `${signingInput}.${base64Url(new Uint8Array(signature))}`;
}

async function appStoreRequest<T>(path: string, token: string) {
  const response = await fetch(`${APP_STORE_CONNECT_API}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error(`App Store Connect request failed: ${response.status}`);
  return response.json() as Promise<AppStoreResponse<T>>;
}

async function readLatestBuild(source: (typeof APP_SOURCES)[number], token: string): Promise<TestFlightBuild> {
  const fallback = testFlightBuilds.find((item) => item.slug === source.slug);
  const apps = await appStoreRequest<{ bundleId: string }>(
    `/apps?filter[bundleId]=${encodeURIComponent(source.bundleId)}&fields[apps]=bundleId&limit=1`,
    token,
  );
  const app = apps.data[0];
  if (!app || app.attributes.bundleId !== source.bundleId) throw new Error(`App not found: ${source.bundleId}`);

  const builds = await appStoreRequest<{
    version: string;
    uploadedDate: string;
    expirationDate?: string;
    expired?: boolean;
  }>(
    `/builds?filter[app]=${encodeURIComponent(app.id)}&fields[builds]=version,uploadedDate,expirationDate,expired&sort=-uploadedDate&limit=1`,
    token,
  );
  const build = builds.data[0];
  if (!build) throw new Error(`Build not found: ${source.bundleId}`);

  return {
    slug: source.slug,
    appName: source.appName,
    build: build.attributes.version,
    uploadedAt: build.attributes.uploadedDate,
    expiresAt: build.attributes.expirationDate ?? null,
    inviteUrl: fallback?.inviteUrl ?? null,
    publicBetaState: fallback?.publicBetaState ?? "needsExternalBuild",
  };
}

export async function GET() {
  const checkedAt = new Date().toISOString();
  try {
    const token = await createToken();
    const settled = await Promise.allSettled(APP_SOURCES.map((source) => readLatestBuild(source, token)));
    // slug 기준으로 병합해, 일부 앱만 조회에 성공해도 나머지는 검증된 정적 정보를 유지합니다.
    const liveBySlug = new Map<TestFlightBuild["slug"], TestFlightBuild>();
    for (const result of settled) {
      if (result.status === "fulfilled") liveBySlug.set(result.value.slug, result.value);
    }
    const builds = testFlightBuilds.map((fallback) => liveBySlug.get(fallback.slug) ?? fallback);
    return NextResponse.json(
      { checkedAt, builds, source: "app-store-connect" },
      { headers: { "Cache-Control": "public, max-age=300, s-maxage=900, stale-while-revalidate=3600" } },
    );
  } catch {
    return NextResponse.json(
      { checkedAt, builds: testFlightBuilds, source: "fallback" },
      { headers: { "Cache-Control": "public, max-age=60, s-maxage=300" } },
    );
  }
}
