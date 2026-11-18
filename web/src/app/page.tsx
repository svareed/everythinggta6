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

// Frames pulled directly from the two trailers above (ffmpeg, local), not
// official promo stills — hence the per-shot timestamp link back to the source.
const TRAILER_STILLS = [
  { file: "balcony-sunset", caption: "Lucia, golden hour", trailerId: "rz1B4B2yBZY", t: 63 },
  { file: "hawaiian-shirt-truck", caption: "A face from the Keys", trailerId: "VQRLujxTm3c", t: 11 },
  { file: "biplane-beach-stunt", caption: "Stunt run over the beach", trailerId: "rz1B4B2yBZY", t: 56 },
  { file: "motorcycle-seaplane", caption: "Ground and air, same shot", trailerId: "VQRLujxTm3c", t: 143 },
  { file: "vault-heist", caption: "Inside the job", trailerId: "rz1B4B2yBZY", t: 35 },
  { file: "bar-standoff", caption: "Tension at the bar", trailerId: "rz1B4B2yBZY", t: 42 },
  { file: "crystal-shop", caption: "A deal in a back room", trailerId: "VQRLujxTm3c", t: 33 },
  { file: "red-shootout", caption: "Red light, gunfire", trailerId: "VQRLujxTm3c", t: 77 },
];

const MODULES = [
  {
    href: "/guides/map-of-leonida",
    tag: "Map",
    title: "Leonida regions",
    body: "Vice City, Port Gellhorn, the Keys — and the rumored fourth zone.",
  },
  {
    href: "/guides/craziest-gta6-stories",
    tag: "Launch Week",
    title: "Craziest launch stories",
    body: "A rescheduled exam, a marriage truce, a $135K job posting — how far people went.",
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

      <section className="section wrap">
        <div className="section-head">
          <h2>Scenes from the Trailers</h2>
        </div>
        <div className="video-grid">
          {TRAILER_STILLS.map((s) => (
            <a
              className="video-card"
              href={`https://www.youtube.com/watch?v=${s.trailerId}&t=${s.t}s`}
              target="_blank"
              rel="noopener noreferrer"
              key={s.file}
            >
              <img src={`/images/trailer-stills/${s.file}.jpg`} alt={s.caption} loading="lazy" />
              <p>{s.caption}</p>
            </a>
          ))}
        </div>
        <p style={{ color: "var(--fg-dim)", fontSize: 12.5, marginTop: 8 }}>
          Frames pulled directly from Rockstar&apos;s own trailers above — each links back to that
          exact moment on YouTube.
        </p>
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
