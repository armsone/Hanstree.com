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
  const content = <><span className={`status-dot status-${platform.status.replace(" ", "-")}`} />{platform.name}<small>{platform.detail}</small></>;
  return platform.url ? <a className="platform-chip" href={platform.url}>{content}<span aria-hidden="true">↗</span></a> : <span className="platform-chip">{content}</span>;
}

export function AppArtwork({ app }: { app: AppData }) {
  if (app.artwork === "phones") {
    return (
      <div className="artwork artwork-phones" aria-label="한클립 앱 화면">
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
      <div className="artwork artwork-menubar" aria-label="CCMB 메뉴 막대 화면 표현">
        <div className="mac-bar"><span>● ● ●</span><strong>CCMB</strong><span>81% · ₩12.4</span></div>
        <div className="menu-card">
          <p>WEEKLY REMAINING</p><strong>81<small>%</small></strong>
          <div className="meter"><span /></div>
          <dl><div><dt>Credits</dt><dd>12.4</dd></div><div><dt>Refresh</dt><dd>Just now</dd></div></dl>
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
