import type { AppData } from "./data";

export function appCardImage(app: AppData) {
  const featuredCards: Partial<Record<AppData["slug"], string>> = {
    ccmb: "/apps/ccmb/home-card-v2.png",
    "alfred-ai-search": "/apps/alfred-ai-search/home-card-v2.png",
    autoshorts: "/apps/autoshorts/home-card-v2.png",
  };

  if (featuredCards[app.slug]) return featuredCards[app.slug];
  return `/apps/${app.slug}/home-card.webp`;
}

export function appCardIcon(app: AppData) {
  return `/apps/${app.slug}/icon-card.webp`;
}
