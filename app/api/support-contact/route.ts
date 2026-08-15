const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin || origin !== new URL(request.url).origin) {
    return Response.json({ error: "허용되지 않은 요청입니다." }, { status: 403 });
  }

  const address = process.env.SUPPORT_EMAIL;
  if (!address || !EMAIL_PATTERN.test(address)) {
    return Response.json({ error: "문의 주소를 불러올 수 없습니다." }, { status: 503 });
  }

  return Response.json(
    { address },
    { headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" } },
  );
}
