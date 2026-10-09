# Temple App — Project Memory

An app for devotees to find, learn, and experience the oldest temples of India,
with a primary focus on South India. Highlights features, architecture, history,
and benefits of each temple. Owner: dsquaregee (support@dsquaregee.com).

## Product requirements (from owner)

- PWA + native iOS and Android apps
- GCP backend, Firebase Auth (Firestore), Stripe payments (see decision D2)
- CDN in front of everything; most users in India, hosting anchored in east-coast USA
- Extremely performant; best practices throughout

## Methodology

Phase-gate: Research → UX/Design → Build → Test/Harden → Deploy.
Each gate requires owner sign-off before the next phase starts.

| Phase | Status |
|---|---|
| 1. Research | ✅ Complete, gate passed 2026-07 |
| 2. UX/Design | ✅ Complete, gate passed 2026-07 |
| 3. Build | ✅ Complete, gate passed 2026-10-08 (both PWA + native; **82 temples × 6 languages**, 16 circuits — catalog expanded past the D6 launch core via owner-merged PRs #17–#30) |
| 4. Test/Harden | 🔨 In progress (unit + content-invariant suite, translation QA, CSP hardening, per-page byte budget, Lighthouse CI all in place — see docs/testing.md) |
| 5. Deploy | ✅ **Live on Cloudflare.** `temples.dsquaregee.com` is served by **Cloudflare Workers Static Assets** (Git-connected Workers Builds, no deploy secrets) with **media/audio on Cloudflare R2** (`media`/`audio.dsquaregee.com`, $0 egress) — verified end-to-end (single-valued cache headers, CSP/HSTS, R2 media HIT). **No Google in the serving path.** History: project migrated off the Google-locked `temple-502523` → `temples2` (`infra/migrate-project.mjs`; Firestore `temples2` db in `asia-south1`; all media regenerated — audio 101×6, heroes 92, AVIF/WebP/OG, narrated video 78×6), served from temples2.web.app, then **hosting moved to Cloudflare** and the domain cut over. Firebase Hosting deploy (`deploy.yml`) retired. **Off-Google backup**: weekly GCS→R2 mirror (`backup-media-r2.yml` → `temples2-media-backup`/`temples2-audio-backup`). Runbooks: **docs/deploy-cloudflare-pages.md**, **docs/migrate-project.md**. |

## Locked decisions (owner-approved at gates)

- **D1 Backend region**: Mumbai (`asia-south1`) for Firestore/backend — region is
  immutable after creation and US-east would add 150–300 ms to every dynamic read
  for Indian users. CDN (Cloud CDN / Firebase Hosting CDN) serves static + cached
  content globally, which satisfies the "hosted from US" business need.
- **D2 Payments**: Content-only v1. Stripe India onboarding is invite-only
  (verified July 2026), no UPI for foreign entities (UPI ≈ 85% of Indian digital
  payments), and a US entity touching temple donations raises FCRA risk.
  Donations link out to each temple's official page. Stripe integration is
  deferred to a later phase (diaspora-facing premium features are the candidate).
- **D3 Stack**: Next.js PWA + React Native (Expo) in a TypeScript monorepo with a
  shared core. Flutter rejected: canvas-rendered web output is invisible to
  search engines — fatal for a content catalog whose top-of-funnel is Google.
- **D4 Design direction**: Hybrid — "Kovil" warm devotional home + "Sthala"
  editorial temple detail pages + "Yatra" circuits tab.
- **D5 Build order**: PWA and native in parallel from the start.
- **D6 v1 content scope**: 10 temples, all 6 languages (ta, te, kn, ml, hi, en).
  _Update 2026-07-21: the launch catalog was expanded to the full researched set
  and beyond — **82 temples, 16 circuits** (PRs #17–#30). The 10 below remain the
  editorial "launch core"; source of truth for the catalog is `packages/content/data`._

## Design system (Phase 2, summary — see docs/design/)

- 4-tab navigation: Home / Discover / Yatra / Listen
- Onboarding: language picker is the first screen (native scripts lead, English
  gloss below, tap-and-hold audio preview); anonymous browsing; sign-in deferred
  until a feature needs it
- Circuits (Pancha Bhoota Sthalams, Great Living Chola Temples, Divya Desams…)
  are a first-class entity, not a tag
- No deity imagery in UI chrome (photography restrictions + reverence)
- Performance is designed-in: system fonts for Indic scripts and the critical
  path (zero font download on 4G), AVIF hero as the preloaded LCP element,
  solid-tone skeletons for zero layout shift, per-tab bundles
- Accessibility blocking rules: 48dp touch targets, audio alternative for every
  long-form text (limited-literacy users), WCAG AA contrast

## Temple catalog — launch core + full set

**Shipped catalog: 82 temples × 6 locales, 16 circuits** (source of truth:
`packages/content/data`). The original editorial launch core (10 of the
researched 42) below remains the anchor; the rest were added across PRs #17–#30.

Launch core — Great Living Chola Temples (UNESCO): brihadeeswarar,
gangaikonda-cholapuram, airavatesvara. Pancha Bhoota Sthalams: ekambareswarar
(earth), jambukeswarar (water), arunachaleswarar (fire), srikalahasti (air),
nataraja-chidambaram (space). Plus: meenakshi-madurai, ramanathaswamy-rameswaram.

## Narration audio

- English: Google Cloud TTS **Chirp 3 HD `en-IN-Chirp3-HD-Kore`** (owner-chosen
  2026-10-08) with a **pronunciation lexicon** — `packages/content/data/pronunciation/en.json`
  maps Sanskrit/Tamil words to phonetic respellings (audio only; on-screen text
  unchanged). Mispronounced word → add an entry, bump `REV.en` in
  `scripts/gen-audio.mjs` (+ `VIDEO_REV.en` in `gen-video.mjs`), re-run `audio.yml`
  (locales=en, resume off is implicit via the REV bump), the R2 backup (pushes new
  audio to the serving R2 bucket), then `media.yml` (locales=en, keep_hero=true,
  **resume=false** so videos re-render against the new audio), then the R2 backup
  **again** (pushes new video), then **bump the service worker** (see deploy rule).
  Paths are versioned because media is served `immutable`. The R2 buckets
  (`media`/`audio.dsquaregee.com`) are populated by `backup-media-r2.yml` — the
  generators upload to GCS, so a sync is required before new URLs resolve, and
  `media.yml` downloads the audio from its R2 URL, so the audio sync must precede it.
- **Never merge to the base branch while `audio.yml`/`media.yml` is mid-run** — those
  workflows commit regenerated content at the end, and a base advance makes their
  `git push` a non-fast-forward (rejected). Serialize deploys around media runs.
- Other locales: Neural2/Wavenet voices, unversioned paths.
- `audio.yml` `sample=<ids>` renders voice comparison samples without touching content.

## Circuit route maps

Every Yatra circuit page shows an illustrated route map (`apps/web/components/CircuitMap.tsx`,
layout in `packages/core/src/circuit-map.ts`) generated at build time from each stop's
`location.lat/lng` — inline SVG, zero JS, every pin/label links to its temple. Adding a
temple to a circuit (`stops` + the temple's `circuits`, kept in sync by `validate.mjs`)
updates the map automatically. Coastline: `apps/web/lib/geo/south-india-land.json`
(Natural Earth, `scripts/gen-land-outline.mjs`). Route follows `stops` order.

## Repo layout

- `apps/web` — Next.js App Router PWA (SSG temple pages, minimal SW)
- `apps/mobile` — Expo React Native app
- `packages/core` — shared TypeScript: content schema, i18n, design tokens
- `packages/content` — temple + circuit content, one JSON per temple per locale
- `docs/` — phase artifacts (research, design, architecture)
- `infra/` — Firebase/GCP config, security rules

## Working rules

- Commit and push to `claude/temple-app-phase-1-jfbtxy` after every slice —
  the remote is the only durable store; a prior session lost all work to
  container reclamation because nothing had been pushed.
- Content prose must be original writing (no copied text); facts verified
  against research notes; respectful, editorial tone.
- **Bump the service worker `VERSION` in `apps/web/public/sw.js` after EVERY
  deployment that changes referenced asset URLs** (audio/video regens, any content
  change that moves a media URL). The SW serves pages with stale-while-revalidate,
  so without a VERSION bump returning visitors keep seeing cached pages that point
  at the old audio/video and "nothing changes in production" for them. The bump's
  `activate` handler purges every client's caches on next visit. (Owner rule,
  2026-10-09.)
