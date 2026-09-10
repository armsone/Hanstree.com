"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type SiteHeaderBrandProps = {
  name: string;
  koreanName: string;
  icon: string;
  showNasFinderIcon: boolean;
  currentPageName?: string;
};

export function SiteHeaderBrand({ name, koreanName, icon, showNasFinderIcon, currentPageName }: SiteHeaderBrandProps) {
  const [showCurrentPage, setShowCurrentPage] = useState(false);

  useEffect(() => {
    if (!currentPageName) return;
    const updateCurrentPageVisibility = () => setShowCurrentPage(window.scrollY > 80);
    updateCurrentPageVisibility();
    window.addEventListener("scroll", updateCurrentPageVisibility, { passive: true });
    return () => window.removeEventListener("scroll", updateCurrentPageVisibility);
  }, [currentPageName]);

  const ariaLabel = currentPageName ? `${koreanName} · ${currentPageName} 홈` : `${koreanName} 홈`;

  return (
    <a className={`wordmark header-wordmark${showCurrentPage ? " header-wordmark-current" : ""}`} href="/" aria-label={ariaLabel}>
      <Image className={`header-brand-icon${showNasFinderIcon ? " header-brand-icon-nasfinder" : ""}`} src={icon} alt="" width={886} height={886} sizes="32px" />
      <span>{name}</span>
      {currentPageName && <span className="header-current-page" aria-hidden="true">{currentPageName}</span>}
    </a>
  );
}
