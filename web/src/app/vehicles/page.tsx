import Link from "next/link";
import type { Metadata } from "next";
import Comments from "@/components/Comments";
import vehicles from "@/data/vehicles.json";

export const metadata: Metadata = {
  title: "GTA6 Vehicles — Vice City Dispatch",
  description:
    "Named cars, bikes, boats and aircraft spotted in GTA6's trailers and screenshots so far, with their real-world inspirations, compiled from GTABase.",
};

const CATEGORIES = ["Cars", "Off-Road & Utility", "Vans", "Motorcycles", "Air & Sea"];
const CATEGORY_IMG: Record<string, string> = {
  Cars: "hawaiian-shirt-truck",
  Motorcycles: "motorcycle-seaplane",
};

// Cards cycle through our own trailer stills as atmosphere, not literal
// photos of each named vehicle -- Rockstar hasn't published per-vehicle art.
const STILLS = [
  "balcony-sunset", "hawaiian-shirt-truck", "biplane-beach-stunt", "motorcycle-seaplane",
  "vault-heist", "bar-standoff", "crystal-shop", "red-shootout",
  "dock-seaplane", "skyscraper-climb", "nightclub-crowd", "highway-skyline",
];

const withImg = vehicles.map((v, i) => ({ ...v, img: STILLS[i % STILLS.length] }));

export default function VehiclesPage() {
  return (
    <main>
      <div className="wrap">
        <div className="guide-hero" style={{ backgroundImage: "url(/images/trailer-stills/hawaiian-shirt-truck.jpg)" }}>
          <div className="guide-head">
            <Link href="/" className="back">
              &larr; Back to The Leonida Dispatch
            </Link>
            <div className="k">Garage</div>
            <h1>GTA6 Vehicles</h1>
            <p>
              Rockstar has never published a master vehicle list — this is every named vehicle
              fan trackers have confirmed from trailers and screenshots so far, grouped by type.
            </p>
          </div>
        </div>

        {CATEGORIES.map((cat) => {
          const items = withImg.filter((v) => v.category === cat);
          if (!items.length) return null;
          const img = CATEGORY_IMG[cat];
          return (
            <section key={cat} style={{ marginTop: 28 }}>
              <div
                className={img ? "guide-hero" : undefined}
                style={img ? { backgroundImage: `url(/images/trailer-stills/${img}.jpg)`, marginTop: 0 } : undefined}
              >
                <div className="section-head" style={img ? { position: "relative", zIndex: 1, padding: "20px 24px" } : undefined}>
                  <h2 style={img ? { textShadow: "0 2px 10px rgba(0,0,0,0.7)" } : undefined}>{cat}</h2>
                </div>
              </div>
              <div className="coords" style={{ marginTop: 10 }}>
                {items.map((v) => (
                  <div
                    className="coord has-img"
                    key={v.name}
                    style={{ backgroundImage: `url(/images/trailer-stills/${v.img}.jpg)`, minHeight: 160 }}
                  >
                    <span className="xy">{v.category}</span>
                    <h3>{v.name}</h3>
                    <span className="status">● Spotted in trailers</span>
                    <p>Modeled after the {v.inspiration} — one of the named vehicles fan trackers have confirmed so far.</p>
                  </div>
                ))}
              </div>
            </section>
          );
        })}

        <p style={{ color: "var(--fg-dim)", fontSize: 13, marginTop: 20 }}>
          Compiled from{" "}
          <a href="https://gtabase.com/gta-6/vehicles/" target="_blank" rel="noopener noreferrer nofollow">
            GTABase
          </a>
          &apos;s vehicle tracker — a fan database built from trailer and screenshot sightings, not
          an official Rockstar list. GTABase and other trackers disagree on the total count (estimates
          range from roughly 260 to 317+), so treat any specific total you see elsewhere with caution.
          Card backgrounds are stills from Rockstar&apos;s own trailers, used as atmosphere — not a
          claim that any specific photo shows that exact named vehicle.
        </p>
        <p style={{ marginTop: 16 }}>
          More garage coverage: <Link href="/characters">the cast</Link>,{" "}
          <Link href="/guides/map-of-leonida">map of Leonida</Link>, or the{" "}
          <Link href="/sources">full Sources hub</Link>.
        </p>
        <Comments />
      </div>
    </main>
  );
}
