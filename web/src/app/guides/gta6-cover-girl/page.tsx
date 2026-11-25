import Link from "next/link";
import type { Metadata } from "next";
import Comments from "@/components/Comments";
import JsonLd from "@/components/JsonLd";
import EntityLink from "@/components/EntityLink";
import { breadcrumbSchema, articleSchema, faqSchema, canonical, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Who Is the GTA6 Cover Girl? Theories, Explained — EverythingGTA6",
  description:
    "Rockstar never named the woman on GTA6's official cover art. The leading fan theory, the competing copycat claims, and what's actually confirmed.",
  alternates: canonical("/guides/gta6-cover-girl"),
};

const FAQS = [
  {
    q: "Who is the GTA6 cover girl?",
    a: "Rockstar has never named her. The leading fan theory points to Gabriela Chiquin, a Venezuelan DJ and influencer, based on a strong resemblance — but neither Rockstar nor Chiquin has confirmed it.",
  },
  {
    q: "Is the GTA6 cover girl based on a real person?",
    a: "Unconfirmed either way. Fans matched the cover art to pre-existing photos of Chiquin, and the resemblance predates the cover reveal by roughly two years, which rules out an after-the-fact copy. Chiquin has addressed the rumor on Instagram without confirming or denying she's the inspiration.",
  },
  {
    q: "Does the GTA6 cover girl appear in the game?",
    a: "Not that anyone's found. Past GTA cover models for GTA4 and GTA5 didn't appear in those games either, and no match has turned up since GTA6's November 19, 2026 launch.",
  },
];

export default function Gta6CoverGirlGuide() {
  return (
    <main>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: SITE_URL },
          { name: "GTA6 Cover Girl", url: `${SITE_URL}/guides/gta6-cover-girl` },
        ])}
      />
      <JsonLd
        data={articleSchema({
          headline: "Who Is the GTA6 Cover Girl?",
          description:
            "Rockstar never named the woman on GTA6's official cover art. The leading fan theory, the competing copycat claims, and what's actually confirmed.",
          url: `${SITE_URL}/guides/gta6-cover-girl`,
          datePublished: "2026-11-25",
        })}
      />
      <JsonLd data={faqSchema(FAQS.map(({ q, a }) => ({ question: q, answer: a })))} />
      <div className="wrap">
        <div className="guide-hero" style={{ backgroundImage: "url(/images/trailer-stills/nightclub-crowd.jpg)" }}>
          <div className="guide-head">
            <Link href="/" className="back">
              &larr; Back to EverythingGTA6
            </Link>
            <div className="k">Launch Week Mystery</div>
            <h1>Who Is the GTA6 Cover Girl?</h1>
            <p>
              Rockstar&apos;s official box art shipped without a name attached to the woman on it.
              Fans found a candidate fast — but it still isn&apos;t confirmed, and a wave of
              competing claims since launch has only muddied it further.
            </p>
          </div>
        </div>

        <div className="coords">
          <div className="coord">
            <span className="xy">THE FACTS</span>
            <h3 style={{ fontSize: 17 }}>What Rockstar Has Actually Said</h3>
            <span className="status">● Confirmed</span>
            <p>
              Rockstar revealed GTA6&apos;s official cover art showing a brunette woman in a green
              top, framed against the series&apos; usual poster-collage style. Rockstar has not
              named her, confirmed she&apos;s based on a real person, or said whether she appears
              in the game at all — standard practice for the series. GTA4&apos;s and GTA5&apos;s
              cover models didn&apos;t appear in either game, and nobody has found a match for this
              cover art since GTA6 launched on November 19, 2026, either.
            </p>
          </div>

          <div className="coord">
            <span className="xy">LEADING THEORY</span>
            <h3 style={{ fontSize: 17 }}>Gabriela Chiquin, Venezuelan DJ</h3>
            <span className="status">● Unconfirmed, well-sourced</span>
            <p>
              Within a weekend of the cover reveal, fans converged on Gabriela Chiquin (
              <code>@chiquin__</code>), a Venezuelan DJ, producer and influencer — citing a photo
              of her in a green cropped top with the same hairstyle, facial features and makeup as
              the cover art. That photo predates the reveal by roughly two years, which rules out
              her having copied the look afterward. Chiquin has commented on the rumor on
              Instagram more than once without confirming or denying it, and Rockstar has stayed
              silent.
            </p>
            <a className="cite" href="https://www.gtaboom.com/the-venezuelan-dj-fans-think-is-the-gta-6-cover-girl-6f0b" target="_blank" rel="noopener noreferrer nofollow">
              Source: GTA BOOM &rarr;
            </a>{" "}
            <a className="cite" href="https://www.pushsquare.com/guides/who-is-the-gta-6-cover-art-girl-and-is-she-based-on-a-real-person" target="_blank" rel="noopener noreferrer nofollow">
              Source: Push Square &rarr;
            </a>
          </div>

          <div className="coord">
            <span className="xy">SINCE LAUNCH</span>
            <h3 style={{ fontSize: 17 }}>Two New, Conflicting Self-Claims</h3>
            <span className="status">● Unverified Claim</span>
            <p>
              Launch week brought a second wave: an Instagram post captioned &quot;I AM THE GTA VI
              COVER GIRL,&quot; claiming to have worked as a reference model for the artwork, and a
              separate post naming a different person — an NYC-based model — as the &quot;official
              cover girl.&quot; The two claims don&apos;t agree with each other or with the Chiquin
              theory, neither is corroborated by Rockstar or by an outlet we&apos;d trust on its
              own, and we&apos;re not treating either as fact. We&apos;re listing them because
              they&apos;re part of why this is still unsettled, not because we can verify them.
            </p>
          </div>
        </div>

        <p style={{ color: "var(--fg-dim)", fontSize: 13, marginTop: 20, lineHeight: 1.7 }}>
          This is a different mystery from GTA6&apos;s &quot;Bikini Girl&quot; — a background NPC
          from the 2023 debut trailer, once rumored to be{" "}
          <EntityLink type="character" name="Lucia Caminos" />, and found in-game days after launch
          (see our{" "}
          <Link href="/guides/gta6-launch-day-discoveries">launch day discoveries</Link> guide).
          The cover girl is a marketing-image question, not an in-game one, and as of this writing
          nobody has shown her turning up as a character at all.
        </p>
        <p style={{ marginTop: 16 }}>
          More: <Link href="/characters">meet the confirmed cast</Link>,{" "}
          <Link href="/guides/craziest-gta6-stories">craziest launch stories</Link>, or the{" "}
          <Link href="/sources">full Sources hub</Link>.
        </p>
        <Comments />
      </div>
    </main>
  );
}
