import type { AppData } from "./data";

export function appCardImage(app: AppData) {
  return `/apps/${app.slug}/home-card.webp`;
}

export function appCardIcon(app: AppData) {
  return `/apps/${app.slug}/icon-card.webp`;
}
