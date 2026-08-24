const AUTOMATION_USER_AGENT = /(?:bot(?:[\/;\s)]|$)|\b(?:crawler|spider|slurp|headlesschrome|phantomjs|wget|curl)\b|python-requests|go-http-client|alittle client)/i;

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
