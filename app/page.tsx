import type { Metadata } from "next";
import Image from "./components/SiteImage";
import Link from "next/link";
import { AdvantageVisual, type AdvantageVariant } from "./components/AdvantageVisual";
import { AppIcon, AppStatus } from "./components/AppVisuals";
import { AndroidReleaseTracker } from "./components/AndroidReleaseTracker";
import { ContactReveal } from "./components/ContactReveal";
import { DownloadQrCode } from "./components/DownloadQrCode";
import { SiteCounter } from "./components/SiteCounter";
import { TestFlightTracker } from "./components/TestFlightTracker";
import { apps, familyApps, findApp, productFamilies } from "./data";
import { appCardImage } from "./media";
import { testFlightBuilds } from "./testflight";
import { getSiteBrand } from "./site-brand";
import { SiteFooter, SiteHeader } from "./components/SiteChrome";

const principleVisuals: AdvantageVariant[] = ["target-swing", "check-source", "devices-pair"];

export const dynamic = "force-dynamic";

const homeKoreanNames: Record<string, string> = {
  aiplaygrand: "에이아이 플레이그랜드",
  "hanstree-workroom": "한스트리 워크룸",
  cleanusb: "클린USB",
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
  starmanager: "스타그램",
  "minecraft-server": "나스오에스",
  whattoeat: "오늘 뭐 먹지??",
  denimdex: "데님덱스",
  "alfred-ai-search": "알프레드 AI 검색",
  "alfred-navermap": "네이버 지도 길찾기",
  aibi: "아이비",
  autoshorts: "자동쇼츠",
  ppabang: "빠방넷",
};

export async function generateMetadata(): Promise<Metadata> {
  const brand = await getSiteBrand();
  const shareImage = brand.name === "NASFINDER" ? brand.icon : "/og-catalog-20260918.png";
  return {
  description: brand.name === "NASFINDER" ? "나스파인더의 기능과 지원 플랫폼, 최신 설치 정보를 한곳에서 확인하세요." : "NAS 속 사진 보기, 가족 호출, 밤새 수면 기록, AI 사용량 확인까지. 한스트리가 직접 만들고 다듬는 앱과 도구를 한곳에서 고르고 바로 받아 보세요.",
  alternates: { canonical: brand.canonical },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: brand.koreanName,
    title: brand.title,
    description: brand.description,
    url: brand.canonical,
    images: [{ url: shareImage, width: brand.name === "NASFINDER" ? 1024 : 1727, height: brand.name === "NASFINDER" ? 1024 : 910, alt: `${brand.koreanName}의 앱과 도구` }],
  },
  };
}

const platformTargetAliases = [
  ["iPhone", "iPad", "iOS", "iPadOS"], // Apple 모바일 제품군은 레코드당 1회
  ["Mac", "macOS"],
  ["Android"],
  ["Google TV"],
  ["Chrome"],
  ["네이버 웨일"],
  ["NasOS"],
  ["Synology NAS"],
];

function countPlatformTargets(platformName: string) {
  const matched = platformTargetAliases.filter((aliases) => aliases.some((alias) => platformName.includes(alias))).length;
  return Math.max(matched, 1); // Web · Swift Package · Kotlin/JVM 등 단일 레코드는 기본 1
}

function verifiedTestFlightInviteUrl(inviteUrl: string | null) {
  return inviteUrl?.startsWith("https://testflight.apple.com/join/") ? inviteUrl : null;
}

function TestFlightInviteLinks() {
  return (
    <div className="testflight-invite-grid">
        {testFlightBuilds.filter((build) => build.publicBetaState !== "internalOnly").map((build) => {
        const app = findApp(build.slug);
        const inviteUrl = build.inviteAvailable !== false ? verifiedTestFlightInviteUrl(build.inviteUrl) : null;
        const waitingForReview = build.publicBetaState === "waitingForReview";
        const rejected = build.publicBetaState === "rejected";
        if (!app) return null;

        return (
          <article className={`testflight-invite-card${inviteUrl ? " testflight-invite-card-ready" : ""}`} key={build.slug}>
            <div className="testflight-invite-head">
              <AppIcon app={app} />
              <div><p>PUBLIC BETA</p><h3>{build.appName}</h3></div>
            </div>
            <p className="testflight-invite-copy">{rejected ? "Apple 심사에서 수정 요청이 있어 새 빌드가 필요합니다." : waitingForReview && inviteUrl ? "기존 공개 링크는 열려 있고, 최신 빌드는 Apple 심사를 기다리고 있습니다." : waitingForReview ? "Apple 공개 테스트 심사에 제출되어 승인을 기다리고 있습니다." : inviteUrl ? "신청서 없이 TestFlight에서 바로 참여할 수 있습니다." : build.publicBetaState === "needsReviewAccount" ? "외부용 빌드는 준비됐고 Apple 심사용 계정을 등록하고 있습니다." : "외부 테스트용 새 빌드를 준비하고 있습니다."}</p>
            {inviteUrl ? (
              <><a className="testflight-invite-action" href={inviteUrl}>{waitingForReview ? "기존 공개 링크 열기" : "외부 테스터로 참여"} <span aria-hidden="true">↗</span></a><DownloadQrCode className="testflight-invite-qr" href={inviteUrl} label={`${build.appName} TestFlight 공개 링크`} /></>
            ) : (
              <span className="testflight-invite-pending"><i aria-hidden="true" />{rejected ? "새 빌드 준비 필요" : waitingForReview ? "Apple 심사 중" : build.publicBetaState === "needsReviewAccount" ? "심사 계정 준비" : "외부용 빌드 준비"}</span>
            )}
          </article>
        );
      })}
    </div>
  );
}

export default async function Home() {
  const brand = await getSiteBrand();
  const workCount = apps.reduce(
    (total, app) => total + app.platforms.reduce((sum, platform) => sum + countPlatformTargets(platform.name), 0),
    2, // Hanstree Studio · 먹탐자 Instagram
  );
  const androidPlatformDetails = Object.fromEntries(
    apps.flatMap((app) => {
      const detail = app.platforms.find((platform) => platform.name.includes("Android"))?.detail;
      return detail ? [[app.slug, detail]] : [];
    }),
  );

  const cleanusbApp = findApp("cleanusb");
  const ccmbApp = findApp("ccmb");

  return (
    <main className="home-hanstree">
      <SiteHeader />

      <section className="works-index-hero shell reveal" id="works">
        <div className="works-index-intro">
          <div className="hero-intro-copy">
            <p className="eyebrow">{brand.name} · INDEPENDENT MAKER</p>
            <h1>일상의 작은 불편,<br /><span>마음에 드는 도구 하나로.</span></h1>
            <p className="hero-lead">
              NAS 속 사진을 폰에서 바로 열고, 가족을 버튼 하나로 부르고, 밤새 잠소리를 기록하고. 일상의 작은 불편에서 시작해 직접 쓰며 다듬은 한스트리의 앱과 도구를, 지금 바로 받아 써 보세요.
            </p>
            <div className="hero-editorial-actions">
              <a className="editorial-btn editorial-btn-primary" href="#apps">
                제품 카탈로그 보기 <span aria-hidden="true">↓</span>
              </a>
              <a className="editorial-btn editorial-btn-secondary" href="#contact">
                만든 사람 이야기 <span aria-hidden="true">→</span>
              </a>
              <a className="editorial-btn editorial-btn-ghost" href="#works-index">
                전체 제품 한눈에 <span aria-hidden="true">↓</span>
              </a>
            </div>
          </div>

          <div className="hero-editorial-feature" aria-label="지금 눈여겨볼 제품과 공간">
            <Link className="editorial-feature-main" href="/space/hanstree" aria-label="한스트리 스튜디오 자세히 보기">
              <div className="editorial-feature-image-wrap">
                <Image
                  className="editorial-feature-image"
                  src="/hanstree/screen-art.jpg"
                  alt="한스트리 스튜디오 작업 공간"
                  width={1448}
                  height={1086}
                  priority
                  sizes="(max-width: 920px) 100vw, 42vw"
                />
                <span className="editorial-feature-tag">STUDIO SPACE</span>
              </div>
              <div className="editorial-feature-info">
                <div className="editorial-feature-meta">
                  <Image className="app-icon editorial-feature-symbol" src="/hanstree/studio-symbol-dark.jpeg" alt="" width={886} height={886} sizes="38px" />
                  <div>
                    <strong>한스트리 스튜디오</strong>
                    <small>Hanstree Studio · 창작 공간</small>
                  </div>
                </div>
                <span className="editorial-feature-arrow" aria-hidden="true">↗</span>
              </div>
            </Link>

            <div className="editorial-feature-sub-grid">
              {cleanusbApp && (
                <Link className="editorial-feature-sub" href={`/apps/${cleanusbApp.slug}`} aria-label={`${cleanusbApp.name} 제품 자세히 보기`}>
                  <div className="editorial-feature-sub-thumb">
                    <Image
                      src={appCardImage(cleanusbApp)}
                      alt={`${cleanusbApp.name} 대표 이미지`}
                      width={640}
                      height={427}
                      sizes="(max-width: 600px) 44vw, 20vw"
                      unoptimized
                    />
                    <AppIcon app={cleanusbApp} />
                  </div>
                  <div className="editorial-feature-sub-text">
                    <span className="editorial-sub-tag">MAC UTILITY</span>
                    <strong>{homeKoreanNames[cleanusbApp.slug] ?? cleanusbApp.name}</strong>
                    <small>{cleanusbApp.tagline}</small>
                  </div>
                </Link>
              )}

              {ccmbApp && (
                <Link className="editorial-feature-sub" href={`/apps/${ccmbApp.slug}`} aria-label={`${ccmbApp.name} 제품 자세히 보기`}>
                  <div className="editorial-feature-sub-thumb">
                    <Image
                      src="/apps/ccmb/ccmb-campaign-v044.png"
                      alt={`${ccmbApp.name} 대표 이미지`}
                      width={640}
                      height={427}
                      sizes="(max-width: 600px) 44vw, 20vw"
                      unoptimized
                    />
                    <AppIcon app={ccmbApp} />
                  </div>
                  <div className="editorial-feature-sub-text">
                    <span className="editorial-sub-tag">MENUBAR TOOL</span>
                    <strong>{homeKoreanNames[ccmbApp.slug] ?? ccmbApp.name}</strong>
                    <small>{ccmbApp.tagline}</small>
                  </div>
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="hero-product-wall works-index-wall" id="works-index" aria-label="한스트리의 모든 제품과 공간">
          <div className="hero-product-wall-heading">
            <div>
              <p>THE FULL CATALOGUE</p>
              <h2>모든 제품과 공간을, 한 화면에서 고르세요.</h2>
            </div>
            <p className="works-wall-sub">아이콘을 누르면 각 제품의 소개와 받는 방법으로 바로 이동합니다.</p>
          </div>
          <div className="hero-product-grid" role="list">
            <Link className="hero-product hero-product-space" href="/space/hanstree" role="listitem" aria-label="한스트리 스튜디오 자세히 보기">
              <div className="hero-product-thumb-wrap">
                <Image className="app-icon hanstree-product-icon" src="/hanstree/studio-symbol-dark.jpeg" alt="" width={886} height={886} sizes="38px" />
              </div>
              <span className="hero-product-copy"><strong>한스트리 스튜디오</strong><small>Hanstree Studio</small></span>
            </Link>
            {apps.map((app) => (
              <Link className={`hero-product hero-product-${app.slug}`} href={`/apps/${app.slug}`} key={app.slug} role="listitem" aria-label={`${app.name} 제품 자세히 보기`}>
                <div className="hero-product-thumb-wrap">
                  <AppIcon app={app} />
                </div>
                <span className="hero-product-copy"><strong>{homeKoreanNames[app.slug] ?? app.name}</strong><small>{app.english}</small></span>
              </Link>
            ))}
            <Link className="hero-product hero-product-instagram" href="/space/hanstree/instagram" role="listitem" aria-label="먹탐자 Instagram 자세히 보기">
              <div className="hero-product-thumb-wrap">
                <Image className="app-icon" src="/instagram/meoktamja-hero.jpeg" alt="" width={960} height={638} sizes="38px" />
              </div>
              <span className="hero-product-copy"><strong>먹탐자</strong><small>Instagram · @armsone</small></span>
            </Link>
          </div>
        </div>
      </section>

      <section className="signal-bar" aria-label="사이트 요약">
        <div className="shell signal-grid">
          <p><strong>{String(workCount).padStart(2, "0")}</strong><span>지금 만날 수 있는 결과물</span></p>
          <p><strong>08</strong><span>iPhone · iPad · macOS · Android · Google TV · Web · NasOS · Windows</span></p>
          <p><strong>01</strong><span>한 사람의 꾸준한 기록</span></p>
        </div>
      </section>

      <section className="apps-section shell" id="apps">
        <div className="section-heading reveal">
          <div>
            <p className="eyebrow">THE APPS & TOOLS</p>
            <h2>오늘의 불편 하나에, 앱 하나.</h2>
          </div>
          <p>
            직접 쓰려고 만들었기에 더 꼼꼼히 챙겼습니다.
            제품마다 한 줄 약속과 대표 이미지를 먼저 보고, 지원 기기와 받는 방법까지 바로 이어집니다.
          </p>
        </div>

        {/* 제품군 이동: 해시 링크만 사용해 직접 링크·키보드 포커스를 그대로 유지합니다. 목록을 지나는 동안 상단에 붙어 있어 어디서든 다른 제품군으로 건너뜁니다. */}
        <nav className="family-nav" aria-label="제품군 바로가기">
          <a href="#apps">전체 <small>{apps.length}</small></a>
          {productFamilies.map((family, familyIndex) => (
            <a href={`#family-${family.id}`} key={family.id}><b>{String(familyIndex + 1).padStart(2, "0")}</b>{family.name} <small>{familyApps(family).length}</small></a>
          ))}
        </nav>

        <div className="app-list">
          {productFamilies.map((family, familyIndex) => {
            const nextFamily = productFamilies[familyIndex + 1];
            return (
            // 제품군마다 details로 묶어 작은 화면에서 접어 둘 수 있게 합니다. 기본은 모두 펼침.
            <details className="app-family" id={`family-${family.id}`} key={family.id} open>
              <summary className="app-family-heading">
                <span className="app-family-index">{String(familyIndex + 1).padStart(2, "0")}</span>
                <span className="app-family-title"><small>{family.english}</small><strong>{family.name}</strong></span>
                <span className="app-family-summary">{family.summary} · {familyApps(family).length}개</span>
              </summary>
              {/* 제품군 안 빠른 이동: 큰 카드를 다 내리지 않고 아이콘·이름만 보고 바로 제품 페이지로 갑니다. */}
              <ul className="app-family-quick" aria-label={`${family.name} 제품 바로가기`}>
                {familyApps(family).map((app) => (
                  <li key={app.slug}>
                    <Link href={`/apps/${app.slug}`}><span className="app-family-quick-icon" aria-hidden="true"><AppIcon app={app} /></span><span>{homeKoreanNames[app.slug] ?? app.name}</span></Link>
                  </li>
                ))}
              </ul>
              <div className="app-family-list">
                {familyApps(family).map((app) => {
                  const index = apps.indexOf(app); // 전체 카탈로그 기준 번호를 이어갑니다
                  return (
                    <article className={`app-row app-row-${app.slug} reveal theme-${app.theme}`} key={app.slug}>
                      <div className="app-card-head">
                        <span className="app-card-index">{String(index + 1).padStart(2, "0")}</span>
                        <div className="app-title-line">
                          <AppIcon app={app} />
                          <div>
                            <p>{app.english}</p>
                            <h3>
                              <Link href={`/apps/${app.slug}`}>{homeKoreanNames[app.slug] ?? app.name}</Link>
                            </h3>
                          </div>
                        </div>
                      </div>
                      <p className="app-tagline">{app.tagline}</p>

                      <Link className="app-row-representative" href={`/apps/${app.slug}`} aria-label={`${app.name} 제품 자세히 보기`}>
                        <Image
                          src={app.slug === "ccmb" ? "/apps/ccmb/ccmb-dashboard-private.png" : appCardImage(app)}
                          alt={`${app.name} 대표 이미지`}
                          width={1280}
                          height={853}
                          sizes="(max-width: 600px) 100vw, (max-width: 920px) 50vw, 560px"
                          unoptimized
                        />
                        <span><small>REPRESENTATIVE SCENE</small><strong>{app.features[0]?.title ?? app.tagline}</strong></span>
                      </Link>

                      <div className="app-card-foot">
                        <div className="chip-row">
                          {app.platforms.map((platform) => (
                            <AppStatus key={platform.name} platform={platform} />
                          ))}
                        </div>
                        <Link className="editorial-detail-link" href={`/apps/${app.slug}`}>
                          제품 자세히 보기 <span aria-hidden="true">→</span>
                        </Link>
                      </div>
                    </article>
                  );
                })}
              </div>
              <div className="app-family-foot">
                <a className="app-family-top" href="#apps">제품군 목록으로 <span aria-hidden="true">↑</span></a>
                {nextFamily ? <a className="app-family-next" href={`#family-${nextFamily.id}`}>다음 · {nextFamily.name} <span aria-hidden="true">↓</span></a> : <a className="app-family-next" href="#testflight">TestFlight 체험으로 <span aria-hidden="true">↓</span></a>}
              </div>
            </details>
            );
          })}
        </div>
      </section>

      <section className="testflight-section" id="testflight">
        <div className="shell">
          <div className="section-heading reveal">
            <div><p className="eyebrow">EARLY ACCESS</p><h2 className="section-brand-title"><img src="/brands/testflight.jpg" alt="TestFlight" /><span>새로운 앱을 가장 먼저</span></h2></div>
            <p>정식 공개 전 다음 버전을 iPhone·iPad에서 먼저 써 볼 수 있습니다. 지금 체험할 수 있는 앱과 남은 기간을 함께 보여드립니다.</p>
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
            <p>스토어를 거치지 않고, 원하는 제품의 아이콘을 골라 공식 최신판을 바로 받으세요. 출처와 APK 정보는 홈페이지가 확인한 경우에만 표시합니다.</p>
          </div>
          <div className="install-update-note reveal" style={{ marginBottom: 36 }}>
            <strong>앱 안 업데이트를 준비하고 있습니다</strong>
            <p>직접 배포하는 Mac·Android 앱은 다음 공개판부터 시작할 때 새 버전을 확인하고, 자동 다운로드를 켜거나 끌 수 있으며, 필요할 때 직접 확인하고 받을 수도 있습니다. iPhone·iPad TestFlight 앱은 TestFlight가 업데이트를 관리합니다.</p>
          </div>
          <AndroidReleaseTracker androidPlatformDetails={androidPlatformDetails} />
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
          <h2>마음에 드는 걸 써보고, 이야기해 주세요.</h2>
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
