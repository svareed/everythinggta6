import Link from "next/link";
import type { Metadata } from "next";
import Comments from "@/components/Comments";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema, articleSchema, faqSchema, canonical, SITE_URL } from "@/lib/seo";

const FAQS = [
  {
    q: "Is GTA6 confirmed for PC?",
    a: "Not yet — Rockstar has never announced a PC version, release window, storefront, or system requirements.",
  },
  {
    q: "When will GTA6 release on PC?",
    a: "No official date. GamesBeat reported, citing four industry sources, that Rockstar is targeting Q1 2027 — that's reporting, not a Rockstar announcement.",
  },
  {
    q: "How long did GTA5 take to arrive on PC?",
    a: "About 19 months — GTA5 launched on consoles September 17, 2013, and its PC version arrived April 14, 2015.",
  },
];

export const metadata: Metadata = {
  title: "GTA6 PC Release Date: What's Confirmed and What's Rumored — EverythingGTA6",
  description:
    "Rockstar hasn't announced a GTA6 PC release date. Here's exactly what's official, what's reported, and how long GTA5's own PC port took as a real comparison.",
  alternates: canonical("/guides/gta6-pc-release"),
};

const TIMELINE = [
  { date: "Nov 19, 2026", event: "GTA6 launches — PS5 and Xbox Series X|S only. No PC version ships day one." },
  { date: "Oct 2026", event: "GamesBeat reports, citing four industry sources, that Rockstar is targeting Q1 2027 for PC — reporting, not a Rockstar announcement." },
  { date: "Unconfirmed", event: "No PC storefront, system requirements, or exact date has been published by Rockstar as of this writing." },
];

export default function Gta6PcReleaseGuide() {
  return (
    <main>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: SITE_URL },
          { name: "PC Release Date", url: `${SITE_URL}/guides/gta6-pc-release` },
        ])}
      />
      <JsonLd
        data={articleSchema({
          headline: "GTA6 PC Release Date: What's Confirmed and What's Rumored",
          description:
            "What Rockstar has actually said about a PC version, what's been reported, and GTA5's own PC-port timeline as a comparison.",
          url: `${SITE_URL}/guides/gta6-pc-release`,
        })}
      />
      <JsonLd data={faqSchema(FAQS.map(({ q, a }) => ({ question: q, answer: a })))} />
      <div className="wrap">
        <div className="guide-hero" style={{ backgroundImage: "url(/images/trailer-stills/skyscraper-climb.jpg)" }}>
          <div className="guide-head">
            <Link href="/" className="back">
              &larr; Back to EverythingGTA6
            </Link>
            <div className="k">PC Port</div>
            <h1>Is GTA6 Coming to PC? Here&apos;s Everything Real</h1>
            <p>
              Short version: not yet, and Rockstar hasn&apos;t given a date. Here&apos;s what&apos;s
              actually been said, what&apos;s been reported, and what GTA5&apos;s own PC wait looked
              like — so you can judge the rumors against a real precedent instead of a guess.
            </p>
          </div>
        </div>

        <div className="guide-head" style={{ paddingBlock: "28px 8px" }}>
          <h2 style={{ fontSize: 22, margin: 0 }}>What Rockstar Has Actually Confirmed</h2>
        </div>
        <p style={{ fontSize: 15, lineHeight: 1.7, maxWidth: 720 }}>
          At launch, GTA6 is PS5 and Xbox Series X|S only. Rockstar has never announced a PC
          version, a release window, a storefront (Steam, Epic, Rockstar Games Launcher — all
          unconfirmed), or system requirements. Any &quot;GTA6 PC specs&quot; list you see
          circulating is unofficial speculation, not a real spec sheet from Rockstar.
        </p>

        <div className="guide-head" style={{ paddingBlock: "28px 8px" }}>
          <h2 style={{ fontSize: 22, margin: 0 }}>Timeline</h2>
        </div>
        <div className="coords">
          {TIMELINE.map((t) => (
            <div className="coord" key={t.date}>
              <span className="xy">{t.date.toUpperCase()}</span>
              <p>{t.event}</p>
            </div>
          ))}
        </div>

        <div className="guide-head" style={{ paddingBlock: "28px 8px" }}>
          <h2 style={{ fontSize: 22, margin: 0 }}>The Real Precedent: GTA5&apos;s PC Wait</h2>
        </div>
        <p style={{ fontSize: 15, lineHeight: 1.7, maxWidth: 720 }}>
          GTA5 launched on PS3 and Xbox 360 on September 17, 2013. Its PC version didn&apos;t arrive
          until April 14, 2015 — about 19 months later, after two of its own delays. If GTA6
          follows a similar pattern, the reported Q1 2027 window (roughly 13–15 months after the
          November 2026 console launch) would actually be <em>faster</em> than GTA5&apos;s PC gap,
          not slower. That&apos;s a real comparison, not a promise — Rockstar hasn&apos;t confirmed
          either timeline moves the same way twice.
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
          Platform confirmation per{" "}
          <a
            href="https://www.techradar.com/gaming/consoles-pc/gta-6-is-coming-to-ps5-and-xbox-series-xors-but-theres-no-word-on-a-pc-release"
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            TechRadar
          </a>
          . The Q1 2027 window is{" "}
          <a href="https://gamesbeat.com/grand-theft-auto-vis-pc-release-is-slated-for-q1-2027/" target="_blank" rel="noopener noreferrer nofollow">
            GamesBeat&apos;s
          </a>{" "}
          own reporting, citing four industry sources — not a Rockstar statement, so treat it as
          likely rather than locked in. GTA5&apos;s console/PC dates per{" "}
          <a href="https://www.exitlag.com/blog/gta-v-release-date/?from=games" target="_blank" rel="noopener noreferrer nofollow">
            ExitLag&apos;s release-date recap
          </a>
          . Nothing here is from gta6bible.com.
        </p>
        <p style={{ marginTop: 16 }}>
          More: <Link href="/guides/gta6-faq">launch &amp; platforms FAQ</Link>,{" "}
          <Link href="/guides/gta6-online-mode">is there a GTA6 Online mode?</Link>,{" "}
          <Link href="/guides/gta6-budget-and-delays">budget &amp; delay history</Link>, or the{" "}
          <Link href="/sources">full Sources hub</Link>.
        </p>
        <Comments />
      </div>
    </main>
  );
}
