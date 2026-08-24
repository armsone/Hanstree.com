// 홈페이지가 다운로드를 안내하는 GitHub Release 자산의 허용 목록입니다.
// /api/release-download는 이 목록에 있는 항목만 최신 정식 릴리스로 연결하며,
// key는 사이트 집계(site_counters)의 다운로드 키와 동일하게 사용합니다.
export const DOWNLOAD_KEYS = [
  "NasFinder-Android",
  "NasFinder-Super-Thumbnail",
  "HanClip-Android",
  "S.tand-macOS",
  "S.tand-Android",
  "CCMB",
  "BTN",
  "TrackpadGuard",
  "button-Android",
  "StarManager-Android",
] as const;

export type DownloadKey = (typeof DOWNLOAD_KEYS)[number];

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
    fallbackUrl: "https://github.com/armsone/NasFinder-Android/releases/download/android-v337417/NasFinder-Android-v337417.apk",
  },
  "NasFinder-Super-Thumbnail": {
    label: "Super Thumbnail",
    repo: "NasFinder",
    assetPattern: /^NasFinder-Super-Thumbnail-.*\.dmg$/i,
    fallbackUrl: "https://github.com/armsone/NasFinder/releases/download/mac-super-thumbnail-v2.0.0/NasFinder-Super-Thumbnail-2.0.0.dmg",
  },
  "HanClip-Android": {
    label: "HanClip Android",
    repo: "HanClip-Android",
    assetPattern: /\.apk$/i,
    fallbackUrl: "https://github.com/armsone/HanClip-Android/releases/download/android-v337417/HanClip-Android-v337417.apk",
  },
  "S.tand-macOS": {
    label: "S.tand Mac",
    repo: "S.tand",
    assetPattern: /^S\.tand-macOS-.*\.dmg$/i,
    fallbackUrl: "https://github.com/armsone/S.tand/releases/download/macos-v2.0.0/S.tand-macOS-2.0.0.dmg",
  },
  "S.tand-Android": {
    label: "S.tand Android",
    repo: "S.tand-Android",
    assetPattern: /\.apk$/i,
    fallbackUrl: "https://github.com/armsone/S.tand-Android/releases/download/android-v337417/S.tand-Android-v337417.apk",
  },
  CCMB: {
    label: "CCMB Mac",
    repo: "CCMB",
    assetPattern: /\.dmg$/i,
    fallbackUrl: "https://github.com/armsone/CCMB/releases/download/v2.0.1/CCMB-2.0.1.dmg",
  },
  BTN: {
    label: "BTN Mac",
    repo: "BTN",
    assetPattern: /\.dmg$/i,
    fallbackUrl: "https://github.com/armsone/BTN/releases/download/v2.0.0/BTN-2.0.0.dmg",
  },
  TrackpadGuard: {
    label: "TrackpadGuard Mac",
    repo: "TrackpadGuard",
    assetPattern: /\.dmg$/i,
    fallbackUrl: "https://github.com/armsone/TrackpadGuard/releases/download/v2.0.0/TrackpadGuard-2.0.0.dmg",
  },
  "button-Android": {
    label: "버튼 Android",
    repo: "button-Android",
    assetPattern: /\.apk$/i,
    fallbackUrl: "https://github.com/armsone/button-Android/releases/download/v2.0.0/Button-Android-v2.0.0-build337417.apk",
  },
  "StarManager-Android": {
    label: "스타매니저 Android",
    repo: "StarManager-Android",
    assetPattern: /\.apk$/i,
    fallbackUrl: "https://github.com/armsone/StarManager-Android/releases/download/v2.0.0/StarManager-Android-v2.0.0.apk",
  },
};

export function releaseDownloadPath(key: DownloadKey) {
  return `/api/release-download?app=${encodeURIComponent(key)}`;
}
