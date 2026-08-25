"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import type { Platform } from "../data";

type Target = { href: string; label: string };

const SAFE_FALLBACK: Target = { href: "#download", label: "이 기기의 설치 방법 보기" };
const subscribeToBrowser = () => () => {};
const getBrowserSnapshot = () => true;
const getServerSnapshot = () => false;

function findByName(platforms: Platform[], test: RegExp) {
  return platforms.find((platform) => platform.url && test.test(platform.name));
}

function detectTarget(platforms: Platform[]): Target {
  if (typeof navigator === "undefined") return SAFE_FALLBACK;

  const ua = navigator.userAgent || "";
  const maxTouchPoints = navigator.maxTouchPoints || 0;
  const isTouchMac = /Macintosh/i.test(ua) && maxTouchPoints > 1;
  const isAndroid = /Android|GoogleTV|CrKey|AFT|BRAVIA|SMART-TV/i.test(ua);
  const isIOS = /iPhone|iPad|iPod/i.test(ua) || isTouchMac;
  const isMac = /Macintosh/i.test(ua) && !isTouchMac;
  const isWindows = /Windows/i.test(ua);

  let match: Platform | undefined;
  if (isAndroid) match = findByName(platforms, /android/i);
  else if (isIOS) match = findByName(platforms, /iphone|ipad|ios/i);
  else if (isMac) match = findByName(platforms, /mac/i);
  else if (isWindows) match = findByName(platforms, /windows/i);

  if (match?.url) return { href: match.url, label: match.downloadLabel ?? "지금 다운로드" };

  const web = findByName(platforms, /web/i);
  if (web?.url) return { href: web.url, label: web.downloadLabel ?? "지금 다운로드" };

  return SAFE_FALLBACK;
}

export function AppDownloadCta({ platforms, className }: { platforms: Platform[]; className: string }) {
  const isBrowser = useSyncExternalStore(subscribeToBrowser, getBrowserSnapshot, getServerSnapshot);
  const target = isBrowser ? detectTarget(platforms) : SAFE_FALLBACK;

  return (
    <Link className={className} href={target.href}>
      {target.label} <span aria-hidden="true">{target.href === "#download" ? "↓" : "↗"}</span>
    </Link>
  );
}
