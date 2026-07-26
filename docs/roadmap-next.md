# What's next — prioritized (2026-07-21)

A gap analysis of content, apps, and infra as the v1 catalog closes out, with a
recommended order of work toward the Phase 5 deploy gate. Complements
`docs/deploy-readiness.md` (the standing production checklist).

## State in one line

Catalog is live in production (**101 temples × 6 locales, 17 circuits, every
temple narrated in all six locales**), deployed to Firebase Hosting
(`temples.dsquaregee.com`); both apps cover the 4 tabs; Phase 4 tooling and
Phase 5 deploy prep are in place. Remaining work is polish and two owner
decisions; the Discover payload optimization landed (see Infra below).

_Update 2026-07-26: production-hardening pass — fixed the HTML CDN cache policy
(page URLs were silently falling back to Firebase's `max-age=3600` default; see
Infra below) and re-verified all quality gates at 101 temples (59/59 tests,
content validate, translation QA 100% target-script, 736-page build with CSP
hashes, byte budget, Lighthouse a11y/SEO/best-practices/CLS all green)._

## Owner decisions blocking the deploy gate

1. **Monitoring** — pick the approach (see `docs/deploy-readiness.md` §Outstanding).
   The zero-CSP edge option (Cloudflare HTTP analytics + Firebase Hosting
   metrics) ships with no code change; any client RUM needs a two-file CSP
   allowance. Recommendation: launch on the edge option, revisit RUM only if
   Core Web Vitals field data becomes a launch requirement.
2. **Phase 3 → 4 → 5 gate sign-off** — the build is v1 feature-complete; the
   phase gates await explicit owner sign-off per the phase-gate methodology.

## Gaps found, by area

### Content
- **Audio coverage** — **48/82 temples in all six locales**. The original
  48-temple catalog was fully narrated via the `audio.yml` CI run; the 34
  temples added since (PRs #28–#30: Navagraha, the four canonical circuits, and
  Pancharama) still need narration. The Listen tab shows every narrated temple
  as playable and simply omits the not-yet-narrated ones. *(backfill pending —
  re-run `audio.yml` for the new temples)*
- No other content gaps: validation, cross-locale factual parity, and
  translation QA (100% target-script) all pass.

### Apps
- **Listen tab is a directory, not a player** — both web and mobile list the
  audio-ready temples but send the user to a temple page to actually play.
  The design makes Listen a first-class tab; an in-place player (play without
  navigating away, step through the audio-ready set) is the highest-value UX
  gap. *(addressed this session — web)*
- **Mobile Listen player** — now at parity with web: the mobile Listen tab
  streams narration (expo-av) in a bottom now-playing bar with prev/next and
  auto-advance, sharing the same core playlist logic. *(done this session)*

### Test / harden
- Suite is unit-only (pure logic in `core`, asset integrity in `apps/web`).
  Browser/render verification (CSP-under-load, hydration) has been done ad-hoc
  per the deploy doc but is **not committed as a test**. Lighthouse CI covers
  a11y/SEO/best-practices/CLS as hard gates. A committed smoke check is a
  reasonable future hardening step but is partly redundant with Lighthouse CI.

### Infra / deploy
- **HTML CDN cache policy — FIXED (2026-07-26).** `firebase.json` defined the
  intended HTML policy (`max-age=0, s-maxage=86400, stale-while-revalidate=7d`)
  on `source: "**/*.html"`, but Firebase matches header globs against the
  **request path**, and every page URL is a trailing-slash directory
  (`/en/temples/x/`) with no `.html` in the path — so the rule never matched and
  pages silently fell back to Firebase's `max-age=3600` default (no CDN
  `s-maxage`, no `stale-while-revalidate`). Fix: moved the HTML/default policy
  onto the broad `**` rule (Firebase applies last-matching value per header key
  — confirmed on prod via `sw.js`), so the immutable `_next/static` + media
  rules and `sw.js`/manifest rules still override for their paths while page
  URLs now get the intended CDN caching. Verified end-to-end via
  `serve-out.mjs`. Removed the now-dead `**/*.html` rule.
- **Discover payload — OPTIMIZED via lazy search index (2026-07-26).** The
  localized Discover listing serialized the whole locale catalog for instant
  client-side search. The four **search-only** fields (`deity`, `tradition`,
  `style`, `period` — never displayed or faceted, only fed to `haystack()`) are
  now moved off the card payload into a lazily-fetched per-locale search index,
  so the listing HTML stops carrying them for every temple. Result: the Discover
  listing dropped **254 → 197 KB raw (−22%)**; the largest page is now the Home
  page (`ml/index.html`, ~248 KB — legitimate *rendered* card HTML for the
  "All temples" grid, server-rendered, so it never carried the search fields in
  a client payload). Implementation:
  - `TempleCardData`/`toCardData` keep only rendered + facet fields (`dynasty`
    stays — it's shown in the card meta line).
  - `content:search-index` (`gen-search-index.mjs`, zero-dep) emits
    `apps/web/public/search/<locale>.json` (`id → lowercased search text`),
    wired into `build:web`/`dev:web`; served at `/search/<locale>.json` under
    CSP `connect-src 'self'`.
  - `DiscoverExplorer` fetches its locale index on first search focus/keystroke
    (and on a `?q=` deep link); until it loads, search spans the card fields
    (name, native name, town, state, dynasty), then recomputes to add the
    off-card fields. Mobile bundles all content, so it builds the same map in
    memory (no payload concern) — full search fidelity preserved on both apps.
  - `matchesQuery`/`filterTemples` take the supplemental text; `searchIndexText`
    is the shared projection. Verified: 62 unit tests, plus a headless-Chromium
    test of the live async search in English **and** Malayalam (index fetch 200,
    off-card term matches after load, `?q=` deep link, no CSP violations).
  Next payload lever, when needed: the Home page's "All temples" grid duplicates
  the Discover catalog as rendered HTML — paginating/deferring it (carefully, to
  preserve SEO + no-JS) is the remaining structural trim.
- Pipeline, CSP (header + per-page meta hashes), security
  headers, Firestore rules, rollback path: all ready and documented.
- Firestore composite indexes: none needed (favorites are on-device).
- Region locked to `asia-south1` (D1); payments out of scope (D2).

## Recommended order

1. Finish audio → 48/48 for the original catalog. *(done — CI media run; the 34
   temples added since need an `audio.yml` backfill)*
2. Ship the Listen in-place player (web) → elevates a first-class tab now that
   audio is complete. *(done this session)*
3. Bring mobile Listen to player parity. *(done this session)*
4. Owner: resolve monitoring + take the deploy-gate sign-off.
5. Optional hardening: commit a headless render/CSP smoke check if Lighthouse
   CI coverage proves insufficient in practice.
