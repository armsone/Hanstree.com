"use client";

import { useEffect, useState } from "react";

type Release = {
  appName: string;
  repo: string;
  available: boolean;
  tagName?: string;
  releaseName?: string;
  publishedAt?: string | null;
  releaseUrl?: string;
  asset?: { name: string; size: number; contentType: string; digest: string | null; downloadCount: number } | null;
};

type ReleaseResponse = { checkedAt: string; releases: Release[] };

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

  useEffect(() => {
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
  }, []);

  const placeholders: Release[] = [
    { appName: "한클립", repo: "HanClip-Android", available: false },
    { appName: "에스텐드", repo: "S.tand-Android", available: false },
  ];
  const releases = data?.releases || placeholders;

  return (
    <div>
      <div className="android-release-grid" aria-live="polite">
        {releases.map((release) => (
          <article className="android-release-card" key={release.repo}>
            <div className="android-release-head"><span className="android-mark">A</span><div><p>{release.repo}</p><h3>{release.appName} Android</h3></div></div>
            {release.available ? <>
              <div className="android-version"><strong>{release.tagName}</strong><span>최신 공개판</span></div>
              <dl>
                <div><dt>게시</dt><dd>{formatDate(release.publishedAt)}</dd></div>
                <div><dt>APK</dt><dd>{release.asset?.name || "릴리스 페이지에서 확인"}</dd></div>
                <div><dt>크기</dt><dd>{formatBytes(release.asset?.size)}</dd></div>
                <div><dt>SHA-256</dt><dd className="digest">{release.asset?.digest?.replace(/^sha256:/, "").slice(0, 12) || "GitHub 정보 없음"}</dd></div>
              </dl>
              <a className="android-release-link" href={release.releaseUrl}>GitHub에서 확인하고 받기 <span aria-hidden="true">↗</span></a>
            </> : <div className="android-release-loading"><strong>{failed ? "정보를 불러오지 못했습니다" : "최신 릴리스 확인 중"}</strong><p>{failed ? "잠시 뒤 다시 확인하거나 GitHub 저장소를 이용해 주세요." : "GitHub 공식 배포 정보를 안전하게 확인하고 있습니다."}</p></div>}
          </article>
        ))}
      </div>
      <p className="release-check-note">{data ? `GitHub 확인: ${formatDate(data.checkedAt)} · 30분 동안 캐시` : "공개 저장소만 조회하며 GitHub 비밀키는 사용하지 않습니다."}</p>
    </div>
  );
}
