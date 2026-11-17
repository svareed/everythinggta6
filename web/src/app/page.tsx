import Link from "next/link";
import Countdown from "@/components/Countdown";
import VisitorCounter from "@/components/VisitorCounter";
import HeroSkyline from "@/components/HeroSkyline";

const FEED = [
  { tag: "Leaks", text: "Four new district names surface from dataminers", time: "2h" },
  { tag: "Guides", text: "Every confirmed location, mapped to the trailers", time: "5h" },
  { tag: "Radio", text: "Station lineup theories, ranked by plausibility", time: "9h" },
  { tag: "Wardrobe", text: "Lucia's looks, catalogued outfit by outfit", time: "13h" },
];

const MODULES = [
  {
    href: "/guides/map-of-leonida",
    tag: "Map",
    title: "Leonida regions",
    body: "Vice City, Port Gellhorn, the Keys — and the rumored fourth zone.",
  },
  {
    href: "/",
    tag: "Characters",
    title: "Jason & Lucia",
    body: "Backstories, voice credits, theory tracker.",
  },
  {
    href: "/",
    tag: "Garage",
    title: "Vehicle spotter",
    body: "Every car, bike, boat tagged by district.",
  },
  {
    href: "/",
    tag: "News & Leaks",
    title: "Trailer 3 watch",
    body: "Frame-by-frame breakdowns, dataminer threads worth trusting.",
  },
];

export default function Home() {
  return (
    <main>
      <div className="topbar">
        <div className="wrap" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, width: "100%" }}>
          <Link href="/" className="brand">
            <span className="dot" />
            The Leonida Dispatch
          </Link>
          <nav className="primary">
            <Link href="/">News</Link>
            <Link href="/guides/map-of-leonida">Map</Link>
            <Link href="/sources">Sources</Link>
            <span className="soon">Characters</span>
            <span className="soon">Vehicles</span>
            <span className="soon">Soundtrack</span>
          </nav>
          <span className="issue-tag">Preview Edition</span>
        </div>
      </div>

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

      <div className="wrap dash">
        <div className="panel">
          <div className="panel-head">
            <span className="label">Incoming Feed</span>
            <span className="chip">Sample</span>
          </div>
          <div className="feed-list">
            {FEED.map((item) => (
              <div className="feed-item" key={item.text}>
                <span className="tag">{item.tag}</span>
                <p>{item.text}</p>
                <time>{item.time}</time>
              </div>
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
          <div className="panel">
            <div className="panel-head">
              <span className="label">Radio Leonida</span>
              <span className="chip">Now Playing</span>
            </div>
            <div className="eq">
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
            <p className="radio-now">
              Guessed lineup &middot; <b>Synthwave Sunset FM</b> &middot; dummy track data
            </p>
          </div>
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

      <footer>
        Dummy content for a design prototype &middot; not an official Rockstar Games product
        &middot; background scene is a generative animation, not real trailer footage
      </footer>
    </main>
  );
}
