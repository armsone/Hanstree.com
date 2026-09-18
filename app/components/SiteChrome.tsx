import Link from "next/link";
import { findAppByName, productFamilyOf } from "../data";
import { getSiteBrand } from "../site-brand";
import { SiteHeaderBrand } from "./SiteHeaderBrand";

type ChromeProps = { currentPageName?: string };

// 지원·개인정보 링크는 지금 보고 있는 제품을 따라갑니다. 제품 밖에서는 NasFinder 사이트일 때만 NasFinder 지원으로,
// 그 외에는 홈의 이야기(문의) 영역으로 보냅니다. 존재하지 않는 지원 페이지는 만들지 않습니다.
async function chromeLinks(currentPageName?: string) {
  const brand = await getSiteBrand();
  const app = findAppByName(currentPageName);
  const family = app ? productFamilyOf(app.slug) : undefined;
  const nasFinderSite = brand.name === "NASFINDER";
  return {
    brand,
    app,
    appsHref: family ? `/#family-${family.id}` : "/#apps",
    supportHref: app ? `/apps/${app.slug}/support` : nasFinderSite ? "/apps/nasfinder/support" : "/#contact",
    supportLabel: app || nasFinderSite ? "지원" : "문의",
    showHeaderSupport: Boolean(app) || nasFinderSite,
    privacyHref: app ? `/apps/${app.slug}/privacy` : "/apps/nasfinder/privacy",
  };
}

export async function SiteHeader({ currentPageName }: ChromeProps = {}) {
  const { brand, app, appsHref, supportHref, supportLabel, showHeaderSupport } = await chromeLinks(currentPageName);
  const supportTitle = app ? `${app.name} 지원과 문의` : undefined;
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <SiteHeaderBrand name={brand.name} koreanName={brand.koreanName} icon={brand.icon} showNasFinderIcon={brand.name === "NASFINDER"} currentPageName={currentPageName} />
        <nav className="site-nav" aria-label="주요 메뉴">
          <Link href="/#works">만든 것들</Link>
          <details className="nav-space-menu">
            <summary>스페이스</summary>
            <div className="nav-space-panel">
              <Link href="/space/hanstree">한스트리 스튜디오</Link>
              <Link href="/space/hanstree/instagram">먹탐자 Instagram</Link>
            </div>
          </details>
          <Link href={appsHref}>제품</Link>
          <Link href="/#contact">이야기</Link>
          {showHeaderSupport && <Link href={supportHref} title={supportTitle}>{supportLabel}</Link>}
        </nav>
        {/* 작은 화면 전용 메뉴. 같은 링크를 details로 접어 두고 CSS로 화면 크기에 따라 하나만 보여줍니다. */}
        <details className="nav-mobile">
          <summary>메뉴</summary>
          <div className="nav-mobile-panel" role="navigation" aria-label="작은 화면 메뉴">
            <Link href="/#works">만든 것들</Link>
            <Link href={appsHref}>{app ? "제품 · 같은 계열" : "제품"}</Link>
            <Link href="/space/hanstree">한스트리 스튜디오</Link>
            <Link href="/space/hanstree/instagram">먹탐자 Instagram</Link>
            <Link href="/#contact">이야기</Link>
            {showHeaderSupport && <Link href={supportHref}>{app ? `${app.name} 지원` : supportLabel}</Link>}
          </div>
        </details>
      </div>
    </header>
  );
}

export async function SiteFooter({ currentPageName }: ChromeProps = {}) {
  const { brand, app, appsHref, supportHref, supportLabel, privacyHref } = await chromeLinks(currentPageName);
  return (
    <footer className="site-footer">
      <div className="shell footer-inner">
        <div>
          <Link className="wordmark" href="/"><span>{brand.name}</span></Link>
          <p>직접 만들고 오래 다듬어 온 결과물을 소개합니다.</p>
        </div>
        <div className="footer-links">
          <Link href="/#works">만든 것들</Link>
          {app && <Link href={appsHref}>같은 계열 제품</Link>}
          <Link href="/space/hanstree">한스트리 스튜디오</Link>
          <Link href="/#records">사이트 기록</Link>
          <Link href={privacyHref}>{app ? `${app.name} 개인정보처리방침` : "개인정보처리방침"}</Link>
          <Link href={supportHref}>{app ? `${app.name} 지원` : supportLabel}</Link>
          <Link href="https://github.com/armsone">GitHub</Link>
          <Link href="/admin" aria-label="관리자 로그인">관리자</Link>
        </div>
        <p className="copyright">© {new Date().getFullYear()} {brand.koreanName} · armsone</p>
      </div>
    </footer>
  );
}
