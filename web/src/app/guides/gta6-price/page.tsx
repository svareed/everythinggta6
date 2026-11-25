import Link from "next/link";
import type { Metadata } from "next";
import Comments from "@/components/Comments";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema, faqSchema, canonical, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "GTA6 Price Guide: US, UK & India — EverythingGTA6",
  description:
    "GTA6's real retail price by region — standard and ultimate editions, sourced to Rockstar's own announcement and regional reporting.",
  alternates: canonical("/guides/gta6-price"),
};

const PRICES = [
  { region: "United States", standard: "$79.99", ultimate: "$99.99", confirmed: true },
  { region: "United Kingdom", standard: "£69.99", ultimate: "£89.99", confirmed: false },
  { region: "India", standard: "₹5,999", ultimate: "₹7,499", confirmed: false },
];

export default function Gta6PriceGuide() {
  return (
    <main>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: SITE_URL },
          { name: "GTA6 Price Guide", url: `${SITE_URL}/guides/gta6-price` },
        ])}
      />
      <JsonLd
        data={faqSchema([
          { question: "How much does GTA6 cost?", answer: "$79.99 for the standard edition in the US, confirmed by Rockstar; $99.99 for the Ultimate Edition." },
          { question: "How much is GTA6 in the UK?", answer: "Reported at £69.99 standard / £89.99 Ultimate, though this has not been directly confirmed by Rockstar the way the US price was." },
          { question: "How much is GTA6 in India?", answer: "Reported at ₹5,999 standard / ₹7,499 Ultimate, though this has not been directly confirmed by Rockstar India." },
        ])}
      />
      <div className="wrap">
        <div className="guide-hero" style={{ backgroundImage: "url(/images/trailer-stills/vault-heist.jpg)" }}>
          <div className="guide-head">
            <Link href="/" className="back">
              &larr; Back to EverythingGTA6
            </Link>
            <div className="k">Price Guide</div>
            <h1>How Much Is GTA6?</h1>
            <p>Standard and Ultimate edition pricing, region by region — only one of these is Rockstar-confirmed directly.</p>
          </div>
        </div>

        <div className="coords">
          {PRICES.map((p) => (
            <div className="coord" key={p.region}>
              <span className="xy">{p.region.toUpperCase()}</span>
              <h3 style={{ fontSize: 17 }}>{p.standard} / {p.ultimate}</h3>
              <span className="status">{p.confirmed ? "● Rockstar-confirmed" : "○ Regionally reported"}</span>
              <p>Standard Edition / Ultimate Edition.</p>
            </div>
          ))}
        </div>

        <p style={{ color: "var(--fg-dim)", fontSize: 13, marginTop: 20 }}>
          US pricing per Rockstar&apos;s own announcement, as reported by{" "}
          <a
            href="https://www.techradar.com/gaming/we-finally-know-the-official-gta-6-price-its-expensive-but-not-too-bad"
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            TechRadar
          </a>
          . UK pricing per{" "}
          <a href="https://timesaver.gg/blog/gta-6-price-uk-europe-canada-australia" target="_blank" rel="noopener noreferrer nofollow">
            Timesaver
          </a>
          , not directly confirmed by Rockstar. India pricing per{" "}
          <a
            href="https://www.digit.in/news/gaming/gta-6-price-officially-out-here-are-the-editions-and-how-much-they-cost.html"
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            Digit
          </a>
          , also not a direct Rockstar India announcement. We&apos;re not covering pre-order or
          collector&apos;s-edition pricing here — the game has already shipped, so that content
          isn&apos;t worth building. Nothing here is from gta6bible.com.
        </p>
        <p style={{ marginTop: 16 }}>
          More: <Link href="/guides/gta6-faq">launch &amp; platforms FAQ</Link>,{" "}
          <Link href="/guides/gta6-budget-and-delays">budget &amp; delay history</Link>, or the{" "}
          <Link href="/sources">full Sources hub</Link>.
        </p>
        <Comments />
      </div>
    </main>
  );
}
