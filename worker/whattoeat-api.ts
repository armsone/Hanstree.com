// @ts-expect-error The photo matcher is shared JavaScript from the iOS backend.
import { createPhotoProvider } from "./whattoeat-photos.js";

export interface WhattoEatEnv {
  KAKAO_REST_API_KEY?: string;
  TOUR_API_SERVICE_KEY?: string;
  SEARCH_RADIUS_METERS?: string;
}

const KAKAO_ENDPOINT = "https://dapi.kakao.com/v2/local/search/category.json";
const PAGE_SIZE = 15;
const MAX_PAGES = 4;
const MAX_UNIQUE = 13;
const UPSTREAM_TIMEOUT_MS = 5_000;
const DISCLAIMER =
  "카카오 로컬 API(카테고리 검색 FD6)는 메뉴, 판매 인기, 현재 영업 여부를 제공하지 않습니다. " +
  "폐업·휴업 필터링은 적용되어 있지 않으므로 실제 이용 전 지도에서 확인이 필요합니다.";

function json(status: number, body: unknown): Response {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function coordinate(value: string | null, min: number, max: number): number | null {
  if (!value?.trim()) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= min && parsed <= max ? parsed : null;
}

function restaurant(document: Record<string, string>) {
  return {
    id: document.id,
    name: document.place_name,
    category: document.category_name || "",
    latitude: Number(document.y),
    longitude: Number(document.x),
    distanceMeters: document.distance ? Number(document.distance) : null,
    address: document.address_name || null,
    roadAddress: document.road_address_name || null,
    phone: document.phone || null,
    placeURL: document.place_url || null,
    isOpenNow: null,
    curatedMenus: null,
  };
}

async function kakaoPage(
  latitude: number,
  longitude: number,
  page: number,
  radius: number,
  apiKey: string,
) {
  const params = new URLSearchParams({
    category_group_code: "FD6",
    x: String(longitude),
    y: String(latitude),
    radius: String(radius),
    sort: "distance",
    size: String(PAGE_SIZE),
    page: String(page),
  });
  const response = await fetch(`${KAKAO_ENDPOINT}?${params}`, {
    headers: { Authorization: `KakaoAK ${apiKey}` },
    signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
  });
  if (!response.ok) throw new Error(`kakao_${response.status}`);
  return response.json() as Promise<{
    documents?: Array<Record<string, string>>;
    meta?: { is_end?: boolean };
  }>;
}

export async function handleWhattoEatAPI(
  request: Request,
  env: WhattoEatEnv,
): Promise<Response | null> {
  const url = new URL(request.url);
  if (url.pathname === "/api/whattoeat/health") return json(200, { status: "ok" });
  if (url.pathname !== "/api/restaurants") return null;
  if (request.method !== "GET") {
    return json(405, { error: "method_not_allowed", message: "GET만 지원합니다." });
  }

  const latitude = coordinate(url.searchParams.get("latitude"), -90, 90);
  const longitude = coordinate(url.searchParams.get("longitude"), -180, 180);
  if (latitude === null || longitude === null) {
    return json(400, {
      error: "invalid_coordinates",
      message: "latitude(-90~90), longitude(-180~180) 쿼리 파라미터가 필요합니다.",
    });
  }
  if (!env.KAKAO_REST_API_KEY) {
    return json(503, {
      error: "server_not_configured",
      message: "음식점 검색 서버가 아직 준비되지 않았습니다.",
    });
  }

  const radius = clamp(Number(env.SEARCH_RADIUS_METERS) || 1_000, 100, 20_000);
  const byID = new Map<string, ReturnType<typeof restaurant>>();
  try {
    for (let page = 1; page <= MAX_PAGES; page += 1) {
      const result = await kakaoPage(latitude, longitude, page, radius, env.KAKAO_REST_API_KEY);
      for (const document of result.documents || []) {
        if (!byID.has(document.id)) byID.set(document.id, restaurant(document));
        if (byID.size >= MAX_UNIQUE) break;
      }
      if (byID.size >= MAX_UNIQUE || result.meta?.is_end) break;
    }
  } catch (error) {
    const name = error instanceof Error ? error.name : "";
    if (name === "TimeoutError" || name === "AbortError") {
      return json(504, {
        error: "upstream_timeout",
        message: "카카오 API 응답이 지연되고 있습니다. 잠시 후 다시 시도해 주세요.",
      });
    }
    return json(502, {
      error: "upstream_error",
      message: "카카오 API 호출에 실패했습니다. 잠시 후 다시 시도해 주세요.",
    });
  }

  let restaurants = [...byID.values()];
  try {
    const photos = createPhotoProvider({ tourApiServiceKey: env.TOUR_API_SERVICE_KEY || "" });
    restaurants = await photos.enrichRestaurants(restaurants);
  } catch {
    // 사진 공급자가 실패해도 식당 검색 결과는 반환한다.
  }

  return json(200, {
    restaurants,
    source: "kakao-local-category-FD6",
    disclaimer: DISCLAIMER,
  });
}
