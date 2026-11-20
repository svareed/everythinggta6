import Link from "next/link";
import type { Metadata } from "next";
import Comments from "@/components/Comments";
import JsonLd from "@/components/JsonLd";
import { getAllMissions } from "@/lib/missions";
import { breadcrumbSchema, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "GTA6 Missions — Every Mission, Chapter by Chapter — EverythingGTA6",
  description:
    "Every GTA6 story and optional mission, grouped by chapter, compiled from GTABase's post-launch mission tracker — real per-mission screenshots where GTABase has them.",
};

const CHAPTERS = ["Prologue", "Chapter 1", "Chapter 2", "Chapter 3", "Chapter 4", "Chapter 5"];

const CHAPTER_BANNER: Record<string, string> = {
  "Chapter 1": "dock-seaplane",
  "Chapter 2": "red-shootout",
  "Chapter 3": "nightclub-crowd",
  "Chapter 4": "balcony-sunset",
  "Chapter 5": "bar-standoff",
};

const CHAPTER_BLURB: Record<string, string> = {
  Prologue: "Lucia's arrest, told from a prison counselor's office.",
  "Chapter 1": "The Keys — Jason and Lucia meet, and start working together.",
  "Chapter 2": "Port Gellhorn — laying low in a motel while the heat is on.",
  "Chapter 3": "Vice City — getting established, building toward the first big heist.",
  "Chapter 4": "Ocean Beach — new money, new problems, and the VCIA job.",
  "Chapter 5": "The endgame.",
};

const missions = getAllMissions();

export default function MissionsPage() {
  const byChapter = CHAPTERS.map((ch) => ({
    chapter: ch,
    items: missions.filter((m) => m.chapter === ch),
  }));
  const total = missions.length;
  const withImg = missions.filter((m) => m.img).length;

  return (
    <main>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: SITE_URL },
          { name: "Missions", url: `${SITE_URL}/missions` },
        ])}
      />
      <div className="wrap">
        <div className="guide-hero" style={{ backgroundImage: "url(/images/trailer-stills/skyscraper-climb.jpg)" }}>
          <div className="guide-head">
            <Link href="/" className="back">
              &larr; Back to EverythingGTA6
            </Link>
            <div className="k">Walkthrough</div>
            <h1>Every GTA6 Mission</h1>
            <p>
              All {total} missions, Prologue through Chapter 5, including optional side jobs —
              compiled from GTABase&apos;s mission tracker. {withImg} of them have a real,
              unique screenshot; the rest are listed by name only until GTABase (or we) capture one.
            </p>
          </div>
        </div>

        {byChapter.map(({ chapter, items }) => {
          if (!items.length) return null;
          const banner = CHAPTER_BANNER[chapter];
          return (
            <section key={chapter} style={{ marginTop: 28 }}>
              <div
                className={banner ? "guide-hero" : undefined}
                style={banner ? { backgroundImage: `url(/images/trailer-stills/${banner}.jpg)`, marginTop: 0 } : undefined}
              >
                <div className="section-head" style={banner ? { position: "relative", zIndex: 1, padding: "20px 24px" } : undefined}>
                  <h2 style={banner ? { textShadow: "0 2px 10px rgba(0,0,0,0.7)" } : undefined}>{chapter}</h2>
                  <p
                    style={{
                      fontSize: 13,
                      color: banner ? "var(--fg)" : "var(--fg-dim)",
                      textShadow: banner ? "0 2px 10px rgba(0,0,0,0.7)" : undefined,
                      marginTop: 4,
                    }}
                  >
                    {CHAPTER_BLURB[chapter]}
                  </p>
                </div>
              </div>
              <div className="coords" style={{ marginTop: 10 }}>
                {items.map((m, i) => (
                  <div
                    className={m.img ? "coord has-img" : "coord"}
                    key={`${chapter}-${m.name}-${i}`}
                    style={m.img ? { backgroundImage: `url(${m.img})`, minHeight: 150 } : undefined}
                  >
                    <span className="xy">
                      {chapter.toUpperCase()} · {i + 1}
                    </span>
                    <h3 style={{ fontSize: 16 }}>
                      {m.slug ? <Link href={`/missions/${m.slug}`}>{m.name}</Link> : m.name}
                    </h3>
                    <span className="status">{m.optional ? "○ Optional" : "● Story Mission"}</span>
                  </div>
                ))}
              </div>
            </section>
          );
        })}

        <p style={{ color: "var(--fg-dim)", fontSize: 13, marginTop: 20 }}>
          Compiled from{" "}
          <a href="https://gtabase.com/gta-6/missions" target="_blank" rel="noopener noreferrer nofollow">
            GTABase&apos;s mission tracker
          </a>
          , a fan-built walkthrough rather than an official Rockstar list — Rockstar has never
          published a mission list of its own. Thumbnails are real screenshots, saved locally
          rather than hotlinked (GTABase blocks cross-site hotlinking, so we mirror a small copy
          of each one instead of leeching their bandwidth) wherever GTABase has captured one;
          most of Chapter 3 onward still shows GTABase&apos;s own placeholder art, so those
          mission cards are text-only here rather than showing a fake match.
        </p>
        <p style={{ marginTop: 16 }}>
          More walkthrough coverage: <Link href="/cheats">cheat codes</Link>,{" "}
          <Link href="/characters">the cast</Link>, or the <Link href="/sources">full Sources hub</Link>.
        </p>
        <Comments />
      </div>
    </main>
  );
}
