import Link from "next/link";
import Countdown from "@/components/Countdown";
import VisitorCounter from "@/components/VisitorCounter";
import HeroSkyline from "@/components/HeroSkyline";
import RadioLeonida from "@/components/RadioLeonida";
import LiveFeed from "@/components/LiveFeed";
import Comments from "@/components/Comments";
import JsonLd from "@/components/JsonLd";
import { getAllRecords, itemSlug, outletFor, categoryOf, formatDate, type CategoryId } from "@/lib/sources";
import { videoGameSchema, breadcrumbSchema, SITE_URL } from "@/lib/seo";

const CATEGORY_TAGS: Record<CategoryId, string> = {
  news: "News",
  tips: "Guides",
  "hidden-gems": "Hidden Gems",
};

const LATEST = getAllRecords().slice(0, 4);

// Real, currently-live videos on Rockstar's own YouTube channel, the same
// seed list verified in scraper/youtube_transcripts.py.
const FEATURED_TRAILER = { id: "rz1B4B2yBZY", title: "Grand Theft Auto VI — Launch Trailer" };
const MORE_TRAILERS = [
  { id: "VQRLujxTm3c", title: "Grand Theft Auto VI — Trailer 2" },
  { id: "tJbzMqJGH4k", title: "Grand Theft Auto VI: An Extended Look" },
  { id: "EiQEBYDox_k", title: "Grand Theft Auto VI: Official Cover Art Reveal" },
];

// Backgrounds pulled directly from the two trailers above (ffmpeg, local).
const MODULES = [
  {
    href: "/guides/map-of-leonida",
    tag: "Map",
    title: "Leonida regions",
    body: "Vice City, Port Gellhorn, the Keys — and the rumored fourth zone.",
    img: "highway-skyline",
  },
  {
    href: "/characters",
    tag: "Cast",
    title: "Characters",
    body: "Jason, Lucia, and the confirmed supporting cast, from Rockstar's own bios.",
    img: "balcony-sunset",
  },
  {
    href: "/vehicles",
    tag: "Garage",
    title: "Vehicles",
    body: "Every named vehicle GTABase has catalogued, across all 21 classes, with real-world inspirations.",
    img: "hawaiian-shirt-truck",
  },
  {
    href: "/guides/craziest-gta6-stories",
    tag: "Launch Week",
    title: "Craziest launch stories",
    body: "A rescheduled exam, a marriage truce, a $135K job posting — how far people went.",
    img: "crystal-shop",
  },
  {
    href: "/guides/gta6-launch-day-discoveries",
    tag: "Launch Day",
    title: "What players already found",
    body: "Bigfoot in the swamp, a secret in a radio tower nest, and the first viral glitches.",
    img: "motorcycle-seaplane",
  },
  {
    href: "/missions",
    tag: "Walkthrough",
    title: "Every mission",
    body: "All 136 missions, Prologue through Chapter 5, with real screenshots where they exist.",
    img: "dock-seaplane",
  },
  {
    href: "/cheats",
    tag: "Cheats",
    title: "Cheat codes",
    body: "19 confirmed D-pad sequences, how to enter them, and what's still unconfirmed.",
    img: "vault-heist",
  },
  {
    href: "/guides/gta6-faq",
    tag: "FAQ",
    title: "Is GTA6 out? Platforms & online",
    body: "Yes, it's out — plus what it's on, and whether it has online multiplayer.",
    img: "skyscraper-climb",
  },
  {
    href: "/guides/gta6-price",
    tag: "Price Guide",
    title: "How much is GTA6?",
    body: "US, UK and India pricing, standard and Ultimate edition.",
    img: "vault-heist",
  },
  {
    href: "/guides/gta6-budget-and-delays",
    tag: "Retrospective",
    title: "Budget & delay history",
    body: "What GTA6 reportedly cost, and the full, dated delay timeline.",
    img: "bar-standoff",
  },
  {
    href: "/guides/gta6-radio-stations",
    tag: "In-Game Radio",
    title: "Radio stations",
    body: "Every Rockstar-confirmed station and its real-world DJ.",
    img: "nightclub-crowd",
  },
  {
    href: "/guides/gta6-leaks-timeline",
    tag: "Retrospective",
    title: "The leaks timeline",
    body: "Every major GTA6 leak in order, from 2022's footage breach onward.",
    img: "red-shootout",
  },
  {
    href: "/guides/gta6-file-size",
    tag: "Storage",
    title: "How many GB is GTA6?",
    body: "The ~210GB figure everyone cites, where it actually comes from.",
    img: "skyscraper-climb",
  },
  {
    href: "/guides/gta6-confirmed-features",
    tag: "Quick Answers",
    title: "Confirmed features FAQ",
    body: "Cameos, weapons, animals, money, and the twerk-button question.",
    img: "motorcycle-seaplane",
  },
  {
    href: "/guides/gta6-age-rating",
    tag: "Rating",
    title: "GTA6's age rating",
    body: "M (Mature 17+) in the US, 18 under PEGI — the content behind it.",
    img: "bar-standoff",
  },
  {
    href: "/guides/gta6-vs-gta5",
    tag: "Comparison",
    title: "GTA6 vs GTA5",
    body: "Map, protagonists, price, and the 13-year gap, point by point.",
    img: "highway-skyline",
  },
  {
    href: "/guides/gta6-community",
    tag: "Community",
    title: "Where players hang out",
    body: "Rockstar's own official Discord, and the main fan subreddit.",
    img: "crystal-shop",
  },
  {
    href: "/sources/tips",
    tag: "Guides",
    title: "Tips & Guides",
    body: "Real walkthroughs and how-tos, pulled from across the web.",
    img: "nightclub-crowd",
  },
  {
    href: "/sources/hidden-gems",
    tag: "Hidden Gems",
    title: "Easter eggs & secrets",
    body: "Trailer details and references the community has dug up.",
    img: "vault-heist",
  },
  {
    href: "/sources/news",
    tag: "News & Leaks",
    title: "News & Leaks",
    body: "Launch coverage, rumor reports, and dev interviews.",
    img: "red-shootout",
  },
];

export default function Home() {
  return (
    <main>
      <JsonLd data={videoGameSchema()} />
      <JsonLd data={breadcrumbSchema([{ name: "Home", url: SITE_URL }])} />
      <div className="hero-bg">
        <HeroSkyline />
        <section className="cover wrap">
          <div className="kicker">Grand Theft Auto VI &middot; Rockstar Games</div>
          <h1>
            <span>EverythingGTA6</span>
          </h1>
          <p className="dek">
            The most complete GTA6 coverage on the internet — news, leaks, guides and every
            trailer frame, filed as it happens.
          </p>
          <div className="badge-row">
            <Countdown />
            <VisitorCounter />
          </div>
        </section>
      </div>

      <section className="section wrap">
        <div className="section-head">
          <h2>Official Trailers</h2>
        </div>
        <div className="video-embed">
          <iframe
            src={`https://www.youtube.com/embed/${FEATURED_TRAILER.id}`}
            title={FEATURED_TRAILER.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        <div className="video-grid">
          {MORE_TRAILERS.map((v) => (
            <a
              className="video-card"
              href={`https://www.youtube.com/watch?v=${v.id}`}
              target="_blank"
              rel="noopener noreferrer"
              key={v.id}
            >
              <img src={`https://img.youtube.com/vi/${v.id}/hqdefault.jpg`} alt="" loading="lazy" />
              <span className="play">▶</span>
              <p>{v.title}</p>
            </a>
          ))}
        </div>
      </section>

      <section className="section wrap">
        <div className="section-head">
          <h2>Live Right Now</h2>
          <p className="lede">Real, live posts tagged #GTA6 — pulled straight from X, not curated by us.</p>
        </div>
        <LiveFeed />
      </section>

      <div className="wrap dash">
        <div className="panel">
          <div className="panel-head">
            <span className="label">Incoming Feed</span>
            <span className="chip">Live</span>
          </div>
          <div className="feed-list">
            {LATEST.map((item) => (
              <Link
                className="feed-item"
                href={`/sources/item/${itemSlug(item)}`}
                key={item.url}
                style={{ textDecoration: "none" }}
              >
                <span className="tag">{CATEGORY_TAGS[categoryOf(item)]}</span>
                <p>
                  {item.title} <span style={{ color: "var(--fg-dim)" }}>— {outletFor(item)}</span>
                </p>
                <time>{formatDate(item.published_at) || formatDate(item.scraped_at)}</time>
              </Link>
            ))}
          </div>
        </div>

        <div className="stack">
          <div className="panel">
            <div className="panel-head">
              <span className="label">Watchers</span>
            </div>
            <div className="metric-row">
              <div className="metric">
                <div className="v mono">75</div>
                <div className="l">Guides indexed</div>
              </div>
              <div className="metric">
                <div className="v mono">1.2K</div>
                <div className="l">Leaks tracked</div>
              </div>
            </div>
          </div>
          <RadioLeonida />
        </div>
      </div>

      <section className="section wrap">
        <div className="section-head">
          <div>
            <h2>Sneak Peek</h2>
            <p className="lede">The full hub unlocks at zero. Dummy data, real shape.</p>
          </div>
          <span className="preview-badge">Preview</span>
        </div>
        <div className="grid4">
          {MODULES.map((m) => (
            <Link
              className="module has-img"
              href={m.href}
              key={m.title}
              style={{ backgroundImage: `url(/images/trailer-stills/${m.img}.jpg)` }}
            >
              <span className="mk">{m.tag}</span>
              <h3>{m.title}</h3>
              <p>{m.body}</p>
              <span className="status">● Preview</span>
            </Link>
          ))}
        </div>
      </section>

      <div className="wrap">
        <Comments />
      </div>
    </main>
  );
}
