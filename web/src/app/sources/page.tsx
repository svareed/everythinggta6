import Link from "next/link";
import type { Metadata } from "next";
import sourcesData from "@/data/sources.json";

export const metadata: Metadata = {
  title: "Sources — Vice City Dispatch",
  description:
    "Real GTA6 coverage from around the web, in short excerpts with a link back to where each one was published.",
};

type ScrapedRecord = {
  source: string;
  type: string;
  title: string;
  url: string;
  author: string;
  published_at: string;
  content: string;
  scraped_at: string;
};

type Category = "Tips & Guides" | "Hidden Gems" | "News & Leaks";

// Pulled from site_crawler.py's own topic discovery, not a separate scrape
// per category -- these keywords just sort the same citations into the
// three buckets the site organizes guides around.
function categorize(r: ScrapedRecord): Category {
  const text = `${r.title} ${r.content}`.toLowerCase();
  if (/\b(tip|guide|walkthrough|how to|beginner|trophy|achievement)\b/.test(text)) {
    return "Tips & Guides";
  }
  if (/\b(easter egg|hidden|secret|missed|detail|reference)\b/.test(text)) {
    return "Hidden Gems";
  }
  return "News & Leaks";
}

function loadCitations(): ScrapedRecord[] {
  const records = sourcesData as ScrapedRecord[];
  return records
    .filter((r) => r.type === "citation")
    .sort((a, b) => (b.published_at || "").localeCompare(a.published_at || ""));
}

function formatDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

const SECTIONS: { key: Category; label: string; id: string }[] = [
  { key: "News & Leaks", label: "News & Leaks", id: "news" },
  { key: "Tips & Guides", label: "Tips & Guides", id: "tips" },
  { key: "Hidden Gems", label: "Hidden Gems", id: "hidden-gems" },
];

export default function SourcesPage() {
  const citations = loadCitations();
  const grouped: Record<Category, ScrapedRecord[]> = {
    "News & Leaks": [],
    "Tips & Guides": [],
    "Hidden Gems": [],
  };
  for (const c of citations) {
    grouped[categorize(c)].push(c);
  }

  return (
    <main>
      <div className="topbar">
        <div className="wrap" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, width: "100%" }}>
          <Link href="/" className="brand">
            <span className="dot" />
            The Leonida Dispatch
          </Link>
          <nav className="primary">
            <Link href="/">News</Link>
            <Link href="/guides/map-of-leonida">Map</Link>
            <Link href="/sources">Sources</Link>
            <span className="soon">Characters</span>
            <span className="soon">Vehicles</span>
            <span className="soon">Soundtrack</span>
          </nav>
          <span className="issue-tag">Preview Edition</span>
        </div>
      </div>

      <div className="wrap">
        <div className="guide-head">
          <Link href="/" className="back">
            &larr; Back to The Leonida Dispatch
          </Link>
          <div className="k">Around the Web</div>
          <h1>Sources</h1>
          <p>
            Short excerpts from real GTA6 coverage, pulled automatically from the outlets below.
            Every card links back to the full piece on the original site.
          </p>
          <nav className="primary" style={{ marginTop: 14 }}>
            {SECTIONS.map(({ label, id }) => (
              <a key={id} href={`#${id}`}>
                {label}
              </a>
            ))}
          </nav>
        </div>

        {citations.length === 0 ? (
          <p style={{ color: "var(--fg-dim)", paddingBottom: 40 }}>
            No sources collected yet &mdash; run the scraper pipeline to populate this page.
          </p>
        ) : (
          SECTIONS.map(({ key, label, id }) =>
            grouped[key].length === 0 ? null : (
              <section className="section" key={id} id={id} style={{ paddingBlock: "8px 32px" }}>
                <div className="section-head">
                  <h2>{label}</h2>
                </div>
                <div className="cite-grid">
                  {grouped[key].map((c) => (
                    <div className="cite-card" key={c.url}>
                      <span className="src">{c.source}</span>
                      <h3>{c.title}</h3>
                      <p>{c.content}</p>
                      <div className="meta">
                        <time>{c.author ? `${c.author} · ` : ""}{formatDate(c.published_at)}</time>
                        <a className="out" href={c.url} target="_blank" rel="noopener noreferrer nofollow">
                          Read at {c.source} &rarr;
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )
          )
        )}
      </div>

      <footer>
        Dummy content elsewhere on this site is a design prototype &middot; the excerpts above are
        real, scraped from public pages, and cited back to their original authors
      </footer>
    </main>
  );
}
