import assert from "node:assert/strict";
import test from "node:test";

import {
  ANDROID_RELEASE_SOURCES,
  mergeVerifiedAndroidReleases,
  verifiedFallbackRelease,
} from "../app/androidReleases.ts";

test("keeps every verified Android APK visible when every live lookup fails", () => {
  const failures = ANDROID_RELEASE_SOURCES.map(() => ({
    status: "rejected",
    reason: new Error("temporary GitHub failure"),
  }));
  const releases = mergeVerifiedAndroidReleases(failures);

  assert.equal(releases.length, ANDROID_RELEASE_SOURCES.length);
  assert.ok(releases.every((release) => release.available));
  assert.ok(releases.every((release) => release.verificationSource === "verified-fallback"));
  assert.ok(releases.every((release) => release.asset.name.endsWith(".apk")));
  assert.ok(releases.every((release) => release.releaseUrl.startsWith("https://github.com/armsone/")));
});

test("preserves successful live records while filling only failed lookups", () => {
  const live = {
    ...verifiedFallbackRelease(ANDROID_RELEASE_SOURCES[0]),
    verificationSource: "github-live",
    publishedAt: "2026-08-25T12:12:52Z",
  };
  const results = ANDROID_RELEASE_SOURCES.map((_, index) => index === 0
    ? { status: "fulfilled", value: live }
    : { status: "rejected", reason: new Error("temporary GitHub failure") });
  const releases = mergeVerifiedAndroidReleases(results);

  assert.equal(releases[0], live);
  assert.equal(releases[0].verificationSource, "github-live");
  assert.ok(releases.slice(1).every((release) => release.verificationSource === "verified-fallback"));
});
