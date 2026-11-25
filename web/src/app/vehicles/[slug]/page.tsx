import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Comments from "@/components/Comments";
import JsonLd from "@/components/JsonLd";
import { findVehicle, getAllVehicles, vehicleSlug } from "@/lib/vehicles";
import { breadcrumbSchema, articleSchema, faqSchema, canonical, SITE_URL } from "@/lib/seo";

export function generateStaticParams() {
  return getAllVehicles().map((v) => ({ slug: vehicleSlug(v) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const vehicle = findVehicle((await params).slug);
  if (!vehicle) return {};
  return {
    title: `${vehicle.name} — GTA6 Vehicles — EverythingGTA6`,
    description: vehicle.based_on
      ? `${vehicle.name}, modeled after ${vehicle.based_on} — a GTA6 ${vehicle.class.toLowerCase()} vehicle.`
      : `${vehicle.name}, a GTA6 ${vehicle.class.toLowerCase()} vehicle.`,
    alternates: canonical(`/vehicles/${vehicleSlug(vehicle)}`),
  };
}

export default async function VehiclePage({ params }: { params: Promise<{ slug: string }> }) {
  const vehicle = findVehicle((await params).slug);
  if (!vehicle) notFound();

  const slug = vehicleSlug(vehicle);
  const sameClass = getAllVehicles()
    .filter((v) => v.class === vehicle.class && vehicleSlug(v) !== slug)
    .slice(0, 6);

  const faqs = [
    ...(vehicle.based_on
      ? [{ q: `What is the GTA6 ${vehicle.name} based on?`, a: `It's modeled after the ${vehicle.based_on}.` }]
      : []),
    ...(vehicle.manufacturer
      ? [{ q: `Who makes the ${vehicle.name} in GTA6?`, a: `The ${vehicle.name} is made by ${vehicle.manufacturer} in GTA6.` }]
      : []),
    { q: `What class of vehicle is the ${vehicle.name}?`, a: `The ${vehicle.name} is a ${vehicle.class} vehicle.` },
    ...(vehicle.specs?.["Seats"]
      ? [{ q: `How many seats does the ${vehicle.name} have?`, a: `The ${vehicle.name} has ${vehicle.specs["Seats"]} seats.` }]
      : []),
    ...(vehicle.ratings && Object.keys(vehicle.ratings).length > 0
      ? [
          {
            q: `What are the ${vehicle.name}'s stats in GTA6?`,
            a: `${vehicle.name}: ${Object.entries(vehicle.ratings)
              .map(([label, value]) => `${label} ${value}`)
              .join(", ")}.`,
          },
        ]
      : []),
  ];

  return (
    <main>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: SITE_URL },
          { name: "Vehicles", url: `${SITE_URL}/vehicles` },
          { name: vehicle.name, url: `${SITE_URL}/vehicles/${slug}` },
        ])}
      />
      <JsonLd
        data={articleSchema({
          headline: vehicle.name,
          description: vehicle.based_on ?? `A GTA6 ${vehicle.class.toLowerCase()} vehicle.`,
          url: `${SITE_URL}/vehicles/${slug}`,
          image: vehicle.img ? `${SITE_URL}${vehicle.img}` : undefined,
          dateModified: vehicle.scraped_at,
        })}
      />
      <JsonLd data={faqSchema(faqs.map(({ q, a }) => ({ question: q, answer: a })))} />
      <div className="wrap">
        <div
          className={vehicle.img ? "guide-hero" : undefined}
          style={vehicle.img ? { backgroundImage: `url(${vehicle.img})` } : undefined}
        >
          <div className="guide-head">
            <Link href="/vehicles" className="back">
              &larr; Back to Vehicles
            </Link>
            <div className="k">{vehicle.class}</div>
            <h1>{vehicle.name}</h1>
            {vehicle.manufacturer && <p>Manufacturer: {vehicle.manufacturer}</p>}
          </div>
        </div>

        {vehicle.based_on && (
          <>
            <div className="guide-head" style={{ paddingBlock: "28px 8px" }}>
              <h2 style={{ fontSize: 22, margin: 0 }}>Real-World Inspiration</h2>
            </div>
            <p style={{ fontSize: 15, lineHeight: 1.7, maxWidth: 720 }}>
              Modeled after the {vehicle.based_on}.
            </p>
          </>
        )}

        {vehicle.ratings && Object.keys(vehicle.ratings).length > 0 && (
          <>
            <div className="guide-head" style={{ paddingBlock: "28px 8px" }}>
              <h2 style={{ fontSize: 22, margin: 0 }}>Ratings</h2>
            </div>
            <div className="coords">
              {Object.entries(vehicle.ratings).map(([label, value]) => (
                <div className="coord" key={label}>
                  <span className="xy">{label.toUpperCase()}</span>
                  <h3 style={{ fontSize: 22 }}>{value}</h3>
                </div>
              ))}
            </div>
          </>
        )}

        {vehicle.specs && Object.keys(vehicle.specs).length > 0 && (
          <>
            <div className="guide-head" style={{ paddingBlock: "28px 8px" }}>
              <h2 style={{ fontSize: 22, margin: 0 }}>Specs</h2>
            </div>
            <div className="coords">
              {Object.entries(vehicle.specs).map(([label, value]) => (
                <div className="coord" key={label}>
                  <span className="xy">{label.toUpperCase()}</span>
                  <h3 style={{ fontSize: 16 }}>{value}</h3>
                </div>
              ))}
            </div>
          </>
        )}

        <p style={{ color: "var(--fg-dim)", fontSize: 13, marginTop: 20 }}>
          Compiled from{" "}
          <a href={vehicle.detail_url} target="_blank" rel="noopener noreferrer nofollow">
            GTABase&apos;s vehicle database
          </a>
          , a fan-built database built from trailer and screenshot sightings, not an official
          Rockstar list.
        </p>

        <div className="guide-head" style={{ paddingBlock: "28px 8px" }}>
          <h2 style={{ fontSize: 22, margin: 0 }}>Frequently Asked Questions</h2>
        </div>
        <div className="coords">
          {faqs.map((f) => (
            <div className="coord" key={f.q}>
              <h3 style={{ fontSize: 16 }}>{f.q}</h3>
              <p>{f.a}</p>
            </div>
          ))}
        </div>

        {sameClass.length > 0 && (
          <>
            <div className="guide-head" style={{ paddingBlock: "28px 8px" }}>
              <h2 style={{ fontSize: 22, margin: 0 }}>More {vehicle.class} Vehicles</h2>
            </div>
            <div className="coords">
              {sameClass.map((v) => (
                <div className="coord" key={vehicleSlug(v)}>
                  <span className="xy">{v.class.toUpperCase()}</span>
                  <h3 style={{ fontSize: 16 }}>
                    <Link href={`/vehicles/${vehicleSlug(v)}`}>{v.name}</Link>
                  </h3>
                </div>
              ))}
            </div>
          </>
        )}

        <p style={{ marginTop: 16 }}>
          More: <Link href="/vehicles">full garage</Link>, <Link href="/characters">the cast</Link>,{" "}
          or the <Link href="/sources">full Sources hub</Link>.
        </p>
        <Comments />
      </div>
    </main>
  );
}
