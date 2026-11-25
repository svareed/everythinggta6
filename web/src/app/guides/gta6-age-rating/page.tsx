import Link from "next/link";
import type { Metadata } from "next";
import Comments from "@/components/Comments";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema, faqSchema, canonical, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "GTA6 Age Rating: ESRB, PEGI & What's Actually In It — EverythingGTA6",
  description:
    "GTA6 is rated M (Mature 17+) by the ESRB and 18 by PEGI. Here's what's actually confirmed about the content behind that rating, and what's still just reported.",
  alternates: canonical("/guides/gta6-age-rating"),
};

const FAQS = [
  {
    q: "What is GTA6 rated in the US?",
    a: "M for Mature 17+, per the ESRB. Rockstar has added the age rating to its own store pages; the ESRB's full detailed rating summary had not been published as of this writing.",
  },
  {
    q: "What is GTA6 rated in Europe?",
    a: "18, per PEGI. A detailed PEGI content listing was briefly published and then pulled — treat its specific claims as reported, not officially confirmed, since the detailed text is no longer live.",
  },
  {
    q: "What content descriptors does GTA6 carry?",
    a: "Reporting on the ESRB listing cites seven descriptors: Blood and Gore, Intense Violence, Mature Humor, Nudity, Strong Language, Strong Sexual Content, and Use of Drugs and Alcohol.",
  },
  {
    q: "Is GTA6 rated higher than GTA5?",
    a: "Both carry an ESRB M rating, but several outlets note GTA6's listing explicitly calls out sexual content and nudity more directly than GTA5's did — described by some coverage as going further in that specific area, not as a higher overall rating tier.",
  },
  {
    q: "What's GTA6's rating in Australia?",
    a: "Reported as R18+ (Restricted), with Australian and New Zealand store listings specifically calling out sex scenes in that classification.",
  },
];

export default function Gta6AgeRatingGuide() {
  return (
    <main>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: SITE_URL },
          { name: "Age Rating", url: `${SITE_URL}/guides/gta6-age-rating` },
        ])}
      />
      <JsonLd data={faqSchema(FAQS.map(({ q, a }) => ({ question: q, answer: a })))} />
      <div className="wrap">
        <div className="guide-hero" style={{ backgroundImage: "url(/images/trailer-stills/bar-standoff.jpg)" }}>
          <div className="guide-head">
            <Link href="/" className="back">
              &larr; Back to EverythingGTA6
            </Link>
            <div className="k">Rating</div>
            <h1>GTA6&apos;s Age Rating, Explained</h1>
            <p>M (Mature 17+) in the US, 18 under PEGI in Europe — same tier as every mainline GTA, with the specific content descriptors that earned it.</p>
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
          ESRB descriptors and PEGI reporting per{" "}
          <a href="https://www.ghacks.net/2026/10/02/gta-6-is-officially-rated-m-for-mature-with-sex-scenes-listed-in-australia-and-new-zealand/" target="_blank" rel="noopener noreferrer nofollow">
            Ghacks
          </a>
          ,{" "}
          <a href="https://www.gtaboom.com/pulled-gta-6-pegi-listing-confirms-cocaine-use-sex-and-dismemberment-cf38" target="_blank" rel="noopener noreferrer nofollow">
            GTABoom
          </a>
          , and{" "}
          <a href="https://www.videogameschronicle.com/news/gta-6-rating-pulled-after-revealing-sex-scenes-and-drug-use/" target="_blank" rel="noopener noreferrer nofollow">
            Video Games Chronicle
          </a>
          . The detailed PEGI content description was pulled after publication, so we&apos;re
          treating its specific claims as reported rather than verified — for the authoritative
          wording, check the ESRB and PEGI sites directly. Nothing here is from gta6bible.com.
        </p>
        <p style={{ marginTop: 16 }}>
          More: <Link href="/guides/gta6-confirmed-features">confirmed features FAQ</Link>,{" "}
          <Link href="/guides/gta6-faq">launch &amp; platforms FAQ</Link>, or the{" "}
          <Link href="/sources">full Sources hub</Link>.
        </p>
        <Comments />
      </div>
    </main>
  );
}
