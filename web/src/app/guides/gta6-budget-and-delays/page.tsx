import Link from "next/link";
import type { Metadata } from "next";
import Comments from "@/components/Comments";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema, articleSchema, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "GTA6's Budget, Development Cost & Delay History — EverythingGTA6",
  description:
    "How much GTA6 reportedly cost to make, and the full, dated history of its delays — from its December 2023 reveal to the actual November 19, 2026 launch.",
};

const DELAYS = [
  { date: "December 2023", event: "Rockstar formally reveals GTA6, targeting a Fall 2025 release." },
  { date: "May 2025", event: "First delay announced: pushed to May 26, 2026." },
  { date: "November 2025", event: "Second delay announced: pushed to November 19, 2026 — the actual launch date." },
  { date: "November 19, 2026", event: "GTA6 launches on PS5 and Xbox Series X|S." },
];

export default function Gta6BudgetAndDelays() {
  return (
    <main>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: SITE_URL },
          { name: "Budget & Delays", url: `${SITE_URL}/guides/gta6-budget-and-delays` },
        ])}
      />
      <JsonLd
        data={articleSchema({
          headline: "GTA6's Budget, Development Cost & Delay History",
          description:
            "How much GTA6 reportedly cost to make, and the full, dated history of its delays.",
          url: `${SITE_URL}/guides/gta6-budget-and-delays`,
        })}
      />
      <div className="wrap">
        <div className="guide-hero" style={{ backgroundImage: "url(/images/trailer-stills/bar-standoff.jpg)" }}>
          <div className="guide-head">
            <Link href="/" className="back">
              &larr; Back to EverythingGTA6
            </Link>
            <div className="k">Retrospective</div>
            <h1>What GTA6 Cost, and Why It Took So Long</h1>
            <p>
              Rockstar and Take-Two have never given an exact development budget, but the delay
              timeline is well documented. Here&apos;s both, with the estimates clearly flagged as
              estimates.
            </p>
          </div>
        </div>

        <div className="guide-head" style={{ paddingBlock: "28px 8px" }}>
          <h2 style={{ fontSize: 22, margin: 0 }}>Development Cost</h2>
        </div>
        <p style={{ fontSize: 15, lineHeight: 1.7, maxWidth: 720 }}>
          Take-Two&apos;s CEO has only said publicly that GTA6 &quot;was expensive&quot; — no exact
          figure has come from Rockstar or Take-Two. Analyst estimates commonly cited in the press
          range from $1–1.5 billion, with a less-verified claim of up to $3 billion circulating
          based on a Reddit-sourced salary tally rather than any official source. For comparison,
          GTA5&apos;s development cost was reported at around $265 million.
        </p>

        <div className="guide-head" style={{ paddingBlock: "28px 8px" }}>
          <h2 style={{ fontSize: 22, margin: 0 }}>Delay Timeline</h2>
        </div>
        <div className="coords">
          {DELAYS.map((d) => (
            <div className="coord" key={d.date}>
              <span className="xy">{d.date.toUpperCase()}</span>
              <p>{d.event}</p>
            </div>
          ))}
        </div>

        <div className="guide-head" style={{ paddingBlock: "28px 8px" }}>
          <h2 style={{ fontSize: 22, margin: 0 }}>PC Requirements?</h2>
        </div>
        <p style={{ fontSize: 15, lineHeight: 1.7, maxWidth: 720 }}>
          There&apos;s nothing to publish here yet: GTA6 isn&apos;t confirmed for PC at all (see
          our <Link href="/guides/gta6-faq">launch &amp; platforms FAQ</Link>), so any &quot;system
          requirements&quot; list circulating online right now is unofficial speculation, not a
          real spec sheet. We&apos;d rather say that plainly than invent one.
        </p>

        <p style={{ color: "var(--fg-dim)", fontSize: 13, marginTop: 20 }}>
          Development-cost estimates per{" "}
          <a href="https://www.nme.com/news/gaming-news/grand-theft-auto-6-cost-development-billion-rockstar-3937967" target="_blank" rel="noopener noreferrer nofollow">
            NME
          </a>{" "}
          and{" "}
          <a href="https://gamingbolt.com/?p=643158" target="_blank" rel="noopener noreferrer nofollow">
            GamingBolt
          </a>
          . Delay timeline per{" "}
          <a
            href="https://www.gamesradar.com/games/grand-theft-auto/gta-6-delayed-6-more-months-as-rockstar-commits-to-november-2026-and-says-sorry"
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            GamesRadar
          </a>{" "}
          and{" "}
          <a href="https://beebom.com/gta-6-development-history-timeline/" target="_blank" rel="noopener noreferrer nofollow">
            Beebom
          </a>
          . Sources don&apos;t fully agree on the exact delay count — treat this as the best
          current reconstruction, not a Rockstar-published timeline. Nothing here is from
          gta6bible.com.
        </p>
        <p style={{ marginTop: 16 }}>
          More: <Link href="/guides/gta6-faq">launch &amp; platforms FAQ</Link>,{" "}
          <Link href="/guides/gta6-price">price guide</Link>, or the{" "}
          <Link href="/sources">full Sources hub</Link>.
        </p>
        <Comments />
      </div>
    </main>
  );
}
