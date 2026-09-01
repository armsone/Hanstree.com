import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { AdvantageVisual, type AdvantageVariant } from "./components/AdvantageVisual";
import { AppIcon, AppStatus } from "./components/AppVisuals";
import { AndroidReleaseTracker } from "./components/AndroidReleaseTracker";
import { ContactReveal } from "./components/ContactReveal";
import { SiteCounter } from "./components/SiteCounter";
import { TestFlightTracker } from "./components/TestFlightTracker";
import { apps, findApp } from "./data";
import { appCardImage } from "./media";
import { testFlightBuilds } from "./testflight";

const principleVisuals: AdvantageVariant[] = ["compass", "timeline-dots", "devices-pair"];

const homeKoreanNames: Record<string, string> = {
  nasfinder: "나스파인더",
  "super-thumbnail": "수퍼썸네일",
  hanclip: "한클립",
  hanai: "한양",
  stand: "스탠드",
  ccmb: "씨씨엠비",
  btn: "비티엔",
  trackpadguard: "트랙패드가드",
  "htoms-brief": "에이치티오엠에스 브리프",
  intosharp: "인투샾",
  airchurch: "에어처치",
  button: "아워버튼",
  starmanager: "아이매니저 AI",
  "minecraft-server": "나스오에스",
  whattoeat: "오늘 뭐 먹지??",
  denimdex: "데님덱스",
  "alfred-ai-search": "알프레드 AI 검색",
  aibi: "아이비",
  autoshorts: "자동쇼츠",
};

export const metadata: Metadata = {
  description: "한스트리가 직접 만든 앱, 디지털 제품과 창작 공간을 한눈에 살펴보는 결과물 인덱스입니다.",
  alternates: { canonical: "https://hanstree.com" },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "Hanstree",
    title: "Hanstree — 직접 만든 결과물의 인덱스",
    description: "나스파인더를 비롯한 디지털 제품과 Hanstree Studio 등 한스트리가 직접 만든 결과물을 소개합니다.",
    url: "https://hanstree.com",
    images: [{ url: "/og.png", width: 1731, height: 909, alt: "공간과 디지털 제품을 함께 만드는 Hanstree" }],
  },
};

function verifiedTestFlightInviteUrl(inviteUrl: string | null) {
  return inviteUrl?.startsWith("https://testflight.apple.com/join/") ? inviteUrl : null;
}

function TestFlightInviteLinks() {
  return (
    <div className="testflight-invite-grid">
        {testFlightBuilds.filter((build) => build.publicBetaState !== "internalOnly").map((build) => {
        const app = findApp(build.slug);
        const inviteUrl = build.inviteAvailable !== false ? verifiedTestFlightInviteUrl(build.inviteUrl) : null;
        if (!app) return null;

        return (
          <article className={`testflight-invite-card${inviteUrl ? " testflight-invite-card-ready" : ""}`} key={build.slug}>
            <div className="testflight-invite-head">
              <AppIcon app={app} />
              <div><p>PUBLIC BETA</p><h3>{build.appName}</h3></div>
            </div>
            <p className="testflight-invite-copy">{inviteUrl ? "신청서 없이 TestFlight에서 바로 참여할 수 있습니다." : build.publicBetaState === "waitingForReview" ? "Apple 공개 테스트 심사에 제출되어 승인을 기다리고 있습니다." : build.publicBetaState === "needsReviewAccount" ? "외부용 빌드는 준비됐고 Apple 심사용 계정을 등록하고 있습니다." : "외부 테스트용 새 빌드를 준비하고 있습니다."}</p>
            {inviteUrl ? (
              <a className="testflight-invite-action" href={inviteUrl}>외부 테스터로 참여 <span aria-hidden="true">↗</span></a>
            ) : (
              <span className="testflight-invite-pending"><i aria-hidden="true" />{build.publicBetaState === "waitingForReview" ? "Apple 심사 중" : build.publicBetaState === "needsReviewAccount" ? "심사 계정 준비" : "외부용 빌드 준비"}</span>
            )}
          </article>
        );
      })}
    </div>
  );
}

export default function Home() {
  const workCount = apps.length + 2;

  return (
    <main className="home-hanstree">
      <SiteHeader />

      <section className="works-index-hero shell reveal" id="works">
        <div className="works-index-intro">
          <p className="eyebrow">HANSTREE · WORK INDEX</p>
          <h1>생각을,<br /><span>결과물로.</span></h1>
          <p>앱과 디지털 제품, 공간까지. 형태를 정해두기보다 직접 필요하고 좋아하는 것을 만들고, 오래 다듬어 온 기록입니다.</p>
        </div>
        <div className="hero-product-wall works-index-wall" aria-label="한스트리가 직접 만든 결과물 전체">
          <div className="hero-product-wall-heading">
            <p>{String(workCount).padStart(2, "0")} WORKS. STILL COUNTING.</p>
            <h2>직접 만든 결과물의 인덱스</h2>
          </div>
          <div className="hero-product-grid" role="list">
            <Link className="hero-product hero-product-space" href="/space/hanstree" role="listitem" aria-label="한스트리 스튜디오 자세히 보기">
              <Image className="hero-product-image" src="/hanstree/screen-art.jpg" alt="" width={1448} height={1086} priority sizes="(max-width: 600px) 29vw, (max-width: 920px) 22vw, 150px" />
              <Image className="app-icon hanstree-product-icon" src="/hanstree/studio-symbol-dark.jpeg" alt="" width={886} height={886} priority sizes="48px" />
              <span className="hero-product-copy"><strong>한스트리 스튜디오</strong><small>Hanstree Studio</small></span>
            </Link>
            {apps.map((app, index) => (
              <Link className={`hero-product hero-product-${app.slug}`} href={`/apps/${app.slug}`} key={app.slug} role="listitem" aria-label={`${app.name} 제품 자세히 보기`}>
                <Image
                  className="hero-product-image"
                  src={app.slug === "ccmb" ? "/apps/ccmb/ccmb-campaign-v044.png" : appCardImage(app)}
                  alt={`${app.name} 대표 이미지`}
                  width={1280}
                  height={853}
                  priority={index < 4}
                  sizes="(max-width: 600px) 29vw, (max-width: 920px) 13vw, 150px"
                  unoptimized
                />
                <AppIcon app={app} priority={index < 4} />
                <span className="hero-product-copy"><strong>{homeKoreanNames[app.slug] ?? app.name}</strong><small>{app.english}</small></span>
              </Link>
            ))}
            <Link className="hero-product hero-product-instagram" href="/space/hanstree/instagram" role="listitem" aria-label="먹탐자 Instagram 자세히 보기">
              <Image className="hero-product-image" src="/instagram/meoktamja-hero.jpeg" alt="" width={960} height={638} sizes="(max-width: 600px) 29vw, (max-width: 920px) 22vw, 150px" />
              <span className="hero-product-copy"><strong>먹탐자</strong><small>Instagram · @armsone</small></span>
            </Link>
          </div>
        </div>
      </section>

      <section className="signal-bar" aria-label="사이트 요약">
        <div className="shell signal-grid">
          <p><strong>{String(workCount).padStart(2, "0")}</strong><span>현재 소개하는 결과물</span></p>
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
                    <h3>{homeKoreanNames[app.slug] ?? app.name}</h3>
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
              <div className="app-row-representative">
                <Image
                  src={app.slug === "ccmb" ? "/apps/ccmb/ccmb-dashboard-private.png" : appCardImage(app)}
                  alt={`${app.name} 대표 화면`}
                  width={1280}
                  height={853}
                  sizes="(max-width: 920px) 100vw, 52vw"
                  unoptimized
                />
                <span><small>REPRESENTATIVE SCENE</small><strong>{app.features[0]?.title ?? app.tagline}</strong></span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="testflight-section" id="testflight">
        <div className="shell">
          <div className="section-heading reveal">
            <div><p className="eyebrow">EARLY ACCESS</p><h2 className="section-brand-title"><img src="/brands/testflight.jpg" alt="TestFlight" /><span>새로운 앱을 가장 먼저</span></h2></div>
            <p>TestFlight에서 지금 체험할 수 있는 앱과 남은 기간을 함께 보여드립니다. 마음에 드는 앱의 다음 모습을 먼저 만나보세요.</p>
          </div>
          <TestFlightTracker builds={testFlightBuilds} />
        </div>
      </section>

      <section className="testflight-invite-section" id="downloads">
        <div className="shell">
          <div className="section-heading reveal">
            <div><p className="eyebrow">PUBLIC BETA LINKS</p><h2 className="section-brand-title"><img src="/brands/testflight.jpg" alt="TestFlight" /><span>외부 테스터 참여</span></h2></div>
            <p>앱별 공개 TestFlight 링크를 한곳에 모았습니다. 준비된 앱은 신청서 없이 바로 참여할 수 있습니다.</p>
          </div>
          <TestFlightInviteLinks />
        </div>
      </section>

      <section className="android-release-section" id="android-releases">
        <div className="shell">
          <div className="section-heading reveal">
            <div><p className="eyebrow">READY FOR ANDROID</p><h2 className="section-brand-title"><span className="android-title-icon"><img src="/brands/android.svg" alt="Android" /></span><span>Android에서 바로 시작</span></h2></div>
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
        <a className="wordmark header-wordmark" href="/" aria-label="Hanstree 홈">
          <Image className="header-brand-icon" src="/hanstree/studio-symbol-dark.jpeg" alt="" width={886} height={886} priority sizes="32px" />
          <span>HANSTREE</span>
        </a>
        <nav aria-label="주요 메뉴">
          {/* Native anchors preserve same-page hash scrolling in the deployed vinext runtime. */}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href="/#works">만든 것들</a>
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href="/space/hanstree">스튜디오</a>
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href="/#apps">제품</a>
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href="/#contact">이야기</a>
          <Link href="/apps/nasfinder/support">지원</Link>
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
          <Link className="wordmark" href="/"><span>HANSTREE</span></Link>
          <p>직접 만들고 오래 다듬어 온 결과물을 소개합니다.</p>
        </div>
        <div className="footer-links">
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href="/#works">만든 것들</a>
          <Link href="/space/hanstree">한스트리 스튜디오</Link>
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href="/#records">사이트 기록</a>
          <Link href="/apps/nasfinder/privacy">개인정보처리방침</Link>
          <Link href="/apps/nasfinder/support">지원</Link>
          <Link href="https://github.com/armsone">GitHub</Link>
          <Link href="/admin/testflight" aria-label="관리자 로그인">관리자</Link>
        </div>
        <p className="copyright">© {new Date().getFullYear()} Hanstree · armsone</p>
      </div>
    </footer>
  );
}
