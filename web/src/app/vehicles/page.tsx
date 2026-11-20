import Link from "next/link";
import type { Metadata } from "next";
import Comments from "@/components/Comments";
import JsonLd from "@/components/JsonLd";
import vehicles from "@/data/vehicles.json";
import { breadcrumbSchema, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "GTA6 Vehicles — EverythingGTA6",
  description:
    "Named cars, bikes, boats and aircraft spotted in GTA6's trailers and screenshots so far, with their real-world inspirations, compiled from GTABase.",
};

const CATEGORIES = ["Cars", "Off-Road & Utility", "Vans", "Motorcycles", "Air & Sea"];
// One section banner per category, used once each -- no repeats across the page.
const CATEGORY_IMG: Record<string, string> = {
  Cars: "hawaiian-shirt-truck",
  Motorcycles: "motorcycle-seaplane",
};
// Only the vehicles whose real-world type actually appears in one of our
// trailer stills get a card image -- a pickup truck, a motorcycle, a seaplane
// on the water, and an aircraft over the skyline. Every other vehicle here
// has no confirmed photo of its own, so its card stays text-only rather than
// showing a still that doesn't depict it.
const VEHICLE_IMG: Record<string, string> = {
  "Crest Kayak": "dock-seaplane",
  "Buckingham Volatus (helicopter)": "skyscraper-climb",
};

const withImg = vehicles.map((v) => ({ ...v, img: VEHICLE_IMG[v.name] }));

export default function VehiclesPage() {
  return (
    <main>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: SITE_URL },
          { name: "Vehicles", url: `${SITE_URL}/vehicles` },
        ])}
      />
      <div className="wrap">
        <div className="guide-hero" style={{ backgroundImage: "url(/images/trailer-stills/biplane-beach-stunt.jpg)" }}>
          <div className="guide-head">
            <Link href="/" className="back">
              &larr; Back to EverythingGTA6
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
                    className={v.img ? "coord has-img" : "coord"}
                    key={v.name}
                    style={v.img ? { backgroundImage: `url(/images/trailer-stills/${v.img}.jpg)`, minHeight: 160 } : undefined}
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
          Most vehicles here have no confirmed photo of their own, so their cards are text-only;
          a card only gets a background image when that vehicle&apos;s real-world type — a truck, a
          motorcycle, a seaplane, an aircraft — genuinely appears in one of Rockstar&apos;s own
          trailers, and each image is used once.
        </p>
        <p style={{ marginTop: 16 }}>
          More garage coverage: <Link href="/characters">the cast</Link>,{" "}
          <Link href="/guides/map-of-leonida">map of Leonida</Link>,{" "}
          <Link href="/guides/gta6-radio-stations">radio stations</Link>, or the{" "}
          <Link href="/sources">full Sources hub</Link>.
        </p>
        <Comments />
      </div>
    </main>
  );
}
