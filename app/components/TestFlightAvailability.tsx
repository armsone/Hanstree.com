"use client";

import Link from "next/link";
import type { Platform } from "../data";
import type { TestFlightBuild } from "../testflight";
import { useLiveTestFlight, ReleaseQr, TestFlightBuildText } from "./ReleasePlatform";

// 실시간 상태를 적용하는 공개 베타 앱입니다. 그 밖의 제품은 기존 정적 표시를 그대로 유지합니다.
const LIVE_STATUS_SLUGS = new Set(["nasfinder", "hanclip", "stand", "starmanager", "denimdex", "button", "whattoeat", "barobogi"]);
const isLiveStatusApp = (appSlug: string) => LIVE_STATUS_SLUGS.has(appSlug);

export type ResolvedTestFlight = {
  isInstallable: boolean;
  inviteUrl: string | null;
  publicBetaState: TestFlightBuild["publicBetaState"];
  heroStatus: string;
  heroDescription: string;
  heroAction: string;
  downloadLabel: string;
  specLabel: string;
  pendingBadge: string;
  pendingCopy: string;
};

export function resolveTestFlight(
  appSlug: string,
  fallback: TestFlightBuild | null,
  live: TestFlightBuild | null,
  availabilityNote?: string,
): ResolvedTestFlight {
  const strict = isLiveStatusApp(appSlug);
  const active = strict ? live ?? fallback : fallback;
  const state: TestFlightBuild["publicBetaState"] = active?.publicBetaState ?? "needsExternalBuild";

  const waitingForReview = state === "waitingForReview";
  const rejected = state === "rejected";
  const needsReviewAccount = state === "needsReviewAccount";
  const internalOnly = state === "internalOnly";

  // 만료·초대 비활성·수정 요청·내부 전용은 설치 가능으로 표시하지 않습니다.
  // 최신 빌드가 심사 대기여도 열려 있는 기존 승인 초대 링크는 계속 유지합니다.
  const expired = strict && !rejected && !internalOnly && Boolean(active?.expiresAt && new Date(active.expiresAt).getTime() <= Date.now());
  const rawInviteUrl = active?.inviteAvailable !== false && !expired ? active?.inviteUrl ?? null : null;
  const isInstallable = Boolean(rawInviteUrl) && (!strict || (!rejected && !internalOnly));
  const inviteUrl = isInstallable ? rawInviteUrl : null;
  const linkClosed = strict && !expired && state === "approved" && !inviteUrl;

  const heroStatus = internalOnly
    ? "내부 전용 테스트"
    : expired
      ? "공개 베타 · 빌드 만료"
      : linkClosed
        ? "공개 베타 · 공개 링크 준비 중"
        : rejected
      ? "공개 베타 · Apple 심사 수정 요청"
      : waitingForReview
        ? appSlug === "barobogi"
          ? "공개 베타 · Apple 외부 심사 중"
          : "공개 베타 · Apple 심사 대기 중"
        : needsReviewAccount
          ? "공개 베타 · 심사용 계정 등록"
          : inviteUrl
            ? "TestFlight 공개 베타"
            : "공개 베타 · 빌드 준비 중";

  const heroDescription = internalOnly
    ? "회사 내부 업무용으로 공개 테스트를 운영하지 않습니다."
    : expired
      ? "TestFlight 빌드 사용 기간이 끝났습니다."
      : linkClosed
        ? "현재 공개 참여 링크를 사용할 수 없습니다."
        : rejected
      ? "Apple 심사에서 수정 요청이 있어 새 빌드가 필요합니다."
      : waitingForReview && inviteUrl
        ? "기존 공개 링크는 열려 있고, 최신 빌드는 Apple 심사를 기다리고 있습니다."
        : waitingForReview
          ? appSlug === "barobogi"
            ? "공개 참여는 Apple 심사 중입니다."
            : "Apple 공개 테스트 심사 중입니다."
          : needsReviewAccount
            ? "외부용 빌드는 준비됐고 심사용 계정을 등록하고 있습니다."
            : inviteUrl
              ? "신청서 없이 바로 테스트에 참여할 수 있습니다."
              : "외부 테스트용 새 빌드를 준비하고 있습니다.";

  const heroAction = waitingForReview ? "기존 공개 링크 열기" : "TestFlight에서 참여";

  const pendingBadge = internalOnly
    ? "내부 전용"
    : expired
      ? "빌드 만료"
      : linkClosed
        ? "링크 준비"
        : rejected
      ? "새 빌드 준비 필요"
      : waitingForReview
        ? "심사 중"
        : needsReviewAccount
          ? "심사 계정 준비"
          : "빌드 준비";

  const pendingCopy = appSlug === "barobogi" && waitingForReview && availabilityNote
    ? availabilityNote
    : internalOnly
      ? "회사 내부 전용"
      : expired
        ? "TestFlight 빌드 만료"
        : linkClosed
          ? "공개 링크 준비 중"
          : rejected
        ? "Apple 심사 수정 요청 · 새 빌드 준비 필요"
        : waitingForReview
          ? "새 빌드는 Apple 심사 대기 중"
          : needsReviewAccount
            ? "Apple 심사용 계정 준비 중"
            : "외부 테스트용 빌드 준비 중";

  const downloadLabel = waitingForReview ? "기존 TestFlight 공개 링크" : "TestFlight 바로 참여";

  const testFlightStateLabel: Record<TestFlightBuild["publicBetaState"], string> = {
    approved: "공개 베타 참여 가능",
    waitingForReview: "Apple 심사 대기",
    rejected: "새 빌드 준비 필요",
    needsExternalBuild: "외부용 빌드 준비",
    needsReviewAccount: "심사 계정 준비",
    internalOnly: "내부 전용",
  };

  const specLabel = expired
    ? "빌드 만료"
    : linkClosed
      ? "공개 링크 준비 중"
      : appSlug === "barobogi" && waitingForReview
        ? "Apple 외부 베타 심사 중"
        : testFlightStateLabel[state];

  return {
    isInstallable,
    inviteUrl,
    publicBetaState: state,
    heroStatus,
    heroDescription,
    heroAction,
    downloadLabel,
    specLabel,
    pendingBadge,
    pendingCopy,
  };
}

export function TestFlightHeroCard({
  appSlug,
  fallback,
  platforms,
}: {
  appSlug: string;
  fallback: TestFlightBuild | null;
  platforms: Platform[];
}) {
  const live = useLiveTestFlight(appSlug, isLiveStatusApp(appSlug));
  const testFlightPlatforms = platforms.filter((platform) => platform.status === "TestFlight");
  if (testFlightPlatforms.length === 0) return null;

  const resolved = resolveTestFlight(appSlug, fallback, live);

  return (
    <div className={`hero-beta-card${resolved.inviteUrl ? " hero-beta-card-ready" : ""}`}>
      <div>
        <span>{resolved.heroStatus}</span>
        <strong>{resolved.heroDescription}</strong>
        <small>{testFlightPlatforms.map((platform) => platform.name).join(" · ")}</small>
      </div>
      {resolved.inviteUrl ? (
        <a href={resolved.inviteUrl} target="_blank" rel="noreferrer">
          {resolved.heroAction} <span aria-hidden="true">↗</span>
        </a>
      ) : (
        <span className="hero-beta-pending">{resolved.pendingBadge}</span>
      )}
    </div>
  );
}

export function TestFlightHeroAction({
  appSlug,
  fallback,
}: {
  appSlug: string;
  fallback: TestFlightBuild | null;
}) {
  const live = useLiveTestFlight(appSlug, isLiveStatusApp(appSlug));
  const resolved = resolveTestFlight(appSlug, fallback, live);

  if (resolved.inviteUrl) {
    return (
      <a className="button button-primary" href={resolved.inviteUrl} target="_blank" rel="noreferrer">
        TestFlight 참여 <span aria-hidden="true">↗</span>
      </a>
    );
  }

  return (
    <Link className="button button-primary" href="#progress">
      진행 상황 보기 <span aria-hidden="true">↓</span>
    </Link>
  );
}

export function TestFlightDownloadAction({
  appSlug,
  fallback,
  availabilityNote,
}: {
  appSlug: string;
  fallback: TestFlightBuild | null;
  availabilityNote?: string;
}) {
  const live = useLiveTestFlight(appSlug, isLiveStatusApp(appSlug));
  const resolved = resolveTestFlight(appSlug, fallback, live, availabilityNote);

  if (resolved.inviteUrl) {
    return (
      <a className="testflight-apply-download" href={resolved.inviteUrl}>
        {resolved.downloadLabel} <span aria-hidden="true">↗</span>
      </a>
    );
  }

  return <span>{resolved.pendingCopy}</span>;
}

export function TestFlightDownloadQr({
  appSlug,
  fallback,
}: {
  appSlug: string;
  fallback: TestFlightBuild | null;
}) {
  const live = useLiveTestFlight(appSlug, isLiveStatusApp(appSlug));
  const resolved = resolveTestFlight(appSlug, fallback, live);

  if (!resolved.inviteUrl) return null;
  return <ReleaseQr href={resolved.inviteUrl} label="TestFlight 외부 테스터 참여" />;
}

export function TestFlightSpecStatus({
  appSlug,
  fallback,
}: {
  appSlug: string;
  fallback: TestFlightBuild | null;
}) {
  const live = useLiveTestFlight(appSlug, isLiveStatusApp(appSlug));
  const resolved = resolveTestFlight(appSlug, fallback, live);
  const buildFallback = fallback?.build ?? "";

  return (
    <>
      {resolved.inviteUrl ? <a href={resolved.inviteUrl}>{resolved.specLabel}</a> : resolved.specLabel}
      {buildFallback && <TestFlightBuildText appSlug={appSlug} fallback={buildFallback} />}
    </>
  );
}
