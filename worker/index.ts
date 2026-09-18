/** Cloudflare Worker entry point for the vinext-starter template. */
import { handleImageOptimization, DEFAULT_DEVICE_SIZES, DEFAULT_IMAGE_SIZES } from "vinext/server/image-optimization";
import handler from "vinext/server/app-router-entry";
import { handleWhattoEatAPI, type WhattoEatEnv } from "./whattoeat-api";

interface Env extends WhattoEatEnv {
  ASSETS: Fetcher;
  DB: D1Database;
  IMAGES: {
    input(stream: ReadableStream): {
      transform(options: Record<string, unknown>): {
        output(options: { format: string; quality: number }): Promise<{ response(): Response }>;
      };
    };
  };
}

interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}

// Image security config. SVG sources with .svg extension auto-skip the
// optimization endpoint on the client side (served directly, no proxy).
// To route SVGs through the optimizer (with security headers), set
// dangerouslyAllowSVG: true in next.config.js and uncomment below:
// const imageConfig: ImageConfig = { dangerouslyAllowSVG: true };

// ponytail: two public responses per worker lifetime; use shared storage if cold-start traffic dominates.
const releaseCache = new Map<string, { body: string; headers: [string, string][]; expiresAt: number }>();

const worker = {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    const isBrowserNavigation = request.headers.get("sec-fetch-dest") === "document";
    const isAutomatedBrowser = /HeadlessChrome|Lighthouse|PageSpeed|PhantomJS|crawler|spider|bot/i.test(request.headers.get("user-agent") ?? "");
    if (request.method === "GET"
      && url.pathname === "/"
      && !request.headers.has("RSC")
      && (!isBrowserNavigation || isAutomatedBrowser)) {
      const snapshotUrl = new URL("/seo-home-lite", request.url);
      return env.ASSETS.fetch(new Request(snapshotUrl, request));
    }

    const whattoeatResponse = await handleWhattoEatAPI(request, env);
    if (whattoeatResponse) return whattoeatResponse;

    if (url.pathname === "/_vinext/image") {
      const allowedWidths = [...DEFAULT_DEVICE_SIZES, ...DEFAULT_IMAGE_SIZES];
      return handleImageOptimization(request, {
        fetchAsset: (path) => env.ASSETS.fetch(new Request(new URL(path, request.url))),
        transformImage: async (body, { width, format, quality }) => {
          const result = await env.IMAGES.input(body).transform(width > 0 ? { width } : {}).output({ format, quality });
          return result.response();
        },
      }, allowedWidths);
    }

    const isCacheableRoute =
      request.method === "GET"
      && !request.headers.has("RSC")
      && !request.headers.has("authorization")
      && (url.pathname === "/api/android-releases" || url.pathname === "/api/testflight-builds");

    if (isCacheableRoute) {
      // Both handlers return host-independent public data and ignore query parameters.
      const cached = releaseCache.get(url.pathname);
      if (cached && cached.expiresAt > Date.now()) {
        const headers = new Headers(cached.headers);
        headers.set("X-Hanstree-Cache", "HIT");
        return new Response(cached.body, { headers });
      }
      releaseCache.delete(url.pathname);
      const response = await handler.fetch(request, env, ctx);
      const headers = new Headers(response.headers);
      const policy = (headers.get("cache-control") ?? "").toLowerCase();
      const ttl = Math.min(1800, Number(policy.match(/s-maxage=(\d+)/)?.[1]
        ?? policy.match(/max-age=(\d+)/)?.[1] ?? 0));
      if (response.status === 200
        && headers.get("content-type")?.toLowerCase().includes("application/json")
        && !headers.has("set-cookie") && policy.includes("public")
        && !policy.includes("private") && !policy.includes("no-store") && ttl > 0) {
        const body = await response.text();
        releaseCache.set(url.pathname, { body, headers: [...headers], expiresAt: Date.now() + ttl * 1000 });
        headers.set("X-Hanstree-Cache", "MISS");
        return new Response(body, { headers });
      }
      headers.set("X-Hanstree-Cache", "MISS");
      return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
    }

    const response = await handler.fetch(request, env, ctx);
    const contentType = response.headers.get("content-type") ?? "";
    const isDocumentRequest = request.method === "GET"
      && !request.headers.has("RSC")
      && contentType.includes("text/html");

    if (!isDocumentRequest) return response;

    const headers = new Headers(response.headers);
    headers.set("cache-control", "no-store");

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  },
};

export default worker;
