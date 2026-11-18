import Link from "next/link";

export default function SiteHeader() {
  return (
    <div className="topbar">
      <div
        className="wrap"
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, width: "100%" }}
      >
        <Link href="/" className="brand">
          <img src="/images/logo-mark.svg" alt="" width={28} height={28} className="brand-mark" />
          EverythingGTA6
        </Link>
        <nav className="primary">
          <Link href="/">News</Link>
          <Link href="/guides/map-of-leonida">Map</Link>
          <Link href="/characters">Characters</Link>
          <Link href="/vehicles">Vehicles</Link>
          <Link href="/sources">Sources</Link>
          <span className="soon">Soundtrack</span>
        </nav>
        <span className="issue-tag">Preview Edition</span>
      </div>
    </div>
  );
}
