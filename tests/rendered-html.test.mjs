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
  assert.match(html, /StarManager/);
  assert.match(html, />21<\/strong><span>현재 소개하는 제품/);
  assert.doesNotMatch(html, /플랫폼별 제공 버전/);
  assert.match(html, />06<\/strong><span>iPhone · iPad · macOS · Android · Web · Windows \(커밍\)/);
  assert.match(html, />01<\/strong><span>한 사람의 꾸준한 기록/);
  assert.match(html, /id="motion-bridge"/);
  assert.match(html, /움직이는 순간을/);
  assert.match(html, /Live Photo → Motion Photo/);
  assert.match(html, /Motion Photo → Live Photo/);
  assert.match(html, /QR 연결 · 사진 보관함 저장/);
  assert.match(html, /개인정보처리방침/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|Building your site/i);
});

test("renders the StarManager product and matchup disclosure", async () => {
  const response = await render("/apps/starmanager");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /오늘의 이야기를, 내 목소리로 완성합니다/);
  assert.match(html, /스타메니저 iPhone 만들기 화면/);
  assert.match(html, /TestFlight 업로드 완료/);
  assert.match(html, /Apple AI/);
  assert.match(html, /스타매니저 Android 만들기 화면/);
  assert.match(html, /도달 가능한 탭/);
  assert.match(html, /픽셀 단위 시각 패리티는 아직 검증하지 않았습니다/);
  assert.match(html, /첫 공개 APK/);
  assert.match(html, /StarManager-Android-v0\.1\.0\.apk/);
  assert.match(html, /b2d525ee6a17113b77efc046c6da1f782b9625d3946bc5920c5c27fc915c368f/);
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

test("renders the latest NasFinder and HanClip capabilities", async () => {
  const [nasFinderResponse, hanClipResponse] = await Promise.all([
    render("/apps/nasfinder"),
    render("/apps/hanclip"),
  ]);
  assert.equal(nasFinderResponse.status, 200);
  assert.equal(hanClipResponse.status, 200);

  const [nasFinder, hanClip] = await Promise.all([
    nasFinderResponse.text(),
    hanClipResponse.text(),
  ]);
  assert.match(nasFinder, /파일 앱에서 바로 가져오기/);
  assert.match(nasFinder, /네트워크 NAS 다섯 아이콘/);
  assert.match(nasFinder, /NOT JUST A FILE BROWSER/);
  assert.match(nasFinder, /내 파일도/);
  assert.match(nasFinder, /움직이는 추억도/);
  assert.match(nasFinder, /live-motion-campaign\.png/);
  assert.match(nasFinder, /가족의 휴대폰이 서로 달라도/);
  assert.match(nasFinder, /Super Thumbnail과 VLC 미리보기/);
  assert.match(nasFinder, /내 휴대폰을, 진짜 휴대용 하드처럼/);
  assert.match(nasFinder, /파일 앱에서도, 미리보기는 더 강력하게/);
  assert.match(nasFinder, /다운로드와 설치 방법/);
  assert.match(hanClip, /완성시간을 음악 길이에 맞춘/);
  assert.match(hanClip, /개봉영화 보관함/);
});

test("renders full promotional campaigns for HanClip, TrackpadGuard, CCMB, and S.tand", async () => {
  const responses = await Promise.all([
    render("/apps/hanclip"),
    render("/apps/trackpadguard"),
    render("/apps/ccmb"),
    render("/apps/stand"),
  ]);
  responses.forEach((response) => assert.equal(response.status, 200));

  const [hanClip, trackpadGuard, ccmb, stand] = await Promise.all(responses.map((response) => response.text()));
  assert.match(hanClip, /찍어 둔 순간을/);
  assert.match(hanClip, /hanclip-campaign\.png/);
  assert.match(hanClip, /여행의 마지막 밤/);
  assert.match(trackpadGuard, /타이핑할 때/);
  assert.match(trackpadGuard, /trackpadguard-campaign\.png/);
  assert.match(trackpadGuard, /키 내용도, 터치 좌표도 쌓지 않습니다/);
  assert.match(ccmb, /AI 사용량/);
  assert.match(ccmb, /ccmb-campaign\.png/);
  assert.match(ccmb, /네 서비스의 남은 여유를 한눈에/);
  assert.match(stand, /밤에는 조용한 메이트/);
  assert.match(stand, /stand-campaign\.png/);
  assert.match(stand, /의료 진단 기능은 아닙니다/);
  for (const html of [hanClip, trackpadGuard, ccmb, stand]) {
    assert.match(html, /실제 기능으로 가능한 대표 사용 장면이며, 사용자 후기를 인용한 내용은 아닙니다/);
    assert.match(html, /id="product-campaign"/);
    assert.match(html, /id="campaign-stories"/);
  }
});

test("renders full promotional campaigns for every remaining product", async () => {
  const responses = await Promise.all([
    render("/apps/super-thumbnail"),
    render("/apps/intosharp"),
    render("/apps/airchurch"),
  ]);
  responses.forEach((response) => assert.equal(response.status, 200));

  const [superThumbnail, intoSharp, airChurch] = await Promise.all(responses.map((response) => response.text()));
  assert.match(superThumbnail, /수만 개의 파일을/);
  assert.match(superThumbnail, /super-thumbnail-campaign\.png/);
  assert.match(superThumbnail, /16,540/);
  assert.match(superThumbnail, /하룻밤에 끝나지 않는 보관함/);
  assert.match(intoSharp, /주소는 잊고/);
  assert.match(intoSharp, /intosharp-campaign\.png/);
  assert.match(intoSharp, /인터넷의 첫 화면을/);
  assert.match(airChurch, /좋은 말씀과 선한 마음이 보이게/);
  assert.match(airChurch, /airchurch-campaign\.png/);
  assert.match(airChurch, /연결 성사를 보장하지는 않습니다/);
  for (const html of [superThumbnail, intoSharp, airChurch]) {
    assert.match(html, /id="product-campaign"/);
    assert.match(html, /실제 기능으로 가능한 대표 사용 장면이며, 사용자 후기를 인용한 내용은 아닙니다/);
  }
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
  assert.match(html, /v0\.4\.2/);
  assert.match(html, /Codex·Claude·Gemini·Grok/);
  assert.match(html, /07dde1deab3aa041013ea7afa50d194c6be026296ee6a2fc06d0cb88749b0af6/);
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

  assert.match(home, /202608201901/);
  assert.match(home, /3\.11\.55/);
  assert.match(home, /0\.32\.6/);
  assert.match(home, /스타메니저/);
  assert.match(home, /2026년 8월 21일/);
  assert.match(nasFinder, /APK v7/);
  assert.match(nasFinder, /a4f43c3a5230be640b10c70ddf46295e20da7ca53679d266afe55875929baaca/);
  assert.match(nasFinder, /Live Photos &amp; Motion Photos/);
  assert.match(hanClip, /APK v551/);
  assert.match(hanClip, /f548c579111041f09b3dc15c00c0a5781873789c97f350c13fcca1369c253132/);
  assert.match(stand, /APK v57/);
  assert.match(stand, /9099aae7532bc18bd35345a6939a256740925f0c41215eb1c7730f204a1055b7/);
  assert.doesNotMatch(home + nasFinder + hanClip + stand, /첫 공개판 준비 중|APK v2\b|APK v3\b|APK v544\b|APK v548\b|APK v52\b|APK v53\b/);
  assert.doesNotMatch(hanClip, /android-editor-finish-pets\.png/);
});
