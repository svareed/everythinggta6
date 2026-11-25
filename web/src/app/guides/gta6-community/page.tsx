import Link from "next/link";
import type { Metadata } from "next";
import Comments from "@/components/Comments";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema, faqSchema, canonical, SITE_URL } from "@/lib/seo";

const FAQS = [
  {
    q: "Is there an official GTA6 Discord server?",
    a: "Yes — Rockstar Games runs its own Discord server with a dedicated GTA6 channel, reportedly drawing over 300,000 members within 24 hours of launching.",
  },
  {
    q: "Is r/GTA6 run by Rockstar?",
    a: "No — r/GTA6 is the main fan-run subreddit for GTA6 discussion and is explicitly not affiliated with Rockstar Games.",
  },
];

export const metadata: Metadata = {
  title: "Where to Find the GTA6 Community: Reddit & Discord — EverythingGTA6",
  description:
    "Where real GTA6 discussion actually happens — the main subreddit, and Rockstar's own official Discord server with a dedicated GTA6 channel.",
  alternates: canonical("/guides/gta6-community"),
};

export default function Gta6CommunityGuide() {
  return (
    <main>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: SITE_URL },
          { name: "Community", url: `${SITE_URL}/guides/gta6-community` },
        ])}
      />
      <JsonLd data={faqSchema(FAQS.map(({ q, a }) => ({ question: q, answer: a })))} />
      <div className="wrap">
        <div className="guide-hero" style={{ backgroundImage: "url(/images/trailer-stills/crystal-shop.jpg)" }}>
          <div className="guide-head">
            <Link href="/" className="back">
              &larr; Back to EverythingGTA6
            </Link>
            <div className="k">Community</div>
            <h1>Where GTA6 Players Actually Hang Out</h1>
            <p>One official channel, one large fan subreddit — here&apos;s the difference and where each one lives.</p>
          </div>
        </div>

        <div className="coords">
          <div className="coord">
            <span className="xy">OFFICIAL</span>
            <h3 style={{ fontSize: 17 }}>Rockstar&apos;s Own Discord Server</h3>
            <span className="status">● Official, Rockstar-run</span>
            <p>
              Rockstar Games runs its own Discord server with a dedicated GTA6 channel — reportedly
              drawing over 300,000 members within 24 hours of launching. It&apos;s the one place on
              this list actually operated by Rockstar itself, not a fan community.
            </p>
            <a
              className="cite"
              href="https://beebom.com/rockstar-games-discord-server-with-dedicated-gta-6-channel-launched"
              target="_blank"
              rel="noopener noreferrer nofollow"
            >
              Source: Beebom &rarr;
            </a>
          </div>

          <div className="coord">
            <span className="xy">FAN-RUN</span>
            <h3 style={{ fontSize: 17 }}>r/GTA6</h3>
            <span className="status">○ Unofficial, fan-run</span>
            <p>
              The main GTA6 subreddit — large and active, but explicitly not affiliated with
              Rockstar Games. Member-count reporting is inconsistent across trackers, so we&apos;re
              not citing a specific number here; treat it as the biggest fan hub, not an official
              channel.
            </p>
            <a
              className="cite"
              href="https://www.reddit.com/r/GTA6/"
              target="_blank"
              rel="noopener noreferrer nofollow"
            >
              Visit r/GTA6 &rarr;
            </a>
          </div>
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
          Rockstar&apos;s Discord launch per{" "}
          <a href="https://beebom.com/rockstar-games-discord-server-with-dedicated-gta-6-channel-launched" target="_blank" rel="noopener noreferrer nofollow">
            Beebom
          </a>{" "}
          and{" "}
          <a href="https://kotaku.com/gta-6-rockstar-game-official-discord-server-launched-1851762536" target="_blank" rel="noopener noreferrer nofollow">
            Kotaku
          </a>
          . Several unofficial &quot;GTA6&quot;-branded Discord servers also exist and describe
          themselves as unaffiliated with Rockstar — we&apos;re only listing the one Rockstar
          itself runs, to avoid pointing you at a server that only claims to be official. Nothing
          here is from gta6bible.com.
        </p>
        <p style={{ marginTop: 16 }}>
          More: <Link href="/guides/gta6-faq">launch &amp; platforms FAQ</Link>,{" "}
          <Link href="/sources/news">latest news</Link>, or the{" "}
          <Link href="/sources">full Sources hub</Link>.
        </p>
        <Comments />
      </div>
    </main>
  );
}
