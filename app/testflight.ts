export type TestFlightBuild = {
  slug: "ccmb" | "nasfinder" | "hanclip" | "stand" | "starmanager" | "button" | "whattoeat" | "denimdex";
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
  { slug: "ccmb", appName: "CCMB", build: "202610011722", uploadedAt: "2026-10-01T01:35:13-07:00", expiresAt: "2026-12-30T00:35:13-08:00", inviteUrl: "https://testflight.apple.com/join/q9jesHZa", inviteAvailable: true, publicBetaState: "waitingForReview" },
  { slug: "nasfinder", appName: "나스파인더", build: "202609051155", uploadedAt: "2026-09-04T20:11:54-07:00", expiresAt: "2026-12-03T19:11:54-08:00", inviteUrl: "https://testflight.apple.com/join/3m3bhwJz", publicBetaState: "approved" },
  { slug: "hanclip", appName: "한클립", build: "202609071316", uploadedAt: "2026-09-06T21:40:40-07:00", expiresAt: "2026-12-05T20:40:40-08:00", inviteUrl: "https://testflight.apple.com/join/m2YsgUJW", publicBetaState: "approved" },
  { slug: "stand", appName: "S.tand", build: "202610031012", uploadedAt: "2026-10-03T10:22:16+09:00", expiresAt: "2026-12-31T17:22:16-08:00", inviteAvailable: true, inviteUrl: "https://testflight.apple.com/join/mGUYTjdp", publicBetaState: "waitingForReview" },
  { slug: "starmanager", appName: "Stargram", build: "202610030015", uploadedAt: "2026-10-03T00:50:00+09:00", expiresAt: "2027-01-01T00:50:00+09:00", inviteUrl: "https://testflight.apple.com/join/nzmW4WxW", inviteAvailable: true, publicBetaState: "approved" },
  { slug: "button", appName: "OurButton", build: "202609051204", uploadedAt: "2026-09-04T20:10:47-07:00", expiresAt: "2026-12-03T19:10:47-08:00", inviteUrl: "https://testflight.apple.com/join/RKcxgTkc", publicBetaState: "approved" },
  { slug: "whattoeat", appName: "오늘 뭐 먹지??", build: "202609132101", uploadedAt: "2026-09-13T05:09:41-07:00", expiresAt: "2026-12-12T04:09:41-08:00", inviteUrl: "https://testflight.apple.com/join/A444RsAc", inviteAvailable: true, publicBetaState: "approved" },
  { slug: "denimdex", appName: "데님덱스", build: "202610030015", uploadedAt: "2026-10-02T08:59:00-07:00", expiresAt: "2026-12-31T07:59:00-08:00", inviteUrl: "https://testflight.apple.com/join/5pBrz6ME", inviteAvailable: true, publicBetaState: "approved" },
];
