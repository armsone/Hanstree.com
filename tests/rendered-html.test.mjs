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
  assert.match(html, /iManager/);
  assert.match(html, /HtOMS Brief/);
  assert.match(html, /Button/);
  assert.match(html, /AIBI/);
  for (const slug of [
    "nasfinder", "super-thumbnail", "hanclip", "stand", "ccmb", "btn", "trackpadguard",
    "htoms-brief", "intosharp", "airchurch", "button", "starmanager", "minecraft-server", "whattoeat", "denimdex", "aibi",
  ]) {
    assert.match(html, new RegExp(`/apps/${slug}/home-card\\.webp`), slug);
  }
  assert.match(html, /class="hero-product-image"/);
  assert.match(html, /class="app-row-representative"/);
  assert.match(html, /What to Eat/);
  assert.match(html, /NasOS · Minecraft Server/);
  assert.equal((html.match(/class="hero-product(?:\s|")/g) ?? []).length, 17);
  assert.match(html, /href="\/apps\/intosharp" class="hero-product hero-product-intosharp"[^>]*aria-label="인투샾 제품 자세히 보기"/);
  assert.equal((html.match(/class="app-row-hit-area"/g) ?? []).length, 17);
  assert.match(html, /href="\/apps\/intosharp" class="app-row-hit-area" aria-label="인투샾 제품 자세히 보기"/);
  assert.match(html, />39<\/strong><span>현재 소개하는 제품/);
  assert.doesNotMatch(html, /플랫폼별 제공 버전/);
  assert.match(html, />08<\/strong><span>iPhone · iPad · macOS · Android · Google TV · Web · NasOS · Windows \(커밍\)/);
  assert.match(html, /한양/);
  assert.match(html, /HANYANG/);
  assert.match(html, /나의 디지털 수도/);
  assert.match(html, /\/apps\/hanai\/home-card\.webp/);
  assert.match(html, />01<\/strong><span>한 사람의 꾸준한 기록/);
  assert.doesNotMatch(html, /id="motion-bridge"/);
  assert.doesNotMatch(html, /NASFINDER FLAGSHIP FEATURE/);
  assert.match(html, /개인정보처리방침/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|Building your site/i);
  const principles = html.match(/<div class="principle-grid">[\s\S]*?<\/section>/)?.[0] ?? "";
  assert.equal((principles.match(/class="advantage-visual"/g) ?? []).length, 3);
  const installGuide = html.match(/<ol class="install-steps">[\s\S]*?<\/ol>\s*<div class="install-warning">/)?.[0] ?? "";
  assert.equal((installGuide.match(/class="advantage-visual"/g) ?? []).length, 4);
});

test("presents HANYANG as a modern personal AI city without overstating future capabilities", async () => {
  const response = await render("/apps/hanai");
  assert.equal(response.status, 200);
  const html = await response.text();

  assert.match(html, /YOUR DIGITAL CAPITAL/);
  assert.match(html, /나의 디지털 수도/);
  assert.match(html, /나를 중심으로 세워진 AI 도시/);
  assert.match(html, /도시처럼 연결되는 개인 AI/);
  assert.match(html, /한양도성처럼 분명한 경계/);
  assert.match(html, /브랜드는 한양 HANYANG/);
  assert.match(html, /다음에는 사용자가 허용한 정보의 기억과 정리/);
  assert.match(html, /현재 HanAI 식별자를 유지/);
  assert.match(html, /0\.2\.0/);
  assert.match(html, /비슷한 사진은 줄이고 좋은 장면은 남기기/);
  assert.match(html, /hanai-core-0\.2\.0\.jar/);
  assert.match(html, /688a9f385bb4706ddfee4f79e4fe188da155bc7d76967191e76ab2debd992ad9/);
  assert.match(html, /hanyang-city-hero-v3\.png/);
  assert.match(html, /hanyang-memory-archive-v1\.png/);
  assert.match(html, /hanyang-secure-gates-v1\.png/);
  const hero = html.match(/<section class="app-hero shell">[\s\S]*?<\/section>/)?.[0] ?? "";
  const spotlight = html.match(/<section class="product-promo"[\s\S]*?<\/section>/)?.[0] ?? "";
  const screens = html.match(/<section class="screens-section"[\s\S]*?<\/section>/)?.[0] ?? "";
  assert.match(hero, /hanyang-city-hero-v3\.png/);
  assert.doesNotMatch(hero, /hanyang-memory-archive-v1|hanyang-secure-gates-v1/);
  assert.match(spotlight, /hanyang-memory-archive-v1\.png/);
  assert.doesNotMatch(spotlight, /hanyang-city-hero-v3|hanyang-secure-gates-v1/);
  assert.match(screens, /hanyang-secure-gates-v1\.png/);
  assert.doesNotMatch(screens, /hanyang-city-hero-v3|hanyang-memory-archive-v1/);
  assert.match(html, /기억과 지식이 모이는 규장각/);
  assert.match(html, /한양도성은 개인 데이터의 경계/);
});

test("keeps TestFlight, public beta, and Android cards on one responsive layout contract", async () => {
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
  const sharedGrids = String.raw`\.testflight-grid,\.testflight-invite-grid,\.android-release-grid`;

  assert.match(css, new RegExp(String.raw`@media \(min-width: 601px\)\s*\{\s*${sharedGrids}\{grid-template-columns:repeat\(2,minmax\(0,1fr\)\)\}`));
  assert.match(css, new RegExp(String.raw`@media \(min-width: 1000px\) and \(orientation: landscape\)\s*\{\s*${sharedGrids}\{grid-template-columns:repeat\(4,minmax\(0,1fr\)\)\}`));
  assert.doesNotMatch(css, /\.testflight-grid\{grid-template-columns:repeat\(auto-fit/);
});

test("keeps every home product card title readable without ellipsis", async () => {
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
  const productCopyRule = css.match(/\.hero-product-copy strong,\.hero-product-copy small\{([^}]*)\}/)?.[1] ?? "";

  assert.match(productCopyRule, /white-space:normal/);
  assert.match(productCopyRule, /word-break:keep-all/);
  assert.doesNotMatch(productCopyRule, /text-overflow:ellipsis|overflow:hidden|white-space:nowrap/);
});

test("keeps every app detail hero focused on one clear entry path and a representative product scene", async () => {
  const slugs = [
    "nasfinder", "super-thumbnail", "hanclip", "stand", "ccmb", "btn", "trackpadguard",
    "htoms-brief", "intosharp", "airchurch", "button", "starmanager", "minecraft-server", "whattoeat", "denimdex", "aibi",
  ];

  for (const slug of slugs) {
    const response = await render(`/apps/${slug}`);
    assert.equal(response.status, 200, slug);
    const html = await response.text();
    const hero = html.match(/<section class="app-hero shell">[\s\S]*?<\/section>/)?.[0] ?? "";
    assert.match(hero, /class="hero-availability"/, slug);
    assert.match(hero, /class="hero-platforms"/, slug);
    assert.match(hero, new RegExp(`hero-artwork-product hero-artwork-${slug}`), slug);
    assert.match(hero, new RegExp(`/apps/${slug}/${slug}-hero-v2\\.png`), slug);
    assert.doesNotMatch(hero, /testflight-apply-chip|테스터 신청하기/, slug);
  }

  const nasfinder = await (await render("/apps/nasfinder")).text();
  assert.match(nasfinder, /nasfinder-hero-v2\.png/);
  assert.match(nasfinder, /여러 저장공간을 한곳에서/);
});

test("shows DenimDex brand engines with their real icons and truthful beta state", async () => {
  const response = await render("/apps/denimdex");
  assert.equal(response.status, 200);
  const html = await response.text();

  assert.match(html, /\/apps\/hanai\/icon\.png/);
  assert.match(html, /\/apps\/aibi\/icon\.png/);
  assert.match(html, /Apple 공개 테스트 심사 중/);
  assert.match(html, /기존 Internal과 Public Beta 그룹/);
  assert.match(html, /0\.2\.1/);
  assert.match(html, /202608291602/);
  assert.match(html, /내부 코드 346562/);
  assert.match(html, /release-download\?app=DenimDex-Android/);
  assert.match(html, /작성 중인 글은 그대로 보호/);
  assert.match(html, /38c7585761ffe2431a2285a94bdac1c56557aceb39ee34fd8c64c37ffb728d11/);
  assert.match(html, /추정 생산연도/);
  assert.match(html, /추정 제조공장/);
  assert.match(html, /보수적 희귀도/);
  assert.match(html, /적정 매입가/);
  assert.doesNotMatch(html, /TestFlight 바로 참여/);
});

test("renders the requested home navigation and keeps the maker name as plain text", async () => {
  const response = await render();
  const html = await response.text();

  const nav = html.match(/<nav aria-label="주요 메뉴">[\s\S]*?<\/nav>/)?.[0] ?? "";
  assert.ok(nav, "missing main navigation");
  assert.match(nav, />홈<\/a>[\s\S]*?>앱<\/a>[\s\S]*?>다운<\/a>[\s\S]*?>기록<\/a>[\s\S]*?>깃허브[\s\S]*?<\/a>\s*<a [^>]*href="\/admin\/testflight"[^>]*>관리자<\/a>/);
  assert.match(nav, /href="\/#testflight"[^>]*>다운<\/a>/);
  assert.match(nav, /href="\/#records"[^>]*>기록<\/a>/);
  assert.doesNotMatch(nav, /href="\/#downloads"[^>]*>다운<\/a>|href="\/insights"[^>]*>기록<\/a>/);
  assert.match(nav, /href="https:\/\/github\.com\/armsone"[^>]*>깃허브/);
  assert.doesNotMatch(nav, />소통<\/a>/);
  assert.match(nav, /<a [^>]*aria-label="관리자 로그인"[^>]*>관리자<\/a>/);
  assert.equal((nav.match(/href="\/admin\/testflight"/g) ?? []).length, 1);

  const footer = html.match(/<footer class="site-footer">[\s\S]*?<\/footer>/)?.[0] ?? "";
  assert.ok(footer, "missing site footer");
  assert.match(footer, /<p>한병기 · 바이브 코더가 만드는 앱과 웹 서비스를 소개합니다\.<\/p>/);
  assert.doesNotMatch(footer, /href="\/admin\/testflight"/);
});

test("collects verified external tester links between TestFlight and Android downloads", async () => {
  const response = await render();
  const html = await response.text();
  const testflightIndex = html.indexOf('id="testflight"');
  const inviteIndex = html.indexOf('id="downloads"');
  const androidIndex = html.indexOf('id="android-releases"');
  assert.ok(testflightIndex >= 0 && testflightIndex < inviteIndex && inviteIndex < androidIndex);

  const section = html.slice(inviteIndex, androidIndex);
  assert.match(section, /외부 테스터 참여/);
  assert.equal((section.match(/class="testflight-invite-card/g) ?? []).length, 7);
  assert.equal((section.match(/class="app-icon/g) ?? []).length, 7);
  assert.equal((section.match(/Apple 심사 중/g) ?? []).length, 1);
  assert.equal((section.match(/심사 계정 준비/g) ?? []).length, 0);
  assert.equal((section.match(/외부용 빌드 준비/g) ?? []).length, 0);
  assert.equal((section.match(/href="https:\/\/testflight\.apple\.com\/join\//g) ?? []).length, 6);
  assert.match(section, /href="https:\/\/testflight\.apple\.com\/join\/3m3bhwJz"/);
  assert.match(section, /href="https:\/\/testflight\.apple\.com\/join\/m2YsgUJW"/);
  assert.match(section, /href="https:\/\/testflight\.apple\.com\/join\/A444RsAc"/);
  assert.match(section, /href="https:\/\/testflight\.apple\.com\/join\/nzmW4WxW"/);
  assert.match(section, /href="https:\/\/testflight\.apple\.com\/join\/RKcxgTkc"/);
  assert.match(section, /href="https:\/\/testflight\.apple\.com\/join\/mGUYTjdp"/);
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
  assert.match(html, /개인정보를 제거한 서버 설정과 운영 안내서 공개 완료/);
  assert.match(html, /github\.com\/armsone\/NasOS\/releases\/tag\/v0\.1\.0/);
  assert.doesNotMatch(html, /DS1821|DSM 7\.4|\/volume\d+|\b(?:\d{1,3}\.){3}\d{1,3}\b|\b\d{12,}\b/);
});

test("renders the notarized BTN cleanup release", async () => {
  const response = await render("/apps/btn");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /개발 도구가 빌려 쓴 공간과 메모리를/);
  assert.match(html, /release-download\?app=BTN/);
  assert.match(html, /Apple 공증 완료/);
  assert.match(html, /7150296496f7a573f9ac0b1bceed82388b8f680e05fe46ad4fa7ef1d5bcaf99e/);
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
  assert.match(html, /2\.0\.0 \(202608252204\)/);
  assert.match(html, /href="https:\/\/testflight\.apple\.com\/join\/RKcxgTkc"/);
  assert.match(html, /release-download\?app=button-Android/);
  assert.match(html, /4b9cc233fc527370d103d67c2c81e6c752222b97aa1d678e8cfe2bcd0b847239/);
  assert.match(html, /내부 코드 346493/);
  assert.match(html, /한 명·여러 명 또는 모두에게/);
  assert.match(html, /앱을 보는 동안 화면 유지/);
  assert.match(html, /톡톡에서 사이렌까지/);
  assert.match(html, /큰 정사각형 톡톡·띵동·음성 버튼/);
  assert.match(html, /밝고 직관적인 가족 화면/);
  assert.match(html, /APNs와 FCM/);
  assert.match(html, /버튼 Android에서 한 가족 구성원을 선택한 부모 홈/);
  assert.match(html, /2\.0\.2/);
  assert.match(html, /202608291453/);
});

test("renders the iManager product and matchup disclosure", async () => {
  const response = await render("/apps/starmanager");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /오늘의 이야기를, 내 목소리로 완성합니다/);
  assert.match(html, /아이매니저 iPhone 스튜디오의 AI 선택과 새 캔버스 화면/);
  assert.match(html, /href="https:\/\/testflight\.apple\.com\/join\/nzmW4WxW"/);
  assert.match(html, /2\.5\.1 · 빌드 202608291746/);
  assert.match(html, /사진 앱에서 바로 시작/);
  assert.match(html, /내가 켤 때만 자동화/);
  assert.match(html, /공유와 카메라는 언제나/);
  assert.match(html, /인터스텔라 테마/);
  assert.match(html, /기기 AI/);
  assert.match(html, /아이매니저 Android 만들기 화면/);
  assert.match(html, /도달 가능한 탭/);
  assert.match(html, /혼합 미디어·오류 복구·메모리 수명주기의 추가 회귀 검증/);
  assert.match(html, /Android 2\.5\.1 공개/);
  assert.match(html, /release-download\?app=iManager-Android/);
  assert.match(html, /c5231e91bb4ca8b3e1d230137a7f70649965fcb7f2b2e45cefbec29024212f91/);
  assert.match(html, /ChatGPT·Gemini·Claude/);
  assert.match(html, /Instagram 새 게시물/);
  assert.match(html, /다른 앱에서 붙여넣기/);
  assert.match(html, /사진 앱·갤러리/);
});

test("renders AIBI as a host-integrated engine release", async () => {
  const [response, privacyResponse] = await Promise.all([
    render("/apps/aibi"),
    render("/apps/aibi/privacy"),
  ]);
  assert.equal(response.status, 200);
  assert.equal(privacyResponse.status, 200);

  const html = await response.text();
  const privacyHtml = await privacyResponse.text();
  assert.match(html, /앱과 공식 AI 사이를, 안전하게/);
  assert.match(html, /AIBI 0\.4\.4/);
  assert.match(html, /iManager · iOS · Android/);
  assert.match(html, /독립 소스 공개 · iManager에는 검증된 같은 엔진 포함/);
  assert.match(html, /AIBI-0\.4\.4\.zip/);
  assert.match(html, /0f67bbceb91c1d069d9224267a7b43b1ecb8aafe5e6973af79732c28371f7621/);
  assert.match(html, /1분 59초/);
  assert.match(html, /SHA-256 잠금/);
  assert.match(privacyHtml, /비밀번호, 쿠키 값, 세션 토큰/);
  assert.match(html, /artwork-bridge/);
  assert.match(html, /github\.com\/armsone\/AIBI/);
});

test("renders HtOMS with its own sales dashboard artwork", async () => {
  const response = await render("/apps/htoms-brief");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /오늘의 매출과 서버 상태를/);
  assert.match(html, /매출 요약/);
  assert.match(html, /서버 상태 · SERVER/);
  assert.match(html, /회사 내부 테스트 전용 · 내부 테스터 9명 유지 · 공개 링크 없음/);
  assert.match(html, /Android · Google TV/);
  assert.match(html, /Android용 APK 다운로드/);
  assert.match(html, /release-download\?app=HtOMS-BK/);
  assert.match(html, /346542/);
  assert.match(html, /66ebee56a5724be93798dd7de7dbd6a80e2139d4cf4bfcc19ae6bbf45806c54d/);
  assert.match(html, /Android 대응 앱 구현/);
  assert.doesNotMatch(html, />Photos</);
  assert.doesNotMatch(html, /IMG_2048\.HEIC/);
});

test("renders Super Thumbnail as an independent Mac product", async () => {
  const [detailResponse, nasFinderResponse, supportResponse] = await Promise.all([
    render("/apps/super-thumbnail"),
    render("/apps/nasfinder"),
    render("/apps/super-thumbnail/support"),
  ]);
  assert.equal(detailResponse.status, 200);
  assert.equal(supportResponse.status, 200);

  const [detail, nasFinder, support] = await Promise.all([
    detailResponse.text(),
    nasFinderResponse.text(),
    supportResponse.text(),
  ]);
  assert.match(detail, /큰 미디어 폴더의 미리보기를/);
  assert.match(detail, /release-download\?app=NasFinder-Super-Thumbnail/);
  assert.match(detail, /16,540/);
  assert.match(detail, /2\.3\.2 \(202608291428\)/);
  assert.match(detail, /Developer ID 서명·Apple 공증 완료/);
  assert.match(detail, /폴더는 차례대로, 파일은 동시에/);
  assert.match(detail, /자동 체크박스/);
  assert.match(detail, /1~16개/);
  assert.match(detail, /발열이 심하면 절반/);
  assert.match(detail, /폴더 작업은 적용 수의 절반\(최소 1개\)/);
  assert.match(detail, /발견한 폴더 수와 파일 수를 실시간/);
  assert.match(support, /github\.com\/armsone\/SuperThumbnail-MacOS\/issues/);
  assert.match(detail, /폴더도 9칸, 흐림은 꼭 필요한 만큼만/);
  assert.match(detail, /살색 비율 20%까지는 선명하게 유지/);
  assert.match(detail, /7c0c02bb250a3720e0957ed5361ec811ccfbdbd0dc4398cff0287208f5ec7eb2/);
  assert.match(detail, /미리보는 재미까지 크게/);
  assert.match(detail, /가로 손잡이를 아래로 끌수록 미리보기와 이미지가 함께 커지고/);
  assert.match(detail, /2\.1\.4 크기 조절 미리보기/);
  assert.match(detail, /원본은 그대로, 썸네일만 새로/);
  assert.match(detail, /새로 만든 항목이 가장 왼쪽/);
  assert.match(detail, /보관본을 찾을 때부터 삭제 완료 개수/);
  assert.match(detail, /2\.1\.3 사진·영상 찾기 진행 표시/);
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
  assert.match(nasFinder, /2\.2\.1 · 빌드 202608262056 · 내부 코드 342536/);
  assert.match(nasFinder, /href="https:\/\/testflight\.apple\.com\/join\/3m3bhwJz"/);
  assert.match(hanClip, /href="https:\/\/testflight\.apple\.com\/join\/m2YsgUJW"/);
  assert.match(nasFinder, /폰하드로 모으고 관리/);
  assert.match(nasFinder, /자세히·썸네일·포스터/);
  assert.match(nasFinder, /Overflow/);
  assert.match(nasFinder, /BK Style과 기기별 아이콘/);
  assert.match(nasFinder, /NOT JUST A FILE BROWSER/);
  assert.match(nasFinder, /id="motion-bridge"/);
  assert.match(nasFinder, /NASFINDER FLAGSHIP FEATURE/);
  assert.match(nasFinder, /움직이는 순간을/);
  assert.match(nasFinder, /Live Photo → Motion Photo/);
  assert.match(nasFinder, /Motion Photo → Live Photo/);
  assert.match(nasFinder, /QR 연결 · 사진 보관함 저장/);
  assert.match(nasFinder, /내 파일도/);
  assert.match(nasFinder, /움직이는 추억도/);
  assert.match(nasFinder, /live-motion-campaign\.png/);
  assert.match(nasFinder, /가족의 휴대폰이 서로 달라도/);
  assert.match(nasFinder, /로고 대신 내용이 보이는 Super Thumbnail/);
  assert.match(nasFinder, /일반 썸네일보다 먼저/);
  assert.match(nasFinder, /즐겨찾기도 폴더 표지로 한눈에/);
  assert.match(nasFinder, /OneDrive·Google Drive의 이전 항목까지 썸네일/);
  assert.match(nasFinder, /길게 눌러 제거하고 드래그/);
  assert.match(nasFinder, /움직이는 GIF를 미디어 보기에서 그대로 재생/);
  assert.match(nasFinder, /1% 단위 볼륨/);
  assert.match(nasFinder, /35% 투명도의 1dp 흑백 하단 선/);
  assert.match(nasFinder, /살색 영역이 절반 이상이면 2dp 블러/);
  assert.match(nasFinder, /다른 앱을 사용한 뒤 돌아오면 첫 화면/);
  assert.match(nasFinder, /SM-F968N 데이터 유지 교체 설치·실행 확인/);
  assert.match(nasFinder, /영상 전체 길이의 3\/13/);
  assert.match(nasFinder, /내 휴대폰을, 진짜 휴대용 하드처럼/);
  assert.match(nasFinder, /외부 파일 앱과 자연스럽게/);
  assert.match(nasFinder, /플랫폼별 설치 보기/);
  assert.match(nasFinder, /Google Photos에서 직접 선택/);
  assert.match(nasFinder, /iPhone·iPad와 Android용 Google Photos Picker/);
  assert.match(nasFinder, /소스 구현 완료 · 실제 Google 계정 검증 대기/);
  assert.match(nasFinder, /실제 Google 계정 검증이 끝나기 전에는 공개 완료 기능으로 표시하지 않습니다/);
  assert.match(nasFinder, /화면에 맞춰 커지는 Overflow/);
  assert.match(nasFinder, /휴대전화·태블릿·폴더블의 실제 안전영역/);
  assert.match(nasFinder, /외부 파일 앱과 자연스럽게/);
  assert.match(nasFinder, /‘다음으로 열기’/);
  assert.match(hanClip, /완성시간을 음악 길이에 맞춘/);
  assert.match(hanClip, /개봉영화 보관함/);
  assert.match(hanClip, /컬렉션에도 바로 추가/);
  assert.match(hanClip, /무음 영상도 장면 분석/);
  assert.match(hanClip, /큰 스윙도, 조용한 퍼팅도 놓치지 않도록/);
  assert.match(hanClip, /Apple·Android 무음 퍼팅 안전망/);
  assert.match(hanClip, /기기 내 신체 자세 분석/);
  assert.match(hanClip, /서명 APK 재다운로드·무결성 검증 완료/);

  const nasFeatureGrid = nasFinder.match(/<div class="feature-grid">[\s\S]*?<\/div>\s*<\/section>/)?.[0] ?? "";
  assert.equal((nasFeatureGrid.match(/class="feature-icon"/g) ?? []).length, 14);
  const nasSupportCards = nasFinder.match(/<section class="support-cards[\s\S]*?<\/section>/)?.[0] ?? "";
  assert.equal((nasSupportCards.match(/class="advantage-visual"/g) ?? []).length, 3);
  const nasDownloadList = nasFinder.match(/<div class="download-list">[\s\S]*?<\/div>\s*<\/section>/)?.[0] ?? "";
  assert.equal((nasDownloadList.match(/class="advantage-visual"/g) ?? []).length, 3);
  const nasProgressList = nasFinder.match(/<div class="progress-list">[\s\S]*?<\/div>\s*<\/section>/)?.[0] ?? "";
  assert.equal((nasProgressList.match(/class="advantage-visual"/g) ?? []).length, 9);
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
  assert.match(superThumbnail, /여러 보관함을 한 번에 준비할 때/);
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
  assert.match(html, /2\.0\.3/);
  assert.match(html, /202608291556/);
  assert.match(html, /높은 부하도 스스로 복구/);
  assert.match(html, /818ef1564f02ab9a898c0fdc25e11bb910e3ffda34457f57b99ba7c25dea0f86/);
  assert.match(html, /class="screen-square"/);
  assert.match(html, /usage-square\.png[^>]*width="1254" height="1254"/);
  assert.doesNotMatch(html, /class="screen-wide"[^>]*>[\s\S]*?usage-square\.png/);
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
  assert.match(html, /2\.0\.12/);
  assert.match(html, /Codex·Claude·Gemini/);
  assert.match(html, /release-download\?app=CCMB/);
  assert.match(html, /166e2a20998ba230100950cd242ab96fa5dbf3023fc3df3779c5324d55c4a90b/);
  assert.match(html, /CCMB 전용 Claude 연결/);
  assert.match(html, /CCMB 안의 브라우저에서 Claude 계정을 한 번 연결합니다/);
  assert.match(html, /독립 스마트 갱신/);
  assert.match(html, /정렬된 하단 조작부/);
  assert.match(html, /Claude Code의 키체인 인증 정보를 읽지 않아/);
  assert.match(html, /데이터 연결만 안전하게 다시 시작/);
  assert.match(html, /한 줄로 온전히 보이는 갱신 기록/);
  assert.match(html, /초 없는 24시간제/);
  assert.match(html, /별도의 자동 다운로드 선택은 필요 없습니다/);
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

  assert.match(home, /202608262056/);
  assert.match(home, /202608271227/);
  assert.match(home, /342536/);
  assert.match(home, /아이매니저/);
  assert.match(home, /2026년 8월 25일/);
  assert.match(nasFinder, /내부 코드 342536/);
  assert.match(nasFinder, /Mac용 NasFinder 2\.2\.2 공개/);
  assert.match(nasFinder, /d8c4efb8a75a390f07a68c568abff3d4801b0a0d80bd538b9aad4bf442ff4554/);
  assert.match(nasFinder, /iphone-favorites-folder-thumbnails\.png/);
  assert.match(nasFinder, /d404e0f9275a2c604e4ecc99f9aaf65bcda448060a42b36e6444096fb3ce5aa6/);
  assert.match(nasFinder, /Live Photos &amp; Motion Photos/);
  assert.match(hanClip, /내부 코드 340980/);
  assert.match(hanClip, /f4b607c0d5b860c4dd1c42a24f653b0bacf5f17d9b10684307af33eec102201b/);
  assert.match(hanClip, /오디오 트랙이 없는 영상은 화면 움직임/);
  assert.match(stand, /내부 코드 346696/);
  assert.match(stand, /236cf24361d565ca9649b2e6c9e5df6710e0f7116efa318f88c94830cef56f35/);
  assert.match(stand, /사람별 다중 연결 경로/);
  assert.match(stand, /검은 배경이 생기지 않고 포커스 테두리/);
  assert.match(stand, /202608282116/);
  assert.match(stand, /a3baaafab73c6f0f111e11e6bafe278164d52deaf9cd559a94dd22169b7b6480/);
  assert.match(stand, /다음 라디오나 다음 곡/);
  assert.match(stand, /android-home-two-line-cards\.png/);
  assert.doesNotMatch(home + nasFinder + hanClip + stand, /첫 공개판 준비 중|APK v2\b|APK v3\b|APK v544\b|APK v548\b|APK v52\b|APK v53\b/);
  assert.doesNotMatch(hanClip, /android-editor-finish-pets\.png/);
});

test("publishes the WhattoEat 0.4.3 location permission recovery release", async () => {
  const [pageResponse, buildsResponse] = await Promise.all([
    render("/apps/whattoeat"),
    render("/api/testflight-builds"),
  ]);
  assert.equal(pageResponse.status, 200);
  assert.equal(buildsResponse.status, 200);

  const page = await pageResponse.text();
  const builds = await buildsResponse.json();
  const whattoeat = builds.builds.find((build) => build.slug === "whattoeat");

  assert.match(page, /0\.4\.3/);
  assert.match(page, /202608291549/);
  assert.match(page, /내부 코드 346549/);
  assert.match(page, /점심 가방으로 바로 추천/);
  assert.match(page, /실내에서도 멈추지 않는 위치 찾기/);
  assert.match(page, /위치 권한을 놓쳐도 바로 복구/);
  assert.match(page, /상황에 맞는 메뉴와 지도 검색/);
  assert.match(page, /TestFlight에서 참여/);
  assert.match(page, /android-bag-navigation\.png/);
  assert.match(page, /b2387eab4b08056f06539c5dd4fdad59e223f48c4693d1e89c29bfa10c37f847/);
  assert.match(page, /f94c4cfd5cc71645f94a5ba79053743d3d442b4fe83332f5f14579b5536c75a9/);
  assert.equal(whattoeat?.build, "202608271840");
  assert.equal(whattoeat?.inviteUrl, "https://testflight.apple.com/join/A444RsAc");
  assert.equal(whattoeat?.publicBetaState, "approved");
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
  const [ccmb, trackpadGuard, standMac, nasFinderMac, htoms, iManager, legacyIManager] = await Promise.all([
    render("/api/release-download?app=CCMB", interactiveHeaders),
    render("/api/release-download?app=TrackpadGuard", interactiveHeaders),
    render("/api/release-download?app=S.tand-macOS", interactiveHeaders),
    render("/api/release-download?app=NasFinder-Mac", {
      ...interactiveHeaders,
      referer: "http://localhost/apps/nasfinder",
    }),
    render("/api/release-download?app=HtOMS-BK", {
      ...interactiveHeaders,
      referer: "http://localhost/apps/htoms-brief",
    }),
    render("/api/release-download?app=iManager-Android", {
      ...interactiveHeaders,
      referer: "http://localhost/apps/starmanager",
    }),
    render("/api/release-download?app=StarManager-Android", {
      ...interactiveHeaders,
      referer: "http://localhost/apps/starmanager",
    }),
  ]);
  assert.equal(ccmb.status, 302);
  assert.match(ccmb.headers.get("location") ?? "", /^https:\/\/github\.com\/armsone\/CCMB\/releases\//);
  // TrackpadGuard must resolve to a downloadable asset path, never an arbitrary host.
  assert.equal(trackpadGuard.status, 302);
  assert.match(trackpadGuard.headers.get("location") ?? "", /^https:\/\/github\.com\/armsone\/TrackpadGuard\/releases\//);
  assert.equal(standMac.status, 302);
  assert.match(standMac.headers.get("location") ?? "", /^https:\/\/github\.com\/armsone\/S\.tand\/releases\//);
  assert.equal(nasFinderMac.status, 302);
  assert.match(nasFinderMac.headers.get("location") ?? "", /^https:\/\/github\.com\/armsone\/NasFinder\/releases\//);
  assert.equal(htoms.status, 302);
  assert.match(htoms.headers.get("location") ?? "", /^https:\/\/github\.com\/armsone\/HtOMS-BK\/releases\/download\/android-v2\.1\.1\/HtOMS-Brief-Android-2\.1\.1\.apk$/);
  assert.equal(iManager.status, 302);
  assert.match(iManager.headers.get("location") ?? "", /^https:\/\/github\.com\/armsone\/iManager-Android\/releases\/download\/android-v2\.5\.1\/StarManager-Android-2\.5\.1\.apk$/);
  assert.equal(legacyIManager.status, 302);
  assert.equal(legacyIManager.headers.get("location"), iManager.headers.get("location"));
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

test("keeps verified TestFlight fallback data for iManager, Button, and HtOMS", async () => {
  const response = await render("/api/testflight-builds");
  assert.equal(response.status, 200);

  const payload = await response.json();
  const bySlug = new Map(payload.builds.map((build) => [build.slug, build]));
  assert.equal(bySlug.get("nasfinder")?.inviteUrl, "https://testflight.apple.com/join/3m3bhwJz");
  assert.equal(bySlug.get("hanclip")?.inviteUrl, "https://testflight.apple.com/join/m2YsgUJW");
  assert.equal(bySlug.get("stand")?.build, "202608282116");
  assert.equal(bySlug.get("stand")?.uploadedAt, "2026-08-28T21:39:26+09:00");
  assert.equal(bySlug.get("stand")?.inviteUrl, "https://testflight.apple.com/join/mGUYTjdp");
  assert.equal(bySlug.get("stand")?.publicBetaState, "approved");
  assert.equal(bySlug.get("starmanager")?.build, "202608291746");
  assert.equal(bySlug.get("starmanager")?.uploadedAt, "2026-08-29T17:56:17+09:00");
  assert.equal(bySlug.get("starmanager")?.expiresAt, "2026-11-27T17:56:17+09:00");
  assert.equal(bySlug.get("starmanager")?.inviteUrl, "https://testflight.apple.com/join/nzmW4WxW");
  assert.equal(bySlug.get("starmanager")?.publicBetaState, "waitingForReview");
  assert.equal(bySlug.get("button")?.build, "202608291609");
  assert.equal(bySlug.get("button")?.inviteUrl, "https://testflight.apple.com/join/RKcxgTkc");
  assert.equal(bySlug.get("button")?.uploadedAt, "2026-08-29T16:15:10+09:00");
  assert.equal(bySlug.get("htoms-brief")?.build, "202608291628");
  assert.equal(bySlug.get("htoms-brief")?.uploadedAt, "2026-08-29T16:37:14+09:00");
  assert.equal(bySlug.get("htoms-brief")?.publicBetaState, "internalOnly");
  assert.equal(bySlug.get("denimdex")?.build, "202608291110");
  assert.equal(bySlug.get("denimdex")?.uploadedAt, "2026-08-29T11:20:21+09:00");
  assert.equal(bySlug.get("denimdex")?.expiresAt, "2026-11-27T11:20:21+09:00");
  assert.equal(bySlug.get("denimdex")?.inviteUrl, "https://testflight.apple.com/join/5pBrz6ME");
  assert.equal(bySlug.get("denimdex")?.publicBetaState, "waitingForReview");
});

test("tracks every public download in the site counter with download wording", async () => {
  const response = await render();
  const html = await response.text();

  for (const label of [
    "NasFinder Android",
    "NasFinder Mac",
    "Super Thumbnail",
    "HanClip Android",
    "S.tand Mac",
    "S.tand Android",
    "CCMB Mac",
    "BTN Mac",
    "TrackpadGuard Mac",
    "버튼 Android",
    "아이매니저 Android",
  ]) {
    assert.ok(html.includes(label), `missing download counter label: ${label}`);
  }
  assert.match(html, /다운로드 버튼/);
  assert.doesNotMatch(html, /APK 버튼/);
  assert.doesNotMatch(html, /업로드 기록 대기/);
});

test("orders download counters by count while preserving the original order for ties", async () => {
  const { sortDownloadKeysByCount } = await import("../app/releases.ts");
  const keys = ["NasFinder-Android", "NasFinder-Super-Thumbnail", "HanClip-Android", "S.tand-macOS"];

  assert.deepEqual(
    sortDownloadKeysByCount(keys, {
      "NasFinder-Android": 13,
      "NasFinder-Super-Thumbnail": 14,
      "HanClip-Android": 12,
      "S.tand-macOS": 14,
    }),
    ["NasFinder-Super-Thumbnail", "S.tand-macOS", "NasFinder-Android", "HanClip-Android"],
  );
  assert.deepEqual(sortDownloadKeysByCount(keys), keys);
});

test("shows administrator downloads as a responsive ranking without a wide table", async () => {
  const [insights, css] = await Promise.all([
    readFile(new URL("../app/components/SiteInsights.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);

  assert.match(insights, /sortDownloadKeysByCount\(DOWNLOAD_KEYS, downloads\)/);
  assert.match(insights, /totals\[key\].*day\.downloads\[key\]/);
  assert.match(insights, /className="insights-app-ranking"/);
  assert.match(insights, /다운로드 많은 순/);
  assert.doesNotMatch(insights, /apps\.map\(\(\[, label[^\n]*<th/);
  assert.doesNotMatch(insights, /apps\.map\(\(\[repo[^\n]*day\.downloads\[repo\]/);
  assert.match(css, /\.insights-app-ranking\{[^}]*grid-template-columns:repeat\(3,minmax\(0,1fr\)\)/);
  assert.match(css, /\.admin-insights \.insights-table\s*\{\s*table-layout: fixed;/);
  assert.match(css, /\.admin-insights \.chart-bars,\s*\.admin-insights \.insights-table\s*\{\s*min-width: 0;/);
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

test("keeps detailed records on the authenticated admin page and redirects the old public route", async () => {
  const response = await render("/insights");
  assert.ok([307, 308].includes(response.status));
  assert.match(response.headers.get("location") ?? "", /\/#records$/);

  const [homeCounter, adminPage, statsRoute] = await Promise.all([
    readFile(new URL("../app/components/SiteCounter.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/admin/testflight/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/api/site-stats/route.ts", import.meta.url), "utf8"),
  ]);
  assert.match(homeCounter, /<section id="records"/);
  assert.match(homeCounter, /href="\/admin\/testflight">관리자에서 자세히 보기/);
  assert.doesNotMatch(homeCounter, /href="\/insights"/);
  assert.match(adminPage, /<SiteInsights embedded showSources \/>/);
  assert.match(adminPage, /관리자 화면에서는 유입 경로까지 표시합니다/);
  assert.match(statsRoute, /includeSources/);
  assert.match(statsRoute, /isRequestAuthenticated/);
});

test("shows the refreshed progress review date and TrackpadGuard DMG download", async () => {
  const [btnResponse, trackpadResponse] = await Promise.all([
    render("/apps/btn"),
    render("/apps/trackpadguard"),
  ]);
  const [btn, trackpadGuard] = await Promise.all([btnResponse.text(), trackpadResponse.text()]);

  assert.match(btn, /마지막 내용 확인: 2026년 8월 25일/);
  assert.match(trackpadGuard, /마지막 내용 확인: 2026년 8월 25일/);
  assert.match(trackpadGuard, /release-download\?app=TrackpadGuard/);
  assert.doesNotMatch(trackpadGuard, /releases\/tag\/v0\.1\.3/);
});
