import Link from "next/link";
import type { Metadata } from "next";
import Comments from "@/components/Comments";

export const metadata: Metadata = {
  title: "Map of Leonida — EverythingGTA6",
  description:
    "A region-by-region primer on GTA6's state of Leonida: Vice City, Port Gellhorn, the Leonida Keys, and the unconfirmed zones fans are tracking.",
};

const REGIONS = [
  {
    sector: "SECTOR 01",
    name: "Vice City",
    status: "Confirmed",
    body: "The neon core — downtown towers, beachfront strips, nightlife.",
    img: "nightclub-crowd",
  },
  {
    sector: "SECTOR 02",
    name: "Port Gellhorn",
    status: "Confirmed",
    body: "Rusted, working-class counterpoint to Vice City's gloss.",
    img: "red-shootout",
  },
  {
    sector: "SECTOR 03",
    name: "Leonida Keys",
    status: "Confirmed",
    body: "Island-hopping territory — boats matter more than cars here.",
    img: "dock-seaplane",
  },
  {
    sector: "SECTOR 04",
    name: "Ambrosia",
    status: "Confirmed",
    body: "Named in official Rockstar material; details are still thin.",
    img: "skyscraper-climb",
  },
  {
    sector: "SECTOR 05",
    name: "Grassrivers",
    status: "Confirmed",
    body: "Everglades-style wetland county named in official press material.",
    img: null,
  },
  {
    sector: "SECTOR 06",
    name: "Mount Kalaga National Park",
    status: "Confirmed",
    body: "A protected wilderness area, officially named alongside Leonida's other counties.",
    img: null,
  },
  {
    sector: "SECTOR ??",
    name: "??? Rumored region",
    status: "Unconfirmed",
    body: "Dataminers keep pointing at a fourth zone. Nothing official yet.",
    mystery: true,
    img: "crystal-shop",
  },
];

export default function MapOfLeonidaGuide() {
  return (
    <main>
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
              <h3>{r.name}</h3>
              <span className="status">● {r.status}</span>
              <p>{r.body}</p>
            </div>
          ))}
        </div>
        <p style={{ color: "var(--fg-dim)", fontSize: 13, marginTop: 8 }}>
          Ambrosia, Grassrivers, and Mount Kalaga National Park per{" "}
          <a href="https://gtaintel.com/news/gta-6-leonida-map-everything-we-know" target="_blank" rel="noopener noreferrer nofollow">
            GTA Intel&apos;s map coverage
          </a>
          , citing Rockstar&apos;s own press material. No complete official map has been released —
          anything calling itself a &quot;full GTA6 map&quot; online right now is an unverified
          leak, not something Rockstar has authorized.
        </p>
        <p style={{ marginTop: 16 }}>
          More real coverage: <Link href="/sources/news">latest news</Link>,{" "}
          <Link href="/sources/hidden-gems">trailer easter eggs</Link>, or the{" "}
          <Link href="/sources">full Sources hub</Link>.
        </p>
        <Comments />
      </div>
    </main>
  );
}
