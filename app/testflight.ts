export type TestFlightBuild = {
  slug: "nasfinder" | "hanclip" | "stand" | "htoms-brief" | "starmanager" | "button" | "whattoeat" | "denimdex";
  appName: string;
  build: string | null;
  uploadedAt: string | null;
  expiresAt?: string | null;
  inviteUrl: string | null;
  inviteAvailable?: boolean;
  publicBetaState: "approved" | "waitingForReview" | "needsExternalBuild" | "needsReviewAccount" | "internalOnly";
};

// TestFlight 업로드가 확인되면 이 목록의 빌드 번호와 ISO 8601 시각만 갱신합니다.
// 확인되지 않은 날짜를 추정해서 입력하지 않습니다.
export const testFlightBuilds: TestFlightBuild[] = [
  { slug: "nasfinder", appName: "나스파인더", build: "202608271227", uploadedAt: "2026-08-27T12:43:56+09:00", expiresAt: "2026-11-25T12:43:56+09:00", inviteUrl: "https://testflight.apple.com/join/3m3bhwJz", publicBetaState: "approved" },
  { slug: "hanclip", appName: "한클립", build: "202608251900", uploadedAt: "2026-08-25T19:09:02+09:00", inviteUrl: "https://testflight.apple.com/join/m2YsgUJW", publicBetaState: "approved" },
  { slug: "stand", appName: "S.tand", build: "202608310934", uploadedAt: "2026-08-31T09:40:00+09:00", inviteUrl: "https://testflight.apple.com/join/mGUYTjdp", publicBetaState: "waitingForReview" },
  { slug: "htoms-brief", appName: "HtOMS 브리프", build: "202608291628", uploadedAt: "2026-08-29T16:37:14+09:00", inviteUrl: null, publicBetaState: "internalOnly" },
  { slug: "starmanager", appName: "Stargram", build: "202608292118", uploadedAt: "2026-08-29T21:37:47+09:00", expiresAt: "2026-11-27T21:37:47+09:00", inviteUrl: "https://testflight.apple.com/join/nzmW4WxW", publicBetaState: "approved" },
  { slug: "button", appName: "OurButton", build: "202608292118", uploadedAt: "2026-08-29T21:41:23+09:00", expiresAt: "2026-11-27T21:41:23+09:00", inviteUrl: "https://testflight.apple.com/join/RKcxgTkc", publicBetaState: "approved" },
  { slug: "whattoeat", appName: "오늘 뭐 먹지??", build: "202608271840", uploadedAt: "2026-08-27T19:01:32+09:00", inviteUrl: "https://testflight.apple.com/join/A444RsAc", publicBetaState: "approved" },
  { slug: "denimdex", appName: "데님덱스", build: "202608312019", uploadedAt: "2026-08-31T20:37:07+09:00", inviteUrl: null, inviteAvailable: false, publicBetaState: "internalOnly" },
];
