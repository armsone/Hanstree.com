const AUTOMATION_USER_AGENT = /(?:bot(?:[/;\s)]|$)|\b(?:crawler|spider|slurp|headlesschrome|phantomjs|wget|curl)\b|python-requests|go-http-client|alittle client)/i;

export function requestLooksAutomated(request: Request) {
  const userAgent = request.headers.get("user-agent")?.trim() || "";
  return !userAgent || AUTOMATION_USER_AGENT.test(userAgent);
}

function sameOrigin(value: string | null, request: Request) {
  if (!value) return false;
  try {
    return new URL(value).origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}

export function isTrustedDownloadNavigation(request: Request) {
  if (requestLooksAutomated(request) || !sameOrigin(request.headers.get("referer"), request)) return false;

  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite && fetchSite !== "same-origin" && fetchSite !== "same-site") return false;

  const fetchMode = request.headers.get("sec-fetch-mode");
  if (fetchMode && fetchMode !== "navigate") return false;

  const fetchDestination = request.headers.get("sec-fetch-dest");
  return !fetchDestination || fetchDestination === "document";
}

export function isTrustedSameSiteEvent(request: Request) {
  if (requestLooksAutomated(request) || !sameOrigin(request.headers.get("origin"), request)) return false;
  const fetchSite = request.headers.get("sec-fetch-site");
  return !fetchSite || fetchSite === "same-origin" || fetchSite === "same-site";
}

// Bounded, privacy-safe traffic-source classification: only a fixed list of
// known public sources plus direct/other/campaign categories are ever stored.
export type SourceCategory = "direct" | "search" | "social" | "ai" | "referral" | "campaign" | "other";

type SourceDefinition = { host: RegExp; source: string; category: SourceCategory };

const KNOWN_SOURCES: SourceDefinition[] = [
  { host: /(^|\.)gemini\.google\.com$/, source: "gemini", category: "ai" },
  { host: /(^|\.)google\.[a-z.]+$/, source: "google", category: "search" },
  { host: /(^|\.)naver\.com$/, source: "naver", category: "search" },
  { host: /(^|\.)bing\.com$/, source: "bing", category: "search" },
  { host: /(^|\.)daum\.net$/, source: "daum", category: "search" },
  { host: /(^|\.)(youtube\.com|youtu\.be)$/, source: "youtube", category: "social" },
  { host: /(^|\.)github\.com$/, source: "github", category: "referral" },
  { host: /(^|\.)instagram\.com$/, source: "instagram", category: "social" },
  { host: /(^|\.)(facebook\.com|fb\.com)$/, source: "facebook", category: "social" },
  { host: /(^|\.)(x\.com|twitter\.com)$/, source: "x", category: "social" },
  { host: /(^|\.)linkedin\.com$/, source: "linkedin", category: "social" },
  { host: /(^|\.)kakao\.com$/, source: "kakao", category: "social" },
  { host: /(^|\.)(chatgpt\.com|chat\.openai\.com)$/, source: "chatgpt", category: "ai" },
];

const SOURCE_ALIASES: Record<string, string> = {
  google: "google", naver: "naver", bing: "bing", daum: "daum",
  youtube: "youtube", github: "github", instagram: "instagram",
  facebook: "facebook", fb: "facebook", twitter: "x", x: "x",
  linkedin: "linkedin", kakao: "kakao", kakaotalk: "kakao",
  chatgpt: "chatgpt", openai: "chatgpt", gemini: "gemini",
};

export const SOURCE_LABELS: Record<string, string> = {
  direct: "직접 방문", google: "Google 검색", naver: "네이버 검색", bing: "Bing 검색", daum: "다음 검색",
  youtube: "YouTube", github: "GitHub", instagram: "Instagram", facebook: "Facebook",
  x: "X (Twitter)", linkedin: "LinkedIn", kakao: "카카오", chatgpt: "ChatGPT", gemini: "Gemini",
  "other-referral": "기타 사이트", campaign: "캠페인 링크",
};

export const CATEGORY_LABELS: Record<SourceCategory, string> = {
  direct: "직접 방문", search: "검색 유입", social: "소셜/커뮤니티", ai: "AI 어시스턴트",
  referral: "다른 사이트 링크", campaign: "캠페인", other: "기타",
};

function normalizeToken(value: string) {
  return value.trim().toLowerCase().slice(0, 40);
}

function hostnameOf(value: string) {
  try {
    return new URL(value).hostname.toLowerCase();
  } catch {
    return "";
  }
}

function knownSourceFromHost(host: string) {
  return KNOWN_SOURCES.find((entry) => entry.host.test(host));
}

export type TrafficSource = { key: string; category: SourceCategory };

// Never trusts a client-supplied display label or counter key: only raw
// referrer/UTM strings go in, and this derives the stored key server-side.
export function classifyTrafficSource(request: Request, referrer: unknown, utmSource: unknown, utmMedium: unknown): TrafficSource {
  const referrerHost = typeof referrer === "string" ? hostnameOf(referrer.slice(0, 2048)) : "";
  const requestHost = (() => {
    try {
      return new URL(request.url).hostname.toLowerCase();
    } catch {
      return "";
    }
  })();
  const externalReferrerHost = referrerHost && referrerHost !== requestHost ? referrerHost : "";

  const normalizedUtmSource = typeof utmSource === "string" ? normalizeToken(utmSource) : "";
  const normalizedUtmMedium = typeof utmMedium === "string" ? normalizeToken(utmMedium) : "";
  if (normalizedUtmSource || normalizedUtmMedium) {
    const alias = SOURCE_ALIASES[normalizedUtmSource];
    if (alias) return { key: alias, category: KNOWN_SOURCES.find((entry) => entry.source === alias)?.category ?? "referral" };
    return { key: "campaign", category: "campaign" };
  }

  if (externalReferrerHost) {
    const known = knownSourceFromHost(externalReferrerHost);
    if (known) return { key: known.source, category: known.category };
    return { key: "other-referral", category: "referral" };
  }

  return { key: "direct", category: "direct" };
}

export function describeSourceKey(key: string) {
  const category: SourceCategory = key === "direct" ? "direct" : key === "campaign" ? "campaign" : key === "other-referral" ? "referral" : (knownSourceFromKey(key)?.category ?? "other");
  return { source: key, category, label: SOURCE_LABELS[key] ?? key, categoryLabel: CATEGORY_LABELS[category] };
}

function knownSourceFromKey(key: string) {
  return KNOWN_SOURCES.find((entry) => entry.source === key);
}
