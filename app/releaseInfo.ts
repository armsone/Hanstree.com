import { DOWNLOAD_KEYS, RELEASE_DOWNLOADS, releaseDownloadPath, type DownloadKey } from "./releases";

export type ReleaseInfo = {
  key: DownloadKey;
  releaseId: number | null;
  tagName: string;
  version: string | null;
  publishedAt: string | null;
  checkedAt: string | null;
  source: "github" | "saved" | "bootstrap";
  preview: boolean;
  downloadUrl: string;
  releaseUrl: string;
  asset: { name: string; size: number | null; sha256: string | null } | null;
  build: string | null;
  versionCode: number | null;
  minimumOS: string | null;
};

export function downloadKeyFromUrl(value?: string): DownloadKey | null {
  if (!value?.startsWith("/api/release-download?")) return null;
  const key = new URL(value, "https://hanstree.com").searchParams.get("app");
  return DOWNLOAD_KEYS.find((candidate) => candidate === key) ?? null;
}

export function snapshotDownloadPath(info: ReleaseInfo) {
  return `${releaseDownloadPath(info.key)}&release=${info.releaseId ?? "bootstrap"}`;
}

// Compatibility and historical descriptions stay editorial; only current release fields are replaced.
export function releaseDetail(detail: string, info?: ReleaseInfo | null) {
  const stable = detail.replace(/\b\d+\.\d+\.\d+(?:\s*\(\d+\))?/, "")
    .replace(/(?:내부\s*)?(?:빌드|build|versionCode|코드)\s*\d+/gi, "")
    .replace(/\(\d{12}\)/g, "").replace(/\s*·\s*(?=·|$)/g, "")
    .replace(/^\s*·\s*|\s*·\s*$/g, "").trim();
  const identity = info?.version ? [info.version, info.build ? `빌드 ${info.build}` : null].filter(Boolean).join(" · ") : "공개 버전 확인 중";
  return [identity, info?.minimumOS, stable, info && info.source !== "github" ? "마지막 확인 정보" : null].filter(Boolean).join(" · ");
}
