"use client";
import { useEffect, useState } from "react";
import type { Platform } from "../data";
import { downloadKeyFromUrl, releaseDetail, snapshotDownloadPath, type ReleaseInfo } from "../releaseInfo";
import { ClientDownloadQrCode } from "./ClientDownloadQrCode";
import type { DownloadKey } from "../releases";
import type { TestFlightBuild } from "../testflight";
import { useNearViewport } from "./useNearViewport";

// Browser-local request sharing; server-side refreshes are coordinated by the persistent lease.
const requests = new Map<DownloadKey, { expiresAt: number; value: Promise<ReleaseInfo | null> }>();
function load(key: DownloadKey) {
  const cached = requests.get(key);
  if (cached && cached.expiresAt > Date.now()) return cached.value;
  const value = fetch(`/api/releases?app=${encodeURIComponent(key)}`)
    .then(async (response) => response.ok ? await response.json() as ReleaseInfo : null).catch(() => null);
  requests.set(key, { expiresAt: Date.now() + 5 * 60_000, value });
  return value;
}
// TestFlight 표시 버전은 ASC 실시간 조회로만 갱신합니다. 한 화면의 여러 컴포넌트가 같은 요청을 공유합니다.
let testFlightRequest: { expiresAt: number; value: Promise<TestFlightBuild[] | null> } | null = null;
function loadTestFlight() {
  if (testFlightRequest && testFlightRequest.expiresAt > Date.now()) return testFlightRequest.value;
  const value = fetch("/api/testflight-builds")
    .then(async (response) => response.ok ? (await response.json() as { builds?: TestFlightBuild[] }).builds ?? null : null).catch(() => null);
  testFlightRequest = { expiresAt: Date.now() + 5 * 60_000, value };
  return value;
}
// 승인되어 지금 설치할 수 있는 최신 빌드일 때만 버전과 빌드 번호를 바꾸고, 그 밖에는 기존 표시를 그대로 둡니다.
function liveTestFlightDetail(detail: string, live: TestFlightBuild | null) {
  if (live?.publicBetaState !== "approved" || !live.marketingVersion || !live.build) return detail;
  if (live.expiresAt && new Date(live.expiresAt).getTime() <= Date.now()) return detail;
  // 앞의 "버전", "(빌드)", "· 빌드 N"은 한 덩어리로 바꾸고, 뒤의 호환·플랫폼 설명은 그대로 둡니다.
  return detail.replace(/^\d+\.\d+(?:\.\d+)?(?:\s*\(\d+\))?(?:\s*·\s*빌드\s*\d+)?/, `${live.marketingVersion} (${live.build})`);
}
function useLiveTestFlight(appSlug: string | undefined, enabled: boolean, near: boolean) {
  const [live, setLive] = useState<TestFlightBuild | null>(null);
  useEffect(() => {
    let active = true;
    if (enabled && near && appSlug) loadTestFlight().then((builds) => { if (active) setLive(builds?.find((build) => build?.slug === appSlug) ?? null); });
    return () => { active = false; };
  }, [enabled, near, appSlug]);
  return live;
}
function useTestFlightDetail(platform: Platform, appSlug: string | undefined, near: boolean) {
  const enabled = platform.status === "TestFlight" && !!appSlug;
  const live = useLiveTestFlight(appSlug, enabled, near);
  return enabled ? liveTestFlightDetail(platform.detail, live) : platform.detail;
}
function useRelease<T extends HTMLElement = HTMLSpanElement>(url?: string) {
  const key = downloadKeyFromUrl(url);
  const [ref, near] = useNearViewport<T>();
  const [info, setInfo] = useState<ReleaseInfo | null>(null);
  useEffect(() => {
    let active = true;
    if (key && near) load(key).then((value) => { if (active) setInfo(value); });
    return () => { active = false; };
  }, [key, near]);
  return { ref, key, info, near };
}
export function ReleaseDetail({ platform, appSlug }: { platform: Platform; appSlug?: string }) {
  const { ref, key, info, near } = useRelease(platform.url);
  const detail = useTestFlightDetail(platform, appSlug, near);
  return <span ref={ref}>{key ? releaseDetail(platform.detail, info) : detail}</span>;
}
// TestFlight 플랫폼의 "버전 (빌드) · 상태" 한 줄입니다. 다운로드 목록에서 정적 detail 대신 씁니다.
export function TestFlightDetailLine({ platform, appSlug }: { platform: Platform; appSlug: string }) {
  const [ref, near] = useNearViewport<HTMLParagraphElement>();
  const detail = useTestFlightDetail(platform, appSlug, near);
  return <p ref={ref}>{detail} · {platform.status}</p>;
}
// 제품 사양의 TestFlight 빌드 번호입니다. 승인된 최신 빌드를 확인했을 때만 정적 값을 바꿉니다.
export function TestFlightBuildText({ appSlug, fallback }: { appSlug: string; fallback: string }) {
  const [ref, near] = useNearViewport<HTMLElement>();
  const live = useLiveTestFlight(appSlug, true, near);
  const approved = live?.publicBetaState === "approved" && !!live.build && !(live.expiresAt && new Date(live.expiresAt).getTime() <= Date.now());
  return <small ref={ref}>빌드 {approved ? live.build : fallback}</small>;
}
export function ReleaseVersion({ platform, appSlug }: { platform: Platform; appSlug?: string }) {
  const { ref, key, info, near } = useRelease(platform.url);
  const detail = useTestFlightDetail(platform, appSlug, near);
  return <span ref={ref}>{key ? info?.version ? ` ${info.version}${info.source !== "github" ? " (확인 정보)" : ""}` : "" : ` ${detail.match(/\d+\.\d+(?:\.\d+)?/)?.[0] ?? ""}`}</span>;
}
export function ReleaseDownload({ platform, className }: { platform: Platform; className?: string }) {
  const { ref, key, info } = useRelease<HTMLDivElement>(platform.url);
  return <div ref={ref}>
    <p>{key ? releaseDetail(platform.detail, info) : platform.detail} · {platform.status}</p>
    <a className={className} href={info ? snapshotDownloadPath(info) : platform.url}>{platform.downloadLabel ?? "다운로드"} <span aria-hidden="true">↗</span></a>
    {info?.asset?.size && <small style={{ display: "block" }}>{(info.asset.size / 1024 / 1024).toFixed(1)} MB{info.publishedAt ? ` · ${new Intl.DateTimeFormat("ko-KR", { dateStyle: "medium" }).format(new Date(info.publishedAt))}` : ""}</small>}
  </div>;
}
export function ReleasePlatformChip({ platform, appSlug }: { platform: Platform; appSlug?: string }) {
  const { ref, key, info, near } = useRelease(platform.url);
  const detail = useTestFlightDetail(platform, appSlug, near);
  const content = <><span className={`status-dot status-${platform.status.replace(" ", "-")}`} />{platform.name}<small>{key ? releaseDetail(platform.detail, info) : detail}</small>{platform.status === "TestFlight" && <b className="chip-status">TestFlight</b>}</>;
  return <span ref={ref}>{platform.url ? <a className="platform-chip" href={info ? snapshotDownloadPath(info) : platform.url}>{content}<span aria-hidden="true">↗</span></a> : <span className="platform-chip">{content}</span>}</span>;
}

export function ReleaseQr({ href, label }: { href: string; label: string }) {
  const url = new URL(href, "https://hanstree.com");
  const { ref, info } = useRelease<HTMLDivElement>(url.pathname + url.search);
  return <div ref={ref}><ClientDownloadQrCode href={info ? new URL(snapshotDownloadPath(info), url.origin).toString() : href} label={label} /></div>;
}
export function ReleaseLink({ platform, className }: { platform: Platform; className?: string }) {
  const { ref, info } = useRelease(platform.url);
  return <span ref={ref}><a className={className} href={info ? snapshotDownloadPath(info) : platform.url}>{platform.downloadLabel ?? "다운로드"} <span aria-hidden="true">↓</span></a></span>;
}
