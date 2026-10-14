"use client";
import { useEffect, useState } from "react";
import type { Platform } from "../data";
import { downloadKeyFromUrl, releaseDetail, snapshotDownloadPath, type ReleaseInfo } from "../releaseInfo";
import { ClientDownloadQrCode } from "./ClientDownloadQrCode";
import type { DownloadKey } from "../releases";
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
function useRelease<T extends HTMLElement = HTMLSpanElement>(url?: string) {
  const key = downloadKeyFromUrl(url);
  const [ref, near] = useNearViewport<T>();
  const [info, setInfo] = useState<ReleaseInfo | null>(null);
  useEffect(() => {
    let active = true;
    if (key && near) load(key).then((value) => { if (active) setInfo(value); });
    return () => { active = false; };
  }, [key, near]);
  return { ref, key, info };
}
export function ReleaseDetail({ platform }: { platform: Platform }) {
  const { ref, key, info } = useRelease(platform.url);
  return <span ref={ref}>{key ? releaseDetail(platform.detail, info) : platform.detail}</span>;
}
export function ReleaseVersion({ platform }: { platform: Platform }) {
  const { ref, key, info } = useRelease(platform.url);
  return <span ref={ref}>{key ? info?.version ? ` ${info.version}${info.source !== "github" ? " (확인 정보)" : ""}` : "" : ` ${platform.detail.match(/\d+\.\d+(?:\.\d+)?/)?.[0] ?? ""}`}</span>;
}
export function ReleaseDownload({ platform, className }: { platform: Platform; className?: string }) {
  const { ref, key, info } = useRelease<HTMLDivElement>(platform.url);
  return <div ref={ref}>
    <p>{key ? releaseDetail(platform.detail, info) : platform.detail} · {platform.status}</p>
    <a className={className} href={info ? snapshotDownloadPath(info) : platform.url}>{platform.downloadLabel ?? "다운로드"} <span aria-hidden="true">↗</span></a>
    {info?.asset?.size && <small style={{ display: "block" }}>{(info.asset.size / 1024 / 1024).toFixed(1)} MB{info.publishedAt ? ` · ${new Intl.DateTimeFormat("ko-KR", { dateStyle: "medium" }).format(new Date(info.publishedAt))}` : ""}</small>}
  </div>;
}
export function ReleasePlatformChip({ platform }: { platform: Platform }) {
  const { ref, key, info } = useRelease(platform.url);
  const content = <><span className={`status-dot status-${platform.status.replace(" ", "-")}`} />{platform.name}<small>{key ? releaseDetail(platform.detail, info) : platform.detail}</small>{platform.status === "TestFlight" && <b className="chip-status">TestFlight</b>}</>;
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
