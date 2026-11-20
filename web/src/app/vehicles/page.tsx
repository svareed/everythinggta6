import Link from "next/link";
import type { Metadata } from "next";
import Comments from "@/components/Comments";
import JsonLd from "@/components/JsonLd";
import { getAllVehicles, getVehicleClasses, vehicleSlug } from "@/lib/vehicles";
import { breadcrumbSchema, SITE_URL } from "@/lib/seo";

const vehicles = getAllVehicles();
const total = vehicles.length;

export const metadata: Metadata = {
  title: `GTA6 Vehicles: All ${total}, by Class — EverythingGTA6`,
  description:
    "Every named GTA6 vehicle GTABase has catalogued so far, grouped by class, with real-world inspirations, ratings, and screenshots where confirmed.",
};

export default function VehiclesPage() {
  const classes = getVehicleClasses();
  const byClass = classes.map((cls) => ({
    cls,
    items: vehicles.filter((v) => v.class === cls),
  }));

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
              Rockstar has never published a master vehicle list — this is all {total} vehicles
              GTABase&apos;s database has catalogued so far, grouped by class.
            </p>
          </div>
        </div>

        {byClass.map(({ cls, items }) => {
          if (!items.length) return null;
          return (
            <section key={cls} style={{ marginTop: 28 }}>
              <div className="section-head">
                <h2>
                  {cls} <span style={{ color: "var(--fg-dim)", fontWeight: 400 }}>({items.length})</span>
                </h2>
              </div>
              <div className="coords" style={{ marginTop: 10 }}>
                {items.map((v) => (
                  <div
                    className={v.img ? "coord has-img" : "coord"}
                    key={vehicleSlug(v)}
                    style={v.img ? { backgroundImage: `url(${v.img})`, minHeight: 160 } : undefined}
                  >
                    <span className="xy">{v.class.toUpperCase()}</span>
                    <h3>
                      <Link href={`/vehicles/${vehicleSlug(v)}`}>{v.name}</Link>
                    </h3>
                    {v.based_on && <p>Modeled after the {v.based_on}.</p>}
                  </div>
                ))}
              </div>
            </section>
          );
        })}

        <p style={{ color: "var(--fg-dim)", fontSize: 13, marginTop: 20 }}>
          Compiled from{" "}
          <a href="https://www.gtabase.com/gta-6/vehicles/" target="_blank" rel="noopener noreferrer nofollow">
            GTABase
          </a>
          &apos;s vehicle database — a fan database built from trailer and screenshot sightings,
          not an official Rockstar list. Vehicle class, real-world inspiration, and rating data
          come directly from GTABase&apos;s own per-vehicle listings; screenshots are mirrored
          locally wherever GTABase has one (not every vehicle does yet).
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
