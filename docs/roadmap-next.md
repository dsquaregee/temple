# What's next — prioritized (2026-07-21)

A gap analysis of content, apps, and infra as the v1 catalog closes out, with a
recommended order of work toward the Phase 5 deploy gate. Complements
`docs/deploy-readiness.md` (the standing production checklist).

## State in one line

Catalog is feature-complete (82 temples × 6 locales, 16 circuits, all green);
both apps cover the 4 tabs; Phase 4 tooling and Phase 5 deploy prep are
substantially in place. The remaining work is polish, hardening, and two
owner decisions.

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
- **Discover payload growth** — the localized Discover listing embeds the whole
  catalog for instant client-side search, so it grows ~2.5 KB raw per temple
  (~220 KB at 87 temples; gzips to ~31 KB on the wire). The raw HTML budget was
  raised 250 → 320 KB to accommodate the current catalog. The durable fix, when
  it approaches the cap again, is to move the **search-only** fields
  (`deity`, `tradition`, `style`, `period` — ~34% of the payload, never
  displayed or faceted) out to a lazily-fetched per-locale search index so the
  page stops scaling linearly with the catalog. Prefer that over another bump.
- Pipeline, hosting cache policy, CSP (header + per-page meta), security
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
