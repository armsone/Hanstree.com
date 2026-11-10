import Image from "./SiteImage";
import Link from "next/link";
import { SiteHeader, SiteFooter } from "./SiteChrome";
import { ReleaseLink, ReleaseVersion } from "./ReleasePlatform";
import type { AppData, Platform } from "../data";
import styles from "./HanToolMagazine.module.css";

// --------------------------------------------------------------------------
// Helper: Platform Extractors
// --------------------------------------------------------------------------

function getMacPlatform(app: AppData): Platform {
  return (
    app.platforms.find((p) => p.name === "Mac" || p.name.includes("Mac")) ??
    app.platforms[0] ?? {
      name: "Mac",
      status: "공개",
      detail: "1.27.0 · macOS 15.4+ · Apple Silicon(arm64) 전용, Intel 미지원",
      downloadLabel: "한툴 Mac용 받기",
    }
  );
}

function getWindowsPlatform(app: AppData): Platform | undefined {
  return app.platforms.find((p) => p.name.includes("Windows"));
}

// --------------------------------------------------------------------------
// Component 1: HanToolCover
// Reusable cover section for homepage with ONE h1 and flagship CTA
// --------------------------------------------------------------------------

export function HanToolCover({ app }: { app: AppData }) {
  const mac = getMacPlatform(app);
  const windows = getWindowsPlatform(app);

  return (
    <section id="hantool-cover" className={styles.coverSection} aria-label="한툴 플래그십 커버">
      <div className={styles.editorialShell}>
        {/* Top Masthead Band */}
        <header className={styles.coverMasthead}>
          <span className={styles.coverMastheadBrand}>HANSTREE TOOLS · ISSUE 01</span>
          <span className={styles.coverMastheadIssue}>FLAGSHIP MAC WORKSPACE · 2026</span>
        </header>

        {/* Hero Grid */}
        <div className={styles.coverHeroGrid}>
          {/* Left Column: Lead and Action */}
          <div className={styles.coverLeadColumn}>
            <div className={styles.coverEyebrowRow}>
              {app.icon && (
                <div className={styles.coverIconWrap}>
                  <Image
                    src={app.icon}
                    alt={`${app.name} 공식 앱 아이콘`}
                    width={88}
                    height={88}
                    className={styles.coverIcon}
                    priority
                  />
                </div>
              )}
              <span className={styles.monoTag}>HANSTREE TOOLS / FEATURE ISSUE</span>
            </div>

            {/* ONE H1 for Cover */}
            <h1 className={styles.coverTitle}>
              <span className={styles.coverTitleSub}>한 창에서, 일의 흐름을 잇다.</span>
              <span className={styles.coverTitleMain}>한툴 HanTool</span>
            </h1>

            <p className={styles.coverLede}>
              브라우저 탐색부터 화면·메일 제자리 번역, AI 비서 협업, 플래너 작업 위임, 그리고
              선택형 서버 모니터링까지. 창과 앱을 오가며 흐름이 끊기던 일상을 하나의 완결된
              작업 창으로 잇는 한스트리의 Mac 플래그십입니다.
            </p>

            {/* Action CTAs */}
            <div className={styles.coverCtaGroup}>
              <ReleaseLink
                platform={mac}
                className={styles.primaryCta}
              />
              <Link href="/apps/hantool" className={styles.secondaryCta}>
                매거진 자세히 읽어보기 <span aria-hidden="true">→</span>
              </Link>
            </div>

            {/* Quick Meta Specs */}
            <div className={styles.coverMetaSpecs}>
              <div className={styles.metaSpecItem}>
                <span className={styles.metaSpecLabel}>현재 제공 (Mac)</span>
                <span className={styles.metaSpecValue}>macOS 15.4+ · Apple Silicon 전용</span>
              </div>
              <div className={styles.metaSpecItem}>
                <span className={styles.metaSpecLabel}>향후 예정 (Windows)</span>
                <span className={styles.metaSpecValue}>
                  {windows ? windows.detail : "새 디자인 기획 중 (출시일 추후 안내)"}
                </span>
              </div>
              <div className={styles.metaSpecItem}>
                <span className={styles.metaSpecLabel}>인증 및 보안</span>
                <span className={styles.metaSpecValue}>Developer ID 서명 · Apple 공증</span>
              </div>
              <div className={styles.metaSpecItem}>
                <span className={styles.metaSpecLabel}>현재 공개 버전</span>
                <span className={styles.metaSpecValue}>
                  공식 릴리스
                  <ReleaseVersion platform={mac} appSlug={app.slug} />
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Large Real Screenshot */}
          <div className={styles.coverVisualColumn}>
            <figure className={styles.realScreenshotFigure}>
              <Image
                src="/apps/hantool/screens/tools.png"
                alt="한툴 실제 실행 화면 · 1.27 통합 작업 창과 주요 도구"
                width={1800}
                height={1132}
                sizes="(max-width: 800px) 100vw, 680px"
                className={styles.screenshotImage}
                priority
              />
              <figcaption className={styles.screenshotCaption}>
                <span className={styles.screenshotTag}>
                  <span className={styles.screenshotTagDot} aria-hidden="true" />
                  실제 한툴 Mac 화면 · 1.27 작업 창
                </span>
                <span>실제 설치본 화면 · macOS 15.4+</span>
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}

// --------------------------------------------------------------------------
// Component 2: HanToolPage
// Complete detailed product magazine page with SiteHeader, article (ONE h1), and SiteFooter
// --------------------------------------------------------------------------

export async function HanToolPage({ app }: { app: AppData }) {
  const mac = getMacPlatform(app);
  const windows = getWindowsPlatform(app);

  return (
    <>
      <SiteHeader currentPageName={app.name} />

      <article id="top" className={styles.magazineArticle}>
        {/* Magazine Cover & Hero Header */}
        <header className={styles.magazineHeader}>
          <div className={styles.editorialShell}>
            <div className={styles.magazineHeaderMeta}>
              <span>HANSTREE FLAGSHIP MAC WORKSPACE</span>
              <span>VOL. 01 · 2026 EDITORIAL EDITION</span>
              <span>HANTOOL · HANSTREE TOOLS</span>
            </div>

            {/* ONE H1 for Magazine Page */}
            <h1 className={styles.magazineMainTitle}>
              한툴 HanTool
              <span>Mac의 일을, 한 창에서.</span>
            </h1>

            <p className={styles.magazineSubheadline}>
              브라우저에서 시작해 화면·메일 번역, AI 비서 사이드 패널, 플래너 작업 위임, 다운로드,
              그리고 Mac 관리와 선택형 서버 현황까지. 여러 창으로 흩어지던 작업 흐름을 하나의 창으로
              단정하게 모았습니다.
            </p>

            {/* Prominent Primary CTA (Visible within first mobile screen) */}
            <div className={styles.magazineHeroCtaRow}>
              <div className={styles.magazineHeroCtaGroup}>
                <ReleaseLink
                  platform={mac}
                  className={styles.primaryCta}
                />
                <a href="#chapter-08" className={styles.secondaryCta}>
                  처음 시작하기 <span aria-hidden="true">↓</span>
                </a>
              </div>
              <p className={styles.magazineHeroCtaMeta}>
                macOS 15.4+ · Apple Silicon 전용
              </p>
            </div>

            <div className={styles.magazineHeroGrid}>
              <figure className={styles.magazineHeroCard}>
                <Image
                  src="/apps/hantool/screens/tools.png"
                  alt="한툴 실제 실행 화면 · 1.27 통합 작업 창과 주요 도구"
                  width={1800}
                  height={1132}
                  sizes="(max-width: 800px) 100vw, 760px"
                  className={styles.screenshotImage}
                  priority
                />
                <figcaption className={styles.screenshotCaption}>
                  <span className={styles.screenshotTag}>
                    <span className={styles.screenshotTagDot} aria-hidden="true" />
                    실제 한툴 Mac 화면 · 1.27 작업 창
                  </span>
                  <span>단일 창 통합 작업대 · 실제 설치본 화면</span>
                </figcaption>
              </figure>

              <aside className={styles.magazineHeroSidebar}>
                <h2 className={styles.manifestoHeading}>플래그십의 설계 약속</h2>
                <p className={styles.manifestoText}>
                  도구가 늘어날수록 Mac 화면은 창과 아이콘으로 번잡해집니다. 한툴은 필요한 도구를
                  별도 창으로 띄우지 않고, 왼쪽 사이드바와 메뉴 막대에서 한 번의 조작으로 전환할 수
                  있도록 설계되었습니다.
                </p>

                <ul className={styles.badgeList}>
                  <li className={styles.badgeItem}>
                    <span className={styles.badgeBullet} aria-hidden="true" />
                    <span><strong>단일 앱 창</strong>: 브라우저와 도구를 한 호흡으로 전환</span>
                  </li>
                  <li className={styles.badgeItem}>
                    <span className={styles.badgeBullet} aria-hidden="true" />
                    <span><strong>온디바이스 우선</strong>: 타이핑과 캡처를 로컬에서 처리</span>
                  </li>
                  <li className={styles.badgeItem}>
                    <span className={styles.badgeBullet} aria-hidden="true" />
                    <span><strong>안전한 자원 관리</strong>: 확인 없는 자동 삭제 배제</span>
                  </li>
                  <li className={styles.badgeItem}>
                    <span className={styles.badgeBullet} aria-hidden="true" />
                    <span><strong>공식 서명 및 공증</strong>: Apple Developer ID 완료</span>
                  </li>
                </ul>

                <div className={styles.sidebarDownloadBox}>
                  <div className={styles.sidebarDownloadHeader}>
                    <span className={styles.sidebarDownloadVersion}>
                      공식 릴리스
                      <ReleaseVersion platform={mac} appSlug={app.slug} />
                    </span>
                  </div>
                  <ReleaseLink
                    platform={mac}
                    className={styles.primaryCta}
                  />
                  <small className={styles.sidebarDownloadMeta}>
                    macOS 15.4+ · Apple Silicon 전용 (Intel 미지원)
                  </small>
                </div>
              </aside>
            </div>
          </div>
        </header>

        {/* Linear Chapter Index (OBYS style) */}
        <section className={styles.indexSection} aria-label="기사 목차">
          <div className={styles.editorialShell}>
            <div className={styles.indexHeader}>
              <h2 className={styles.indexHeaderTitle}>목차 · 10개의 핵심 장</h2>
              <span className={styles.monoTag}>TABLE OF CONTENTS</span>
            </div>

            <ol className={styles.indexGrid}>
              <li className={styles.indexRow}>
                <span className={styles.indexRowNumber}>01</span>
                <Link href="#chapter-01" className={styles.indexRowTitle}>
                  왜 하나의 작업 공간인가: 분절을 잇는 단일 창
                </Link>
                <span className={styles.indexRowJump}>p.01 ↗</span>
              </li>
              <li className={styles.indexRow}>
                <span className={styles.indexRowNumber}>02</span>
                <Link href="#chapter-02" className={styles.indexRowTitle}>
                  6대 핵심 내비게이션과 나에게 맞는 작업 창
                </Link>
                <span className={styles.indexRowJump}>p.02 ↗</span>
              </li>
              <li className={styles.indexRow}>
                <span className={styles.indexRowNumber}>03</span>
                <Link href="#chapter-03" className={styles.indexRowTitle}>
                  통합 브라우저: 검색, 정돈, 그리고 화면 제어
                </Link>
                <span className={styles.indexRowJump}>p.03 ↗</span>
              </li>
              <li className={styles.indexRow}>
                <span className={styles.indexRowNumber}>04</span>
                <Link href="#chapter-04" className={styles.indexRowTitle}>
                  보던 자리 그대로, 화면·메일·브라우저 제자리 번역
                </Link>
                <span className={styles.indexRowJump}>p.04 ↗</span>
              </li>
              <li className={styles.indexRow}>
                <span className={styles.indexRowNumber}>05</span>
                <Link href="#chapter-05" className={styles.indexRowTitle}>
                  AI 비서 사이드 패널과 플래너 업무 위임
                </Link>
                <span className={styles.indexRowJump}>p.05 ↗</span>
              </li>
              <li className={styles.indexRow}>
                <span className={styles.indexRowNumber}>06</span>
                <Link href="#chapter-06" className={styles.indexRowTitle}>
                  똑똑한 입력 도우미와 안전한 Mac 자원 관리
                </Link>
                <span className={styles.indexRowJump}>p.06 ↗</span>
              </li>
              <li className={styles.indexRow}>
                <span className={styles.indexRowNumber}>07</span>
                <Link href="#chapter-07" className={styles.indexRowTitle}>
                  다운로드 매니저와 선택형 서버 현황 모니터
                </Link>
                <span className={styles.indexRowJump}>p.07 ↗</span>
              </li>
              <li className={styles.indexRow}>
                <span className={styles.indexRowNumber}>08</span>
                <Link href="#chapter-08" className={styles.indexRowTitle}>
                  실전 빠른 시작과 단축키 레퍼런스
                </Link>
                <span className={styles.indexRowJump}>p.08 ↗</span>
              </li>
              <li className={styles.indexRow}>
                <span className={styles.indexRowNumber}>09</span>
                <Link href="#chapter-09" className={styles.indexRowTitle}>
                  플랫폼 생태계: Mac 플래그십과 바로보기의 관계
                </Link>
                <span className={styles.indexRowJump}>p.09 ↗</span>
              </li>
              <li className={styles.indexRow}>
                <span className={styles.indexRowNumber}>10</span>
                <Link href="#chapter-10" className={styles.indexRowTitle}>
                  자주 묻는 질문(FAQ), 개인정보 원칙과 공식 저장소
                </Link>
                <span className={styles.indexRowJump}>p.10 ↗</span>
              </li>
            </ol>
          </div>
        </section>

        {/* ------------------------------------------------------------------
            Chapter 01
            ------------------------------------------------------------------ */}
        <section id="chapter-01" className={styles.chapterBlock}>
          <div className={styles.editorialShell}>
            <header className={styles.chapterHeader}>
              <span className={styles.chapterNumber}>CHAPTER 01</span>
              <h2 className={styles.chapterTitle}>왜 하나의 작업 공간인가: 분절을 잇는 단일 창</h2>
              <p className={styles.chapterSubtitle}>
                브라우저에서 자료를 찾다가, 외국어를 만나면 번역 창을 열고, 생각을 정리하려 AI 창을
                띄우고, 작업을 기록하려 플래너를 켜던 일상. 한툴은 이 모든 분절을 단 하나의 창 안에서
                해결합니다.
              </p>
            </header>

            <div className={styles.spreadGrid}>
              <div className={styles.proseColumn}>
                <p>
                  현대적인 Mac 사용자의 작업 흐름은 수많은 창 사이에 갇혀 있습니다. 웹에서 자료를 찾다가
                  외국어 논문이나 기사를 만나면 화면 번역 프로그램을 켜야 하고, 질문이 떠오르면 별도의
                  AI 챗봇 브라우저 탭을 열어야 합니다. AI가 제안한 실행 과제를 기록하기 위해 다시 할 일
                  관리 앱을 열고, 내려받은 문서를 찾으러 다운로드 폴더를 뒤적이며, Mac이 느려지면 개발 잔여물을
                  정리하려 터미널이나 유틸리티를 실행합니다.
                </p>
                <p>
                  창과 창 사이를 끊임없이 오가는 동안 집중력은 분산되고, 화면 위에는 닫히지 않은 창들이
                  켜켜이 쌓여 갑니다. <strong>한툴(HanTool)</strong>은 바로 이 흩어진 일의 조각들을 하나의
                  완결된 맥락으로 묶기 위해 탄생했습니다.
                </p>
                <div className={styles.editorialPullquote}>
                  <p className={styles.pullquoteText}>
                    “창을 바꾸지 않고도 조사에서 번역, 비서 대화, 할 일 위임, 정리까지 이어지는 것.
                    단일 작업창이 주는 가장 큰 가치는 사라졌던 작업의 연속성을 되찾는 일입니다.”
                  </p>
                  <span className={styles.pullquoteCitation}>— 한스트리 도구 설계 원칙</span>
                </div>
              </div>

              <div className={styles.proseColumn}>
                <p>
                  메뉴 막대 아이콘을 누르거나 단축키(기본 Command 두 번 연타 또는 ⇧⌃⌥⌘B)를 누르면 하나의
                  단정한 통합 작업 창이 나타납니다. 창을 열었을 때 가장 먼저 마주하는 것은 광활하고 빠른
                  통합 브라우저입니다. 여기서 왼쪽 사이드바를 통해 한 번의 탭으로 다운로드 내역, 플래너,
                  AI 비서, 그리고 시스템 도구로 전환할 수 있습니다.
                </p>
                <p>
                  각 기능은 흩어진 개별 프로세스가 아니라 단일 앱 번들 안에서 긴밀하게 신호를 주고받습니다.
                  브라우저에서 보던 페이지를 비서에게 즉시 요약해 달라고 요청할 수 있고, 비서와의 대화
                  내용을 그 자리에서 플래너 작업으로 넘길 수 있습니다. 창을 닫아도 메뉴 막대에서 가볍게
                  대기하므로 Mac의 시스템 자원을 낭비하지 않습니다.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------------
            Chapter 02
            ------------------------------------------------------------------ */}
        <section id="chapter-02" className={styles.chapterBlock}>
          <div className={styles.editorialShell}>
            <header className={styles.chapterHeader}>
              <span className={styles.chapterNumber}>CHAPTER 02</span>
              <h2 className={styles.chapterTitle}>6대 핵심 내비게이션과 나에게 맞는 작업 창</h2>
              <p className={styles.chapterSubtitle}>
                브라우저 · 다운로드 · 플래너 · 비서 · 도구 · 서버 현황. 직관적인 6대 목적지와 5가지 테마,
                3가지 아이콘 스타일을 사용자 취향대로 조합합니다.
              </p>
            </header>

            <div className={styles.spreadGrid}>
              <div className={styles.proseColumn}>
                <p>
                  한툴 작업 창의 왼쪽 사이드바는 일의 흐름에 맞춰 엄격하게 6개의 핵심 목적지로
                  정리되었습니다.
                </p>
                <ul style={{ paddingLeft: "20px", margin: "8px 0", lineHeight: "1.8" }}>
                  <li><strong>브라우저</strong>: 작업의 시작점. 탭 관리, 검색 별칭, 북마크, 광고 차단.</li>
                  <li><strong>다운로드</strong>: 현재 진행 중인 전송과 완료된 파일 내역을 한눈에 점검.</li>
                  <li><strong>플래너</strong>: 비서로부터 전달받은 프로젝트 작업 및 실행 보고서 관리.</li>
                  <li><strong>비서</strong>: 지능형 어시스턴트 하나(Hana)와 엄선된 AI 사이드 패널.</li>
                  <li><strong>도구</strong>: 화면·메일 번역, 입력 도우미(인풋메이트), Mac 안전 관리(BTN).</li>
                  <li><strong>서버 현황</strong>: 필요할 때만 켜는 홈 서버 및 개인 NAS 상태 점검.</li>
                </ul>
                <p>
                  이 모든 화면 아래에는 환경설정과 앱 안에서 바로 읽을 수 있는 공식 가이드가 자리합니다.
                </p>
              </div>

              <div className={styles.proseColumn}>
                <h3 style={{ margin: "0 0 10px", fontSize: "1.1rem" }}>나에게 맞는 작업 창과 아이콘 스타일</h3>
                <p>
                  한툴은 작업 환경의 조도와 취향에 맞춰 <strong>5가지 테마</strong>를 지원합니다.
                  시스템 다크모드를 따르는 <em>자동</em>, 깨끗한 <em>라이트</em>, 금빛과 청동이 어우러진 <em>프라이데이(Friday)</em>,
                  미래적인 사이버 감성의 <em>자비스(Jarvis)</em>, 그리고 짙은 흑요석 톤의 <em>울트론(Ultron)</em> 중에서 고를 수 있습니다.
                </p>
                <p>
                  여기에 더해 아이콘의 질감도 테마와 독립적으로 <strong>3가지 스타일</strong>(단정한 심플,
                  입체감이 살아있는 입체, 정교한 실물 질감의 리얼) 중 하나를 선택해 저장할 수 있습니다.
                  어떤 조합을 선택하든 가독성과 대비를 엄격하게 유지합니다.
                </p>
              </div>
            </div>

            <div className={styles.editorialCardGrid}>
              <div className={styles.editorialCard}>
                <span className={styles.cardCategory}>THEME 01</span>
                <h4 className={styles.cardHeading}>자동 & 라이트 (Light)</h4>
                <p className={styles.cardBody}>종이와 잉크의 부드러운 대비. 낮 시간이나 밝은 조명 아래 문서 작성에 최적화되었습니다.</p>
              </div>
              <div className={styles.editorialCard}>
                <span className={styles.cardCategory}>THEME 02</span>
                <h4 className={styles.cardHeading}>프라이데이 & 자비스</h4>
                <p className={styles.cardBody}>은은한 금빛 라인과 차분한 네이비 톤. 장시간 집중하는 개발과 연구에 눈의 피로를 덜어줍니다.</p>
              </div>
              <div className={styles.editorialCard}>
                <span className={styles.cardCategory}>THEME 03</span>
                <h4 className={styles.cardHeading}>울트론 (Ultron)</h4>
                <p className={styles.cardBody}>절제된 모노크롬 다크. OLED 디스플레이와 야간 작업에서 최소한의 빛만을 남깁니다.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------------
            Chapter 03
            ------------------------------------------------------------------ */}
        <section id="chapter-03" className={styles.chapterBlock}>
          <div className={styles.editorialShell}>
            <header className={styles.chapterHeader}>
              <span className={styles.chapterNumber}>CHAPTER 03</span>
              <h2 className={styles.chapterTitle}>통합 브라우저: 검색, 정돈, 그리고 화면 제어</h2>
              <p className={styles.chapterSubtitle}>
                주소창 단축 별칭, 슬래시(/) 명령어, 최대 4열 즐겨찾기, 광고 영역 수동 숨김, 그리고
                선택·스크롤 PNG 캡처까지. 매일 쓰는 브라우징의 군더더기를 걷어냈습니다.
              </p>
            </header>

            <div className={styles.spreadGrid}>
              <div className={styles.proseColumn}>
                <h3 style={{ margin: "0 0 8px", fontSize: "1.1rem" }}>주소창 검색 별칭과 길찾기</h3>
                <p>
                  주소창에 일반 URL을 넣으면 페이지를 열지만, 등록해 둔 이름(별칭)을 치면 즉시 해당 사이트로
                  이동하거나 검색을 수행합니다. 기본 10개의 등록 이름(별칭)을 제공하며, 일반 검색어는 구글·네이버·유튜브 중
                  골라 원하는 검색어를 덧붙여 바로 탐색할 수 있습니다.
                </p>
                <p>
                  주소창에 <code>/</code>를 입력하면 사용 가능한 모든 명령어와 비서 호출 단축어가 한눈에
                  펼쳐집니다. 특히 네이버 지도 길찾기 명령어가 기본 내장되어 있어, <code>길찾기 부산역</code>(현재
                  위치에서 출발) 또는 <code>길찾기 서울역, 부산역</code>을 입력하면 지도 앱이나 복잡한 검색 없이도
                  자동차 경로로 즉시 연결됩니다.
                </p>
                <div className={styles.editorialPullquote}>
                  <p className={styles.pullquoteText}>
                    “불필요한 클릭을 줄이고 키보드 몇 타로 원하는 정보에 도달하는 것. 한툴 브라우저의
                    모든 조작은 불필요한 마우스 이동을 최소화하도록 설계되었습니다.”
                  </p>
                </div>
              </div>

              <div className={styles.proseColumn}>
                <h3 style={{ margin: "0 0 8px", fontSize: "1.1rem" }}>광고 차단과 수동 영역 숨김 규칙</h3>
                <p>
                  통합 브라우저는 기사 본문을 가리는 광고를 똑똑하게 차단합니다. 만약 특정 사이트에서
                  차단기를 우회하는 광고가 나타나면, 상단 광고 표시를 눌러 원하는 영역을 직접 클릭해
                  숨길 수 있습니다. 직접 지정한 숨김 규칙은 같은 호스트(Host)의 다른 페이지에서도
                  기억되어 다시 보이지 않습니다.
                </p>
                <h3 style={{ margin: "16px 0 8px", fontSize: "1.1rem" }}>화면 캡처와 스크롤 PNG 저장</h3>
                <p>
                  주소창 옆 카메라 버튼을 누르면 보이는 영역을 정밀하게 자르거나, 스크롤되는 페이지 전체를
                  이어 붙여 고해상도 PNG 파일로 저장합니다. 저장 전 미리보기에서 화살표 키로 영역을 1px 단위로
                  맞출 수 있으며, 필요한 경우 너비 맞춤을 지정해 원하는 크기로 저장할 수 있습니다.
                </p>
                <p style={{ fontSize: "0.82rem", color: "var(--muted, #6e6d65)" }}>
                  ※ 솔직한 한계 안내: 모든 사이트의 특수 DRM 콘텐츠나 로그인 보안 페이지의 동작을 100% 보장하지는 않습니다.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------------
            Chapter 04
            ------------------------------------------------------------------ */}
        <section id="chapter-04" className={styles.chapterBlock}>
          <div className={styles.editorialShell}>
            <header className={styles.chapterHeader}>
              <span className={styles.chapterNumber}>CHAPTER 04</span>
              <h2 className={styles.chapterTitle}>보던 자리 그대로, 화면·메일·브라우저 제자리 번역</h2>
              <p className={styles.chapterSubtitle}>
                캡처한 글자 위에 번역문을 그대로 덧씌우는 바로보기 엔진. 문자 인식과 기본 번역은 Mac
                온디바이스 로컬 처리를 원칙으로 하며, 외부 번역 서비스는 명시적 사용자 동의 시에만 인식된
                텍스트를 전달합니다.
              </p>
            </header>

            <div className={styles.spreadGrid}>
              <div className={styles.proseColumn}>
                <h3 style={{ margin: "0 0 8px", fontSize: "1.1rem" }}>화면 지정 영역 제자리 번역</h3>
                <p>
                  화면 번역 단축키(⌃⌥⇧⌘T)를 누르면 한툴 작업 창이 화면 밖으로 잠시 비켜서며 캡처 십자선이
                  나타납니다. 번역하고 싶은 화면 영역을 드래그하면, 그 영역 속 글자를 즉시 인식해
                  <strong>원래 글자가 있던 정확한 줄 위치 위에 번역문을 오버레이</strong>합니다.
                </p>
                <p>
                  Space나 Enter 키를 누르면 원문과 번역문이 번갈아 전환되어 원문 대조가 놀랍도록 쉽습니다.
                  주기적으로 화면을 몰래 캡처하지 않으며, 사용자가 번역 버튼을 누른 바로 그 순간에만
                  단회성으로 캡처를 수행합니다.
                </p>

                <h3 style={{ margin: "16px 0 8px", fontSize: "1.1rem" }}>Apple Mail 서식 유지 번역</h3>
                <p>
                  Apple Mail에서 수신한 영문이나 일문 메일을 선택하고 단축키(⌃⌥⇧⌘M)를 누르면, 한툴의 메일 번역
                  화면이 앞으로 전환되며 메일의 제목, 본문 줄바꿈, 표 서식을 원본 그대로 보존한 채 번역문을
                  나란히 비교해 줍니다. 창을 닫으면 메일 본문은 메모리에서 즉시 안전하게 파기됩니다.
                </p>
              </div>

              <div className={styles.proseColumn}>
                <h3 style={{ margin: "0 0 8px", fontSize: "1.1rem" }}>엄격한 번역 프라이버시 원칙</h3>
                <p>
                  한툴의 기본 번역 엔진은 Mac 내부에서 실행되는 <strong>온디바이스 로컬 모델</strong>입니다.
                  문자 인식(OCR)과 기본 번역 모두 외부 서버로 전송하지 않고 Mac 기기 안에서
                  처리됩니다.
                </p>
                <p>
                  더 정교한 번역을 위해 구글(Google)이나 딥플(DeepL) 서비스를 선택할 경우, 최초 1회 명시적인
                  외부 전송 동의를 거칩니다. 동의하더라도 스크린샷이나 이미지는 전송되지 않으며,
                  인식된 글자 텍스트만 해당 공식 서비스로 전달됩니다. 이 동의는 설정에서 언제든
                  클릭 한 번으로 철회할 수 있습니다.
                </p>
                <p>
                  또한 macOS 26 이상 Apple Intelligence 호환 기기에서는 온디바이스 지능을 통한 한국어 표현 다듬기를 지원합니다. 결과를 확인한 뒤 사용하세요.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------------
            Chapter 05
            ------------------------------------------------------------------ */}
        <section id="chapter-05" className={styles.chapterBlock}>
          <div className={styles.editorialShell}>
            <header className={styles.chapterHeader}>
              <span className={styles.chapterNumber}>CHAPTER 05</span>
              <h2 className={styles.chapterTitle}>AI 비서 사이드 패널과 플래너 업무 위임</h2>
              <p className={styles.chapterSubtitle}>
                브라우저와 함께 열리는 AI 비서 사이드바. 대화 도중 “이건 플래너에게 맡겨줘”라고 말하면
                현재 보고 있는 페이지를 바탕으로 독립 프로젝트가 생성되고 결과 보고서가 돌아옵니다.
              </p>
            </header>

            <div className={styles.spreadGrid}>
              <div className={styles.proseColumn}>
                <h3 style={{ margin: "0 0 8px", fontSize: "1.1rem" }}>브라우저와 비서의 공존</h3>
                <p>
                  통합 브라우저 상단의 비서 메뉴를 누르면 웹 화면 오른쪽에 지능형 비서 사이드 패널이
                  부드럽게 열립니다. 나스 전용 어시스턴트인 <strong>하나(Hana)</strong>를 비롯해 Claude,
                  Gemini 등 엄선된 AI 서비스(기본값은 모두 꺼짐)를 원하는 것만 골라 켤 수 있습니다.
                </p>
                <p>
                  패널 경계선을 드래그해 너비를 자유롭게 조절할 수 있으며, 패널 작업 중 <code>⌘W</code>를 누르면
                  왼쪽 웹페이지는 그대로 유지한 채 비서 패널만 깔끔하게 닫힙니다. 또한 상단의 '페이지 요약'을
                  누르면 현재 보고 있는 웹페이지의 본문 텍스트를 첨부해 질문 초안을 작성해 줍니다.
                </p>
              </div>

              <div className={styles.proseColumn}>
                <h3 style={{ margin: "0 0 8px", fontSize: "1.1rem" }}>플래너 업무 위임과 로컬 보고서</h3>
                <p>
                  비서와 긴 대화를 나누다 실행 과제가 도출되면, 채팅창에 <strong>“이건 플래너에게 맡겨줘”</strong>라고
                  직접 보내 보세요. 한툴은 현재 대화 맥락과 열려 있는 페이지 정보를 종합해 플래너 화면에
                  새 작업을 자동으로 등록합니다.
                </p>
                <p>
                  플래너가 완결한 작업 결과 보고서는 사용자가 지정한 Mac의 로컬 폴더에 깔끔한 Markdown 파일로
                  저장되며, 작업이 끝나면 처음 대화했던 비서 채팅방으로 완료 알림과 링크가 돌아옵니다.
                </p>
                <p style={{ fontSize: "0.82rem", color: "var(--muted, #6e6d65)" }}>
                  ※ 솔직한 한계 안내: 사용자가 직접 일시정지하거나 취소한 작업은 자동 재개되지 않으며, 비인가된
                  사이트 임의 자율 클릭이나 무제한 백그라운드 크롤링을 수행하지 않습니다.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------------
            Chapter 06
            ------------------------------------------------------------------ */}
        <section id="chapter-06" className={styles.chapterBlock}>
          <div className={styles.editorialShell}>
            <header className={styles.chapterHeader}>
              <span className={styles.chapterNumber}>CHAPTER 06</span>
              <h2 className={styles.chapterTitle}>똑똑한 입력 도우미와 안전한 Mac 자원 관리</h2>
              <p className={styles.chapterSubtitle}>
                앱별 입력 언어 자동 전환, 실시간 오타 교정, 작은따옴표 수동 변환과 3단 개인 사전,
                그리고 타이핑 트랙패드 잠금과 휴지통 기반 Mac 안전 정리.
              </p>
            </header>

            <div className={styles.spreadGrid}>
              <div className={styles.proseColumn}>
                <h3 style={{ margin: "0 0 8px", fontSize: "1.1rem" }}>인풋메이트: 쾌적한 타이핑 경험</h3>
                <p>
                  터미널에서는 늘 영어로, 메신저에서는 늘 한글로 시작하고 싶었던 사용자라면 앱별 입력 언어
                  자동 선택 기능이 반가울 것입니다. 앱을 전환할 때마다 기억된 기본 입력 소스로 자동 변경되며,
                  사용자가 앱 안에서 수동으로 바꾼 언어는 전환 전까지 그대로 존중됩니다.
                </p>
                <p>
                  US 자판에서 실수로 한글을 영타로 쳤을 때, 공백을 누르지 않아도 온디바이스 지능이 실시간으로
                  한영 의도를 판별해 글자를 조합해 줍니다. 단어 바로 뒤에 <code>''</code>(작은따옴표 두 번)를 치면
                  앞 단어를 즉시 영어 또는 한글로 수동 변환하며, 성공한 단어는 이 Mac에만 저장되는 <strong>개인 사전</strong>에
                  보관됩니다.
                </p>
                <p>
                  또한 타이핑 중 손바닥이 트랙패드에 닿아 커서가 튀는 현상을 막기 위해, 키보드 입력이 시작되면
                  트랙패드 클릭과 이동을 즉시 잠그고 입력 1초 후 또는 설정된 초록 영역을 터치했을 때 즉시 해제합니다.
                  (긴급 해제 단축키: <code>⌃⌥⌘⎋</code>)
                </p>
              </div>

              <div className={styles.proseColumn}>
                <h3 style={{ margin: "0 0 8px", fontSize: "1.1rem" }}>Mac 자원 관리 (BTN): 안전 우선</h3>
                <p>
                  개발자나 크리에이터의 Mac에는 방치된 시뮬레이터, XCTest 복제 기기, 수십 기가바이트에 달하는
                  오래된 DerivedData 폴더, 유휴 데몬 프로세스가 쌓이기 쉽습니다. 한툴의 Mac 관리 모듈은 이들을
                  정확하게 진단해 회수 가능한 디스크 및 메모리 용량을 안내합니다.
                </p>
                <p>
                  가장 중요한 원칙은 <strong>“사전 선택 없음, 자동 삭제 없음”</strong>입니다. 감지된 항목은
                  사용자가 직접 체크하기 전까지 선택되지 않으며, 실행 직전 파일 식별자와 프로세스 PID를 다시
                  검증해 상태가 달라진 항목은 건너뜁니다.
                </p>
                <p>
                  DerivedData와 산출물은 <strong>macOS 휴지통으로 이동</strong>하므로 휴지통을 비우기 전까지 복구할 수
                  있습니다. 제안된 진단 목록을 사용자가 직접 확인한 뒤 조치하며, 시뮬레이터 초기화처럼 되돌릴 수 없는 작업은
                  최종 확인 창에서 명확한 붉은 경고를 표시합니다.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------------
            Chapter 07
            ------------------------------------------------------------------ */}
        <section id="chapter-07" className={styles.chapterBlock}>
          <div className={styles.editorialShell}>
            <header className={styles.chapterHeader}>
              <span className={styles.chapterNumber}>CHAPTER 07</span>
              <h2 className={styles.chapterTitle}>다운로드 매니저와 선택형 서버 현황 모니터</h2>
              <p className={styles.chapterSubtitle}>
                진행률과 속도를 관리하는 다운로드 내역, 그리고 필요할 때만 켜서 안전하게 점검하는
                읽기 전용 서버 상태 게이지.
              </p>
            </header>

            <div className={styles.spreadGrid}>
              <div className={styles.proseColumn}>
                <h3 style={{ margin: "0 0 8px", fontSize: "1.1rem" }}>다운로드 매니저</h3>
                <p>
                  브라우저에서 내려받은 파일은 다운로드 화면에서 진행률과 네트워크 속도, 남은 시간과 함께
                  표시됩니다. 완료된 파일은 Finder에서 바로 열거나 경로를 복사할 수 있으며, 다운로드 내역은
                  오직 사용자의 Mac에만 보관되어 외부로 전송되지 않습니다.
                </p>
              </div>

              <div className={styles.proseColumn}>
                <h3 style={{ margin: "0 0 8px", fontSize: "1.1rem" }}>선택형 서버 현황 모니터</h3>
                <p>
                  서버 현황 모니터는 <strong>기본 꺼짐(OFF)</strong> 상태로 제공되는 순수 선택 기능입니다.
                  일반적인 Mac 사용자에게는 필요하지 않으므로 꺼 둔 채 쓰시면 되며, Synology NAS나 개인
                  홈 서버를 운영하는 사용자만 원할 때 켜서 사용합니다.
                </p>
                <p>
                  복잡한 SSH 키 설정이나 터미널 도구 설치 없이, 놀이터의 보안 HTTPS 주소를 입력하고 한툴 안에서
                  정상 로그인하면 직관적인 게이지 미터로 CPU, 메모리, 저장공간 상태를 읽기 전용으로 조회합니다.
                  고정된 외부 주소를 강제하지 않으며 서버 관리자 권한을 요구하지 않습니다.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------------
            Chapter 08
            ------------------------------------------------------------------ */}
        <section id="chapter-08" className={styles.chapterBlock}>
          <div className={styles.editorialShell}>
            <header className={styles.chapterHeader}>
              <span className={styles.chapterNumber}>CHAPTER 08</span>
              <h2 className={styles.chapterTitle}>실전 빠른 시작과 단축키 레퍼런스</h2>
              <p className={styles.chapterSubtitle}>
                설치부터 실행, 권한 허용, 그리고 손끝에 익히는 실제 검증된 단축키 가이드.
              </p>
            </header>

            <div className={styles.spreadGrid}>
              <div>
                <h3 style={{ margin: "0 0 12px", fontSize: "1.1rem" }}>4단계 빠른 시작 가이드</h3>
                <ol className={styles.stepList}>
                  <li className={styles.stepItem}>
                    <div className={styles.stepNumber}>01</div>
                    <div className={styles.stepContent}>
                      <h4>공식 DMG 다운로드 및 설치</h4>
                      <p>공식 다운로드 링크에서 서명된 DMG를 받아 연 뒤, HanTool.app을 응용 프로그램(Applications) 폴더로 옮깁니다.</p>
                    </div>
                  </li>
                  <li className={styles.stepItem}>
                    <div className={styles.stepNumber}>02</div>
                    <div className={styles.stepContent}>
                      <h4>한툴 실행 및 메뉴 막대 확인</h4>
                      <p>앱을 실행하면 메뉴 막대에 한툴 아이콘이 나타납니다. '한툴 열기'를 누르면 통합 작업 창이 열립니다.</p>
                    </div>
                  </li>
                  <li className={styles.stepItem}>
                    <div className={styles.stepNumber}>03</div>
                    <div className={styles.stepContent}>
                      <h4>필요한 모듈 시스템 권한 허용</h4>
                      <p>화면 번역을 쓸 때 '화면 기록', 입력 도우미를 쓸 때 '손쉬운 사용' 등 필요한 기능에 한해 macOS 권한을 확인하고 허용합니다.</p>
                    </div>
                  </li>
                  <li className={styles.stepItem}>
                    <div className={styles.stepNumber}>04</div>
                    <div className={styles.stepContent}>
                      <h4>취향에 맞는 테마 설정</h4>
                      <p>작업 창 아래 설정에서 5가지 테마와 3가지 아이콘 스타일을 고르고, 원하는 단축키를 확인합니다.</p>
                    </div>
                  </li>
                </ol>
              </div>

              <div>
                <h3 style={{ margin: "0 0 12px", fontSize: "1.1rem" }}>실제 검증된 단축키 레퍼런스</h3>
                <p style={{ margin: "0 0 16px", fontSize: "0.88rem", color: "var(--ink-secondary, #4a4d45)" }}>
                  한툴에 등록된 모든 단축키는 Apple HIG 표준을 준수하며 충돌 시 설정에서 변경할 수 있습니다.
                </p>

                <div className={styles.shortcutTableWrap}>
                  <table className={styles.shortcutTable}>
                    <thead>
                      <tr>
                        <th>동작</th>
                        <th>단축키</th>
                        <th>설명</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>브라우저 열기</td>
                        <td><span className={styles.shortcutKey}>⌘ ⌘ (더블 탭)</span></td>
                        <td>Command 두 번 연타 (⇧ 더블탭 또는 끔으로 변경 가능)</td>
                      </tr>
                      <tr>
                        <td>브라우저 보조키</td>
                        <td><span className={styles.shortcutKey}>⇧⌃⌥⌘B</span></td>
                        <td>전통적인 하이퍼키 단축 조합 지원</td>
                      </tr>
                      <tr>
                        <td>화면 번역 창</td>
                        <td><span className={styles.shortcutKey}>⌃⌥⇧⌘T</span></td>
                        <td>작업 창 숨김 후 즉시 지정 영역 제자리 번역</td>
                      </tr>
                      <tr>
                        <td>메일 번역</td>
                        <td><span className={styles.shortcutKey}>⌃⌥⇧⌘M</span></td>
                        <td>Apple Mail에서 선택한 메일 번역 화면 호출</td>
                      </tr>
                      <tr>
                        <td>트랙패드 긴급 해제</td>
                        <td><span className={styles.shortcutKey}>⌃⌥⌘⎋</span></td>
                        <td>잠긴 트랙패드를 즉각적으로 강제 해제</td>
                      </tr>
                      <tr>
                        <td>비서 패널 닫기</td>
                        <td><span className={styles.shortcutKey}>⌘W</span></td>
                        <td>웹 화면은 유지한 채 열려 있던 AI 비서 패널만 닫기</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div style={{ marginTop: "20px", padding: "16px", background: "#ffffff", borderRadius: "10px", border: "1px solid var(--line, rgba(36, 38, 33, 0.12))" }}>
                  <h5 style={{ margin: "0 0 6px", fontSize: "0.84rem", fontFamily: "var(--font-geist-mono), monospace" }}>터미널 직접 실행 예시</h5>
                  <code style={{ display: "block", fontSize: "0.78rem", background: "var(--paper, #f5f2eb)", padding: "8px 12px", borderRadius: "6px", wordBreak: "break-all" }}>
                    open -a &quot;/Applications/HanTool.app&quot; &quot;https://www.youtube.com&quot;
                  </code>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------------
            Chapter 09
            ------------------------------------------------------------------ */}
        <section id="chapter-09" className={styles.chapterBlock}>
          <div className={styles.editorialShell}>
            <header className={styles.chapterHeader}>
              <span className={styles.chapterNumber}>CHAPTER 09</span>
              <h2 className={styles.chapterTitle}>플랫폼 생태계: Mac 플래그십과 바로보기의 관계</h2>
              <p className={styles.chapterSubtitle}>
                Mac에서는 통합 작업대 한툴로, 모바일에서는 번역 전용 바로보기로. 플랫폼의 물리적
                특성에 맞춘 한스트리의 제품 라인업.
              </p>
            </header>

            <div className={styles.spreadGrid}>
              <div className={styles.proseColumn}>
                <h3 style={{ margin: "0 0 8px", fontSize: "1.1rem" }}>Mac 플래그십으로서의 한툴</h3>
                <p>
                  과거 분리되어 있던 바로보기(번역), 인풋메이트(입력 도우미), BTN(Mac 자원 관리)은 Mac의
                  넓은 화면과 마우스·키보드 환경에 맞춰 <strong>한툴(HanTool) 단일 플래그십 앱</strong>으로
                  완전히 이관·통합되었습니다.
                </p>
                <p>
                  macOS 15.4 이상 Apple Silicon(arm64) Mac을 공식 지원하며, 서명된 자동 업데이트 피드를 통해
                  늘 최신 상태를 유지합니다. 기존 앱들의 설정 파일과 개인 사전, 북마크 데이터는 최초 실행 시
                  안전하게 자동 계승되며 원본 데이터를 훼손하지 않습니다.
                </p>
              </div>

              <div className={styles.proseColumn}>
                <h3 style={{ margin: "0 0 8px", fontSize: "1.1rem" }}>모바일과 Windows의 로드맵</h3>
                <p>
                  스마트폰과 태블릿(iPhone · iPad · Android) 환경에서는 통합 작업대 대신, 휴대성에 맞춘
                  독립 번역 앱 <strong><Link href="/apps/barobogi" style={{ textDecoration: "underline", color: "var(--ink, #242621)" }}>바로보기</Link></strong>가
                  계속 제공됩니다. iPhone·iPad는 TestFlight 0.8.12 공개 베타를 통해 단축어 및 사진 번역을
                  지원하고 있습니다.
                </p>
                <p>
                  <strong>Windows 버전</strong>은 단순 포팅이 아니라 확장된 한툴의 기능 범위에 걸맞은 새 디자인으로
                  현재 기획 중입니다. 과거 배포되었던 바로보기 Windows 브라우저 확장 시험판(0.3.0)과는 별개의
                  완전한 데스크톱 앱으로 준비 중이며, 공식 출시일 및 다운로드는 추후 안내될 예정입니다.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------------
            Chapter 10
            ------------------------------------------------------------------ */}
        <section id="chapter-10" className={styles.chapterBlock}>
          <div className={styles.editorialShell}>
            <header className={styles.chapterHeader}>
              <span className={styles.chapterNumber}>CHAPTER 10</span>
              <h2 className={styles.chapterTitle}>자주 묻는 질문(FAQ), 개인정보 원칙과 공식 저장소</h2>
              <p className={styles.chapterSubtitle}>
                도구 사용에 대한 투명한 답변, 지켜지는 프라이버시 약속, 그리고 오픈소스 커뮤니티.
              </p>
            </header>

            <div className={styles.faqAccordion}>
              <details className={styles.faqItem}>
                <summary className={styles.faqSummary}>
                  인텔(Intel) Mac에서도 실행할 수 있나요?
                </summary>
                <div className={styles.faqContent}>
                  <p>
                    현재 한툴은 macOS 15.4 이상 Apple Silicon(M1, M2, M3, M4 등 arm64) 기기에 최적화되어 있습니다.
                    온디바이스 머신러닝 엔진과 고성능 WebKit 통합 구조상 인텔(x86_64) Mac은 공식 지원하지 않습니다.
                  </p>
                </div>
              </details>

              <details className={styles.faqItem}>
                <summary className={styles.faqSummary}>
                  한툴의 설치 방법과 AI 비서 계정 이용 방식은 어떻게 되나요?
                </summary>
                <div className={styles.faqContent}>
                  <p>
                    한툴은 공식 웹사이트에서 서명된 DMG를 내려받아 응용 프로그램 폴더로 옮기면 바로 설치하여 사용할 수 있습니다.
                    별도의 한툴 자체 계정 가입 절차는 없으며, 브라우저와 내장 도구를 즉시 활용할 수 있습니다. AI 비서 패널의 경우
                    사용자가 각 AI 서비스 공식 웹사이트에서 기존에 보유한 로그인 세션과 개별 서비스 이용 약관에 따라 직접 연결하여 이용합니다.
                  </p>
                </div>
              </details>

              <details className={styles.faqItem}>
                <summary className={styles.faqSummary}>
                  내 키보드 입력 내용이나 캡처 화면이 외부 서버로 전송되나요?
                </summary>
                <div className={styles.faqContent}>
                  <p>
                    기본 기능은 Mac 기기 안에서 로컬로 처리됩니다. 인풋메이트의 한영 판별과 개인 사전, BTN의 진단 결과는
                    이 Mac의 로컬 저장소에만 보관되며 타이핑 원문이나 전체 입력 기록을 전송하지 않습니다. 화면 캡처 또한
                    자동으로 저장되지 않으며, 구글·딥플 등 외부 번역을 직접 켜고 동의한 경우에 한해 인식된 글자 텍스트만
                    해당 공식 서비스로 전달됩니다. 다만 통합 브라우저 탐색은 방문하는 웹사이트와 직접 통신하며, AI 비서 사이드 패널에
                    입력하거나 첨부한 내용은 사용자가 선택한 해당 AI 제공사로 전송됩니다.
                  </p>
                </div>
              </details>

              <details className={styles.faqItem}>
                <summary className={styles.faqSummary}>
                  Mac 자원 관리(BTN)가 내 중요 프로젝트 파일을 마음대로 지우지 않나요?
                </summary>
                <div className={styles.faqContent}>
                  <p>
                    그렇지 않습니다. 한툴의 자원 관리는 ‘사전 선택 없음’ 원칙을 엄격하게 지킵니다. 제안된 진단 목록 중
                    사용자가 직접 눈으로 경로와 이유를 확인하고 체크한 항목에 한해서만 실행 직전 재검증을 거쳐 조치합니다.
                    정리된 DerivedData와 XCTest 산출물은 macOS 휴지통으로 이동하므로 휴지통을 비우기 전까지 복구할 수 있으며,
                    시뮬레이터 초기화처럼 되돌릴 수 없는 작업은 최종 확인 창에서 명확한 경고를 표시합니다.
                  </p>
                </div>
              </details>

              <details className={styles.faqItem}>
                <summary className={styles.faqSummary}>
                  서버 현황 모니터를 사용하려면 반드시 NAS가 있어야 하나요?
                </summary>
                <div className={styles.faqContent}>
                  <p>
                    아닙니다. 서버 현황 모니터는 기본적으로 꺼져 있는 선택 기능입니다. NAS가 없는 일반 사용자도
                    브라우저, 번역, AI 비서, 입력 도우미, Mac 관리 기능을 아무런 제약 없이 완전히 이용할 수 있습니다.
                  </p>
                </div>
              </details>

              <details className={styles.faqItem}>
                <summary className={styles.faqSummary}>
                  단축키(Command 두 번 연타)가 다른 프로그램과 충돌하면 어떻게 하나요?
                </summary>
                <div className={styles.faqContent}>
                  <p>
                    한툴 작업 창의 '앱 설정'에서 브라우저 열기 단축키를 <code>Command 더블 탭</code>, <code>Shift 더블 탭</code>,
                    또는 <code>끔(단축키 해제)</code> 중에서 원하는 방식으로 자유롭게 변경할 수 있습니다.
                  </p>
                </div>
              </details>
            </div>

            {/* Privacy & Legal Summary Card */}
            <div style={{ marginTop: "36px", padding: "24px", background: "#ffffff", borderRadius: "14px", border: "1px solid var(--line, rgba(36, 38, 33, 0.12))" }}>
              <h3 style={{ margin: "0 0 10px", fontSize: "1.05rem", fontWeight: "700" }}>개인정보 투명성과 공식 지원 링크</h3>
              <p style={{ margin: "0 0 16px", fontSize: "0.88rem", lineHeight: "1.65", color: "var(--ink-secondary, #4a4d45)" }}>
                한툴은 최소 수집, 로컬 우선, 투명한 사용자 동의의 원칙을 엄격하게 지킵니다. 상세한 개인정보 정책과
                기술 지원, 소스 코드 저장소는 아래 공식 링크에서 투명하게 확인하실 수 있습니다.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", fontSize: "0.88rem", fontWeight: "600" }}>
                <Link href="/apps/hantool/privacy" style={{ textDecoration: "underline", color: "var(--ink, #242621)" }}>
                  한툴 개인정보처리방침 전문 보기 →
                </Link>
                <Link href="/apps/hantool/support" style={{ textDecoration: "underline", color: "var(--ink, #242621)" }}>
                  고객 지원 및 문의 안내 →
                </Link>
                <Link href="https://github.com/armsone/HanTool" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "underline", color: "var(--ink, #242621)" }}>
                  공식 GitHub 저장소 (armsone/HanTool) ↗
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------------
            Technical Appendix (Semantic Details Expansion)
            Full features, guide, and privacy contract from app data
            ------------------------------------------------------------------ */}
        <section className={styles.appendixSection} aria-label="기술 부록">
          <div className={styles.editorialShell}>
            <details>
              <summary className={styles.appendixSummary}>
                <span>기술 사양 및 전체 기능 카탈로그 부록 (상세 펼쳐보기)</span>
                <span className={styles.monoTag}>APPENDIX · {app.features.length} FEATURES</span>
              </summary>

              <div className={styles.appendixDetails}>
                {app.features.map((feature, idx) => (
                  <div key={idx} className={styles.appendixCard}>
                    <h5>{String(idx + 1).padStart(2, "0")}. {feature.title}</h5>
                    <p>{feature.body}</p>
                  </div>
                ))}
              </div>
            </details>
          </div>
        </section>

        {/* Magazine Footer Navigation */}
        <footer className={styles.magazineFootNav}>
          <div className={styles.editorialShell}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
              <div className={styles.footNavLeft}>
                <strong>한툴 HanTool</strong>
                <span style={{ color: "var(--muted, #6e6d65)", fontSize: "0.84rem" }}>
                  Hanstree Flagship Mac Workspace · 1.27.0
                </span>
              </div>
              <div className={styles.footNavLinks}>
                <Link href="/">Hanstree 홈</Link>
                <Link href="/apps/barobogi">모바일 바로보기</Link>
                <Link href="/apps/hantool/privacy">개인정보</Link>
                <Link href="/apps/hantool/support">지원</Link>
                <a href="#top">맨 위로 ↑</a>
              </div>
            </div>
          </div>
        </footer>
      </article>

      <SiteFooter currentPageName={app.name} />
    </>
  );
}
