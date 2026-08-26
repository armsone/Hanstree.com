import { NextResponse } from "next/server";
import {
  ANDROID_RELEASE_SOURCES,
  mergeVerifiedAndroidReleases,
  type AndroidReleaseInfo,
  type AndroidReleaseSource,
} from "../../androidReleases";

type GitHubAsset = {
  name: string;
  state: string;
  size: number;
  content_type: string;
  browser_download_url: string;
  digest?: string | null;
  download_count: number;
};

type GitHubRelease = {
  tag_name: string;
  name: string | null;
  html_url: string;
  published_at: string | null;
  draft: boolean;
  prerelease: boolean;
  assets: GitHubAsset[];
};

async function readLatestRelease(source: AndroidReleaseSource): Promise<AndroidReleaseInfo> {
  const apiUrl = `https://api.github.com/repos/armsone/${encodeURIComponent(source.repo)}/releases/latest`;
  const response = await fetch(apiUrl, {
    headers: {
      Accept: "application/vnd.github+json",
      "User-Agent": "NasFinder.com-release-checker",
      "X-GitHub-Api-Version": "2026-03-10",
    },
  });

  if (!response.ok) throw new Error(`GitHub release lookup failed: ${response.status}`);
  const release = (await response.json()) as GitHubRelease;
  const releasePrefix = `https://github.com/armsone/${source.repo}/releases/tag/`;
  const assetPrefix = `https://github.com/armsone/${source.repo}/releases/download/`;

  if (release.draft || release.prerelease || !release.html_url.startsWith(releasePrefix)) {
    throw new Error("Unexpected GitHub release response");
  }

  const apk = release.assets.find((asset) =>
    asset.state === "uploaded" &&
    asset.size > 0 &&
    asset.name.toLowerCase().endsWith(".apk") &&
    asset.browser_download_url.startsWith(assetPrefix)
  );
  if (!apk) throw new Error("Release does not contain a verified APK asset");

  return {
    appName: source.appName,
    repo: source.repo,
    available: true,
    verificationSource: "github-live",
    tagName: release.tag_name,
    releaseName: release.name || release.tag_name,
    publishedAt: release.published_at,
    releaseUrl: release.html_url,
    asset: {
      name: apk.name,
      size: apk.size,
      contentType: apk.content_type,
      digest: apk.digest || null,
      downloadCount: apk.download_count,
    },
  };
}

export async function GET() {
  const checkedAt = new Date().toISOString();
  // GitHub의 익명 API가 병렬 요청을 간헐적으로 제한할 수 있어 순서대로 확인합니다.
  // 개별 조회가 실패해도 "APK 없음"으로 바꾸지 않고 마지막으로 검증된 공식 자산을 유지합니다.
  const settled: PromiseSettledResult<AndroidReleaseInfo>[] = [];
  for (const source of ANDROID_RELEASE_SOURCES) {
    try {
      settled.push({ status: "fulfilled", value: await readLatestRelease(source) });
    } catch (reason) {
      settled.push({ status: "rejected", reason });
    }
  }
  const releases = mergeVerifiedAndroidReleases(settled);
  const usedFallback = releases.some((release) => release.verificationSource === "verified-fallback");

  return NextResponse.json(
    { checkedAt, releases, source: usedFallback ? "verified-fallback" : "github-live" },
    { headers: { "Cache-Control": usedFallback
      ? "no-store"
      : "public, max-age=300, s-maxage=1800, stale-while-revalidate=3600" } },
  );
}
