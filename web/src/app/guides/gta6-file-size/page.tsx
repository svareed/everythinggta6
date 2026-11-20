import Link from "next/link";
import type { Metadata } from "next";
import Comments from "@/components/Comments";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema, faqSchema, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "GTA6 File Size: How Many GB Is the Install? — EverythingGTA6",
  description:
    "Rockstar hasn't officially confirmed GTA6's install size. Here's the ~210GB PS5 figure everyone's citing, where it actually comes from, and why to treat it as an estimate.",
};

const FAQS = [
  {
    q: "How many GB is GTA6?",
    a: "Rockstar hasn't officially published an install size. The figure widely reported — around 210GB on PS5 — comes from the PlayStation Game Size tracking account, not Rockstar, though multiple outlets have repeated it.",
  },
  {
    q: "Is GTA6's Xbox Series X|S size different from PS5?",
    a: "No official Xbox figure exists either. Some outlets have repeated the same ~210GB figure for Xbox Series X|S; others say it's simply unconfirmed. Don't treat either as official.",
  },
  {
    q: "Will there be a day-one patch?",
    a: "Likely, based on how recent Rockstar titles have shipped, but no confirmed size exists. Estimates circulating online (15-30GB) are predictions, not announced figures.",
  },
  {
    q: "Is the Xbox Series S version smaller?",
    a: "Unconfirmed. One guide has estimated a smaller Series S build (110-140GB) given its ~364GB usable storage, but this isn't corroborated by Rockstar or multiple independent sources.",
  },
];

export default function Gta6FileSizeGuide() {
  return (
    <main>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: SITE_URL },
          { name: "File Size", url: `${SITE_URL}/guides/gta6-file-size` },
        ])}
      />
      <JsonLd data={faqSchema(FAQS.map(({ q, a }) => ({ question: q, answer: a })))} />
      <div className="wrap">
        <div className="guide-hero" style={{ backgroundImage: "url(/images/trailer-stills/skyscraper-climb.jpg)" }}>
          <div className="guide-head">
            <Link href="/" className="back">
              &larr; Back to EverythingGTA6
            </Link>
            <div className="k">Storage</div>
            <h1>How Many GB Is GTA6?</h1>
            <p>
              Short version: nobody official has said. The ~210GB number you&apos;ve seen
              everywhere traces back to a tracking account, not Rockstar — here&apos;s the honest
              picture.
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
          The ~210GB figure originates with the PlayStation Game Size tracking account, as reported by{" "}
          <a href="https://www.tweaktown.com/news/114341/grand-theft-auto-6-download-size-revealed-and-yes-its-over-200-gb" target="_blank" rel="noopener noreferrer nofollow">
            TweakTown
          </a>{" "}
          and{" "}
          <a href="https://www.gtaboom.com/gta-6-is-reportedly-a-210-gb-download-on-ps5-4269" target="_blank" rel="noopener noreferrer nofollow">
            GTABoom
          </a>
          . Series S estimate per{" "}
          <a href="https://dexerto.com/gta/gta-6-file-size-revealed-and-players-may-want-to-start-clearing-storage-space-3422258" target="_blank" rel="noopener noreferrer nofollow">
            Dexerto
          </a>
          , day-one patch estimate per{" "}
          <a href="https://www.gamingbible.com/news/gta-6-install-size-make-some-space-075202-20251013" target="_blank" rel="noopener noreferrer nofollow">
            GamingBible
          </a>
          . None of these are Rockstar-confirmed — treat every number here as a reported estimate,
          and plan storage conservatively. Nothing here is from gta6bible.com.
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
