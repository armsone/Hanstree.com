import type { ReactNode } from "react";
import Image from "./SiteImage";

export type AdvantageVariant =
  | "storage-network" | "play-remote" | "phone-drive" | "live-motion-swap"
  | "folder-pick" | "recursive-scan" | "vault-ready" | "resume-progress" | "progress-bar" | "mac-local"
  | "film-reel" | "music-timeline" | "target-swing" | "sliders" | "preview-export" | "archive-stack"
  | "keyboard-lock" | "timer-release" | "touch-zone" | "pointer-devices" | "shield-safe" | "lock-local"
  | "three-rings" | "clock-refresh" | "two-panels" | "json-local" | "recovery-wake" | "no-key"
  | "flip-clock" | "night-glow" | "timeline-dots" | "palette" | "music-grid" | "toggle-control"
  | "name-tag" | "search-bar" | "groups-grid" | "defaults-star" | "homepage-flag" | "devices-pair"
  | "sermon-mic" | "discovery-map" | "heart-share" | "shield-community" | "check-source" | "eye-browse"
  | "spark" | "layers" | "compass" | "bolt"
  | "photo-stack" | "denim-clues" | "rarity-gem" | "market-balance" | "profit-calculator" | "image-compress"
  | "temperature" | "golf" | "silent-film"
  | "download" | "settings" | "people" | "bell" | "camera" | "meal" | "chat" | "drive-eject"
  | "android-bot" | "web-globe" | "life-ring" | "doc-scroll" | "trash-clear" | "check-badge"
  | "region-capture" | "doc-swap" | "mail-letter" | "browser-image" | "menu-bar-mac";

const glow = <circle className="av-glow" cx="22" cy="22" r="19" />;

const glyphs: Partial<Record<AdvantageVariant, ReactNode>> = {
  "android-bot": <><path d="M13 20a9 9 0 0 1 18 0v10H13z" /><path d="M13 30v6M31 30v6M17 8l2 4M27 8l-2 4" /><circle cx="18" cy="19" r="1.6" fill="currentColor" stroke="none" /><circle cx="26" cy="19" r="1.6" fill="currentColor" stroke="none" /></>,
  "web-globe": <><circle cx="22" cy="22" r="15" /><path d="M7 22h30M22 7c4 4 6 9.5 6 15s-2 11-6 15c-4-4-6-9.5-6-15s2-11 6-15z" /></>,
  "region-capture": <><rect x="8" y="9" width="28" height="26" rx="2" strokeDasharray="4 3" /><path d="M14 19h16M14 25h11" /><circle cx="8" cy="9" r="1.6" fill="currentColor" stroke="none" /><circle cx="36" cy="9" r="1.6" fill="currentColor" stroke="none" /><circle cx="8" cy="35" r="1.6" fill="currentColor" stroke="none" /><circle cx="36" cy="35" r="1.6" fill="currentColor" stroke="none" /></>,
  "doc-swap": <><rect x="6" y="8" width="15" height="20" rx="1.5" /><path d="M10 13h7M10 17h7M10 21h4" /><rect x="23" y="16" width="15" height="20" rx="1.5" /><path d="M27 21h7M27 25h7M27 29h4" /><path d="M20 20l3-3-3-3M24 24l-3 3 3 3" /></>,
  "mail-letter": <><rect x="6" y="11" width="32" height="22" rx="2" /><path d="M7 13l15 12 15-12" /></>,
  "browser-image": <><rect x="6" y="9" width="32" height="26" rx="2" /><path d="M6 15h32" /><circle cx="10" cy="12" r="0.9" fill="currentColor" stroke="none" /><circle cx="13" cy="12" r="0.9" fill="currentColor" stroke="none" /><rect x="11" y="19" width="22" height="13" rx="1" /><circle cx="16" cy="24" r="2" /><path d="M11 32l6-6 4 4 6-7 6 9" /></>,
  "menu-bar-mac": <><rect x="6" y="9" width="32" height="5" rx="1.5" /><circle cx="11" cy="11.5" r="0.9" fill="currentColor" stroke="none" /><path d="M24 11.5h9" /><rect x="10" y="18" width="24" height="17" rx="2" /><path d="M16 26h12" /></>,
};


const iconImages: Partial<Record<AdvantageVariant, string>> = {
  "doc-scroll": "/apps/starmanager/features/feature-07.webp",
  "life-ring": "/icons/support-20260918.webp",
  "temperature": "/apps/super-thumbnail/features/feature-02.webp",
  "golf": "/icons/golf-20260918.webp",
  "silent-film": "/apps/hanclip/features/feature-03.webp",
  "download": "/apps/starmanager/features/feature-05.webp",
  "settings": "/apps/starmanager/features/feature-06.webp",
  "people": "/apps/button/features/feature-03.webp",
  "bell": "/apps/button/features/feature-01.webp",
  "camera": "/apps/hanai/features/feature-05.webp",
  "meal": "/apps/whattoeat/features/feature-02.webp",
  "chat": "/apps/starmanager/features/feature-02.webp",
  "drive-eject": "/apps/cleanusb/icon-v2.webp",
  "storage-network": "/apps/nasfinder/features/feature-01.webp",
  "play-remote": "/apps/nasfinder/features/feature-04.webp",
  "phone-drive": "/apps/nasfinder/features/feature-14.webp",
  "live-motion-swap": "/apps/nasfinder/features/feature-06.webp",
  "folder-pick": "/apps/super-thumbnail/features/feature-01.webp",
  "recursive-scan": "/apps/super-thumbnail/features/feature-03.webp",
  "vault-ready": "/apps/super-thumbnail/features/feature-04.webp",
  "resume-progress": "/apps/super-thumbnail/features/feature-08.webp",
  "progress-bar": "/apps/super-thumbnail/features/feature-10.webp",
  "mac-local": "/apps/super-thumbnail/features/feature-11.webp",
  "film-reel": "/apps/hanclip/features/feature-01.webp",
  "music-timeline": "/apps/stand/features/feature-06.webp",
  "target-swing": "/apps/aibi/features/feature-03.webp",
  "sliders": "/apps/hanclip/features/feature-04.webp",
  "preview-export": "/apps/hanclip/features/feature-06.webp",
  "archive-stack": "/apps/hanclip/features/feature-07.webp",
  "keyboard-lock": "/apps/trackpadguard/features/feature-01.webp",
  "timer-release": "/apps/trackpadguard/features/feature-02.webp",
  "touch-zone": "/apps/trackpadguard/features/feature-03.webp",
  "pointer-devices": "/apps/trackpadguard/features/feature-04.webp",
  "shield-safe": "/apps/trackpadguard/features/feature-05.webp",
  "lock-local": "/apps/trackpadguard/features/feature-07.webp",
  "three-rings": "/apps/ccmb/features/feature-01.webp",
  "clock-refresh": "/apps/ccmb/features/shared-clock.webp",
  "two-panels": "/apps/ccmb/features/feature-04.webp",
  "json-local": "/apps/nasfinder/features/feature-10.webp",
  "recovery-wake": "/apps/ccmb/features/feature-10.webp",
  "no-key": "/apps/aibi/features/feature-01.webp",
  "flip-clock": "/apps/ccmb/features/shared-clock.webp",
  "night-glow": "/apps/stand/features/feature-02.webp",
  "timeline-dots": "/apps/stand/features/feature-03.webp",
  "palette": "/apps/starmanager/features/feature-08.webp",
  "music-grid": "/apps/stand/features/feature-07.webp",
  "toggle-control": "/apps/starmanager/features/feature-06.webp",
  "name-tag": "/apps/intosharp/features/feature-01.webp",
  "search-bar": "/apps/intosharp/features/feature-02.webp",
  "groups-grid": "/apps/intosharp/features/feature-03.webp",
  "defaults-star": "/apps/nasfinder/features/feature-03.webp",
  "homepage-flag": "/apps/intosharp/features/feature-04.webp",
  "devices-pair": "/apps/nasfinder/features/feature-14.webp",
  "sermon-mic": "/apps/button/features/feature-02.webp",
  "discovery-map": "/apps/hanai/features/feature-04.webp",
  "heart-share": "/apps/airchurch/features/feature-03.webp",
  "shield-community": "/apps/airchurch/features/feature-04.webp",
  "check-source": "/apps/airchurch/features/feature-05.webp",
  "eye-browse": "/apps/super-thumbnail/features/feature-07.webp",
  "spark": "/apps/aibi/features/feature-03.webp",
  "layers": "/apps/nasfinder/features/feature-02.webp",
  "compass": "/apps/airchurch/features/feature-02.webp",
  "bolt": "/apps/aibi/features/feature-07.webp",
  "photo-stack": "/apps/aibi/features/feature-04.webp",
  "trash-clear": "/apps/btn/features/feature-09.webp",
  "check-badge": "/apps/btn/features/feature-08.webp",
  "denim-clues": "/apps/denimdex/features/manufacturing-clues.webp",
  "rarity-gem": "/apps/denimdex/features/rarity-evidence.webp",
  "market-balance": "/apps/denimdex/features/market-prices.webp",
  "profit-calculator": "/apps/denimdex/features/net-profit.webp",
  "image-compress": "/apps/denimdex/features/photo-compression.webp",
};

export function AdvantageVisual({ variant }: { variant: AdvantageVariant }) {
  const src = iconImages[variant];
  return (
    <span className={`advantage-visual${src ? " advantage-visual-image" : ""}`} aria-hidden="true">
      {src ? <Image src={src} alt="" width={88} height={88} loading="lazy" unoptimized /> : (
      <svg viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {glow}
        {glyphs[variant]}
      </svg>
      )}
    </span>
  );
}
