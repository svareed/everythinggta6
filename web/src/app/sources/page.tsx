import Link from "next/link";
import type { Metadata } from "next";
import {
  CATEGORIES,
  getAllRecords,
  getByCategory,
  getAllOutlets,
  getByOutlet,
  outletSlug,
  itemSlug,
  outletFor,
  formatDate,
  excerptOf,
} from "@/lib/sources";
import Comments from "@/components/Comments";

export const metadata: Metadata = {
  title: "Sources — EverythingGTA6",
  description:
    "Real GTA6 coverage from around the web, browsable by topic or by outlet, with every excerpt linking back to the original article.",
};

export default function SourcesPage() {
  const all = getAllRecords();
  const outlets = getAllOutlets();
  const latest = all.slice(0, 6);

  return (
    <main>
      <div className="wrap">
        <div className="guide-hero" style={{ backgroundImage: "url(/images/trailer-stills/motorcycle-seaplane.jpg)" }}>
          <div className="guide-head">
            <Link href="/" className="back">
              &larr; Back to EverythingGTA6
            </Link>
            <div className="k">Around the Web</div>
            <h1>Sources</h1>
            <p>
              {all.length} real excerpts from GTA6 coverage across the web, organized by topic and
              by outlet. Every card links back to the full piece on the original site.
            </p>
          </div>
        </div>

        <section className="section" style={{ paddingBlock: "8px 32px" }}>
          <div className="section-head">
            <h2>Browse by Topic</h2>
          </div>
          <div className="grid4">
            {CATEGORIES.map((c) => {
              const count = getByCategory(c.id).length;
              return (
                <Link className="module" href={`/sources/${c.id}`} key={c.id}>
                  <span className="mk">Topic</span>
                  <h3>{c.label}</h3>
                  <p>{count} piece{count === 1 ? "" : "s"} collected</p>
                  <span className="status">● Browse</span>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="section" style={{ paddingBlock: "8px 32px" }}>
          <div className="section-head">
            <h2>Browse by Outlet</h2>
          </div>
          <div className="grid4">
            {outlets.map((o) => {
              const count = getByOutlet(o).length;
              return (
                <Link className="module" href={`/sources/outlet/${outletSlug(o)}`} key={o}>
                  <span className="mk">Outlet</span>
                  <h3>{o}</h3>
                  <p>{count} piece{count === 1 ? "" : "s"} indexed</p>
                  <span className="status">● Browse</span>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="section" style={{ paddingBlock: "8px 48px" }}>
          <div className="section-head">
            <h2>Latest</h2>
          </div>
          <div className="cite-grid">
            {latest.map((c) => (
              <div className="cite-card" key={c.url}>
                {c.image && <img className="cite-thumb" src={c.image} alt="" loading="lazy" />}
                <span className="src">{outletFor(c)}</span>
                <h3>
                  <Link href={`/sources/item/${itemSlug(c)}`}>{c.title}</Link>
                </h3>
                <p>{excerptOf(c, 220)}</p>
                <div className="meta">
                  <time>{c.author ? `${c.author} · ` : ""}{formatDate(c.published_at)}</time>
                  <a className="out" href={c.url} target="_blank" rel="noopener noreferrer nofollow">
                    Read at {outletFor(c)} &rarr;
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        <Comments />
      </div>
    </main>
  );
}
