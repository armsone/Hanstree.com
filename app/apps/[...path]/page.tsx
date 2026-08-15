import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AppArtwork, AppIcon, AppStatus } from "../../components/AppVisuals";
import { ContactReveal } from "../../components/ContactReveal";
import { findApp } from "../../data";
import { SiteFooter, SiteHeader } from "../../page";

type RouteProps = { params: Promise<{ path: string[] }> };

export async function generateMetadata({ params }: RouteProps): Promise<Metadata> {
  const { path } = await params;
  const app = findApp(path[0]);
  if (!app) return {};
  const section = path[1];
  const suffix = section === "privacy" ? "개인정보처리방침" : section === "terms" ? "이용약관" : section === "support" ? "지원" : section === "data-deletion" ? "데이터 삭제" : section === "google-oauth" ? "Google API Use & Data Handling" : null;
  const title = suffix ? `${app.name} ${suffix}` : `${app.name} — ${app.tagline}`;
  const socialImage = !suffix && app.slug === "stand" ? "/og-stand.png" : "/og.png";
  return {
    title,
    description: app.summary,
    openGraph: { title, description: app.summary, images: [socialImage] },
    twitter: { card: "summary_large_image", title, description: app.summary, images: [socialImage] },
  };
}

export default async function AppRoute({ params }: RouteProps) {
  const { path } = await params;
  const app = findApp(path[0]);
  if (!app) notFound();

  const section = path[1];
  if (section === "google-oauth" && app.slug !== "nasfinder") notFound();
  if (section && !["privacy", "terms", "support", "data-deletion", "google-oauth"].includes(section)) notFound();
  if (section === "google-oauth") return <GoogleOAuthPage />;
  if (section) return <InfoPage app={app} section={section} />;

  return (
    <main className={`app-page theme-${app.theme}`}>
      <SiteHeader />
      <section className="app-hero shell">
        <div className="app-hero-copy reveal">
          <Link className="breadcrumb" href="/#apps">← 모든 앱</Link>
          <div className="app-ident"><AppIcon app={app} /><span>{app.english}</span></div>
          <p className="eyebrow">{app.eyebrow}</p>
          <h1>{app.tagline}</h1>
          <p className="app-summary">{app.summary}</p>
          <div className="chip-row">
            {app.platforms.map((platform) => <AppStatus key={platform.name} platform={platform} />)}
          </div>
          <div className="hero-actions">
            {app.platforms.find((platform) => platform.url) ? (
              <Link className="button button-primary" href={app.platforms.find((platform) => platform.url)!.url!}>지금 다운로드 <span aria-hidden="true">↗</span></Link>
            ) : <Link className="button button-primary" href="#progress">진행 상황 보기 <span aria-hidden="true">↓</span></Link>}
            <Link className="button button-quiet" href="#guide">사용법 보기</Link>
          </div>
        </div>
        <div className="app-hero-visual reveal"><AppArtwork app={app} /></div>
      </section>

      <nav className="section-nav" aria-label={`${app.name} 페이지 내부 메뉴`}>
        <div className="shell">
          <Link href="#features">특징</Link><Link href="#screens">화면</Link>{app.matchup && <Link href="#matchup">매치업</Link>}<Link href="#progress">진행 상황</Link><Link href="#guide">설명서</Link><Link href="#download">다운로드</Link>
        </div>
      </nav>

      <section className="feature-section shell" id="features">
        <div className="section-heading reveal"><div><p className="eyebrow">FEATURES</p><h2>복잡함은 덜고,<br />쓰임은 선명하게.</h2></div></div>
        <div className="feature-grid">
          {app.features.map((feature, index) => <article className="feature-card reveal" key={feature.title}><span>0{index + 1}</span><h3>{feature.title}</h3><p>{feature.body}</p></article>)}
        </div>
      </section>

      <section className="screens-section" id="screens">
        <div className="shell">
          <div className="section-heading reveal"><div><p className="eyebrow">IN THE APP</p><h2>화면으로 먼저 만나보세요.</h2></div><p>실제 공개 자료를 우선 사용하고, 개인 정보가 담긴 화면은 데모 데이터로 교체합니다.</p></div>
          {app.screenshots && app.screenshots.length > 0 ? (
            <div className="screenshot-rail">{app.screenshots.map((screen) => <figure className={`screen-${screen.layout ?? "phone"}`} key={screen.src}><div className="screenshot-media"><img src={screen.src} alt={screen.alt} loading="lazy" /></div><figcaption>{screen.alt}</figcaption></figure>)}</div>
          ) : (
            <div className="single-artwork reveal"><AppArtwork app={app} /><p>대표 화면 이미지는 현재 제품 상태에 맞춰 계속 보강합니다.</p></div>
          )}
        </div>
      </section>

      {app.matchup && (
        <section className="matchup-section" id="matchup">
          <div className="shell">
            <div className="section-heading reveal">
              <div><p className="eyebrow">DETERMINISTIC UI MATCHUP</p><h2>느낌이 아니라,<br />재현 가능한 화면으로.</h2></div>
              <p>한국어·서울 시간대·고정 시각·애니메이션 비활성 조건에서 iOS와 Android를 같은 의미 ID로 캡처하고 비교합니다.</p>
            </div>
            <div className="matchup-layout">
              <div className="matchup-metrics reveal">
                {app.matchup.metrics.map((metric) => <article key={metric.label}><strong>{metric.value}</strong><span>{metric.label}</span></article>)}
              </div>
              <div className="matchup-scope reveal">
                <h3>검증 범위</h3>
                <ul>{app.matchup.scope.map((item) => <li key={item}>{item}</li>)}</ul>
                <p><strong>현재 상태</strong>{app.matchup.note}</p>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="progress-section shell" id="progress">
        <div className="section-heading reveal"><div><p className="eyebrow">BUILDING IN PUBLIC</p><h2>현재 진행 상황</h2></div><p>숫자보다 실제 상태를 보여드립니다. 마지막 내용 확인: 2026년 8월 15일.</p></div>
        <div className="progress-list">
          {app.progress.map((item, index) => <article className="progress-item reveal" key={item.title}><div className={`progress-marker marker-${item.state}`}><span>{index + 1}</span></div><div><p>{item.state === "done" ? "구현됨" : item.state === "active" ? "검증 중" : "다음 단계"}</p><h3>{item.title}</h3><span>{item.body}</span></div></article>)}
        </div>
      </section>

      <section className="guide-section" id="guide">
        <div className="shell guide-layout">
          <div className="guide-sticky reveal"><p className="eyebrow">QUICK GUIDE</p><h2>처음부터<br />차근차근.</h2><p>더 자세한 설명과 문제 해결 문서는 앱 개발 진행에 맞춰 계속 추가됩니다.</p></div>
          <div className="guide-steps">
            {app.guide.map((step, index) => <article className="guide-step reveal" key={step.title}><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{step.title}</h3><p>{step.body}</p></div></article>)}
          </div>
        </div>
      </section>

      <section className="download-section shell reveal" id="download">
        <div><p className="eyebrow">DOWNLOAD & TEST</p><h2>완성된 앱과 전용 도구.</h2><p>플랫폼별 현재 상태와 공식 배포 파일을 구분해 표시합니다. 별도 도구는 용도까지 확인한 뒤 내려받을 수 있습니다.</p></div>
        <div className="download-list">
          {app.platforms.map((platform) => <article key={platform.name}><div><span className={`status-dot status-${platform.status.replace(" ", "-")}`} /><h3>{platform.name}</h3></div><p>{platform.detail} · {platform.status}</p>{platform.url ? <Link href={platform.url}>{platform.downloadLabel ?? "다운로드 페이지"} <span aria-hidden="true">↗</span></Link> : <span>{platform.availabilityNote ?? "공개 링크 준비 중"}</span>}{platform.checksum && <small className="download-checksum">SHA-256 {platform.checksum}</small>}</article>)}
        </div>
      </section>

      <section className="support-cards shell reveal">
        <Link href={`/apps/${app.slug}/privacy`}><span>PRIVACY</span><h3>개인정보처리방침</h3><p>앱이 다루는 데이터와 보관·삭제 방식을 확인합니다.</p><b>→</b></Link>
        <Link href={`/apps/${app.slug}/support`}><span>SUPPORT</span><h3>지원과 문의</h3><p>문제 해결과 오류 제보에 필요한 내용을 안내합니다.</p><b>→</b></Link>
        <Link href={`/apps/${app.slug}/terms`}><span>TERMS</span><h3>이용약관</h3><p>제품 이용 조건과 책임 범위를 확인합니다.</p><b>→</b></Link>
      </section>
      <SiteFooter />
    </main>
  );
}

function InfoPage({ app, section }: { app: NonNullable<ReturnType<typeof findApp>>; section: string }) {
  const isPrivacy = section === "privacy";
  const isTerms = section === "terms";
  const isDeletion = section === "data-deletion";
  const title = isPrivacy ? "개인정보처리방침" : isTerms ? "이용약관" : isDeletion ? "연결 해제 및 데이터 삭제" : "지원과 문의";

  return (
    <main className={`info-page theme-${app.theme}`}>
      <SiteHeader />
      <article className="legal-shell shell">
        <Link className="breadcrumb" href={`/apps/${app.slug}`}>← {app.name}으로 돌아가기</Link>
        <p className="eyebrow">{app.english.toUpperCase()}</p>
        <h1>{title}</h1>
        <p className="legal-intro">{isPrivacy ? `${app.name}가 어떤 정보를 왜 다루고, 어디에 보관하며, 사용자가 어떻게 삭제할 수 있는지 설명합니다.` : isTerms ? `${app.name}를 이용하기 전에 알아야 할 기본 조건과 책임 범위를 안내합니다.` : isDeletion ? "Google을 비롯한 외부 계정 연결을 해제하고 기기에 저장된 데이터를 삭제하는 방법입니다." : "불편한 점이나 제안이 있다면 아래 내용을 먼저 확인한 뒤 알려주세요."}</p>

        {isPrivacy && <>
          <section className="privacy-at-glance" aria-labelledby="privacy-summary-title">
            <p className="eyebrow">PRIVACY AT A GLANCE</p>
            <h2 id="privacy-summary-title">먼저, 핵심만 쉽게 알려드립니다.</h2>
            <div>
              <article><span>01</span><h3>무엇을</h3><p>사용자가 기능을 위해 선택하거나 연결한 정보만 다룹니다.</p></article>
              <article><span>02</span><h3>왜</h3><p>앱 안에서 요청한 탐색·편집·전송 기능을 제공하는 데 사용합니다.</p></article>
              <article><span>03</span><h3>어디에</h3><p>기기 저장공간과 Keychain을 우선 사용하며 외부 서비스는 직접 연결합니다.</p></article>
              <article><span>04</span><h3>어떻게 삭제</h3><p>앱의 관리 기능과 연결 해제, 앱 삭제로 정리할 수 있습니다.</p></article>
            </div>
          </section>
          <LegalSection title="핵심 원칙"><ul>{app.privacy.map((item) => <li key={item}>{item}</li>)}</ul></LegalSection>
          <LegalSection title="처리 목적과 항목"><p>앱은 기능 수행에 필요한 권한, 사용자가 직접 선택한 파일과 사용자가 연결한 서비스의 인증 정보만 해당 기능을 제공하기 위해 처리합니다. 광고 목적의 개인정보 판매나 맞춤형 추적을 목적으로 처리하지 않습니다.</p></LegalSection>
          <LegalSection title="홈페이지 이용 통계"><p>NasFinder.com은 홈페이지 방문 횟수와 공식 APK 바로 받기 버튼을 누른 횟수를 숫자로만 집계합니다. 방문은 같은 브라우저에서 하루 한 번만 세기 위해 마지막 집계 날짜를 브라우저에 저장합니다. 집계 데이터베이스에는 방문자의 이름, 이메일, 계정, 쿠키 또는 IP 주소를 함께 저장하지 않으며 광고나 개인별 행동 추적에 사용하지 않습니다.</p></LegalSection>
          <LegalSection title="보유 기간"><p>연결 정보와 인증 정보는 사용자가 연결을 해제하거나 앱을 삭제할 때까지, 앱 안의 프로젝트·받은 파일·녹음은 사용자가 삭제하거나 앱을 삭제할 때까지 기기에 보관됩니다. 다운로드와 미리보기 캐시는 앱의 정리 기능, 시스템의 저장공간 관리 또는 앱 삭제로 제거됩니다. 사진 앱·갤러리·파일 앱으로 내보낸 결과물은 해당 위치에서 별도로 삭제해야 합니다.</p></LegalSection>
          <LegalSection title="파기 방법"><p>앱에서 삭제한 로컬 데이터는 앱의 저장공간에서 제거합니다. Keychain에 보관된 인증 정보는 연결 해제 또는 앱이 제공하는 계정 삭제 절차로 삭제합니다. 외부 서비스에 남은 접근 권한은 해당 서비스의 계정 보안 페이지에서도 철회할 수 있습니다.</p></LegalSection>
          <LegalSection title="외부 서비스와 제공"><p>앱은 사용자가 선택한 기능을 수행할 때 외부 저장소, 날씨, 라디오, 웹사이트 또는 배포 서비스와 통신할 수 있습니다. 사용자가 파일 전송이나 공유를 직접 요청한 경우에만 선택한 대상에 해당 정보가 전달되며, 연결한 서비스에는 각 제공자의 개인정보처리방침과 보관 기준이 적용됩니다.</p></LegalSection>
          <LegalSection title="사용자의 권리"><p>사용자는 운영체제 설정에서 앱 권한을 철회하고, 앱에서 연결·프로젝트·파일·캐시를 삭제하거나 외부 계정을 연결 해제할 수 있습니다. 개인정보 열람·정정·삭제·처리정지에 관한 문의는 아래 개인정보 보호책임자에게 요청할 수 있습니다.</p></LegalSection>
          {app.slug === "nasfinder" && <>
            <LegalSection title="Google 서비스"><p>Google 계정 연결 기능은 사용자가 요청한 파일 작업에 필요한 정보만 처리하도록 설계합니다. Google Photos는 전체 보관함을 탐색하지 않고, Google Photos Picker에서 사용자가 직접 선택한 항목만 가져오는 방식으로 도입할 예정입니다. 실제 요청 권한과 데이터 흐름은 구현 및 검증 완료 후 이 방침에 확정하여 표시합니다.</p></LegalSection>
            <section className="limited-use" lang="en" aria-labelledby="google-limited-use-title">
              <p className="eyebrow">ENGLISH SUMMARY FOR GOOGLE API USERS</p>
              <h2 id="google-limited-use-title">Google API Data Use &amp; Limited Use</h2>
              <p>NasFinder will use information received from Google APIs only to provide user-requested file access and transfer features. Its use and transfer of information received from Google APIs will adhere to the Google API Services User Data Policy, including the Limited Use requirements.</p>
              <p>The planned Google Photos integration will use Google Photos Picker so that users explicitly select the media they want to import. NasFinder will not use it to browse or recreate a user&apos;s complete Google Photos library.</p>
              <Link href="/apps/nasfinder/google-oauth">Read the concise English disclosure <span aria-hidden="true">→</span></Link>
            </section>
          </>}
          <LegalSection title="개인정보 보호책임자"><p><strong>한병기</strong><br />NasFinder.com 및 앱 운영자</p><p>개인정보 관련 문의와 권리 행사는 아래 직접 문의 경로로 접수할 수 있습니다. 개인 이메일 주소는 자동 수집을 줄이기 위해 사용자가 요청할 때만 화면에 표시합니다.</p><div className="privacy-contact"><ContactReveal /></div></LegalSection>
          <LegalSection title="권익침해 구제"><p>개인정보 침해에 관한 별도 상담이 필요하면 개인정보침해신고센터(국번 없이 118), 개인정보분쟁조정위원회(1833-6972) 등 관계 기관에 문의할 수 있습니다.</p></LegalSection>
          <LegalSection title="방침의 변경"><p>처리 항목이나 외부 서비스가 달라지면 시행 전에 변경 내용을 이 페이지에 알리고, 시행일과 마지막 변경일을 함께 표시합니다. 앱마다 처리하는 정보가 다르므로 각 앱의 개별 방침을 적용합니다.</p></LegalSection>
        </>}

        {isTerms && <>
          <LegalSection title="서비스의 성격"><p>{app.name}는 현재 개발과 검증이 함께 진행되는 소프트웨어입니다. 기능과 지원 범위는 플랫폼과 버전에 따라 다를 수 있으며 현재 페이지의 상태 표시를 기준으로 안내합니다.</p></LegalSection>
          <LegalSection title="사용자의 책임"><p>사용자는 자신이 접근 권한을 가진 파일과 서비스만 이용해야 하며, 외부 음원·사진·영상·서버 자료의 권리와 백업을 직접 확인해야 합니다.</p></LegalSection>
          <LegalSection title="보증과 책임 범위"><p>데이터 손실 가능성이 있는 파일 작업이나 테스트 기능을 사용하기 전에 중요한 자료를 별도로 백업해야 합니다. 앱은 의료·안전 진단이나 무중단 저장 서비스를 보증하지 않습니다.</p></LegalSection>
        </>}

        {isDeletion && <>
          <LegalSection title="외부 계정 연결 해제"><ol><li>{app.name}의 설정 또는 연결 목록을 엽니다.</li><li>연결된 계정이나 저장소를 선택합니다.</li><li>연결 삭제 또는 로그아웃을 선택합니다.</li><li>필요하면 해당 서비스의 계정 보안 페이지에서도 앱 접근 권한을 취소합니다.</li></ol></LegalSection>
          <LegalSection title="기기 데이터 삭제"><p>받은 파일, 다운로드, 썸네일과 기타 캐시는 앱 안의 관리 메뉴에서 삭제합니다. 모든 로컬 데이터를 제거하려면 내보낸 결과물을 먼저 확인한 뒤 앱을 삭제할 수 있습니다.</p></LegalSection>
          <LegalSection title="도움이 필요한 경우"><p>아래 GitHub 공개 문의 경로를 이용하되 계정 정보, 서버 주소, 파일명과 화면 속 개인정보는 가려 주세요.</p></LegalSection>
        </>}

        {!isPrivacy && !isTerms && !isDeletion && <>
          <LegalSection title="먼저 확인할 내용"><ul><li>앱과 운영체제를 최신 버전으로 업데이트합니다.</li><li>필요한 권한과 네트워크 연결 상태를 확인합니다.</li><li>앱을 완전히 종료한 뒤 다시 실행합니다.</li><li>같은 문제가 반복되면 재현 단계를 기록합니다.</li></ul></LegalSection>
          <LegalSection title="오류를 알려주실 때"><p>앱 버전, 기기와 운영체제, 사용한 기능, 재현 단계와 예상한 결과를 적어 주세요. 화면이나 로그에 계정·서버·파일 등 개인 정보가 있다면 반드시 가려 주세요.</p></LegalSection>
          <div className="support-options">
            {app.github.map((url) => <Link className="button button-primary" href={`${url}/issues`} key={url}>GitHub에 제보하기 <span aria-hidden="true">↗</span></Link>)}
            <ContactReveal />
          </div>
        </>}
        <p className="policy-note">시행일: 2026년 8월 14일 · 마지막 변경일: 2026년 8월 14일</p>
      </article>
      <SiteFooter />
    </main>
  );
}

function LegalSection({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="legal-section"><h2>{title}</h2><div>{children}</div></section>;
}

function GoogleOAuthPage() {
  return (
    <main className="info-page theme-violet" lang="en">
      <SiteHeader />
      <article className="legal-shell shell oauth-disclosure">
        <Link className="breadcrumb" href="/apps/nasfinder">← Back to NasFinder</Link>
        <p className="eyebrow">GOOGLE API DISCLOSURE</p>
        <h1>Google API Use &amp; Data Handling</h1>
        <p className="legal-intro">This concise English page supports Google OAuth review. NasFinder.com remains a Korean-first website; the full privacy notice is available in Korean.</p>

        <LegalSection title="Product purpose"><p>NasFinder is a native file browser for iPhone and iPad. It helps users browse their own storage services, preview media, and move or share files they choose.</p></LegalSection>
        <LegalSection title="Google Drive"><p>NasFinder currently includes a Google Drive connection for user-requested file browsing and file operations. The exact production scope and verification status will be published before this connection is offered through a public production build.</p></LegalSection>
        <LegalSection title="Google Photos Picker"><p>Google Photos support is planned but is not yet publicly available. The intended flow opens Google Photos Picker, lets the user explicitly select media, and imports only those selected items for preview, download, sharing, or transfer to a destination chosen by the user. NasFinder will not browse or recreate the user&apos;s complete Google Photos library.</p></LegalSection>
        <LegalSection title="Storage and sharing"><p>Credentials and OAuth tokens are designed to be stored in the device Keychain. Selected or downloaded media may be cached on the user&apos;s device to complete the requested operation. NasFinder will not sell Google user data or use it for advertising. Data is shared only when the user starts a transfer or share action to a destination they choose.</p></LegalSection>
        <LegalSection title="Limited Use"><p>NasFinder&apos;s use and transfer of information received from Google APIs will adhere to the <Link className="inline-link" href="https://developers.google.com/terms/api-services-user-data-policy">Google API Services User Data Policy</Link>, including the Limited Use requirements.</p></LegalSection>
        <LegalSection title="Control and deletion"><p>Users can remove a Google connection in NasFinder and revoke NasFinder&apos;s access from their Google Account. Locally downloaded files and caches can be deleted in the app; exported files must be deleted from their destination separately.</p><p><Link className="inline-link" href="/apps/nasfinder/data-deletion">Open connection removal and data deletion instructions</Link></p></LegalSection>

        <div className="oauth-links">
          <Link className="button button-primary" href="/apps/nasfinder/privacy">Korean privacy notice</Link>
          <Link className="button button-quiet" href="/apps/nasfinder/support">Support</Link>
        </div>
        <p className="policy-note">Draft for implementation and OAuth review readiness · Last reviewed August 14, 2026</p>
      </article>
      <SiteFooter />
    </main>
  );
}
