import Link from "next/link";
import type { Metadata } from "next";
import Comments from "@/components/Comments";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema, articleSchema, canonical, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Does GTA6 Have an Online Mode? What's Confirmed So Far — EverythingGTA6",
  description:
    "GTA6 launched singleplayer-only. Here's what Rockstar has actually said about a GTA6 Online mode, what's been reported for 2027, and how GTA5's own online launch compares.",
  alternates: canonical("/guides/gta6-online-mode"),
};

export default function Gta6OnlineModeGuide() {
  return (
    <main>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: SITE_URL },
          { name: "Online Mode", url: `${SITE_URL}/guides/gta6-online-mode` },
        ])}
      />
      <JsonLd
        data={articleSchema({
          headline: "Does GTA6 Have an Online Mode? What's Confirmed So Far",
          description:
            "What Rockstar has said about GTA6's singleplayer-only launch, the existing GTA Online, and the 2027 online-mode reporting.",
          url: `${SITE_URL}/guides/gta6-online-mode`,
        })}
      />
      <div className="wrap">
        <div className="guide-hero" style={{ backgroundImage: "url(/images/trailer-stills/red-shootout.jpg)" }}>
          <div className="guide-head">
            <Link href="/" className="back">
              &larr; Back to EverythingGTA6
            </Link>
            <div className="k">Online Mode</div>
            <h1>Does GTA6 Have Online Multiplayer?</h1>
            <p>
              Short version: not at launch. GTA6 shipped November 19, 2026 as a singleplayer
              experience. Here&apos;s what&apos;s actually confirmed about an online mode, what&apos;s
              only been reported, and what GTA Online&apos;s own 2013 launch looked like.
            </p>
          </div>
        </div>

        <div className="guide-head" style={{ paddingBlock: "28px 8px" }}>
          <h2 style={{ fontSize: 22, margin: 0 }}>At Launch: Singleplayer Only</h2>
        </div>
        <p style={{ fontSize: 15, lineHeight: 1.7, maxWidth: 720 }}>
          Rockstar has repeatedly described GTA6 as a singleplayer experience, and nothing shipped
          at launch changes that — there is no GTA6-specific online mode live today. The existing
          GTA Online (the separate multiplayer game built on GTA5) keeps running independently;
          Take-Two has said publicly that it will continue supporting GTA Online going forward.
          That is not the same thing as a GTA6 Online mode, and Rockstar hasn&apos;t announced one.
        </p>

        <div className="guide-head" style={{ paddingBlock: "28px 8px" }}>
          <h2 style={{ fontSize: 22, margin: 0 }}>What&apos;s Only Been Reported</h2>
        </div>
        <p style={{ fontSize: 15, lineHeight: 1.7, maxWidth: 720 }}>
          Bloomberg&apos;s Jason Schreier reported on October 14, 2026 that Rockstar has an online
          component for GTA6 planned for 2027. Twitch CEO Dan Clancy separately suggested a similar
          2027 timeframe in September 2026. Neither is a Rockstar statement — both are third-party
          reporting and commentary, so treat 2027 as a plausible estimate, not a confirmed date.
        </p>

        <div className="guide-head" style={{ paddingBlock: "28px 8px" }}>
          <h2 style={{ fontSize: 22, margin: 0 }}>The Real Precedent: GTA Online&apos;s 2013 Launch</h2>
        </div>
        <p style={{ fontSize: 15, lineHeight: 1.7, maxWidth: 720 }}>
          When GTA5 launched on September 17, 2013, its online mode wasn&apos;t part of day one —
          GTA Online followed on October 1, 2013, about two weeks later. Rockstar said at the time
          that gap was deliberate, not a delay. If a GTA6 online mode repeats that pattern rather
          than the 2027 reporting, it would look very different — a short gap, not a year-plus wait.
          Rockstar hasn&apos;t said which pattern GTA6 follows; this is a comparison, not a prediction.
        </p>

        <p style={{ color: "var(--fg-dim)", fontSize: 13, marginTop: 20 }}>
          Singleplayer framing and Take-Two&apos;s continued-support statement per{" "}
          <a
            href="https://pcgamer.com/games/action/gta-6-is-a-singleplayer-experience-leaving-me-to-question-whats-going-on-with-gta-online/"
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            PC Gamer
          </a>
          . The 2027 online-component reporting per{" "}
          <a href="https://beebom.com/rockstar-has-gta-6-online-mode-planned-for-2027/" target="_blank" rel="noopener noreferrer nofollow">
            Beebom&apos;s
          </a>{" "}
          writeup of the Bloomberg/Schreier report and Twitch CEO Dan Clancy&apos;s comments —
          neither a Rockstar press release. GTA Online&apos;s 2013 launch date per{" "}
          <a href="https://www.trustedreviews.com/news/gta-online-release-date-confirmed-for-october-1-two-weeks-after-gta-5-launch-2900577" target="_blank" rel="noopener noreferrer nofollow">
            Trusted Reviews
          </a>
          . Nothing here is from gta6bible.com.
        </p>
        <p style={{ marginTop: 16 }}>
          More: <Link href="/guides/gta6-faq">launch &amp; platforms FAQ</Link>,{" "}
          <Link href="/guides/gta6-pc-release">is GTA6 coming to PC?</Link>,{" "}
          <Link href="/guides/gta6-voice-cast">who plays Jason and Lucia?</Link>, or the{" "}
          <Link href="/sources">full Sources hub</Link>.
        </p>
        <Comments />
      </div>
    </main>
  );
}
