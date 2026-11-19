import type { MetadataRoute } from "next";
import { CATEGORIES, getAllRecords, getAllOutlets, outletSlug, itemSlug } from "@/lib/sources";

const BASE_URL = "https://www.everythinggta6.com";

export default function sitemap(): MetadataRoute.Sitemap {
  // Derived from the data's own timestamps, not wall-clock time: Next's
  // Cache Components build rejects Date.now()/new Date() during prerender
  // since it's a value that changes between renders.
  const records = getAllRecords();
  const now = records.reduce(
    (latest, r) => (r.scraped_at && r.scraped_at > latest ? r.scraped_at : latest),
    records[0]?.scraped_at ?? new Date(0).toISOString()
  );

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${BASE_URL}/guides/map-of-leonida`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/guides/craziest-gta6-stories`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE_URL}/guides/gta6-launch-day-discoveries`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${BASE_URL}/characters`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/vehicles`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/missions`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/cheats`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/sources`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/sitemap`, lastModified: now, changeFrequency: "weekly", priority: 0.3 },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = CATEGORIES.map((c) => ({
    url: `${BASE_URL}/sources/${c.id}`,
    lastModified: now,
    changeFrequency: "daily",
    priority: 0.7,
  }));

  const outletRoutes: MetadataRoute.Sitemap = getAllOutlets().map((o) => ({
    url: `${BASE_URL}/sources/outlet/${outletSlug(o)}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const itemRoutes: MetadataRoute.Sitemap = getAllRecords().map((r) => ({
    url: `${BASE_URL}/sources/item/${itemSlug(r)}`,
    lastModified: r.scraped_at ? new Date(r.scraped_at) : now,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...staticRoutes, ...categoryRoutes, ...outletRoutes, ...itemRoutes];
}
