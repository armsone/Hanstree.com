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
      const cache = typeof caches !== "undefined" ? (caches as unknown as { default?: Cache }).default : undefined;
      const cacheKey = new Request(`${url.origin}${url.pathname}`, { method: "GET" });

      let cachedResponse: Response | undefined;
      if (cache) {
        try {
          cachedResponse = await cache.match(cacheKey);
        } catch {
          cachedResponse = undefined;
        }
      }

      if (cachedResponse) {
        const hitHeaders = new Headers(cachedResponse.headers);
        const originalCacheControl = hitHeaders.get("X-Original-Cache-Control");
        if (originalCacheControl) {
          hitHeaders.set("Cache-Control", originalCacheControl);
          hitHeaders.delete("X-Original-Cache-Control");
        }
        hitHeaders.set("X-Hanstree-Cache", "HIT");
        return new Response(cachedResponse.body, {
          status: cachedResponse.status,
          statusText: cachedResponse.statusText,
          headers: hitHeaders,
        });
      }

      const response = await handler.fetch(request, env, ctx);
      const contentType = response.headers.get("content-type") ?? "";
      const isJson = contentType.toLowerCase().includes("application/json");
      const hasNoSetCookie = !response.headers.has("set-cookie");
      const cacheControl = response.headers.get("cache-control") ?? "";
      const isPublicPolicy = cacheControl.includes("public")
        && !cacheControl.includes("no-store")
        && !cacheControl.includes("private");

      const shouldCache = cache && response.status === 200 && isJson && hasNoSetCookie && isPublicPolicy;

      if (shouldCache) {
        const sMaxAgeMatch = cacheControl.match(/s-maxage=(\d+)/i);
        const maxAgeMatch = cacheControl.match(/max-age=(\d+)/i);
        const ttl = sMaxAgeMatch
          ? parseInt(sMaxAgeMatch[1], 10)
          : maxAgeMatch
            ? parseInt(maxAgeMatch[1], 10)
            : 300;

        if (ttl > 0) {
          const cacheHeaders = new Headers(response.headers);
          cacheHeaders.set("Cache-Control", `public, max-age=${ttl}`);
          cacheHeaders.set("X-Original-Cache-Control", cacheControl);

          const responseToCache = new Response(response.clone().body, {
            status: response.status,
            statusText: response.statusText,
            headers: cacheHeaders,
          });

          ctx.waitUntil(
            cache.put(cacheKey, responseToCache).catch(() => {
              // Non-blocking: cache put error should never block render
            })
          );
        }
      }

      const returnHeaders = new Headers(response.headers);
      returnHeaders.set("X-Hanstree-Cache", "MISS");
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: returnHeaders,
      });
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
