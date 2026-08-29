import { RELEASE_DOWNLOADS, type DownloadKey } from "./releases.ts";

export const ANDROID_RELEASE_SOURCES = [
  { appName: "나스파인더", repo: "NasFinder-Android" },
  { appName: "한클립", repo: "HanClip-Android" },
  { appName: "S.tand", repo: "S.tand-Android" },
  { appName: "HtOMS 브리프", repo: "HtOMS-BK" },
  { appName: "버튼", repo: "button-Android" },
  { appName: "스타매니저", repo: "StarManager-Android" },
  { appName: "오늘 뭐 먹지?", repo: "WhattoEat-Android" },
  { appName: "데님덱스", repo: "DenimDex-Android" },
] as const satisfies readonly { appName: string; repo: DownloadKey }[];

export type AndroidReleaseSource = (typeof ANDROID_RELEASE_SOURCES)[number];

export type AndroidReleaseInfo = {
  appName: string;
  repo: DownloadKey;
  available: true;
  verificationSource: "github-live" | "verified-fallback";
  tagName: string;
  releaseName: string;
  publishedAt: string | null;
  releaseUrl: string;
  asset: {
    name: string;
    size: number;
    contentType: string;
    digest: string | null;
    downloadCount: number;
  };
};

export function verifiedFallbackRelease(source: AndroidReleaseSource): AndroidReleaseInfo {
  const config = RELEASE_DOWNLOADS[source.repo];
  const url = new URL(config.fallbackUrl);
  const parts = url.pathname.split("/").filter(Boolean);
  const [owner, repo, releases, download, tagName, assetName, ...extra] = parts;

  if (
    url.protocol !== "https:" ||
    url.hostname !== "github.com" ||
    owner !== "armsone" ||
    repo !== source.repo ||
    releases !== "releases" ||
    download !== "download" ||
    !tagName ||
    !assetName ||
    extra.length > 0 ||
    !config.assetPattern.test(assetName)
  ) {
    throw new Error(`Invalid verified fallback URL for ${source.repo}`);
  }

  const productVersion = tagName.match(/\d+\.\d+\.\d+/)?.[0];
  return {
    appName: source.appName,
    repo: source.repo,
    available: true,
    verificationSource: "verified-fallback",
    tagName,
    releaseName: productVersion ? `${config.label} ${productVersion}` : config.label,
    publishedAt: null,
    releaseUrl: `https://github.com/armsone/${source.repo}/releases/tag/${encodeURIComponent(tagName)}`,
    asset: {
      name: assetName,
      size: 0,
      contentType: "application/vnd.android.package-archive",
      digest: null,
      downloadCount: 0,
    },
  };
}

export function mergeVerifiedAndroidReleases(
  settled: readonly PromiseSettledResult<AndroidReleaseInfo>[],
) {
  return ANDROID_RELEASE_SOURCES.map((source, index) => {
    const result = settled[index];
    return result?.status === "fulfilled" ? result.value : verifiedFallbackRelease(source);
  });
}
