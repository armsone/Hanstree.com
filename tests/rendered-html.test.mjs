import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${pathname}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the NasFinder.com homepage", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<html lang="ko">/i);
  assert.match(html, /<title>NasFinder\.com — 일상 가까이, 꼭 필요한 앱<\/title>/i);
  assert.match(html, /NasFinder/);
  assert.match(html, /HanClip/);
  assert.match(html, /S\.tand/);
  assert.match(html, /CCMB/);
  assert.match(html, /개인정보처리방침/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|Building your site/i);
});

test("keeps the support address out of the public source", async () => {
  const [component, route] = await Promise.all([
    readFile(new URL("../app/components/ContactReveal.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/api/support-contact/route.ts", import.meta.url), "utf8"),
  ]);
  const literalEmail = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/;

  assert.doesNotMatch(component, literalEmail);
  assert.doesNotMatch(route, literalEmail);
  assert.match(route, /process\.env\.SUPPORT_EMAIL/);
  assert.match(component, /\/api\/support-contact/);
});

test("shows the CCMB menu bar before the detailed usage menu", async () => {
  const response = await render("/apps/ccmb");
  assert.equal(response.status, 200);

  const html = await response.text();
  const menuBarIndex = html.indexOf("/apps/ccmb/screens/macos-menubar.png");
  const usageMenuIndex = html.indexOf("/apps/ccmb/screens/ccmb-usage-menu.png");

  assert.notEqual(menuBarIndex, -1);
  assert.notEqual(usageMenuIndex, -1);
  assert.ok(menuBarIndex < usageMenuIndex);
});

test("renders current app release and TestFlight information", async () => {
  const [homeResponse, nasFinderResponse, hanClipResponse, standResponse] = await Promise.all([
    render(),
    render("/apps/nasfinder"),
    render("/apps/hanclip"),
    render("/apps/stand"),
  ]);
  const [home, nasFinder, hanClip, stand] = await Promise.all([
    homeResponse.text(),
    nasFinderResponse.text(),
    hanClipResponse.text(),
    standResponse.text(),
  ]);

  assert.match(home, /3\.11\.51/);
  assert.match(home, /0\.31\.0/);
  assert.match(nasFinder, /APK v3/);
  assert.match(hanClip, /APK v547/);
  assert.match(stand, /APK v53/);
  assert.doesNotMatch(home + nasFinder + hanClip + stand, /첫 공개판 준비 중|APK v2\b|APK v544\b|APK v52\b/);
  assert.doesNotMatch(hanClip, /android-editor-finish-pets\.png/);
});
