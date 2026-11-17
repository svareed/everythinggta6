import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getAllOutlets,
  getByOutlet,
  outletSlug,
  itemSlug,
  categoryOf,
  CATEGORIES,
  formatDate,
  excerptOf,
} from "@/lib/sources";

export function generateStaticParams() {
  return getAllOutlets().map((o) => ({ outlet: outletSlug(o) }));
}

function findOutlet(slug: string): string | undefined {
  return getAllOutlets().find((o) => outletSlug(o) === slug);
}

export function generateMetadata({ params }: { params: { outlet: string } }): Metadata {
  const outlet = findOutlet(params.outlet);
  if (!outlet) return {};
  return {
    title: `${outlet} — Vice City Dispatch Sources`,
    description: `Every GTA6 excerpt collected from ${outlet}, with links back to the original articles.`,
  };
}

export default function OutletPage({ params }: { params: { outlet: string } }) {
  const outlet = findOutlet(params.outlet);
  if (!outlet) notFound();

  const items = getByOutlet(outlet);

  return (
    <main>
      <div className="wrap">
        <div className="guide-head">
          <Link href="/sources" className="back">
            &larr; Back to Sources
          </Link>
          <div className="k">Outlet</div>
          <h1>{outlet}</h1>
          <p>{items.length} piece{items.length === 1 ? "" : "s"} collected from {outlet}.</p>
        </div>

        <div className="cite-grid" style={{ paddingBottom: 48 }}>
          {items.map((c) => {
            const cat = CATEGORIES.find((cc) => cc.id === categoryOf(c))!;
            return (
              <div className="cite-card" key={c.url}>
                <span className="src">
                  <Link href={`/sources/${cat.id}`}>{cat.label}</Link>
                </span>
                <h3>
                  <Link href={`/sources/item/${itemSlug(c)}`}>{c.title}</Link>
                </h3>
                <p>{excerptOf(c, 260)}</p>
                <div className="meta">
                  <time>{c.author ? `${c.author} · ` : ""}{formatDate(c.published_at)}</time>
                  <a className="out" href={c.url} target="_blank" rel="noopener noreferrer nofollow">
                    Read at {outlet} &rarr;
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
