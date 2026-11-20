import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Comments from "@/components/Comments";
import JsonLd from "@/components/JsonLd";
import { characterSlug, findCharacter, getAllCharacters, imageFor, voiceActorFor } from "@/lib/characters";
import { breadcrumbSchema, SITE_URL } from "@/lib/seo";

export function generateStaticParams() {
  return getAllCharacters().map((c) => ({ slug: characterSlug(c.name) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const character = findCharacter((await params).slug);
  if (!character) return {};
  return {
    title: `${character.name} — GTA6 Characters — EverythingGTA6`,
    description: character.body,
  };
}

export default async function CharacterPage({ params }: { params: Promise<{ slug: string }> }) {
  const character = findCharacter((await params).slug);
  if (!character) notFound();

  const img = imageFor(character);
  const others = getAllCharacters().filter((c) => c.name !== character.name);

  return (
    <main>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: SITE_URL },
          { name: "Characters", url: `${SITE_URL}/characters` },
          { name: character.name, url: `${SITE_URL}/characters/${characterSlug(character.name)}` },
        ])}
      />
      <div className="wrap">
        <div className="guide-hero" style={{ backgroundImage: `url(${img.src})` }}>
          <div className="guide-head">
            <Link href="/characters" className="back">
              &larr; Back to the Cast
            </Link>
            <div className="k">{character.sector}</div>
            <h1>{character.name}</h1>
            <p>{character.role}</p>
          </div>
        </div>

        <div className="guide-head" style={{ paddingBlock: "28px 8px" }}>
          <h2 style={{ fontSize: 22, margin: 0 }}>Story</h2>
        </div>
        <p style={{ fontSize: 15, lineHeight: 1.7, maxWidth: 720 }}>{character.body}</p>
        {voiceActorFor(character.name) && (
          <p style={{ color: "var(--fg-dim)", fontSize: 13, marginTop: 8 }}>
            Voiced/performed by {voiceActorFor(character.name)}.
          </p>
        )}
        {img.caption && (
          <p style={{ color: "var(--fg-dim)", fontSize: 13, marginTop: 8 }}>{img.caption}</p>
        )}

        <p style={{ color: "var(--fg-dim)", fontSize: 13, marginTop: 20 }}>
          Bio sourced from{" "}
          <a
            href="https://gtaintel.com/news/gta-6-supporting-cast-what-we-know"
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            GTA Intel
          </a>
          . Photo credited to{" "}
          <a
            href="https://www.gtaboom.com/every-gta-6-character-confirmed-so-far-156f"
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            GTA BOOM&apos;s cast roundup
          </a>
          {img.external ? ", which GTA BOOM labels as this specific character." : "."}
          {voiceActorFor(character.name) && (
            <>
              {" "}
              Voice/performance credit per{" "}
              <a
                href="https://www.gamespot.com/articles/gta-6-voice-actors-all-confirmed-and-rumored-cast/"
                target="_blank"
                rel="noopener noreferrer nofollow"
              >
                GameSpot
              </a>
              .
            </>
          )}
        </p>

        <div className="guide-head" style={{ paddingBlock: "28px 8px" }}>
          <h2 style={{ fontSize: 22, margin: 0 }}>Rest of the Cast</h2>
        </div>
        <div className="coords">
          {others.map((c) => (
            <div className="coord" key={c.name}>
              <span className="xy">{c.sector}</span>
              <h3>
                <Link href={`/characters/${characterSlug(c.name)}`}>{c.name}</Link>
              </h3>
              <span className="status">● {c.role}</span>
            </div>
          ))}
        </div>

        <p style={{ marginTop: 16 }}>
          More: <Link href="/characters">full cast</Link>, <Link href="/missions">every mission</Link>,{" "}
          or the <Link href="/sources">full Sources hub</Link>.
        </p>
        <Comments />
      </div>
    </main>
  );
}
