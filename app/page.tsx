import Image from "next/image";
import Link from "next/link";
import { AdvantageVisual, type AdvantageVariant } from "./components/AdvantageVisual";
import { AppIcon, AppStatus } from "./components/AppVisuals";
import { AndroidReleaseTracker } from "./components/AndroidReleaseTracker";
import { ContactReveal } from "./components/ContactReveal";
import { SiteCounter } from "./components/SiteCounter";
import { TestFlightTracker } from "./components/TestFlightTracker";
import { apps, findApp } from "./data";
import { testFlightBuilds } from "./testflight";

const principleVisuals: AdvantageVariant[] = ["compass", "timeline-dots", "devices-pair"];

function verifiedTestFlightInviteUrl(inviteUrl: string | null) {
  return inviteUrl?.startsWith("https://testflight.apple.com/join/") ? inviteUrl : null;
}

function TestFlightInviteLinks() {
  return (
    <div className="testflight-invite-grid">
      {testFlightBuilds.map((build) => {
        const app = findApp(build.slug);
        const inviteUrl = verifiedTestFlightInviteUrl(build.inviteUrl);
        if (!app) return null;

        return (
          <article className={`testflight-invite-card${inviteUrl ? " testflight-invite-card-ready" : ""}`} key={build.slug}>
            <div className="testflight-invite-head">
              <AppIcon app={app} />
              <div><p>PUBLIC BETA</p><h3>{build.appName}</h3></div>
            </div>
            <p className="testflight-invite-copy">{inviteUrl ? "신청서 없이 TestFlight에서 바로 참여할 수 있습니다." : build.publicBetaState === "waitingForReview" ? "Apple 공개 테스트 심사에 제출되어 승인을 기다리고 있습니다." : "외부 테스트용 새 빌드를 준비하고 있습니다."}</p>
            {inviteUrl ? (
              <a className="testflight-invite-action" href={inviteUrl}>외부 테스터로 참여 <span aria-hidden="true">↗</span></a>
            ) : (
              <span className="testflight-invite-pending"><i aria-hidden="true" />{build.publicBetaState === "waitingForReview" ? "Apple 심사 중" : "외부용 빌드 준비"}</span>
            )}
          </article>
        );
      })}
    </div>
  );
}

export default function Home() {
  const productCount = 2 + apps.reduce(
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
            하나만 만들 생각이었습니다. 그런데 불편이 자꾸 보였고,
            어느새 {apps.length}개의 제품이 되었습니다. 생각이 떠오르면 직접 만들고,
            쓸수록 좋아질 때까지 끝까지 다듬습니다.
          </p>
        </div>

        <div className="hero-showcase reveal" aria-hidden="true">
          <div className="hero-orbit-art" aria-hidden="true">
            <span className="hero-orbit-ring hero-orbit-ring-outer" />
            <span className="hero-orbit-ring hero-orbit-ring-inner" />
            <div className="hero-orbit-glow">
              <span>APPS BY</span>
              <strong>ARMSONE</strong>
              <small>생각을, 손에 잡히게.</small>
            </div>
            <p className="hero-orbit-count"><strong>{String(apps.length).padStart(2, "0")}</strong><span>개의 작은 해답</span></p>
          </div>
        </div>

        <section className="hero-product-wall reveal" aria-label="한병기가 만드는 앱 전체">
          <div className="hero-product-wall-heading">
            <p>{apps.length} PRODUCTS. STILL COUNTING.</p>
            <h2>보이는 불편마다, 앱 하나.</h2>
          </div>
          <div className="hero-product-grid" role="list">
            {apps.map((app, index) => (
              <Link className={`hero-product hero-product-${app.slug}`} href={`/apps/${app.slug}`} key={app.slug} role="listitem" aria-label={`${app.name} 제품 자세히 보기`}>
                <Image className="hero-product-image" src={`/apps/${app.slug}/${app.slug}-hero-v2.png`} alt="" width={1536} height={1024} priority={index < 4} sizes="(max-width: 600px) 29vw, (max-width: 920px) 13vw, 150px" unoptimized />
                <AppIcon app={app} priority={index < 4} />
                <span className="hero-product-copy"><strong>{app.name}</strong><small>{app.english}</small></span>
              </Link>
            ))}
          </div>
        </section>
      </section>

      <section className="signal-bar" aria-label="사이트 요약">
        <div className="shell signal-grid">
          <p><strong>{String(productCount).padStart(2, "0")}</strong><span>현재 소개하는 제품</span></p>
          <p><strong>08</strong><span>iPhone · iPad · macOS · Android · Google TV · Web · NasOS · Windows (커밍)</span></p>
          <p><strong>01</strong><span>한 사람의 꾸준한 기록</span></p>
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
            <article className={`app-row app-row-${app.slug} reveal theme-${app.theme}`} key={app.slug}>
              <Link className="app-row-hit-area" href={`/apps/${app.slug}`} aria-label={`${app.name} 제품 자세히 보기`} />
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
                <span className="text-link">
                  제품 자세히 보기 <span aria-hidden="true">→</span>
                </span>
              </div>
              <div className="app-row-representative" aria-hidden="true">
                <Image src={`/apps/${app.slug}/${app.slug}-hero-v2.png`} alt="" width={1536} height={1024} sizes="(max-width: 920px) 100vw, 52vw" unoptimized />
                <span><small>REPRESENTATIVE SCENE</small><strong>{app.features[0]?.title ?? app.tagline}</strong></span>
              </div>
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

      <section className="testflight-invite-section" id="downloads">
        <div className="shell">
          <div className="section-heading reveal">
            <div><p className="eyebrow">PUBLIC BETA LINKS</p><h2 className="section-brand-title"><img src="/brands/testflight.jpg" alt="" aria-hidden="true" /><span>외부 테스터 참여</span></h2></div>
            <p>앱별 공개 TestFlight 링크를 한곳에 모았습니다. 준비된 앱은 신청서 없이 바로 참여할 수 있습니다.</p>
          </div>
          <TestFlightInviteLinks />
        </div>
      </section>

      <section className="android-release-section" id="android-releases">
        <div className="shell">
          <div className="section-heading reveal">
            <div><p className="eyebrow">READY FOR ANDROID</p><h2 className="section-brand-title"><span className="android-title-icon"><img src="/brands/android.svg" alt="" aria-hidden="true" /></span><span>Android에서 바로 시작</span></h2></div>
            <p>앱 아이콘으로 원하는 제품을 고르고 공식 최신판을 바로 받으세요. 출처와 APK 정보는 홈페이지가 확인한 경우에만 표시합니다.</p>
          </div>
          <div className="install-update-note reveal" style={{ marginBottom: 36 }}>
            <strong>앱 안 업데이트를 준비하고 있습니다</strong>
            <p>직접 배포하는 Mac·Android 앱은 다음 공개판부터 시작할 때 새 버전을 확인하고, 자동 다운로드를 켜거나 끌 수 있으며, 필요할 때 직접 확인하고 받을 수도 있습니다. iPhone·iPad TestFlight 앱은 TestFlight가 업데이트를 관리합니다.</p>
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
            <div>
              <AdvantageVisual variant={principleVisuals[0]} />
              <h3>쓰임에서 시작합니다</h3>
              <p>기능의 수보다 사용자가 해결하려는 한 가지 일을 먼저 봅니다.</p>
            </div>
          </article>
          <article>
            <span>02</span>
            <div>
              <AdvantageVisual variant={principleVisuals[1]} />
              <h3>진행 과정을 공개합니다</h3>
              <p>완성된 기능과 검증 중인 기능, 앞으로의 계획을 구분해 기록합니다.</p>
            </div>
          </article>
          <article>
            <span>03</span>
            <div>
              <AdvantageVisual variant={principleVisuals[2]} />
              <h3>플랫폼에 자연스럽게</h3>
              <p>iOS, Android와 macOS 각각의 익숙한 방식과 접근성을 존중합니다.</p>
            </div>
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
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href="/#downloads">다운</a>
          <a href="/insights">기록</a>
          <a href="https://github.com/armsone">깃허브 <span aria-hidden="true">↗</span></a>
          <Link href="/admin/testflight" aria-label="관리자 로그인">관리자</Link>
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
