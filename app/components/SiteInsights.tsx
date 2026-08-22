"use client";

import { useEffect, useMemo, useState } from "react";
import { DOWNLOAD_KEYS, RELEASE_DOWNLOADS } from "../releases";

type DailyStats = {
  date: string;
  visits: number;
  downloadClicks: number;
  downloads: Record<string, number>;
};

type InsightStats = {
  month: string;
  daily: DailyStats[];
};

const apps = DOWNLOAD_KEYS.map((key) => [key, RELEASE_DOWNLOADS[key].label] as const);

function currentMonth() {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Seoul", year: "numeric", month: "2-digit" }).formatToParts(new Date());
  const value = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${value.year}-${value.month}`;
}

export function SiteInsights() {
  const [month, setMonth] = useState(currentMonth);
  const [stats, setStats] = useState<InsightStats | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/site-stats?month=${month}`, { cache: "no-store", signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("stats unavailable");
        setFailed(false);
        setStats(await response.json() as InsightStats);
      })
      .catch((error: unknown) => {
        if (!(error instanceof DOMException && error.name === "AbortError")) setFailed(true);
      });
    return () => controller.abort();
  }, [month]);

  const summary = useMemo(() => {
    const daily = stats?.daily || [];
    return {
      visits: daily.reduce((sum, day) => sum + day.visits, 0),
      downloads: daily.reduce((sum, day) => sum + day.downloadClicks, 0),
      max: Math.max(1, ...daily.flatMap((day) => [day.visits, day.downloadClicks])),
    };
  }, [stats]);

  const number = (value: number) => value.toLocaleString("ko-KR");
  const [selectedYear, selectedMonth] = month.split("-");
  const [thisYear, thisMonth] = currentMonth().split("-").map(Number);
  const years = Array.from({ length: 6 }, (_, index) => String(thisYear - index));
  const months = Array.from({ length: 12 }, (_, index) => String(index + 1).padStart(2, "0"));

  return (
    <main>
      <section className="insights-hero shell">
        <p className="eyebrow">SITE RECORDS</p>
        <h1>사이트 기록</h1>
        <p>사람을 따라가지 않고, 홈페이지가 얼마나 쓰였는지만 날짜별 숫자로 봅니다.</p>
      </section>
      <section className="insights-shell shell">
        <div className="insights-toolbar">
          <div><span>기간 선택</span><strong>{month.replace("-", ". ")}</strong></div>
          <div className="period-selectors">
            <label>연도<select value={selectedYear} onChange={(event) => setMonth(`${event.target.value}-${selectedMonth}`)}>{years.map((year) => <option key={year} value={year}>{year}년</option>)}</select></label>
            <label>월<select value={selectedMonth} onChange={(event) => setMonth(`${selectedYear}-${event.target.value}`)}>{months.map((value) => <option key={value} value={value} disabled={Number(selectedYear) === thisYear && Number(value) > thisMonth}>{Number(value)}월</option>)}</select></label>
          </div>
        </div>
        <div className="insights-summary">
          <article><span>월 방문</span><strong>{number(summary.visits)}</strong></article>
          <article><span>월 다운로드 버튼</span><strong>{number(summary.downloads)}</strong></article>
        </div>
        <div className="insights-chart" aria-label={`${month} 날짜별 방문과 다운로드 버튼 클릭 그래프`}>
          <div className="chart-legend"><span><i className="visit" />방문</span><span><i className="download" />다운로드 버튼</span></div>
          <div className="chart-scroll">
            <div className="chart-bars" style={{ gridTemplateColumns: `repeat(${Math.max(stats?.daily.length || 1, 1)}, minmax(18px, 1fr))` }}>
              {(stats?.daily || []).map((day) => <article key={day.date} title={`${day.date} · 방문 ${day.visits} · 다운로드 ${day.downloadClicks}`}>
                <div><i className="visit" style={{ height: `${Math.max(day.visits ? 5 : 0, day.visits / summary.max * 100)}%` }} /><i className="download" style={{ height: `${Math.max(day.downloadClicks ? 5 : 0, day.downloadClicks / summary.max * 100)}%` }} /></div>
                <time dateTime={day.date}>{day.date.slice(8)}</time>
              </article>)}
            </div>
          </div>
        </div>
        {failed ? <p className="insights-error">집계 정보를 잠시 불러오지 못했습니다. 조금 뒤 다시 확인해 주세요.</p> : null}
        <div className="insights-table-wrap">
          <table className="insights-table">
            <thead><tr><th>날짜</th><th>방문</th><th>다운로드 전체</th>{apps.map(([, label]) => <th key={label}>{label}</th>)}</tr></thead>
            <tbody>{[...(stats?.daily || [])].reverse().map((day) => <tr key={day.date}><th scope="row">{day.date}</th><td>{number(day.visits)}</td><td>{number(day.downloadClicks)}</td>{apps.map(([repo]) => <td key={repo}>{number(day.downloads[repo] || 0)}</td>)}</tr>)}</tbody>
          </table>
        </div>
        <p className="insights-footnote">방문은 같은 브라우저에서 하루 한 번만 집계합니다. 다운로드 숫자는 이 홈페이지 버튼을 누른 횟수이며 GitHub 전체 다운로드 수와는 다를 수 있습니다.</p>
      </section>
    </main>
  );
}
