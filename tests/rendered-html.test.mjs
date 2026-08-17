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
  assert.match(html, /Super Thumbnail/);
  assert.match(html, /HanClip/);
  assert.match(html, /S\.tand/);
  assert.match(html, /CCMB/);
  assert.match(html, /TrackpadGuard/);
  assert.match(html, /intoSharp/);
  assert.match(html, /airChurch/);
  assert.match(html, />17<\/strong><span>현재 소개하는 제품/);
  assert.doesNotMatch(html, /플랫폼별 제공 버전/);
  assert.match(html, />06<\/strong><span>iPhone · iPad · macOS · Android · Web · Windows \(커밍\)/);
  assert.match(html, />01<\/strong><span>한 사람의 꾸준한 기록/);
  assert.match(html, /개인정보처리방침/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|Building your site/i);
});

test("renders Super Thumbnail as an independent Mac product", async () => {
  const [detailResponse, nasFinderResponse] = await Promise.all([
    render("/apps/super-thumbnail"),
    render("/apps/nasfinder"),
  ]);
  assert.equal(detailResponse.status, 200);

  const [detail, nasFinder] = await Promise.all([detailResponse.text(), nasFinderResponse.text()]);
  assert.match(detail, /큰 미디어 폴더의 미리보기를/);
  assert.match(detail, /NasFinder-Super-Thumbnail-1\.0\.0\.zip/);
  assert.match(detail, /16,540/);
  assert.doesNotMatch(nasFinder, /NasFinder-Super-Thumbnail-1\.0\.0\.zip/);
});

test("renders the TrackpadGuard product, support link, and requested default region", async () => {
  const [detailResponse, supportResponse] = await Promise.all([
    render("/apps/trackpadguard"),
    render("/apps/trackpadguard/support"),
  ]);
  assert.equal(detailResponse.status, 200);
  assert.equal(supportResponse.status, 200);

  const [html, supportHTML] = await Promise.all([
    detailResponse.text(),
    supportResponse.text(),
  ]);
  assert.match(html, /타이핑할 때는 잠그고/);
  assert.match(html, /상단 1\/3을 제거한 사다리꼴/);
  assert.match(html, /Control-Option-Command-Escape/);
  assert.match(supportHTML, /https:\/\/github\.com\/armsone\/TrackpadGuard/);
});

test("renders the intoSharp and airChurch product pages", async () => {
  const [intoResponse, churchResponse] = await Promise.all([
    render("/apps/intosharp"),
    render("/apps/airchurch"),
  ]);
  assert.equal(intoResponse.status, 200);
  assert.equal(churchResponse.status, 200);

  const [intoSharp, airChurch] = await Promise.all([intoResponse.text(), churchResponse.text()]);
  assert.match(intoSharp, /주소 대신 이름으로 여는 첫 화면/);
  assert.match(intoSharp, /https:\/\/intosharp\.com\//);
  assert.match(airChurch, /좋은 말씀과 선한 마음이 만나는 곳/);
  assert.match(airChurch, /https:\/\/airchurch\.net\//);
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

test("publishes browser and home-screen app icons", async () => {
  const response = await render();
  const html = await response.text();
  const manifest = JSON.parse(await readFile(new URL("../public/site.webmanifest", import.meta.url), "utf8"));

  assert.match(html, /rel="manifest" href="\/site\.webmanifest"/);
  assert.match(html, /rel="icon" href="\/favicon\.ico"/);
  assert.match(html, /rel="apple-touch-icon" href="\/apple-touch-icon\.png"[^>]*sizes="180x180"/);
  assert.equal(manifest.name, "NasFinder.com");
  assert.equal(manifest.start_url, "/");
  assert.equal(manifest.theme_color, "#17171a");
  assert.equal(manifest.background_color, "#f6f5f1");
  assert.deepEqual(manifest.icons.map(({ sizes }) => sizes), ["192x192", "512x512"]);
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

  assert.match(home, /3\.11\.52/);
  assert.match(home, /0\.31\.0/);
  assert.match(nasFinder, /APK v3/);
  assert.match(hanClip, /APK v548/);
  assert.match(stand, /APK v53/);
  assert.doesNotMatch(home + nasFinder + hanClip + stand, /첫 공개판 준비 중|APK v2\b|APK v544\b|APK v52\b/);
  assert.doesNotMatch(hanClip, /android-editor-finish-pets\.png/);
});
