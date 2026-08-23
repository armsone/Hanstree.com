import Link from "next/link";
import { AppArtwork, AppIcon, AppStatus } from "./components/AppVisuals";
import { AndroidReleaseTracker } from "./components/AndroidReleaseTracker";
import { ContactReveal } from "./components/ContactReveal";
import { SiteCounter } from "./components/SiteCounter";
import { TestFlightTracker } from "./components/TestFlightTracker";
import { apps } from "./data";
import { testFlightBuilds } from "./testflight";

function compactPlatforms(platforms: (typeof apps)[number]["platforms"]) {
  const names = new Set<string>();
  for (const platform of platforms) {
    if (/iPhone|iOS/i.test(platform.name)) names.add("iPhone");
    if (/iPad|iPadOS/i.test(platform.name)) names.add("iPad");
    if (/Mac|macOS/i.test(platform.name)) names.add("macOS");
    if (/Android/i.test(platform.name)) names.add("Android");
    if (/Web/i.test(platform.name)) names.add("Web");
  }
  return [...names].join(" · ");
}

export default function Home() {
  const productCount = 1 + apps.reduce(
    (total, app) => total + app.platforms.reduce((count, platform) => {
      const includesIPhone = /iPhone|iOS/i.test(platform.name);
      const includesIPad = /iPad|iPadOS/i.test(platform.name);
      return count + (includesIPhone && includesIPad ? 2 : 1);
    }, 0),
    0,
  );

  return (
    <main>
      <SiteHeader />

      <section className="hero shell" id="top">
        <div className="hero-copy reveal">
          <p className="eyebrow">APPS BY ARMSONE</p>
          <h1>
            일상 가까이,
            <span>꼭 필요한 앱.</span>
          </h1>
          <p className="hero-lede">
            NasFinder.com은 나스파인더를 시작으로, 작지만 분명한 문제를
            해결하는 앱과 웹 서비스를 만들고 기록하는 공간입니다.
          </p>
          <a className="hero-feature-callout" href="#motion-bridge">
            <span>NASFINDER 핵심 기능</span>
            <strong>Live Photo <b aria-hidden="true">⇄</b> Motion Photo</strong>
            <i aria-hidden="true">↓</i>
          </a>
          <div className="hero-actions">
            <Link className="button button-primary" href="#apps">
              앱 둘러보기 <span aria-hidden="true">↘</span>
            </Link>
            <Link className="button button-quiet" href="https://github.com/armsone">
              GitHub <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>

        <div className="hero-orbit" aria-label={apps.map((app) => app.english).join(", ")}>
          <div className="orbit-glow" />
          {apps.map((app, index) => {
            const platforms = compactPlatforms(app.platforms);
            return (
            <Link
              className={`orbit-app orbit-app-${index + 1}`}
              href={`/apps/${app.slug}`}
              key={app.slug}
              aria-label={`${app.english} · ${platforms} 자세히 보기`}
            >
              <AppIcon app={app} priority={index < 2} />
              <span className="orbit-copy"><strong>{app.english}</strong><small>{platforms}</small></span>
            </Link>
            );
          })}
          <div className="orbit-center">
            <span>NasFinder</span>
            <strong>.com</strong>
          </div>
        </div>
      </section>

      <section className="signal-bar" aria-label="사이트 요약">
        <div className="shell signal-grid">
          <p><strong>{String(productCount).padStart(2, "0")}</strong><span>현재 소개하는 제품</span></p>
          <p><strong>06</strong><span>iPhone · iPad · macOS · Android · Web · Windows (커밍)</span></p>
          <p><strong>01</strong><span>한 사람의 꾸준한 기록</span></p>
        </div>
      </section>

      <section className="motion-bridge-section" id="motion-bridge">
        <div className="shell motion-bridge-shell">
          <div className="motion-bridge-copy reveal">
            <p className="eyebrow">NASFINDER FLAGSHIP FEATURE</p>
            <h2>움직이는 순간을,<br /><span>기기 경계 없이.</span></h2>
            <p className="motion-bridge-lede">
              iPhone의 Live Photo와 Android의 Motion Photo를 양방향으로
              주고받습니다. QR로 두 기기를 연결하면 받는 기기에 맞춰
              원본을 보존하거나 자동 변환해 사진 보관함에 저장합니다.
            </p>
            <Link className="button motion-bridge-button" href="/apps/nasfinder#why-nasfinder">
              나스파인더 기능 자세히 보기 <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div className="motion-bridge-visual reveal" aria-label="Live Photo와 Motion Photo의 양방향 변환">
            <div className="motion-device motion-device-apple">
              <div className="motion-device-top"><span>iPhone</span><b>LIVE</b></div>
              <div className="motion-frame">
                <i className="motion-sun" />
                <i className="motion-hill motion-hill-back" />
                <i className="motion-hill motion-hill-front" />
                <span className="motion-play" aria-hidden="true">▶</span>
              </div>
              <strong>Live Photo</strong>
            </div>

            <div className="motion-swap" aria-hidden="true">
              <span>자동 변환</span>
              <strong>⇄</strong>
              <small>QR로 연결</small>
            </div>

            <div className="motion-device motion-device-android">
              <div className="motion-device-top"><span>Android</span><b>MOTION</b></div>
              <div className="motion-frame">
                <i className="motion-sun" />
                <i className="motion-hill motion-hill-back" />
                <i className="motion-hill motion-hill-front" />
                <span className="motion-play" aria-hidden="true">▶</span>
              </div>
              <strong>Motion Photo</strong>
            </div>
          </div>

          <div className="motion-bridge-proof reveal" aria-label="핵심 기능 요약">
            <p><span>01</span><strong>Live Photo → Motion Photo</strong><small>Android에 맞춰 전달</small></p>
            <p><span>02</span><strong>Motion Photo → Live Photo</strong><small>iPhone에 맞춰 전달</small></p>
            <p><span>03</span><strong>QR 연결 · 사진 보관함 저장</strong><small>고르고, 연결하고, 받기</small></p>
          </div>
        </div>
      </section>

      <section className="apps-section shell" id="apps">
        <div className="section-heading reveal">
          <div>
            <p className="eyebrow">THE APPS</p>
            <h2>일상의 문제를 해결하는 제품들</h2>
          </div>
          <p>
            먼저 갖고 싶어지는 이유와 실제 화면을 보여드리고,
            설치·지원·개인정보 정보까지 한곳에서 이어드립니다.
          </p>
        </div>

        <div className="app-list">
          {apps.map((app, index) => (
            <article className={`app-row reveal theme-${app.theme}`} key={app.slug}>
              <div className="app-row-number">0{index + 1}</div>
              <div className="app-row-copy">
                <div className="app-title-line">
                  <AppIcon app={app} />
                  <div>
                    <p>{app.english}</p>
                    <h3>{app.name}</h3>
                  </div>
                </div>
                <p className="app-tagline">{app.tagline}</p>
                <div className="chip-row">
                  {app.platforms.map((platform) => (
                    <AppStatus key={platform.name} platform={platform} />
                  ))}
                </div>
                <Link className="text-link" href={`/apps/${app.slug}`}>
                  제품 자세히 보기 <span aria-hidden="true">→</span>
                </Link>
              </div>
              <AppArtwork app={app} />
            </article>
          ))}
        </div>
      </section>

      <section className="testflight-section" id="testflight">
        <div className="shell">
          <div className="section-heading reveal">
            <div><p className="eyebrow">EARLY ACCESS</p><h2 className="section-brand-title"><img src="/brands/testflight.jpg" alt="" aria-hidden="true" /><span>새로운 앱을 가장 먼저</span></h2></div>
            <p>TestFlight에서 지금 체험할 수 있는 앱과 남은 기간을 함께 보여드립니다. 마음에 드는 앱의 다음 모습을 먼저 만나보세요.</p>
          </div>
          <TestFlightTracker builds={testFlightBuilds} />
        </div>
      </section>

      <section className="android-release-section" id="android-releases">
        <div className="shell">
          <div className="section-heading reveal">
            <div><p className="eyebrow">READY FOR ANDROID</p><h2 className="section-brand-title"><span className="android-title-icon"><img src="/brands/android.svg" alt="" aria-hidden="true" /></span><span>Android에서 바로 시작</span></h2></div>
            <p>앱 아이콘으로 원하는 제품을 고르고 공식 최신판을 바로 받으세요. 출처와 APK 정보는 홈페이지가 확인한 경우에만 표시합니다.</p>
          </div>
          <AndroidReleaseTracker />
        </div>
      </section>

      <SiteCounter />

      <section className="principles shell reveal">
        <div className="principles-lead">
          <p className="eyebrow">BUILT WITH INTENT</p>
          <h2>소란스럽지 않게,<br />필요한 만큼<br />정확하게.</h2>
        </div>
        <div className="principle-grid">
          <article>
            <span>01</span>
            <h3>쓰임에서 시작합니다</h3>
            <p>기능의 수보다 사용자가 해결하려는 한 가지 일을 먼저 봅니다.</p>
          </article>
          <article>
            <span>02</span>
            <h3>진행 과정을 공개합니다</h3>
            <p>완성된 기능과 검증 중인 기능, 앞으로의 계획을 구분해 기록합니다.</p>
          </article>
          <article>
            <span>03</span>
            <h3>플랫폼에 자연스럽게</h3>
            <p>iOS, Android와 macOS 각각의 익숙한 방식과 접근성을 존중합니다.</p>
          </article>
        </div>
      </section>

      <section className="contact-band shell reveal" id="contact">
        <div>
          <p className="eyebrow">TALK WITH THE MAKER</p>
          <h2>써보고, 이야기해 주세요.</h2>
          <p className="maker-title"><strong>한병기</strong><span>바이브 코더</span></p>
          <p>저는 개발자가 아닙니다. 그래서 개발자보다 조금 낮춰 부르는 ‘코더’를 제 방식대로 붙였습니다. 거기에 바이브를 더해, 만들고 싶은 생각을 실제 앱으로 완성해 갑니다.</p>
          <p>버그 제보와 기능 제안은 공개된 GitHub 공간에서 함께 확인할 수 있습니다.</p>
        </div>
        <div className="contact-actions">
          <Link className="button button-light" href="https://github.com/armsone">
            GitHub에서 소통하기 <span aria-hidden="true">↗</span>
          </Link>
          <ContactReveal />
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="shell header-inner">
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a className="wordmark" href="/" aria-label="NasFinder.com 홈">
          <span>NasFinder</span>.com
        </a>
        <nav aria-label="주요 메뉴">
          {/* Native anchors preserve same-page hash scrolling in the deployed vinext runtime. */}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href="/">홈</a>
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href="/#apps">앱</a>
          <a href="/insights">기록</a>
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href="/#contact">소통</a>
          <a href="https://github.com/armsone">GitHub <span aria-hidden="true">↗</span></a>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-inner">
        <div>
          <Link className="wordmark" href="/"><span>NasFinder</span>.com</Link>
          <p>한병기 · 바이브 코더가 만드는 앱과 웹 서비스를 소개합니다.</p>
        </div>
        <div className="footer-links">
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href="/#apps">모든 앱</a>
          <a href="/insights">사이트 기록</a>
          <Link href="/apps/nasfinder/privacy">개인정보처리방침</Link>
          <Link href="/apps/nasfinder/support">지원</Link>
          <Link href="https://github.com/armsone">GitHub</Link>
        </div>
        <p className="copyright">© {new Date().getFullYear()} armsone</p>
      </div>
    </footer>
  );
}
