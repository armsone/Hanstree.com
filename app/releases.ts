// 홈페이지가 다운로드를 안내하는 GitHub Release 자산의 허용 목록입니다.
// /api/release-download는 이 목록에 있는 항목만 최신 정식 릴리스로 연결하며,
// key는 사이트 집계(site_counters)의 다운로드 키와 동일하게 사용합니다.
export const DOWNLOAD_KEYS = [
  "NasFinder-Android",
  "NasFinder-Mac",
  "NasFinder-Super-Thumbnail",
  "HanClip-Android",
  "S.tand-macOS",
  "S.tand-Android",
  "CCMB",
  "BTN",
  "TrackpadGuard",
  "WhattoEat",
  "WhattoEat-Android",
  "button-Android",
  "StarManager-Android",
  "HtOMS-BK",
] as const;

export type DownloadKey = (typeof DOWNLOAD_KEYS)[number];

export function sortDownloadKeysByCount(
  keys: readonly DownloadKey[],
  downloads?: Readonly<Record<string, number>>,
) {
  return keys
    .map((key, index) => ({ key, index, count: downloads?.[key] ?? 0 }))
    .sort((left, right) => right.count - left.count || left.index - right.index)
    .map(({ key }) => key);
}

export type ReleaseDownload = {
  label: string;
  repo: string;
  assetPattern: RegExp;
  // GitHub 조회가 실패했을 때만 사용하는, 마지막으로 확인된 공식 주소입니다.
  fallbackUrl: string;
};

export const RELEASE_DOWNLOADS: Record<DownloadKey, ReleaseDownload> = {
  "NasFinder-Android": {
    label: "NasFinder Android",
    repo: "NasFinder-Android",
    assetPattern: /\.apk$/i,
    fallbackUrl: "https://github.com/armsone/NasFinder-Android/releases/download/android-v2.2.1/NasFinder-Android-2.2.1.apk",
  },
  "NasFinder-Mac": {
    label: "NasFinder Mac",
    repo: "NasFinder",
    assetPattern: /^NasFinder-Mac-\d+\.\d+\.\d+-\d{12}\.dmg$/i,
    fallbackUrl: "https://github.com/armsone/NasFinder/releases/download/mac-v2.2.2/NasFinder-Mac-2.2.2-202608271227.dmg",
  },
  "NasFinder-Super-Thumbnail": {
    label: "Super Thumbnail",
    repo: "SuperThumbnail-MacOS",
    assetPattern: /^NasFinder-Super-Thumbnail-.*\.dmg$/i,
    fallbackUrl: "https://github.com/armsone/SuperThumbnail-MacOS/releases/download/v2.3.1/NasFinder-Super-Thumbnail-2.3.1.dmg",
  },
  "HanClip-Android": {
    label: "HanClip Android",
    repo: "HanClip-Android",
    assetPattern: /\.apk$/i,
    fallbackUrl: "https://github.com/armsone/HanClip-Android/releases/download/android-v2.2.1/HanClip-Android-2.2.1.apk",
  },
  "S.tand-macOS": {
    label: "S.tand Mac",
    repo: "S.tand",
    assetPattern: /^S\.tand-macOS-.*\.dmg$/i,
    fallbackUrl: "https://github.com/armsone/S.tand/releases/download/macos-v2.2.1/S.tand-macOS-2.2.1.dmg",
  },
  "S.tand-Android": {
    label: "S.tand Android",
    repo: "S.tand-Android",
    assetPattern: /\.apk$/i,
    fallbackUrl: "https://github.com/armsone/S.tand-Android/releases/download/android-v2.2.4/S.tand-Android-2.2.4.apk",
  },
  CCMB: {
    label: "CCMB Mac",
    repo: "CCMB",
    assetPattern: /\.dmg$/i,
    fallbackUrl: "https://github.com/armsone/CCMB/releases/download/v2.0.5/CCMB-2.0.5.dmg",
  },
  BTN: {
    label: "BTN Mac",
    repo: "BTN",
    assetPattern: /\.dmg$/i,
    fallbackUrl: "https://github.com/armsone/BTN/releases/download/v2.0.1/BTN-2.0.1.dmg",
  },
  TrackpadGuard: {
    label: "TrackpadGuard Mac",
    repo: "TrackpadGuard",
    assetPattern: /\.dmg$/i,
    fallbackUrl: "https://github.com/armsone/TrackpadGuard/releases/download/v2.0.1/TrackpadGuard-2.0.1.dmg",
  },
  WhattoEat: {
    label: "오늘 뭐 먹지?? Mac",
    repo: "WhattoEat",
    assetPattern: /^WhattoEat-Mac-.*\.dmg$/i,
    fallbackUrl: "https://github.com/armsone/WhattoEat/releases/download/v0.4.1/WhattoEat-Mac-0.4.1-202608252106.dmg",
  },
  "WhattoEat-Android": {
    label: "오늘 뭐 먹지?? Android",
    repo: "WhattoEat-Android",
    assetPattern: /^WhattoEat-(?:Android-)?\d+\.\d+\.\d+\.apk$/i,
    fallbackUrl: "https://github.com/armsone/WhattoEat-Android/releases/download/v0.4.2/WhattoEat-0.4.2.apk",
  },
  "button-Android": {
    label: "버튼 Android",
    repo: "button-Android",
    assetPattern: /\.apk$/i,
    fallbackUrl: "https://github.com/armsone/button-Android/releases/download/android-v2.0.1/Button-Android-2.0.1.apk",
  },
  "StarManager-Android": {
    label: "스타매니저 Android",
    repo: "StarManager-Android",
    assetPattern: /^StarManager-Android-2\.1\.0\.apk$/i,
    fallbackUrl: "https://github.com/armsone/StarManager-Android/releases/download/android-v2.1.0/StarManager-Android-2.1.0.apk",
  },
  "HtOMS-BK": {
    label: "HtOMS Brief Android",
    repo: "HtOMS-BK",
    assetPattern: /^HtOMS-Brief-Android-.*\.apk$/i,
    fallbackUrl: "https://github.com/armsone/HtOMS-BK/releases/download/android-v2.1.0/HtOMS-Brief-Android-2.1.0.apk",
  },
};

export function releaseDownloadPath(key: DownloadKey) {
  return `/api/release-download?app=${encodeURIComponent(key)}`;
}
