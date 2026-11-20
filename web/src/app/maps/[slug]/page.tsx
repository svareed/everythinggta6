import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Comments from "@/components/Comments";
import { findRegion, REGIONS, OFFICIAL_MAP_IMG, OFFICIAL_MAP_SOURCE } from "@/lib/maps";

export function generateStaticParams() {
  return REGIONS.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const region = findRegion((await params).slug);
  if (!region) return {};
  return {
    title: `${region.name} — Map of Leonida — EverythingGTA6`,
    description: region.body,
  };
}

export default async function RegionPage({ params }: { params: Promise<{ slug: string }> }) {
  const region = findRegion((await params).slug);
  if (!region) notFound();

  const heroImg = region.onOfficialMap ? OFFICIAL_MAP_IMG : region.img ? `/images/trailer-stills/${region.img}.jpg` : undefined;
  const others = REGIONS.filter((r) => r.slug !== region.slug);

  return (
    <main>
      <div className="wrap">
        <div className="guide-hero" style={heroImg ? { backgroundImage: `url(${heroImg})` } : undefined}>
          <div className="guide-head">
            <Link href="/guides/map-of-leonida" className="back">
              &larr; Back to Map of Leonida
            </Link>
            <div className="k">{region.sector}</div>
            <h1>{region.name}</h1>
            <p>{region.status}</p>
          </div>
        </div>

        <div className="guide-head" style={{ paddingBlock: "28px 8px" }}>
          <h2 style={{ fontSize: 22, margin: 0 }}>About</h2>
        </div>
        <p style={{ fontSize: 15, lineHeight: 1.7, maxWidth: 720 }}>{region.body}</p>

        {region.getThere && (
          <>
            <div className="guide-head" style={{ paddingBlock: "28px 8px" }}>
              <h2 style={{ fontSize: 22, margin: 0 }}>How to Get There</h2>
            </div>
            <p style={{ fontSize: 15, lineHeight: 1.7, maxWidth: 720 }}>{region.getThere}</p>
          </>
        )}

        {region.onOfficialMap && (
          <p style={{ color: "var(--fg-dim)", fontSize: 13, marginTop: 20 }}>
            Shown on the official Leonida map Rockstar released on launch day, per{" "}
            <a href={OFFICIAL_MAP_SOURCE} target="_blank" rel="noopener noreferrer nofollow">
              RockstarINTEL
            </a>
            . Click the map image above for the full state of Leonida.
          </p>
        )}

        <div className="guide-head" style={{ paddingBlock: "28px 8px" }}>
          <h2 style={{ fontSize: 22, margin: 0 }}>Rest of Leonida</h2>
        </div>
        <div className="coords">
          {others.map((r) => (
            <div className={r.mystery ? "coord mystery" : "coord"} key={r.slug}>
              <span className="xy">{r.sector}</span>
              <h3>
                <Link href={`/maps/${r.slug}`}>{r.name}</Link>
              </h3>
              <span className="status">● {r.status}</span>
            </div>
          ))}
        </div>

        <p style={{ marginTop: 16 }}>
          More: <Link href="/guides/map-of-leonida">full map guide</Link>,{" "}
          <Link href="/characters">the cast</Link>, or the <Link href="/sources">full Sources hub</Link>.
        </p>
        <Comments />
      </div>
    </main>
  );
}
