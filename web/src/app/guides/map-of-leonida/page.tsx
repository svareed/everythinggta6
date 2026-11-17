import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Map of Leonida — Vice City Dispatch",
  description:
    "A region-by-region primer on GTA6's state of Leonida: Vice City, Port Gellhorn, the Leonida Keys, and the unconfirmed zones fans are tracking.",
};

const REGIONS = [
  {
    sector: "SECTOR 01",
    name: "Vice City",
    status: "Confirmed",
    body: "The neon core — downtown towers, beachfront strips, nightlife.",
  },
  {
    sector: "SECTOR 02",
    name: "Port Gellhorn",
    status: "Confirmed",
    body: "Rusted, working-class counterpoint to Vice City's gloss.",
  },
  {
    sector: "SECTOR 03",
    name: "Leonida Keys",
    status: "Confirmed",
    body: "Island-hopping territory — boats matter more than cars here.",
  },
  {
    sector: "SECTOR ??",
    name: "??? Rumored region",
    status: "Unconfirmed",
    body: "Dataminers keep pointing at a fourth zone. Nothing official yet.",
    mystery: true,
  },
];

export default function MapOfLeonidaGuide() {
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
          <div className="k">Guide</div>
          <h1>Map of Leonida</h1>
          <p>Region-by-region primer — confirmed from the trailers, flagged where it&apos;s still a rumor.</p>
        </div>
        <div className="coords">
          {REGIONS.map((r) => (
            <div className={`coord${r.mystery ? " mystery" : ""}`} key={r.name}>
              <span className="xy">{r.sector}</span>
              <h3>{r.name}</h3>
              <span className="status">● {r.status}</span>
              <p>{r.body}</p>
            </div>
          ))}
        </div>
      </div>

      <footer>Dummy content for a design prototype &middot; not an official Rockstar Games product</footer>
    </main>
  );
}
