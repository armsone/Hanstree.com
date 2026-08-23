const REDTABLE_BASE_URL = "https://seoul.openapi.redtable.global";
const REDTABLE_CDN_BASE_URL =
  "https://ukcooyocdlvo8099722.cdn.ntruss.com/public_data/";
const REDTABLE_SOURCE_URL = "https://seoul.openapi.redtable.global/";
const UPSTREAM_TIMEOUT_MS = 10_000;
const MAX_PHOTOS_PER_RESTAURANT = 8;
const SHARD_COUNT = 32;

export interface RedTableEnv {
  DB?: D1Database;
  REDTABLE_API_TOKEN?: string;
  REDTABLE_SYNC_SECRET?: string;
}

interface RedTablePhoto {
  id: string;
  url: string;
  kind: "restaurantVerified" | "menuVerified";
  restaurantID: string;
  restaurantName: string;
}

interface RedTablePayload {
  header?: {
    resultCode?: string;
    resultMsg?: string;
    numOfRows?: number;
    pageNo?: number;
    totalCount?: number;
  };
  body?: Array<Record<string, unknown>>;
}

interface CachedRestaurantPhotos {
  restaurantIDs: string[];
  photos: RedTablePhoto[];
}

export function normalizeRedTableName(value: unknown): string {
  return String(value || "")
    .normalize("NFKC")
    .toLocaleLowerCase("ko-KR")
    .replace(/[^0-9a-z가-힣]/g, "");
}

function json(status: number, body: unknown): Response {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

function safePhotoURL(value: unknown, relative: boolean): string | null {
  const raw = String(value || "").trim();
  if (!raw) return null;
  try {
    const url = new URL(relative ? raw.replace(/^\/+/, "") : raw, relative ? REDTABLE_CDN_BASE_URL : undefined);
    return url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}

async function fetchPage(
  endpoint: "/api/rstr/img" | "/api/food/img",
  pageNo: number,
  token: string,
): Promise<RedTablePayload> {
  const params = new URLSearchParams({ serviceKey: token, pageNo: String(pageNo) });
  const response = await fetch(`${REDTABLE_BASE_URL}${endpoint}?${params}`, {
    signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
  });
  if (!response.ok) throw new Error(`redtable_${response.status}`);
  const payload = await response.json() as RedTablePayload;
  if (payload.header?.resultCode !== "00") {
    throw new Error(`redtable_${payload.header?.resultCode || "invalid_response"}`);
  }
  return payload;
}

function photoFromRow(
  row: Record<string, unknown>,
  endpoint: "/api/rstr/img" | "/api/food/img",
): RedTablePhoto | null {
  const restaurantID = String(row.RSTR_ID || "").trim();
  const restaurantName = String(row.RSTR_NM || "").trim();
  const isRestaurant = endpoint === "/api/rstr/img";
  const url = safePhotoURL(
    isRestaurant ? row.RSTR_IMG_URL : row.FOOD_IMG_URL,
    isRestaurant,
  );
  if (!restaurantID || !restaurantName || !url) return null;
  return {
    id: `redtable:${restaurantID}:${isRestaurant ? "restaurant" : String(row.MENU_ID || "menu")}:${url}`,
    url,
    kind: isRestaurant ? "restaurantVerified" : "menuVerified",
    restaurantID,
    restaurantName,
  };
}

async function fetchAllPhotos(
  endpoint: "/api/rstr/img" | "/api/food/img",
  token: string,
): Promise<RedTablePhoto[]> {
  const first = await fetchPage(endpoint, 1, token);
  const firstRows = first.body || [];
  const pageSize = Math.max(1, Number(first.header?.numOfRows) || firstRows.length || 1);
  const totalCount = Math.max(firstRows.length, Number(first.header?.totalCount) || 0);
  const pageCount = Math.max(1, Math.ceil(totalCount / pageSize));
  const payloads: RedTablePayload[] = [first];
  for (let start = 2; start <= pageCount; start += 3) {
    const pages = Array.from(
      { length: Math.min(3, pageCount - start + 1) },
      (_, index) => fetchPage(endpoint, start + index, token),
    );
    payloads.push(...await Promise.all(pages));
  }
  return payloads.flatMap(payload =>
    (payload.body || []).map(row => photoFromRow(row, endpoint)).filter(Boolean) as RedTablePhoto[]
  );
}

function groupedPhotos(photos: RedTablePhoto[]): Map<string, CachedRestaurantPhotos> {
  const grouped = new Map<string, CachedRestaurantPhotos>();
  for (const photo of photos) {
    const key = normalizeRedTableName(photo.restaurantName);
    if (!key) continue;
    const entry = grouped.get(key) || { restaurantIDs: [], photos: [] };
    if (!entry.restaurantIDs.includes(photo.restaurantID)) entry.restaurantIDs.push(photo.restaurantID);
    if (!entry.photos.some(candidate => candidate.url === photo.url)) entry.photos.push(photo);
    grouped.set(key, entry);
  }
  for (const entry of grouped.values()) {
    entry.photos.sort((a, b) => (a.kind === b.kind ? 0 : a.kind === "restaurantVerified" ? -1 : 1));
    entry.photos = entry.photos.slice(0, MAX_PHOTOS_PER_RESTAURANT);
  }
  return grouped;
}

function shardForName(name: string): number {
  let hash = 2166136261;
  for (const character of name) {
    hash ^= character.codePointAt(0) || 0;
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0) % SHARD_COUNT;
}

function shardedEntries(grouped: Map<string, CachedRestaurantPhotos>) {
  const shards = Array.from(
    { length: SHARD_COUNT },
    () => ({} as Record<string, CachedRestaurantPhotos>),
  );
  for (const [name, entry] of grouped) shards[shardForName(name)][name] = entry;
  return shards;
}

function insertShardsStatement(
  db: D1Database,
  shards: Array<Record<string, CachedRestaurantPhotos>>,
) {
  const values = shards.map(() => "(?, ?, ?)").join(", ");
  const updatedAt = new Date().toISOString();
  const bindings = shards.flatMap((entries, shardID) => [
    shardID,
    JSON.stringify(entries),
    updatedAt,
  ]);
  return db.prepare(
    `INSERT INTO whattoeat_redtable_photo_shards_next
      (shard_id, entries_json, updated_at)
     VALUES ${values}`,
  ).bind(...bindings);
}

async function refreshCache(env: RedTableEnv): Promise<{ restaurants: number; photos: number }> {
  if (!env.DB || !env.REDTABLE_API_TOKEN) throw new Error("redtable_not_configured");
  const [restaurantPhotos, foodPhotos] = await Promise.all([
    fetchAllPhotos("/api/rstr/img", env.REDTABLE_API_TOKEN),
    fetchAllPhotos("/api/food/img", env.REDTABLE_API_TOKEN),
  ]);
  const grouped = groupedPhotos([...restaurantPhotos, ...foodPhotos]);
  const shards = shardedEntries(grouped);
  await env.DB.prepare("DELETE FROM whattoeat_redtable_photo_shards_next").run();
  await insertShardsStatement(env.DB, shards).run();
  await env.DB.batch([
    env.DB.prepare("DELETE FROM whattoeat_redtable_photo_shards"),
    env.DB.prepare(
      `INSERT INTO whattoeat_redtable_photo_shards
        (shard_id, entries_json, updated_at)
       SELECT shard_id, entries_json, updated_at
       FROM whattoeat_redtable_photo_shards_next`,
    ),
    env.DB.prepare("DELETE FROM whattoeat_redtable_photo_shards_next"),
  ]);
  return { restaurants: grouped.size, photos: restaurantPhotos.length + foodPhotos.length };
}

export async function handleRedTableSync(
  request: Request,
  env: RedTableEnv,
): Promise<Response | null> {
  const url = new URL(request.url);
  if (url.pathname !== "/api/whattoeat/redtable/sync") return null;
  if (request.method !== "POST") return json(405, { error: "method_not_allowed" });
  if (!env.REDTABLE_API_TOKEN || !env.REDTABLE_SYNC_SECRET || !env.DB) {
    return json(503, { error: "redtable_not_configured" });
  }
  if (request.headers.get("Authorization") !== `Bearer ${env.REDTABLE_SYNC_SECRET}`) {
    return json(401, { error: "unauthorized" });
  }
  try {
    return json(200, { status: "ok", ...await refreshCache(env) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown";
    return json(502, { error: "redtable_sync_failed", upstream: message });
  }
}

export async function enrichWithRedTable<T extends Record<string, unknown>>(
  restaurants: T[],
  env: RedTableEnv,
): Promise<T[]> {
  if (!env.DB || restaurants.length === 0) return restaurants;
  const names = [...new Set(restaurants.map(item => normalizeRedTableName(item.name)).filter(Boolean))];
  if (names.length === 0) return restaurants;
  const shardIDs = [...new Set(names.map(shardForName))];
  const placeholders = shardIDs.map(() => "?").join(", ");
  const result = await env.DB.prepare(
    `SELECT shard_id, entries_json
     FROM whattoeat_redtable_photo_shards
     WHERE shard_id IN (${placeholders})`,
  ).bind(...shardIDs).all<{
    shard_id: number;
    entries_json: string;
  }>();
  const matches = new Map<string, CachedRestaurantPhotos>();
  for (const row of result.results || []) {
    try {
      const entries = JSON.parse(row.entries_json) as Record<string, CachedRestaurantPhotos>;
      for (const name of names) {
        const entry = entries[name];
        if (entry) matches.set(name, entry);
      }
    } catch { /* 손상된 색인 묶음은 기존 사진 공급자로 넘긴다. */ }
  }
  const usedURLs = new Set<string>();
  return restaurants.map(restaurant => {
    const match = matches.get(normalizeRedTableName(restaurant.name));
    if (!match) return restaurant;
    try {
      // 같은 이름이 여러 지점에 쓰이면 잘못된 지점 사진을 붙이지 않는다.
      if (match.restaurantIDs.length !== 1) return restaurant;
      const photo = match.photos.find(candidate => !usedURLs.has(candidate.url));
      if (!photo) return restaurant;
      usedURLs.add(photo.url);
      return {
        ...restaurant,
        photoURL: photo.url,
        photoKind: photo.kind,
        photoProvider: "서울관광재단 음식관광 OPEN API",
        photoSourceURL: REDTABLE_SOURCE_URL,
        photoAttribution: "서울관광재단 음식관광 데이터",
        photoLicense: "이용허락범위 제한 없음",
        photoId: photo.id,
        photoMatchEvidence: { exactNormalizedName: true, redTableRestaurantID: photo.restaurantID },
      };
    } catch {
      return restaurant;
    }
  });
}
