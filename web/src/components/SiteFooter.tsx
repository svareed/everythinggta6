import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer>
      <div className="wrap" style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "center" }}>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
          <Link href="/sitemap">Sitemap</Link>
          <Link href="/sitemap.xml">XML Sitemap</Link>
        </div>
        <span>
          Dummy content for a design prototype &middot; not an official Rockstar Games product
          &middot; scraped excerpts are real and cited back to their original authors
        </span>
      </div>
    </footer>
  );
}
