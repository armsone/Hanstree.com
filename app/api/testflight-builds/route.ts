import { NextResponse } from "next/server";
import { testFlightBuilds, type TestFlightApprovedBuild, type TestFlightBuild } from "../../testflight";

const APP_STORE_CONNECT_API = "https://api.appstoreconnect.apple.com/v1";
const APP_SOURCES = [
  { slug: "nasfinder", appName: "나스파인더", bundleId: "com.armsone.nasfinder" },
  { slug: "hanclip", appName: "한클립", bundleId: "com.intosharp.hanclip" },
  { slug: "stand", appName: "S.tand", bundleId: "com.armsone.stand" },
  { slug: "starmanager", appName: "Stargram", bundleId: "com.armsone.StarManager" },
  { slug: "denimdex", appName: "데님덱스", bundleId: "com.armsone.DenimDex" },
  { slug: "button", appName: "OurButton", bundleId: "com.armsone.button" },
  { slug: "whattoeat", appName: "오늘 뭐 먹지??", bundleId: "com.nasfinder.WhattoEat" },
  { slug: "barobogi", appName: "바로보기", bundleId: "com.hanstree.barobogi" },
] as const;

type AppStoreRelation = { data?: { id: string } | null };
type AppStoreResource<T> = { id: string; attributes: T; relationships?: Record<string, AppStoreRelation | undefined> };
type AppStoreResponse<T> = {
  data: Array<AppStoreResource<T>>;
  included?: Array<{ id: string; type: string; attributes: { version?: string; externalBuildState?: string } }>;
};
type AppStoreSingleResponse<T> = { data: AppStoreResource<T> | null };

// 상태는 최신 빌드의 실제 심사 상태와 외부 빌드 상태에서만 정하며, 이전 정적 값으로 승인 상태를 물려받지 않습니다.
// 처리가 끝나지 않은(VALID가 아닌) 빌드는 승인으로 표시하지 않습니다.
function publicBetaStateFromBuild(
  reviewState: string | undefined,
  externalBuildState: string | undefined,
  processingState: string | undefined,
): TestFlightBuild["publicBetaState"] {
  const state = reviewState ?? externalBuildState;
  if (state === "WAITING_FOR_REVIEW" || state === "IN_REVIEW" || state === "WAITING_FOR_BETA_REVIEW" || state === "IN_BETA_REVIEW") return "waitingForReview";
  if (state === "REJECTED" || state === "BETA_REJECTED") return "rejected";
  if (processingState !== "VALID") return "needsExternalBuild";
  if (reviewState === "APPROVED" || (!reviewState && (externalBuildState === "BETA_APPROVED" || externalBuildState === "IN_BETA_TESTING"))) return "approved";
  return "needsExternalBuild";
}

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

async function readMarketingVersion(buildId: string, token: string) {
  // 버전 조회가 실패해도 기존 빌드·심사 상태 조회에는 영향이 없도록 따로 읽고, 실패하면 정적 표시를 유지합니다.
  try {
    const response = await fetch(`${APP_STORE_CONNECT_API}/builds/${encodeURIComponent(buildId)}/preReleaseVersion?fields[preReleaseVersions]=version`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) return null;
    const payload = await response.json() as AppStoreSingleResponse<{ version?: string }>;
    const version = payload.data?.attributes.version;
    return typeof version === "string" && /^\d+(?:\.\d+){1,3}$/.test(version) ? version : null;
  } catch {
    return null;
  }
}

// 최신 빌드가 심사 중이어도 공개 링크로 지금 설치할 수 있는 빌드는 따로 찾습니다. 읽기 전용 조회만 사용합니다.
// 기존 Public Beta 그룹(정적 목록의 공개 링크와 일치) 소속의, 처리 완료·만료 전·외부 승인(BETA_APPROVED/IN_BETA_TESTING) 최신 빌드만 인정합니다.
// 조회가 실패하거나 확인되지 않으면 null이며, 이는 링크 폐쇄를 뜻하지 않고 화면에서 버전만 표시하지 않습니다.
async function readApprovedBuild(appId: string, inviteUrl: string | null, token: string): Promise<TestFlightApprovedBuild | null> {
  if (!inviteUrl) return null;
  try {
    const groups = await appStoreRequest<{ publicLink?: string | null; publicLinkEnabled?: boolean; isInternalGroup?: boolean }>(
      `/apps/${encodeURIComponent(appId)}/betaGroups?fields[betaGroups]=publicLink,publicLinkEnabled,isInternalGroup&limit=50`,
      token,
    );
    const group = groups.data.find((item) => !item.attributes.isInternalGroup && item.attributes.publicLinkEnabled !== false && item.attributes.publicLink === inviteUrl);
    if (!group) return null;
    const builds = await appStoreRequest<{
      version: string;
      uploadedDate: string;
      expirationDate?: string;
      expired?: boolean;
      processingState?: string;
    }>(
      `/builds?filter[app]=${encodeURIComponent(appId)}&filter[betaGroups]=${encodeURIComponent(group.id)}&include=preReleaseVersion,buildBetaDetail`
        + "&fields[builds]=version,uploadedDate,expirationDate,expired,processingState,preReleaseVersion,buildBetaDetail&fields[preReleaseVersions]=version&fields[buildBetaDetails]=externalBuildState&sort=-uploadedDate&limit=10",
      token,
    );
    for (const build of builds.data) {
      const { expired, expirationDate, processingState } = build.attributes;
      if (processingState !== "VALID" || expired || (expirationDate && new Date(expirationDate).getTime() <= Date.now())) continue;
      const detailId = build.relationships?.buildBetaDetail?.data?.id ?? build.id;
      const detail = builds.included?.find((item) => item.type === "buildBetaDetails" && item.id === detailId);
      if (detail?.attributes.externalBuildState !== "BETA_APPROVED" && detail?.attributes.externalBuildState !== "IN_BETA_TESTING") continue;
      const versionId = build.relationships?.preReleaseVersion?.data?.id;
      const version = builds.included?.find((item) => item.type === "preReleaseVersions" && item.id === versionId)?.attributes.version;
      return {
        build: build.attributes.version,
        marketingVersion: typeof version === "string" && /^\d+(?:\.\d+){1,3}$/.test(version) ? version : null,
        uploadedAt: build.attributes.uploadedDate,
        expiresAt: build.attributes.expirationDate ?? null,
      };
    }
    return null;
  } catch {
    return null;
  }
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
    processingState?: string;
  }>(
    `/builds?filter[app]=${encodeURIComponent(app.id)}&include=buildBetaDetail&fields[builds]=version,uploadedDate,expirationDate,expired,processingState,buildBetaDetail&fields[buildBetaDetails]=externalBuildState&sort=-uploadedDate&limit=1`,
    token,
  );
  const build = builds.data[0];
  if (!build) throw new Error(`Build not found: ${source.bundleId}`);
  const submissions = await appStoreRequest<{ betaReviewState: string }>(
    `/betaAppReviewSubmissions?filter[build]=${encodeURIComponent(build.id)}&limit=10`,
    token,
  );
  const reviewState = submissions.data[0]?.attributes.betaReviewState;
  const marketingVersion = await readMarketingVersion(build.id, token);
  const detailId = build.relationships?.buildBetaDetail?.data?.id ?? build.id;
  const externalBuildState = builds.included?.find((item) => item.type === "buildBetaDetails" && item.id === detailId)?.attributes.externalBuildState;
  const publicBetaState = publicBetaStateFromBuild(reviewState, externalBuildState, build.attributes.processingState);
  const newestExpired = Boolean(build.attributes.expired) || Boolean(build.attributes.expirationDate && new Date(build.attributes.expirationDate).getTime() <= Date.now());
  // 최신 빌드가 승인됐으면 그 빌드가 설치 가능한 빌드이고, 아니면 공개 그룹에서 승인된 이전 빌드를 찾습니다.
  const approvedBuild: TestFlightApprovedBuild | null = publicBetaState === "approved"
    ? newestExpired ? null : { build: build.attributes.version, marketingVersion, uploadedAt: build.attributes.uploadedDate, expiresAt: build.attributes.expirationDate ?? null }
    : await readApprovedBuild(app.id, fallback?.inviteUrl ?? null, token);

  return {
    slug: source.slug,
    appName: source.appName,
    build: build.attributes.version,
    marketingVersion,
    uploadedAt: build.attributes.uploadedDate,
    expiresAt: build.attributes.expirationDate ?? null,
    inviteUrl: fallback?.inviteUrl ?? null,
    inviteAvailable: fallback?.inviteAvailable,
    publicBetaState,
    approvedBuild,
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
