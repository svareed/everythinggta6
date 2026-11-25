import Link from "next/link";
import type { Metadata } from "next";
import Comments from "@/components/Comments";
import JsonLd from "@/components/JsonLd";
import { REGIONS, OFFICIAL_MAP_SOURCE } from "@/lib/maps";
import { breadcrumbSchema, canonical, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Map of Leonida — EverythingGTA6",
  description:
    "A region-by-region primer on GTA6's state of Leonida: Vice City, Port Gellhorn, the Keys, and the unconfirmed zones fans were tracking — now matched against Rockstar's own launch-day map.",
  alternates: canonical("/guides/map-of-leonida"),
};

export default function MapOfLeonidaGuide() {
  return (
    <main>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: SITE_URL },
          { name: "Map of Leonida", url: `${SITE_URL}/guides/map-of-leonida` },
        ])}
      />
      <div className="wrap">
        <div className="guide-hero" style={{ backgroundImage: "url(/images/trailer-stills/biplane-beach-stunt.jpg)" }}>
          <div className="guide-head">
            <Link href="/" className="back">
              &larr; Back to EverythingGTA6
            </Link>
            <div className="k">Guide</div>
            <h1>Map of Leonida</h1>
            <p>Region-by-region primer — confirmed from the trailers, flagged where it&apos;s still a rumor.</p>
          </div>
        </div>
        <div className="coords">
          {REGIONS.map((r) => (
            <div
              className={`coord${r.img ? " has-img" : ""}${r.mystery ? " mystery" : ""}`}
              key={r.name}
              style={r.img ? { backgroundImage: `url(/images/trailer-stills/${r.img}.jpg)`, minHeight: 200 } : undefined}
            >
              <span className="xy">{r.sector}</span>
              <h3>
                <Link href={`/maps/${r.slug}`}>{r.name}</Link>
              </h3>
              <span className="status">● {r.status}</span>
              <p>{r.body}</p>
            </div>
          ))}
        </div>
        <p style={{ color: "var(--fg-dim)", fontSize: 13, marginTop: 8 }}>
          Rockstar released a full, official map of Leonida on launch day (2026-11-19), per{" "}
          <a href={OFFICIAL_MAP_SOURCE} target="_blank" rel="noopener noreferrer nofollow">
            RockstarINTEL
          </a>
          — it confirms every region above except the still-unconfirmed seventh one. Click
          through to any region for the official map and a &quot;how to get there&quot; note
          grounded in the routes and landmarks actually printed on it.
        </p>
        <p style={{ marginTop: 16 }}>
          More real coverage: <Link href="/sources/news">latest news</Link>,{" "}
          <Link href="/sources/hidden-gems">trailer easter eggs</Link>,{" "}
          <Link href="/guides/gta6-radio-stations">radio stations</Link>, or the{" "}
          <Link href="/sources">full Sources hub</Link>.
        </p>
        <Comments />
      </div>
    </main>
  );
}
