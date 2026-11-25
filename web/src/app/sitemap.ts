import type { MetadataRoute } from "next";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { getAllRecords } from "@/lib/sources";
import { characterSlug, getAllCharacters } from "@/lib/characters";
import { getAllMissions } from "@/lib/missions";
import { REGIONS } from "@/lib/maps";
import { getAllVehicles, vehicleSlug } from "@/lib/vehicles";

const BASE_URL = "https://www.everythinggta6.com";

// A page's real lastmod: the commit date of the file(s) that hold its
// content, not a single build-time timestamp shared by every page.
function gitLastModified(...relPaths: string[]): string | undefined {
  let latest: string | undefined;
  for (const p of relPaths) {
    try {
      const out = execFileSync("git", ["log", "-1", "--format=%cI", "--", p], {
        encoding: "utf8",
      }).trim();
      if (out && (!latest || out > latest)) latest = out;
    } catch {
      // git unavailable in this environment -- caller falls back to `now`.
    }
  }
  return latest;
}

type ChangeFreq = MetadataRoute.Sitemap[number]["changeFrequency"];

const APP_DIR = path.join(process.cwd(), "src/app");

// Finds every static (non-dynamic, non-noindex) page.tsx under src/app, so a
// new static page is picked up automatically instead of needing a manual
// entry here. Dynamic ([slug]) routes and /sources/* are handled separately
// below -- /sources is excluded from the sitemap outright (see comment).
function discoverStaticPages(): { url: string; file: string }[] {
  const pages: { url: string; file: string }[] = [];

  function walk(dir: string, url: string) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (!entry.isDirectory() || entry.name.startsWith("[") || entry.name === "sources") continue;
      const childDir = path.join(dir, entry.name);
      const childUrl = `${url}/${entry.name}`;
      const pageFile = path.join(childDir, "page.tsx");
      if (fs.existsSync(pageFile)) {
        const content = fs.readFileSync(pageFile, "utf8");
        if (!/robots:\s*{\s*index:\s*false/.test(content)) {
          pages.push({ url: childUrl, file: path.relative(process.cwd(), pageFile) });
        }
      }
      walk(childDir, childUrl);
    }
  }

  const homeFile = path.join(APP_DIR, "page.tsx");
  if (fs.existsSync(homeFile)) {
    pages.push({ url: "/", file: path.relative(process.cwd(), homeFile) });
  }
  walk(APP_DIR, "");

  return pages;
}

// Hand-tuned changeFrequency/priority for specific pages; anything not
// listed here (including every new static page) gets DEFAULT_TUNING.
const STATIC_TUNING: Record<string, { changeFrequency: ChangeFreq; priority: number }> = {
  "/": { changeFrequency: "daily", priority: 1 },
  "/guides/map-of-leonida": { changeFrequency: "weekly", priority: 0.8 },
  "/guides/craziest-gta6-stories": { changeFrequency: "weekly", priority: 0.7 },
  "/guides/gta6-launch-day-discoveries": { changeFrequency: "daily", priority: 0.8 },
  "/characters": { changeFrequency: "weekly", priority: 0.8 },
  "/vehicles": { changeFrequency: "weekly", priority: 0.8 },
  "/missions": { changeFrequency: "weekly", priority: 0.8 },
  "/cheats": { changeFrequency: "weekly", priority: 0.8 },
  "/guides/gta6-faq": { changeFrequency: "weekly", priority: 0.8 },
  "/guides/gta6-price": { changeFrequency: "weekly", priority: 0.7 },
  "/guides/gta6-budget-and-delays": { changeFrequency: "monthly", priority: 0.6 },
  "/guides/gta6-radio-stations": { changeFrequency: "monthly", priority: 0.6 },
  "/guides/gta6-leaks-timeline": { changeFrequency: "monthly", priority: 0.6 },
  "/guides/gta6-file-size": { changeFrequency: "monthly", priority: 0.5 },
  "/guides/gta6-confirmed-features": { changeFrequency: "monthly", priority: 0.5 },
  "/guides/gta6-age-rating": { changeFrequency: "monthly", priority: 0.5 },
  "/guides/gta6-vs-gta5": { changeFrequency: "monthly", priority: 0.5 },
  "/guides/gta6-community": { changeFrequency: "monthly", priority: 0.4 },
};
const DEFAULT_TUNING: { changeFrequency: ChangeFreq; priority: number } = {
  changeFrequency: "monthly",
  priority: 0.5,
};

export default function sitemap(): MetadataRoute.Sitemap {
  // Derived from the data's own timestamps, not wall-clock time: Next's
  // Cache Components build rejects Date.now()/new Date() during prerender
  // since it's a value that changes between renders.
  const records = getAllRecords();
  const now = records.reduce(
    (latest, r) => (r.scraped_at && r.scraped_at > latest ? r.scraped_at : latest),
    records[0]?.scraped_at ?? new Date(0).toISOString()
  );

  const staticRoutes: MetadataRoute.Sitemap = discoverStaticPages().map((p) => {
    const tuning = STATIC_TUNING[p.url] ?? DEFAULT_TUNING;
    return {
      url: `${BASE_URL}${p.url}`,
      lastModified: gitLastModified(p.file) ?? now,
      changeFrequency: tuning.changeFrequency,
      priority: tuning.priority,
    };
  });
  // /sources and /sitemap (plus everything under /sources/*) are marked
  // noindex -- they're thin, scraped-excerpt or pure-navigation pages, not
  // original content -- so they're deliberately left out of sitemap.xml,
  // which should only advertise canonical, indexable URLs.

  const characterLastModified = gitLastModified("src/data/characters.json") ?? now;
  const characterRoutes: MetadataRoute.Sitemap = getAllCharacters().map((c) => ({
    url: `${BASE_URL}/characters/${characterSlug(c.name)}`,
    lastModified: characterLastModified,
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

  const mapLastModified = gitLastModified("src/lib/maps.ts") ?? now;
  const mapRoutes: MetadataRoute.Sitemap = REGIONS.map((r) => ({
    url: `${BASE_URL}/maps/${r.slug}`,
    lastModified: mapLastModified,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const vehicleRoutes: MetadataRoute.Sitemap = getAllVehicles().map((v) => ({
    url: `${BASE_URL}/vehicles/${vehicleSlug(v)}`,
    lastModified: v.scraped_at ? new Date(v.scraped_at) : now,
    changeFrequency: "monthly",
    priority: 0.5,
  }));
  void missionRoutes;
  void vehicleRoutes;
  // Per a 2026-11-26 GSC diagnosis, ~94% of the submitted sitemap was
  // vehicle/mission detail pages, almost all stuck "Discovered -- currently
  // not indexed": 493 near-identical templated pages added in bulk to a
  // brand-new, zero-authority domain reads to Google as low-value, so it's
  // holding off crawling them. Per that diagnosis's recommendation,
  // missionRoutes/vehicleRoutes are deliberately left out of the submitted
  // sitemap for now -- NOT noindexed, NOT disallowed, so Google can still
  // find and index them via normal crawling from the /vehicles and
  // /missions hub pages (both of which remain in staticRoutes) -- just not
  // asked to crawl all ~493 of them in one shot. Re-add
  // `...missionRoutes, ...vehicleRoutes` to the return below once the
  // first (smaller) batch of pages is actually indexed.
  return [...staticRoutes, ...characterRoutes, ...mapRoutes];
}
