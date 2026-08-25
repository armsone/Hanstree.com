"use client";

import { useEffect, useState } from "react";
import { DOWNLOAD_KEYS, RELEASE_DOWNLOADS, sortDownloadKeysByCount } from "../releases";

type SiteStats = {
  todayVisits: number;
  totalVisits: number;
  totalDownloadClicks: number;
  downloads: Record<string, number>;
};

export function SiteCounter() {
  const [stats, setStats] = useState<SiteStats | null>(null);

  useEffect(() => {
    const load = () => {
      fetch("/api/site-stats", { cache: "no-store" }).then(async (response) => {
        if (!response.ok) throw new Error("site stats unavailable");
        setStats(await response.json() as SiteStats);
      }).catch(() => setStats(null));
    };
    load();
    window.addEventListener("nasfinder:visit-counted", load);
    return () => window.removeEventListener("nasfinder:visit-counted", load);
  }, []);

  const number = (value?: number) => value === undefined ? "—" : value.toLocaleString("ko-KR");
  const orderedRepoLabels = sortDownloadKeysByCount(DOWNLOAD_KEYS, stats?.downloads)
    .map((key) => [key, RELEASE_DOWNLOADS[key].label] as const);

  return (
    <section id="records" className="site-counter-section shell" aria-labelledby="site-counter-title">
      <div className="counter-heading">
        <div><p className="eyebrow">A SMALL, HONEST COUNTER</p><h2 id="site-counter-title">얼마나 만나고,<br />얼마나 받아 갔는지.</h2></div>
        <p>개인을 식별하지 않고 숫자만 남깁니다. 방문은 같은 브라우저에서 하루 한 번, 다운로드는 이 홈페이지의 받기 버튼을 누른 횟수입니다.</p>
      </div>
      <div className="counter-grid" aria-live="polite">
        <article><span>오늘 방문</span><strong>{number(stats?.todayVisits)}</strong><small>브라우저당 하루 한 번</small></article>
        <article><span>누적 방문</span><strong>{number(stats?.totalVisits)}</strong><small>집계를 시작한 날부터</small></article>
        <article><span>다운로드 버튼</span><strong>{number(stats?.totalDownloadClicks)}</strong><small>홈페이지에서 누른 횟수</small></article>
      </div>
      <dl className="counter-downloads">
        {orderedRepoLabels.map(([repo, label]) => <div key={repo}><dt>{label}</dt><dd>{number(stats?.downloads[repo])}회</dd></div>)}
      </dl>
      {/* Native navigation avoids the current vinext client-router issue. */}
      <a className="counter-detail-link" href="/admin/testflight">관리자에서 자세히 보기 <span aria-hidden="true">→</span></a>
      <p className="counter-note">이 숫자는 방문자 수를 정확히 식별하는 분석 도구가 아닌 간단한 참고용 집계입니다. GitHub에서 직접 받은 횟수와는 다를 수 있습니다.</p>
    </section>
  );
}
