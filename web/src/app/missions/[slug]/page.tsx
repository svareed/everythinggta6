import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Comments from "@/components/Comments";
import JsonLd from "@/components/JsonLd";
import { findMission, getAllMissions } from "@/lib/missions";
import { characterSlug, findCharacter } from "@/lib/characters";
import { breadcrumbSchema, articleSchema, SITE_URL } from "@/lib/seo";

function characterLink(name: string | null | undefined) {
  if (!name) return name;
  const found = findCharacter(characterSlug(name));
  if (!found) return name;
  return <Link href={`/characters/${characterSlug(found.name)}`}>{name}</Link>;
}

export function generateStaticParams() {
  return getAllMissions()
    .filter((m) => m.slug)
    .map((m) => ({ slug: m.slug as string }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const mission = findMission((await params).slug);
  if (!mission) return {};
  return {
    title: `${mission.name} — GTA6 Mission Walkthrough — EverythingGTA6`,
    description: mission.description ?? `${mission.name}, ${mission.chapter} of GTA6.`,
  };
}

export default async function MissionPage({ params }: { params: Promise<{ slug: string }> }) {
  const mission = findMission((await params).slug);
  if (!mission) notFound();

  const chapterMissions = getAllMissions().filter((m) => m.chapter === mission.chapter);

  const metaDescription = mission.description ?? `${mission.name}, ${mission.chapter} of GTA6.`;

  return (
    <main>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: SITE_URL },
          { name: "Missions", url: `${SITE_URL}/missions` },
          { name: mission.name, url: `${SITE_URL}/missions/${mission.slug}` },
        ])}
      />
      <JsonLd
        data={articleSchema({
          headline: mission.name,
          description: metaDescription,
          url: `${SITE_URL}/missions/${mission.slug}`,
          image: mission.img ? `${SITE_URL}${mission.img}` : undefined,
          dateModified: mission.scraped_at,
        })}
      />
      <div className="wrap">
        <div
          className={mission.img ? "guide-hero" : undefined}
          style={mission.img ? { backgroundImage: `url(${mission.img})` } : undefined}
        >
          <div className="guide-head">
            <Link href="/missions" className="back">
              &larr; Back to Every Mission
            </Link>
            <div className="k">
              {mission.chapter}
              {mission.story_number ? ` · Mission #${mission.story_number}` : ""}
            </div>
            <h1>{mission.name}</h1>
            <p>
              {mission.optional ? "Optional side mission" : "Main story mission"}
              {mission.playable_as ? <> — play as {characterLink(mission.playable_as)}</> : ""}
              {mission.given_by ? <>, given by {characterLink(mission.given_by)}</> : ""}.
            </p>
          </div>
        </div>

        {mission.description && (
          <>
            <div className="guide-head" style={{ paddingBlock: "28px 8px" }}>
              <h2 style={{ fontSize: 22, margin: 0 }}>What Happens</h2>
            </div>
            <p style={{ fontSize: 15, lineHeight: 1.7, maxWidth: 720 }}>{mission.description}</p>
          </>
        )}

        {mission.walkthrough_url && (
          <p style={{ marginTop: 16 }}>
            <a
              className="cite"
              href={mission.walkthrough_url}
              target="_blank"
              rel="noopener noreferrer nofollow"
            >
              Full walkthrough &amp; tips at GTABase &rarr;
            </a>
          </p>
        )}

        <p style={{ color: "var(--fg-dim)", fontSize: 13, marginTop: 20 }}>
          Compiled from{" "}
          <a href={mission.source_url} target="_blank" rel="noopener noreferrer nofollow">
            GTABase&apos;s mission tracker
          </a>
          , a fan-built walkthrough rather than an official Rockstar list. The excerpt above is a
          short summary of the opening beats and any tip GTABase calls out — the full
          step-by-step walkthrough stays on GTABase&apos;s own page, linked above.
        </p>

        <div className="guide-head" style={{ paddingBlock: "28px 8px" }}>
          <h2 style={{ fontSize: 22, margin: 0 }}>Rest of {mission.chapter}</h2>
        </div>
        <div className="coords">
          {chapterMissions.map((m, i) => (
            <div className={m.img ? "coord has-img" : "coord"} key={`${m.name}-${i}`} style={m.img ? { backgroundImage: `url(${m.img})`, minHeight: 120 } : undefined}>
              <span className="xy">
                {mission.chapter.toUpperCase()} · {i + 1}
              </span>
              <h3 style={{ fontSize: 16 }}>
                {m.slug ? <Link href={`/missions/${m.slug}`}>{m.name}</Link> : m.name}
              </h3>
              <span className="status">{m.optional ? "○ Optional" : "● Story Mission"}</span>
            </div>
          ))}
        </div>

        <p style={{ marginTop: 16 }}>
          More: <Link href="/missions">every mission</Link>, <Link href="/characters">the cast</Link>,{" "}
          or the <Link href="/sources">full Sources hub</Link>.
        </p>
        <Comments />
      </div>
    </main>
  );
}
