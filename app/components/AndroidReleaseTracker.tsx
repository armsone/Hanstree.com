"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AdvantageVisual, type AdvantageVariant } from "./AdvantageVisual";
import { findApp } from "../data";
import { appCardIcon } from "../media";
import { releaseDownloadPath, type DownloadKey } from "../releases";
import { useNearViewport } from "./useNearViewport";

const ANDROID_APP_SLUGS: Record<string, string> = {
  "NasFinder-Android": "nasfinder",
  "HanClip-Android": "hanclip",
  "S.tand-Android": "stand",
  "HtOMS-BK": "htoms-brief",
  "OurButton-Android": "button",
  "Stargram-Android": "starmanager",
  "WhattoEat-Android": "whattoeat",
  "DenimDex-Android": "denimdex",
};

const installStepVisuals: AdvantageVariant[] = ["check-source", "android-bot", "touch-zone", "shield-safe"];

type Release = {
  appName: string;
  repo: DownloadKey;
  available: boolean;
  tagName?: string;
  releaseName?: string;
  publishedAt?: string | null;
  releaseUrl?: string;
  asset?: { name: string; size: number; contentType: string; digest: string | null; downloadCount: number } | null;
};

type ReleaseResponse = {
  checkedAt: string;
  releases: Release[];
  source?: "github-live" | "verified-fallback";
};

function releaseIdentityFor(release: Release, app: ReturnType<typeof findApp>) {
  const androidDetail = app?.platforms.find((platform) => platform.name.includes("Android"))?.detail;
  return {
    productVersion: androidDetail?.match(/\b\d+\.\d+\.\d+\b/)?.[0]
      || release.releaseName?.match(/\b\d+\.\d+\.\d+\b/)?.[0]
      || "버전 확인 중",
    buildNumber: androidDetail?.match(/빌드\s+(\d{12})/)?.[1] || "확인 중",
    internalCode: androidDetail?.match(/내부 코드\s+(\d+)/)?.[1] || "확인 중",
  };
}

function formatDate(value?: string | null) {
  if (!value) return "게시일 확인 중";
  return new Intl.DateTimeFormat("ko-KR", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(value));
}

function formatBytes(bytes?: number) {
  if (!bytes) return "크기 정보 없음";
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export function AndroidReleaseTracker() {
  const [data, setData] = useState<ReleaseResponse | null>(null);
  const [failed, setFailed] = useState(false);
  const [containerRef, isNearViewport] = useNearViewport<HTMLDivElement>();

  useEffect(() => {
    if (!isNearViewport) return;
    const controller = new AbortController();
    fetch("/api/android-releases", { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("release lookup failed");
        return response.json() as Promise<ReleaseResponse>;
      })
      .then(setData)
      .catch((error: unknown) => {
        if (!(error instanceof DOMException && error.name === "AbortError")) setFailed(true);
      });
    return () => controller.abort();
  }, [isNearViewport]);

  const placeholders: Release[] = [
    { appName: "나스파인더", repo: "NasFinder-Android", available: false },
    { appName: "한클립", repo: "HanClip-Android", available: false },
    { appName: "S.tand", repo: "S.tand-Android", available: false },
    { appName: "HtOMS 브리프", repo: "HtOMS-BK", available: false },
    { appName: "OurButton", repo: "OurButton-Android", available: false },
    { appName: "Stargram", repo: "Stargram-Android", available: false },
    { appName: "오늘 뭐 먹지?", repo: "WhattoEat-Android", available: false },
    { appName: "데님덱스", repo: "DenimDex-Android", available: false },
  ];
  const releases = data?.releases || placeholders;

  return (
    <div ref={containerRef}>
      <div className="android-release-grid" aria-live="polite">
        {releases.map((release) => {
          const app = findApp(ANDROID_APP_SLUGS[release.repo]);
          const { productVersion, buildNumber, internalCode } = releaseIdentityFor(release, app);
          const displayName = release.appName;
          return <article className="android-release-card" key={release.repo}>
            <div className="android-release-head"><span className="android-app-mark">{app?.icon && <Image className="release-app-icon" src={appCardIcon(app)} alt={`${displayName} 앱 아이콘`} width={256} height={256} sizes="56px" unoptimized />}<span className="android-platform-badge"><img src="/brands/android.svg" alt="Android" /></span></span><div><p>{release.repo}</p><h3>{displayName}</h3></div></div>
            {release.available ? <>
              <div className="android-version"><strong>{productVersion}</strong><span>최신 공개판</span></div>
              <dl>
                <div><dt>빌드</dt><dd>{buildNumber}</dd></div>
                <div><dt>내부 코드</dt><dd>{internalCode}</dd></div>
                <div><dt>게시</dt><dd>{formatDate(release.publishedAt)}</dd></div>
                <div><dt>APK</dt><dd>{release.asset?.name || "릴리스 페이지에서 확인"}</dd></div>
                <div><dt>크기</dt><dd>{formatBytes(release.asset?.size)}</dd></div>
                <div><dt>SHA-256</dt><dd className="digest">{release.asset?.digest?.replace(/^sha256:/, "").slice(0, 12) || "GitHub 정보 없음"}</dd></div>
              </dl>
              <div className="android-release-actions">
                {release.asset && <a className="android-download-link" href={releaseDownloadPath(release.repo)} aria-label={`${displayName} ${productVersion} APK 바로 받기`}>
                  <span>APK 바로 받기</span><b aria-hidden="true">↓</b>
                </a>}
                <a className="android-release-link" href={release.releaseUrl}>릴리스 설명 보기 <span aria-hidden="true">↗</span></a>
              </div>
              <p className="android-download-note">홈페이지가 확인한 공식 GitHub APK가 바로 다운로드됩니다.</p>
            </> : <div className="android-release-loading"><strong>{failed ? "정보를 불러오지 못했습니다" : data ? "공개 APK를 찾지 못했습니다" : "최신 릴리스 확인 중"}</strong><p>{failed ? "잠시 뒤 다시 확인해 주세요. 확인되지 않은 주소나 APK는 표시하지 않습니다." : data ? "공식 GitHub Release에 검증 가능한 APK가 게시되면 다운로드 정보를 표시합니다." : "GitHub 공식 배포 정보를 안전하게 확인하고 있습니다."}</p></div>}
          </article>;
        })}
      </div>
      <p className="release-check-note">{data
        ? data.source === "verified-fallback"
          ? `GitHub 일시 지연 · 마지막 검증 정보 유지 · ${formatDate(data.checkedAt)}`
          : `GitHub 확인: ${formatDate(data.checkedAt)} · 30분 동안 캐시`
        : "공개 저장소만 조회하며 GitHub 비밀키는 사용하지 않습니다."}</p>
      <section className="android-install-guide" aria-labelledby="android-install-title">
        <div className="install-guide-lead">
          <p className="eyebrow">SAFE APK INSTALL</p>
          <h3 id="android-install-title">막혔을 때만,<br />필요한 문<br />하나만 엽니다.</h3>
          <p>APK 직접 설치는 Play 스토어 설치보다 위험할 수 있습니다. NasFinder.com이 연결한 공식 GitHub 릴리스를 확인한 경우에만 진행하세요.</p>
        </div>
        <ol className="install-steps">
          <li><span>01</span><div><AdvantageVisual variant={installStepVisuals[0]} /><h4>공식 파일인지 확인</h4><p>주소가 <strong>github.com/armsone</strong>으로 시작하는지, 앱 이름·제품 버전·APK 파일명과 SHA-256 정보가 홈페이지 표시와 맞는지 확인합니다. 메신저나 파일 공유 사이트에서 다시 받은 APK는 설치하지 않습니다.</p></div></li>
          <li><span>02</span><div><AdvantageVisual variant={installStepVisuals[1]} /><h4>먼저 그대로 설치 시도</h4><p>GitHub 릴리스에서 APK를 받은 뒤 다운로드 알림이나 내 파일에서 엽니다. 별도 경고 없이 설치되면 보안 설정을 바꿀 필요가 없습니다.</p></div></li>
          <li><span>03</span><div><AdvantageVisual variant={installStepVisuals[2]} /><h4>Galaxy에서 실제로 누르는 순서</h4><p className="sequence-intro">최근 Galaxy에서 GitHub APK 설치가 막히면 아래 두 보호 설정을 모두 확인해야 할 수 있습니다. 차단 화면에 표시된 앱만 허용하세요.</p><ol className="tap-sequence"><li><span><b>설정</b>을 엽니다.</span></li><li><span><b>보안 및 개인정보 보호</b>를 누릅니다.</span></li><li><span><b>기타 보안 설정</b>을 누릅니다.</span></li><li><span><b>알 수 없는 앱 설치</b>를 누릅니다.</span></li><li><span>APK를 연 앱—예: <b>Chrome, Samsung Internet 또는 내 파일</b>—을 누릅니다.</span></li><li><span><b>이 출처 허용</b>을 켭니다.</span></li><li><span>뒤로 두 번 이동해 <b>보안 및 개인정보 보호</b>로 돌아갑니다.</span></li><li><span><b>자동 차단</b>을 누르고, 공식 파일을 확인한 경우에만 스위치를 잠시 끕니다.</span></li><li><span>다운로드 알림 또는 <b>내 파일 → 다운로드</b>에서 APK를 다시 누릅니다.</span></li><li><span>설치 확인 화면에서 <b>설치</b>를 누릅니다. Google 앱 검사가 나오면 검사를 허용합니다.</span></li></ol><p className="menu-note">기기·통신사·One UI 버전에 따라 명칭이나 위치가 조금 다를 수 있습니다. 설정 검색에서 ‘알 수 없는 앱 설치’ 또는 ‘자동 차단’을 찾을 수도 있습니다.</p></div></li>
          <li><span>04</span><div><AdvantageVisual variant={installStepVisuals[3]} /><h4>설치 직후 두 설정 되돌리기</h4><ol className="tap-sequence compact"><li><span><b>설정 → 보안 및 개인정보 보호 → 기타 보안 설정 → 알 수 없는 앱 설치</b>로 돌아갑니다.</span></li><li><span>조금 전에 허용한 앱을 선택하고 <b>이 출처 허용</b>을 끕니다.</span></li><li><span><b>설정 → 보안 및 개인정보 보호 → 자동 차단</b>으로 이동해 다시 켭니다.</span></li></ol><p>Google의 앱 검사나 Play Protect는 끄지 않습니다. 경고가 계속되거나 서명이 다르다는 메시지가 나오면 설치를 중단합니다.</p></div></li>
        </ol>
        <div className="install-warning"><strong>꼭 기억하세요</strong><p>보호 기능 해제는 필수가 아니라 마지막 수단입니다. 출처를 확신할 수 없거나 예상과 다른 권한을 요구하면 설치하지 말고 GitHub 공개 문의로 확인해 주세요.</p></div>
        <div className="install-update-note"><strong>새 버전으로 업데이트할 때</strong><p>이 페이지에 더 새로운 제품 버전이 표시되면 같은 공식 GitHub Release의 APK를 받아 기존 앱 위에 설치합니다. 앱을 먼저 삭제하면 앱 안의 설정과 파일이 사라질 수 있습니다. Android가 서명이 다르다고 알리면 삭제로 우회하지 말고 업데이트를 중단해 주세요.</p></div>
        <div className="install-source-links"><a href="https://www.samsung.com/uk/support/mobile-devices/protect-your-galaxy-device-with-the-new-auto-blocker-feature/">Samsung 자동 차단 공식 안내 <span aria-hidden="true">↗</span></a><a href="https://support.google.com/android/answer/17065026?hl=ko">Android 개발자 확인 공식 안내 <span aria-hidden="true">↗</span></a></div>
      </section>
    </div>
  );
}
