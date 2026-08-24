"use client";

import { useEffect } from "react";

const LAST_VISIT_KEY = "nasfinder:last-counted-visit";

function todayInKorea() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const value = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${value.year}-${value.month}-${value.day}`;
}

// Mounted once at the root layout so the first landing page anywhere on the
// site is counted, not only visits that happen to reach the homepage.
export function VisitTracker() {
  useEffect(() => {
    const today = todayInKorea();
    let counted = false;
    try {
      counted = localStorage.getItem(LAST_VISIT_KEY) === today;
    } catch {
      counted = false;
    }
    if (counted) return;

    const params = new URLSearchParams(window.location.search);
    let referrerOrigin: string | undefined;
    try {
      referrerOrigin = document.referrer ? new URL(document.referrer).origin : undefined;
    } catch {
      referrerOrigin = undefined;
    }
    fetch("/api/site-stats", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event: "visit",
        referrer: referrerOrigin,
        utmSource: params.get("utm_source") || undefined,
        utmMedium: params.get("utm_medium") || undefined,
      }),
    }).then((response) => {
      if (!response.ok) return;
      try { localStorage.setItem(LAST_VISIT_KEY, today); } catch { /* storage may be disabled */ }
      window.dispatchEvent(new Event("nasfinder:visit-counted"));
    }).catch(() => { /* best-effort counter */ });
  }, []);

  return null;
}
