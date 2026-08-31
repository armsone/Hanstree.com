import type { MetadataRoute } from "next";
import { apps } from "./data";

const origin = "https://nasfinder.com";
const publicSections = ["privacy", "support", "terms"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const productPages = apps.flatMap((app) => [
    { url: `${origin}/apps/${app.slug}`, changeFrequency: "weekly" as const, priority: 0.8 },
    ...publicSections.map((section) => ({
      url: `${origin}/apps/${app.slug}/${section}`,
      changeFrequency: "monthly" as const,
      priority: 0.4,
    })),
  ]);

  return [
    { url: origin, changeFrequency: "weekly", priority: 1 },
    ...productPages,
    { url: `${origin}/apps/nasfinder/data-deletion`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${origin}/apps/nasfinder/google-oauth`, changeFrequency: "monthly", priority: 0.4 },
  ];
}
