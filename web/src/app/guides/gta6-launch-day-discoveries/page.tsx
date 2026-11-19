import Link from "next/link";
import type { Metadata } from "next";
import Comments from "@/components/Comments";

export const metadata: Metadata = {
  title: "GTA6 Launch Day: What Players Already Found — EverythingGTA6",
  description:
    "Bigfoot in the swamp, a secret stashed in a radio tower nest, an unmarketed character gone viral, and the funniest physics glitches — every real, individually-sourced thing players found in GTA6's first hours.",
};

export default function LaunchDayDiscoveriesGuide() {
  return (
    <main>
      <div className="wrap">
        <div
          className="guide-hero"
          style={{ backgroundImage: "url(/images/trailer-stills/motorcycle-seaplane.jpg)" }}
        >
          <div className="guide-head">
            <Link href="/" className="back">
              &larr; Back to EverythingGTA6
            </Link>
            <div className="k">Launch Day</div>
            <h1>What Players Already Found in GTA6</h1>
            <p>
              GTA6 shipped on November 19, 2026, and within hours the swamps, radio towers and
              side missions of Leonida were already giving up secrets. Five real finds so far,
              each with a working link back to where it was first reported — nothing here is
              invented.
            </p>
          </div>
        </div>

        <div className="coords">
          <div
            className="coord has-img"
            style={{
              backgroundImage:
                "url(https://gamerhour.net/wp-content/uploads/2026/11/image-587-1024x570.png)",
              minHeight: 220,
            }}
          >
            <span className="xy">FIND 01</span>
            <h3>Bigfoot Is Already Loose in the Swamp</h3>
            <span className="status">● Easter Egg</span>
            <p>
              Push south of Grassrivers toward the bridge into Cottonmouth and you&apos;ll hear a
              roar in the trees before you see it: a Florida-flavored Bigfoot (a &quot;Skunk
              Ape&quot;) that bolts into the woods. Chase it and you find a hidden shrine —
              inspecting it blacks Jason out, and Bigfoot is standing there again right before he
              wakes up. First posted to{" "}
              <a
                href="https://www.reddit.com/r/GTA/comments/1xzhk7r/bigfoot_encounter/"
                target="_blank"
                rel="noopener noreferrer nofollow"
              >
                r/GTA
              </a>{" "}
              within hours of launch, and corroborated independently by{" "}
              <a
                href="https://kotaku.com/live-updates-on-gta-6-the-biggest-launch-in-gaming-history-2000758030"
                target="_blank"
                rel="noopener noreferrer nofollow"
              >
                Kotaku
              </a>{" "}
              and{" "}
              <a
                href="https://vgtimes.com/gaming-news/175042-players-have-already-found-bigfoot-in-grand-theft-auto-6.html"
                target="_blank"
                rel="noopener noreferrer nofollow"
              >
                VGTimes
              </a>
              .
            </p>
            <a
              className="cite"
              href="https://gamerhour.net/guides/gta-6-bigfoot-easter-egg/"
              target="_blank"
              rel="noopener noreferrer nofollow"
            >
              Source: GamerHour &rarr;
            </a>
          </div>

          <div className="coord">
            <span className="xy">FIND 02</span>
            <h3>A Secret Stashed in a Radio Tower Nest</h3>
            <span className="status">● Easter Egg</span>
            <p>
              Climbing GTA6&apos;s tallest radio tower takes about six minutes — and at the top,
              player{" "}
              <a
                href="https://x.com/xGarbett/status/2123088685210202519"
                target="_blank"
                rel="noopener noreferrer nofollow"
              >
                @xGarbett
              </a>{" "}
              found a literal Easter egg sitting in a bird&apos;s nest. Throwing it back off the
              tower triggers its own short payoff.
            </p>
            <a
              className="cite"
              href="https://kotaku.com/live-updates-on-gta-6-the-biggest-launch-in-gaming-history-2000758030"
              target="_blank"
              rel="noopener noreferrer nofollow"
            >
              Source: Kotaku &rarr;
            </a>
          </div>

          <div className="coord">
            <span className="xy">FIND 03</span>
            <h3>A Giant Monster Crab, Trigger Unknown</h3>
            <span className="status">● Hidden Encounter</span>
            <p>
              Player{" "}
              <a
                href="https://x.com/ChumBucketDrama/status/2123094270014063042"
                target="_blank"
                rel="noopener noreferrer nofollow"
              >
                @ChumBucketDrama
              </a>{" "}
              posted a cutscene of a giant &quot;monster crab&quot; encounter within hours of
              launch. It&apos;s one of day one&apos;s stranger finds, and nobody&apos;s pinned
              down how to trigger it on purpose yet.
            </p>
            <a
              className="cite"
              href="https://kotaku.com/live-updates-on-gta-6-the-biggest-launch-in-gaming-history-2000758030"
              target="_blank"
              rel="noopener noreferrer nofollow"
            >
              Source: Kotaku &rarr;
            </a>
          </div>

          <div
            className="coord has-img"
            style={{
              backgroundImage:
                "url(https://images.keengamer.com/wp-content/uploads/2026/11/GTAs-6-Mandy-Goes-Viral-Cover.jpg)",
              minHeight: 220,
            }}
          >
            <span className="xy">FIND 04</span>
            <h3>Mandy, the Character Rockstar Never Marketed</h3>
            <span className="status">● Viral Moment</span>
            <p>
              Mandy never appeared in a single trailer or screenshot before launch. She turns up
              as one of Brian Heder&apos;s tenants in Jason&apos;s Chapter 1 mission
              &quot;Pipework,&quot; flirting with him while he fixes her sink — and clips of the
              scene went viral within hours. She resurfaces in an optional scene before
              &quot;Coming Home,&quot; if you visit her house first.
            </p>
            <a
              className="cite"
              href="https://www.keengamer.com/articles/news/gta-6s-mandy-goes-viral-on-launch-day-after-pipework-scene/"
              target="_blank"
              rel="noopener noreferrer nofollow"
            >
              Source: KeenGamer &rarr;
            </a>
          </div>

          <div className="coord">
            <span className="xy">FIND 05</span>
            <h3>Launch Day&apos;s Physics Glitches, Ranked by Comedy</h3>
            <span className="status">● Glitch</span>
            <p>
              Day one wasn&apos;t flawless: a truck got launched clean across the map (X user
              @Synaptic_UK), streamer JasonTheWeen found a boat wedged into a bridge and vibrating
              in place, Lucia clipped through the ground mid-mission, Kai Cenat fell through the
              floor and slipped a police encounter entirely, and MichaelDoesLife caught Jason and
              a cop phasing through solid objects mid-fight — fans immediately started making{" "}
              <em>Cyberpunk 2077</em> comparisons.
            </p>
            <a
              className="cite"
              href="https://gulfnews.com/technology/gaming/gta-6-glitches-go-viral-flying-cars-disappearing-characters-and-police-encounter-issues-spark-cyberpunk-2077-comparisons-1.500752989"
              target="_blank"
              rel="noopener noreferrer nofollow"
            >
              Source: Gulf News &rarr;
            </a>
          </div>
        </div>

        <div className="guide-head" style={{ paddingBlock: "32px 8px" }}>
          <div className="k">Live Right Now</div>
          <h2 style={{ fontSize: 22, margin: 0 }}>Who&apos;s Streaming the Launch</h2>
        </div>
        <p style={{ color: "var(--fg-dim)", fontSize: 13, lineHeight: 1.7 }}>
          Kai Cenat announced a full, uninterrupted GTA6 playthrough starting the evening of
          launch, and DDG reportedly moved his own marathon run to Kick rather than Twitch, per{" "}
          <a
            href="https://theloadout.com/kai-cenat-and-ludwig-wont-sleep-when-gta-6-drops"
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            The Loadout
          </a>
          . Both streamers also show up independently in Gulf News&apos;s glitch roundup above,
          which suggests their channels are where a lot of today&apos;s clips are coming from — but
          we couldn&apos;t pin down specific clip titles or timestamps from the last few hours
          through public search alone, so we&apos;re not going to pretend otherwise. If you want
          the real-time feed, their channels are the place to look.
        </p>

        <p style={{ color: "var(--fg-dim)", fontSize: 13, marginTop: 12 }}>
          A note on sourcing: the Bigfoot encounter is confirmed by three independent outlets plus
          the original Reddit post. The radio tower, monster crab, Mandy, and glitch items are
          each currently reported by a single outlet (Kotaku, KeenGamer, and Gulf News
          respectively) — real and linked, but not yet cross-confirmed elsewhere. We checked
          several other &quot;discoveries&quot; circulating online (a Pennywise sighting, a UFO
          over Breakwater Quarry) and couldn&apos;t verify any of them as launch-day finds rather
          than years-old pre-launch leak rumors, so they&apos;re left out.
        </p>

        <p style={{ marginTop: 16 }}>
          More real coverage: <Link href="/sources/hidden-gems">trailer easter eggs</Link>,{" "}
          <Link href="/guides/craziest-gta6-stories">craziest launch stories</Link>, or the{" "}
          <Link href="/sources">full Sources hub</Link>.
        </p>
        <Comments />
      </div>
    </main>
  );
}
