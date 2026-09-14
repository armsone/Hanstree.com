export type TestFlightBuild = {
  slug: "nasfinder" | "hanclip" | "stand" | "htoms-brief" | "starmanager" | "button" | "whattoeat" | "denimdex";
  appName: string;
  build: string | null;
  uploadedAt: string | null;
  expiresAt?: string | null;
  inviteUrl: string | null;
  inviteAvailable?: boolean;
  publicBetaState: "approved" | "waitingForReview" | "rejected" | "needsExternalBuild" | "needsReviewAccount" | "internalOnly";
};

// TestFlight 업로드가 확인되면 이 목록의 빌드 번호와 ISO 8601 시각만 갱신합니다.
// 확인되지 않은 날짜를 추정해서 입력하지 않습니다.
export const testFlightBuilds: TestFlightBuild[] = [
  { slug: "nasfinder", appName: "나스파인더", build: "202609051155", uploadedAt: "2026-09-04T20:11:54-07:00", expiresAt: "2026-12-03T19:11:54-08:00", inviteUrl: "https://testflight.apple.com/join/3m3bhwJz", publicBetaState: "approved" },
  { slug: "hanclip", appName: "한클립", build: "202609071316", uploadedAt: "2026-09-06T21:40:40-07:00", expiresAt: "2026-12-05T20:40:40-08:00", inviteUrl: "https://testflight.apple.com/join/m2YsgUJW", publicBetaState: "approved" },
  { slug: "stand", appName: "S.tand", build: "202609121751", uploadedAt: "2026-09-12T01:58:28-07:00", expiresAt: "2026-12-11T00:58:28-08:00", inviteAvailable: true, inviteUrl: "https://testflight.apple.com/join/mGUYTjdp", publicBetaState: "approved" },
  { slug: "htoms-brief", appName: "HtOMS 브리프", build: "202608291628", uploadedAt: "2026-08-29T16:37:14+09:00", inviteUrl: null, publicBetaState: "internalOnly" },
  { slug: "starmanager", appName: "Stargram", build: "202609101649", uploadedAt: "2026-09-10T04:33:35-07:00", expiresAt: "2026-12-09T03:33:35-08:00", inviteUrl: "https://testflight.apple.com/join/nzmW4WxW", inviteAvailable: true, publicBetaState: "approved" },
  { slug: "button", appName: "OurButton", build: "202609051204", uploadedAt: "2026-09-04T20:10:47-07:00", expiresAt: "2026-12-03T19:10:47-08:00", inviteUrl: "https://testflight.apple.com/join/RKcxgTkc", publicBetaState: "approved" },
  { slug: "whattoeat", appName: "오늘 뭐 먹지??", build: "202609132101", uploadedAt: "2026-09-13T05:09:41-07:00", expiresAt: "2026-12-12T04:09:41-08:00", inviteUrl: "https://testflight.apple.com/join/A444RsAc", inviteAvailable: true, publicBetaState: "waitingForReview" },
  { slug: "denimdex", appName: "데님덱스", build: "202609101658", uploadedAt: "2026-09-10T04:42:01-07:00", expiresAt: "2026-12-09T03:42:01-08:00", inviteUrl: "https://testflight.apple.com/join/5pBrz6ME", inviteAvailable: true, publicBetaState: "approved" },
];
