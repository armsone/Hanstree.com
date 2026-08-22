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
    fallbackUrl: "https://github.com/armsone/NasFinder-Android/releases/download/android-v10/NasFinder-Android-v10.apk",
  },
  "NasFinder-Super-Thumbnail": {
    label: "Super Thumbnail",
    repo: "NasFinder",
    assetPattern: /^NasFinder-Super-Thumbnail-.*\.dmg$/i,
    fallbackUrl: "https://github.com/armsone/NasFinder/releases/download/mac-super-thumbnail-v1.0.0/NasFinder-Super-Thumbnail-1.0.0.dmg",
  },
  "HanClip-Android": {
    label: "HanClip Android",
    repo: "HanClip-Android",
    assetPattern: /\.apk$/i,
    fallbackUrl: "https://github.com/armsone/HanClip-Android/releases/download/android-v552/HanClip-Android-v552.apk",
  },
  "S.tand-macOS": {
    label: "S.tand Mac",
    repo: "S.tand",
    assetPattern: /^S\.tand-macOS-.*\.dmg$/i,
    fallbackUrl: "https://github.com/armsone/S.tand/releases/download/macos-v0.33.0/S.tand-macOS-0.33.0.dmg",
  },
  "S.tand-Android": {
    label: "S.tand Android",
    repo: "S.tand-Android",
    assetPattern: /\.apk$/i,
    fallbackUrl: "https://github.com/armsone/S.tand-Android/releases/download/android-v59/S.tand-Android-v59.apk",
  },
  CCMB: {
    label: "CCMB Mac",
    repo: "CCMB",
    assetPattern: /\.dmg$/i,
    fallbackUrl: "https://github.com/armsone/CCMB/releases/download/v0.4.5/CCMB-0.4.5.dmg",
  },
  BTN: {
    label: "BTN Mac",
    repo: "BTN",
    assetPattern: /\.dmg$/i,
    fallbackUrl: "https://github.com/armsone/BTN/releases/download/v1.2.2/BTN-1.2.2.dmg",
  },
  TrackpadGuard: {
    label: "TrackpadGuard Mac",
    repo: "TrackpadGuard",
    assetPattern: /\.dmg$/i,
    // DMG 자산 파일명은 릴리스 조회로 확인하므로, 실패 시에만 공식 릴리스 페이지로 안내합니다.
    fallbackUrl: "https://github.com/armsone/TrackpadGuard/releases/tag/v0.1.3",
  },
  "button-Android": {
    label: "버튼 Android",
    repo: "button-Android",
    assetPattern: /\.apk$/i,
    fallbackUrl: "https://github.com/armsone/button-Android/releases/download/v1.2.3/Button-Android-v1.2.3-build21.apk",
  },
  "StarManager-Android": {
    label: "스타매니저 Android",
    repo: "StarManager-Android",
    assetPattern: /\.apk$/i,
    fallbackUrl: "https://github.com/armsone/StarManager-Android/releases/download/v0.1.4/StarManager-Android-v0.1.4.apk",
  },
};

export function releaseDownloadPath(key: DownloadKey) {
  return `/api/release-download?app=${encodeURIComponent(key)}`;
}
