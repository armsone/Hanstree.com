import Image from "next/image";
import type { AppData, Platform } from "../data";
import { LiveFlipClock, LiveSeoulWeather } from "./LiveFlipClock";

export function AppIcon({ app, priority = false }: { app: AppData; priority?: boolean }) {
  if (app.icon) {
    return <Image className="app-icon" src={app.icon} alt="" width={128} height={128} priority={priority} sizes="(max-width: 640px) 58px, 72px" unoptimized />;
  }

  return <span className={`app-icon app-icon-letter theme-${app.theme}`} aria-hidden="true">C</span>;
}

export function AppStatus({ platform }: { platform: Platform }) {
  const content = <><span className={`status-dot status-${platform.status.replace(" ", "-")}`} />{platform.name}<small>{platform.detail}</small>{platform.status === "TestFlight" && <b className="chip-status">TestFlight</b>}</>;
  return platform.url ? <a className="platform-chip" href={platform.url}>{content}<span aria-hidden="true">↗</span></a> : <span className="platform-chip">{content}</span>;
}

function heroScreenDimensions(layout: NonNullable<AppData["screenshots"]>[number]["layout"]) {
  if (layout === "menu") return { width: 700, height: 968 };
  if (layout === "landscape") return { width: 2622, height: 1206 };
  if (layout === "tv") return { width: 1920, height: 1080 };
  if (layout === "wide") return { width: 860, height: 60 };
  return { width: 1206, height: 2622 };
}

export function AppHeroArtwork({ app }: { app: AppData }) {
  const screen = app.screenshots?.[0];

  if (app.slug === "nasfinder" && screen) {
    return (
      <div className="hero-artwork hero-artwork-nasfinder" aria-label="NAS와 클라우드, 기기의 파일을 한곳에서 탐색하는 나스파인더">
        <Image className="hero-artwork-backdrop" src="/apps/nasfinder/nasfinder-storage-hero-v2.png" alt="" width={1536} height={1024} priority sizes="(max-width: 920px) 100vw, 52vw" unoptimized />
        <div className="hero-device hero-device-phone">
          <Image src={screen.src} alt={screen.alt} width={1206} height={2622} priority sizes="(max-width: 640px) 42vw, 230px" unoptimized />
        </div>
        <div className="hero-artwork-proof"><span />NAS · CLOUD · PHONE</div>
        <div className="hero-artwork-caption"><strong>모든 저장공간을 한곳에서</strong><span>탐색 · 미리보기 · 전송</span></div>
      </div>
    );
  }

  if (screen) {
    const layout = screen.layout ?? "phone";
    const dimensions = heroScreenDimensions(layout);
    return (
      <div className={`hero-artwork hero-artwork-screen hero-artwork-${layout}`} aria-label={`${app.name} 실제 앱 화면`}>
        <div className="hero-artwork-brand"><AppIcon app={app} /><span><small>실제 제품 화면</small><strong>{app.english}</strong></span></div>
        <div className={`hero-device hero-device-${layout}`}>
          <Image src={screen.src} alt={screen.alt} width={dimensions.width} height={dimensions.height} priority sizes="(max-width: 920px) 76vw, 430px" unoptimized />
        </div>
        <div className="hero-artwork-caption"><strong>{app.features[0]?.title ?? app.tagline}</strong><span>{app.platforms.map((platform) => platform.name).join(" · ")}</span></div>
      </div>
    );
  }

  return (
    <div className="hero-artwork hero-artwork-concept" aria-label={`${app.name} 핵심 기능 장면`}>
      <div className="hero-artwork-brand"><AppIcon app={app} /><span><small>핵심 기능</small><strong>{app.english}</strong></span></div>
      <AppArtwork app={app} />
      <div className="hero-artwork-caption"><strong>{app.features[0]?.title ?? app.tagline}</strong><span>{app.platforms.map((platform) => platform.name).join(" · ")}</span></div>
    </div>
  );
}

export function AppArtwork({ app }: { app: AppData }) {
  if (app.artwork === "phones") {
    return (
      <div className="artwork artwork-phones" aria-label={`${app.name} 앱 화면`}>
        {app.screenshots?.slice(0, 3).map((screen, index) => (
          <div className={`phone-shot phone-shot-${index + 1}`} key={screen.src}>
            <Image src={screen.src} alt={screen.alt} width={1206} height={2622} sizes="(max-width: 640px) 39vw, 220px" unoptimized />
          </div>
        ))}
      </div>
    );
  }

  if (app.artwork === "clock") {
    return (
      <div className="artwork artwork-clock" aria-label="S.tand 플립시계 화면 표현">
        <LiveSeoulWeather />
        <LiveFlipClock />
        <div className="clock-mode"><span /> MATE MODE</div>
      </div>
    );
  }

  if (app.artwork === "menubar") {
    return (
      <div className="artwork artwork-menubar" aria-label="CCMB의 Codex, Claude, Gemini 사용량 패널">
        <div className="ccmb-menubar-preview" aria-label="메뉴 막대에 대표 색상으로 표시된 세 서비스의 남은 사용량">
          <span className="ccmb-number-codex">50%</span><i>·</i><span className="ccmb-number-claude">63%</span><i>·</i><span className="ccmb-number-gemini">100%</span>
        </div>
        <div className="ccmb-panel-shot">
          <Image
            src="/apps/ccmb/ccmb-campaign.png"
            alt="메뉴 막대의 색상 숫자와 Codex·Claude·Gemini 원형 사용량 링"
            width={1672}
            height={941}
            sizes="(max-width: 640px) 92vw, 720px"
            unoptimized
          />
        </div>
      </div>
    );
  }

  if (app.artwork === "cleanup") {
    return (
      <div className="artwork artwork-cleanup" aria-label="BTN 메모리 압박 진단 화면">
        <div className="cleanup-glow" />
        <div className="cleanup-window">
          <Image src="/apps/btn/screens/overview.png" alt="" width={1520} height={1000} sizes="(max-width: 640px) 84vw, 520px" unoptimized />
        </div>
        <div className="cleanup-proof"><span />선택 전에는 아무것도 지우지 않음</div>
      </div>
    );
  }

  if (app.artwork === "thumbnail") {
    return (
      <div className="artwork artwork-thumbnail" aria-label="Super Thumbnail for Mac 생성 화면 표현">
        <div className="thumbnail-window">
          <div className="thumbnail-titlebar"><span aria-hidden="true">● ● ●</span><strong>Super Thumbnail</strong></div>
          <div className="thumbnail-folder"><span>NAS</span><div><strong>Photos</strong><small>16,540개 미디어 · 1.57 TB</small></div></div>
          <div className="thumbnail-progress">
            <div><strong>수퍼썸네일 생성</strong><small>12,408 / 16,540</small></div>
            <span><i /></span>
          </div>
          <div className="thumbnail-metrics"><span><small>남은 시간</small><strong>약 42분</strong></span><span><small>생성 용량</small><strong>8.6 GB</strong></span></div>
        </div>
      </div>
    );
  }

  if (app.artwork === "trackpad") {
    return (
      <div className="artwork artwork-trackpad" aria-label="TrackpadGuard 트랙패드 해제 영역 표현">
        <div className="guard-status"><span /> INPUT LOCKED</div>
        <div className="guard-trackpad">
          <div className="guard-cutout"><span>상단 1/3 제외</span></div>
          <div className="guard-active-zone"><strong>TOUCH TO UNLOCK</strong></div>
        </div>
        <p>⌃⌥⌘ Esc · 긴급 해제</p>
      </div>
    );
  }

  if (app.artwork === "htoms") {
    return (
      <div className="artwork artwork-htoms" aria-label="HtOMS 브리프의 매출 요약과 서버 상태 화면">
        <div className="htoms-window">
          <div className="htoms-toolbar"><strong>HTOMS BRIEF</strong><span>↻&nbsp; 로그아웃</span></div>
          <div className="htoms-heading"><i /><strong>매출 요약</strong><small>BRIEF · 오늘과 월간 판매</small></div>
          <div className="htoms-card htoms-sales">
            <div><small>오늘 매출 · TODAY</small><span>보통</span></div>
            <strong>1,067<small>만원</small></strong><b>20일</b>
          </div>
          <div className="htoms-card htoms-refresh"><small>다음 갱신 · REFRESH</small><strong>09:59</strong></div>
          <div className="htoms-card htoms-server"><small>서버 상태 · SERVER</small><strong>장항&nbsp;&nbsp; 인천&nbsp;&nbsp; 삼송&nbsp;&nbsp; 초월</strong></div>
          <div className="htoms-card htoms-channel"><small>판매 채널</small><span><i /><i /><i /></span><p>스토어 20% · 방판 1% · 전화 79%</p></div>
        </div>
      </div>
    );
  }

  if (app.artwork === "search") {
    return (
      <div className="artwork artwork-search" aria-label="인투샾 이름 검색 화면 표현">
        <div className="search-brand"><b>#</b><span>intoSharp</span></div>
        <div className="search-command"><span>⌕</span><strong>네이버 우리집</strong><b>↵</b></div>
        <p>이름으로 이동하고, 이어서 검색하세요.</p>
        <div className="search-links"><span>일</span><span>이야기마당</span><span>볼거리</span><span>연장</span></div>
      </div>
    );
  }

  if (app.artwork === "church") {
    return (
      <div className="artwork artwork-church" aria-label="에어처치 말씀과 착한나눔 화면 표현">
        <div className="church-brand"><span />airchurch</div>
        <p>오늘의 말씀을 가장 가까이</p>
        <h3>좋은 말씀과<br />선한 마음이 만나는 곳</h3>
        <div className="church-cards"><span><small>오늘의 말씀</small><strong>교회와 지역으로 찾기</strong></span><span><small>goodshare</small><strong>달란트로 마음 잇기</strong></span></div>
      </div>
    );
  }

  if (app.artwork === "server") {
    return (
      <div className="artwork artwork-server" aria-label="Synology NAS에서 안전하게 운영하는 Minecraft Bedrock 홈 서버">
        <div className="server-art-icon">
          <Image src="/apps/minecraft-server/icon.png" alt="" width={1254} height={1254} sizes="(max-width: 640px) 72vw, 430px" unoptimized />
        </div>
        <div className="server-art-proof"><span />실제 가족 서버 운영 중</div>
        <div className="server-art-facts"><span>PRIVATE</span><span>UDP 19132</span><span>WORLD SAFE</span></div>
      </div>
    );
  }

  return (
    <div className="artwork artwork-files" aria-label="나스파인더 파일 탐색 화면 표현">
      <div className="file-toolbar"><span>‹</span><strong>Photos</strong><span>•••</span></div>
      <div className="file-grid">
        {["DS", "SF", "SM", "WD", "DB", "GD"].map((label, index) => <span key={label} style={{ "--i": index } as React.CSSProperties}>{label}</span>)}
      </div>
      <div className="file-sheet"><span /> <p><strong>IMG_2048.HEIC</strong><small>Preview ready · 12.4 MB</small></p><b>↗</b></div>
    </div>
  );
}
