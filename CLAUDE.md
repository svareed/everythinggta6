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
- Reuse existing `src/lib/*.ts` slug/lookup helpers (`characterSlug`, `findCharacter`, etc.) to cross-link entities by name wherever the data already connects them (e.g. a mission's `given_by`/`playable_as` linking to the matching `/characters/[slug]` page) — this is the internal-linking half of the same pass, not a separate task.
