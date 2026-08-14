"use client";

import { useEffect, useState } from "react";

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
