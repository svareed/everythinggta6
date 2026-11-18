import Link from "next/link";
import type { Metadata } from "next";
import Comments from "@/components/Comments";
import characters from "@/data/characters.json";

export const metadata: Metadata = {
  title: "GTA6 Characters — Vice City Dispatch",
  description:
    "Jason Duval, Lucia Caminos, and the confirmed supporting cast of Grand Theft Auto VI, sourced from Rockstar's own press-kit bios.",
};

const PROTAGONIST_IMG: Record<string, string> = {
  "Jason Duval": "bar-standoff",
  "Lucia Caminos": "vault-heist",
};

export default function CharactersPage() {
  const protagonists = characters.filter((c) => c.role === "Protagonist");
  const supporting = characters.filter((c) => c.role !== "Protagonist");

  return (
    <main>
      <div className="wrap">
        <div className="guide-hero" style={{ backgroundImage: "url(/images/trailer-stills/balcony-sunset.jpg)" }}>
          <div className="guide-head">
            <Link href="/" className="back">
              &larr; Back to The Leonida Dispatch
            </Link>
            <div className="k">Cast</div>
            <h1>The Cast of GTA6</h1>
            <p>
              The confirmed protagonists and supporting cast, sourced from Rockstar&apos;s own
              press-kit bios — no new names have surfaced since launch day as of this writing.
            </p>
          </div>
        </div>

        <div className="section-head" style={{ marginTop: 28 }}>
          <h2>Protagonists</h2>
        </div>
        <div className="coords">
          {protagonists.map((c) => (
            <div
              className="coord has-img"
              key={c.name}
              style={{ backgroundImage: `url(/images/trailer-stills/${PROTAGONIST_IMG[c.name]}.jpg)`, minHeight: 220 }}
            >
              <span className="xy">{c.sector}</span>
              <h3>{c.name}</h3>
              <span className="status">● {c.role}</span>
              <p>{c.body}</p>
            </div>
          ))}
        </div>

        <div className="section-head" style={{ marginTop: 28 }}>
          <h2>Supporting Cast</h2>
        </div>
        <div className="coords">
          {supporting.map((c) => (
            <div className="coord" key={c.name}>
              <span className="xy">{c.sector}</span>
              <h3>{c.name}</h3>
              <span className="status">● {c.role}</span>
              <p>{c.body}</p>
            </div>
          ))}
        </div>

        <p style={{ color: "var(--fg-dim)", fontSize: 13, marginTop: 16 }}>
          Sourced from{" "}
          <a href="https://gtaintel.com/news/gta-6-supporting-cast-what-we-know" target="_blank" rel="noopener noreferrer nofollow">
            GTA Intel
          </a>{" "}
          and{" "}
          <a href="https://www.gtaboom.com/every-gta-6-character-confirmed-so-far-156f" target="_blank" rel="noopener noreferrer nofollow">
            GTA BOOM
          </a>
          , both citing Rockstar&apos;s official press materials. Protagonist images are stills from
          Rockstar&apos;s own trailers, not confirmed one-to-one portraits of each character.
        </p>
        <p style={{ marginTop: 16 }}>
          More on the cast: <Link href="/vehicles">vehicles</Link>,{" "}
          <Link href="/guides/map-of-leonida">map of Leonida</Link>, or the{" "}
          <Link href="/sources">full Sources hub</Link>.
        </p>
        <Comments />
      </div>
    </main>
  );
}
