import Link from "next/link";
import type { Metadata } from "next";
import Comments from "@/components/Comments";
import characters from "@/data/characters.json";

export const metadata: Metadata = {
  title: "GTA6 Characters — EverythingGTA6",
  description:
    "Jason Duval, Lucia Caminos, and the confirmed supporting cast of Grand Theft Auto VI, sourced from Rockstar's own press-kit bios.",
};

// Real, per-character screenshots from GTA BOOM's cast roundup (see citation
// below) wherever one exists. The two with no confirmed photo yet (Lori,
// DWNPLY) fall back to one of our own trailer stills each, used once, with
// an honest caption instead of a false character match.
const FALLBACK_IMG: Record<string, { file: string; caption: string }> = {
  Lori: { file: "biplane-beach-stunt", caption: "No confirmed photo yet — Keys coastline, from the trailers" },
  DWNPLY: { file: "nightclub-crowd", caption: "No confirmed photo yet — Vice City nightlife, from the trailers" },
};

function imageFor(c: { name: string; image: string | null; imageCaption: string | null }) {
  if (c.image) return { src: c.image, caption: c.imageCaption ?? "", external: true };
  const fb = FALLBACK_IMG[c.name];
  return { src: `/images/trailer-stills/${fb.file}.jpg`, caption: fb.caption, external: false };
}

export default function CharactersPage() {
  const protagonists = characters.filter((c) => c.role === "Protagonist");
  const supporting = characters.filter((c) => c.role !== "Protagonist");

  return (
    <main>
      <div className="wrap">
        <div className="guide-hero" style={{ backgroundImage: "url(/images/trailer-stills/balcony-sunset.jpg)" }}>
          <div className="guide-head">
            <Link href="/" className="back">
              &larr; Back to EverythingGTA6
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
          {protagonists.map((c) => {
            const img = imageFor(c);
            return (
              <div className="coord has-img" key={c.name} style={{ backgroundImage: `url(${img.src})`, minHeight: 240 }}>
                <span className="xy">{c.sector}</span>
                <h3>{c.name}</h3>
                <span className="status">● {c.role}</span>
                <p>{c.body}</p>
                {img.caption && <span className="cite">{img.caption}</span>}
              </div>
            );
          })}
        </div>

        <div className="section-head" style={{ marginTop: 28 }}>
          <h2>Supporting Cast</h2>
        </div>
        <div className="coords">
          {supporting.map((c) => {
            const img = imageFor(c);
            return (
              <div className="coord has-img" key={c.name} style={{ backgroundImage: `url(${img.src})`, minHeight: 200 }}>
                <span className="xy">{c.sector}</span>
                <h3>{c.name}</h3>
                <span className="status">● {c.role}</span>
                <p>{c.body}</p>
                {img.caption && <span className="cite">{img.caption}</span>}
              </div>
            );
          })}
        </div>

        <p style={{ color: "var(--fg-dim)", fontSize: 13, marginTop: 16 }}>
          Bios sourced from{" "}
          <a href="https://gtaintel.com/news/gta-6-supporting-cast-what-we-know" target="_blank" rel="noopener noreferrer nofollow">
            GTA Intel
          </a>
          . Photos are real, per-character screenshots from{" "}
          <a href="https://www.gtaboom.com/every-gta-6-character-confirmed-so-far-156f" target="_blank" rel="noopener noreferrer nofollow">
            GTA BOOM&apos;s cast roundup
          </a>
          , each one labeled by GTA BOOM as that specific character. Lori and DWNPLY have no
          confirmed photo yet, so their cards use a trailer still with an honest caption instead.
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
