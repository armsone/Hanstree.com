import type { AppData } from "./data";

export function appCardImage(app: AppData) {
  const featuredCards: Partial<Record<AppData["slug"], string>> = {
    aiplaygrand: "/apps/aiplaygrand/hero-20260918.webp",
    ppabang: "/apps/ppabang/hero-20260918.webp",
    ccmb: "/apps/ccmb/home-card-v2.png",
    "alfred-navermap": "/apps/alfred-navermap/hero-20260918.webp",
    "alfred-ai-search": "/apps/alfred-ai-search/home-card-v2.png",
    autoshorts: "/apps/autoshorts/home-card-v2.png",
  };

  return featuredCards[app.slug] ?? `/apps/${app.slug}/home-card.webp`;
}

export function appCardIcon(app: AppData) {
  if (app.slug === "aiplaygrand") return "/apps/aiplaygrand/icon.svg";
  if (app.slug === "alfred-navermap") return "/apps/alfred-navermap/icon.svg";
  return `/apps/${app.slug}/icon-card.webp`;
}
