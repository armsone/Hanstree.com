import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render(pathname = "/", headers = {}) {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${pathname}`, {
      headers: { accept: "text/html", ...headers },
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
  assert.match(html, /BTN/);
  assert.match(html, /TrackpadGuard/);
  assert.match(html, /intoSharp/);
  assert.match(html, /airChurch/);
  assert.match(html, /StarManager/);
  assert.match(html, /HtOMS Brief/);
  assert.match(html, /Button/);
  assert.match(html, /What to Eat/);
  assert.match(html, /Minecraft Bedrock Home Server/);
  assert.equal((html.match(/class="hero-product"/g) ?? []).length, 14);
  assert.match(html, /href="\/apps\/intosharp" class="hero-product"[^>]*aria-label="인투샾 제품 자세히 보기"/);
  assert.equal((html.match(/class="app-row-hit-area"/g) ?? []).length, 14);
  assert.match(html, /href="\/apps\/intosharp" class="app-row-hit-area" aria-label="인투샾 제품 자세히 보기"/);
  assert.match(html, />33<\/strong><span>현재 소개하는 제품/);
  assert.doesNotMatch(html, /플랫폼별 제공 버전/);
  assert.match(html, />07<\/strong><span>iPhone · iPad · macOS · Android · Google TV · Web · Windows \(커밍\)/);
  assert.match(html, />01<\/strong><span>한 사람의 꾸준한 기록/);
  assert.match(html, /id="motion-bridge"/);
  assert.match(html, /움직이는 순간을/);
  assert.match(html, /Live Photo → Motion Photo/);
  assert.match(html, /Motion Photo → Live Photo/);
  assert.match(html, /QR 연결 · 사진 보관함 저장/);
  assert.match(html, /개인정보처리방침/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|Building your site/i);
  const principles = html.match(/<div class="principle-grid">[\s\S]*?<\/section>/)?.[0] ?? "";
  assert.equal((principles.match(/class="advantage-visual"/g) ?? []).length, 3);
  const installGuide = html.match(/<ol class="install-steps">[\s\S]*?<\/ol>\s*<div class="install-warning">/)?.[0] ?? "";
  assert.equal((installGuide.match(/class="advantage-visual"/g) ?? []).length, 4);
});

test("renders the privacy-safe Minecraft Bedrock home server guide", async () => {
  const response = await render("/apps/minecraft-server");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /아이들은 함께 짓고, 부모는 안심합니다/);
  assert.match(html, /Docker 명령어나 SSH를 몰라도/);
  assert.match(html, /Container Manager/);
  assert.match(html, /UDP 19132/);
  assert.match(html, /실제 가족 서버 운영 중/);
  assert.match(html, /개인정보를 제거한 공개 구성 저장소 준비 중/);
  assert.doesNotMatch(html, /DS1821|DSM 7\.4|\/volume\d+|\b(?:\d{1,3}\.){3}\d{1,3}\b|\b\d{12,}\b/);
});

test("renders the notarized BTN cleanup release", async () => {
  const response = await render("/apps/btn");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /개발 도구가 빌려 쓴 공간과 메모리를/);
  assert.match(html, /release-download\?app=BTN/);
  assert.match(html, /Apple 공증 완료/);
  assert.match(html, /c1e7e92598bb50152c081588d0dd2bd6207d4f9b093d70eb80484eef3ee3b236/);
  assert.match(html, /메모리 압박 해결 동선/);
  assert.match(html, /기기 데이터를 유지한 채 종료/);
  assert.match(html, /안전한 파일 자동 정리/);
  assert.match(html, /시뮬레이터 데이터 초기화/);
  assert.match(html, /유휴 프로세스 메모리 회수/);
  assert.match(html, /로컬 개발 서버는 관찰만/);
  assert.match(html, /정상 종료\(SIGTERM\)/);
  assert.match(html, /기본은 선택 안 함/);
  assert.match(html, /BTN 2\.0\.1 공개/);
  assert.match(html, /build 202608251555/);
  assert.match(html, /overview\.png/);
});

test("keeps the former BackToNormal route compatible", async () => {
  const response = await render("/apps/backtonormal");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /release-download\?app=BTN/);
});

test("renders the Button family calling app and release", async () => {
  const response = await render("/apps/button");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /가족을 부르는 가장 간단한 버튼/);
  assert.match(html, /톡톡에서 사이렌까지/);
  assert.match(html, /Synology NAS/);
  assert.match(html, /2\.0\.0 \(202608230737\)/);
  assert.match(html, /release-download\?app=button-Android/);
  assert.match(html, /c2fb4f9cb9840761824d7079a3c8710c30fd3d9ff3114838dad5638c2661962f/);
  assert.match(html, /내부 코드 340680/);
  assert.match(html, /한 명·여러 명 또는 모두에게/);
  assert.match(html, /앱을 보는 동안 화면 유지/);
  assert.match(html, /톡톡에서 사이렌까지/);
  assert.match(html, /큰 정사각형 톡톡·띵동·음성 버튼/);
  assert.match(html, /밝고 직관적인 가족 화면/);
  assert.match(html, /APNs와 FCM/);
  assert.match(html, /버튼 Android에서 한 가족 구성원을 선택한 부모 홈/);
});

test("renders the StarManager product and matchup disclosure", async () => {
  const response = await render("/apps/starmanager");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /오늘의 이야기를, 내 목소리로 완성합니다/);
  assert.match(html, /스타메니저 iPhone 스튜디오의 AI 선택과 새 캔버스 화면/);
  assert.match(html, /TestFlight 처리 완료/);
  assert.match(html, /기기 AI/);
  assert.match(html, /스타매니저 Android 만들기 화면/);
  assert.match(html, /도달 가능한 탭/);
  assert.match(html, /픽셀 단위 시각 패리티는 아직 검증하지 않았습니다/);
  assert.match(html, /Android 2\.0\.1 공개/);
  assert.match(html, /release-download\?app=StarManager-Android/);
  assert.match(html, /6c943ab1861f9dca91d383b7adcae6e45f6df3c0727263ce2ae21abb156b1362/);
  assert.match(html, /다른 앱에서 붙여넣기/);
  assert.match(html, /사진 앱·갤러리/);
});

test("renders HtOMS with its own sales dashboard artwork", async () => {
  const response = await render("/apps/htoms-brief");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /오늘의 매출과 서버 상태를/);
  assert.match(html, /매출 요약/);
  assert.match(html, /서버 상태 · SERVER/);
  assert.match(html, /TestFlight 처리 완료/);
  assert.match(html, /Android · Google TV/);
  assert.match(html, /Android용 APK 다운로드/);
  assert.match(html, /release-download\?app=HtOMS-BK/);
  assert.match(html, /340515/);
  assert.match(html, /c9bbcf513ed4edef9b451f7d9432ad76b9574e31307341312498a2f33dddf1b1/);
  assert.match(html, /Android 대응 앱 구현/);
  assert.doesNotMatch(html, />Photos</);
  assert.doesNotMatch(html, /IMG_2048\.HEIC/);
});

test("renders Super Thumbnail as an independent Mac product", async () => {
  const [detailResponse, nasFinderResponse] = await Promise.all([
    render("/apps/super-thumbnail"),
    render("/apps/nasfinder"),
  ]);
  assert.equal(detailResponse.status, 200);

  const [detail, nasFinder] = await Promise.all([detailResponse.text(), nasFinderResponse.text()]);
  assert.match(detail, /큰 미디어 폴더의 미리보기를/);
  assert.match(detail, /release-download\?app=NasFinder-Super-Thumbnail/);
  assert.match(detail, /16,540/);
  assert.match(detail, /2\.1\.2 \(202608251551\)/);
  assert.match(detail, /폴더도 9칸 모아보기/);
  assert.match(detail, /5649c0b6e787da779799046929cabf7aa10727fbefee30fe3f70dc7b9b81b3e7/);
  assert.match(detail, /만들어진 썸네일 바로 확인/);
  assert.match(detail, /원본은 그대로, 썸네일만 새로/);
  assert.match(detail, /새로 만든 항목이 가장 왼쪽/);
  assert.match(detail, /보관본을 찾을 때부터 삭제 완료 개수/);
  assert.match(detail, /2\.1\.2 정리 진행과 미리보기 개선/);
  assert.match(detail, /2\.1\.1 공개 배포/);
  assert.doesNotMatch(detail, /공증 준비|공증 대기/);
  assert.doesNotMatch(nasFinder, /release-download\?app=NasFinder-Super-Thumbnail/);
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
  assert.match(nasFinder, /2\.1\.1 \(202608251305\)/);
  assert.match(nasFinder, /TestFlight 업로드 완료/);
  assert.match(nasFinder, /폰하드로 모으고 관리/);
  assert.match(nasFinder, /자세히·썸네일·포스터/);
  assert.match(nasFinder, /Overflow/);
  assert.match(nasFinder, /BK Style과 앱 아이콘/);
  assert.match(nasFinder, /NOT JUST A FILE BROWSER/);
  assert.match(nasFinder, /내 파일도/);
  assert.match(nasFinder, /움직이는 추억도/);
  assert.match(nasFinder, /live-motion-campaign\.png/);
  assert.match(nasFinder, /가족의 휴대폰이 서로 달라도/);
  assert.match(nasFinder, /파일과 폴더를 함께 보는 Super Thumbnail/);
  assert.match(nasFinder, /휴대폰에서 만든 일반 썸네일보다 먼저/);
  assert.match(nasFinder, /SM-F968N 교체 설치·실행 확인/);
  assert.match(nasFinder, /폴더 안의 파일·하위 폴더를 최대 9칸/);
  assert.match(nasFinder, /내 휴대폰을, 진짜 휴대용 하드처럼/);
  assert.match(nasFinder, /외부 파일 앱과 자연스럽게/);
  assert.match(nasFinder, /플랫폼별 설치 보기/);
  assert.match(nasFinder, /Google Photos에서 직접 선택/);
  assert.match(nasFinder, /iPhone·iPad와 Android용 Google Photos Picker/);
  assert.match(nasFinder, /소스 구현 완료 · 실제 Google 계정 검증 대기/);
  assert.match(nasFinder, /실제 Google 계정 검증이 끝나기 전에는 공개 완료 기능으로 표시하지 않습니다/);
  assert.match(nasFinder, /화면에 맞춰 커지는 Overflow/);
  assert.match(nasFinder, /휴대전화·태블릿·폴더블의 실제 안전영역/);
  assert.match(nasFinder, /볼륨·탐색·닫기 제스처/);
  assert.match(nasFinder, /외부 자막/);
  assert.match(nasFinder, /외부 파일 앱과 자연스럽게/);
  assert.match(nasFinder, /‘다음으로 열기’/);
  assert.match(nasFinder, /다음 공개판/);
  assert.match(hanClip, /완성시간을 음악 길이에 맞춘/);
  assert.match(hanClip, /개봉영화 보관함/);
  assert.match(hanClip, /무음 영상도 장면 분석/);
  assert.match(hanClip, /큰 스윙도, 조용한 퍼팅도 놓치지 않도록/);
  assert.match(hanClip, /Apple·Android 무음 퍼팅 안전망/);
  assert.match(hanClip, /기기 내 신체 자세 분석/);
  assert.match(hanClip, /휴대전화 실기기 설치 확인/);

  const nasFeatureGrid = nasFinder.match(/<div class="feature-grid">[\s\S]*?<\/div>\s*<\/section>/)?.[0] ?? "";
  assert.equal((nasFeatureGrid.match(/class="advantage-visual"/g) ?? []).length, 10);
  const nasSupportCards = nasFinder.match(/<section class="support-cards[\s\S]*?<\/section>/)?.[0] ?? "";
  assert.equal((nasSupportCards.match(/class="advantage-visual"/g) ?? []).length, 3);
  const nasDownloadList = nasFinder.match(/<div class="download-list">[\s\S]*?<\/div>\s*<\/section>/)?.[0] ?? "";
  assert.equal((nasDownloadList.match(/class="advantage-visual"/g) ?? []).length, 3);
  const nasProgressList = nasFinder.match(/<div class="progress-list">[\s\S]*?<\/div>\s*<\/section>/)?.[0] ?? "";
  assert.equal((nasProgressList.match(/class="advantage-visual"/g) ?? []).length, 8);
  const nasGuideSteps = nasFinder.match(/<div class="guide-steps">[\s\S]*?<\/div>\s*<\/div>\s*<\/section>/)?.[0] ?? "";
  assert.equal((nasGuideSteps.match(/class="advantage-visual"/g) ?? []).length, 6);
});

test("renders the source-implemented Google Photos OAuth disclosure without claiming public availability", async () => {
  const [privacyResponse, oauthResponse] = await Promise.all([
    render("/apps/nasfinder/privacy"),
    render("/apps/nasfinder/google-oauth"),
  ]);
  assert.equal(privacyResponse.status, 200);
  assert.equal(oauthResponse.status, 200);

  const [privacy, oauth] = await Promise.all([privacyResponse.text(), oauthResponse.text()]);
  assert.match(privacy, /photospicker\.mediaitems\.readonly/);
  assert.match(privacy, /Google Drive와 분리된 별도 OAuth 연결/);
  assert.match(privacy, /직접 선택한 사진·영상만/);
  assert.match(privacy, /실제 Google 계정 검증이 아직 완료되지 않았으므로 현재 공개판 제공을 뜻하지 않습니다/);
  assert.match(privacy, /iPhone·iPad와 Android에 소스 구현된 상태/);
  assert.match(privacy, /Apple 기기의 Keychain과 Android Keystore로 보호한 앱 전용 저장공간/);
  assert.match(privacy, /Limited Use requirements/);
  assert.doesNotMatch(privacy, /도입할 예정|확정하여 표시합니다/);
  const privacyGlance = privacy.match(/<section class="privacy-at-glance"[\s\S]*?<\/section>/)?.[0] ?? "";
  assert.equal((privacyGlance.match(/class="advantage-visual"/g) ?? []).length, 4);
  assert.match(oauth, /photospicker\.mediaitems\.readonly/);
  assert.match(oauth, /Received Files/);
  assert.match(oauth, /iPhone, iPad, and Android/);
  assert.match(oauth, /disconnect Google Photos/);
  assert.match(oauth, /separately from Google Drive/);
  assert.match(oauth, /adheres to the/);
  assert.match(oauth, /advertising, tracking, face recognition, data sales, or AI training/);
  assert.match(oauth, /Live Google account verification (?:is )?pending/);
  assert.match(oauth, /does not claim that the integration is included in the current public release/);
  assert.match(oauth, /Apple devices use Keychain/);
  assert.match(oauth, /protected by Android Keystore/);
  assert.doesNotMatch(oauth, /production Google Photos integration/i);
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
  assert.match(ccmb, /세 서비스의 남은 여유를 한눈에/);
  assert.match(ccmb, /advantage-visual/);
  assert.match(stand, /밤에는 조용한 메이트/);
  assert.match(stand, /stand-campaign\.png/);
  assert.match(stand, /의료 진단 기능은 아닙니다/);
  assert.match(stand, /이 기기의 설치 방법 보기/);
  assert.match(stand, /advantage-visual/);
  assert.match(stand, /Google TV 리모컨 지원/);
  assert.match(stand, /Google TV API 36에서 검증/);
  assert.match(stand, /Google TV 공개/);
  assert.match(stand, /google-tv-home\.png/);
  assert.equal((stand.match(/class="screen-tv"/g) ?? []).length, 1);
  for (const html of [hanClip, trackpadGuard, ccmb, stand]) {
    assert.match(html, /실제 기능으로 가능한 대표 사용 장면이며, 사용자 후기를 인용한 내용은 아닙니다/);
    assert.match(html, /id="product-campaign"/);
    assert.match(html, /id="campaign-stories"/);
    const storyGrid = html.match(/<div class="product-story-grid">[\s\S]*?<\/div>\s*<div class="product-promo-cta/)?.[0] ?? "";
    assert.equal((storyGrid.match(/class="advantage-visual"/g) ?? []).length, 3);
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

test("shows the current CCMB three-service release", async () => {
  const response = await render("/apps/ccmb");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.doesNotMatch(html, /WEEKLY REMAINING/);
  assert.doesNotMatch(html, /81% · ₩12\.4/);
  assert.doesNotMatch(html, /v0\.4\.3/);
  assert.match(html, /2\.0\.1/);
  assert.match(html, /Codex·Claude·Gemini/);
  assert.match(html, /release-download\?app=CCMB/);
  assert.match(html, /690f7884fd43c2a5995fac0353d4066c3a9513485a60616b905920c798baa2df/);
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

  assert.match(home, /202608230737/);
  assert.match(home, /340680/);
  assert.match(home, /스타메니저/);
  assert.match(home, /2026년 8월 23일/);
  assert.match(nasFinder, /내부 코드 340680/);
  assert.match(nasFinder, /0f2b70f5f78f320a49b954d7de4fee25f9ab2184f233a992972e32d7951c712e/);
  assert.match(nasFinder, /Live Photos &amp; Motion Photos/);
  assert.match(hanClip, /내부 코드 340680/);
  assert.match(hanClip, /5a92c8849d25836e5ae4fb5cac80c2d9bf4ae183c27ed89b975705a90867e7da/);
  assert.match(hanClip, /오디오 트랙이 없는 영상은 화면 움직임/);
  assert.match(stand, /내부 코드 340680/);
  assert.match(stand, /c2669f71358f64366655d9a3749039d689ad998e084bf13cc3ee2f02f37bd719/);
  assert.doesNotMatch(home + nasFinder + hanClip + stand, /첫 공개판 준비 중|APK v2\b|APK v3\b|APK v544\b|APK v548\b|APK v52\b|APK v53\b/);
  assert.doesNotMatch(hanClip, /android-editor-finish-pets\.png/);
});

test("routes public download buttons through the allowlisted release redirect", async () => {
  const [unknown, missing] = await Promise.all([
    render("/api/release-download?app=Unknown-Repo"),
    render("/api/release-download"),
  ]);
  assert.equal(unknown.status, 404);
  assert.equal(missing.status, 404);

  const interactiveHeaders = {
    referer: "http://localhost/apps/ccmb",
    "user-agent": "Mozilla/5.0 Safari/605.1.15",
    "sec-fetch-site": "same-origin",
    "sec-fetch-mode": "navigate",
    "sec-fetch-dest": "document",
  };
  const [ccmb, trackpadGuard, standMac, htoms] = await Promise.all([
    render("/api/release-download?app=CCMB", interactiveHeaders),
    render("/api/release-download?app=TrackpadGuard", interactiveHeaders),
    render("/api/release-download?app=S.tand-macOS", interactiveHeaders),
    render("/api/release-download?app=HtOMS-BK", {
      ...interactiveHeaders,
      referer: "http://localhost/apps/htoms-brief",
    }),
  ]);
  assert.equal(ccmb.status, 302);
  assert.match(ccmb.headers.get("location") ?? "", /^https:\/\/github\.com\/armsone\/CCMB\/releases\//);
  // TrackpadGuard must resolve to a downloadable asset path, never an arbitrary host.
  assert.equal(trackpadGuard.status, 302);
  assert.match(trackpadGuard.headers.get("location") ?? "", /^https:\/\/github\.com\/armsone\/TrackpadGuard\/releases\//);
  assert.equal(standMac.status, 302);
  assert.match(standMac.headers.get("location") ?? "", /^https:\/\/github\.com\/armsone\/S\.tand\/releases\//);
  assert.equal(htoms.status, 302);
  assert.match(htoms.headers.get("location") ?? "", /^https:\/\/github\.com\/armsone\/HtOMS-BK\/releases\/download\/android-v2\.0\.0\/HtOMS-Brief-Android-2\.0\.0\.apk$/);
});

test("refuses bot and direct download requests before redirecting", async () => {
  const [knownBot, directRequest] = await Promise.all([
    render("/api/release-download?app=CCMB", {
      referer: "http://localhost/apps/ccmb",
      "user-agent": "Mozilla/5.0 (compatible; MJ12bot/v1.4.8; http://mj12bot.com/)",
    }),
    render("/api/release-download?app=CCMB", {
      "user-agent": "Mozilla/5.0 Safari/605.1.15",
    }),
  ]);

  assert.equal(knownBot.status, 403);
  assert.equal(directRequest.status, 403);
  assert.equal(knownBot.headers.get("location"), null);
  assert.equal(directRequest.headers.get("location"), null);
});

test("keeps verified TestFlight fallback data for StarManager and Button", async () => {
  const response = await render("/api/testflight-builds");
  assert.equal(response.status, 200);

  const payload = await response.json();
  const bySlug = new Map(payload.builds.map((build) => [build.slug, build]));
  assert.equal(bySlug.get("starmanager")?.build, "202608230737");
  assert.equal(bySlug.get("starmanager")?.uploadedAt, "2026-08-23T08:13:38+09:00");
  assert.equal(bySlug.get("button")?.build, "202608230737");
  assert.equal(bySlug.get("button")?.uploadedAt, "2026-08-23T08:14:39+09:00");
});

test("tracks every public download in the site counter with download wording", async () => {
  const response = await render();
  const html = await response.text();

  for (const label of [
    "NasFinder Android",
    "Super Thumbnail",
    "HanClip Android",
    "S.tand Mac",
    "S.tand Android",
    "CCMB Mac",
    "BTN Mac",
    "TrackpadGuard Mac",
    "버튼 Android",
    "스타매니저 Android",
  ]) {
    assert.ok(html.includes(label), `missing download counter label: ${label}`);
  }
  assert.match(html, /다운로드 버튼/);
  assert.doesNotMatch(html, /APK 버튼/);
  assert.doesNotMatch(html, /업로드 기록 대기/);
});

test("keeps visit tracking privacy-safe and single-sourced", async () => {
  const [component, counter, route, requestTraffic] = await Promise.all([
    readFile(new URL("../app/components/VisitTracker.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/SiteCounter.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/api/site-stats/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/requestTraffic.ts", import.meta.url), "utf8"),
  ]);

  assert.match(component, /nasfinder:last-counted-visit/);
  assert.match(component, /new URL\(document\.referrer\)\.origin/);
  assert.doesNotMatch(component, /referrer:\s*document\.referrer/);
  assert.match(component, /utm_source/);
  assert.match(component, /utm_medium/);
  assert.doesNotMatch(component, /user-agent|navigator\.userAgent|geolocation|cookie/i);

  assert.doesNotMatch(counter, /event.*visit|POST/);
  assert.match(counter, /method: "GET"|fetch\("\/api\/site-stats", \{ cache: "no-store" \}\)/);

  assert.match(route, /classifyTrafficSource\(request, body\.referrer, body\.utmSource, body\.utmMedium\)/);
  assert.doesNotMatch(route, /body\.source|body\.key|body\.label/);

  assert.match(requestTraffic, /export function classifyTrafficSource/);
  assert.match(requestTraffic, /"direct"/);
  assert.match(requestTraffic, /google/);
});

test("keeps traffic-source classification bounded to known, privacy-safe categories", async () => {
  const requestTraffic = await readFile(new URL("../app/requestTraffic.ts", import.meta.url), "utf8");
  const { classifyTrafficSource } = await import("../app/requestTraffic.ts");

  // The stored counter key must always come from server-side classification,
  // never an arbitrary hostname or client-supplied label.
  for (const knownSource of ["google", "naver", "bing", "daum", "youtube", "github", "instagram", "facebook", "x", "linkedin", "kakao", "chatgpt", "gemini"]) {
    assert.match(requestTraffic, new RegExp(`source:\\s*"${knownSource}"`));
  }
  assert.match(requestTraffic, /key: "direct", category: "direct"/);
  assert.match(requestTraffic, /key: "other-referral", category: "referral"/);
  assert.match(requestTraffic, /key: "campaign", category: "campaign"/);
  assert.match(requestTraffic, /externalReferrerHost = referrerHost && referrerHost !== requestHost/);
  assert.doesNotMatch(requestTraffic, /campaign:\$\{/);
  assert.doesNotMatch(requestTraffic, /utm_campaign/);

  const request = new Request("https://nasfinder.com/api/site-stats");
  assert.deepEqual(classifyTrafficSource(request, "https://gemini.google.com/app", null, null), { key: "gemini", category: "ai" });
  assert.deepEqual(classifyTrafficSource(request, "https://example.com/private/path?token=secret", null, null), { key: "other-referral", category: "referral" });
  assert.deepEqual(classifyTrafficSource(request, "https://google.com/search", "newsletter-2026-08", "email"), { key: "campaign", category: "campaign" });
  assert.deepEqual(classifyTrafficSource(request, "https://nasfinder.com/apps/ccmb", null, null), { key: "direct", category: "direct" });
});

test("shows a clear empty state for months without traffic-source data", async () => {
  const response = await render("/insights");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /이번 달 유입 경로/);
  assert.match(html, /개인을 식별하지 않습니다/);
});

test("shows the refreshed progress review date and TrackpadGuard DMG download", async () => {
  const [btnResponse, trackpadResponse] = await Promise.all([
    render("/apps/btn"),
    render("/apps/trackpadguard"),
  ]);
  const [btn, trackpadGuard] = await Promise.all([btnResponse.text(), trackpadResponse.text()]);

  assert.match(btn, /마지막 내용 확인: 2026년 8월 23일/);
  assert.match(trackpadGuard, /마지막 내용 확인: 2026년 8월 23일/);
  assert.match(trackpadGuard, /release-download\?app=TrackpadGuard/);
  assert.doesNotMatch(trackpadGuard, /releases\/tag\/v0\.1\.3/);
});
