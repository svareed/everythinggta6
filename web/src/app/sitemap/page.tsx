import Link from "next/link";
import type { Metadata } from "next";
import {
  CATEGORIES,
  getAllOutlets,
  getByOutlet,
  outletSlug,
  itemSlug,
} from "@/lib/sources";

export const metadata: Metadata = {
  title: "Sitemap — EverythingGTA6",
  description: "Every page on the site, grouped by section, with a link to the machine-readable XML sitemap.",
};

export default function VisualSitemapPage() {
  const outlets = getAllOutlets();

  return (
    <main>
      <div className="wrap">
        <div className="guide-head">
          <Link href="/" className="back">
            &larr; Back to EverythingGTA6
          </Link>
          <div className="k">Site Index</div>
          <h1>Sitemap</h1>
          <p>
            Every page on this site, grouped by section. Looking for the machine-readable version
            instead? See the <Link href="/sitemap.xml">XML sitemap</Link>.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 28, paddingBottom: 48 }}>
          <div>
            <h2 style={{ fontSize: 18, marginBottom: 10 }}>Main</h2>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 6 }}>
              <li><Link href="/">Home</Link></li>
              <li><Link href="/guides/map-of-leonida">Map of Leonida</Link></li>
              <li><Link href="/sources">Sources (hub)</Link></li>
            </ul>
          </div>

          <div>
            <h2 style={{ fontSize: 18, marginBottom: 10 }}>Sources by Topic</h2>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 6 }}>
              {CATEGORIES.map((c) => (
                <li key={c.id}>
                  <Link href={`/sources/${c.id}`}>{c.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {outlets.map((o) => {
            const items = getByOutlet(o);
            return (
              <div key={o}>
                <h2 style={{ fontSize: 18, marginBottom: 10 }}>
                  <Link href={`/sources/outlet/${outletSlug(o)}`}>{o}</Link>{" "}
                  <span style={{ color: "var(--fg-dim)", fontSize: 13 }}>
                    ({items.length} piece{items.length === 1 ? "" : "s"})
                  </span>
                </h2>
                <ul
                  style={{
                    listStyle: "none",
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                    gap: 6,
                  }}
                >
                  {items.map((r) => (
                    <li key={r.url} style={{ fontSize: 13 }}>
                      <Link href={`/sources/item/${itemSlug(r)}`}>{r.title}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
