import Link from "next/link";
import type { Metadata } from "next";
import Comments from "@/components/Comments";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema, faqSchema, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "GTA6 FAQ: Is It Out, What Platforms, Is There Online? — EverythingGTA6",
  description:
    "Quick, sourced answers to the questions people are still searching most: is GTA6 out, what it's on, and whether it has online multiplayer.",
};

const FAQS = [
  {
    q: "Is GTA6 out yet?",
    a: "Yes. Grand Theft Auto VI launched on November 19, 2026, on PlayStation 5 and Xbox Series X|S.",
  },
  {
    q: "What platforms is GTA6 on?",
    a: "At launch, only PS5 and Xbox Series X|S — confirmed by Rockstar. It is not on PS4, Xbox One, or Nintendo Switch 2.",
  },
  {
    q: "Is GTA6 coming to PC?",
    a: "Not yet, and no PC release has been officially confirmed. Take-Two's own leadership has framed a PC port as something that would come later rather than at launch, with outside speculation (not an official date) putting it roughly a year or more out, following the pattern set by GTA5's PC release.",
  },
  {
    q: "Is there a difference between the Xbox Series S and Series X versions?",
    a: "Rockstar hasn't published a detailed technical comparison. Treat any specific resolution/frame-rate claims you see elsewhere as unconfirmed until Rockstar or a technical outlet like Digital Foundry publishes a direct comparison.",
  },
  {
    q: "Does GTA6 have online multiplayer, like GTA Online?",
    a: "GTA6 itself is a single-player experience — Rockstar has described it that way. GTA Online, the existing multiplayer game, continues to be supported separately. A GTA6-specific online mode has not been officially confirmed by Rockstar; some outside commentary has speculated about 2027, but that's third-party speculation, not a Rockstar statement.",
  },
];

export default function Gta6FaqGuide() {
  return (
    <main>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: SITE_URL },
          { name: "GTA6 FAQ", url: `${SITE_URL}/guides/gta6-faq` },
        ])}
      />
      <JsonLd data={faqSchema(FAQS.map(({ q, a }) => ({ question: q, answer: a })))} />
      <div className="wrap">
        <div className="guide-hero" style={{ backgroundImage: "url(/images/trailer-stills/skyscraper-climb.jpg)" }}>
          <div className="guide-head">
            <Link href="/" className="back">
              &larr; Back to EverythingGTA6
            </Link>
            <div className="k">FAQ</div>
            <h1>Is GTA6 Out? Platforms &amp; Online, Answered</h1>
            <p>
              Short version: yes, it&apos;s out — November 19, 2026, on PS5 and Xbox Series X|S.
              Here&apos;s everything else people are still searching for, answered straight.
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
          Platform confirmation per{" "}
          <a
            href="https://www.techradar.com/gaming/consoles-pc/gta-6-is-coming-to-ps5-and-xbox-series-xors-but-theres-no-word-on-a-pc-release"
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            TechRadar
          </a>{" "}
          and{" "}
          <a
            href="https://www.videogamer.com/news/gta-6-current-gen-pc-port-unconfirmed"
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            VideoGamer
          </a>
          . PC-port speculation per{" "}
          <a href="https://www.pcgamer.com/no-gta-6-pc-release-announced" target="_blank" rel="noopener noreferrer nofollow">
            PCGamer
          </a>
          . We&apos;re not repeating the specific &quot;GTA Online basically confirmed for 2027&quot;
          headline some outlets ran — it traced back to a Twitch executive&apos;s comment, not a
          Rockstar statement, and a separate viral claim about this turned out to be about
          Rockstar&apos;s unrelated support for GTA Online roleplay servers. Nothing here is from
          gta6bible.com.
        </p>
        <p style={{ marginTop: 16 }}>
          More: <Link href="/guides/gta6-price">price guide</Link>,{" "}
          <Link href="/guides/gta6-budget-and-delays">budget &amp; delay history</Link>, or the{" "}
          <Link href="/sources">full Sources hub</Link>.
        </p>
        <Comments />
      </div>
    </main>
  );
}
