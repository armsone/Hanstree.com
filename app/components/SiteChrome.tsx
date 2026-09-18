import Link from "next/link";
import { findAppByName, productFamilies, productFamilyOf } from "../data";
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

// 푸터는 사이트맵 역할을 합니다. 브랜드 · 제품 · 스페이스 · 지원과 고지 네 묶음으로 나누고,
// 실제 존재하는 경로(홈 해시, /space, /apps/{slug}/{privacy|support|terms}, /admin)만 사용합니다.
export async function SiteFooter({ currentPageName }: ChromeProps = {}) {
  const { brand, app, appsHref, supportHref, supportLabel, privacyHref } = await chromeLinks(currentPageName);
  const family = app ? productFamilyOf(app.slug) : undefined;
  return (
    <footer className="site-footer">
      <div className="shell footer-inner">
        <div className="footer-brand">
          <Link className="wordmark" href="/"><span>{brand.name}</span></Link>
          <p>직접 만들고 오래 다듬어 온 결과물을 소개합니다.</p>
          <p className="footer-brand-parent">Hanstree가 만드는 앱과 공간 · <Link href="https://github.com/armsone">GitHub</Link></p>
        </div>
        <nav className="footer-sitemap" aria-label="사이트맵">
          <div className="footer-group">
            <p className="footer-group-title" id="footer-products">제품</p>
            <ul aria-labelledby="footer-products">
              <li><Link href="/#works">만든 것들</Link></li>
              <li><Link href="/#apps">모든 제품</Link></li>
              {productFamilies.map((item) => (
                <li key={item.id}><Link href={`/#family-${item.id}`} aria-current={family?.id === item.id ? "true" : undefined}>{item.name}</Link></li>
              ))}
              <li><Link href="/#testflight">TestFlight 체험</Link></li>
              <li><Link href="/#android-releases">Android 최신판</Link></li>
            </ul>
          </div>
          <div className="footer-group">
            <p className="footer-group-title" id="footer-spaces">스페이스</p>
            <ul aria-labelledby="footer-spaces">
              <li><Link href="/space/hanstree">한스트리 스튜디오</Link></li>
              <li><Link href="/space/hanstree/instagram">먹탐자 Instagram</Link></li>
              <li><Link href="/#contact">이야기와 문의</Link></li>
              <li><Link href="/#records">사이트 기록</Link></li>
            </ul>
          </div>
          <div className="footer-group">
            <p className="footer-group-title" id="footer-support">{app ? `${app.name} 지원과 고지` : "지원과 고지"}</p>
            <ul aria-labelledby="footer-support">
              {app && <li><Link href={`/apps/${app.slug}`}>{app.name} 제품 페이지</Link></li>}
              {app && family && <li><Link href={appsHref}>같은 계열 · {family.name}</Link></li>}
              <li><Link href={supportHref}>{app ? `${app.name} 지원` : supportLabel}</Link></li>
              <li><Link href={privacyHref}>{app ? `${app.name} 개인정보처리방침` : "개인정보처리방침"}</Link></li>
              {app && <li><Link href={`/apps/${app.slug}/terms`}>{app.name} 이용약관</Link></li>}
              <li><Link href="/admin" aria-label="관리자 로그인">관리자</Link></li>
            </ul>
          </div>
        </nav>
        <p className="copyright">© {new Date().getFullYear()} {brand.koreanName} · armsone</p>
      </div>
    </footer>
  );
}
