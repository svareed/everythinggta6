# Region Pages, Character Pages & SEO Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give each Leonida region and each cast member its own detail page with a real trailer-still image and a "fan-made" citation on hand-written copy, then fix the on-page/indexing issues from the pasted SEO audit site-wide, then deploy.

**Architecture:** Two new typed data modules (`regions.ts`, `characters.ts`) feeding a hub + `[slug]` detail route each, mirroring the existing `/sources/item/[slug]` pattern (`generateStaticParams`/`generateMetadata`/`notFound`). SEO fixes are mechanical additions (`alternates.canonical`, Open Graph, JSON-LD, alt text) layered onto every route, old and new, in one pass once the new routes exist.

**Tech Stack:** Next.js 16 App Router (Cache Components, async `params`), React 19, TypeScript, no CSS framework (hand-written `globals.css`), no test framework.

**Spec:** `docs/superpowers/specs/2026-11-18-regions-characters-seo-design.md`

## Global Constraints

- No fabricated character/region art — only the 4 already-verified YouTube trailer IDs (`rz1B4B2yBZY`, `VQRLujxTm3c`, `tJbzMqJGH4k`, `EiQEBYDox_k`), reused round-robin, via `https://img.youtube.com/vi/<id>/hqdefault.jpg`.
- Any hand-written elaboration (all new region/character body copy) carries the exact line "Fan-made summary — not official Rockstar material." directly beneath it.
- No test framework exists (`package.json` defines only `build` and `lint`). Every task's verification step is `npm run lint && npm run build` run from `web/` (type-checks and statically generates every route) plus a manual `next dev` check of the specific URL(s) the task touches.
- Every page's `<title>` follows the pattern `"<Keyword-rich description> | EverythingGTA6"`, replacing the prior `"… — Vice City Dispatch"` suffix. This changes `<title>`/metadata strings only — the on-page header brand ("The Leonida Dispatch") and footer are untouched.
- Reuse existing CSS classes (`.coord`, `.mystery`, `.cite-card`, `.cite-thumb`, `.guide-head`, `.video-card`) before adding new ones.
- Site base URL for canonical/sitemap/OG: `https://www.everythinggta6.com`.

## Review Focus

- An unknown slug hit on either new `[slug]` route must call `notFound()`, not render `undefined` or throw.
- `sitemap.ts`'s per-category/per-outlet "latest date" computation must not crash when a category or outlet has zero items (empty-array reduce).
- JSON-LD rendered via `dangerouslySetInnerHTML` must stay valid JSON even when the underlying text (scraped article titles/content) contains quotes, apostrophes, or `</script>`-like substrings.
- `canonicalUrl()`'s output must exactly match `sitemap.ts`'s `BASE_URL` host/path form, so canonical tags and sitemap entries never disagree for the same page.
- Every `<img>`, new or edited, must render non-empty `alt` text even when the source record has a missing/empty title.

---

### Task 1: Region data module + region detail route

**Files:**
- Create: `web/src/lib/trailers.ts`
- Create: `web/src/data/regions.ts`
- Create: `web/src/components/LeonidaSchematic.tsx`
- Modify: `web/src/app/guides/map-of-leonida/page.tsx`
- Create: `web/src/app/guides/map-of-leonida/[slug]/page.tsx`
- Modify: `web/src/app/globals.css`

**Interfaces:**
- Produces (`web/src/lib/trailers.ts`): `TRAILER_IDS: string[]` (the 4 ids above, in this order), `trailerThumbUrl(id: string): string`.
- Produces (`web/src/data/regions.ts`): `type Region = { slug: string; sector: string; name: string; status: "Confirmed" | "Unconfirmed"; mystery?: boolean; summary: string; body: string; landmarks: string[]; trailerId: string }`, `REGIONS: Region[]`, `getRegionBySlug(slug: string): Region | undefined`.
- Produces (`web/src/components/LeonidaSchematic.tsx`): a component taking `{ regions: Region[] }`, rendering a clickable grid of sector tiles (`Link` per tile to `/guides/map-of-leonida/${r.slug}`), each tile showing `sector`, `name`, and the first `landmarks` entry, with a visible caption reading "Unofficial sector index — not a real map." Not a geographic/cartographic layout — a labeled grid, consistent with the hub page's existing "no complete official map has been released" disclaimer.
- Consumed by: Task 3 (`sitemap.ts`), Task 4 (SEO pass).

- [ ] **Step 1: Write `web/src/lib/trailers.ts`**

Export `TRAILER_IDS` as the 4 ids listed in Global Constraints, and `trailerThumbUrl(id)` returning `` `https://img.youtube.com/vi/${id}/hqdefault.jpg` ``.

- [ ] **Step 2: Write `web/src/data/regions.ts`**

Move the 7 entries currently inline in `guides/map-of-leonida/page.tsx` (Vice City, Port Gellhorn, Leonida Keys, Ambrosia, Grassrivers, Mount Kalaga National Park, the unconfirmed 7th) into `REGIONS`, adding per entry: a `slug` (kebab-case of `name`), a `trailerId` (`TRAILER_IDS[i % TRAILER_IDS.length]`), the existing one-line text as `summary`, a new 2–3 paragraph `body` expanding on it (status-appropriate: hedge anything not Rockstar-confirmed), and a `landmarks: string[]` (1–3 short real/confirmed-or-clearly-hedged landmark names per region, empty array for the unconfirmed 7th). Implement `getRegionBySlug`.

- [ ] **Step 3: Create `web/src/components/LeonidaSchematic.tsx`** per its Interfaces spec above.

- [ ] **Step 4: Modify `web/src/app/guides/map-of-leonida/page.tsx`**

Replace the inline `REGIONS` array with `import { REGIONS } from "@/data/regions"`. Render `<LeonidaSchematic regions={REGIONS} />` near the top of the page, above the existing `.coords` card grid. Change each `.coord` card from a plain `<div>` to a `<Link href={`/guides/map-of-leonida/${r.slug}`} className={...}>` so the whole card is clickable, and add each region's `landmarks` as a short "Notable landmarks" line on the card. Keep the existing citation footnote + `<Comments />` untouched.

- [ ] **Step 5: Create `web/src/app/guides/map-of-leonida/[slug]/page.tsx`**

`generateStaticParams` from `REGIONS.map(r => ({ slug: r.slug }))`; `generateMetadata({ params })` resolves the region via `getRegionBySlug`, returns `{}` if not found; page component awaits `params`, calls `notFound()` if `getRegionBySlug` returns `undefined`. Render: back link to `/guides/map-of-leonida`, the `k`/status badge (reuse `.guide-head`/`.coord .status` styles), an `<img>` using `trailerThumbUrl(region.trailerId)` with `alt={`${region.name} — official GTA6 trailer still`}`, the `body` paragraphs, a "Notable landmarks" list from `landmarks` (omit the block if empty), then a `<p className="fan-made-note">Fan-made summary — not official Rockstar material.</p>`, then `<Comments />`.

- [ ] **Step 6: Add CSS in `web/src/app/globals.css`**

Add a `.region-hero` (or reuse `.video-embed`/`.cite-thumb` sizing) rule for the detail-page header image, a `.schematic` grid + `.schematic-tile` rule for `LeonidaSchematic` (reuse `.coord`'s look), and a `.fan-made-note` rule (small, dim, italic — follow the existing `--fg-dim` token used elsewhere) that Task 2 will reuse verbatim.

- [ ] **Step 7: Verify**

Run `npm run lint && npm run build` from `web/`. Confirm the build's route list includes `/guides/map-of-leonida/[slug]` resolved for all 7 slugs. Run `npm run dev` and manually load one real slug (renders) and one bogus slug like `/guides/map-of-leonida/nope` (404s), and confirm the schematic tiles navigate to the matching detail pages.

- [ ] **Step 8: Commit**

```bash
git add web/src/lib/trailers.ts web/src/data/regions.ts web/src/components/LeonidaSchematic.tsx web/src/app/guides/map-of-leonida web/src/app/globals.css
git commit -m "Add per-region detail pages and a sector schematic to the Leonida map guide"
```

---

### Task 2: Character data module, hub, and detail route

**Files:**
- Create: `web/src/data/characters.ts`
- Create: `web/src/app/characters/page.tsx`
- Create: `web/src/app/characters/[slug]/page.tsx`
- Modify: `web/src/app/page.tsx`
- Modify: `web/src/components/SiteHeader.tsx`

**Interfaces:**
- Consumes: `TRAILER_IDS`/`trailerThumbUrl` from Task 1's `web/src/lib/trailers.ts`; `.coord`/`.mystery`/`.guide-head`/`.fan-made-note` CSS from Task 1.
- Produces: `type Character = { slug: string; name: string; billing: "Protagonist" | "Supporting"; role: string; status: "Confirmed" | "Unconfirmed"; summary: string; storyArc: string; trailerId: string }`, `CHARACTERS: Character[]`, `getCharacterBySlug(slug: string): Character | undefined`.
- Consumed by: Task 3 (`sitemap.ts`), Task 4 (SEO pass).

- [ ] **Step 1: Write `web/src/data/characters.ts`**

`CHARACTERS` entries: Jason Duval and Lucia Caminos as `billing: "Protagonist"`, `status: "Confirmed"` (Rockstar has named both); Cal, Boobie Ike, Dre'Quan, Raul, Brian as `billing: "Supporting"`, `status: "Unconfirmed"` (per `research/content-taxonomy.md`'s own framing as community-reported/casting speculation, not Rockstar-confirmed). Each gets a `role` one-liner, a `storyArc` paragraph (factual, hedged per status, no invented plot twists), and `trailerId` from `TRAILER_IDS[i % TRAILER_IDS.length]`. Implement `getCharacterBySlug`.

- [ ] **Step 2: Create `web/src/app/characters/page.tsx`**

Mirror `guides/map-of-leonida/page.tsx`'s structure: `guide-head` block, a `.coords` grid of `Link`s to `/characters/${c.slug}` showing name/role/status badge, metadata with `title`/`description`, `<Comments />`.

- [ ] **Step 3: Create `web/src/app/characters/[slug]/page.tsx`**

Mirror Task 1 Step 4's region detail page: `generateStaticParams`/`generateMetadata`/`notFound()`, trailer-still `<img>` with `alt={`${character.name} — official GTA6 trailer still`}`, role/billing line, `storyArc` body, the same `.fan-made-note` paragraph, `<Comments />`.

- [ ] **Step 4: Modify `web/src/app/page.tsx`**

Add one entry to `MODULES`: `{ href: "/characters", tag: "Characters", title: "Jason, Lucia & the cast", body: "Story-arc profiles for the confirmed leads and the wider cast." }`.

- [ ] **Step 5: Modify `web/src/components/SiteHeader.tsx`**

Replace `<span className="soon">Characters</span>` with `<Link href="/characters">Characters</Link>`.

- [ ] **Step 6: Verify**

Run `npm run lint && npm run build`. Confirm `/characters` and every `/characters/[slug]` slug build. In `npm run dev`, load one real character page and one bogus slug (404s). Confirm the header's "Characters" link navigates correctly.

- [ ] **Step 7: Commit**

```bash
git add web/src/data/characters.ts web/src/app/characters web/src/app/page.tsx web/src/components/SiteHeader.tsx
git commit -m "Add a Characters hub and per-character story-arc pages"
```

---

### Task 3: Sitemap — add new routes, drop ignored fields, fix lastmod

**Files:**
- Modify: `web/src/app/sitemap.ts`

**Interfaces:**
- Consumes: `REGIONS` from `@/data/regions` (Task 1), `CHARACTERS` from `@/data/characters` (Task 2), existing `CATEGORIES`/`getAllRecords`/`getByCategory`/`getByOutlet`/`getAllOutlets`/`outletSlug`/`itemSlug` from `@/lib/sources`.

- [ ] **Step 1: Modify `web/src/app/sitemap.ts`**

Remove `changeFrequency` and `priority` from every entry in every route group (Google ignores both, per the audit). Remove the `{ url: `${BASE_URL}/sitemap`, ... }` static entry (the HTML sitemap page shouldn't be in the XML sitemap). Add two new route groups: `regionRoutes` (one entry per `REGIONS` item at `${BASE_URL}/guides/map-of-leonida/${r.slug}`, `lastModified: now`) and `characterRoutes` (one entry per `CHARACTERS` item at `${BASE_URL}/characters/${c.slug}`, `lastModified: now`), plus a single static entry for `${BASE_URL}/characters`. For `categoryRoutes` and `outletRoutes`, replace the shared `now` with each group's own latest real date: `getByCategory(c.id).reduce((latest, r) => (r.scraped_at > latest ? r.scraped_at : latest), "") || now` (and the equivalent for outlets via `getByOutlet(o)`) — the `|| now` guards the empty-array case so a category/outlet with zero items still gets a valid date instead of an empty string.

- [ ] **Step 2: Verify**

Run `npm run build`. Run `npm run dev` and fetch `/sitemap.xml`; confirm it contains the new `/guides/map-of-leonida/<slug>` and `/characters` URLs, contains no `changefreq`/`priority` elements, no longer lists `/sitemap`, and that two different categories (or outlets) show two different `<lastmod>` values.

- [ ] **Step 3: Commit**

```bash
git add web/src/app/sitemap.ts
git commit -m "Fix sitemap: real per-category/outlet lastmod, drop ignored fields, add new routes"
```

---

### Task 4: Site-wide canonical tags, Open Graph, and JSON-LD

**Files:**
- Create: `web/src/lib/seo.ts`
- Create: `web/src/components/JsonLd.tsx`
- Modify: `web/src/app/layout.tsx`
- Modify: `web/src/app/page.tsx`
- Modify: `web/src/app/guides/map-of-leonida/page.tsx`
- Modify: `web/src/app/guides/map-of-leonida/[slug]/page.tsx`
- Modify: `web/src/app/characters/page.tsx`
- Modify: `web/src/app/characters/[slug]/page.tsx`
- Modify: `web/src/app/sources/page.tsx`
- Modify: `web/src/app/sources/[category]/page.tsx`
- Modify: `web/src/app/sources/item/[slug]/page.tsx`
- Modify: `web/src/app/sources/outlet/[outlet]/page.tsx`
- Modify: `web/src/app/sitemap/page.tsx`

**Interfaces:**
- Produces: `SITE_URL: string`, `canonicalUrl(path: string): string` from `web/src/lib/seo.ts`; `<JsonLd data={object} />` from `web/src/components/JsonLd.tsx` (renders `<script type="application/ld+json">` via `JSON.stringify`, which already escapes embedded quotes/`</script>`-breaking sequences safely for this use).
- Consumes: Region/Character/ScrapedRecord data and getters from Tasks 1–3.

- [ ] **Step 1: Write `web/src/lib/seo.ts`**

`export const SITE_URL = "https://www.everythinggta6.com";` matching `sitemap.ts`'s `BASE_URL` exactly. `export function canonicalUrl(path: string) { return `${SITE_URL}${path}`; }`.

- [ ] **Step 2: Write `web/src/components/JsonLd.tsx`**

A component taking `{ data: Record<string, unknown> }` and rendering `<script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />`.

- [ ] **Step 3: Modify `web/src/app/layout.tsx`**

Add `metadataBase: new URL(SITE_URL)` to the exported `metadata`, plus `openGraph: { siteName: "Vice City Dispatch", type: "website" }` and `twitter: { card: "summary_large_image" }` as site-wide defaults every page's own `openGraph`/`twitter` can override.

- [ ] **Step 4: Add canonical + Open Graph to every page's metadata, and rewrite every title**

For each of the 12 page files listed above (home, both hub pages, both guide/characters detail routes, sources hub, sources category, sources item, sources outlet, sitemap/page.tsx), add `alternates: { canonical: canonicalUrl("<page's own path>") }` to its `metadata` object or `generateMetadata` return, and (except on `sitemap/page.tsx`, which needs no OG image) an `openGraph: { title, description, images: [<trailer still or cite-card image if one exists for that record>] }`. In the same pass, rewrite every `title` string from `"… — Vice City Dispatch"`/`"Vice City Dispatch — …"` to the pattern `` `${description} | EverythingGTA6` `` (e.g. `/sources/hidden-gems`'s title becomes `"GTA 6 Hidden Gems: Secrets, Easter Eggs & Lesser-Known Details | EverythingGTA6"`, matching the audit's exact example). Leave `SiteHeader.tsx`'s "The Leonida Dispatch" and the footer brand untouched — only `<title>`/metadata strings change.

- [ ] **Step 5: Add `<JsonLd>` to the pages where a real schema type fits**

`WebSite` on the home page. `CollectionPage` (with an `ItemList` of the listed `Link`s' names/urls) on: `guides/map-of-leonida/page.tsx`, `characters/page.tsx`, `sources/page.tsx`, `sources/[category]/page.tsx`, `sources/outlet/[outlet]/page.tsx`. `NewsArticle` (`headline`, `datePublished: item.published_at`, `author`, `image: item.image`, `url: item.url`) on `sources/item/[slug]/page.tsx`. Do **not** add `Person`/`Place` JSON-LD to the region/character detail pages — they're fictional game content, not real people or locations, and that schema type would misrepresent them as such; canonical + Open Graph only there.

- [ ] **Step 6: Verify**

Run `npm run lint && npm run build`. In `npm run dev`, view-source (or `curl`) 3 pages — one item page whose title/content contains an apostrophe or quote, one category page, one region/character detail page — and confirm: a `<link rel="canonical" href="...">` matching `sitemap.ts`'s URL for that exact page, present `og:` meta tags, and (where added) a `<script type="application/ld+json">` block that `JSON.parse`s without error.

- [ ] **Step 7: Commit**

```bash
git add web/src/lib/seo.ts web/src/components/JsonLd.tsx web/src/app/layout.tsx web/src/app/page.tsx web/src/app/guides web/src/app/characters web/src/app/sources web/src/app/sitemap/page.tsx
git commit -m "Add canonical tags, Open Graph metadata, and JSON-LD site-wide"
```

---

### Task 5: Alt text, category intros, and keyword-richer category title

**Files:**
- Modify: `web/src/lib/sources.ts`
- Modify: `web/src/app/sources/[category]/page.tsx`
- Modify: `web/src/app/sources/page.tsx`
- Modify: `web/src/app/sources/item/[slug]/page.tsx`
- Modify: `web/src/app/sources/outlet/[outlet]/page.tsx`
- Modify: `web/src/app/page.tsx`

**Interfaces:**
- Produces (`web/src/lib/sources.ts`): `CATEGORY_INTROS: Record<CategoryId, string>` (one 150–300 word original paragraph per category, explaining what that category means for GTA6 and why it matters), `altFor(r: ScrapedRecord): string` returning a non-empty string even when `r.title` is falsy (fall back to `"GTA6 coverage thumbnail"`).

- [ ] **Step 1: Modify `web/src/lib/sources.ts`**

Add `CATEGORY_INTROS` and `altFor` as specified above.

- [ ] **Step 2: Modify `web/src/app/sources/[category]/page.tsx`**

Render `CATEGORY_INTROS[cat.id]` as an intro `<p>` directly under the `<h1>` (above the existing "{count} pieces..." line or combined with it). Replace every `alt=""` with `altFor(a)`. Change the `generateMetadata` title from `` `${cat.label} — Vice City Dispatch` `` to a keyword-richer pattern such as `` `GTA 6 ${cat.label}: ... — Vice City Dispatch` `` (exact wording for the `...` part is the implementer's call per category, factual and non-clickbait).

- [ ] **Step 3: Modify `web/src/app/sources/page.tsx`, `sources/item/[slug]/page.tsx`, `sources/outlet/[outlet]/page.tsx`**

Replace every `alt=""` on a `.cite-thumb` image with `altFor(record)`.

- [ ] **Step 4: Modify `web/src/app/page.tsx`**

Replace the video-card `alt=""` with `` `${v.title} — trailer thumbnail` ``.

- [ ] **Step 5: Verify**

Run `npm run lint && npm run build`. Run `grep -rn 'alt=""' web/src/app` and confirm it returns nothing. Manually load `/sources/hidden-gems` and confirm the new intro paragraph renders above the excerpt grid.

- [ ] **Step 6: Commit**

```bash
git add web/src/lib/sources.ts web/src/app/sources web/src/app/page.tsx
git commit -m "Add category intros, fix image alt text, sharpen category page titles"
```

---

### Task 6: Final verification and deploy

**Files:** none (verification, commit housekeeping, and push only).

- [ ] **Step 1: Run `npm run lint && npm run build` from `web/` one final time** on the full accumulated diff; fix anything that surfaces from the combination of all 5 prior tasks.
- [ ] **Step 2: `git status` and `git diff --stat`** against the last pushed commit on `main` to review everything about to ship in one pass.
- [ ] **Step 3: Push**

```bash
git push origin main
```

The Vercel project `everythinggta6` is already linked to `svareed/everythinggta6` via GitHub, so this push triggers the production deploy — no manual Vercel CLI step is needed.

- [ ] **Step 4: Confirm the deploy**, e.g. via the Vercel MCP `list_deployments`/`get_deployment` tools for project `everythinggta6`, and report the live deployment URL/status back.

Note for the human partner, not a task: submitting `sitemap.xml` in Search Console and using URL Inspection → Request Indexing are account-only actions neither this session nor the prior audit could do — do those yourself after the deploy confirms.
