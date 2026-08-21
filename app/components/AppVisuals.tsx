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
      <div className="artwork artwork-menubar" aria-label="CCMB의 실제 네 서비스 사용량 패널">
        <div className="ccmb-panel-shot">
          <Image
            src="/apps/ccmb/screens/ccmb-usage-menu.png"
            alt="Codex·Claude·Gemini·Grok 사용량 링과 갱신 정보를 4열로 표시한 CCMB 패널"
            width={1636}
            height={1206}
            sizes="(max-width: 640px) 92vw, 720px"
            unoptimized
          />
        </div>
      </div>
    );
  }

  if (app.artwork === "cleanup") {
    return (
      <div className="artwork artwork-cleanup" aria-label="BackToNormal 정리 후보 진단 화면">
        <div className="cleanup-glow" />
        <div className="cleanup-window">
          <Image src="/apps/backtonormal/screens/candidates.png" alt="" width={1576} height={1776} sizes="(max-width: 640px) 84vw, 520px" unoptimized />
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
