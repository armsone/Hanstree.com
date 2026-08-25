export type TestFlightBuild = {
  slug: "nasfinder" | "hanclip" | "stand" | "htoms-brief" | "starmanager" | "button" | "whattoeat";
  appName: string;
  build: string | null;
  uploadedAt: string | null;
  expiresAt?: string | null;
  inviteUrl: string | null;
  publicBetaState: "waitingForReview" | "needsExternalBuild";
};

// TestFlight 업로드가 확인되면 이 목록의 빌드 번호와 ISO 8601 시각만 갱신합니다.
// 확인되지 않은 날짜를 추정해서 입력하지 않습니다.
export const testFlightBuilds: TestFlightBuild[] = [
  { slug: "nasfinder", appName: "나스파인더", build: "202608252025", uploadedAt: "2026-08-25T21:19:38+09:00", inviteUrl: null, publicBetaState: "waitingForReview" },
  { slug: "hanclip", appName: "한클립", build: "202608251900", uploadedAt: "2026-08-25T19:09:02+09:00", inviteUrl: null, publicBetaState: "waitingForReview" },
  { slug: "stand", appName: "S.tand", build: "340977", uploadedAt: "2026-08-25T19:12:22+09:00", inviteUrl: null, publicBetaState: "waitingForReview" },
  { slug: "htoms-brief", appName: "HtOMS 브리프", build: "202608230737", uploadedAt: "2026-08-23T08:12:19+09:00", inviteUrl: null, publicBetaState: "needsExternalBuild" },
  { slug: "starmanager", appName: "스타메니저", build: "202608251915", uploadedAt: "2026-08-25T19:18:33+09:00", inviteUrl: null, publicBetaState: "waitingForReview" },
  { slug: "button", appName: "버튼", build: "202608230737", uploadedAt: "2026-08-23T08:14:39+09:00", inviteUrl: null, publicBetaState: "needsExternalBuild" },
  { slug: "whattoeat", appName: "오늘 뭐 먹지??", build: "202608252106", uploadedAt: "2026-08-25T21:28:05+09:00", inviteUrl: null, publicBetaState: "waitingForReview" },
];
