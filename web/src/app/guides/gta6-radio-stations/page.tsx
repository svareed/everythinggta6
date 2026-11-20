import Link from "next/link";
import type { Metadata } from "next";
import Comments from "@/components/Comments";
import JsonLd from "@/components/JsonLd";
import RadioLeonida from "@/components/RadioLeonida";
import { breadcrumbSchema, articleSchema, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "GTA6 Radio Stations: Every Confirmed DJ — EverythingGTA6",
  description:
    "The six Rockstar-confirmed GTA6 radio stations and their real-world DJs — Bad Bunny, Morgan Wallen, Lana Del Rey, Burna Boy, Slayer's Kerry King and Tom Araya, Robyn, and more.",
};

const STATIONS = [
  { name: "Cocoteo FM", genre: "Reggaeton, dembow, bachata, merengue", host: "Bad Bunny (as El Martillo), RaiNao (as La Gata)" },
  { name: "Back Country Radio", genre: "Country", host: "Morgan Wallen (MW), Lana Del Rey (Delta Dawne), Jeremy Dufrene (Mud Dog Mike)" },
  { name: "AfroBank FM", genre: "African music, classics through amapiano/3-step", host: "Burna Boy, Palms Trax (Palmsy)" },
  { name: "The Chamber 106.6", genre: "Metal", host: "Kerry King and Tom Araya of Slayer" },
  { name: "Flash FM", genre: "Pop", host: "Robyn, Alex Consani" },
  { name: "Dirty South Classics", genre: "Southern rap classics", host: "Trick Daddy, Trina" },
];

export default function Gta6RadioStations() {
  return (
    <main>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: SITE_URL },
          { name: "Radio Stations", url: `${SITE_URL}/guides/gta6-radio-stations` },
        ])}
      />
      <JsonLd
        data={articleSchema({
          headline: "GTA6 Radio Stations: Every Confirmed DJ",
          description:
            "The six Rockstar-confirmed GTA6 radio stations and their real-world DJs.",
          url: `${SITE_URL}/guides/gta6-radio-stations`,
        })}
      />
      <div className="wrap">
        <div className="guide-hero" style={{ backgroundImage: "url(/images/trailer-stills/nightclub-crowd.jpg)" }}>
          <div className="guide-head">
            <Link href="/" className="back">
              &larr; Back to EverythingGTA6
            </Link>
            <div className="k">In-Game Radio</div>
            <h1>Every Confirmed GTA6 Radio Station</h1>
            <p>
              Six stations are confirmed by Rockstar so far, each with real recording artists as
              in-world DJs. Rockstar has said more exist (including talk and classic rock) but
              hasn&apos;t detailed them yet.
            </p>
          </div>
        </div>

        <div className="coords">
          {STATIONS.map((s) => (
            <div className="coord" key={s.name}>
              <h3 style={{ fontSize: 17 }}>{s.name}</h3>
              <span className="status">● {s.genre}</span>
              <p>Hosted by {s.host}.</p>
            </div>
          ))}
        </div>

        <div className="guide-head" style={{ paddingBlock: "28px 8px" }}>
          <h2 style={{ fontSize: 22, margin: 0 }}>Can&apos;t wait for the game to load Leonida radio?</h2>
        </div>
        <RadioLeonida />

        <p style={{ color: "var(--fg-dim)", fontSize: 13, marginTop: 20 }}>
          Station and DJ details per{" "}
          <a
            href="https://consequence.net/2026/11/gta-6-radio-djs-keith-richards-bad-bunny-gloria-estefan/"
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            Consequence
          </a>{" "}
          and{" "}
          <a
            href="https://www.forbes.com/sites/brianmazique/2026/10/08/lana-del-rey-learned-las-roads-from-gta---now-shes-a-radio-dj-in-gta-vi-alongside-bad-bunny-and-morgan-wallen/"
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            Forbes
          </a>
          . You may see station lists online claiming 20+ stations (VCRR, The Vault Radio,
          Leonida Jazz Radio, and others) — those come from fan aggregators, not Rockstar press
          materials, so we&apos;re not listing them as confirmed here. Nothing here is from
          gta6bible.com.
        </p>
        <p style={{ marginTop: 16 }}>
          More: <Link href="/characters">the cast</Link>, <Link href="/guides/map-of-leonida">map of Leonida</Link>,
          {" "}or the <Link href="/sources">full Sources hub</Link>.
        </p>
        <Comments />
      </div>
    </main>
  );
}
