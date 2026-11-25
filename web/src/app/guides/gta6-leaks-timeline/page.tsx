import Link from "next/link";
import type { Metadata } from "next";
import Comments from "@/components/Comments";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema, articleSchema, faqSchema, canonical, SITE_URL } from "@/lib/seo";

const FAQS = [
  { q: "When did Rockstar confirm GTA6 was in development?", a: "February 2022 — after years of speculation, Rockstar officially confirmed GTA6 was in active development." },
  {
    q: "What was the biggest GTA6 leak?",
    a: "The September 2022 footage breach, where a hacker leaked dozens of clips of unfinished, early-build gameplay. It remains the single largest GTA6 leak to date, and Rockstar confirmed it was genuine at the time.",
  },
  {
    q: "Was there a leak right before GTA6 launched?",
    a: "Yes — days before the November 19, 2026 launch, a leaker going by Cyberleek torrented what was claimed to be GTA6's Xbox build.",
  },
];

export const metadata: Metadata = {
  title: "The GTA6 Leaks Timeline: What Was True — EverythingGTA6",
  description:
    "Every major GTA6 leak, in order, from the September 2022 footage breach to Cyberleek's pre-launch Xbox build — and what each one actually turned out to get right.",
  alternates: canonical("/guides/gta6-leaks-timeline"),
};

const LEAKS = [
  {
    date: "February 2022",
    title: "Rockstar confirms development",
    body: "After years of speculation, Rockstar officially confirmed GTA6 was in active development — not a leak, but the moment speculation turned into fact.",
  },
  {
    date: "September 2022",
    title: "The footage breach",
    body: "A hacker leaked dozens of clips of unfinished, early-build gameplay footage. It remains the single largest GTA6 leak to date and was confirmed genuine by Rockstar at the time.",
  },
  {
    date: "September 2023",
    title: "Jason and Lucia footage resurfaces",
    body: "Further unearthed footage gave an early look at the two protagonists, feeding into pre-reveal speculation about the cast and setting.",
  },
  {
    date: "December 2023",
    title: "Official reveal",
    body: "Rockstar's first official trailer confirmed the Vice City setting, the Bonnie-and-Clyde-style protagonist duo, and ended years of leak-driven guesswork with real, authorized footage.",
  },
  {
    date: "November 2026 (pre-launch)",
    title: "\"Cyberleek\" leaks an Xbox build",
    body: "Days before launch, a leaker going by Cyberleek torrented what was claimed to be GTA6's Xbox build, reportedly to raise money — framed by the leaker as a final attempt to cash in before release made the leak worthless.",
  },
];

export default function Gta6LeaksTimeline() {
  return (
    <main>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: SITE_URL },
          { name: "Leaks Timeline", url: `${SITE_URL}/guides/gta6-leaks-timeline` },
        ])}
      />
      <JsonLd
        data={articleSchema({
          headline: "The GTA6 Leaks Timeline: What Was True",
          description:
            "Every major GTA6 leak, in order, from the September 2022 footage breach to Cyberleek's pre-launch Xbox build.",
          url: `${SITE_URL}/guides/gta6-leaks-timeline`,
        })}
      />
      <JsonLd data={faqSchema(FAQS.map(({ q, a }) => ({ question: q, answer: a })))} />
      <div className="wrap">
        <div className="guide-hero" style={{ backgroundImage: "url(/images/trailer-stills/red-shootout.jpg)" }}>
          <div className="guide-head">
            <Link href="/" className="back">
              &larr; Back to EverythingGTA6
            </Link>
            <div className="k">Retrospective</div>
            <h1>The GTA6 Leaks Timeline</h1>
            <p>
              Now that the game has actually shipped, here&apos;s every major leak in order — and
              which ones held up.
            </p>
          </div>
        </div>

        <div className="coords">
          {LEAKS.map((l) => (
            <div className="coord" key={l.date}>
              <span className="xy">{l.date.toUpperCase()}</span>
              <h3 style={{ fontSize: 16 }}>{l.title}</h3>
              <p>{l.body}</p>
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
          Development and 2022 leak timeline per{" "}
          <a href="https://en.wikipedia.org/wiki/Grand_Theft_Auto_VI" target="_blank" rel="noopener noreferrer nofollow">
            Wikipedia
          </a>
          . 2023 footage resurfacing per{" "}
          <a
            href="https://www.ggrecon.com/articles/leaked-gta-6-footage-shows-off-protagonists-jason-and-lucia/"
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            GGRecon
          </a>
          . The pre-launch Cyberleek leak per{" "}
          <a
            href="https://gameranx.com/updates/id/564525/article/cyberleek-is-leaking-gta-6s-xbox-build-to-raise-his-crypto-to-15-million/"
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            Gameranx
          </a>
          . For who was behind a lot of the earlier prediction-style reporting (not leaks, but
          informed forecasting), see reporting on insider Tom Henderson&apos;s GTA6 track record.
          Nothing here is from gta6bible.com.
        </p>
        <p style={{ marginTop: 16 }}>
          More: <Link href="/guides/gta6-faq">launch &amp; platforms FAQ</Link>,{" "}
          <Link href="/sources/hidden-gems">trailer easter eggs</Link>, or the{" "}
          <Link href="/sources">full Sources hub</Link>.
        </p>
        <Comments />
      </div>
    </main>
  );
}
