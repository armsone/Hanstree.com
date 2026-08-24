import type { ReactNode } from "react";

export type AdvantageVariant =
  | "storage-network" | "play-remote" | "phone-drive" | "live-motion-swap"
  | "folder-pick" | "recursive-scan" | "vault-ready" | "resume-progress" | "progress-bar" | "mac-local"
  | "film-reel" | "music-timeline" | "target-swing" | "sliders" | "preview-export" | "archive-stack"
  | "keyboard-lock" | "timer-release" | "touch-zone" | "pointer-devices" | "shield-safe" | "lock-local"
  | "three-rings" | "clock-refresh" | "two-panels" | "json-local" | "recovery-wake" | "no-key"
  | "flip-clock" | "night-glow" | "timeline-dots" | "palette" | "music-grid" | "toggle-control"
  | "name-tag" | "search-bar" | "groups-grid" | "defaults-star" | "homepage-flag" | "devices-pair"
  | "sermon-mic" | "discovery-map" | "heart-share" | "shield-community" | "check-source" | "eye-browse"
  | "spark" | "layers" | "compass" | "bolt";

const glow = <circle className="av-glow" cx="22" cy="22" r="19" />;

const glyphs: Record<AdvantageVariant, ReactNode> = {
  "storage-network": <><rect x="14" y="14" width="16" height="16" rx="4" /><circle cx="8" cy="8" r="3" /><circle cx="36" cy="8" r="3" /><circle cx="8" cy="36" r="3" /><circle cx="36" cy="36" r="3" /><path d="M11 11l5 5M33 11l-5 5M11 33l5-5M33 33l-5-5" /></>,
  "play-remote": <><rect x="7" y="11" width="30" height="22" rx="4" /><path d="M19 17l10 5-10 5z" fill="currentColor" stroke="none" /><path d="M30 9a10 10 0 0 1 6 6" /></>,
  "phone-drive": <><rect x="14" y="8" width="16" height="28" rx="4" /><path d="M17 17h10M17 22h7M17 27h9" /><path d="M15 6a12 12 0 0 1 14 0" /></>,
  "live-motion-swap": <><rect x="14" y="14" width="16" height="16" rx="3" /><circle cx="22" cy="22" r="3" /><path d="M10 14a13 13 0 0 1 12-9M34 30a13 13 0 0 1-12 9" /><path d="M10 14l1-5 5 1M34 30l-1 5-5-1" /></>,
  "folder-pick": <><path d="M6 14h9l3 4h20v18H6z" /><path d="M27 24l7 3-3 1.4L29 32z" fill="currentColor" stroke="none" /></>,
  "recursive-scan": <><path d="M6 12h9l3 3h18v16H6z" /><rect x="12" y="18" width="12" height="9" rx="1.5" /><circle cx="31" cy="30" r="5" /><path d="M35 34l4 4" /></>,
  "vault-ready": <><path d="M22 6l13 5v10c0 9-6 14-13 17-7-3-13-8-13-17V11z" /><path d="M16 22l4 4 9-9" /></>,
  "resume-progress": <><circle cx="22" cy="22" r="14" strokeDasharray="66 22" /><rect x="18" y="17" width="3" height="10" fill="currentColor" stroke="none" /><rect x="24" y="17" width="3" height="10" fill="currentColor" stroke="none" /></>,
  "progress-bar": <><rect x="6" y="19" width="30" height="10" rx="5" /><rect x="9" y="22" width="17" height="4" rx="2" fill="currentColor" stroke="none" /><circle cx="32" cy="10" r="6" /><path d="M32 7v3l2 2" /></>,
  "mac-local": <><path d="M12 12h20v16H12z" /><path d="M6 32h32l-3 4H9z" /><rect x="18" y="16" width="8" height="7" rx="1.5" /><path d="M22 16v-2M20 27v1M24 27v1" /></>,
  "film-reel": <><circle cx="22" cy="22" r="14" /><circle cx="22" cy="12" r="2.4" /><circle cx="31" cy="19" r="2.4" /><circle cx="27" cy="29" r="2.4" /><circle cx="17" cy="29" r="2.4" /><circle cx="13" cy="19" r="2.4" /><path d="M19 18l7 4-7 4z" fill="currentColor" stroke="none" /></>,
  "music-timeline": <><path d="M6 25h32" /><path d="M12 25v-6M17 25v-11M22 25v-3M27 25v-9M32 25v-4" /><circle cx="38" cy="25" r="2.6" fill="currentColor" stroke="none" /></>,
  "target-swing": <><circle cx="22" cy="22" r="14" /><circle cx="22" cy="22" r="8" /><circle cx="22" cy="22" r="2" fill="currentColor" stroke="none" /><path d="M8 12c8 4 8 20 0 24" strokeDasharray="2 4" /></>,
  "sliders": <><path d="M13 9v26M22 9v26M31 9v26" /><circle cx="13" cy="16" r="3.3" fill="currentColor" stroke="none" /><circle cx="22" cy="27" r="3.3" fill="currentColor" stroke="none" /><circle cx="31" cy="20" r="3.3" fill="currentColor" stroke="none" /></>,
  "preview-export": <><rect x="6" y="8" width="24" height="18" rx="3" /><path d="M17 17l4-4 4 4M21 13v9" /><path d="M27 30l9 9M30 39h6v-6" /></>,
  "archive-stack": <><rect x="8" y="20" width="22" height="12" rx="3" /><rect x="12" y="14" width="22" height="12" rx="3" /><rect x="16" y="8" width="22" height="12" rx="3" /></>,
  "keyboard-lock": <><rect x="6" y="10" width="9" height="8" rx="2" /><rect x="17" y="10" width="9" height="8" rx="2" /><rect x="28" y="10" width="9" height="8" rx="2" /><rect x="14" y="24" width="16" height="12" rx="3" /><path d="M17 24v-4a5 5 0 0 1 10 0v4" /></>,
  "timer-release": <><circle cx="20" cy="22" r="13" /><path d="M20 14v8l6 4" /><path d="M35 16a13 13 0 0 1 2 9" strokeDasharray="1.5 3.5" /><path d="M34 22l3 3 3-5" /></>,
  "touch-zone": <><rect x="6" y="10" width="32" height="24" rx="5" /><rect x="14" y="16" width="16" height="12" rx="2" strokeDasharray="3 3" /><circle cx="22" cy="22" r="3" fill="currentColor" stroke="none" /></>,
  "pointer-devices": <><rect x="8" y="9" width="12" height="19" rx="6" /><path d="M14 9v7" /><path d="M27 30l11-11" /><path d="M36 17l4 2-2 4z" fill="currentColor" stroke="none" /></>,
  "shield-safe": <><path d="M22 6l13 5v10c0 9-6 14-13 17-7-3-13-8-13-17V11z" /><rect x="17" y="19" width="10" height="7" rx="1.5" /><path d="M22 19v-3" /></>,
  "lock-local": <><rect x="14" y="20" width="16" height="14" rx="3" /><path d="M17 20v-4a5 5 0 0 1 10 0v4" /><path d="M34 12a7 7 0 0 1 0 12" strokeDasharray="1.5 3" /><path d="M31 9l9 9" /></>,
  "three-rings": <><circle cx="11" cy="22" r="7" strokeDasharray="30 14" /><circle cx="22" cy="22" r="7" strokeDasharray="24 20" /><circle cx="33" cy="22" r="7" strokeDasharray="18 26" /></>,
  "clock-refresh": <><circle cx="20" cy="22" r="12" /><path d="M20 15v7l5 3" /><path d="M31 15a13 13 0 0 1 3 12M9 29a13 13 0 0 1-3-12" /><path d="M34 12l1 5-5-1M6 32l-1-5 5 1" /></>,
  "two-panels": <><rect x="6" y="10" width="26" height="9" rx="3" /><rect x="15" y="24" width="23" height="12" rx="3" /></>,
  "json-local": <><path d="M14 8c-4 0-4 4-4 8s0 8-4 8c4 0 4 4 4 8s0 8 4 8" /><path d="M30 8c4 0 4 4 4 8s0 8 4 8c-4 0-4 4-4 8s0 8-4 8" /><circle cx="18" cy="22" r="1.6" fill="currentColor" stroke="none" /><circle cx="22" cy="22" r="1.6" fill="currentColor" stroke="none" /><circle cx="26" cy="22" r="1.6" fill="currentColor" stroke="none" /></>,
  "recovery-wake": <><path d="M27 8a13 13 0 1 0 9 20 11 11 0 0 1-9-20z" /><path d="M8 30l2-2M6 34h3M9 38l2-2" strokeDasharray="1.5 2.5" /></>,
  "no-key": <><circle cx="15" cy="22" r="7" /><path d="M21 22h15M31 22v5M35 22v5" /><path d="M8 8l30 30" /></>,
  "flip-clock": <><rect x="8" y="8" width="28" height="12" rx="3" /><rect x="8" y="24" width="28" height="12" rx="3" /><path d="M8 20h28" strokeWidth="3" /><path d="M15 13h4M25 13h4M15 29h4M25 29h4" /></>,
  "night-glow": <><path d="M28 8a13 13 0 1 0 8 19 11 11 0 0 1-8-19z" /><path d="M8 12l2 2M6 20h3M9 28l2-2" strokeDasharray="1.5 3" /></>,
  "timeline-dots": <><path d="M6 22h32" /><circle cx="12" cy="22" r="2.2" fill="currentColor" stroke="none" /><circle cx="22" cy="22" r="3.4" fill="currentColor" stroke="none" /><circle cx="32" cy="22" r="2.2" fill="currentColor" stroke="none" /></>,
  "palette": <><path d="M22 8a14 13 0 1 0 0 26c2 0 3-1 3-3s-1-2-1-4 2-3 4-3h4a6 6 0 0 0 6-6c0-6-7-10-16-10z" /><circle cx="15" cy="19" r="2" fill="currentColor" stroke="none" /><circle cx="22" cy="15" r="2" fill="currentColor" stroke="none" /><circle cx="29" cy="19" r="2" fill="currentColor" stroke="none" /></>,
  "music-grid": <><rect x="7" y="7" width="9" height="9" rx="2" /><rect x="18" y="7" width="9" height="9" rx="2" /><rect x="29" y="7" width="9" height="9" rx="2" /><rect x="7" y="18" width="9" height="9" rx="2" /><rect x="18" y="18" width="9" height="9" rx="2" /><rect x="29" y="18" width="9" height="9" rx="2" /><path d="M20.5 25v-6l4-1v6" /><circle cx="20" cy="25" r="1.6" fill="currentColor" stroke="none" /><circle cx="24" cy="24" r="1.6" fill="currentColor" stroke="none" /></>,
  "toggle-control": <><rect x="6" y="16" width="32" height="16" rx="8" /><circle cx="15" cy="24" r="5" fill="currentColor" stroke="none" /><path d="M15 12v3M15 33v3" strokeDasharray="1.5 2" /></>,
  "name-tag": <><path d="M8 22l8-9h20v18H16z" /><circle cx="14" cy="22" r="2" fill="currentColor" stroke="none" /><path d="M22 18h10M22 23h7" /></>,
  "search-bar": <><rect x="6" y="15" width="28" height="14" rx="7" /><circle cx="30" cy="22" r="4" /><path d="M33 25l4 4" /></>,
  "groups-grid": <><path d="M6 10h9l2 2h6v9H6z" /><path d="M23 10h9l2 2h6v9H23z" /><path d="M6 25h9l2 2h6v9H6z" /><path d="M23 25h9l2 2h6v9H23z" /></>,
  "defaults-star": <><path d="M22 6l4.5 9.3 10.2 1.5-7.4 7.2 1.8 10.2L22 29.3l-9.1 4.9 1.8-10.2-7.4-7.2 10.2-1.5z" /><circle cx="33" cy="33" r="6" /><path d="M33 30v3l2 2" /></>,
  "homepage-flag": <><rect x="6" y="8" width="32" height="26" rx="4" /><path d="M6 15h32" /><path d="M15 30v-8l7-5 7 5v8z" /></>,
  "devices-pair": <><rect x="6" y="9" width="20" height="14" rx="2" /><path d="M12 27h8" /><rect x="30" y="14" width="10" height="18" rx="3" /><path d="M27 18l2 2" strokeDasharray="1.5 2.5" /></>,
  "sermon-mic": <><rect x="18" y="6" width="8" height="16" rx="4" /><path d="M12 18a10 10 0 0 0 20 0" /><path d="M22 28v6M17 34h10" /><path d="M31 12c2 2 2 8 0 10M34 9c3 3 3 11 0 14" strokeDasharray="1.5 3" /></>,
  "discovery-map": <><path d="M22 8c6 0 10 4 10 10 0 8-10 18-10 18S12 26 12 18c0-6 4-10 10-10z" /><circle cx="22" cy="18" r="4" /><path d="M6 22a16 16 0 0 1 3-10M38 22a16 16 0 0 0-3-10" strokeDasharray="1.5 3" /></>,
  "heart-share": <><path d="M22 34S8 25 8 15a7 7 0 0 1 14-2 7 7 0 0 1 14 2c0 10-14 19-14 19z" /><path d="M30 8l4-4 4 4M34 4v10" /></>,
  "shield-community": <><path d="M22 6l13 5v10c0 9-6 14-13 17-7-3-13-8-13-17V11z" /><circle cx="19" cy="18" r="2.4" /><circle cx="26" cy="18" r="2.4" /><path d="M15 26c2-3 12-3 14 0" /></>,
  "check-source": <><rect x="10" y="6" width="20" height="26" rx="2" /><path d="M14 13h12M14 18h12M14 23h8" /><circle cx="32" cy="32" r="6" fill="currentColor" stroke="none" /><path d="M29 32l2 2 4-4" stroke="#111216" /></>,
  "eye-browse": <><path d="M6 22s6-11 16-11 16 11 16 11-6 11-16 11S6 22 6 22z" /><circle cx="22" cy="22" r="5" /></>,
  "spark": <><path d="M22 6l3 12 12 3-12 3-3 12-3-12-12-3 12-3z" /></>,
  "layers": <><path d="M9 22l13-6 13 6-13 6z" /><path d="M9 29l13 6 13-6" strokeDasharray="2 3" /><path d="M9 16l13-6 13 6-13 6z" /></>,
  "compass": <><circle cx="22" cy="22" r="14" /><path d="M27 15l-3 9-9 3 3-9z" fill="currentColor" stroke="none" /></>,
  "bolt": <><path d="M24 6L11 24h9l-3 14 15-20h-9z" /></>,
};

export function AdvantageVisual({ variant }: { variant: AdvantageVariant }) {
  return (
    <span className="advantage-visual" aria-hidden="true">
      <svg viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {glow}
        {glyphs[variant]}
      </svg>
    </span>
  );
}
