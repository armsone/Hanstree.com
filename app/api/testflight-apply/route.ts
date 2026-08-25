export async function POST() {
  return Response.json(
    { error: "내부 테스터 신청은 종료되었습니다. 각 앱의 TestFlight 공개 링크로 바로 참여해 주세요." },
    { status: 410, headers: { "Cache-Control": "no-store" } },
  );
}
