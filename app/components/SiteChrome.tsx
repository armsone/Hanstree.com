import Link from "next/link";
import { getSiteBrand } from "../site-brand";
import { SiteHeaderBrand } from "./SiteHeaderBrand";

export async function SiteHeader({ currentPageName }: { currentPageName?: string } = {}) {
  const brand = await getSiteBrand();
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <SiteHeaderBrand name={brand.name} koreanName={brand.koreanName} icon={brand.icon} showNasFinderIcon={brand.name === "NASFINDER"} currentPageName={currentPageName} />
        <nav aria-label="주요 메뉴">
          <a href="/#works">만든 것들</a>
          <details className="nav-space-menu">
            <summary>스페이스</summary>
            <div className="nav-space-panel">
              <a href="/space/hanstree">한스트리 스튜디오</a>
              <a href="/space/hanstree/instagram">먹탐자 Instagram</a>
            </div>
          </details>
          <a href="/#apps">제품</a>
          <a href="/#contact">이야기</a>
          <Link href="/apps/nasfinder/support">지원</Link>
        </nav>
      </div>
    </header>
  );
}

export async function SiteFooter() {
  const brand = await getSiteBrand();
  return (
    <footer className="site-footer">
      <div className="shell footer-inner">
        <div>
          <Link className="wordmark" href="/"><span>{brand.name}</span></Link>
          <p>직접 만들고 오래 다듬어 온 결과물을 소개합니다.</p>
        </div>
        <div className="footer-links">
          <a href="/#works">만든 것들</a>
          <Link href="/space/hanstree">한스트리 스튜디오</Link>
          <a href="/#records">사이트 기록</a>
          <Link href="/apps/nasfinder/privacy">개인정보처리방침</Link>
          <Link href="/apps/nasfinder/support">지원</Link>
          <Link href="https://github.com/armsone">GitHub</Link>
          <Link href="/admin" aria-label="관리자 로그인">관리자</Link>
        </div>
        <p className="copyright">© {new Date().getFullYear()} {brand.koreanName} · armsone</p>
      </div>
    </footer>
  );
}
