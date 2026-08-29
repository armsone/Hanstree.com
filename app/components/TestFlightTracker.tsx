"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { findApp } from "../data";
import { appCardIcon } from "../media";
import type { TestFlightBuild } from "../testflight";
import { useNearViewport } from "./useNearViewport";

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
  const [containerRef, isNearViewport] = useNearViewport<HTMLDivElement>();

  useEffect(() => {
    if (!isNearViewport) return;
    const controller = new AbortController();
    fetch("/api/testflight-builds", { signal: controller.signal })
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("TestFlight lookup failed")))
      .then((payload: { builds?: TestFlightBuild[] }) => {
        if (!Array.isArray(payload.builds)) return;
        // slug 기준으로 병합해, 일부만 도착한 응답이 검증된 정적 빌드를 지우지 않게 합니다.
        const liveBySlug = new Map(payload.builds.filter((build) => build?.slug).map((build) => [build.slug, build] as const));
        setCurrentBuilds(builds.map((build) => {
          const live = liveBySlug.get(build.slug);
          return live?.uploadedAt ? live : build;
        }));
      })
      .catch(() => undefined);
    return () => controller.abort();
  }, [builds, isNearViewport]);

  return (
    <div className="testflight-grid" ref={containerRef}>
      {currentBuilds.map((build) => {
        const state = getBuildState(build);
        const app = findApp(build.slug);
        return (
          <article className="testflight-card" key={build.slug}>
            <div className="testflight-card-head">
              <div>{app?.icon && <Image className="release-app-icon" src={appCardIcon(app)} alt="" width={256} height={256} sizes="52px" unoptimized />}<div><span className="flight-dot" /><h3>{build.appName}</h3></div></div>
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
              {build.inviteAvailable !== false && build.inviteUrl
                ? <a className="flight-link" href={build.inviteUrl}>TestFlight 참여 <span aria-hidden="true">↗</span></a>
                : build.publicBetaState === "waitingForReview" && <span className="flight-link flight-link-pending">Apple 외부 베타 심사 중</span>}
            </> : <div className="flight-empty"><strong>업로드 기록 대기</strong><p>TestFlight 업로드 시각이 확인되면 90일 만료 시계가 시작됩니다.</p><div className="flight-track"><span /></div></div>}
          </article>
        );
      })}
    </div>
  );
}
