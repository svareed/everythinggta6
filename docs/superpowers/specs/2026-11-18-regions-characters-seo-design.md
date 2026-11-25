# Region pages, Character pages, and SEO fixes — Design

Date: 2026-11-18
Status: Approved by user in conversation (short design, small-to-medium change)

## Intent

Two bundled objectives the user asked to ship together:

1. Let visitors click through from the Leonida region grid into a full page per
   region, and add a new Characters section with story-arc profiles and images.
2. Resolve the findings from a pasted third-party SEO/indexing audit of
   everythinggta6.com, then deploy.

## Goals

**Regions**
- Each region card on `/guides/map-of-leonida` links to its own page at
  `/guides/map-of-leonida/[slug]`.
- Region data (currently a literal array inside the page component) moves to
  `src/data/regions.ts` so both the hub and detail route can read it.
- Each detail page shows: back link, status badge (reuses the existing
  Confirmed/Unconfirmed + "mystery" convention), a real YouTube trailer-still
  as header art, an expanded hand-written body, and the existing citation
  footnote style.

**Characters**
- New `src/data/characters.ts` holding the confirmed leads (Jason, Lucia) and
  the supporting cast named in the repo's own `research/content-taxonomy.md`
  (Cal, Boobie Ike, Dre'Quan, Raul, Brian), each with a status flag along the
  same Confirmed/Unconfirmed axis as regions — most of this cast is
  community-reported, not Rockstar-confirmed, and must read that way.
- New hub page `/characters` (mirrors the regions grid) and detail pages at
  `/characters/[slug]` (mirrors the region detail layout): role/billing,
  story-arc summary, status badge, trailer-still image.

**Images (decided in conversation)**
- No fabricated/invented character or region art. The only imagery is the
  real, already-verified YouTube trailer thumbnails
  (`img.youtube.com/vi/<id>/hqdefault.jpg`) reused round-robin across the new
  pages — not a unique photo per subject.

**Fan-made citation (decided in conversation)**
- Any body copy that is hand-written elaboration rather than a direct,
  sourced fact — which is effectively all of the new story-arc and expanded
  region text — carries a small citation line directly beneath it:
  "Fan-made summary — not official Rockstar material." This is in addition
  to, not a replacement for, the existing unconfirmed/mystery status badges.

**SEO audit fixes** (from the pasted Search Console / on-page audit of
`/sources/hidden-gems`, i.e. the `/sources/[category]` route, generalized to
every page since the same gaps exist site-wide):
- Add `metadataBase` once in the root layout; add `alternates.canonical` to
  every page's metadata export.
- Add Open Graph tags (and reuse them for Twitter card) site-wide via the
  root layout defaults plus per-page overrides where a page has its own
  title/image.
- Add JSON-LD: `Article`/`NewsArticle` on `/sources/item/[slug]`;
  `CollectionPage` + `ItemList` on `/sources`, `/sources/[category]`,
  `/sources/outlet/[outlet]`, `/guides/map-of-leonida`, and `/characters`.
- Every `<img>` site-wide gets real, non-empty `alt` text (currently `alt=""`
  on cite-thumbs and no alt-bearing markup on the homepage trailer grid).
- `/sources/[category]` (news, tips, hidden-gems) and `/sources` itself each
  get a 150–300 word original intro above the excerpt list.
- Every page's `<title>` is rewritten to the audit's exact pattern —
  `"<Keyword-rich description> | EverythingGTA6"` — replacing the prior
  `"… — Vice City Dispatch"` convention site-wide. This is a reversal of the
  first draft of this spec (which kept "Vice City Dispatch" and called a
  rebrand out of scope); the user has now explicitly asked for the domain-
  matching brand in titles, so it's in scope. This only changes `<title>`/
  metadata strings — the visual header brand ("The Leonida Dispatch") and
  footer are untouched, since nothing asked for those to change; that
  remaining inconsistency is noted, not silently fixed.
- Internal linking to the map guide is widened: the homepage nav already
  links to it (`SiteHeader.tsx` already has a `Map` link — verified, no
  change needed); add a short link to it from the top of `/sources`,
  `/sources/news`, and `/sources/tips` (and, for consistency, `hidden-gems`
  too, since all three share one template).
- The map guide hub page (`/guides/map-of-leonida`) is expanded beyond the
  per-region links: it gets a small annotated sector diagram (a new
  `LeonidaSchematic` component — a clickable grid of the 7 sector tiles,
  explicitly labeled as an unofficial sector index, not a real map, to stay
  consistent with the page's existing "no complete official map has been
  released" disclaimer) and a short "Notable landmarks" list per region.
  A real geographically-accurate or leaked-art map is explicitly rejected —
  it would either fabricate cartography or use unofficial leaked assets,
  both of which conflict with this site's existing ethos (see the page's
  own disclaimer). "Interactive" here means real click-through navigation
  to each region's detail page, not pan/zoom cartography.
- `sitemap.ts`: drop `changeFrequency`/`priority` (Google ignores both per
  the audit); category/outlet routes get each one's own real last-updated
  date instead of a single shared "now"; the `/sitemap` HTML page entry is
  removed from the XML sitemap; new region and character routes are added.

## Non-goals / explicitly out of scope

- Submitting the sitemap in Search Console or requesting indexing — the
  audit itself notes this needs the account owner; no Search Console access
  exists in this session either.
- A full visual rebrand. Only `<title>`/metadata strings switch to the
  `| EverythingGTA6` pattern (see Goals). The on-page header brand ("The
  Leonida Dispatch") and footer are untouched — nobody asked for those to
  change, and that's a separate identity decision from a title-tag fix.
- Any new automated test suite — this repo has no test framework
  (`package.json` only defines `build` and `lint`). Verification for every
  task in the implementation plan is `npm run lint && npm run build` (which
  also type-checks and statically generates every route, so a bad slug/param
  or invalid JSON-LD fails the build) plus a manual dev-server check of the
  specific new/changed URL.

## Constraints

- Next.js 16 App Router, async `params` (match the existing `[slug]`/
  `[category]`/`[outlet]` routes' pattern).
- Reuse existing CSS conventions (`.coord`, `.cite-card`, `.guide-head`,
  `.video-card`) rather than inventing a new visual language.
- Keep the same cautious, citation-first tone as the existing "??? Rumored
  region" card for anything not Rockstar-confirmed.

## Approach

One approach, following conventions already established in this codebase
(e.g. `/sources/item/[slug]`): a small typed data module per new content
type (`regions.ts`, `characters.ts`) with a `getXBySlug` helper, a hub page,
and a `[slug]` detail route with `generateStaticParams`/`generateMetadata`/
`notFound()`. The SEO fixes are mechanical additions to existing files, no
new architecture.

## What's left to the implementer

- Exact wording of each region's expanded body and each character's
  story-arc summary (factual, hedged per status, no invented plot points).
- Which of the 4 existing verified trailer IDs maps to which region/
  character (round-robin is fine; no page needs a unique id).
- Exact copy for the three category intros and the improved category title.
