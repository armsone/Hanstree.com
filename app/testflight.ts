export type TestFlightBuild = {
  slug: "nasfinder" | "hanclip" | "stand" | "htoms-brief" | "starmanager" | "button" | "whattoeat";
  appName: string;
  build: string | null;
  uploadedAt: string | null;
  expiresAt?: string | null;
  inviteUrl: string | null;
};

// TestFlight 업로드가 확인되면 이 목록의 빌드 번호와 ISO 8601 시각만 갱신합니다.
// 확인되지 않은 날짜를 추정해서 입력하지 않습니다.
export const testFlightBuilds: TestFlightBuild[] = [
  { slug: "nasfinder", appName: "나스파인더", build: "202608230737", uploadedAt: "2026-08-23T08:16:10+09:00", inviteUrl: null },
  { slug: "hanclip", appName: "한클립", build: "202608230737", uploadedAt: "2026-08-23T08:08:47+09:00", inviteUrl: null },
  { slug: "stand", appName: "S.tand", build: "337417", uploadedAt: "2026-08-23T08:21:11+09:00", inviteUrl: null },
  { slug: "htoms-brief", appName: "HtOMS 브리프", build: "202608230737", uploadedAt: "2026-08-23T08:12:19+09:00", inviteUrl: null },
  { slug: "starmanager", appName: "스타메니저", build: "202608230737", uploadedAt: "2026-08-23T08:13:38+09:00", inviteUrl: null },
  { slug: "button", appName: "버튼", build: "202608230737", uploadedAt: "2026-08-23T08:14:39+09:00", inviteUrl: null },
  { slug: "whattoeat", appName: "오늘 뭐 먹지??", build: "202608240930", uploadedAt: "2026-08-24T10:12:29+09:00", inviteUrl: null },
];
