import { ANDROID_RELEASE_SOURCES } from "../../androidReleases";
import { readRelease } from "../../../db/releases";
import { snapshotDownloadPath } from "../../releaseInfo";
export const dynamic = "force-dynamic";
export async function GET() {
  const releases = [];
  for (const source of ANDROID_RELEASE_SOURCES) {
    try {
      const info = await readRelease(source.repo);
      releases.push({ appName: source.appName, repo: source.repo, available: true, verificationSource: info.source === "github" ? "github-live" : "verified-fallback", version: info.version, build: info.build, versionCode: info.versionCode, tagName: info.tagName, releaseName: info.version, publishedAt: info.publishedAt, checkedAt: info.checkedAt, releaseUrl: info.releaseUrl, downloadPath: snapshotDownloadPath(info), asset: info.asset });
    } catch {
      releases.push({ appName: source.appName, repo: source.repo, available: false });
    }
  }
  return Response.json({ checkedAt: new Date().toISOString(), releases, source: releases.some((release) => release.verificationSource === "verified-fallback") ? "verified-fallback" : "github-live" }, { headers: { "Cache-Control": "no-store" } });
}
