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
| 3. Build | 🔨 Feature-complete for v1, owner gate pending (both PWA + native; **82 temples × 6 languages**, 16 circuits — catalog expanded past the D6 launch core via owner-merged PRs #17–#30) |
| 4. Test/Harden | 🔨 In progress (unit + content-invariant suite, translation QA, CSP hardening, per-page byte budget, Lighthouse CI all in place — see docs/testing.md) |
| 5. Deploy | 🔨 Prep in progress (static export, Firebase hosting/CSP/security headers, Firestore rules, deploy pipeline ready; **monitoring choice + owner gate outstanding** — see docs/deploy-readiness.md) |

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
