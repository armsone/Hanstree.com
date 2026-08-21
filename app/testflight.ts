export type TestFlightBuild = {
  slug: "nasfinder" | "hanclip" | "stand" | "htoms-brief" | "starmanager" | "button";
  appName: string;
  build: string | null;
  uploadedAt: string | null;
  expiresAt?: string | null;
  inviteUrl: string | null;
};

// TestFlight 업로드가 확인되면 이 목록의 빌드 번호와 ISO 8601 시각만 갱신합니다.
// 확인되지 않은 날짜를 추정해서 입력하지 않습니다.
export const testFlightBuilds: TestFlightBuild[] = [
  { slug: "nasfinder", appName: "나스파인더", build: "202608211740", uploadedAt: "2026-08-21T18:01:57+09:00", inviteUrl: null },
  { slug: "hanclip", appName: "한클립", build: "3.12.55", uploadedAt: "2026-08-21T07:25:31+09:00", inviteUrl: null },
  { slug: "stand", appName: "S.tand", build: "0.33.0", uploadedAt: "2026-08-21T07:09:41+09:00", inviteUrl: null },
  { slug: "htoms-brief", appName: "HtOMS 브리프", build: "202608210644", uploadedAt: "2026-08-21T07:04:31+09:00", inviteUrl: null },
  { slug: "starmanager", appName: "스타메니저", build: "2", uploadedAt: "2026-08-21T17:54:55+09:00", inviteUrl: null },
  { slug: "button", appName: "버튼", build: "15", uploadedAt: "2026-08-21T17:57:33+09:00", inviteUrl: null },
];
