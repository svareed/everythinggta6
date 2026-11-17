import crypto from "node:crypto";
import rawData from "@/data/sources.json";

export type ScrapedRecord = {
  source: string;
  type: string;
  title: string;
  url: string;
  author: string;
  published_at: string;
  content: string;
  image?: string;
  scraped_at: string;
};

export type CategoryId = "news" | "tips" | "hidden-gems";

export const CATEGORIES: { id: CategoryId; label: string }[] = [
  { id: "news", label: "News & Leaks" },
  { id: "tips", label: "Tips & Guides" },
  { id: "hidden-gems", label: "Hidden Gems" },
];

// article.py tags every record "article" regardless of which site it came
// from -- give those a real outlet name from the domain instead.
const DOMAIN_LABELS: Record<string, string> = {
  "en.wikipedia.org": "Wikipedia",
  "www.keengamer.com": "KeenGamer",
  "www.gtabase.com": "GTABase",
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70);
}

function shortHash(input: string): string {
  return crypto.createHash("md5").update(input).digest("hex").slice(0, 6);
}

export function outletFor(r: ScrapedRecord): string {
  if (r.source !== "article") return r.source;
  const host = new URL(r.url).hostname;
  return DOMAIN_LABELS[host] ?? host;
}

export function outletSlug(outlet: string): string {
  return slugify(outlet);
}

export function itemSlug(r: ScrapedRecord): string {
  return `${slugify(r.title)}-${shortHash(r.url)}`;
}

// Same keyword buckets site_crawler.py's own topic discovery surfaced --
// this just sorts the collected excerpts into the three sections the site
// organizes guides around, it isn't a separate scrape per category.
export function categoryOf(r: ScrapedRecord): CategoryId {
  const text = `${r.title} ${r.content}`.toLowerCase();
  if (/\b(tip|guide|walkthrough|how to|beginner|trophy|achievement)\b/.test(text)) {
    return "tips";
  }
  if (/\b(easter egg|hidden|secret|missed|detail|reference)\b/.test(text)) {
    return "hidden-gems";
  }
  return "news";
}

export function excerptOf(r: ScrapedRecord, maxChars = 500): string {
  if (r.content.length <= maxChars) return r.content;
  return r.content.slice(0, maxChars).replace(/\s+\S*$/, "") + "...";
}

export function formatDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

let cached: ScrapedRecord[] | null = null;

export function getAllRecords(): ScrapedRecord[] {
  if (!cached) {
    cached = (rawData as ScrapedRecord[]).sort((a, b) =>
      (b.published_at || "").localeCompare(a.published_at || "")
    );
  }
  return cached;
}

export function getByCategory(id: CategoryId): ScrapedRecord[] {
  return getAllRecords().filter((r) => categoryOf(r) === id);
}

export function getAllOutlets(): string[] {
  const set = new Set(getAllRecords().map(outletFor));
  return Array.from(set).sort();
}

export function getByOutlet(outlet: string): ScrapedRecord[] {
  return getAllRecords().filter((r) => outletFor(r) === outlet);
}

export function getBySlug(slug: string): ScrapedRecord | undefined {
  return getAllRecords().find((r) => itemSlug(r) === slug);
}
