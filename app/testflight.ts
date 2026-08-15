export type TestFlightBuild = {
  slug: "nasfinder" | "hanclip" | "stand";
  appName: string;
  build: string | null;
  uploadedAt: string | null;
  inviteUrl: string | null;
};

// TestFlight 업로드가 확인되면 이 목록의 빌드 번호와 ISO 8601 시각만 갱신합니다.
// 확인되지 않은 날짜를 추정해서 입력하지 않습니다.
export const testFlightBuilds: TestFlightBuild[] = [
  { slug: "nasfinder", appName: "나스파인더", build: null, uploadedAt: null, inviteUrl: null },
  { slug: "hanclip", appName: "한클립", build: null, uploadedAt: null, inviteUrl: null },
  { slug: "stand", appName: "S.tand", build: null, uploadedAt: null, inviteUrl: null },
];
