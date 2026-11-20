import Link from "next/link";
import type { Metadata } from "next";
import Comments from "@/components/Comments";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema, faqSchema, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "GTA6 Confirmed Features: Cameos, Weapons, Animals & More — EverythingGTA6",
  description:
    "Is Franklin, Michael, or Tommy Vercetti in GTA6? Can you make real money? Is there a twerk button? Quick, honest answers to the odd specific questions people keep searching.",
};

const FAQS = [
  {
    q: "Is Franklin, Michael, or Trevor in GTA6?",
    a: "No classic GTA protagonist has been confirmed to appear in GTA6. The story is built around an entirely new cast led by Jason Duval and Lucia Caminos — no crossover appearance from GTA5's cast has been announced.",
  },
  {
    q: "Is Tommy Vercetti in GTA6?",
    a: "No. Vice City returns as the setting, but Tommy Vercetti (GTA: Vice City's protagonist) hasn't been confirmed to appear — GTA6 tells its own story with new characters.",
  },
  {
    q: "What weapons are in GTA6?",
    a: "Rockstar hasn't published a full weapon list. Our cheats guide documents the confirmed weapon-related cheat codes (Infinite Ammo, Max Ammo, Vehicle Force, and more) where real weapon names surface.",
  },
  {
    q: "Are there animals in GTA6?",
    a: "Yes — wildlife is a real, documented part of the open world, including a Florida-flavored cryptid (a \"Skunk Ape\"/Bigfoot) players found and chased within hours of launch. See our launch-day discoveries guide.",
  },
  {
    q: "Can you make real money in GTA6?",
    a: "No — any in-game cash, including from exploits like the stash-bag respawn glitch players found at launch, stays inside the game. There's no real-money trading mechanic built into GTA6 itself.",
  },
  {
    q: "Does GTA6 have a twerk button?",
    a: "This is a recurring GTA meme question (going back to GTA Online's dance-animation features) rather than anything Rockstar has specifically confirmed or denied for GTA6.",
  },
  {
    q: "What's the plot of GTA6, and does it spoil the ending here?",
    a: "No spoilers here. The broad setup — Jason Duval and Lucia Caminos, a Bonnie-and-Clyde-style criminal duo working through Leonida — is public pre-launch information; story beats and the ending are not something we're covering as a walkthrough.",
  },
];

export default function Gta6ConfirmedFeatures() {
  return (
    <main>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: SITE_URL },
          { name: "Confirmed Features", url: `${SITE_URL}/guides/gta6-confirmed-features` },
        ])}
      />
      <JsonLd data={faqSchema(FAQS.map(({ q, a }) => ({ question: q, answer: a })))} />
      <div className="wrap">
        <div className="guide-hero" style={{ backgroundImage: "url(/images/trailer-stills/motorcycle-seaplane.jpg)" }}>
          <div className="guide-head">
            <Link href="/" className="back">
              &larr; Back to EverythingGTA6
            </Link>
            <div className="k">Quick Answers</div>
            <h1>GTA6 Confirmed Features, Answered</h1>
            <p>
              The odd, specific questions people keep searching — cameos, weapons, wildlife,
              money, and the rest — answered straight, no spoilers.
            </p>
          </div>
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
          No single-source citation here — these are either confirmed facts already documented
          elsewhere on this site (see the links below) or straightforward absence-of-evidence
          answers about an entirely new cast. Nothing here is from gta6bible.com.
        </p>
        <p style={{ marginTop: 16 }}>
          More: <Link href="/cheats">cheat codes</Link>,{" "}
          <Link href="/guides/gta6-launch-day-discoveries">launch day discoveries</Link>,{" "}
          <Link href="/characters">the cast</Link>, or the <Link href="/sources">full Sources hub</Link>.
        </p>
        <Comments />
      </div>
    </main>
  );
}
