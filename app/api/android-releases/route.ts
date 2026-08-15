import { NextResponse } from "next/server";

const RELEASE_SOURCES = [
  { appName: "나스파인더", repo: "NasFinder-Android", planned: true },
  { appName: "한클립", repo: "HanClip-Android", planned: false },
  { appName: "에스텐드", repo: "S.tand-Android", planned: false },
] as const;

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

async function readLatestRelease(source: (typeof RELEASE_SOURCES)[number]) {
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
      downloadUrl: apk.browser_download_url,
    },
  };
}

export async function GET() {
  const checkedAt = new Date().toISOString();
  const settled = await Promise.allSettled(RELEASE_SOURCES.map(readLatestRelease));
  const releases = settled.map((result, index) => result.status === "fulfilled"
    ? { ...result.value, available: true as const }
    : {
        appName: RELEASE_SOURCES[index].appName,
        repo: RELEASE_SOURCES[index].repo,
        available: false as const,
        planned: RELEASE_SOURCES[index].planned,
      }
  );

  return NextResponse.json(
    { checkedAt, releases },
    { headers: { "Cache-Control": "public, max-age=300, s-maxage=1800, stale-while-revalidate=86400" } },
  );
}
