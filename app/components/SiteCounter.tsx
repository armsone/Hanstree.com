"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type SiteStats = {
  todayVisits: number;
  totalVisits: number;
  totalDownloadClicks: number;
  downloads: Record<string, number>;
};

const repoLabels = [
  ["NasFinder-Android", "NasFinder"],
  ["HanClip-Android", "HanClip"],
  ["S.tand-Android", "S.tand"],
] as const;

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

export function SiteCounter() {
  const [stats, setStats] = useState<SiteStats | null>(null);

  useEffect(() => {
    const lastVisitKey = "nasfinder:last-counted-visit";
    const today = todayInKorea();
    let counted = false;
    try {
      counted = localStorage.getItem(lastVisitKey) === today;
    } catch {
      counted = false;
    }

    fetch("/api/site-stats", counted ? { cache: "no-store" } : {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event: "visit" }),
    }).then(async (response) => {
      if (!response.ok) throw new Error("site stats unavailable");
      const next = await response.json() as SiteStats;
      if (!counted) {
        try { localStorage.setItem(lastVisitKey, today); } catch { /* storage may be disabled */ }
      }
      setStats(next);
    }).catch(() => setStats(null));
  }, []);

  const number = (value?: number) => value === undefined ? "—" : value.toLocaleString("ko-KR");

  return (
    <section className="site-counter-section shell" aria-labelledby="site-counter-title">
      <div className="counter-heading">
        <div><p className="eyebrow">A SMALL, HONEST COUNTER</p><h2 id="site-counter-title">얼마나 만나고,<br />얼마나 받아 갔는지.</h2></div>
        <p>개인을 식별하지 않고 숫자만 남깁니다. 방문은 같은 브라우저에서 하루 한 번, APK는 이 홈페이지의 ‘바로 받기’를 누른 횟수입니다.</p>
      </div>
      <div className="counter-grid" aria-live="polite">
        <article><span>오늘 방문</span><strong>{number(stats?.todayVisits)}</strong><small>브라우저당 하루 한 번</small></article>
        <article><span>누적 방문</span><strong>{number(stats?.totalVisits)}</strong><small>집계를 시작한 날부터</small></article>
        <article><span>APK 버튼</span><strong>{number(stats?.totalDownloadClicks)}</strong><small>홈페이지에서 누른 횟수</small></article>
      </div>
      <dl className="counter-downloads">
        {repoLabels.map(([repo, label]) => <div key={repo}><dt>{label}</dt><dd>{number(stats?.downloads[repo])}회</dd></div>)}
      </dl>
      <Link className="counter-detail-link" href="/insights">날짜별 그래프와 표 보기 <span aria-hidden="true">→</span></Link>
      <p className="counter-note">이 숫자는 방문자 수를 정확히 식별하는 분석 도구가 아닌 간단한 참고용 집계입니다. GitHub에서 직접 받은 횟수와는 다를 수 있습니다.</p>
    </section>
  );
}
