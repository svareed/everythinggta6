import Link from "next/link";
import type { Metadata } from "next";
import Comments from "@/components/Comments";
import JsonLd from "@/components/JsonLd";
import { characterSlug } from "@/lib/characters";
import { breadcrumbSchema, articleSchema, faqSchema, canonical, SITE_URL } from "@/lib/seo";

const FAQS = [
  {
    q: "Who voices Jason Duval in GTA6?",
    a: "Dylan Rourke, confirmed via Rockstar's own launch-day credits.",
  },
  {
    q: "Who voices Lucia Caminos in GTA6?",
    a: "Manni L. Perez is widely reported as the performer, reinforced by a Best Performance nomination at The Game Awards 2026 tied to GTA6 — though Rockstar hasn't issued a standalone confirmation the way it did for Rourke.",
  },
  {
    q: "Has the rest of the GTA6 cast's actors been revealed?",
    a: "Not as of this writing — no other cast member's performer has surfaced in reputable reporting.",
  },
];

export const metadata: Metadata = {
  title: "Who Plays Jason and Lucia in GTA6? The Voice Cast, Explained — EverythingGTA6",
  description:
    "Dylan Rourke as Jason Duval and Manni L. Perez as Lucia Caminos — what's actually confirmed about GTA6's two lead performances, sourced and dated.",
  alternates: canonical("/guides/gta6-voice-cast"),
};

export default function Gta6VoiceCastGuide() {
  return (
    <main>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: SITE_URL },
          { name: "Voice Cast", url: `${SITE_URL}/guides/gta6-voice-cast` },
        ])}
      />
      <JsonLd
        data={articleSchema({
          headline: "Who Plays Jason and Lucia in GTA6? The Voice Cast, Explained",
          description:
            "What's confirmed about Dylan Rourke as Jason Duval and Manni L. Perez as Lucia Caminos, sourced and dated.",
          url: `${SITE_URL}/guides/gta6-voice-cast`,
        })}
      />
      <JsonLd data={faqSchema(FAQS.map(({ q, a }) => ({ question: q, answer: a })))} />
      <div className="wrap">
        <div className="guide-hero" style={{ backgroundImage: "url(/images/trailer-stills/balcony-sunset.jpg)" }}>
          <div className="guide-head">
            <Link href="/" className="back">
              &larr; Back to EverythingGTA6
            </Link>
            <div className="k">Voice Cast</div>
            <h1>Who Plays Jason and Lucia in GTA6?</h1>
            <p>
              Dylan Rourke and Manni L. Perez — here&apos;s what&apos;s actually confirmed about
              each, and why the two aren&apos;t equally certain.
            </p>
          </div>
        </div>

        <div className="guide-head" style={{ paddingBlock: "28px 8px" }}>
          <h2 style={{ fontSize: 22, margin: 0 }}>
            Dylan Rourke as{" "}
            <Link href={`/characters/${characterSlug("Jason Duval")}`}>Jason Duval</Link>
          </h2>
        </div>
        <p style={{ fontSize: 15, lineHeight: 1.7, maxWidth: 720 }}>
          This is the more solid of the two. Rockstar&apos;s own launch-day credits — published
          alongside the November 19, 2026 release — list Dylan Rourke as the performer behind
          Jason, and multiple outlets independently reported the same credits that day. Before
          launch, this was rumor and fan speculation (another actor, Roger Craig Smith, had
          publicly denied involvement); the credits are what moved it from speculation to
          confirmed.
        </p>

        <div className="guide-head" style={{ paddingBlock: "28px 8px" }}>
          <h2 style={{ fontSize: 22, margin: 0 }}>
            Manni L. Perez as{" "}
            <Link href={`/characters/${characterSlug("Lucia Caminos")}`}>Lucia Caminos</Link>
          </h2>
        </div>
        <p style={{ fontSize: 15, lineHeight: 1.7, maxWidth: 720 }}>
          This one carries a bit more hedge. Perez is widely reported as Lucia across gaming
          outlets, and her name picked up a Best Performance nomination at The Game Awards 2026
          tied to GTA6. But unlike Jason, Rockstar hasn&apos;t issued a separate, character-by-
          character announcement confirming her specifically — the identification rests on
          outlet reporting and the awards nomination, not a standalone Rockstar statement. Treat
          it as strongly reported rather than Rockstar-confirmed in the same direct way as Rourke.
          Perez isn&apos;t new to the franchise either — she previously had a minor credited role
          in GTA5/GTA Online.
        </p>

        <div className="guide-head" style={{ paddingBlock: "28px 8px" }}>
          <h2 style={{ fontSize: 22, margin: 0 }}>The Rest of the Cast</h2>
        </div>
        <p style={{ fontSize: 15, lineHeight: 1.7, maxWidth: 720 }}>
          As of this writing, no other GTA6 cast member&apos;s actor has surfaced in reputable
          reporting — Jason and Lucia are the only two with a named performer attached. See the
          full <Link href="/characters">cast page</Link> for everyone Rockstar has confirmed by
          character name, voice credits or not.
        </p>

        <div className="guide-head" style={{ paddingBlock: "28px 8px" }}>
          <h2 style={{ fontSize: 22, margin: 0 }}>Frequently Asked Questions</h2>
        </div>
        <div className="coords">
          {FAQS.map((f) => (
            <div className="coord" key={f.q}>
              <h3 style={{ fontSize: 16 }}>{f.q}</h3>
              <p>{f.a}</p>
            </div>
          ))}
        </div>

        <p style={{ color: "var(--fg-dim)", fontSize: 13, marginTop: 20 }}>
          Dylan Rourke&apos;s launch-day credit per{" "}
          <a
            href="https://www.videogameschronicle.com/news/see-yall-in-leonida-jasons-actor-finally-confirms-hes-in-gta-6/"
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            Video Games Chronicle
          </a>{" "}
          and{" "}
          <a href="https://www.notebookcheck.net/GTA-6-credits-confirm-Dylan-Rourke-as-Jason-Duval-as-both-leads-go-public-on-launch-day.1454738.0.html" target="_blank" rel="noopener noreferrer nofollow">
            Notebookcheck
          </a>
          . Manni L. Perez reporting per{" "}
          <a href="https://beebom.com/who-plays-lucia-in-gta-6-manni-l-perez/" target="_blank" rel="noopener noreferrer nofollow">
            Beebom
          </a>{" "}
          and{" "}
          <a href="https://www.gamespot.com/articles/gta-6-voice-actors-all-confirmed-and-rumored-cast/" target="_blank" rel="noopener noreferrer nofollow">
            GameSpot&apos;s
          </a>{" "}
          voice-cast roundup. Nothing here is from gta6bible.com.
        </p>
        <p style={{ marginTop: 16 }}>
          More: <Link href="/characters">full cast</Link>,{" "}
          <Link href="/guides/gta6-online-mode">is there a GTA6 Online mode?</Link>,{" "}
          <Link href="/guides/gta6-pc-release">is GTA6 coming to PC?</Link>, or the{" "}
          <Link href="/sources">full Sources hub</Link>.
        </p>
        <Comments />
      </div>
    </main>
  );
}
