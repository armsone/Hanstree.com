import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "../../components/SiteChrome";

export const metadata: Metadata = {
  title: "맥에서 Synology WebDAV 폴더가 사라질 때 — 이름과 접속 주소를 바꾸지 않고 해결하기",
  description: "DSM File Station이나 macOS SMB에서는 보이지만 macOS Finder WebDAV에서만 특정 폴더(Mac 등)가 사라지는 유니코드 NFC/NFD 정규화 길이 판별 버그의 원인 분석과, 저장 경로 변경 없이 역방향 프록시 및 게이트웨이로 해결한 기술 기록입니다.",
  alternates: { canonical: "https://hanstree.com/guides/webdav-macos-folders" },
  openGraph: {
    type: "article",
    locale: "ko_KR",
    siteName: "Hanstree",
    title: "맥에서 Synology WebDAV 폴더가 사라질 때 — 이름과 접속 주소를 바꾸지 않고 해결하기",
    description: "DSM이나 SMB에서는 보이지만 macOS WebDAV에서만 사라지는 폴더 문제의 원인 분석과 실시간 NFD 보정 게이트웨이 구축 가이드.",
    url: "https://hanstree.com/guides/webdav-macos-folders",
    images: [{ url: "/guides/webdav-macos-folders/finder-after.png", width: 1978, height: 1488, alt: "복구 후 macOS Finder 화면" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "맥에서 Synology WebDAV 폴더가 사라질 때 — 이름과 접속 주소를 바꾸지 않고 해결하기",
    description: "이름과 접속 주소 변경 없이 Synology WebDAV와 macOS Finder 간 폴더 누락 문제를 해결한 기술 기록.",
    images: ["/guides/webdav-macos-folders/finder-after.png"],
  },
};

export default function WebdavMacosFoldersGuidePage() {
  return (
    <div className="guide-page-wrapper">
      <SiteHeader />

      <main className="guide-main">
        <article className="shell guide-article">
          {/* 상단 브레드크럼 및 헤더 */}
          <header className="guide-header">
            <div className="guide-breadcrumb">
              <Link href="/#works"><span>←</span> 홈으로 돌아가기</Link>
              <span className="breadcrumb-separator">/</span>
              <span>기술 가이드</span>
            </div>
            <p className="guide-eyebrow">TECHNICAL REPORT · WEBDAV &amp; MACOS COMPATIBILITY</p>
            <h1 className="guide-title">맥에서 Synology WebDAV 폴더가 사라질 때<br /><span className="guide-title-sub">— 이름과 접속 주소를 바꾸지 않고 해결하기</span></h1>
            
            <div className="guide-meta-bar">
              <div className="guide-meta-item">
                <span className="meta-label">발행일</span>
                <time dateTime="2026-10-25">2026년 10월 25일</time>
              </div>
              <div className="guide-meta-item">
                <span className="meta-label">공개 소스 저장소</span>
                <Link href="https://github.com/armsone/webdav-finder-compat" target="_blank" rel="noopener noreferrer" className="meta-link">
                  GitHub: armsone/webdav-finder-compat
                </Link>
              </div>
              <div className="guide-meta-item">
                <span className="meta-label">오프라인 문서</span>
                <a href="/guides/webdav-macos-folders/community-guide.html" download className="meta-link-download">
                  단일 HTML 파일 다운로드
                </a>
              </div>
            </div>

            {/* 빠른 링크 액션 */}
            <div className="guide-action-buttons">
              <Link href="https://github.com/armsone/webdav-finder-compat" target="_blank" rel="noopener noreferrer" className="button button-primary">
                GitHub 소스코드 저장소 열기 ↗
              </Link>
              <a href="/guides/webdav-macos-folders/community-guide.html" download className="button button-quiet">
                단일 파일 HTML 다운로드 (.html) ↓
              </a>
            </div>
          </header>

          {/* 선행 연구자 크레딧 및 사실 구분 안내 카드 */}
          <section className="guide-attribution-box" aria-label="선행 연구 및 기술 사실 구분 안내">
            <div className="attribution-badge">선행 연구 인용 및 원저작자 크레딧</div>
            <p>
              본 해결책은 <strong>Leo Nikkilä</strong>의 선행 분석 및 Nginx Lua 아이디어(
              <a href="https://lnikki.la/posts/using-lua-on-nginx-to-fix-finders-webdav-quirks.html" target="_blank" rel="noopener noreferrer">
                &ldquo;Using Lua on Nginx to fix Finder&apos;s WebDAV quirks&rdquo;, 2024-02-04
              </a>
              )에서 제안된 <em>&lsquo;PROPFIND href 경로의 NFD 실시간 보정&rsquo;</em> 원리를 바탕으로, Synology DSM의 패키지 포트 특성과 Docker 환경에 맞춰 Python 비동기 프록시로 독립 구현한 것입니다. 독자적인 원천 기술이나 최초 발견으로 과장하지 않으며, 선행 연구자에게 깊은 감사를 표합니다.
            </p>
            <div className="facts-legend">
              <span className="badge badge-measured">실측/검증됨</span> 161개 메타데이터/목록 일관성 일치 (파일 전송 무결성 검증 아님), TLS 1.3 암호화 및 401 미인증 방어 동작 실측
              <span className="badge badge-confirmed">사용자 확인</span> 타 누락 위치 폴더 표시 확인
              <span className="badge badge-inferred">추론</span> 공개 소스 분석·재현 증상·복구 기반 원인 추론 (현재 OS 바이너리/공식 확인 아님)
              <span className="badge badge-unverified">미측정/한계</span> 앞단 Nginx 버퍼링 속도 미실측, 모든 폴더 무누락 보증 불가
            </div>
          </section>

          {/* 1. 증상과 문제 정의 */}
          <section className="guide-section">
            <h2>1. 증상: 특정 폴더만 Finder에서 사라짐</h2>
            <p>
              Synology NAS를 WebDAV 프로토콜로 macOS Finder(네이티브 &lsquo;서버에 연결&rsquo;)에 마운트했을 때, 특이한 누락 현상이 관찰되었습니다.
              동일한 계정으로 로그인했음에도 DSM <strong>File Station</strong>(웹)과 macOS 환경의 <strong>SMB 공유</strong> 마운트에서는 정상적으로 보이는 특정 폴더(<code>Mac</code>)가 macOS Finder 네이티브 WebDAV 마운트에서만 목록에 나타나지 않는 증상이었습니다.
            </p>
            <div className="symptom-card">
              <h3>재현 관찰 패턴</h3>
              <ul>
                <li><strong>원본 상태:</strong> <code>#설치어플</code> 폴더 안의 <code>Mac</code> 폴더가 Finder에서 누락 (숨김 항목을 포함한 원본 5개 raw 디렉토리 엔트리 중 4개만 수신되어 화면상 가시적 폴더 아이콘은 2개만 표시됨. 5개/4개 raw 목록 수와 가시적 아이콘 수를 동일시하지 마십시오).</li>
                <li><strong>이름 변경 실험:</strong> <code>Mac</code>의 이름을 더 긴 이름으로 바꾸면 Finder에 즉시 나타남.</li>
                <li><strong>원복 실험:</strong> 이름을 다시 <code>Mac</code>으로 되돌리면 즉시 Finder 목록에서 사라짐.</li>
              </ul>
              <p className="symptom-note">
                <span className="badge badge-measured">실측/검증됨</span> 실제 NAS의 디스크 저장 경로를 바꾸거나 폴더명을 강제로 긴 이름으로 고치지 않고, 기존 접속 주소와 포트(HTTPS 5006)를 유지하면서 문제를 해결하는 것이 목표였습니다.
              </p>
            </div>

            <h3>검증 환경 스펙</h3>
            <div className="table-responsive">
              <table className="guide-table">
                <thead>
                  <tr>
                    <th>구성 요소</th>
                    <th>버전 및 환경</th>
                    <th>비고</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>NAS 하드웨어</td>
                    <td>Synology DS1821+</td>
                    <td>x86_64 아키텍처</td>
                  </tr>
                  <tr>
                    <td>NAS 운영체제 (DSM)</td>
                    <td>DSM 7.4.1-90080</td>
                    <td>테스트 당시 설치 버전 (최신 버전 여부는 별도 검증하지 않음)</td>
                  </tr>
                  <tr>
                    <td>WebDAV Server 패키지</td>
                    <td>2.4.8-20135</td>
                    <td>Synology 공식 패키지</td>
                  </tr>
                  <tr>
                    <td>클라이언트 OS</td>
                    <td>macOS 27.0.1 (Darwin)</td>
                    <td>네이티브 WebDAVFS 마운터</td>
                  </tr>
                  <tr>
                    <td>보정 게이트웨이 환경</td>
                    <td>Docker 24.0.2 / Python 3.11.17 / aiohttp 3.14.5</td>
                    <td>로컬 빌드 비동기 컨테이너</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* 2. 기술적 원인 분석 */}
          <section className="guide-section">
            <h2>2. 원인 분석: 유니코드 NFC/NFD와 UTF-16 길이 비교의 함정</h2>
            <p>
              왜 다른 폴더(<code>Android</code>, <code>Windows</code>)는 잘 보이는데 유독 <code>Mac</code>만 사라졌을까요?
              이 문제는 macOS의 네이티브 WebDAV 클라이언트인 <a href="https://github.com/apple-oss-distributions/webdavfs/blob/a239d37d7407700119e9c92f66f38ab0a296cb0f/mount.tproj/webdav_parse.c#L1415-L1538" target="_blank" rel="noopener noreferrer">Apple 오픈소스 webdavfs의 <code>webdav_parse.c</code></a> 소스 코드 구조와 재현 증상, 그리고 보정 후 복구 결과를 바탕으로 합리적으로 추론할 수 있습니다. (현재 macOS 상용 정식 바이너리 직접 검증이나 Apple 공식 확인 사항은 아닙니다.)
            </p>

            <aside className="callout callout-inferred">
              <div className="callout-title">
                <span className="badge badge-inferred">원인 추론</span> Apple webdavfs 파서 로직과 유니코드 길이 판별
              </div>
              <p>
                Finder가 WebDAV 폴더 목록을 요청할 때(<code>PROPFIND</code>), 자신이 마운트 중인 부모 경로를 macOS 기본 유니코드 형식인 <strong>NFD (초성·중성·종성 분리형)</strong>로 전송합니다. 반면 Synology WebDAV Server는 저장된 <strong>NFC 형식(완성형)</strong>으로 응답합니다.
              </p>
              <p>
                공개된 <code>webdavfs</code> 소스 코드의 <code>GetNormalizedPathLength</code> 및 <code>GetComponentName</code> 함수는 URL 퍼센트 디코딩 후 <code>CFStringGetLength</code>(UTF-16 코드 유닛 개수)를 호출하여 부모 경로와 자식 항목의 경로 길이를 단순 비교합니다.
                즉, <strong>&ldquo;응답으로 들어온 자식 경로의 길이가 요청한 부모 경로의 길이보다 엄격히 커야 한다&rdquo;</strong>는 전제로 자식 여부를 판별합니다.
              </p>
            </aside>

            <h3>경로 문자열의 UTF-16 길이 비교</h3>
            <p>
              <a href="https://www.unicode.org/reports/tr15/" target="_blank" rel="noopener noreferrer">Unicode Standard Annex #15 (UAX #15)</a>에 정의된 NFC와 NFD 정규화 방식에 따라 부모 경로와 자식 경로의 실제 글자 수(UTF-16 코드 유닛)를 계산해 보면 다음과 같습니다:
            </p>

            <div className="table-responsive">
              <table className="guide-table">
                <thead>
                  <tr>
                    <th>항목 경로</th>
                    <th>NFC 길이 (코드 유닛)</th>
                    <th>NFD 길이 (코드 유닛)</th>
                    <th>판별 결과 (요청 부모 NFD 18자 대비)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>부모: <code>/home/#설치어플/</code></td>
                    <td>12</td>
                    <td><strong>18</strong> (기준 부모 길이)</td>
                    <td>macOS가 기억하는 요청 부모 길이: <strong>18자</strong></td>
                  </tr>
                  <tr className="row-fail">
                    <td>자식: <code>/home/#설치어플/Mac/</code></td>
                    <td><strong>16</strong> (Synology 응답)</td>
                    <td>22</td>
                    <td><strong>16 &le; 18 &rarr; 탈락!</strong> (자식이 부모보다 짧아 누락)</td>
                  </tr>
                  <tr className="row-pass">
                    <td>자식: <code>/home/#설치어플/Android/</code></td>
                    <td><strong>20</strong> (Synology 응답)</td>
                    <td>26</td>
                    <td><strong>20 &gt; 18 &rarr; 통과!</strong> (정상 표시)</td>
                  </tr>
                  <tr className="row-pass">
                    <td>자식: <code>/home/#설치어플/Windows/</code></td>
                    <td><strong>20</strong> (Synology 응답)</td>
                    <td>26</td>
                    <td><strong>20 &gt; 18 &rarr; 통과!</strong> (정상 표시)</td>
                  </tr>
                  <tr className="row-fix">
                    <td><strong>보정 후: <code>/home/#설치어플/Mac/</code></strong></td>
                    <td>16</td>
                    <td><strong>22</strong> (게이트웨이 NFD 변환)</td>
                    <td><strong>22 &gt; 18 &rarr; 복구 성공!</strong> (정상 표시)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="guide-body-text">
              <code>#설치어플</code>은 한글 4글자가 포함되어 있어 NFD로 변환되면 길이가 12에서 18로 6글자 늘어납니다.
              반면 자식 항목인 <code>Mac</code>은 3글자(영문)에 불과하여, 부모가 NFD(18자)인 상태에서 NFC 응답(16자)을 비교하면 <strong>부모 경로 길이(18)보다 자식 경로 길이(16)가 더 짧다는 모순</strong>이 발생하여 파서가 자식 항목을 유효하지 않은 것으로 간주하고 버렸던 것으로 추론됩니다.
              <code>Android</code>나 <code>Windows</code>는 영문 철자가 길어 NFC 상태에서도 20글자가 되므로 18보다 커서 표시될 수 있었습니다.
            </p>
          </section>

          {/* 3. 해결 구조와 인라인 SVG 다이어그램 */}
          <section className="guide-section">
            <h2>3. 해결 구조: 무변형 저장과 실시간 NFD 응답 보정</h2>
            <p>
              핵심 해결 전략은 <strong>&ldquo;저장소의 원본 파일명과 폴더명은 절대 건드리지 않고, macOS 클라이언트의 요청 경로도 강제로 NFC로 역변환하지 않는 것&rdquo;</strong>입니다.
              대신 중간 게이트웨이가 macOS WebDAVFS User-Agent의 <code>PROPFIND</code> 응답(HTTP 207 Multi-Status) XML 내부 중 <code>DAV:multistatus/DAV:response/DAV:href</code> 경로만 선택적으로 NFD로 변환하여 돌려줍니다.
              보정된 207 응답에서는 XML 본문 변형에 따라 기존 <code>ETag</code>, <code>Digest</code>, <code>Content-MD5</code> 헤더가 제거되고 <code>Content-Length</code>가 정확히 재계산되며, 인증 정보(Auth) 및 <code>LOCK</code> 토큰을 비롯한 기타 WebDAV 속성은 온전하게 보존됩니다. (모든 HTTP 헤더가 무변형 유지된다고 주장하지 않습니다.)
            </p>

            <div className="diagram-wrapper">
              <div className="diagram-header">
                <span className="diagram-tag">설명용 도해 (실제 화면 아님)</span>
                <span className="diagram-title">Synology WebDAV &amp; 보정 게이트웨이 요청/응답 아키텍처</span>
              </div>
              
              {/* 인라인 SVG 아키텍처 다이어그램 */}
              <svg className="guide-inline-svg" viewBox="0 0 860 380" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="네트워크 및 게이트웨이 요청 흐름 아키텍처 설명용 도해">
                <rect width="860" height="380" rx="16" fill="#1e2025" />
                
                {/* 1단계: macOS Finder */}
                <g transform="translate(40, 50)">
                  <rect width="180" height="280" rx="12" fill="#292c35" stroke="#414654" strokeWidth="1.5" />
                  <rect x="20" y="20" width="40" height="40" rx="8" fill="#3b82f6" />
                  <text x="40" y="45" fill="#ffffff" fontSize="20" fontWeight="bold" textAnchor="middle"></text>
                  <text x="20" y="85" fill="#ffffff" fontSize="15" fontWeight="600">macOS Finder</text>
                  <text x="20" y="105" fill="#9ca3af" fontSize="12">네이티브 WebDAVFS</text>
                  <line x1="20" y1="125" x2="160" y2="125" stroke="#414654" />
                  <text x="20" y="150" fill="#d1d5db" fontSize="11">• NFD 부모 경로 요청</text>
                  <text x="20" y="172" fill="#d1d5db" fontSize="11">• User-Agent 식별:</text>
                  <text x="26" y="190" fill="#60a5fa" fontSize="10" fontFamily="monospace">WebDAVFS/*</text>
                  <text x="20" y="215" fill="#d1d5db" fontSize="11">• 기존 포트 접속:</text>
                  <text x="26" y="233" fill="#34d399" fontSize="11" fontWeight="bold">HTTPS 5006 유지</text>
                  <rect x="18" y="248" width="144" height="20" rx="4" fill="#3b82f620" />
                  <text x="90" y="262" fill="#93c5fd" fontSize="9.5" textAnchor="middle">이름/URL 변경 불필요</text>
                </g>

                {/* 화살표 1: Mac -> DSM 역방향 프록시 */}
                <g transform="translate(225, 160)">
                  <path d="M 0 0 L 55 0" stroke="#34d399" strokeWidth="2.5" strokeDasharray="5 3" />
                  <polygon points="55,-5 65,0 55,5" fill="#34d399" />
                  <text x="30" y="-12" fill="#a7f3d0" fontSize="10.5" textAnchor="middle">외부 HTTPS</text>
                  <text x="30" y="20" fill="#9ca3af" fontSize="9.5" textAnchor="middle">포트 5006</text>
                </g>

                {/* 2단계: DSM Nginx 역방향 프록시 */}
                <g transform="translate(295, 50)">
                  <rect width="165" height="280" rx="12" fill="#292c35" stroke="#414654" strokeWidth="1.5" />
                  <rect x="18" y="20" width="38" height="38" rx="8" fill="#10b981" />
                  <text x="37" y="44" fill="#ffffff" fontSize="16" fontWeight="bold" textAnchor="middle">DSM</text>
                  <text x="18" y="85" fill="#ffffff" fontSize="14" fontWeight="600">역방향 프록시</text>
                  <text x="18" y="105" fill="#9ca3af" fontSize="11">내장 Nginx (SSL/TLS)</text>
                  <line x1="18" y1="125" x2="147" y2="125" stroke="#414654" />
                  <text x="18" y="150" fill="#d1d5db" fontSize="11">• 공인 인증서 종단</text>
                  <text x="18" y="172" fill="#d1d5db" fontSize="11">• TLS 1.3 암호화</text>
                  <text x="18" y="195" fill="#d1d5db" fontSize="11">• 루프백 안전 전달:</text>
                  <text x="24" y="215" fill="#fbbf24" fontSize="10" fontFamily="monospace">127.0.0.1:18080</text>
                  <rect x="16" y="248" width="133" height="20" rx="4" fill="#10b98120" />
                  <text x="82" y="262" fill="#6ee7b7" fontSize="9.5" textAnchor="middle">시스템 파일 무수정</text>
                </g>

                {/* 화살표 2: DSM -> Docker Gateway */}
                <g transform="translate(465, 160)">
                  <path d="M 0 0 L 45 0" stroke="#fbbf24" strokeWidth="2.5" />
                  <polygon points="45,-5 55,0 45,5" fill="#fbbf24" />
                  <text x="25" y="-12" fill="#fde68a" fontSize="10.5" textAnchor="middle">내부 Loopback</text>
                  <text x="25" y="20" fill="#9ca3af" fontSize="9.5" textAnchor="middle">:18080</text>
                </g>

                {/* 3단계: 보정 게이트웨이 (Docker) */}
                <g transform="translate(525, 40)">
                  <rect width="180" height="300" rx="14" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
                  <rect x="18" y="18" width="40" height="40" rx="8" fill="#0284c7" />
                  <text x="38" y="44" fill="#ffffff" fontSize="18" fontWeight="bold" textAnchor="middle">Py</text>
                  <text x="18" y="82" fill="#ffffff" fontSize="14" fontWeight="600">보정 게이트웨이</text>
                  <text x="18" y="102" fill="#7dd3fc" fontSize="11">webdav-finder-compat</text>
                  <line x1="18" y1="120" x2="162" y2="120" stroke="#334155" />
                  <rect x="16" y="132" width="148" height="52" rx="6" fill="#0f172a" stroke="#0284c7" strokeWidth="1" />
                  <text x="24" y="150" fill="#38bdf8" fontSize="10.5" fontWeight="bold">PROPFIND 207 응답 시:</text>
                  <text x="24" y="168" fill="#f1f5f9" fontSize="10">DAV:href &rarr; NFD 변환</text>
                  <text x="18" y="208" fill="#94a3b8" fontSize="10.5">• 다른 WebDAV 속성 보존</text>
                  <text x="18" y="226" fill="#94a3b8" fontSize="10.5">• LOCK 토큰 보존</text>
                  <text x="18" y="244" fill="#94a3b8" fontSize="10.5">• 일반 파일: 64KiB 스트리밍</text>
                  <rect x="16" y="262" width="148" height="24" rx="4" fill="#38bdf820" />
                  <text x="90" y="278" fill="#7dd3fc" fontSize="10" fontWeight="bold" textAnchor="middle">메모리 상한 10MiB 버퍼</text>
                </g>

                {/* 화살표 3: Gateway -> 원본 WebDAV Server */}
                <g transform="translate(710, 160)">
                  <path d="M 0 0 L 35 0" stroke="#94a3b8" strokeWidth="2.5" />
                  <polygon points="35,-5 45,0 35,5" fill="#94a3b8" />
                  <text x="20" y="-12" fill="#cbd5e1" fontSize="10.5" textAnchor="middle">HTTP</text>
                  <text x="20" y="20" fill="#9ca3af" fontSize="9.5" textAnchor="middle">:5005</text>
                </g>

                {/* 4단계: 기존 Synology WebDAV Server */}
                <g transform="translate(760, 50)">
                  <rect width="80" height="280" rx="12" fill="#292c35" stroke="#414654" strokeWidth="1.5" />
                  <text x="40" y="110" fill="#ffffff" fontSize="13" fontWeight="600" textAnchor="middle">기존</text>
                  <text x="40" y="132" fill="#ffffff" fontSize="13" fontWeight="600" textAnchor="middle">WebDAV</text>
                  <text x="40" y="154" fill="#ffffff" fontSize="13" fontWeight="600" textAnchor="middle">Server</text>
                  <line x1="12" y1="175" x2="68" y2="175" stroke="#414654" />
                  <text x="40" y="200" fill="#9ca3af" fontSize="11" textAnchor="middle">HTTP</text>
                  <text x="40" y="218" fill="#34d399" fontSize="12" fontWeight="bold" textAnchor="middle">5005</text>
                  <text x="40" y="245" fill="#9ca3af" fontSize="9" textAnchor="middle">인증/권한</text>
                  <text x="40" y="260" fill="#9ca3af" fontSize="9" textAnchor="middle">원판정</text>
                </g>
              </svg>
              <p className="diagram-caption">
                [설명용 도해 · 실제 화면 아님] 요청 흐름: Mac Finder &rarr; 기존 HTTPS 5006 &rarr; DSM 역방향 프록시 &rarr; 내부 게이트웨이(127.0.0.1:18080) &rarr; 기존 WebDAV(HTTP 5005).
              </p>
            </div>

            <h3>스트리밍 및 버퍼링 동작 원리</h3>
            <ul>
              <li>
                <strong>일반 파일 송수신 (GET/PUT 등):</strong> 보정 프로그램은 파일 다운로드나 업로드를 디스크에 임시 저장하지 않고 <a href="https://docs.aiohttp.org/en/stable/client_reference.html" target="_blank" rel="noopener noreferrer">aiohttp 스트리밍</a> 방식으로 64KiB 조각(chunk) 단위로 즉시 흘려보냅니다.
              </li>
              <li>
                <strong>디렉토리 목록 XML (PROPFIND 207 Multi-Status):</strong> XML 태그 구조를 파싱해야 하므로 최대 10MiB(기본 <code>WEBDAV_MAX_XML_SIZE=10485760</code> 바이트) 메모리 상한 내에서만 응답 본문을 버퍼링하여 <code>DAV:href</code> 경로 문자열을 NFD로 실시간 치환합니다. 본문이 10MiB를 초과하거나 파싱할 수 없는 손상된(malformed) XML인 경우 데이터 왜곡을 막기 위해 명시적으로 실패 처리하며, NFD 변환 시 중복 href 충돌(collision)이 발생할 경우에도 <code>502 Bad Gateway</code>로 명시적 차단합니다.
              </li>
              <li>
                <strong>인증과 보안:</strong> 모든 계정 인증 및 읽기/쓰기 권한 판정은 기존 Synology WebDAV Server가 수행하며, 게이트웨이는 사용자 암호나 인증 토큰을 저장하지 않습니다.
              </li>
            </ul>
          </section>

          {/* 4. 실제 복구 증거와 스크린샷 */}
          <section className="guide-section">
            <h2>4. 실제 복구 검증 및 스크린샷</h2>
            <p>
              보정 게이트웨이를 가동하고 DSM 역방향 프록시를 연결한 뒤, 클라이언트에서 기존 접속 주소(<code>https://nas.example.com:5006/home/</code>)로 다시 접속하여 실제 정상 동작을 확인했습니다.
            </p>

            <div className="screenshots-grid">
              {/* 스크린샷 1 */}
              <figure className="guide-figure">
                <div className="figure-badge">실제 화면 스크린샷 (Actual Screenshot)</div>
                <img 
                  src="/guides/webdav-macos-folders/finder-after.png" 
                  alt="복구 후 macOS Finder에서 Mac 폴더가 정상 표시된 실제 화면 스크린샷"
                  className="guide-screenshot-img"
                  loading="lazy"
                />
                <figcaption>
                  <strong>그림 1:</strong> 실제 복구 후 Finder 화면 (실제 1978×1488 해상도). 개인정보가 노출될 수 있는 사이드바 영역을 숨기고 새로 촬영했습니다. 숨김 항목을 제외한 3개의 보이는 폴더(<code>Android</code>, <code>Mac</code>, <code>Windows</code>) 중 사라졌던 <code>Mac</code> 폴더가 원래 이름 그대로 정상 표시되며 하위 항목 탐색도 정상 동작합니다. (서버 원본의 5개/4개 raw 디렉토리 엔트리 수와 화면에 표시되는 가시적 폴더 아이콘 수를 동일시하지 마십시오.)
                </figcaption>
              </figure>

              {/* 스크린샷 2 */}
              <figure className="guide-figure">
                <div className="figure-badge">실제 화면 스크린샷 (Actual Screenshot)</div>
                <img 
                  src="/guides/webdav-macos-folders/gateway-health.png" 
                  alt="NAS 내부 보정 게이트웨이 정상 기동 및 401 미인증 방어 로그 실제 화면 스크린샷"
                  className="guide-screenshot-img"
                  loading="lazy"
                />
                <figcaption>
                  <strong>그림 2:</strong> 실제 NAS 보정 게이트웨이 정상 기동 로그. 외부 미인증 PROPFIND 요청 시 기존 WebDAV 서버의 판단에 따라 즉시 <code>401 Unauthorized</code>로 인증을 요구하는 정상 방어 흐름(개인 식별 주소가 제거된 필터 화면)을 확인할 수 있습니다.
                </figcaption>
              </figure>
            </div>

            <div className="verification-box">
              <h3>검증 관찰 데이터</h3>
              <ul>
                <li><span className="badge badge-measured">실측/검증됨</span> <strong>기존 증상:</strong> 문제 부모 폴더 내 숨김 항목을 포함한 원본 5개 raw 엔트리 중 네이티브 WebDAV 마운트 시 <code>Mac</code> 누락으로 4개만 반환됨 (화면상 가시적 폴더 아이콘은 2개만 표시).</li>
                <li><span className="badge badge-measured">실측/검증됨</span> <strong>보정 후:</strong> <code>Mac</code> 폴더 정상 출현으로 숨김 항목 제외 3개의 보이는 폴더가 모두 정상 표시되고 하위 파일 목록 탐색 정상 동작.</li>
                <li><span className="badge badge-measured">실측/검증됨</span> <strong>메타데이터 및 디렉토리 목록 일치:</strong> <code>#설치어플</code> 하위 총 161개 항목(폴더 36개, 파일 125개)의 디렉토리 목록 및 메타데이터 일관성 확인(누락 0건 / 추가 0건 / 정규화 충돌 0건). 단, 이는 목록 일관성 검증이며 파일 본문 전송 무결성(Transfer Integrity) 전수 검증을 의미하지는 않습니다.</li>
                <li><span className="badge badge-confirmed">사용자 확인</span> 사용자가 지정한 다른 경로의 누락 문제 위치에서도 동일하게 폴더가 정상 복구됨을 확인.</li>
              </ul>
            </div>
          </section>

          {/* 5. 설치 및 DSM 포트 예약 해결 */}
          <section className="guide-section">
            <h2>5. 상세 설치 가이드 및 DSM 포트 예약 회피 절차</h2>
            <p>
              Synology DSM 환경에서 외부 공개 포트 5006을 역방향 프록시로 전환하려 할 때, 가장 중요한 부분은 <strong>DSM의 비활성 포트 예약 잠금 현상</strong>을 해소하는 절차입니다.
            </p>

            <aside className="callout callout-warning">
              <div className="callout-title">⚠️ DSM 5006 포트 충돌 주의 (Synology 고유 동작)</div>
              <p>
                Synology DSM의 WebDAV Server 패키지는 단순히 설정 화면에서 &lsquo;HTTPS 활성화&rsquo; 체크를 끄기만 해도 내부 시스템에서 5006 포트의 예약을 해제하지 않고 유지합니다.
                또한 체크가 꺼진 상태에서는 포트 입력창이 비활성화되어 포트 번호를 수정해도 실제로 저장되지 않습니다.
              </p>
              <p>
                <strong>해결 절차:</strong> 반드시 WebDAV Server에서 HTTPS 활성화가 체크된 상태에서 포트 번호를 임의의 미사용 포트(예: <code>18081</code>)로 변경하고 [적용]을 누른 뒤, 저장이 완료되면 비로소 HTTPS 활성화 체크를 끄고 다시 [적용]해야 5006 포트가 완전히 풀려 역방향 프록시에서 사용할 수 있습니다.
              </p>
            </aside>

            <h3>단계별 설정 순서</h3>
            <ol className="guide-steps-list">
              <li>
                <strong>WebDAV Server 패키지 포트 변경 및 해제:</strong>
                <ol type="a">
                  <li>DSM &gt; <strong>WebDAV Server</strong> 패키지를 실행합니다.</li>
                  <li>HTTP 포트는 <code>5005</code> 활성화 상태(ON)를 유지합니다.</li>
                  <li>HTTPS 포트가 활성화(ON)된 상태에서 번호를 <code>18081</code>로 변경하고 [적용]합니다.</li>
                  <li>적용이 끝나면 HTTPS 활성화 체크박스를 해제(OFF)하고 다시 [적용]합니다. (최종 상태: 직접 HTTPS 18081 OFF, 기존 HTTP 5005 ON)</li>
                </ol>
              </li>

              <li>
                <strong>저장소 클론 및 Docker 로컬 빌드:</strong>
                <p>
                  공개 배포된 별도의 Docker Hub 이미지가 없으므로, 소스 저장소를 클론하여 저장소의 <code>docker-compose.yml</code> 구성을 변경 없이 그대로 사용하여 로컬 빌드 및 구동합니다.
                  (저장소 기본 설정: 컨테이너 이름 <code>webdav-compat-gateway</code>, 컨테이너 내부 포트 <code>8080</code>(<code>WEBDAV_LISTEN_PORT</code>)을 호스트 루프백 <code>127.0.0.1:18080:8080</code>(<code>GATEWAY_LOOPBACK_PORT</code>)으로 안전하게 매핑하며, XML 메모리 상한은 기본 <code>WEBDAV_MAX_XML_SIZE=10485760</code>(10MiB)으로 작동합니다.)
                </p>
                <pre className="code-block">
<code>{`# 1) NAS 터미널에서 소스 저장소 클론 및 작업 디렉토리 이동
git clone https://github.com/armsone/webdav-finder-compat.git /volume1/docker/webdav-finder-compat
cd /volume1/docker/webdav-finder-compat

# 2) 환경 변수 파일 생성 (env.example 복사)
cp env.example .env

# 3) .env 설정 내용 확인 및 수정
# WEBDAV_PUBLIC_ORIGIN은 필수(REQUIRED) 값으로, 실제 클라이언트가 접속하는 정확한 HTTPS 스킴+도메인(호스트)+포트여야 합니다.
# (호스트/포트 불일치 시 Destination 헤더 검증 실패로 COPY/MOVE 요청에서 400 Bad Request 오류가 발생합니다)
WEBDAV_UPSTREAM_URL=http://host.docker.internal:5005
WEBDAV_PUBLIC_ORIGIN=https://nas.example.com:5006

# 4) 저장소의 docker-compose.yml을 수정 없이 그대로 사용하여 빌드 및 백그라운드 실행
docker compose build && docker compose up -d`}</code>
                </pre>
              </li>

              <li>
                <strong>DSM 제어판 역방향 프록시(Reverse Proxy) 규칙 등록:</strong>
                <p>
                  DSM 제어판 &gt; <strong>로그인 포털</strong> &gt; <strong>고급</strong> &gt; <strong>역방향 프록시</strong>에서 새 규칙을 추가합니다:
                </p>
                <ul>
                  <li><strong>소스(Source):</strong> 프로토콜 <code>HTTPS</code>, 호스트 이름 <code>WEBDAV_PUBLIC_ORIGIN</code>과 동일한 실제 접속 호스트(예: <code>nas.example.com</code> — 와일드카드 <code>*</code>는 권장하지 않음), 포트 <code>5006</code></li>
                  <li><strong>대상(Destination):</strong> 프로토콜 <code>HTTP</code>, 호스트 이름 <code>127.0.0.1</code>, 포트 <code>18080</code></li>
                </ul>
                <p className="guide-body-text">
                  <em>참고:</em> HSTS 설정 변경은 별도로 필요하지 않으며, 기존 시스템 환경 구성을 그대로 유지합니다.
                </p>
              </li>

              <li>
                <strong>DSM 인증서 할당 및 호스트 일치 확인 (필수):</strong>
                <p>
                  역방향 프록시 규칙 추가 후, DSM 제어판 &gt; <strong>보안</strong> &gt; <strong>인증서</strong> &gt; <strong>설정</strong>(Security → Certificate → Settings)으로 이동합니다.
                  등록된 서비스 목록 중 새로 생성한 역방향 프록시 규칙(포트 5006)을 찾아, 기존에 발급받아 사용 중인 공인 SSL 인증서가 올바르게 할당되어 있는지 지정하고 접속 호스트가 일치하는지 확인합니다.
                </p>
              </li>
            </ol>

            <aside className="callout callout-security">
              <div className="callout-title">🔒 네트워크 격리 및 방화벽 안전 수칙</div>
              <p>
                <a href="https://docs.docker.com/engine/network/port-publishing/" target="_blank" rel="noopener noreferrer">Docker 공식 포트 매핑 문서</a>에 따르면 Docker 28.0 미만 버전에서는 호스트의 동일 L2 로컬 서브넷에 있는 기기가 localhost 포트로 접근할 수 있는 잠재적 위험이 명시되어 있습니다.
              </p>
              <p>
                따라서 <code>127.0.0.1</code> 매핑만으로 완전한 격리를 맹신하지 말고, <strong>공유기(포트포워딩)나 방화벽에서 내부 HTTP 5005 및 게이트웨이 포트(18080)를 외부(WAN)로 절대 개방하지 않아야 합니다.</strong> 오직 DSM의 공인 SSL 인증서가 적용된 HTTPS 5006 포트만 외부에 노출되어야 합니다.
              </p>
            </aside>
          </section>

          {/* 6. 안전한 원복 (Rollback) 절차 */}
          <section className="guide-section">
            <h2>6. 안전한 원복 (Rollback) 절차</h2>
            <p>
              본 구성은 Synology 원본 시스템의 Nginx 설정 파일이나 SSL 인증서 개인키를 직접 수정·복사하지 않는 비침습적 구조입니다.
              기존 구성으로 되돌려야 할 때는 반드시 다음 순서를 지켜 포트 충돌을 방지합니다.
            </p>
            
            <div className="rollback-box">
              <h3>원복 시 반드시 지켜야 할 순서 (충돌 방지)</h3>
              <ol>
                <li>
                  <strong>역방향 프록시 규칙 비활성화 또는 삭제:</strong><br />
                  DSM 제어판 &gt; 로그인 포털 &gt; 고급 &gt; 역방향 프록시에서 등록했던 <code>5006</code> 프록시 규칙을 먼저 비활성화하거나 삭제합니다. (이 작업을 먼저 해야 5006 포트 점유가 해제됩니다.)
                </li>
                <li>
                  <strong>WebDAV Server HTTPS 원복:</strong><br />
                  WebDAV Server 패키지를 열고 HTTPS 활성화에 체크한 뒤, 포트를 <code>18081</code>에서 원래의 <code>5006</code>으로 되돌리고 [적용]합니다.
                </li>
                <li>
                  <strong>Docker 컨테이너 중지:</strong><br />
                  실행 중인 <code>webdav-compat-gateway</code> 컨테이너를 중지(Stop)합니다.
                </li>
              </ol>
              <p className="rollback-note">
                주의: 순서가 바뀌어 역방향 프록시가 5006을 잡고 있는 상태에서 WebDAV Server의 HTTPS 5006을 켜려고 하면 포트 충돌 오류가 발생합니다. 반드시 역방향 프록시를 먼저 해제하십시오.
              </p>
            </div>
          </section>

          {/* 7. 솔직한 성능 고지 및 기술적 한계 */}
          <section className="guide-section">
            <h2>7. 성능 실측 미실시 및 기술적 한계 고지</h2>
            <p>
              투명하고 정직한 기술 공유를 위해 본 해결책 적용 시 인지해야 할 한계와 미확인 영역을 솔직히 밝힙니다:
            </p>
            
            <div className="limitations-grid">
              <div className="limit-card">
                <h4><span className="badge badge-unverified">미측정</span> Nginx 업로드 버퍼링 및 전송 속도</h4>
                <p>
                  보정 게이트웨이 자체는 일반 파일을 64KiB 조각으로 스트리밍하지만, 앞단에 위치한 DSM 내장 Nginx 역방향 프록시의 <a href="https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_request_buffering" target="_blank" rel="noopener noreferrer"><code>proxy_request_buffering</code></a> 기본 동작에 따라 대용량 업로드 시 Nginx 레벨에서의 버퍼링이 발생할 수 있습니다.
                  회선 속도 및 지연율에 대한 벤치마크 측정을 진행하지 않았으므로 <em>&ldquo;전송 속도 저하 없음&rdquo;</em>이나 <em>&ldquo;무손실 동등 속도&rdquo;</em>와 같은 주장은 하지 않습니다.
                </p>
              </div>

              <div className="limit-card">
                <h4><span className="badge badge-unverified">한계</span> 전체 폴더 무누락 보증 불가</h4>
                <p>
                  전체 홈 폴더 전수 비교는 사용자의 지시로 제외되었습니다.
                  따라서 <code>#설치어플</code>(161개 항목) 및 확인된 위치 외에 모든 환경, 모든 DSM 버전, 모든 폴더 구조에서의 무누락을 보증하지 않습니다.
                </p>
              </div>

              <div className="limit-card">
                <h4><span className="badge badge-unverified">주의</span> Apple 상용 OS 바이너리 미확인</h4>
                <p>
                  본 분석은 Apple이 공개한 오픈소스 <code>webdavfs</code>의 <code>webdav_parse.c</code> 소스 코드와 재현 증상을 바탕으로 한 추론입니다.
                  macOS 상용 릴리즈의 바이너리 직접 검증이나 Apple 공식 버그 확인이 아님을 밝힙니다.
                </p>
              </div>

              <div className="limit-card">
                <h4><span className="badge badge-measured">명시적 실패</span> NFD 경로 충돌 시 502 Bad Gateway</h4>
                <p>
                  동일 디렉토리 내 서로 다른 파일·폴더가 NFD 정규화 시 동일한 href로 겹치는 비정상적 충돌(NFD href collision)이 발생하면, 임의로 데이터를 합치거나 조용히 누락하지 않고 <code>502 Bad Gateway</code>로 즉시 명시적 실패 처리합니다.
                </p>
              </div>

              <div className="limit-card">
                <h4><span className="badge badge-measured">안전 설계</span> 10MiB 초과 XML 및 손상 구문 명시적 실패</h4>
                <p>
                  PROPFIND XML 응답 크기가 메모리 상한인 10MiB(<code>WEBDAV_MAX_XML_SIZE=10485760</code> 바이트)를 초과하거나 파싱할 수 없는 손상된(malformed) XML인 경우, 불완전하게 잘라내지 않고 즉시 명시적 오류로 중단하여 데이터 무결성을 보호합니다.
                </p>
              </div>
            </div>
          </section>

          {/* 8. 참고 문헌 및 리소스 */}
          <section className="guide-section">
            <h2>8. 참고 문헌 및 자료 출처</h2>
            <ul className="guide-references-list">
              <li>
                <strong>선행 연구:</strong> Leo Nikkilä, <em>&ldquo;Using Lua on Nginx to fix Finder&apos;s WebDAV quirks&rdquo;</em> (2024-02-04),{" "}
                <a href="https://lnikki.la/posts/using-lua-on-nginx-to-fix-finders-webdav-quirks.html" target="_blank" rel="noopener noreferrer">
                  https://lnikki.la/posts/using-lua-on-nginx-to-fix-finders-webdav-quirks.html
                </a>
              </li>
              <li>
                <strong>Apple 오픈소스:</strong> Apple Inc., <em>webdavfs — mount.tproj/webdav_parse.c (GetNormalizedPathLength / GetComponentName)</em>,{" "}
                <a href="https://github.com/apple-oss-distributions/webdavfs/blob/a239d37d7407700119e9c92f66f38ab0a296cb0f/mount.tproj/webdav_parse.c#L1415-L1538" target="_blank" rel="noopener noreferrer">
                  GitHub apple-oss-distributions/webdavfs
                </a>
              </li>
              <li>
                <strong>유니코드 정규화 표준:</strong> Unicode Consortium, <em>Unicode Standard Annex #15: Unicode Normalization Forms (UAX #15)</em>,{" "}
                <a href="https://www.unicode.org/reports/tr15/" target="_blank" rel="noopener noreferrer">
                  https://www.unicode.org/reports/tr15/
                </a>
              </li>
              <li>
                <strong>Python 비동기 클라이언트:</strong> aiohttp Contributors, <em>aiohttp Client Reference (Streaming &amp; Auto-decompression)</em>,{" "}
                <a href="https://docs.aiohttp.org/en/stable/client_reference.html" target="_blank" rel="noopener noreferrer">
                  https://docs.aiohttp.org/en/stable/client_reference.html
                </a>
              </li>
              <li>
                <strong>Docker 포트 바인딩 보안:</strong> Docker Documentation, <em>Docker Engine: Port publishing and mapping</em>,{" "}
                <a href="https://docs.docker.com/engine/network/port-publishing/" target="_blank" rel="noopener noreferrer">
                  https://docs.docker.com/engine/network/port-publishing/
                </a>
              </li>
              <li>
                <strong>Nginx 프록시 버퍼링:</strong> Nginx Documentation, <em>Module ngx_http_proxy_module: proxy_request_buffering</em>,{" "}
                <a href="https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_request_buffering" target="_blank" rel="noopener noreferrer">
                  https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_request_buffering
                </a>
              </li>
            </ul>

            <div className="guide-bottom-nav">
              <div className="bottom-card">
                <h3>오픈소스 저장소에서 코드 확인하기</h3>
                <p>본 해결책의 Python 게이트웨이 전체 소스코드와 docker-compose 템플릿을 GitHub에서 확인할 수 있습니다.</p>
                <Link href="https://github.com/armsone/webdav-finder-compat" target="_blank" rel="noopener noreferrer" className="button button-primary">
                  GitHub: armsone/webdav-finder-compat 열기 ↗
                </Link>
              </div>
              <div className="bottom-card">
                <h3>커뮤니티 공유용 단일 HTML 다운로드</h3>
                <p>네트워크가 없는 오프라인 환경이나 다른 커뮤니티 게시판 공유를 위한 자립형(Self-contained) 단일 HTML 문서입니다.</p>
                <a href="/guides/webdav-macos-folders/community-guide.html" download className="button button-quiet">
                  단일 파일 문서 (.html) 다운로드 ↓
                </a>
              </div>
            </div>
          </section>
        </article>
      </main>

      <SiteFooter />

      {/* 가이드 전용 반응형 스타일링 */}
      <style>{`
        .guide-page-wrapper {
          background-color: var(--paper, #f5f2eb);
          color: var(--ink, #242621);
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }
        .guide-main {
          flex: 1 0 auto;
          padding-block: 40px 100px;
        }
        .guide-article {
          max-width: 880px;
          margin-inline: auto;
        }
        .guide-header {
          margin-bottom: 48px;
        }
        .guide-breadcrumb {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.84rem;
          color: var(--muted, #6e6d65);
          margin-bottom: 20px;
        }
        .guide-breadcrumb a {
          color: var(--ink-secondary, #4a4d45);
          font-weight: 600;
          transition: color 0.2s;
        }
        .guide-breadcrumb a:hover {
          color: var(--accent, #a74628);
        }
        .breadcrumb-separator {
          color: var(--line-strong, rgba(36, 38, 33, 0.22));
        }
        .guide-eyebrow {
          font: 700 0.72rem/1 var(--font-geist-mono), monospace;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--accent, #a74628);
          margin: 0 0 16px;
        }
        .guide-title {
          font-size: clamp(2.2rem, 4.2vw, 3.2rem);
          line-height: 1.18;
          letter-spacing: -0.04em;
          font-weight: 750;
          color: var(--ink, #242621);
          margin: 0 0 24px;
          word-break: keep-all;
        }
        .guide-title-sub {
          display: block;
          font-size: clamp(1.3rem, 2.4vw, 1.8rem);
          font-weight: 600;
          color: var(--ink-secondary, #4a4d45);
          margin-top: 10px;
          letter-spacing: -0.025em;
        }
        .guide-meta-bar {
          display: flex;
          flex-wrap: wrap;
          gap: 18px 32px;
          padding-block: 18px;
          border-block: 1px solid var(--line, rgba(36, 38, 33, 0.12));
          margin-bottom: 28px;
          font-size: 0.85rem;
        }
        .guide-meta-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .meta-label {
          font: 650 0.68rem var(--font-geist-mono), monospace;
          color: var(--muted, #6e6d65);
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }
        .meta-link {
          color: var(--accent, #a74628);
          font-weight: 600;
          text-decoration: underline;
          text-underline-offset: 3px;
        }
        .meta-link-download {
          color: var(--ink, #242621);
          font-weight: 600;
          text-decoration: underline;
          text-underline-offset: 3px;
        }
        .guide-action-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 20px;
        }
        .guide-attribution-box {
          background: #ffffff;
          border: 1px solid var(--line, rgba(36, 38, 33, 0.12));
          border-left: 5px solid var(--accent, #a74628);
          border-radius: 16px;
          padding: 24px 28px;
          margin-bottom: 56px;
          box-shadow: 0 6px 20px rgba(36, 38, 33, 0.04);
        }
        .attribution-badge {
          display: inline-block;
          font: 700 0.72rem var(--font-geist-mono), monospace;
          color: var(--accent, #a74628);
          letter-spacing: 0.06em;
          text-transform: uppercase;
          margin-bottom: 12px;
        }
        .guide-attribution-box p {
          margin: 0 0 16px;
          font-size: 0.94rem;
          line-height: 1.75;
          color: var(--ink-secondary, #4a4d45);
        }
        .guide-attribution-box a {
          color: var(--accent, #a74628);
          font-weight: 600;
          text-decoration: underline;
        }
        .facts-legend {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 8px 16px;
          font-size: 0.76rem;
          color: var(--muted, #6e6d65);
          padding-top: 14px;
          border-top: 1px dashed var(--line, rgba(36, 38, 33, 0.12));
        }
        .badge {
          display: inline-flex;
          align-items: center;
          padding: 3px 8px;
          border-radius: 6px;
          font: 700 0.68rem var(--font-geist-mono), monospace;
          letter-spacing: 0.04em;
          white-space: nowrap;
        }
        .badge-measured {
          background: #dcfce7;
          color: #166534;
          border: 1px solid #bbf7d0;
        }
        .badge-confirmed {
          background: #e0f2fe;
          color: #0369a1;
          border: 1px solid #bae6fd;
        }
        .badge-inferred {
          background: #fef3c7;
          color: #92400e;
          border: 1px solid #fde68a;
        }
        .badge-unverified {
          background: #fee2e2;
          color: #991b1b;
          border: 1px solid #fecaca;
        }
        .guide-section {
          margin-bottom: 64px;
        }
        .guide-section h2 {
          font-size: clamp(1.6rem, 2.8vw, 2.1rem);
          line-height: 1.25;
          letter-spacing: -0.035em;
          font-weight: 700;
          color: var(--ink, #242621);
          margin: 0 0 20px;
          padding-bottom: 12px;
          border-bottom: 1px solid var(--line, rgba(36, 38, 33, 0.12));
          word-break: keep-all;
        }
        .guide-section h3 {
          font-size: 1.25rem;
          font-weight: 650;
          letter-spacing: -0.02em;
          color: var(--ink, #242621);
          margin: 32px 0 14px;
        }
        .guide-section p, .guide-section li {
          font-size: 0.96rem;
          line-height: 1.8;
          color: var(--ink-secondary, #4a4d45);
        }
        .guide-section p {
          margin: 0 0 18px;
        }
        .guide-section a {
          color: var(--accent, #a74628);
          font-weight: 600;
          text-decoration: underline;
          text-underline-offset: 3px;
        }
        .symptom-card {
          background: #ffffff;
          border: 1px solid var(--line, rgba(36, 38, 33, 0.12));
          border-radius: 18px;
          padding: 24px 28px;
          margin-block: 24px;
          box-shadow: 0 4px 16px rgba(36, 38, 33, 0.03);
        }
        .symptom-card h3 {
          margin-top: 0;
          margin-bottom: 14px;
        }
        .symptom-card ul {
          margin: 0 0 16px;
          padding-left: 20px;
        }
        .symptom-card li {
          margin-bottom: 8px;
        }
        .symptom-note {
          margin: 0;
          font-size: 0.88rem !important;
          color: var(--muted, #6e6d65) !important;
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }
        .table-responsive {
          overflow-x: auto;
          margin-block: 24px;
          border-radius: 14px;
          border: 1px solid var(--line, rgba(36, 38, 33, 0.12));
          background: #ffffff;
        }
        .guide-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.88rem;
          text-align: left;
        }
        .guide-table th, .guide-table td {
          padding: 12px 18px;
          border-bottom: 1px solid var(--line, rgba(36, 38, 33, 0.12));
        }
        .guide-table th {
          background: #faf8f5;
          font-weight: 650;
          color: var(--ink, #242621);
          white-space: nowrap;
        }
        .guide-table tr:last-child td {
          border-bottom: none;
        }
        .guide-table code {
          background: #f1ede4;
          padding: 2px 6px;
          border-radius: 5px;
          font-family: var(--font-geist-mono), monospace;
          font-size: 0.82rem;
        }
        .row-fail td {
          background: #fff5f5;
          color: #991b1b;
        }
        .row-pass td {
          background: #f0fdf4;
          color: #166534;
        }
        .row-fix td {
          background: #eff6ff;
          color: #1e40af;
          font-weight: 600;
        }
        .callout {
          border-radius: 16px;
          padding: 22px 26px;
          margin-block: 28px;
          border: 1px solid var(--line, rgba(36, 38, 33, 0.12));
          background: #ffffff;
        }
        .callout-title {
          font-weight: 700;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.95rem;
        }
        .callout-inferred {
          background: #fffdf7;
          border-color: #fde68a;
        }
        .callout-warning {
          background: #fff8f6;
          border-color: #ffcfc4;
        }
        .callout-security {
          background: #f8fbfd;
          border-color: #bae6fd;
        }
        .diagram-wrapper {
          margin-block: 36px;
          background: #1e2025;
          border-radius: 20px;
          padding: 24px;
          color: #ffffff;
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.2);
        }
        .diagram-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          margin-bottom: 18px;
          flex-wrap: wrap;
        }
        .diagram-tag {
          background: #e11d48;
          color: #ffffff;
          padding: 4px 10px;
          border-radius: 999px;
          font: 700 0.68rem var(--font-geist-mono), monospace;
          letter-spacing: 0.05em;
        }
        .diagram-title {
          font-size: 0.88rem;
          font-weight: 600;
          color: #e5e7eb;
        }
        .guide-inline-svg {
          width: 100%;
          height: auto;
          display: block;
          margin: 0 auto;
        }
        .diagram-caption {
          margin: 16px 0 0;
          font-size: 0.78rem;
          color: #9ca3af;
          text-align: center;
          line-height: 1.5;
        }
        .screenshots-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 24px;
          margin-block: 28px;
        }
        .guide-figure {
          margin: 0;
          background: #ffffff;
          border: 1px solid var(--line, rgba(36, 38, 33, 0.12));
          border-radius: 18px;
          overflow: hidden;
          box-shadow: 0 8px 24px rgba(36, 38, 33, 0.06);
          display: flex;
          flex-direction: column;
        }
        .figure-badge {
          background: #242621;
          color: #f5f2eb;
          font: 700 0.65rem var(--font-geist-mono), monospace;
          padding: 6px 14px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }
        .guide-screenshot-img {
          width: 100%;
          height: auto;
          aspect-ratio: 16 / 10;
          object-fit: cover;
          display: block;
          border-bottom: 1px solid var(--line, rgba(36, 38, 33, 0.12));
        }
        .guide-figure figcaption {
          padding: 16px 20px;
          font-size: 0.82rem;
          line-height: 1.6;
          color: var(--ink-secondary, #4a4d45);
          flex-grow: 1;
        }
        .guide-figure figcaption strong {
          color: var(--ink, #242621);
        }
        .verification-box {
          background: #ffffff;
          border: 1px solid var(--line, rgba(36, 38, 33, 0.12));
          border-radius: 18px;
          padding: 24px 28px;
          margin-block: 28px;
        }
        .verification-box h3 {
          margin-top: 0;
          margin-bottom: 16px;
        }
        .verification-box ul {
          margin: 0;
          padding-left: 20px;
        }
        .verification-box li {
          margin-bottom: 10px;
          display: flex;
          align-items: baseline;
          gap: 8px;
          flex-wrap: wrap;
        }
        .guide-steps-list {
          padding-left: 22px;
          margin-block: 20px;
        }
        .guide-steps-list > li {
          margin-bottom: 24px;
        }
        .code-block {
          background: #1c1d22;
          color: #e6e6ef;
          padding: 18px 22px;
          border-radius: 12px;
          overflow-x: auto;
          font-family: var(--font-geist-mono), monospace;
          font-size: 0.82rem;
          line-height: 1.6;
          margin-block: 14px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .rollback-box {
          background: #ffffff;
          border: 1px solid var(--line, rgba(36, 38, 33, 0.12));
          border-radius: 18px;
          padding: 26px 30px;
          box-shadow: 0 4px 16px rgba(36, 38, 33, 0.03);
        }
        .rollback-box h3 {
          margin-top: 0;
          margin-bottom: 16px;
        }
        .rollback-box ol {
          margin: 0 0 16px;
          padding-left: 20px;
        }
        .rollback-box li {
          margin-bottom: 14px;
        }
        .rollback-note {
          margin: 0;
          font-size: 0.85rem !important;
          color: var(--accent, #a74628) !important;
          font-weight: 550;
        }
        .limitations-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 18px;
          margin-block: 24px;
        }
        .limit-card {
          background: #ffffff;
          border: 1px solid var(--line, rgba(36, 38, 33, 0.12));
          border-radius: 16px;
          padding: 20px 22px;
        }
        .limit-card h4 {
          margin: 0 0 12px;
          font-size: 0.95rem;
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }
        .limit-card p {
          font-size: 0.84rem;
          line-height: 1.65;
          margin: 0;
          color: var(--ink-secondary, #4a4d45);
        }
        .guide-references-list {
          padding-left: 20px;
          margin-block: 20px;
        }
        .guide-references-list li {
          margin-bottom: 14px;
          font-size: 0.88rem;
          line-height: 1.7;
        }
        .guide-bottom-nav {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-top: 48px;
          padding-top: 36px;
          border-top: 1px solid var(--line, rgba(36, 38, 33, 0.12));
        }
        .bottom-card {
          background: #ffffff;
          border: 1px solid var(--line, rgba(36, 38, 33, 0.12));
          border-radius: 18px;
          padding: 24px 26px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 18px;
        }
        .bottom-card h3 {
          margin: 0 0 8px;
          font-size: 1.15rem;
        }
        .bottom-card p {
          margin: 0;
          font-size: 0.86rem;
          color: var(--muted, #6e6d65);
          line-height: 1.65;
        }
        @media (max-width: 860px) {
          .screenshots-grid {
            grid-template-columns: 1fr;
          }
          .limitations-grid {
            grid-template-columns: 1fr;
          }
          .guide-bottom-nav {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
