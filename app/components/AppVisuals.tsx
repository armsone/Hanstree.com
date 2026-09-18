import Image from "./SiteImage";
import type { AppData, Platform } from "../data";
import { appCardIcon } from "../media";

// "/screens/" 아래 파일만 실제 캡처입니다. 그 밖의 hero·campaign 이미지는 기능을 표현한 렌더링 개념 이미지이므로 alt에서 "화면"이라고 부르지 않습니다.
function isScreenshotPath(src: string) {
  return src.includes("/screens/");
}

function heroImageAlt(app: AppData, src: string) {
  return isScreenshotPath(src) ? `${app.name} 실제 앱 화면` : `${app.name}의 핵심 기능을 표현한 대표 이미지`;
}

export function AppIcon({ app, priority = false }: { app: AppData; priority?: boolean }) {
  if (app.icon) {
    return <Image className="app-icon" src={appCardIcon(app)} alt={`${app.name} 앱 아이콘`} width={256} height={256} priority={priority} sizes="(max-width: 640px) 58px, 72px" unoptimized />;
  }

  return <span className={`app-icon app-icon-letter theme-${app.theme}`} aria-hidden="true">{app.english.charAt(0).toUpperCase()}</span>;
}

export function AppStatus({ platform }: { platform: Platform }) {
  const content = <><span className={`status-dot status-${platform.status.replace(" ", "-")}`} />{platform.name}<small>{platform.detail}</small>{platform.status === "TestFlight" && <b className="chip-status">TestFlight</b>}</>;
  return platform.url ? <a className="platform-chip" href={platform.url}>{content}<span aria-hidden="true">↗</span></a> : <span className="platform-chip">{content}</span>;
}

function DirectionsFlow() {
  return (
    <div className="directions-flow" aria-label="Alfred 입력에서 네이버 지도 자동차 길찾기까지의 사용 예시">
      <p className="directions-flow-label">ALFRED NAVERMAP · 사용 예시</p>
      <strong className="directions-flow-title">출발지와 도착지,<br />한 줄이면.</strong>
      <div className="directions-command">
        <span>Alfred에 입력</span>
        <code>길찾기 고양시 덕양구, 부안여고</code>
      </div>
      <span className="directions-flow-arrow" aria-hidden="true">↓</span>
      <div className="directions-result">
        <span className="directions-mode">자동차 길찾기</span>
        <strong>네이버 지도에서 경로 확인</strong>
        <p>고양시 덕양구 → 부안여자고등학교</p>
      </div>
      <p className="directions-flow-note">macOS · Alfred Powerpack 필요</p>
    </div>
  );
}

// 완성된 렌더링 개념 이미지를 artwork-bridge 구성(전체 채움)으로 보여줍니다. 실제 화면이 아니므로 alt에 "화면"을 쓰지 않습니다.
function ConceptScene({ src, alt, label }: { src: string; alt: string; label: string }) {
  return (
    <div className="artwork artwork-bridge" aria-label={label}>
      <Image src={src} alt={alt} width={1536} height={1024} sizes="(max-width: 640px) 92vw, 720px" unoptimized />
    </div>
  );
}

export function AppHeroArtwork({ app }: { app: AppData }) {
  const heroSrc = app.heroImage ?? `/apps/${app.slug}/${app.slug}-hero-v2.png`;
  return (
    <div className={`hero-artwork hero-artwork-product hero-artwork-${app.slug}`} aria-label={isScreenshotPath(heroSrc) ? `${app.name} 실제 앱 화면` : `${app.name} 핵심 기능을 표현한 대표 이미지`}>
      <Image className="hero-artwork-backdrop" src={heroSrc} alt={heroImageAlt(app, heroSrc)} width={1536} height={1024} priority sizes="(max-width: 920px) 100vw, 52vw" unoptimized />
      <div className="hero-artwork-brand"><AppIcon app={app} /><span><small>PRODUCT SCENE</small><strong>{app.english}</strong></span></div>
      <div className="hero-artwork-proof"><span />{app.slug === "nasfinder" ? "NAS · CLOUD · DEVICE" : "CORE EXPERIENCE"}</div>
      <div className="hero-artwork-caption"><strong>{app.features[0]?.title ?? app.tagline}</strong><span>{app.platforms.map((platform) => platform.name).join(" · ")}</span></div>
    </div>
  );
}

export function AppArtwork({ app, mode = "spotlight" }: { app: AppData; mode?: "spotlight" | "system" }) {
  if (app.slug === "aiplaygrand") return <div className="artwork"><Image src="/apps/aiplaygrand/flow.svg" alt="AIplaygrand 팀 실습 사용 흐름도" width={1280} height={853} sizes="(max-width: 640px) 92vw, 720px" unoptimized /></div>;
  if (app.artwork === "directions") return <DirectionsFlow />;
  const image = (mode === "system" ? app.systemImage : app.spotlightImage) ?? app.heroImage ?? `/apps/${app.slug}/${app.slug}-hero-v2.png`;
  const alt = app.slug === "hanai"
    ? mode === "system" ? "한양의 외부 연결과 개인정보 보호 구조를 표현한 개념 이미지" : "한양 지식 아카이브를 표현한 개념 이미지"
    : heroImageAlt(app, image);
  return <ConceptScene src={image} alt={alt} label={alt} />;
}
