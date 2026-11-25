import Link from "next/link";
import type { Metadata } from "next";
import Comments from "@/components/Comments";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema, articleSchema, faqSchema, canonical, SITE_URL } from "@/lib/seo";

const FAQS = [
  {
    q: "How many protagonists does GTA6 have compared to GTA5?",
    a: "GTA5 had three — Michael, Franklin, and Trevor. GTA6 has two: Jason Duval and Lucia Caminos, the series' first female protagonist.",
  },
  {
    q: "How many years passed between GTA5 and GTA6?",
    a: "13 years — GTA5 launched September 17, 2013, and GTA6 launched November 19, 2026, the longest gap between mainline GTA titles.",
  },
  {
    q: "Is GTA6 more expensive than GTA5 was at launch?",
    a: "Yes — GTA5 launched at $59.99 in 2013; GTA6 launched at $79.99.",
  },
];

export const metadata: Metadata = {
  title: "GTA6 vs GTA5: Map, Protagonists, Price & Gap — EverythingGTA6",
  description:
    "How GTA6 actually compares to GTA5 — map and setting, protagonist count, price, engine, and the 13-year gap between them, each point sourced.",
  alternates: canonical("/guides/gta6-vs-gta5"),
};

const COMPARISONS = [
  {
    label: "Setting",
    gta5: "Los Santos & Blaine County, based on Southern California",
    gta6: "Leonida, based on Florida, centered on Vice City (Miami-inspired)",
  },
  {
    label: "Protagonists",
    gta5: "Three playable leads: Michael, Franklin, Trevor",
    gta6: "Two: Jason Duval and Lucia Caminos — the series' first female protagonist",
  },
  {
    label: "Release date",
    gta5: "September 17, 2013",
    gta6: "November 19, 2026 — a 13-year gap, the longest between mainline GTA titles",
  },
  {
    label: "Launch price (US, standard edition)",
    gta5: "$59.99 at 2013 launch",
    gta6: "$79.99 (see our full price guide)",
  },
  {
    label: "Sales record",
    gta5: "Widely reported as the best-selling game of the 2010s decade",
    gta6: "Reported as the most pre-ordered video game ever ahead of launch",
  },
];

export default function Gta6VsGta5Guide() {
  return (
    <main>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: SITE_URL },
          { name: "GTA6 vs GTA5", url: `${SITE_URL}/guides/gta6-vs-gta5` },
        ])}
      />
      <JsonLd
        data={articleSchema({
          headline: "GTA6 vs GTA5: Map, Protagonists, Price & Gap",
          description:
            "How GTA6 actually compares to GTA5 — map and setting, protagonist count, price, and the 13-year gap between them.",
          url: `${SITE_URL}/guides/gta6-vs-gta5`,
        })}
      />
      <JsonLd data={faqSchema(FAQS.map(({ q, a }) => ({ question: q, answer: a })))} />
      <div className="wrap">
        <div className="guide-hero" style={{ backgroundImage: "url(/images/trailer-stills/highway-skyline.jpg)" }}>
          <div className="guide-head">
            <Link href="/" className="back">
              &larr; Back to EverythingGTA6
            </Link>
            <div className="k">Comparison</div>
            <h1>GTA6 vs GTA5</h1>
            <p>Thirteen years apart — here&apos;s what actually changed, point by point.</p>
          </div>
        </div>

        <div className="coords">
          {COMPARISONS.map((c) => (
            <div className="coord" key={c.label}>
              <span className="xy">{c.label.toUpperCase()}</span>
              <p>
                <strong>GTA5:</strong> {c.gta5}
              </p>
              <p>
                <strong>GTA6:</strong> {c.gta6}
              </p>
            </div>
          ))}
        </div>

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
          GTA6 map and cast facts per our own{" "}
          <Link href="/guides/map-of-leonida">map of Leonida</Link> and{" "}
          <Link href="/characters">characters</Link> guides, each independently sourced there.
          GTA5&apos;s best-selling-of-the-decade status per{" "}
          <a
            href="https://www.denofgeek.com/games/grand-theft-auto-5-best-selling-game-decade/"
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            Den of Geek
          </a>
          . GTA6 pre-order record and background per{" "}
          <a href="https://en.wikipedia.org/wiki/Grand_Theft_Auto_VI" target="_blank" rel="noopener noreferrer nofollow">
            Wikipedia
          </a>
          . Nothing here is from gta6bible.com.
        </p>
        <p style={{ marginTop: 16 }}>
          More: <Link href="/guides/gta6-price">price guide</Link>,{" "}
          <Link href="/guides/map-of-leonida">map of Leonida</Link>, or the{" "}
          <Link href="/sources">full Sources hub</Link>.
        </p>
        <Comments />
      </div>
    </main>
  );
}
