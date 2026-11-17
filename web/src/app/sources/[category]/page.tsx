import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  CATEGORIES,
  getByCategory,
  outletFor,
  outletSlug,
  itemSlug,
  formatDate,
  excerptOf,
  type CategoryId,
} from "@/lib/sources";
import Comments from "@/components/Comments";

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.id }));
}

function findCategory(id: string) {
  return CATEGORIES.find((c) => c.id === id);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const cat = findCategory((await params).category);
  if (!cat) return {};
  return {
    title: `${cat.label} — Vice City Dispatch`,
    description: `Real GTA6 ${cat.label.toLowerCase()} coverage from around the web, with excerpts and links back to each original source.`,
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const cat = findCategory((await params).category);
  if (!cat) notFound();

  const items = getByCategory(cat.id as CategoryId);
  const otherCategories = CATEGORIES.filter((c) => c.id !== cat.id);

  return (
    <main>
      <div className="wrap">
        <div className="guide-head">
          <Link href="/sources" className="back">
            &larr; Back to Sources
          </Link>
          <div className="k">Topic</div>
          <h1>{cat.label}</h1>
          <p>
            {items.length} real piece{items.length === 1 ? "" : "s"} tagged {cat.label.toLowerCase()}.
            Other topics:{" "}
            {otherCategories.map((c, i) => (
              <span key={c.id}>
                <Link href={`/sources/${c.id}`}>{c.label}</Link>
                {i < otherCategories.length - 1 ? ", " : ""}
              </span>
            ))}
            .
          </p>
        </div>

        {items.length === 0 ? (
          <p style={{ color: "var(--fg-dim)", paddingBottom: 40 }}>No items in this topic yet.</p>
        ) : (
          <div className="cite-grid" style={{ paddingBottom: 48 }}>
            {items.map((c) => (
              <div className="cite-card" key={c.url}>
                {c.image && <img className="cite-thumb" src={c.image} alt="" loading="lazy" />}
                <span className="src">
                  <Link href={`/sources/outlet/${outletSlug(outletFor(c))}`}>{outletFor(c)}</Link>
                </span>
                <h3>
                  <Link href={`/sources/item/${itemSlug(c)}`}>{c.title}</Link>
                </h3>
                <p>{excerptOf(c, 260)}</p>
                <div className="meta">
                  <time>{c.author ? `${c.author} · ` : ""}{formatDate(c.published_at)}</time>
                  <a className="out" href={c.url} target="_blank" rel="noopener noreferrer nofollow">
                    Read at {outletFor(c)} &rarr;
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        <Comments />
      </div>
    </main>
  );
}
