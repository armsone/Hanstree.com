import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdvantageVisual, type AdvantageVariant } from "../../components/AdvantageVisual";
import { AppDownloadCta } from "../../components/AppDownloadCta";
import { AppArtwork, AppIcon, AppStatus } from "../../components/AppVisuals";
import { ContactReveal } from "../../components/ContactReveal";
import { findApp } from "../../data";
import { SiteFooter, SiteHeader } from "../../page";

type RouteProps = { params: Promise<{ path: string[] }> };

const campaignSlugs = new Set(["super-thumbnail", "hanclip", "stand", "ccmb", "trackpadguard", "intosharp", "airchurch"]);

const contentVisualRules: [RegExp, AdvantageVariant][] = [
  [/Live Photo|Motion Photo|움직이는 사진/, "live-motion-swap"],
  [/저장공간|클라우드|NAS|Dropbox|OneDrive|Google Drive|Synology|SFTP|SMB|WebDAV|FTP/, "storage-network"],
  [/VLC|스트리밍|재생 제어|영상.*재생/, "play-remote"],
  [/폰하드/, "phone-drive"],
  [/폴더|Finder/, "folder-pick"],
  [/재귀|검색.*파일|스캔/, "recursive-scan"],
  [/Vault|호환|바로 호환/, "vault-ready"],
  [/이어서|재개|건너뛰고|중단/, "resume-progress"],
  [/진행률|남은 시간|한눈에.*상태|용량/, "progress-bar"],
  [/서버로 보내지 않|Mac에서 직접|로컬에서만/, "mac-local"],
  [/영화|필름|30편/, "film-reel"],
  [/음악 길이|엔딩.*시간|빠른 영화/, "music-timeline"],
  [/스윙|AiShot|타격/, "target-swing"],
  [/화면비|워터마크|조절.*자막|내 방식으로/, "sliders"],
  [/시사회|미리보기.*저장|저장하기 전에/, "preview-export"],
  [/보관함|프로젝트 보관/, "archive-stack"],
  [/커서.*이동|입력.*차단|글을 쓰는 동안/, "keyboard-lock"],
  [/1초|자동 해제|초 후/, "timer-release"],
  [/터치.*해제|영역.*터치|톡톡/, "touch-zone"],
  [/마우스|트랙볼|펜 태블릿/, "pointer-devices"],
  [/실패 안전|안전 설계/, "shield-safe"],
  [/Keychain|Keystore|비밀번호|암호화|안전한 로그인/, "lock-local"],
  [/세 가지|3열|세 AI|Codex.*Claude.*Gemini/, "three-rings"],
  [/새로고침|갱신/, "clock-refresh"],
  [/두 패널|패널/, "two-panels"],
  [/JSON|로컬 공유|ccmb-usage/, "json-local"],
  [/복구|잠자기|깨우기|네트워크 단절/, "recovery-wake"],
  [/API 키|키를 앱에 넣지/, "no-key"],
  [/플립|시계/, "flip-clock"],
  [/밤|어두운|조명|매이트/, "night-glow"],
  [/수면 기록|타임라인|기록.*확인|20개 기록/, "timeline-dots"],
  [/테마|글꼴|꾸미기|내 화면 만들기/, "palette"],
  [/음악 스트립|음악 채널|라디오/, "music-grid"],
  [/백그라운드|권한 선택|선택하는/, "toggle-control"],
  [/이름으로|이름을 입력/, "name-tag"],
  [/검색/, "search-bar"],
  [/한눈에|모아|이음말|카드에서/, "groups-grid"],
  [/기억|기본값|즐겨찾기|다시 불러오기/, "defaults-star"],
  [/시작 화면|첫 화면|홈 화면/, "homepage-flag"],
  [/여러 기기|기기 간|호환 모드|가족 공간/, "devices-pair"],
  [/설교|찬양/, "sermon-mic"],
  [/발견|지역.*교회/, "discovery-map"],
  [/나눔|달란트|필요한 곳/, "heart-share"],
  [/광장|커뮤니티|별칭/, "shield-community"],
  [/검증|교차 확인|출처/, "check-source"],
  [/둘러보기|가입 없이/, "eye-browse"],
  [/Android/, "android-bot"],
  [/사이렌|호출|녹음/, "sermon-mic"],
  [/찜|지도 앱|맛보기/, "discovery-map"],
  [/매출|추이|현황/, "progress-bar"],
  [/AI를 먼저 선택|네 가지 말투/, "sliders"],
];

const contentVisualFallback: AdvantageVariant[] = ["spark", "layers", "compass", "bolt", "toggle-control", "three-rings"];

function pickContentVisual(text: string, index: number): AdvantageVariant {
  for (const [pattern, variant] of contentVisualRules) {
    if (pattern.test(text)) return variant;
  }
  return contentVisualFallback[index % contentVisualFallback.length];
}

function platformVisual(name: string): AdvantageVariant {
  if (/iPhone|iPad|iOS/.test(name)) return "phone-drive";
  if (/Mac/.test(name)) return "mac-local";
  if (/Android/.test(name)) return "android-bot";
  if (/Web/.test(name)) return "web-globe";
  return "devices-pair";
}

const progressStateVisual: Record<"done" | "active" | "next", AdvantageVariant> = {
  done: "check-badge",
  active: "spark",
  next: "compass",
};

function testFlightApplicationHref(appSlug: string) {
  return `/?testflightApp=${encodeURIComponent(appSlug)}#testflight-apply`;
}

export async function generateMetadata({ params }: RouteProps): Promise<Metadata> {
  const { path } = await params;
  const app = findApp(path[0]);
  if (!app) return {};
  const section = path[1];
  const suffix = section === "privacy" ? "개인정보처리방침" : section === "terms" ? "이용약관" : section === "support" ? "지원" : section === "data-deletion" ? "데이터 삭제" : section === "google-oauth" ? "Google API Use & Data Handling" : null;
  const title = suffix ? `${app.name} ${suffix}` : `${app.name} — ${app.tagline}`;
  const socialImage = !suffix
    ? app.icon ?? (app.slug === "stand" ? "/og-stand.png" : undefined)
    : undefined;
  const socialImages = socialImage ? [new URL(socialImage, "https://nasfinder.com").toString()] : [];
  return {
    title,
    description: app.summary,
    openGraph: { title, description: app.summary, images: socialImages },
    twitter: { card: "summary_large_image", title, description: app.summary, images: socialImages },
  };
}

export default async function AppRoute({ params }: RouteProps) {
  const { path } = await params;
  const app = findApp(path[0]);
  if (!app) notFound();

  const section = path[1];
  if (section === "google-oauth" && app.slug !== "nasfinder") notFound();
  if (section && !["privacy", "terms", "support", "data-deletion", "google-oauth"].includes(section)) notFound();
  if (section === "google-oauth") return <GoogleOAuthPage />;
  if (section) return <InfoPage app={app} section={section} />;

  return (
    <main className={`app-page app-${app.slug} theme-${app.theme}`}>
      <SiteHeader />
      <section className="app-hero shell">
        <div className="app-hero-copy reveal">
          <Link className="breadcrumb" href="/#apps">← 모든 앱</Link>
          <div className="app-ident"><AppIcon app={app} /><span>{app.english}</span></div>
          <p className="eyebrow">{app.eyebrow}</p>
          <h1>{app.tagline}</h1>
          <p className="app-summary">{app.summary}</p>
          <div className="chip-row">
            {app.platforms.map((platform) => (
              <span className="platform-action-group" key={platform.name}>
                <AppStatus platform={platform} />
                {platform.status === "TestFlight" && (
                  <Link className="testflight-apply-chip" href={testFlightApplicationHref(app.slug)}>
                    테스터 신청하기 <span aria-hidden="true">→</span>
                  </Link>
                )}
              </span>
            ))}
          </div>
          <div className="hero-actions">
            {app.platforms.some((platform) => platform.url) ? (
              <AppDownloadCta className="button button-primary" platforms={app.platforms} />
            ) : <Link className="button button-primary" href="#progress">진행 상황 보기 <span aria-hidden="true">↓</span></Link>}
            <Link className="button button-quiet" href="#guide">사용법 보기</Link>
          </div>
        </div>
        <div className="app-hero-visual reveal"><AppArtwork app={app} /></div>
      </section>

      <nav className="section-nav" aria-label={`${app.name} 페이지 내부 메뉴`}>
        <div className="shell">
          {app.slug === "nasfinder" ? (
            <><Link href="#why-nasfinder">왜 나스파인더</Link><Link href="#features">특징</Link><Link href="#screens">화면</Link><Link href="#download">설치</Link></>
          ) : (
            <><Link href="#product-campaign">왜 {app.name}</Link><Link href="#features">특징</Link><Link href="#screens">화면</Link>{app.matchup && <Link href="#matchup">매치업</Link>}<Link href="#progress">진행 상황</Link><Link href="#guide">설명서</Link><Link href="#download">다운로드</Link></>
          )}
        </div>
      </nav>

      {app.slug === "nasfinder" && <NasFinderPromotion />}
      {campaignSlugs.has(app.slug) ? <ProductPromotion app={app} /> : app.slug !== "nasfinder" && <ProductSpotlight app={app} />}

      <section className="feature-section shell" id="features">
        <div className="section-heading reveal"><div><p className="eyebrow">FEATURES</p><h2>복잡함은 덜고,<br />쓰임은 선명하게.</h2></div></div>
        <div className="feature-grid">
          {app.features.map((feature, index) => <article className={`feature-card reveal${feature.icon ? " feature-card-branded" : ""}`} key={feature.title}><span>0{index + 1}</span>{feature.icon ? <Image className="feature-icon" src={feature.icon} alt="" width={72} height={72} unoptimized /> : <AdvantageVisual variant={pickContentVisual(`${feature.title} ${feature.body}`, index)} />}<h3>{feature.title}</h3><p>{feature.body}</p></article>)}
        </div>
      </section>

      <section className="screens-section" id="screens">
        <div className="shell">
          <div className="section-heading reveal"><div><p className="eyebrow">IN THE PRODUCT</p><h2>화면으로 먼저 만나보세요.</h2></div><p>실제 공개 자료를 우선 사용하고, 개인 정보가 담긴 화면은 데모 데이터로 교체합니다.</p></div>
          {app.screenshots && app.screenshots.length > 0 ? (
            <div className="screenshot-rail">{app.screenshots.map((screen) => {
              const dimensions = app.slug === "nasfinder"
                ? { width: 1080, height: 2424 }
                : screen.layout === "menu"
                  ? { width: 700, height: 968 }
                  : screen.layout === "landscape"
                    ? { width: 2622, height: 1206 }
                    : screen.layout === "tv"
                      ? { width: 1920, height: 1080 }
                    : screen.layout === "wide"
                      ? { width: 860, height: 60 }
                      : { width: 1206, height: 2622 };
              return <figure className={`screen-${screen.layout ?? "phone"}`} key={screen.src}><div className="screenshot-media"><Image src={screen.src} alt="" width={dimensions.width} height={dimensions.height} sizes={screen.layout ? "(max-width: 640px) 92vw, 1080px" : "(max-width: 640px) 78vw, 360px"} unoptimized /></div><figcaption>{screen.alt}</figcaption></figure>;
            })}</div>
          ) : (
            <div className="single-artwork reveal"><AppArtwork app={app} /><p>대표 화면 이미지는 현재 제품 상태에 맞춰 계속 보강합니다.</p></div>
          )}
        </div>
      </section>

      {app.matchup && (
        <section className="matchup-section" id="matchup">
          <div className="shell">
            <div className="section-heading reveal">
              <div><p className="eyebrow">DETERMINISTIC UI MATCHUP</p><h2>느낌이 아니라,<br />재현 가능한 화면으로.</h2></div>
              <p>한국어·서울 시간대·고정 시각·애니메이션 비활성 조건에서 iOS와 Android를 같은 의미 ID로 캡처하고 비교합니다.</p>
            </div>
            <div className="matchup-layout">
              <div className="matchup-metrics reveal">
                {app.matchup.metrics.map((metric) => <article key={metric.label}><strong>{metric.value}</strong><span>{metric.label}</span></article>)}
              </div>
              <div className="matchup-scope reveal">
                <h3>검증 범위</h3>
                <ul>{app.matchup.scope.map((item) => <li key={item}>{item}</li>)}</ul>
                <p><strong>현재 상태</strong>{app.matchup.note}</p>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="progress-section shell" id="progress">
        <div className="section-heading reveal"><div><p className="eyebrow">BUILDING IN PUBLIC</p><h2>현재 진행 상황</h2></div><p>숫자보다 실제 상태를 보여드립니다. 마지막 내용 확인: 2026년 8월 23일.</p></div>
        <div className="progress-list">
          {app.progress.map((item) => <article className="progress-item reveal" key={item.title}><div className={`progress-marker marker-${item.state}`}><AdvantageVisual variant={progressStateVisual[item.state]} /></div><div><p>{item.state === "done" ? "구현됨" : item.state === "active" ? "검증 중" : "다음 단계"}</p><h3>{item.title}</h3><span>{item.body}</span></div></article>)}
        </div>
      </section>

      <section className="guide-section" id="guide">
        <div className="shell guide-layout">
          <div className="guide-sticky reveal"><p className="eyebrow">QUICK GUIDE</p><h2>처음부터<br />차근차근.</h2><p>더 자세한 설명과 문제 해결 문서는 제품 개발 진행에 맞춰 계속 추가됩니다.</p></div>
          <div className="guide-steps">
            {app.guide.map((step, index) => <article className="guide-step reveal" key={step.title}><span>{String(index + 1).padStart(2, "0")}</span><div><AdvantageVisual variant={pickContentVisual(`${step.title} ${step.body}`, index)} /><h3>{step.title}</h3><p>{step.body}</p></div></article>)}
          </div>
        </div>
      </section>

      <section className="download-section shell reveal" id="download">
        <div><p className="eyebrow">OPEN, DOWNLOAD & TEST</p><h2>공개된 제품과 전용 도구.</h2><p>플랫폼별 현재 상태와 공식 주소·배포 파일을 구분해 표시합니다. 별도 도구는 용도까지 확인한 뒤 내려받을 수 있습니다.</p></div>
        <div className="download-list">
          {app.platforms.map((platform) => <article key={platform.name}><div><AdvantageVisual variant={platformVisual(platform.name)} /><span className={`status-dot status-${platform.status.replace(" ", "-")}`} /><h3>{platform.name}</h3></div><p>{platform.detail} · {platform.status}</p>{platform.url ? <a href={platform.url}>{platform.downloadLabel ?? "다운로드 페이지"} <span aria-hidden="true">↗</span></a> : platform.status === "TestFlight" ? <Link className="testflight-apply-download" href={testFlightApplicationHref(app.slug)}>TestFlight 테스터 신청하기 <span aria-hidden="true">↗</span></Link> : <span>{platform.availabilityNote ?? "공개 링크 준비 중"}</span>}{platform.checksum && <small className="download-checksum">SHA-256 {platform.checksum}</small>}</article>)}
        </div>
      </section>

      <section className="support-cards shell reveal">
        <Link href={`/apps/${app.slug}/privacy`}><span>PRIVACY</span><AdvantageVisual variant="shield-safe" /><h3>개인정보처리방침</h3><p>앱이 다루는 데이터와 보관·삭제 방식을 확인합니다.</p><b>→</b></Link>
        <Link href={`/apps/${app.slug}/support`}><span>SUPPORT</span><AdvantageVisual variant="life-ring" /><h3>지원과 문의</h3><p>문제 해결과 오류 제보에 필요한 내용을 안내합니다.</p><b>→</b></Link>
        <Link href={`/apps/${app.slug}/terms`}><span>TERMS</span><AdvantageVisual variant="doc-scroll" /><h3>이용약관</h3><p>제품 이용 조건과 책임 범위를 확인합니다.</p><b>→</b></Link>
      </section>
      <SiteFooter />
    </main>
  );
}

const spotlightVisuals: AdvantageVariant[] = ["spark", "layers", "compass", "bolt"];

function ProductSpotlight({ app }: { app: NonNullable<ReturnType<typeof findApp>> }) {
  return (
    <section className="product-promo" id="product-campaign">
      <div className="shell product-promo-hero">
        <div className="product-promo-copy reveal">
          <p className="eyebrow">MADE FOR A REAL MOMENT</p>
          <h2>{app.name}.<br /><span>쓰는 이유가 먼저.</span></h2>
          <p>{app.summary}</p>
          <div className="product-promo-actions"><Link className="button product-promo-primary" href="#screens">실제 화면 보기 <span aria-hidden="true">↓</span></Link><Link className="button product-promo-secondary" href="#download">지금 만나는 방법 <span aria-hidden="true">→</span></Link></div>
        </div>
        <div className="product-promo-image product-promo-artwork reveal"><AppArtwork app={app} /><div className="product-promo-image-label"><span>{app.eyebrow}</span><strong>{app.tagline}</strong></div></div>
        <div className="product-promo-facts reveal" aria-label={`${app.name}이 주는 핵심 가치`}>
          {app.features.slice(0, 3).map((feature, index) => <p key={feature.title}><strong>{String(index + 1).padStart(2, "0")}</strong><span>{feature.title}</span></p>)}
        </div>
      </div>
      <div className="shell product-advantages">
        <div className="product-section-intro reveal"><p className="eyebrow">WHY IT MATTERS</p><h2>기능보다 먼저.<br /><span>달라지는 일.</span></h2><p>{app.tagline} 실제 사용에서 바로 느낄 수 있는 핵심 이점을 먼저 소개합니다.</p></div>
        <div className="product-advantage-grid">
          {app.features.slice(0, 4).map((feature, index) => <article className="product-advantage-card reveal" key={feature.title}><div><span>{String(index + 1).padStart(2, "0")}</span><small>{app.english.toUpperCase()}</small></div><AdvantageVisual variant={spotlightVisuals[index % spotlightVisuals.length]} /><h3>{feature.title}</h3><p>{feature.body}</p></article>)}
        </div>
      </div>
    </section>
  );
}

const productCampaigns = {
  "super-thumbnail": {
    tone: "vault",
    eyebrow: "PREPARE ONCE, BROWSE VISUALLY",
    headline: <>수만 개의 파일을.<br /><span>이름 대신 장면으로.</span></>,
    description: "Finder에 연결한 NAS나 Mac 폴더를 고르면 수퍼썸네일을 미리 준비합니다. 큰 미디어 보관함도 NasFinder에서 표지를 보며 탐색할 수 있게 만드세요.",
    image: "/apps/super-thumbnail/super-thumbnail-campaign.png",
    imageAlt: "Mac의 큰 미디어 폴더에서 수많은 미리보기 타일이 수퍼썸네일 보관함으로 만들어지는 캠페인 이미지",
    imageLabel: "MAC FOLDER → .NASFINDER-VAULT → ALL DEVICES",
    facts: [["16,540", "검증한 미디어 파일"], ["1.57TB", "검증한 원본 폴더"], ["04", "NasFinder 지원 플랫폼"]],
    advantages: [
      ["01", "CHOOSE IN FINDER", "지금 쓰는 NAS 폴더에서 바로 시작합니다.", "Finder에 연결한 NAS 공유나 Mac 폴더를 사용자가 직접 선택합니다.", "별도 업로드 공간을 만들지 않고 이미 정리한 보관함을 그대로 대상으로 삼습니다.", "folder-pick"],
      ["02", "RECURSIVE SCAN", "깊숙한 하위 폴더까지 한 번에 찾습니다.", "선택한 폴더 아래의 사진과 영상을 재귀적으로 찾아 JPEG 수퍼썸네일을 만듭니다.", "폴더를 하나씩 열어 작업하지 않고 큰 미디어 트리 전체를 준비합니다.", "recursive-scan"],
      ["03", "NASFINDER READY", "한 번 준비해 여러 기기에서 봅니다.", "수퍼썸네일을 NasFinder가 읽는 이름과 .NasFinder-Vault 구조로 저장합니다.", "iPhone·iPad·Mac·Android NasFinder가 같은 준비된 미리보기를 활용합니다.", "vault-ready"],
      ["04", "RESUME", "긴 작업은 멈췄다가 그대로 이어갑니다.", "이미 만든 썸네일은 건너뛰고 남은 미디어를 다시 검사합니다.", "처음부터 다시 만드는 대신 완료된 결과를 보존하며 대형 작업을 나눠 진행합니다.", "resume-progress"],
      ["05", "VISIBLE PROGRESS", "얼마나 남았는지 숫자로 확인합니다.", "전체·완료 파일 수, 예상 남은 시간, 확인한 원본과 생성된 썸네일 용량을 표시합니다.", "작업 규모와 진행 상태를 보며 중단하거나 계속할 시점을 판단합니다.", "progress-bar"],
      ["06", "ON YOUR MAC", "원본 미디어는 Mac에서 직접 처리합니다.", "사용자가 고른 Finder 폴더를 Mac에서 읽고 쓰며 파일을 개발자 서버로 보내지 않습니다.", "수퍼썸네일을 만들기 위해 대형 원본 보관함을 별도 서버에 업로드하지 않습니다.", "mac-local"],
    ],
    stories: [
      ["01", "가족 사진 NAS를 준비할 때", "Finder에 연결한 가족 사진 폴더를 고르고 수퍼썸네일 생성을 시작합니다. 다음에는 iPhone NasFinder에서 파일명 대신 장면을 보며 원하는 사진을 찾습니다.", "NAS · 가족 사진 · 시각 탐색"],
      ["02", "하룻밤에 끝나지 않는 보관함", "큰 영상 폴더 작업을 멈췄다가 다시 엽니다. 이미 만든 썸네일은 건너뛰고 남은 파일부터 이어가며 완료 수와 예상 시간을 확인합니다.", "이어하기 · 진행률 · 대형 폴더"],
      ["03", "한 번 만들어 여러 기기에서", "Mac에서 .NasFinder-Vault를 준비한 뒤 같은 NAS를 iPad와 Android NasFinder에서 엽니다. 각 기기에서 준비된 표지를 보며 미디어를 탐색합니다.", "Mac 준비 · iPad · Android"],
    ],
    ctaEyebrow: "YOUR ARCHIVE, READY TO SEE",
    ctaTitle: <>폴더는 그대로 두고.<br /><span>찾는 경험만 바꾸세요.</span></>,
    ctaBody: "공증된 Apple Silicon Mac 앱으로 NAS와 Mac의 큰 미디어 폴더에 NasFinder용 미리보기를 준비하세요.",
    ctaLabel: "Mac용 수퍼썸네일 받기",
  },
  hanclip: {
    tone: "coral",
    eyebrow: "TURN MOMENTS INTO A MOVIE",
    headline: <>찍어 둔 순간을,<br /><span>오늘 한 편의 영화로.</span></>,
    description: "사진, 영상, Live Photo와 Motion Photo를 고르세요. 장면은 음악 길이에 맞춰 이어지고, 자막부터 엔딩까지 내가 원하는 한 편의 MP4로 완성됩니다.",
    image: "/apps/hanclip/hanclip-campaign.png",
    imageAlt: "사진과 움직이는 장면, 음악 파형이 하나의 영화로 이어지는 HanClip 캠페인 이미지",
    imageLabel: "PHOTO · VIDEO · LIVE · MOTION → MP4",
    facts: [["04", "iPhone · iPad · Mac · Android"], ["30", "완성 영화 보관함"], ["MP4", "공유하기 쉬운 한 편"]],
    advantages: [
      ["01", "ONE MOVIE", "고른 순간이 곧 영화가 됩니다.", "사진·영상·Live Photo·Motion Photo를 한 흐름에 담아 MP4로 만듭니다.", "서로 다른 촬영 형식을 따로 정리하지 않고 한 편으로 묶습니다.", "film-reel"],
      ["02", "QUICK MOVIE", "음악이 끝나면, 영화도 정확히 끝납니다.", "빠른 영화가 장면 길이를 나누고 엔딩을 포함한 전체 시간을 선택한 음악 길이에 맞춥니다.", "컷마다 시간을 계산하는 대신 음악과 함께 끝나는 흐름을 빠르게 만듭니다.", "music-timeline"],
      ["03", "AISHOT", "큰 스윙도, 조용한 퍼팅도 놓치지 않도록.", "Apple판 AiShot은 준비부터 스윙까지의 화면 움직임과 기기 내 자세를 타격음과 함께 확인하고, 조용한 퍼팅은 작은 백스윙부터 팔로스루까지 동작이 완성될 때만 보수적으로 촬영합니다.", "말소리와 주변 타석 소리, 카메라 움직임은 낮추고 실제 샷 흐름이 확인된 순간부터 남기도록 돕습니다.", "target-swing"],
      ["04", "FULL CONTROL", "자동으로 시작하고, 내 취향으로 끝냅니다.", "순서·길이·화면비·자막·음악·워터마크·엔딩 카드를 직접 조정합니다.", "빠른 초안 위에 나만의 이야기와 마무리를 더합니다.", "sliders"],
      ["05", "PREVIEW & EXPORT", "저장하기 전에, 완성본처럼 봅니다.", "미리보기로 결과를 확인한 뒤 사진·갤러리·파일로 저장합니다.", "내보낸 뒤 다시 만드는 일을 줄이고 원하는 곳으로 바로 보냅니다.", "preview-export"],
      ["06", "KEEP CREATING", "완성작도, 다음 편도 이어집니다.", "완성 영화는 앱 안에 최대 30편 보관하고 프로젝트와 컬렉션은 다시 열어 편집합니다.", "한 번 만든 소재를 버리지 않고 다른 화면비와 구성으로 다시 활용합니다.", "archive-stack"],
    ],
    stories: [
      ["01", "여행의 마지막 밤", "여행 사진과 짧은 영상을 고르고 음악 한 곡을 선택합니다. 빠른 영화로 길이를 맞춘 뒤 엔딩까지 미리 보고, 가족에게 보낼 MP4를 완성합니다.", "여행 · 음악 길이 · 빠른 영화"],
      ["02", "소리 없는 영상에서 순간을 찾을 때", "타임랩스나 슬로 모션처럼 오디오 트랙이 없는 영상도 화면 움직임으로 하이라이트를 찾습니다. 뚜렷한 변화가 없으면 영상 중앙을 기준으로 시작할 지점을 제안합니다.", "무음 영상 · 움직임 분석 · 중앙 대안"],
      ["03", "같은 이야기, 다른 화면", "저장해 둔 프로젝트를 다시 열어 화면비와 엔딩 카드를 바꿉니다. 미리보기로 확인한 뒤 새 버전을 파일과 갤러리에 각각 저장합니다.", "프로젝트 · 화면비 · 다시 만들기"],
    ],
    ctaEyebrow: "YOUR MOMENTS, NOW PLAYING",
    ctaTitle: <>카메라 롤에 머문 순간을.<br /><span>지금 재생되는 이야기로.</span></>,
    ctaBody: "사진 몇 장과 영상 몇 개면 충분합니다. HanClip에서 고르고, 음악을 얹고, 한 편으로 완성하세요.",
    ctaLabel: "HanClip 시작하기",
  },
  trackpadguard: {
    tone: "guard",
    eyebrow: "TYPE WITHOUT THE JUMP",
    headline: <>타이핑할 때,<br /><span>커서는 제자리에.</span></>,
    description: "손바닥이 트랙패드에 닿아도 글쓰기 흐름을 놓치지 않도록. 입력 중에는 이동·클릭·스크롤을 막고, 내가 원할 때 즉시 다시 엽니다.",
    image: "/apps/trackpadguard/trackpadguard-campaign.png",
    imageAlt: "타이핑 중 트랙패드의 잠금 구역과 즉시 해제 구역을 표현한 TrackpadGuard 캠페인 이미지",
    imageLabel: "TYPE → LOCK · TOUCH → RELEASE",
    facts: [["1s", "마지막 키 입력 후 자동 해제"], ["4P", "네 점으로 그리는 해제 구역"], ["SAFE", "좌표를 못 읽으면 잠금 안 함"]],
    advantages: [
      ["01", "LOCK WHILE TYPING", "글을 쓰는 동안, 실수 입력은 멈춥니다.", "키보드 입력 중 트랙패드의 포인터 이동·클릭·스크롤을 막습니다.", "커서가 다른 문단으로 뛰거나 원치 않는 클릭이 생기는 순간을 줄입니다.", "keyboard-lock"],
      ["02", "AUTO RELEASE", "손을 멈추면 1초 뒤, 다시 움직입니다.", "마지막 키 입력 후 1초가 지나면 트랙패드 잠금을 자동으로 풉니다.", "설정을 다시 열지 않고 타이핑과 포인터 작업을 자연스럽게 오갑니다.", "timer-release"],
      ["03", "TOUCH TO RELEASE", "기다릴 틈이 없을 땐, 정한 곳을 터치하세요.", "네 점으로 편집한 물리적 구역을 새로 터치하면 즉시 해제됩니다.", "자주 쓰는 손동작에 맞춰 나만의 빠른 해제 지점을 만듭니다.", "touch-zone"],
      ["04", "OTHER POINTERS", "마우스와 펜은 바로 알아봅니다.", "마우스·트랙볼·펜 태블릿의 이동·클릭·스크롤이 들어오면 잠금을 풉니다.", "트랙패드 보호 때문에 다른 입력 장치의 흐름까지 끊기지 않습니다.", "pointer-devices"],
      ["05", "FAIL SAFE", "잠글 수 없는 상태라면, 잠그지 않습니다.", "멀티터치 좌표를 읽지 못하면 잠금을 시작하지 않고 비상 단축키도 제공합니다.", "예외 상황에서도 포인터를 잃지 않도록 빠져나올 길을 남깁니다.", "shield-safe"],
      ["06", "LOCAL BY DESIGN", "키 내용도, 터치 좌표도 쌓지 않습니다.", "키 입력 내용과 터치 좌표를 저장하거나 전송하지 않으며 서명된 업데이트를 사용합니다.", "입력 보호 기능이 내 작업 내용을 수집하는 도구가 되지 않습니다.", "lock-local"],
    ],
    stories: [
      ["01", "긴 원고에 집중할 때", "손을 노트북에 편하게 올리고 문장을 이어갑니다. 입력 중 커서는 제자리에 있고, 잠깐 멈추면 1초 뒤 다시 포인터를 사용합니다.", "글쓰기 · 커서 보호 · 자동 해제"],
      ["02", "커서를 바로 꺼내야 할 때", "트랙패드 아래쪽에 해제 구역을 그려 둡니다. 타이핑 중에도 그 지점만 새로 터치해 잠금을 즉시 풀고, 빨간 메뉴 아이콘으로 상태를 확인합니다.", "사용자 구역 · 즉시 해제 · 상태 표시"],
      ["03", "마우스와 펜을 함께 쓸 때", "키보드로 입력하다 마우스를 움직이거나 펜으로 클릭합니다. 다른 포인팅 장치가 들어오는 순간 잠금이 풀려 작업 도구를 바로 바꿉니다.", "마우스 · 트랙볼 · 펜 태블릿"],
    ],
    ctaEyebrow: "KEEP YOUR FLOW",
    ctaTitle: <>문장은 계속 쓰고.<br /><span>커서는 흔들리지 않게.</span></>,
    ctaBody: "macOS 13 이상에서 나만의 해제 구역을 정하고, 다음 타이핑부터 TrackpadGuard의 차이를 확인하세요.",
    ctaLabel: "TrackpadGuard 받기",
  },
  ccmb: {
    tone: "meter",
    eyebrow: "THREE SERVICES, ONE GLANCE",
    headline: <>AI 사용량,<br /><span>메뉴 막대 한 칸이면 끝.</span></>,
    description: "Codex·Claude·Gemini의 사용량과 갱신 시간을 세 칸 링에 모으고, 메뉴 막대에서는 대표 색상의 숫자만으로 남은 여유를 빠르게 보여 줍니다.",
    image: "/apps/ccmb/ccmb-campaign.png",
    imageAlt: "세 개의 사용량 링이 메뉴와 항상 표시 패널에 나란히 보이는 CCMB 캠페인 이미지",
    imageLabel: "CODEX · CLAUDE · GEMINI",
    facts: [["03", "AI 서비스 한 패널"], ["02", "메뉴 · 항상 표시 패널"], ["LOCAL", "기존 CLI 세션 활용"]],
    advantages: [
      ["01", "THREE RINGS", "세 서비스의 남은 여유를 한눈에.", "Codex·Claude·Gemini의 사용량과 크레딧 정보를 3열 링으로 모으고 메뉴 막대 숫자에도 각 서비스의 대표 색상을 적용합니다.", "서비스를 하나씩 열지 않고 다음 작업에 쓸 도구를 빠르게 가늠합니다.", "three-rings"],
      ["02", "REFRESH CLOCK", "언제 갱신되는지도 함께 봅니다.", "서비스별 새로고침 간격과 다음 갱신까지 남은 시간을 표시합니다.", "오래된 수치를 새 정보처럼 읽지 않고 확인 시점을 함께 판단합니다.", "clock-refresh"],
      ["03", "TWO VIEWS", "메뉴에서도, 항상 보이는 패널에서도.", "메뉴 패널과 항상 표시 패널이 같은 정보를 보여 주며 업데이트·버전·투명도·재시작·종료 조작을 간결하게 정돈했습니다.", "작업 방식에 맞는 위치에 두고 같은 현황을 계속 확인합니다.", "two-panels"],
      ["04", "FRESH LOCAL DATA", "다른 도구도 같은 상태를 읽습니다.", "계정·플랜·갱신 상태를 정렬하고 신선도 정보가 포함된 로컬 JSON을 노출합니다.", "앱과 Codex 대화가 서로 다른 오래된 수치를 보지 않도록 연결합니다.", "json-local"],
      ["05", "RECOVERY", "잠자기에서 깨어나도 다시 이어집니다.", "네트워크 변화와 잠자기·깨우기 뒤 복구하며 로그인 시 실행과 서명된 업데이트를 지원합니다.", "매번 앱 상태를 되돌리는 대신 메뉴 막대의 모니터링 흐름을 유지합니다.", "recovery-wake"],
      ["06", "NO BUILT-IN KEYS", "새 API 키를 앱에 넣지 않습니다.", "이미 로그인된 로컬 CLI 세션을 활용하며 분석·원격 텔레메트리를 보내지 않습니다.", "사용량 확인을 위해 별도의 키 보관과 원격 분석을 추가하지 않습니다.", "no-key"],
    ],
    stories: [
      ["01", "큰 작업을 시작하기 전에", "메뉴 막대의 세 가지 색 숫자와 세 칸 링을 열어 각 서비스의 남은 사용량과 갱신 시간을 봅니다. 여유가 있는 도구를 확인하고 오늘의 작업을 배분합니다.", "세 서비스 · 잔량 · 갱신 시간"],
      ["02", "패널을 늘 보이는 곳에", "작업 화면 옆에 항상 표시 패널을 두고 메뉴와 같은 수치를 확인합니다. 맥이 잠자기에서 깨어나거나 네트워크가 돌아온 뒤에도 흐름을 이어갑니다.", "항상 표시 · 복구 · 한눈에"],
      ["03", "같은 데이터를 다른 도구로", "신선도 정보가 포함된 로컬 JSON을 다른 앱과 Codex 대화에서 읽습니다. CCMB에는 새 API 키를 넣지 않고 기존 CLI 세션만 사용합니다.", "로컬 JSON · 신선도 · 읽기 전용"],
    ],
    ctaEyebrow: "KNOW BEFORE YOU START",
    ctaTitle: <>열어 보기 전에.<br /><span>남은 여유부터 보세요.</span></>,
    ctaBody: "Codex·Claude·Gemini를 오가는 작업이라면, 비공식 macOS 메뉴 막대 앱 CCMB로 사용량 확인부터 한곳에 모으세요.",
    ctaLabel: "CCMB 다운로드",
  },
  stand: {
    tone: "night",
    eyebrow: "MORE THAN A BEDSIDE CLOCK",
    headline: <>낮에는 시계.<br /><span>밤에는 조용한 메이트.</span></>,
    description: "플립 클록·날씨·배터리·음악을 한자리에 두고, 밤에는 움직임과 큰 소리에 화면과 조명으로 반응합니다. 아침에는 기기에 남은 후보 소리 타임라인을 확인하세요.",
    image: "/apps/stand/stand-campaign.png",
    imageAlt: "어두운 침실에서 플립 클록과 소리 타임라인이 은은하게 빛나는 S.tand 캠페인 이미지",
    imageLabel: "CLOCK · MATE · MUSIC · LOCAL TIMELINE",
    facts: [["2min", "메이트 모드 준비 시간"], ["06", "음악 스트립 슬롯"], ["LOCAL", "후보 소리 기기 내 타임라인"]],
    advantages: [
      ["01", "FLIP CLOCK", "세로로도, 가로로도 자리에 맞습니다.", "플립 클록과 날씨, 배터리를 iPhone·iPad·Mac·Android에서 세로와 가로로 보여 줍니다.", "책상과 침대 옆, 충전 중인 화면을 필요한 정보가 있는 오브제로 바꿉니다.", "flip-clock"],
      ["02", "MATE MODE", "어두운 밤에는 낮게, 필요할 때는 반응하게.", "최소 밝기를 유지하고 메이트 모드 진입 2분 뒤 움직임이나 큰 소리에 화면·조명이 반응할 수 있습니다.", "밤새 밝은 화면을 켜 두지 않으면서 필요한 순간의 시각 반응을 둡니다.", "night-glow"],
      ["03", "LOCAL TIMELINE", "밤의 후보 소리를 아침에 훑어봅니다.", "코골이·잠꼬대·움직임으로 보이는 후보 소리를 기기 안에서 기록해 타임라인으로 보여 줍니다.", "밤새 앱을 지켜보지 않고 기록된 시점부터 확인합니다. 의료 진단 기능은 아닙니다.", "timeline-dots"],
      ["04", "MAKE IT YOURS", "시간을 보는 화면도 내 공간답게.", "밝기·시계 글꼴·레이아웃·테마를 조정합니다.", "같은 앱을 침실에는 차분하게, 책상에는 선명하게 맞춥니다.", "palette"],
      ["05", "SIX-SLOT MUSIC", "자주 듣는 소리를 여섯 칸에 둡니다.", "Apple Music·Classical 또는 Spotify·YouTube Music과 인터넷 라디오를 플랫폼에 맞춰 음악 스트립에 배치합니다.", "시계 화면을 떠나지 않고 자주 듣는 음악과 라디오로 들어갑니다.", "music-grid"],
      ["06", "YOU CONTROL BACKGROUND", "감지와 재생의 범위는 내가 정합니다.", "배경 동작은 기본으로 꺼져 있고, QR로 근처 보이소를 연결하면 움직임·소리 이벤트를 공유합니다.", "앱 밖에서도 이어갈지, 가까운 기기와 연결할지를 사용자가 선택합니다.", "toggle-control"],
    ],
    stories: [
      ["01", "침대 옆 가로 시계", "태블릿을 가로로 세워 플립 클록과 날씨, 배터리를 봅니다. 방이 어두워지면 화면은 낮은 밝기를 유지하고, 메이트 모드는 2분 뒤부터 반응을 준비합니다.", "침실 · 플립 클록 · 메이트 모드"],
      ["02", "아침에 밤의 흐름을 볼 때", "기기 안에 남은 코골이·잠꼬대·움직임 후보의 시점을 타임라인으로 훑습니다. 의료 판단이 아니라 밤의 흐름을 되짚는 참고 기록으로 봅니다.", "로컬 기록 · 후보 소리 · 타임라인"],
      ["03", "시계와 음악을 한자리에", "여섯 칸 음악 스트립에 자주 듣는 서비스와 라디오를 둡니다. 배경 동작은 꺼 둔 채 앱 안에서만 감지와 재생을 사용합니다.", "음악 스트립 · 라디오 · 사용자 제어"],
    ],
    ctaEyebrow: "SET THE NIGHT YOUR WAY",
    ctaTitle: <>밤을 더 밝히지 말고.<br /><span>필요한 만큼만 곁에.</span></>,
    ctaBody: "시계와 음악, 메이트 모드와 로컬 타임라인을 내 공간에 맞춰 S.tand로 세워 보세요.",
    ctaLabel: "S.tand 만나보기",
  },
  intosharp: {
    tone: "web",
    eyebrow: "OPEN THE WEB BY NAME",
    headline: <>주소는 잊고.<br /><span>이름만 입력하세요.</span></>,
    description: "검색과 자주 가는 사이트를 하나의 시작 화면에 모았습니다. 브라우저를 열고, 사이트 이름이나 검색어 한 줄로 바로 출발하세요.",
    image: "/apps/intosharp/intosharp-campaign.png",
    imageAlt: "하나의 검색줄에서 검색, 영상, 지도, 쇼핑과 자주 가는 사이트로 이어지는 인투샾 캠페인 이미지",
    imageLabel: "ONE LINE → SEARCH · VIDEO · MAP · SHOPPING",
    facts: [["01", "하나의 시작 화면"], ["05", "선택 가능한 검색 목적"], ["2X", "PC · 모바일 반응형"]],
    advantages: [
      ["01", "NAME, NOT URL", "사이트 주소 대신 이름으로 엽니다.", "등록된 사이트 이름을 검색줄에 입력하면 해당 페이지로 이동합니다.", "긴 주소를 외우거나 즐겨찾기 폴더를 헤매지 않고 기억나는 이름부터 입력합니다.", "name-tag"],
      ["02", "ONE-LINE SEARCH", "검색도 같은 한 줄에서 시작합니다.", "네이버·Google·YouTube·지도·쇼핑을 고르고 검색어를 입력합니다.", "찾으려는 종류에 맞춰 검색 목적지만 바꾸고 입력 흐름은 그대로 유지합니다.", "search-bar"],
      ["03", "PURPOSE GROUPS", "자주 가는 곳을 쓰임별로 펼쳐 봅니다.", "일·이야기마당·볼거리·연장처럼 목적에 따라 나눈 이음말을 한 화면에 모읍니다.", "링크 이름을 몰라도 지금 하려는 일의 카테고리부터 찾아갑니다.", "groups-grid"],
      ["04", "YOUR DEFAULTS", "내가 고른 검색과 화면을 기억합니다.", "선택한 검색 서비스와 밝고 어두운 테마를 같은 브라우저에 저장합니다.", "매번 같은 설정을 되풀이하지 않고 익숙한 시작 화면으로 돌아옵니다.", "defaults-star"],
      ["05", "START PAGE", "브라우저를 여는 순간 바로 만납니다.", "인투샾을 브라우저의 시작 페이지로 등록해 사용할 수 있습니다.", "새 탭에서 무엇을 할지 다시 고르는 대신 내 인터넷 입구에서 곧바로 시작합니다.", "homepage-flag"],
      ["06", "DESKTOP & MOBILE", "PC에서도, 휴대폰 첫 화면에서도.", "PC·모바일에 반응하는 공개 웹 서비스이며 홈 화면 바로가기로도 열 수 있습니다.", "기기에 맞는 화면으로 같은 이름 기반 시작 경험을 이어갑니다.", "devices-pair"],
    ],
    stories: [
      ["01", "출근해서 브라우저를 열 때", "시작 페이지로 지정한 인투샾이 먼저 열립니다. 자주 쓰는 사이트 이름을 입력해 바로 이동하고, 다음 업무도 같은 한 줄에서 검색합니다.", "시작 페이지 · 이름 이동 · 업무"],
      ["02", "찾는 목적이 계속 바뀔 때", "같은 검색줄에서 지도와 쇼핑, YouTube를 차례로 바꿔 검색합니다. 입력 방식은 그대로 두고 결과를 볼 서비스만 고릅니다.", "통합 검색 · 지도 · 쇼핑 · 영상"],
      ["03", "휴대폰에서 자주 가는 곳으로", "홈 화면 바로가기로 인투샾을 열고 목적별 이음말에서 자주 쓰는 사이트를 찾습니다. 선택한 테마와 검색 서비스는 같은 브라우저에서 이어집니다.", "모바일 · 이음말 · 개인화"],
    ],
    ctaEyebrow: "MAKE THE WEB YOURS",
    ctaTitle: <>인터넷의 첫 화면을.<br /><span>내가 기억하는 방식으로.</span></>,
    ctaBody: "설치 없이 바로 열고, 이름과 검색어만으로 나만의 웹 시작점을 만들어 보세요.",
    ctaLabel: "인투샾 바로 열기",
  },
  airchurch: {
    tone: "faith",
    eyebrow: "DISCOVER FAITH, SHARE GOOD WILL",
    headline: <>큰 곳보다.<br /><span>좋은 말씀과 선한 마음이 보이게.</span></>,
    description: "교단과 공식 채널을 대조한 설교와 찬양을 발견하고, 작은 교회와 지역의 꾸준한 사역을 만납니다. 내가 가진 달란트는 필요한 교회와 이웃을 향해 연결하세요.",
    image: "/apps/airchurch/airchurch-campaign.png",
    imageAlt: "여러 지역 교회의 말씀과 찬양, 나눔과 기도가 따뜻한 빛으로 이어지는 에어처치 캠페인 이미지",
    imageLabel: "SERMON · WORSHIP · COMMUNITY · GOOD SHARING",
    facts: [["NO", "목회자 순위"], ["CROSS", "여러 공식 출처 대조"], ["OPEN", "가입 없이 공개 콘텐츠 탐색"]],
    advantages: [
      ["01", "SERMON & WORSHIP", "오늘 필요한 말씀과 찬양을 발견합니다.", "교단 소속과 공식 채널을 확인한 교회의 최신 설교와 찬양을 한곳에서 찾습니다.", "흩어진 공식 채널을 하나씩 찾기 전에 교회와 지역을 기준으로 둘러봅니다.", "sermon-mic"],
      ["02", "DISCOVERY, NOT RANKING", "경쟁보다 발견을 앞에 둡니다.", "목회자의 서열을 만들지 않고 작은 교회와 지역의 꾸준한 사역이 보이도록 구성합니다.", "규모와 인기 순위 밖에 있던 가까운 교회의 말씀도 함께 살펴봅니다.", "discovery-map"],
      ["03", "GOOD SHARING", "가진 달란트를 필요한 곳으로 잇습니다.", "시간·경험·공간·기술·기도를 교회와 이웃의 필요에 연결하고 공개 전 내용을 검토합니다.", "돈만이 아니라 내가 이미 가진 것으로 참여할 가능성을 엽니다. 연결 성사를 보장하지는 않습니다.", "heart-share"],
      ["04", "SAFER COMMUNITY", "적은 개인정보로 이야기를 나눕니다.", "별칭을 사용하고 공동체 운영 원칙에 따라 첫 글을 검토합니다.", "공개 대화에 불필요한 연락처를 먼저 내놓지 않고 참여합니다.", "shield-community"],
      ["05", "CHECKED SOURCES", "확인하고, 틀리면 다시 살펴봅니다.", "교단·노회·공식 홈페이지·영상 채널을 교차 확인하고 신고·재검토·이의제기 절차를 둡니다.", "정보의 출처와 수정 경로를 함께 두되 검증의 완전성을 보장한다고 주장하지 않습니다.", "check-source"],
      ["06", "BROWSE FIRST", "가입 전에 먼저 둘러보세요.", "공개 설교와 찬양을 보는 데 회원 가입이나 개인 연락처를 요구하지 않습니다.", "개인정보를 입력하기 전에 포털의 콘텐츠와 운영 방향부터 확인합니다.", "eye-browse"],
    ],
    stories: [
      ["01", "새로운 동네에서 교회를 찾을 때", "지역과 교회 이름으로 말씀을 찾아 공식 채널을 확인합니다. 순위 없이 작은 교회와 지역 교회의 최신 설교와 찬양을 함께 살펴봅니다.", "지역 교회 · 말씀 · 공식 채널"],
      ["02", "내 달란트를 나누고 싶을 때", "할 수 있는 일과 가능한 지역을 착한나눔에 남깁니다. 공개 전 검토를 거친 뒤 실제 필요와 이어질 가능성을 기다립니다.", "시간 · 기술 · 공간 · 기도"],
      ["03", "가입 전에 먼저 보고 싶을 때", "연락처를 입력하지 않고 설교와 찬양을 둘러봅니다. 출처가 잘못된 것 같다면 신고와 재검토 절차를 확인합니다.", "공개 탐색 · 최소 개인정보 · 재검토"],
    ],
    ctaEyebrow: "FAITH MEETS GOOD WILL",
    ctaTitle: <>좋은 말씀을 발견하고.<br /><span>선한 마음을 이어 보세요.</span></>,
    ctaBody: "가입 없이 먼저 둘러보고, 우리 교회를 응원하고, 내가 가진 달란트로 가까운 필요에 참여하세요.",
    ctaLabel: "에어처치 바로 열기",
  },
} as const;

function ProductPromotion({ app }: { app: NonNullable<ReturnType<typeof findApp>> }) {
  const campaign = productCampaigns[app.slug as keyof typeof productCampaigns];
  if (!campaign) return null;

  return (
    <section className={`product-promo campaign-${campaign.tone}`} id="product-campaign">
      <div className="shell product-promo-hero">
        <div className="product-promo-copy reveal">
          <p className="eyebrow">{campaign.eyebrow}</p>
          <h2>{campaign.headline}</h2>
          <p>{campaign.description}</p>
          <div className="product-promo-actions">
            <Link className="button product-promo-primary" href="#download">{campaign.ctaLabel} <span aria-hidden="true">↓</span></Link>
            <Link className="button product-promo-secondary" href="#campaign-stories">내가 쓰는 장면 보기 <span aria-hidden="true">→</span></Link>
          </div>
        </div>
        <div className="product-promo-image reveal">
          <Image src={campaign.image} alt={campaign.imageAlt} width={1672} height={941} sizes="(max-width: 920px) 100vw, 58vw" unoptimized />
          <div className="product-promo-image-label"><span>CAMPAIGN FEATURE</span><strong>{campaign.imageLabel}</strong></div>
        </div>
        <div className="product-promo-facts reveal" aria-label={`${app.name} 핵심 지원 범위`}>
          {campaign.facts.map(([value, label]) => <p key={label}><strong>{value}</strong><span>{label}</span></p>)}
        </div>
      </div>

      <div className="shell product-advantages">
        <div className="product-section-intro reveal">
          <p className="eyebrow">FEATURES WITH A PURPOSE</p>
          <h2>기능을 나열하지 않고.<br /><span>달라지는 일을 보여드립니다.</span></h2>
          <p>{app.name}의 기능 하나하나가 실제 사용에서 어떤 이점으로 이어지는지 확인하세요.</p>
        </div>
        <div className="product-advantage-grid">
          {campaign.advantages.map(([number, kicker, title, body, benefit, visual]) => (
            <article className="product-advantage-card reveal" key={number}>
              <div><span>{number}</span><small>{kicker}</small></div>
              <AdvantageVisual variant={visual as AdvantageVariant} />
              <h3>{title}</h3><p>{body}</p><strong>{benefit}</strong>
            </article>
          ))}
        </div>
      </div>

      <div className="product-story-band" id="campaign-stories">
        <div className="shell">
          <div className="product-section-intro product-story-intro reveal">
            <p className="eyebrow">IN YOUR DAY</p>
            <h2>내가 쓰는 순간에는.<br /><span>이렇게 작동합니다.</span></h2>
            <p>실제 기능으로 가능한 대표 사용 장면이며, 사용자 후기를 인용한 내용은 아닙니다.</p>
          </div>
          <div className="product-story-grid">
            {campaign.stories.map(([number, title, quote, tag], index) => (
              <article className="product-story-card reveal" key={number}>
                <div><span>{number}</span><small>{tag}</small></div>
                <AdvantageVisual variant={pickContentVisual(`${title} ${tag}`, index)} />
                <h3>{title}</h3><blockquote>“{quote}”</blockquote>
              </article>
            ))}
          </div>
          <div className="product-promo-cta reveal">
            <p className="eyebrow">{campaign.ctaEyebrow}</p><h2>{campaign.ctaTitle}</h2><p>{campaign.ctaBody}</p>
            <div><Link className="button product-promo-primary" href="#download">{campaign.ctaLabel} <span aria-hidden="true">↓</span></Link><Link className="button product-promo-secondary" href="#guide">사용법 먼저 보기 <span aria-hidden="true">→</span></Link></div>
          </div>
        </div>
      </div>
    </section>
  );
}

function NasFinderPromotion() {
  const advantages = [
    {
      number: "01",
      kicker: "NAS · CLOUD · NETWORK",
      title: "저장공간이 많을수록, 나스파인더 하나면 됩니다.",
      body: "Synology NAS부터 SFTP·SMB·WebDAV·FTP 네트워크 장비, Dropbox·OneDrive·Google Drive 클라우드까지 한곳에서 연결하고 탐색합니다.",
      benefit: "장비와 서비스마다 다른 앱을 찾아다니지 않고, 내 모든 저장공간으로 바로 들어갑니다.",
      visual: "storage-network" as AdvantageVariant,
    },
    {
      number: "02",
      kicker: "VLC PLAYBACK",
      title: "영상은 내려받기 전에 재생하세요.",
      body: "강력한 VLC 기반 재생과 원격 스트리밍으로 NAS의 영상을 먼저 확인하고, 정말 보관할 파일만 내려받습니다.",
      benefit: "용량 큰 영상을 무작정 기다리지 않고, 지금 보고 싶은 콘텐츠부터 바로 확인합니다.",
      visual: "play-remote" as AdvantageVariant,
    },
    {
      number: "03",
      kicker: "PHONE HARD",
      title: "내 휴대폰을, 진짜 휴대용 하드처럼.",
      body: "같은 Wi‑Fi의 컴퓨터에서 웹 브라우저로 폰하드를 열고 iPhone·iPad 또는 Android 기기에 파일을 보냅니다.",
      benefit: "케이블과 전용 PC 프로그램을 찾지 않고, 손에 든 휴대폰에 필요한 파일을 바로 담습니다.",
      visual: "phone-drive" as AdvantageVariant,
    },
    {
      number: "04",
      kicker: "LIVE ⇄ MOTION",
      title: "움직이는 추억을 포기하지 마세요.",
      body: "iPhone Live Photo와 Android Motion Photo를 QR로 연결해 양방향 전송하고, 받는 기기에 맞춰 원본을 보존하거나 자동 변환합니다.",
      benefit: "가족과 친구의 휴대폰이 달라도 움직이는 순간을 사진 보관함으로 이어갑니다.",
      visual: "live-motion-swap" as AdvantageVariant,
    },
  ];

  const stories = [
    {
      number: "01",
      title: "가족의 휴대폰이 서로 달라도",
      scenario: "여행에서 한 사람은 Android로 Motion Photo를 찍고, 가족은 iPhone을 사용합니다. 나스파인더로 QR만 맞추면 서로의 움직이는 사진이 각자의 사진 보관함에 맞는 형태로 들어옵니다.",
      tag: "가족 · 여행 · 움직이는 사진",
    },
    {
      number: "02",
      title: "NAS 속 영상을 소파에서 찾을 때",
      scenario: "Mac용 Super Thumbnail로 큰 미디어 폴더의 미리보기를 준비해 둡니다. iPad에서 Synology를 열어 화면으로 영상을 찾고, VLC 기반 재생으로 먼저 확인한 뒤 필요한 파일만 내려받습니다.",
      tag: "Super Thumbnail · VLC · NAS",
    },
    {
      number: "03",
      title: "컴퓨터의 파일을 폰에서 써야 할 때",
      scenario: "같은 Wi‑Fi에서 컴퓨터 브라우저로 폰하드를 열어 자료를 보냅니다. 케이블이나 별도 전송 프로그램 없이, 받은 파일을 폰에서 바로 다음 작업에 사용합니다.",
      tag: "휴대용 하드 · 같은 Wi‑Fi · 업무 파일",
    },
    {
      number: "04",
      title: "다른 앱에서 NAS 파일이 필요할 때",
      scenario: "문서 앱에서 파일을 첨부하려고 Apple 파일 앱을 엽니다. Synology 위치로 바로 들어가 강화된 미리보기로 내용을 확인하고, 필요한 파일을 골라 작업을 이어갑니다.",
      tag: "파일 앱 · 강화된 미리보기 · 시스템 연동",
    },
  ];

  return (
    <section className="nas-promo" id="why-nasfinder">
      <div className="shell nas-promo-hero">
        <div className="nas-promo-copy reveal">
          <p className="eyebrow">NOT JUST A FILE BROWSER</p>
          <h2>내 파일도,<br />움직이는 추억도.<br /><span>기기 경계 없이.</span></h2>
          <p>
            저장소가 흩어져 있어도, 사용하는 기기가 달라도 괜찮습니다.
            나스파인더는 찾기·보기·정리·전송을 한 흐름으로 묶어
            파일이 있는 곳과 지금 손에 든 기기를 바로 연결합니다.
          </p>
          <div className="nas-promo-actions">
            <Link className="button nas-promo-primary" href="#download">플랫폼별 설치 보기 <span aria-hidden="true">↓</span></Link>
            <Link className="button nas-promo-secondary" href="#stories">내가 쓰는 장면 보기 <span aria-hidden="true">→</span></Link>
          </div>
        </div>
        <div className="nas-promo-image reveal">
          <Image
            src="/apps/nasfinder/live-motion-campaign.png"
            alt="Live Photo와 Motion Photo가 iPhone과 Android 사이에서 양방향으로 이동하는 모습을 표현한 나스파인더 캠페인 이미지"
            width={1672}
            height={941}
            sizes="(max-width: 920px) 100vw, 58vw"
            priority
            unoptimized
          />
          <div className="nas-promo-image-label"><span>FLAGSHIP FEATURE</span><strong>Live Photo ⇄ Motion Photo</strong></div>
        </div>
        <div className="nas-promo-facts reveal" aria-label="나스파인더 핵심 지원 범위">
          <p><strong>08</strong><span>지원 저장소·연결</span></p>
          <p><strong>04</strong><span>iPhone · iPad · Mac · Android</span></p>
          <p><strong>⇄</strong><span>움직이는 사진 양방향 변환</span></p>
        </div>
      </div>

      <div className="shell nas-advantages">
        <div className="nas-section-intro reveal">
          <p className="eyebrow">FEATURES THAT PAY OFF</p>
          <h2>기능은 많게.<br /><span>사용은 단순하게.</span></h2>
          <p>연결, 재생, 폰하드와 움직이는 사진. 가장 중요한 네 가지 이점을 먼저 보여드리고, 전체 기능은 아래 특징에서 이어서 소개합니다.</p>
        </div>
        <div className="nas-advantage-grid">
          {advantages.map((advantage) => (
            <article className="nas-advantage-card reveal" key={advantage.number}>
              <div><span>{advantage.number}</span><small>{advantage.kicker}</small></div>
              <AdvantageVisual variant={advantage.visual} />
              <h3>{advantage.title}</h3>
              <p>{advantage.body}</p>
              <strong>{advantage.benefit}</strong>
            </article>
          ))}
        </div>
      </div>

      <div className="nas-story-band" id="stories">
        <div className="shell">
          <div className="nas-section-intro nas-story-intro reveal">
            <p className="eyebrow">USE IT YOUR WAY</p>
            <h2>내 일상에서는,<br /><span>이렇게 달라집니다.</span></h2>
            <p>실제 기능으로 가능한 예시 사용 장면입니다. 사용자 후기를 인용한 내용이 아닙니다.</p>
          </div>
          <div className="nas-story-grid">
            {stories.map((story, index) => (
              <article className="nas-story-card reveal" key={story.number}>
                <div><span>{story.number}</span><small>{story.tag}</small></div>
                <AdvantageVisual variant={pickContentVisual(`${story.title} ${story.tag}`, index)} />
                <h3>{story.title}</h3>
                <p className="story-scenario">{story.scenario}</p>
              </article>
            ))}
          </div>
          <div className="nas-promo-cta reveal">
            <p className="eyebrow">YOUR STORAGE, WITHIN REACH</p>
            <h2>파일이 있는 곳에 연결하세요.<br /><span>받기 전에 먼저 여세요.</span></h2>
            <p>iPhone·iPad·Mac·Android에서 지금 쓰는 저장공간을 연결하고, 나스파인더의 차이를 직접 확인해 보세요.</p>
            <div>
              <Link className="button nas-promo-primary" href="#download">플랫폼별 설치 보기 <span aria-hidden="true">↓</span></Link>
              <Link className="button nas-promo-secondary" href="#guide">처음부터 사용해 보기 <span aria-hidden="true">→</span></Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function InfoPage({ app, section }: { app: NonNullable<ReturnType<typeof findApp>>; section: string }) {
  const isPrivacy = section === "privacy";
  const isTerms = section === "terms";
  const isDeletion = section === "data-deletion";
  const title = isPrivacy ? "개인정보처리방침" : isTerms ? "이용약관" : isDeletion ? "연결 해제 및 데이터 삭제" : "지원과 문의";

  return (
    <main className={`info-page theme-${app.theme}`}>
      <SiteHeader />
      <article className="legal-shell shell">
        <Link className="breadcrumb" href={`/apps/${app.slug}`}>← {app.name}으로 돌아가기</Link>
        <p className="eyebrow">{app.english.toUpperCase()}</p>
        <h1>{title}</h1>
        <p className="legal-intro">{isPrivacy ? `${app.name}가 어떤 정보를 왜 다루고, 어디에 보관하며, 사용자가 어떻게 삭제할 수 있는지 설명합니다.` : isTerms ? `${app.name}를 이용하기 전에 알아야 할 기본 조건과 책임 범위를 안내합니다.` : isDeletion ? "Google을 비롯한 외부 계정 연결을 해제하고 기기에 저장된 데이터를 삭제하는 방법입니다." : "불편한 점이나 제안이 있다면 아래 내용을 먼저 확인한 뒤 알려주세요."}</p>

        {isPrivacy && <>
          <section className="privacy-at-glance" aria-labelledby="privacy-summary-title">
            <p className="eyebrow">PRIVACY AT A GLANCE</p>
            <h2 id="privacy-summary-title">먼저, 핵심만 쉽게 알려드립니다.</h2>
            <div>
              <article><span>01</span><AdvantageVisual variant="check-source" /><h3>무엇을</h3><p>사용자가 기능을 위해 선택하거나 연결한 정보만 다룹니다.</p></article>
              <article><span>02</span><AdvantageVisual variant="compass" /><h3>왜</h3><p>제품에서 사용자가 요청한 기능을 제공하는 데 사용합니다.</p></article>
              <article><span>03</span><AdvantageVisual variant="storage-network" /><h3>어디에</h3><p>브라우저 또는 기기 저장공간을 우선 사용하며 외부 서비스는 필요한 기능에서 직접 연결합니다.</p></article>
              <article><span>04</span><AdvantageVisual variant="trash-clear" /><h3>어떻게 삭제</h3><p>제품의 관리 기능과 연결 해제, 브라우저 데이터 또는 앱 삭제로 정리할 수 있습니다.</p></article>
            </div>
          </section>
          <LegalSection title="핵심 원칙"><ul>{app.privacy.map((item) => <li key={item}>{item}</li>)}</ul></LegalSection>
          <LegalSection title="처리 목적과 항목"><p>앱은 기능 수행에 필요한 권한, 사용자가 직접 선택한 파일과 사용자가 연결한 서비스의 인증 정보만 해당 기능을 제공하기 위해 처리합니다. 광고 목적의 개인정보 판매나 맞춤형 추적을 목적으로 처리하지 않습니다.</p></LegalSection>
          <LegalSection title="홈페이지 이용 통계"><p>NasFinder.com은 홈페이지 방문 횟수와 공식 APK 바로 받기 버튼을 누른 횟수를 숫자로만 집계합니다. 방문은 같은 브라우저에서 하루 한 번만 세기 위해 마지막 집계 날짜를 브라우저에 저장합니다. 집계 데이터베이스에는 방문자의 이름, 이메일, 계정, 쿠키 또는 IP 주소를 함께 저장하지 않으며 광고나 개인별 행동 추적에 사용하지 않습니다.</p></LegalSection>
          <LegalSection title="TestFlight 테스터 사전 신청 정보"><p>홈페이지의 TestFlight 사전 신청 기능은 Apple TestFlight 내부 테스터 선발을 위해 신청자의 성(Last name), 이름(First name), 이메일, 희망 앱, 사용 기기 모델, 참여 동기 및 동의 시각을 수집합니다. Apple의 내부 테스트는 App Store Connect 사용자로 초대된 사람만 참여할 수 있으므로, 선정된 신청자는 성·이름·이메일로 App Store Connect 사용자 초대를 받으며 권한은 Marketing 역할과 신청한 앱 하나에 대한 접근으로 제한됩니다(보고서·인증서 등 추가 리소스 접근 없음). 내부 테스터 등록 작업을 돕기 위해 등록 대상자의 성·이름·이메일과 희망 앱만 OpenAI Codex에 전달할 수 있습니다. 기기 모델과 참여 동기는 Apple이나 Codex에 전달하지 않으며, 이름이 없는 보류 신청자의 개인정보도 Codex 요청문에 포함하지 않습니다. 남용 방지를 위해 접속 IP 주소를 해시로 바꿔 단시간 신청 횟수 제한에만 사용하며 원본 IP 주소는 저장하지 않습니다. 수집된 정보는 테스터 모집 및 테스트 진행 기간 동안 데이터베이스에 보관되며, 관리자 화면의 삭제 기능을 통해 언제든 직접 영구 파기할 수 있습니다. 테스트 인원은 소수로 제한되어 있어 신청이 선정을 보장하지 않으며, 삭제를 원하시는 경우 아래 개인정보 보호책임자에게 요청하시면 즉시 삭제 처리됩니다.</p></LegalSection>
          <LegalSection title="보유 기간"><p>연결 정보와 인증 정보는 사용자가 연결을 해제하거나 앱을 삭제할 때까지, 앱 안의 프로젝트·받은 파일·녹음은 사용자가 삭제하거나 앱을 삭제할 때까지 기기에 보관됩니다. 다운로드와 미리보기 캐시는 앱의 정리 기능, 시스템의 저장공간 관리 또는 앱 삭제로 제거됩니다. 사진 앱·갤러리·파일 앱으로 내보낸 결과물은 해당 위치에서 별도로 삭제해야 합니다.</p></LegalSection>
          <LegalSection title="파기 방법"><p>앱에서 삭제한 로컬 데이터는 앱의 저장공간에서 제거합니다. Keychain에 보관된 인증 정보는 연결 해제 또는 앱이 제공하는 계정 삭제 절차로 삭제합니다. 외부 서비스에 남은 접근 권한은 해당 서비스의 계정 보안 페이지에서도 철회할 수 있습니다.</p></LegalSection>
          <LegalSection title="외부 서비스와 제공"><p>앱은 사용자가 선택한 기능을 수행할 때 외부 저장소, 날씨, 라디오, 웹사이트 또는 배포 서비스와 통신할 수 있습니다. 사용자가 파일 전송이나 공유를 직접 요청한 경우에만 선택한 대상에 해당 정보가 전달되며, 연결한 서비스에는 각 제공자의 개인정보처리방침과 보관 기준이 적용됩니다.</p></LegalSection>
          <LegalSection title="사용자의 권리"><p>사용자는 운영체제 설정에서 앱 권한을 철회하고, 앱에서 연결·프로젝트·파일·캐시를 삭제하거나 외부 계정을 연결 해제할 수 있습니다. 개인정보 열람·정정·삭제·처리정지에 관한 문의는 아래 개인정보 보호책임자에게 요청할 수 있습니다.</p></LegalSection>
          {app.slug === "nasfinder" && <>
            <LegalSection title="Google 서비스"><p>Google 계정 연결 기능은 사용자가 요청한 파일 작업에 필요한 정보만 처리합니다. Google Photos 가져오기는 iPhone·iPad와 Android에 소스 구현된 상태이며 실제 Google 계정 검증이 아직 완료되지 않았으므로 현재 공개판 제공을 뜻하지 않습니다. 구현된 흐름은 Google Drive와 분리된 별도 OAuth 연결을 사용하며, 민감 범위인 https://www.googleapis.com/auth/photospicker.mediaitems.readonly 하나만 요청합니다. 전체 보관함을 탐색하거나 복제하지 않고, Google Photos Picker에서 사용자가 직접 선택한 사진·영상만 해당 기기의 폰하드로 내려받습니다. 내려받은 항목은 미리보기·공유·삭제할 수 있으며, 사용자가 NAS 또는 연결된 저장소를 직접 선택했을 때만 그 대상으로 전송합니다. Google Photos 데이터는 광고, 추적, 얼굴 인식, 데이터 판매 또는 AI 학습에 사용하지 않습니다. Google Photos OAuth 토큰은 Google Drive와 분리해 Apple 기기의 Keychain과 Android Keystore로 보호한 앱 전용 저장공간에 각각 보관하도록 구현했으며, 설정에서 Google Photos 연결을 해제할 수 있습니다. 기기 안의 받은 파일과 캐시는 앱에서 삭제할 수 있고, 외부로 내보낸 파일은 해당 대상에서 별도로 삭제해야 합니다.</p></LegalSection>
            <LegalSection title="Google 사진 데이터의 공유와 제공 (Data sharing and disclosure)"><p>Google Photos에서 받은 사용자 데이터가 전달되는 대상은 다음 두 경우뿐입니다. 첫째, 사용자가 요청한 기능을 수행하기 위해 앱이 Google API와 통신할 때 Google에 전달됩니다. 둘째, 사용자가 공유 동작을 시작하거나 NAS 또는 연결된 저장소를 전송 대상으로 직접 선택했을 때 그 선택한 대상에만 전달됩니다. Google Photos 데이터는 판매하지 않으며, 위와 무관한 제3자에게 제공·이전·공개하지 않습니다. 선택한 사진·영상은 Google에서 사용자의 기기로 직접 내려받으며, 운영자는 이를 운영자가 관리하는 서버로 수신하거나 보관하지 않습니다.</p></LegalSection>
            <LegalSection title="보안과 데이터 보호 (Security and data protection)"><p>Google API와의 모든 통신은 HTTPS/TLS로 암호화하여 전송합니다. Google Photos OAuth 자격 증명은 Google Drive 자격 증명과 분리해 Apple 기기의 Keychain과 Android Keystore로 보호한 앱 전용 저장공간에 각각 보관하도록 구현했습니다. 기기에 내려받은 사진·영상과 캐시는 앱의 저장공간에 두며, 기기 잠금 등 운영체제와 앱의 접근 제어로 보호됩니다.</p></LegalSection>
            <section className="limited-use" lang="en" aria-labelledby="google-limited-use-title">
              <p className="eyebrow">ENGLISH SUMMARY FOR GOOGLE API USERS</p>
              <h2 id="google-limited-use-title">Google API Data Use &amp; Limited Use</h2>
              <p>NasFinder uses information received from Google APIs only to provide user-requested file access and transfer features. Its use and transfer of information received from Google APIs adheres to the Google API Services User Data Policy, including the Limited Use requirements.</p>
              <p>The source-implemented Google Photos integration on iPhone, iPad, and Android uses Google Photos Picker so that users explicitly select the media they want to import, and requests only the https://www.googleapis.com/auth/photospicker.mediaitems.readonly scope. Live Google account verification is pending, so this disclosure does not claim availability in the current public release. NasFinder does not browse or recreate a user&apos;s complete Google Photos library.</p>
              <Link href="/apps/nasfinder/google-oauth">Read the concise English disclosure <span aria-hidden="true">→</span></Link>
            </section>
          </>}
          <LegalSection title="개인정보 보호책임자"><p><strong>한병기</strong><br />NasFinder.com 및 앱 운영자</p><p>개인정보 관련 문의와 권리 행사는 아래 직접 문의 경로로 접수할 수 있습니다. 개인 이메일 주소는 자동 수집을 줄이기 위해 사용자가 요청할 때만 화면에 표시합니다.</p><div className="privacy-contact"><ContactReveal /></div></LegalSection>
          <LegalSection title="권익침해 구제"><p>개인정보 침해에 관한 별도 상담이 필요하면 개인정보침해신고센터(국번 없이 118), 개인정보분쟁조정위원회(1833-6972) 등 관계 기관에 문의할 수 있습니다.</p></LegalSection>
          <LegalSection title="방침의 변경"><p>처리 항목이나 외부 서비스가 달라지면 시행 전에 변경 내용을 이 페이지에 알리고, 시행일과 마지막 변경일을 함께 표시합니다. 앱마다 처리하는 정보가 다르므로 각 앱의 개별 방침을 적용합니다.</p></LegalSection>
        </>}

        {isTerms && <>
          <LegalSection title="서비스의 성격"><p>{app.name}는 현재 개발과 검증이 함께 진행되는 소프트웨어입니다. 기능과 지원 범위는 플랫폼과 버전에 따라 다를 수 있으며 현재 페이지의 상태 표시를 기준으로 안내합니다.</p></LegalSection>
          <LegalSection title="사용자의 책임"><p>사용자는 자신이 접근 권한을 가진 파일과 서비스만 이용해야 하며, 외부 음원·사진·영상·서버 자료의 권리와 백업을 직접 확인해야 합니다.</p></LegalSection>
          <LegalSection title="보증과 책임 범위"><p>데이터 손실 가능성이 있는 파일 작업이나 테스트 기능을 사용하기 전에 중요한 자료를 별도로 백업해야 합니다. 앱은 의료·안전 진단이나 무중단 저장 서비스를 보증하지 않습니다.</p></LegalSection>
        </>}

        {isDeletion && <>
          <LegalSection title="외부 계정 연결 해제"><ol><li>{app.name}의 설정 또는 연결 목록을 엽니다.</li><li>연결된 계정이나 저장소를 선택합니다.</li><li>연결 삭제 또는 로그아웃을 선택합니다.</li><li>필요하면 해당 서비스의 계정 보안 페이지에서도 앱 접근 권한을 취소합니다.</li></ol></LegalSection>
          <LegalSection title="기기 데이터 삭제"><p>받은 파일, 다운로드, 썸네일과 기타 캐시는 앱 안의 관리 메뉴에서 삭제합니다. 모든 로컬 데이터를 제거하려면 내보낸 결과물을 먼저 확인한 뒤 앱을 삭제할 수 있습니다.</p></LegalSection>
          <LegalSection title="도움이 필요한 경우"><p>아래 GitHub 공개 문의 경로를 이용하되 계정 정보, 서버 주소, 파일명과 화면 속 개인정보는 가려 주세요.</p></LegalSection>
        </>}

        {!isPrivacy && !isTerms && !isDeletion && <>
          <LegalSection title="먼저 확인할 내용"><ul><li>앱과 운영체제를 최신 버전으로 업데이트합니다.</li><li>필요한 권한과 네트워크 연결 상태를 확인합니다.</li><li>앱을 완전히 종료한 뒤 다시 실행합니다.</li><li>같은 문제가 반복되면 재현 단계를 기록합니다.</li></ul></LegalSection>
          <LegalSection title="오류를 알려주실 때"><p>앱 버전, 기기와 운영체제, 사용한 기능, 재현 단계와 예상한 결과를 적어 주세요. 화면이나 로그에 계정·서버·파일 등 개인 정보가 있다면 반드시 가려 주세요.</p></LegalSection>
          <div className="support-options">
            {app.github.map((url) => <Link className="button button-primary" href={`${url}/issues`} key={url}>GitHub에 제보하기 <span aria-hidden="true">↗</span></Link>)}
            <ContactReveal />
          </div>
        </>}
        <p className="policy-note">시행일: 2026년 8월 14일 · 마지막 변경일: {app.slug === "nasfinder" ? "2026년 8월 22일" : "2026년 8월 15일"}</p>
      </article>
      <SiteFooter />
    </main>
  );
}

function LegalSection({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="legal-section"><h2><AdvantageVisual variant={pickContentVisual(title, 0)} /><span>{title}</span></h2><div>{children}</div></section>;
}

function GoogleOAuthPage() {
  return (
    <main className="info-page theme-violet" lang="en">
      <SiteHeader />
      <article className="legal-shell shell oauth-disclosure">
        <Link className="breadcrumb" href="/apps/nasfinder">← Back to NasFinder</Link>
        <p className="eyebrow">GOOGLE API DISCLOSURE</p>
        <h1>Google API Use &amp; Data Handling</h1>
        <p className="legal-intro">This concise English page supports Google OAuth review. NasFinder.com remains a Korean-first website; the full privacy notice is available in Korean.</p>

        <LegalSection title="Product purpose"><p>NasFinder is a native file browser for iPhone and iPad. It helps users browse their own storage services, preview media, and move or share files they choose.</p></LegalSection>
        <LegalSection title="Google Drive"><p>NasFinder includes a Google Drive connection for user-requested file browsing and file operations. Google Drive uses its own OAuth connection and credentials, separate from Google Photos.</p></LegalSection>
        <LegalSection title="Google Photos Picker"><p>The source-implemented Google Photos integration on iPhone, iPad, and Android uses a dedicated Google Photos OAuth connection and requests only the sensitive scope https://www.googleapis.com/auth/photospicker.mediaitems.readonly. Live Google account verification is pending, and this page does not claim that the integration is included in the current public release. The user opens Google Photos Picker and explicitly selects photos or videos; NasFinder downloads only those selected items into PhoneHard / Received Files on that device. Downloaded items can be previewed, shared, or deleted, and are transferred to a NAS or connected storage destination only when the user explicitly chooses one. NasFinder does not browse or recreate the user&apos;s complete Google Photos library and does not use this data for advertising, tracking, face recognition, data sales, or AI training.</p></LegalSection>
        <LegalSection title="Data sharing and disclosure"><p>Google Photos user data is shared, transferred, or disclosed only to: (1) Google, when NasFinder calls Google APIs to complete the user&apos;s request, and (2) the destination the user explicitly chooses — a share action target or a NAS or connected storage destination the user selects for transfer. Google Photos user data is not sold and is not disclosed to any unrelated third party. Selected media is downloaded from Google directly to the user&apos;s device; the operator does not receive or retain selected Google Photos media on any operator-controlled server.</p></LegalSection>
        <LegalSection title="Security and data protection"><p>All Google API traffic is encrypted in transit using HTTPS/TLS. Google Photos OAuth credentials are kept separately from Google Drive credentials: Apple devices use Keychain with device-only access, while Android uses app-private encrypted storage protected by Android Keystore. Selected media and related local cache are stored in the app&apos;s private storage on the user&apos;s device and protected by that platform&apos;s device and app access controls.</p></LegalSection>
        <LegalSection title="Limited Use"><p>NasFinder&apos;s use and transfer of information received from Google APIs adheres to the <Link className="inline-link" href="https://developers.google.com/terms/api-services-user-data-policy">Google API Services User Data Policy</Link>, including the Limited Use requirements.</p></LegalSection>
        <LegalSection title="Control and deletion"><p>Users can disconnect Google Photos in NasFinder Settings, separately from Google Drive, and revoke NasFinder&apos;s access from their Google Account. Locally downloaded files and caches can be deleted in the app; exported files must be deleted from their destination separately.</p><p><Link className="inline-link" href="/apps/nasfinder/data-deletion">Open connection removal and data deletion instructions</Link></p></LegalSection>

        <div className="oauth-links">
          <Link className="button button-primary" href="/apps/nasfinder/privacy">Korean privacy notice</Link>
          <Link className="button button-quiet" href="/apps/nasfinder/support">Support</Link>
        </div>
        <p className="policy-note">Source implementation disclosure · Live Google account verification pending · Last reviewed August 25, 2026</p>
      </article>
      <SiteFooter />
    </main>
  );
}
