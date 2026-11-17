import Link from "next/link";
import Countdown from "@/components/Countdown";
import VisitorCounter from "@/components/VisitorCounter";
import HeroSkyline from "@/components/HeroSkyline";
import RadioLeonida from "@/components/RadioLeonida";
import Comments from "@/components/Comments";
import { getAllRecords, itemSlug, outletFor, categoryOf, formatDate, type CategoryId } from "@/lib/sources";

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

const MODULES = [
  {
    href: "/guides/map-of-leonida",
    tag: "Map",
    title: "Leonida regions",
    body: "Vice City, Port Gellhorn, the Keys — and the rumored fourth zone.",
  },
  {
    href: "/sources/tips",
    tag: "Guides",
    title: "Tips & Guides",
    body: "Real walkthroughs and how-tos, pulled from across the web.",
  },
  {
    href: "/sources/hidden-gems",
    tag: "Hidden Gems",
    title: "Easter eggs & secrets",
    body: "Trailer details and references the community has dug up.",
  },
  {
    href: "/sources/news",
    tag: "News & Leaks",
    title: "News & Leaks",
    body: "Launch coverage, rumor reports, and dev interviews.",
  },
];

export default function Home() {
  return (
    <main>
      <div className="hero-bg">
        <HeroSkyline />
        <section className="cover wrap">
          <div className="kicker">Grand Theft Auto VI &middot; Rockstar Games</div>
          <h1>
            Welcome to
            <br />
            <span>Vice City</span>
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
            <Link className="module" href={m.href} key={m.title}>
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
