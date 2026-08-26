export type TestFlightBuild = {
  slug: "nasfinder" | "hanclip" | "stand" | "htoms-brief" | "starmanager" | "button" | "whattoeat";
  appName: string;
  build: string | null;
  uploadedAt: string | null;
  expiresAt?: string | null;
  inviteUrl: string | null;
  publicBetaState: "approved" | "waitingForReview" | "needsExternalBuild" | "needsReviewAccount" | "internalOnly";
};

// TestFlight 업로드가 확인되면 이 목록의 빌드 번호와 ISO 8601 시각만 갱신합니다.
// 확인되지 않은 날짜를 추정해서 입력하지 않습니다.
export const testFlightBuilds: TestFlightBuild[] = [
  { slug: "nasfinder", appName: "나스파인더", build: "202608252025", uploadedAt: "2026-08-25T21:19:38+09:00", inviteUrl: "https://testflight.apple.com/join/3m3bhwJz", publicBetaState: "approved" },
  { slug: "hanclip", appName: "한클립", build: "202608251900", uploadedAt: "2026-08-25T19:09:02+09:00", inviteUrl: "https://testflight.apple.com/join/m2YsgUJW", publicBetaState: "approved" },
  { slug: "stand", appName: "S.tand", build: "342257", uploadedAt: "2026-08-26T16:31:06+09:00", inviteUrl: null, publicBetaState: "waitingForReview" },
  { slug: "htoms-brief", appName: "HtOMS 브리프", build: "202608252204", uploadedAt: "2026-08-25T22:07:03+09:00", inviteUrl: null, publicBetaState: "internalOnly" },
  { slug: "starmanager", appName: "스타메니저", build: "202608251915", uploadedAt: "2026-08-25T19:18:33+09:00", inviteUrl: "https://testflight.apple.com/join/nzmW4WxW", publicBetaState: "approved" },
  { slug: "button", appName: "버튼", build: "202608252204", uploadedAt: "2026-08-25T22:08:30+09:00", inviteUrl: null, publicBetaState: "waitingForReview" },
  { slug: "whattoeat", appName: "오늘 뭐 먹지??", build: "202608252106", uploadedAt: "2026-08-25T21:28:05+09:00", inviteUrl: "https://testflight.apple.com/join/A444RsAc", publicBetaState: "approved" },
];
