// 공개 링크로 지금 설치할 수 있는 승인된 빌드입니다. 최신 빌드가 심사 중일 때는 최신 빌드와 다를 수 있습니다.
export type TestFlightApprovedBuild = {
  build: string;
  marketingVersion: string | null;
  uploadedAt: string;
  expiresAt: string | null;
};

export type TestFlightBuild = {
  slug: "nasfinder" | "hanclip" | "stand" | "starmanager" | "button" | "whattoeat" | "denimdex" | "barobogi" | "hana";
  appName: string;
  build: string | null;
  // ASC 실시간 조회로만 채우는 사용자용 버전(preReleaseVersion). 정적 목록에는 넣지 않습니다.
  marketingVersion?: string | null;
  uploadedAt: string | null;
  expiresAt?: string | null;
  inviteUrl: string | null;
  inviteAvailable?: boolean;
  publicBetaState: "approved" | "waitingForReview" | "rejected" | "needsExternalBuild" | "needsReviewAccount" | "internalOnly";
  // ASC 실시간 조회로만 채웁니다(정적 목록에는 없음). 확인된 승인 빌드가 없으면 null이며, 링크 폐쇄를 뜻하지 않습니다.
  approvedBuild?: TestFlightApprovedBuild | null;
};

// TestFlight 업로드가 확인되면 이 목록의 빌드 번호와 ISO 8601 시각만 갱신합니다.
// 확인되지 않은 날짜를 추정해서 입력하지 않습니다.
// 나스파인더는 현재 빌드를 실시간 조회로만 보여 주고, 지난 빌드는 data.ts 진행 이력에 남깁니다.
export const testFlightBuilds: TestFlightBuild[] = [
  { slug: "nasfinder", appName: "나스파인더", build: null, uploadedAt: null, expiresAt: null, inviteUrl: "https://testflight.apple.com/join/3m3bhwJz", inviteAvailable: true, publicBetaState: "waitingForReview" },
  { slug: "hanclip", appName: "한클립", build: "202611121250", uploadedAt: "2026-11-11T23:28:19-08:00", expiresAt: "2027-02-09T23:28:19-08:00", inviteUrl: "https://testflight.apple.com/join/m2YsgUJW", inviteAvailable: true, publicBetaState: "approved" },
  { slug: "stand", appName: "S.tand", build: "202611290011", uploadedAt: "2026-11-28T15:37:58Z", expiresAt: "2027-02-26T15:37:58Z", inviteAvailable: true, inviteUrl: "https://testflight.apple.com/join/mGUYTjdp", publicBetaState: "waitingForReview" },
  { slug: "starmanager", appName: "Stargram", build: "202610030015", uploadedAt: "2026-10-03T00:50:00+09:00", expiresAt: "2027-01-01T00:50:00+09:00", inviteUrl: "https://testflight.apple.com/join/nzmW4WxW", inviteAvailable: true, publicBetaState: "approved" },
  { slug: "button", appName: "OurButton", build: "202610141355", uploadedAt: "2026-10-14T01:33:36-07:00", expiresAt: "2027-01-12T00:33:36-08:00", inviteUrl: "https://testflight.apple.com/join/RKcxgTkc", inviteAvailable: true, publicBetaState: "waitingForReview" },
  { slug: "whattoeat", appName: "오늘 뭐 먹지??", build: "202610061956", uploadedAt: "2026-10-06T04:06:40-07:00", expiresAt: "2027-01-04T03:06:40-08:00", inviteUrl: "https://testflight.apple.com/join/A444RsAc", inviteAvailable: true, publicBetaState: "approved" },
  { slug: "denimdex", appName: "데님덱스", build: "202610030015", uploadedAt: "2026-10-02T08:59:00-07:00", expiresAt: "2026-12-31T07:59:00-08:00", inviteUrl: "https://testflight.apple.com/join/5pBrz6ME", inviteAvailable: true, publicBetaState: "approved" },
  { slug: "barobogi", appName: "바로보기", build: "43", uploadedAt: "2026-10-12T05:55:10-07:00", expiresAt: "2027-01-10T04:55:10-08:00", inviteUrl: "https://testflight.apple.com/join/98v2mG4q", inviteAvailable: true, publicBetaState: "approved" },
  { slug: "hana", appName: "하나", build: "202611271519", uploadedAt: "2026-11-26T22:27:58-08:00", expiresAt: "2027-02-24T22:27:58-08:00", inviteUrl: "https://testflight.apple.com/join/ss4nfE3z", inviteAvailable: true, publicBetaState: "approved" },
];
