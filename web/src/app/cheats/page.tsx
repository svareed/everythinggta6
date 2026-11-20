import Link from "next/link";
import type { Metadata } from "next";
import Comments from "@/components/Comments";
import DpadSequence from "@/components/DpadSequence";
import JsonLd from "@/components/JsonLd";
import cheats from "@/data/cheats.json";
import { breadcrumbSchema, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "GTA6 Cheat Codes — EverythingGTA6",
  description:
    "GTA6's real cheat codes, cross-checked across launch-day reporting: how to enter them, every confirmed D-pad sequence, and what's still unconfirmed.",
};

type Cheat = { name: string; sequence: string | null; requirement: string; confirmed: boolean };

export default function CheatsPage() {
  const confirmed = (cheats as Cheat[]).filter((c) => c.confirmed);
  const unconfirmed = (cheats as Cheat[]).filter((c) => !c.confirmed);

  return (
    <main>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: SITE_URL },
          { name: "Cheats", url: `${SITE_URL}/cheats` },
        ])}
      />
      <div className="wrap">
        <div className="guide-hero" style={{ backgroundImage: "url(/images/trailer-stills/vault-heist.jpg)" }}>
          <div className="guide-head">
            <Link href="/" className="back">
              &larr; Back to EverythingGTA6
            </Link>
            <div className="k">Cheats</div>
            <h1>GTA6 Cheat Codes</h1>
            <p>
              Rockstar has never published an official cheat list, but launch-day reporting
              agrees on how the system works and confirms {confirmed.length} exact codes so far.
              Treat this as a living, partial list — not everything has leaked yet.
            </p>
          </div>
        </div>

        <div className="guide-head" style={{ paddingBlock: "28px 8px" }}>
          <div className="k">How It Works</div>
          <h2 style={{ fontSize: 22, margin: 0 }}>Entering a Cheat</h2>
        </div>
        <ul style={{ color: "var(--fg-dim)", fontSize: 13.5, lineHeight: 1.8, paddingLeft: 18 }}>
          <li>Press Up on the D-pad to open the in-game phone.</li>
          <li>Hold L1 and press R1 on PS5, or hold LB and press RB on Xbox.</li>
          <li>Enter the D-pad sequence for the cheat you want.</li>
          <li>
            Cheats stay locked until you finish the main story; several also need their own
            challenge completed first (shown per cheat below). GTA5&apos;s old codes and phone
            numbers do not carry over.
          </li>
          <li>Using any cheat disables saving, trophies, and achievements for that session.</li>
        </ul>
        <p style={{ color: "var(--fg-dim)", fontSize: 12.5, marginTop: 4 }}>
          Per{" "}
          <a href="https://www.gtaboom.com/gta-6-cheats" target="_blank" rel="noopener noreferrer nofollow">
            GTA BOOM
          </a>
          , cross-checked against{" "}
          <a
            href="https://businessupturn.com/technology/gaming/gta-6-cheats-are-locked-behind-all-91-story-missions-and-gta-v-codes-do-not-work-what-is-reported-so-far/"
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            Business Upturn
          </a>{" "}
          and{" "}
          <a href="https://www.player.one/gta-6-has-61-cheats-players-must-finish-story-before-they-can-use-them-164534" target="_blank" rel="noopener noreferrer nofollow">
            Player.one
          </a>
          , which both report 61 total cheats exist across vehicles, screen filters, combat,
          player, and environment categories — most without a public code yet.
        </p>

        <div className="guide-head" style={{ paddingBlock: "28px 8px" }}>
          <div className="k">Confirmed Codes</div>
          <h2 style={{ fontSize: 22, margin: 0 }}>{confirmed.length} Verified D-Pad Sequences</h2>
        </div>
        <div className="coords">
          {confirmed.map((c) => (
            <div className="coord" key={c.name}>
              {c.sequence && <DpadSequence sequence={c.sequence} />}
              <h3>{c.name}</h3>
              <span className="status">● Confirmed</span>
              <p>{c.requirement}.</p>
            </div>
          ))}
        </div>

        <div className="guide-head" style={{ paddingBlock: "28px 8px" }}>
          <div className="k">Named, Not Yet Cracked</div>
          <h2 style={{ fontSize: 22, margin: 0 }}>Real Cheats Without a Public Code</h2>
        </div>
        <div className="coords">
          {unconfirmed.map((c) => (
            <div className="coord mystery" key={c.name}>
              <span className="xy">NO CODE YET</span>
              <h3>{c.name}</h3>
              <span className="status">○ Unconfirmed sequence</span>
              <p>{c.requirement}.</p>
            </div>
          ))}
        </div>

        <p style={{ color: "var(--fg-dim)", fontSize: 13, marginTop: 20 }}>
          The $250,000 code and the Body Armor unlock condition are each independently matched
          across separate reporting chains (GTA BOOM vs. TweakTown/Player.one), which is why
          we&apos;re confident in this list — but {confirmed.length} confirmed codes out of 61 total
          cheats means most of the system is still unmapped. Be skeptical of any site selling a &quot;complete
          cheat sheet,&quot; a trainer, or a code generator for GTA6 right now — several outlets
          have flagged those as scam bait during launch week.
        </p>
        <p style={{ marginTop: 16 }}>
          More walkthrough coverage: <Link href="/missions">every mission</Link>,{" "}
          <Link href="/vehicles">vehicles</Link>, <Link href="/guides/gta6-faq">launch &amp; platforms FAQ</Link>,
          or the <Link href="/sources">full Sources hub</Link>.
        </p>
        <Comments />
      </div>
    </main>
  );
}
