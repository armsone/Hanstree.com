import Link from "next/link";
import { AppArtwork, AppIcon, AppStatus } from "./components/AppVisuals";
import { AndroidReleaseTracker } from "./components/AndroidReleaseTracker";
import { ContactReveal } from "./components/ContactReveal";
import { SiteCounter } from "./components/SiteCounter";
import { TestFlightTracker } from "./components/TestFlightTracker";
import { apps } from "./data";
import { testFlightBuilds } from "./testflight";

export default function Home() {
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
            해결하는 앱을 만들고 기록하는 공간입니다.
          </p>
          <div className="hero-actions">
            <Link className="button button-primary" href="#apps">
              앱 둘러보기 <span aria-hidden="true">↘</span>
            </Link>
            <Link className="button button-quiet" href="https://github.com/armsone">
              GitHub <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>

        <div className="hero-orbit" aria-label="NasFinder, HanClip, S.tand, CCMB">
          <div className="orbit-glow" />
          {apps.map((app, index) => (
            <Link
              className={`orbit-app orbit-app-${index + 1}`}
              href={`/apps/${app.slug}`}
              key={app.slug}
              aria-label={`${app.english} 자세히 보기`}
            >
              <AppIcon app={app} priority={index < 2} />
              <span>{app.english}</span>
            </Link>
          ))}
          <div className="orbit-center">
            <span>NasFinder</span>
            <strong>.com</strong>
          </div>
        </div>
      </section>

      <section className="signal-bar" aria-label="사이트 요약">
        <div className="shell signal-grid">
          <p><strong>04</strong><span>현재 공개할 제품</span></p>
          <p><strong>03</strong><span>Apple · Android · macOS</span></p>
          <p><strong>01</strong><span>한 사람의 꾸준한 기록</span></p>
        </div>
      </section>

      <section className="apps-section shell" id="apps">
        <div className="section-heading reveal">
          <div>
            <p className="eyebrow">THE APPS</p>
            <h2>지금 만들고 있는 것들</h2>
          </div>
          <p>
            각 앱의 화면과 기능, 개발 진행 상황, 사용법과 참여 방법을
            숨김없이 한곳에 모읍니다.
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
                  기능과 진행 상황 보기 <span aria-hidden="true">→</span>
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
            <div><p className="eyebrow">90 DAY WINDOW</p><h2>TestFlight 만료 시계</h2></div>
            <p>업로드한 시각부터 90일을 계산합니다. 날짜가 흐르면 남은 기간과 진행 바가 자동으로 바뀌어 다음 빌드를 준비할 때를 놓치지 않습니다.</p>
          </div>
          <TestFlightTracker builds={testFlightBuilds} />
        </div>
      </section>

      <section className="android-release-section" id="android-releases">
        <div className="shell">
          <div className="section-heading reveal">
            <div><p className="eyebrow">LATEST ANDROID RELEASES</p><h2>Android 최신 배포</h2></div>
            <p>나스파인더 Android의 첫 공개를 준비하고, 한클립과 S.tand의 GitHub 공식 릴리스를 자동으로 확인합니다. 링크와 파일 정보가 정해진 저장소와 일치할 때만 표시합니다.</p>
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
        <Link className="wordmark" href="/" aria-label="NasFinder.com 홈">
          <span>NasFinder</span>.com
        </Link>
        <nav aria-label="주요 메뉴">
          {/* Native anchors preserve same-page hash scrolling in the deployed vinext runtime. */}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href="/#apps">앱</a>
          <a href="/insights">기록</a>
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href="/#contact">소통</a>
          <Link href="https://github.com/armsone">GitHub <span aria-hidden="true">↗</span></Link>
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
          <p>한병기 · 바이브 코더가 만드는 앱을 소개합니다.</p>
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
