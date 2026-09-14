import Image from "next/image";
import Link from "next/link";
import type { AppData } from "../data";
import { SiteFooter, SiteHeader } from "./SiteChrome";

function DetailMark({ type }: { type: "inspect" | "select" | "eject" }) {
  return <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{type === "inspect" ? <><circle cx="21" cy="20" r="11"/><path d="m29 29 10 10M17 20h8M21 16v8"/></> : type === "select" ? <><rect x="9" y="9" width="30" height="30" rx="7"/><path d="m16 24 6 6 11-13"/></> : <><path d="m24 10 14 19H10Z"/><path d="M11 37h26"/></>}</svg>;
}

export function CleanUSBPage({ app }: { app: AppData }) {
  const platform = app.platforms[0];
  return <main className="app-page app-cleanusb cleanusb-editorial">
    <SiteHeader currentPageName={app.name}/>
    <section className="cu-cover shell">
      <Link className="breadcrumb" href="/#apps">← 한스트리의 모든 앱</Link>
      <div className="cu-cover-grid">
        <div className="cu-cover-copy">
          <div className="cu-identity"><Image src="/apps/cleanusb/icon-card.webp" alt="CleanUSB 브랜드 아이콘" width={80} height={80} priority unoptimized/><span>CleanUSB<small>Mac을 위한 작은 마무리</small></span></div>
          <p className="cu-kicker">정리의 끝에, 클린USB.</p>
          <h1>파일은 전하고.<br/>흔적은 덜고.</h1>
          <p className="cu-lead">USB를 건네기 전, 외장 드라이브를 뽑기 전.<br/>불필요한 보조 파일을 확인하고 골라 정리하세요.</p>
          <div className="cu-actions"><a className="cu-primary" href={platform.url}>Mac용 무료 다운로드 <span aria-hidden="true">↗</span></a><a className="cu-secondary" href="#guide">어떻게 쓰나요? ↓</a></div>
          <p className="cu-compat">macOS 13 이상 · Apple Silicon & Intel<br/><span>0.1.0 · Developer ID 서명 · Apple 공증 완료</span></p>
        </div>
        <figure className="cu-cover-art"><Image src="/apps/cleanusb/campaign-hero.webp" alt="금속 USB와 외장 SSD, 보조 파일 정리를 표현한 CleanUSB 브랜드 이미지" width={1536} height={1024} priority sizes="(max-width: 900px) 100vw, 60vw" unoptimized/><figcaption><span>CleanUSB</span><span>확인 · 선택 · 꺼내기</span></figcaption></figure>
      </div>
    </section>
    <nav className="cu-nav" aria-label="클린USB 페이지 메뉴"><div className="shell"><a href="#product-campaign">쓰는 이유</a><a href="#guide">사용 흐름</a><a href="#screens">실제 화면</a><a href="#download">다운로드</a><a href="#support">안내와 지원</a></div></nav>
    <section className="cu-intro shell" id="product-campaign">
      <p className="cu-kicker">작업을 마치는 좋은 습관</p>
      <h2>전하고 싶은 파일 사이에,<br/><span>굳이 남길 필요 없는 것들.</span></h2>
      <p>Mac에서 쓰던 USB에는 폴더 보기 정보를 담은 .DS_Store 같은 보조 파일이 남을 수 있습니다.<br/>클린USB는 정리 대상을 먼저 보여주고, 마지막 선택을 나에게 맡깁니다.</p>
      <div className="cu-file-labels"><span>.DS_Store <small>기본 정리 대상</small></span><span>Thumbs.db <small>기본 정리 대상</small></span><span>._ 파일 <small>필요할 때만 별도 선택</small></span></div>
    </section>
    <section className="cu-selection">
      <div className="shell cu-selection-grid">
        <figure><Image src="/apps/cleanusb/campaign-selection.webp" alt="확대경으로 세 파일 중 한 항목을 살펴보는 선택 정리 개념 이미지" width={1536} height={1024} sizes="(max-width: 900px) 100vw, 60vw" unoptimized/><figcaption>삭제 전 확인과 선택을 표현한 브랜드 이미지</figcaption></figure>
        <div><p className="cu-kicker">많이 지우는 것보다, 잘 고르는 것.</p><h2>먼저 보고.<br/>내가 고르고.<br/><span>그다음 정리.</span></h2><p>파일 종류와 크기, 위치를 확인하세요. 경로를 검색하거나 Finder에서 직접 살펴본 뒤, 필요한 항목만 선택할 수 있습니다.</p><p className="cu-side-note">연결만으로 지우지 않습니다.<br/>검사와 정리는 내가 시작할 때만 진행됩니다.</p></div>
      </div>
    </section>
    <section className="cu-workflow shell" id="guide">
      <div className="cu-section-heading"><div><p className="cu-kicker">뽑기 전, 세 번의 확인</p><h2>마무리까지<br/>자연스럽게.</h2></div><p>한국어 안내를 따라 검사에서 꺼내기까지.<br/>복잡한 설정 없이, 필요한 순간에 사용하세요.</p></div>
      <div className="cu-steps">{[
        {type:"inspect" as const,number:"01",title:"연결하고, 확인",body:"USB나 외장 드라이브를 선택하고 ‘정리할 파일 확인’을 누르세요. 종류와 용량, 경로를 한눈에 살펴봅니다."},
        {type:"select" as const,number:"02",title:"고르고, 정리",body:"정리할 항목을 선택하고 확인 창에서 실행하세요. 검사 중에는 취소할 수 있고, 파일별 실패 이유도 알려줍니다."},
        {type:"eject" as const,number:"03",title:"마쳤다면, 꺼내기",body:"결과를 확인하고 드라이브를 꺼내세요. 검사나 정리가 끝나지 않았거나 오류가 있으면 자동 꺼내기를 진행하지 않습니다."},
      ].map(step=><article key={step.number}><div className="cu-step-top"><DetailMark type={step.type}/><span>{step.number}</span></div><h3>{step.title}</h3><p>{step.body}</p></article>)}</div>
    </section>
    <section className="cu-menubar shell"><div className="cu-eject-medallion"><DetailMark type="eject"/></div><div><p className="cu-kicker">손 닿는 곳에, 메뉴바</p><h2>창을 다시 찾을 필요 없이.</h2><p>메뉴바 아이콘에서 정리 창을 열거나 드라이브를 바로 꺼낼 수 있습니다.<br/>최근 작업 요약은 이 Mac에 최대 20개 보관합니다.</p></div></section>
    <section className="cu-screens" id="screens"><div className="shell"><div className="cu-section-heading"><div><p className="cu-kicker">실제 앱 화면</p><h2>익숙한 Mac.<br/>편안한 한국어.</h2></div><p>장치가 없을 때도 현재 상태와 다음 할 일을 안내합니다.</p></div><figure><Image src="/apps/cleanusb/screens/start.png" alt="CleanUSB 0.1.0 실제 시작 화면: 연결된 외장 디스크가 없다는 한국어 안내" width={980} height={640} sizes="(max-width: 900px) 92vw, 980px" unoptimized/><figcaption>CleanUSB 0.1.0 실제 캡처 · 외장 드라이브가 연결되지 않은 상태</figcaption></figure></div></section>
    <section className="cu-download shell" id="download"><Image src="/apps/cleanusb/icon-v2.webp" alt="클린USB 브랜드 아이콘" width={128} height={128} unoptimized/><p className="cu-kicker">다음 USB를 뽑기 전에</p><h2>마지막 정리도,<br/>깔끔하게.</h2><p>Mac용 CleanUSB 0.1.0<br/>macOS 13 이상 · Apple Silicon·Intel Universal</p><a className="cu-primary" href={platform.url}>설치 파일 다운로드 ↗</a><p className="cu-install-note">DMG를 열고 CleanUSB를 응용 프로그램 폴더로 옮기세요.<br/>Developer ID 서명과 Apple 공증을 완료한 설치 파일입니다.</p><a className="cu-text-link" href="https://github.com/armsone/CleanUSB-MacOS/releases/tag/v0.1.0">릴리즈 노트와 소스 보기 ↗</a></section>
    <section className="cu-support shell" id="support"><div><h2>사용 전에 알아두세요.</h2><p>검사는 기기 안에서 처리하며 파일 내용을 서버로 보내지 않습니다. 내부 디스크·네트워크 드라이브·읽기 전용 볼륨·디스크 이미지는 정리 대상에서 제외합니다.</p><p>삭제는 휴지통을 거치지 않습니다. ._ 파일에는 태그나 리소스 포크가 들어갈 수 있으므로 필요한 경우에만 선택하세요.</p><details><summary>지원 범위와 확인한 내용</summary><p>Universal 빌드, 서명·공증, 설치·실행 및 공개 다운로드를 확인했습니다. 실물 USB 삭제·꺼내기와 Intel Mac·이전 macOS 실행은 아직 검증하지 않았습니다. 이 페이지의 입체 이미지는 기능을 설명하는 브랜드 이미지이며, 실제 앱 화면은 별도로 표시했습니다. 새 브랜드 아이콘은 홈페이지에 먼저 적용했으며 0.1.0 설치 파일의 기존 아이콘은 유지됩니다.</p></details></div><div className="cu-support-links"><Link href="/apps/cleanusb/support">지원과 문의 ↗</Link><Link href="/apps/cleanusb/privacy">개인정보처리방침 ↗</Link><Link href="/apps/cleanusb/terms">이용약관 ↗</Link></div></section>
    <SiteFooter/>
  </main>;
}
