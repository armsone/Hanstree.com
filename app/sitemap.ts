import type { MetadataRoute } from "next";
import { apps } from "./data";
import { getSiteBrand } from "./site-brand";

const publicSections = ["privacy", "support", "terms"] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = (await getSiteBrand()).canonical;
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
    { url: `${origin}/space/hanstree`, changeFrequency: "monthly", priority: 0.9 },
    ...productPages,
    { url: `${origin}/apps/nasfinder/data-deletion`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${origin}/apps/nasfinder/google-oauth`, changeFrequency: "monthly", priority: 0.4 },
  ];
}
