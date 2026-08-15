"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { TestFlightBuild } from "../testflight";

const LIFE_MS = 90 * 24 * 60 * 60 * 1000;

function getBuildState(build: TestFlightBuild) {
  if (!build.uploadedAt) return null;
  const uploaded = new Date(build.uploadedAt);
  const expires = build.expiresAt ? new Date(build.expiresAt) : new Date(uploaded.getTime() + LIFE_MS);
  const now = new Date();
  const elapsed = Math.max(0, now.getTime() - uploaded.getTime());
  const remaining = Math.max(0, expires.getTime() - now.getTime());
  return {
    uploaded,
    expires,
    daysRemaining: Math.ceil(remaining / (24 * 60 * 60 * 1000)),
    progress: Math.min(100, (elapsed / LIFE_MS) * 100),
    expired: remaining === 0,
  };
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Seoul",
  }).format(date);
}

export function TestFlightTracker({ builds }: { builds: TestFlightBuild[] }) {
  const [currentBuilds, setCurrentBuilds] = useState(builds);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/testflight-builds", { signal: controller.signal })
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("TestFlight lookup failed")))
      .then((payload: { builds?: TestFlightBuild[] }) => {
        if (Array.isArray(payload.builds) && payload.builds.length === builds.length) {
          setCurrentBuilds(payload.builds);
        }
      })
      .catch(() => undefined);
    return () => controller.abort();
  }, [builds]);

  return (
    <div className="testflight-grid">
      {currentBuilds.map((build) => {
        const state = getBuildState(build);
        return (
          <article className="testflight-card" key={build.slug}>
            <div className="testflight-card-head">
              <div><span className="flight-dot" /><h3>{build.appName}</h3></div>
              <Link href={`/apps/${build.slug}`}>앱 보기</Link>
            </div>
            {state ? <>
              <div className="flight-days"><strong>{state.expired ? "만료" : state.daysRemaining}</strong>{!state.expired && <span>일 남음</span>}</div>
              <div className="flight-track" role="progressbar" aria-label={`${build.appName} TestFlight 90일 사용 기간`} aria-valuemin={0} aria-valuemax={90} aria-valuenow={90 - state.daysRemaining}>
                <span style={{ width: `${state.progress}%` }} />
              </div>
              <dl>
                <div><dt>업로드</dt><dd>{formatDate(state.uploaded)}</dd></div>
                <div><dt>만료 예정</dt><dd>{formatDate(state.expires)}</dd></div>
                {build.build && <div><dt>빌드</dt><dd>{build.build}</dd></div>}
              </dl>
              {build.inviteUrl && <a className="flight-link" href={build.inviteUrl}>TestFlight 참여 <span aria-hidden="true">↗</span></a>}
            </> : <div className="flight-empty"><strong>업로드 기록 대기</strong><p>TestFlight 업로드 시각이 확인되면 90일 만료 시계가 시작됩니다.</p><div className="flight-track"><span /></div></div>}
          </article>
        );
      })}
    </div>
  );
}
