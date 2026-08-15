"use client";

import { useEffect, useState } from "react";

type SeoulWeather = {
  temperature: number;
  weatherCode: number;
};

function weatherLabel(code: number) {
  if (code === 0) return "맑음";
  if (code <= 2) return "구름 조금";
  if (code === 3) return "흐림";
  if (code <= 48) return "안개";
  if (code <= 57) return "이슬비";
  if (code <= 67) return "비";
  if (code <= 77) return "눈";
  if (code <= 82) return "소나기";
  if (code <= 86) return "눈보라";
  return "뇌우";
}

function getSeoulTime() {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Seoul",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());
  const hour = parts.find((part) => part.type === "hour")?.value || "00";
  const minute = parts.find((part) => part.type === "minute")?.value || "00";
  return { hour, minute };
}

export function LiveFlipClock() {
  const [time, setTime] = useState(getSeoulTime);

  useEffect(() => {
    const update = () => setTime(getSeoulTime());
    const timer = window.setInterval(update, 15_000);
    return () => window.clearInterval(timer);
  }, []);

  const label = `서울 현재 시각 ${time.hour}시 ${time.minute}분`;
  return (
    <div className="flip-clock" role="timer" aria-label={label}>
      <span>{time.hour[0]}</span><span>{time.hour[1]}</span><i>:</i><span>{time.minute[0]}</span><span>{time.minute[1]}</span>
    </div>
  );
}

export function LiveSeoulWeather() {
  const [weather, setWeather] = useState<SeoulWeather | null>(null);

  useEffect(() => {
    let active = true;
    const update = async () => {
      try {
        const response = await fetch("/api/seoul-weather", { cache: "no-store" });
        if (!response.ok) return;
        const next = await response.json() as SeoulWeather;
        if (active && Number.isFinite(next.temperature) && Number.isFinite(next.weatherCode)) setWeather(next);
      } catch {
        // Keep the quiet loading state when the weather service is temporarily unavailable.
      }
    };
    void update();
    const timer = window.setInterval(update, 15 * 60 * 1000);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, []);

  if (!weather) return <div className="clock-weather" aria-label="서울 현재 날씨를 불러오는 중">SEOUL&nbsp;&nbsp; --°</div>;
  const temperature = Math.round(weather.temperature);
  const condition = weatherLabel(weather.weatherCode);
  return <div className="clock-weather" aria-label={`서울 현재 날씨 ${condition}, 기온 ${temperature}도`}>SEOUL&nbsp;&nbsp; {condition}&nbsp;&nbsp; {temperature}°</div>;
}
