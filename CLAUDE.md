# CLAUDE.md (egta6)

## Git Identity

**This repo is personal, not Adeptmind work — all commits (past and future) use the `svareed` identity, never `sonusadeptmind`.**

- Already enforced locally: `.git/config` sets `user.name = Sonus Vareed` / `user.email = 49558719+svareed@users.noreply.github.com`, overriding the global git config (which defaults to the Adeptmind identity).
- Verified 2026-11-21: every commit in this repo's history (`git log --all --format='%an <%ae>'`) is already `Sonus Vareed <49558719+svareed@users.noreply.github.com>` — no history rewrite was needed.
- See also the global `~/Desktop/claude/CLAUDE.md` "GitHub Account Scoping" rule, which this repo-local config satisfies.

## SEO Schema

**Every new page gets JSON-LD structured data — no page ships without at least a BreadcrumbList.**

- Use `src/components/JsonLd.tsx` (`<JsonLd data={...} />`) with the builders in `src/lib/seo.ts`: `breadcrumbSchema()`, `articleSchema()`, `faqSchema()`, `videoGameSchema()`.
- Every page: `breadcrumbSchema([{name, url}, ...])` from Home down to the page itself, placed right inside `<main>`.
- Guide/walkthrough-style content (missions, map regions, launch-day discoveries, craziest-stories): add `articleSchema()` too.
- Genuinely Q&A-formatted pages (e.g. "Is GTA6 out?"): use `faqSchema()` instead of/alongside Article.
- The homepage carries `videoGameSchema()` once, for the game itself — don't repeat it on every page.
- For internal linking, use `src/lib/entity-links.ts` + `<EntityLink type="character|mission|region|vehicle" name="..." />` (`src/components/EntityLink.tsx`) instead of a one-off `someCondition ? <Link>...</Link> : name` in a page component. It renders a real link when the name matches a character/mission/region/vehicle on the site, plain text otherwise. Add a new `EntityType` there (outlets, etc.) as the site grows rather than re-inventing this per page.
- GTA6's vehicle catalog (`scraper/vehicles.py`, 358 vehicles across 21 GTABase classes, `/vehicles/[slug]`) is scraped the same way as missions: class-list pages carry name/manufacturer/inspiration/ratings/image directly, so no per-vehicle detail-page fetch was needed. Re-run `vehicles.py` if GTABase adds vehicles; it dedupes by detail-page URL automatically.
- Every page also needs `alternates: canonical("/your-path")` in its metadata, using the `canonical()` helper in `src/lib/seo.ts` — the home page's lives on `src/app/layout.tsx` instead, since home has no metadata export of its own.

## SEO Enforcement (canonical, schema, sitemap)

**Canonical tags and breadcrumb schema are checked automatically on every build — you don't have to remember to re-verify them by hand as pages are added.**

- `web/scripts/check-seo.js` walks every `src/app/**/page.tsx`, and fails the build (non-zero exit) if any page is missing `canonical(` in its metadata or `breadcrumbSchema(` in its JSX. It runs as `npm run prebuild`, which `npm run build` (and therefore every Vercel deploy) triggers automatically. Run `npm run seo:check` to check without building.
- The checker only verifies presence, not correctness — still eyeball that the canonical path and breadcrumb trail you wrote actually match the page's real URL and position in the site.
- `web/src/app/sitemap.ts` auto-discovers static pages from the filesystem (`discoverStaticPages()`) instead of a hand-maintained array — a new static page under `src/app/` (excluding `/sources/*`, any `[dynamic]` segment, and anything marked `robots: { index: false }`) is picked up with zero sitemap edits. Its `lastModified` comes from that file's real `git log` commit date, not a shared build-time timestamp. Only touch `STATIC_TUNING` in `sitemap.ts` if a new page needs a non-default `changeFrequency`/`priority` (default: `monthly` / `0.5`).
- Dynamic per-item routes (characters, missions, maps, vehicles) are still driven directly by their data source in `sitemap.ts` and are unaffected by the static-page discovery change.

## SEO Scaling

**Researched 2026-11-21 (crawl budget, scaled-content-abuse policy, internal linking at scale — see session notes). Crawl budget itself is not a concern below ~10,000 pages; this site is nowhere near that. These rules are cheap to follow now and expensive to retrofit later.**

- **Ship new content in phases, not one continuous burst.** The one confirmed penalty case found (manual action) was a site that scaled content 1,400% in a year relative to its existing authority — rate-of-growth, not absolute page count, is the risk signal. Pause between batches of new pages to let indexing catch up rather than publishing continuously.
- **`noindex` controls index bloat; `robots.txt` Disallow controls crawl budget — they are not interchangeable, and never combine both on the same URL.** `noindex` still costs a crawl (Googlebot must fetch the page to see the tag). If crawling is blocked via `robots.txt`, Google can't see a `noindex` tag at all, so the page can stay indexed as a bare URL. The current `/sources/*` setup (noindex, not disallowed) is correct — keep using noindex for "real but low-value" pages, not disallow.
- **Every new page must be linked from an existing page in the same change that creates it** — homepage MODULES grid, a hub page, or another page's "More:" footer. An unlinked page sits orphaned until Google happens to recrawl and rediscover it.
- **Keep every page within ~3 clicks of the homepage.** Hub → spoke (missions/characters/maps pattern already in place) is the correct architecture; don't bury new content behind nested category pages.
- **The bar for new templated/data-driven pages: each one needs a real, distinct fact set** (an actual walkthrough excerpt, a real bio, real geography) — never boilerplate with only a variable swapped in. This is what separates legitimate programmatic SEO from Google's "scaled content abuse" policy, which is explicitly method-agnostic (applies the same whether content is AI-written, automated, or human-written).
- **Google Search Console is not confirmed set up for this domain as of 2026-11-21.** Nearly all of the above (indexing rate, Crawl Stats, "Discovered, currently not indexed," Manual Actions reports) depends on it — it needs to be connected (domain verification via DNS or file upload) before any of this can actually be monitored rather than assumed. This requires the site owner's own Google account access; it isn't something to do from this repo.
