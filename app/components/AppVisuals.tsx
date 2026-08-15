import type { AppData, Platform } from "../data";
import { LiveFlipClock, LiveSeoulWeather } from "./LiveFlipClock";

export function AppIcon({ app, priority = false }: { app: AppData; priority?: boolean }) {
  if (app.icon) {
    return <img className="app-icon" src={app.icon} alt="" width="128" height="128" fetchPriority={priority ? "high" : "auto"} />;
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
            <img src={screen.src} alt={screen.alt} loading="lazy" />
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
