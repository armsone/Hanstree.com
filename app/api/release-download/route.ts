import { DOWNLOAD_KEYS, RELEASE_DOWNLOADS, type DownloadKey } from "../../releases";
import { isTrustedDownloadNavigation } from "../../requestTraffic";

export const dynamic = "force-dynamic";

type GitHubAsset = {
  name: string;
  state: string;
  size: number;
  browser_download_url: string;
};

type GitHubRelease = {
  draft: boolean;
  prerelease: boolean;
  assets: GitHubAsset[];
};

function findVerifiedAsset(release: GitHubRelease, assetPattern: RegExp, assetPrefix: string) {
  if (release.draft || release.prerelease) return null;
  return release.assets.find((asset) =>
    asset.state === "uploaded" &&
    asset.size > 0 &&
    assetPattern.test(asset.name) &&
    asset.browser_download_url.startsWith(assetPrefix)
  ) ?? null;
}

async function githubJson<T>(path: string): Promise<T> {
  const response = await fetch(`https://api.github.com${path}`, {
    headers: {
      Accept: "application/vnd.github+json",
      "User-Agent": "NasFinder.com-release-checker",
      "X-GitHub-Api-Version": "2026-03-10",
    },
  });
  if (!response.ok) throw new Error(`GitHub release lookup failed: ${response.status}`);
  return response.json() as Promise<T>;
}

async function resolveLatestAssetUrl(key: DownloadKey) {
  const { repo, assetPattern } = RELEASE_DOWNLOADS[key];
  const assetPrefix = `https://github.com/armsone/${repo}/releases/download/`;
  const latest = await githubJson<GitHubRelease>(`/repos/armsone/${encodeURIComponent(repo)}/releases/latest`);
  const latestAsset = findVerifiedAsset(latest, assetPattern, assetPrefix);
  if (latestAsset) return latestAsset.browser_download_url;

  // 한 저장소에 여러 제품 릴리스가 섞여 있으면 최신 목록에서 기대한 자산을 찾습니다.
  const releases = await githubJson<GitHubRelease[]>(`/repos/armsone/${encodeURIComponent(repo)}/releases?per_page=15`);
  for (const release of releases) {
    const asset = findVerifiedAsset(release, assetPattern, assetPrefix);
    if (asset) return asset.browser_download_url;
  }
  throw new Error(`No verified asset for ${key}`);
}

export async function GET(request: Request) {
  const requested = new URL(request.url).searchParams.get("app");
  const normalizedRequest = requested === "StarManager-Android" ? "iManager-Android" : requested;
  const key = DOWNLOAD_KEYS.find((candidate) => candidate === normalizedRequest);
  if (!key) return Response.json({ error: "지원하지 않는 다운로드 항목입니다." }, { status: 404 });

  // 라우터 prefetch·RSC 조회는 실제 다운로드가 아니므로 집계와 GitHub 조회 없이 응답합니다.
  const routerFetch = request.headers.has("rsc") ||
    request.headers.has("next-router-prefetch") ||
    /prefetch/i.test(request.headers.get("purpose") || request.headers.get("sec-purpose") || "");
  if (routerFetch) {
    return Response.json({ download: RELEASE_DOWNLOADS[key].fallbackUrl }, { headers: { "Cache-Control": "no-store" } });
  }

  if (!isTrustedDownloadNavigation(request)) {
    return Response.json(
      { error: "홈페이지의 다운로드 버튼을 직접 눌러 주세요." },
      { status: 403, headers: { "Cache-Control": "no-store" } },
    );
  }

  try {
    const { countDownload } = await import("../../../db/siteStats");
    await countDownload(key);
  } catch { /* 집계 실패가 다운로드를 막지 않습니다 */ }

  let target = RELEASE_DOWNLOADS[key].fallbackUrl;
  try {
    target = await resolveLatestAssetUrl(key);
  } catch { /* 조회 실패 시 마지막으로 확인된 공식 주소로 안내합니다 */ }

  return new Response(null, { status: 302, headers: { Location: target, "Cache-Control": "no-store" } });
}
