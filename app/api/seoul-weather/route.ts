const SEOUL_WEATHER_URL = "https://api.open-meteo.com/v1/forecast?latitude=37.5665&longitude=126.9780&current=temperature_2m,weather_code&timezone=Asia%2FSeoul";

export async function GET() {
  try {
    const response = await fetch(SEOUL_WEATHER_URL, {
      headers: { Accept: "application/json" },
    });
    if (!response.ok) throw new Error(`Weather upstream returned ${response.status}`);

    const payload = await response.json() as {
      current?: { temperature_2m?: number; weather_code?: number; time?: string };
    };
    const temperature = payload.current?.temperature_2m;
    const weatherCode = payload.current?.weather_code;
    if (!Number.isFinite(temperature) || !Number.isFinite(weatherCode)) throw new Error("Weather response is incomplete");

    return Response.json(
      { temperature, weatherCode, observedAt: payload.current?.time ?? null },
      { headers: { "Cache-Control": "public, max-age=600, stale-while-revalidate=1800" } },
    );
  } catch {
    return Response.json({ error: "서울 날씨를 불러오지 못했습니다." }, { status: 502 });
  }
}
