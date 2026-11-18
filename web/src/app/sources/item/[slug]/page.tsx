import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getAllRecords,
  getByCategory,
  itemSlug,
  outletFor,
  outletSlug,
  categoryOf,
  CATEGORIES,
  formatDate,
  excerptOf,
} from "@/lib/sources";
import Comments from "@/components/Comments";

export function generateStaticParams() {
  return getAllRecords().map((r) => ({ slug: itemSlug(r) }));
}

function findItem(slug: string) {
  return getAllRecords().find((r) => itemSlug(r) === slug);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const item = findItem((await params).slug);
  if (!item) return {};
  return {
    title: `${item.title} — EverythingGTA6`,
    description: excerptOf(item, 160),
  };
}

export default async function ItemPage({ params }: { params: Promise<{ slug: string }> }) {
  const item = findItem((await params).slug);
  if (!item) notFound();

  const outlet = outletFor(item);
  const cat = CATEGORIES.find((c) => c.id === categoryOf(item))!;
  const related = getByCategory(cat.id)
    .filter((r) => r.url !== item.url)
    .slice(0, 3);

  return (
    <main>
      <div className="wrap">
        <div className="guide-head">
          <Link href="/sources" className="back">
            &larr; Back to Sources
          </Link>
          <div className="k">
            <Link href={`/sources/${cat.id}`}>{cat.label}</Link>
            {" · "}
            <Link href={`/sources/outlet/${outletSlug(outlet)}`}>{outlet}</Link>
          </div>
          <h1>{item.title}</h1>
          <p>{item.author ? `${item.author} · ` : ""}{formatDate(item.published_at)}</p>
        </div>

        <div className="cite-card" style={{ maxWidth: 720, marginBottom: 32 }}>
          {item.image && <img className="cite-thumb" src={item.image} alt="" loading="lazy" />}
          <p style={{ fontSize: 15 }}>{excerptOf(item, 600)}</p>
          <div className="meta">
            <a className="out" href={item.url} target="_blank" rel="noopener noreferrer nofollow">
              Read the full piece at {outlet} &rarr;
            </a>
          </div>
        </div>

        {related.length > 0 && (
          <section className="section" style={{ paddingBlock: "8px 48px" }}>
            <div className="section-head">
              <h2>More {cat.label}</h2>
            </div>
            <div className="cite-grid">
              {related.map((r) => (
                <div className="cite-card" key={r.url}>
                  {r.image && <img className="cite-thumb" src={r.image} alt="" loading="lazy" />}
                  <span className="src">{outletFor(r)}</span>
                  <h3>
                    <Link href={`/sources/item/${itemSlug(r)}`}>{r.title}</Link>
                  </h3>
                  <p>{excerptOf(r, 200)}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <Comments />
      </div>
    </main>
  );
}
