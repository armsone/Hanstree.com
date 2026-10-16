export type TestFlightBuild = {
  slug: "ccmb" | "nasfinder" | "hanclip" | "stand" | "starmanager" | "button" | "whattoeat" | "denimdex" | "barobogi";
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
  { slug: "ccmb", appName: "CCMB", build: "202610162108", uploadedAt: "2026-10-16T05:11:54-07:00", expiresAt: "2027-01-14T04:11:54-08:00", inviteUrl: "https://testflight.apple.com/join/q9jesHZa", inviteAvailable: true, publicBetaState: "waitingForReview" },
  { slug: "nasfinder", appName: "나스파인더", build: "202610141226", uploadedAt: "2026-10-13T20:39:32-07:00", expiresAt: "2027-01-11T19:39:32-08:00", inviteUrl: "https://testflight.apple.com/join/3m3bhwJz", inviteAvailable: true, publicBetaState: "waitingForReview" },
  { slug: "hanclip", appName: "한클립", build: "202610141351", uploadedAt: "2026-10-13T22:45:47-07:00", expiresAt: "2027-01-11T21:45:47-08:00", inviteUrl: "https://testflight.apple.com/join/m2YsgUJW", inviteAvailable: true, publicBetaState: "waitingForReview" },
  { slug: "stand", appName: "S.tand", build: "202610081804", uploadedAt: "2026-10-08T02:11:04-07:00", expiresAt: "2027-01-06T01:11:04-08:00", inviteAvailable: true, inviteUrl: "https://testflight.apple.com/join/mGUYTjdp", publicBetaState: "approved" },
  { slug: "starmanager", appName: "Stargram", build: "202610030015", uploadedAt: "2026-10-03T00:50:00+09:00", expiresAt: "2027-01-01T00:50:00+09:00", inviteUrl: "https://testflight.apple.com/join/nzmW4WxW", inviteAvailable: true, publicBetaState: "approved" },
  { slug: "button", appName: "OurButton", build: "202610141355", uploadedAt: "2026-10-14T01:33:36-07:00", expiresAt: "2027-01-12T00:33:36-08:00", inviteUrl: "https://testflight.apple.com/join/RKcxgTkc", inviteAvailable: true, publicBetaState: "waitingForReview" },
  { slug: "whattoeat", appName: "오늘 뭐 먹지??", build: "202610061956", uploadedAt: "2026-10-06T04:06:40-07:00", expiresAt: "2027-01-04T03:06:40-08:00", inviteUrl: "https://testflight.apple.com/join/A444RsAc", inviteAvailable: true, publicBetaState: "approved" },
  { slug: "denimdex", appName: "데님덱스", build: "202610030015", uploadedAt: "2026-10-02T08:59:00-07:00", expiresAt: "2026-12-31T07:59:00-08:00", inviteUrl: "https://testflight.apple.com/join/5pBrz6ME", inviteAvailable: true, publicBetaState: "approved" },
  { slug: "barobogi", appName: "바로보기", build: "43", uploadedAt: "2026-10-12T05:55:10-07:00", expiresAt: "2027-01-10T04:55:10-08:00", inviteUrl: "https://testflight.apple.com/join/98v2mG4q", inviteAvailable: true, publicBetaState: "approved" },
];
