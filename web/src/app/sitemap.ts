import type { MetadataRoute } from "next";
import { getAllRecords } from "@/lib/sources";
import { characterSlug, getAllCharacters } from "@/lib/characters";
import { getAllMissions } from "@/lib/missions";
import { REGIONS } from "@/lib/maps";

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
    { url: `${BASE_URL}/guides/gta6-faq`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/guides/gta6-price`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE_URL}/guides/gta6-budget-and-delays`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/guides/gta6-radio-stations`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/guides/gta6-leaks-timeline`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
  ];
  // /sources and /sitemap (plus everything under /sources/*) are marked
  // noindex -- they're thin, scraped-excerpt or pure-navigation pages, not
  // original content -- so they're deliberately left out of sitemap.xml,
  // which should only advertise canonical, indexable URLs.

  const characterRoutes: MetadataRoute.Sitemap = getAllCharacters().map((c) => ({
    url: `${BASE_URL}/characters/${characterSlug(c.name)}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const missionRoutes: MetadataRoute.Sitemap = getAllMissions()
    .filter((m) => m.slug)
    .map((m) => ({
      url: `${BASE_URL}/missions/${m.slug}`,
      lastModified: m.scraped_at ? new Date(m.scraped_at) : now,
      changeFrequency: "monthly",
      priority: 0.6,
    }));

  const mapRoutes: MetadataRoute.Sitemap = REGIONS.map((r) => ({
    url: `${BASE_URL}/maps/${r.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...characterRoutes, ...missionRoutes, ...mapRoutes];
}
