import Link from "next/link";
import type { Metadata } from "next";
import Comments from "@/components/Comments";
import JsonLd from "@/components/JsonLd";
import worldStories from "@/data/launch-stories.json";
import { breadcrumbSchema, articleSchema, canonical, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "The Craziest GTA6 Launch Stories — EverythingGTA6",
  description:
    "30 real, individually-sourced stories of how far people, schools, companies and governments went for GTA6's launch — rescheduled exams, paid days off, a marriage truce, a $135,000 job posting, and a lot more.",
  alternates: canonical("/guides/craziest-gta6-stories"),
};

const STORIES = [
  {
    sector: "STORY 01",
    name: "The Professor Who Moved Exam Day",
    tag: "Academia",
    body: "A professor in Spain emailed his class to say there would be no homework during GTA6's launch week — and moved their exam from the 23rd to the 30th. He was their age when GTA5 came out in 2013, and wanted them to have the same experience he did.",
  },
  {
    sector: "STORY 02",
    name: "A School's Attendance Bribe",
    tag: "Education",
    body: "A Catholic school in England took the opposite approach: every student who showed up on launch day and finished the full school day was entered into a draw for a £65 Amazon voucher — roughly what the game itself costs.",
  },
  {
    sector: "STORY 03",
    name: "The Marriage Contract",
    tag: "Marriage",
    body: "A couple in Singapore signed and framed a formal GTA6 agreement, granting the husband ten uninterrupted days — the 19th through the 29th — during which his wife agreed not to interrupt him mid-mission.",
  },
  {
    sector: "STORY 04",
    name: "Logitech's Paid Day Off",
    tag: "Workplace",
    body: "Logitech gave all 7,000 of its employees a paid day off specifically so they could play the game on launch day.",
  },
  {
    sector: "STORY 05",
    name: "A Company Holiday in India",
    tag: "Workplace",
    body: "Interior design firm Inday by Chezkart declared GTA6's launch day an official company holiday for its staff.",
  },
  {
    sector: "BONUS",
    name: "The $135,000 Job Posting",
    tag: "Job Posting",
    body: "Prediction-market company Kalshi posted a job for a \"GTA6 researcher\": one person gets paid up to $135,000 to stream the entire game and study how money works inside it.",
    mystery: true,
  },
];

export default function CraziestGta6Stories() {
  return (
    <main>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: SITE_URL },
          { name: "Craziest Launch Stories", url: `${SITE_URL}/guides/craziest-gta6-stories` },
        ])}
      />
      <JsonLd
        data={articleSchema({
          headline: "The Craziest GTA6 Launch Stories",
          description:
            "30 real, individually-sourced stories of how far people, schools, companies and governments went for GTA6's launch.",
          url: `${SITE_URL}/guides/craziest-gta6-stories`,
        })}
      />
      <div className="wrap">
        <div className="guide-hero" style={{ backgroundImage: "url(/images/trailer-stills/bar-standoff.jpg)" }}>
          <div className="guide-head">
            <Link href="/" className="back">
              &larr; Back to EverythingGTA6
            </Link>
            <div className="k">Launch Week</div>
            <h1>The Craziest GTA6 Launch Stories</h1>
            <p>
              Six real stories — rounded up from{" "}
              <a
                href="https://www.instagram.com/reel/Df448EQxbWK/"
                target="_blank"
                rel="noopener noreferrer nofollow"
              >
                Varun Mayya&apos;s viral Instagram reel
              </a>{" "}
              — plus 24 more, individually verified across global news coverage: how far
              people, schools, companies and governments went for GTA6&apos;s launch, worldwide.
            </p>
          </div>
        </div>
        <div className="coords">
          {STORIES.map((s) => (
            <div className={`coord${s.mystery ? " mystery" : ""}`} key={s.name}>
              <span className="xy">{s.sector}</span>
              <h3>{s.name}</h3>
              <span className="status">● {s.tag}</span>
              <p>{s.body}</p>
            </div>
          ))}
        </div>
        <p style={{ color: "var(--fg-dim)", fontSize: 13, marginTop: 8 }}>
          One estimate cited in the same reel suggests people taking time off work just to play
          GTA6 could cost companies nearly a billion dollars. All five stories plus the Kalshi job
          posting are recapped from{" "}
          <a
            href="https://www.instagram.com/reel/Df448EQxbWK/"
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            @thevarunmayya&apos;s reel
          </a>
          , transcribed from the original audio — not independently verified beyond that source.
        </p>

        <div className="guide-head" style={{ paddingBlock: "32px 16px" }}>
          <div className="k">The World Roundup</div>
          <h2 style={{ fontSize: 28, margin: 0 }}>24 More, Verified Country by Country</h2>
          <p>
            We went looking for 100 more stories in this genre. Real, individually-sourced ones —
            each with a working link back to the original report — topped out at 24. Every card
            below links to its source; nothing here is invented.
          </p>
        </div>
        <div className="coords">
          {worldStories.map((s) => (
            <div className="coord" key={s.name}>
              <span className="xy">
                {s.sector} — {s.country}
              </span>
              <h3>{s.name}</h3>
              <span className="status">● {s.tag}</span>
              <p>{s.body}</p>
              <a
                className="cite"
                href={s.source_url}
                target="_blank"
                rel="noopener noreferrer nofollow"
              >
                Source: {s.source_name} &rarr;
              </a>
            </div>
          ))}
        </div>

        <div className="guide-head" style={{ paddingBlock: "32px 8px" }}>
          <div className="k">By the Numbers</div>
          <h2 style={{ fontSize: 22, margin: 0 }}>A Few More Sourced Stats</h2>
        </div>
        <ul style={{ color: "var(--fg-dim)", fontSize: 13, lineHeight: 1.7, paddingLeft: 18 }}>
          <li>
            UK: an estimated 900,000 workers could call in sick for launch day, per{" "}
            <a href="https://www.ibtimes.co.uk/gta-vi-uk-workers-sick-leave-estimate-1831542" target="_blank" rel="noopener noreferrer nofollow">
              IBTimes UK
            </a>
            .
          </li>
          <li>
            USA: PTO requests for November 19 ran 9-17% above a normal third Thursday, per{" "}
            <a href="https://tech-insider.org/gta-6-launch-day-pto-requests-up-9-17-percent-bamboohr-2026/" target="_blank" rel="noopener noreferrer nofollow">
              BambooHR data reported by Tech Insider
            </a>
            .
          </li>
          <li>
            Australia: annual leave bookings for launch day were up 29% year-over-year, per{" "}
            <a href="https://www.forbes.com.au/?p=214497" target="_blank" rel="noopener noreferrer nofollow">
              Forbes Australia
            </a>
            .
          </li>
        </ul>

        <p style={{ marginTop: 16 }}>
          More real coverage: <Link href="/sources/news">latest news</Link>,{" "}
          <Link href="/guides/map-of-leonida">map of Leonida</Link>,{" "}
          <Link href="/guides/gta6-cover-girl">who&apos;s the cover girl?</Link>,{" "}
          <Link href="/guides/gta6-faq">launch &amp; platforms FAQ</Link>, or the{" "}
          <Link href="/sources">full Sources hub</Link>.
        </p>
        <Comments />
      </div>
    </main>
  );
}
