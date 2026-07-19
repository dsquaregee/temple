# Temple

An app for devotees to **find, learn, and experience the oldest temples of
India**, with a primary focus on South India — history, architecture, legends,
festivals, and darshan guidance for each temple, in six languages.

Owner: dsquaregee · support@dsquaregee.com

> Phase 3 (Build) — PWA and native apps built in parallel over a shared content
> core. The catalog has grown to **26 temples × 6 languages** across **5
> pilgrimage circuits** (v1's committed scope was 10 × 6 / 2 circuits). See
> `CLAUDE.md` for the full product brief and locked decisions.

## Monorepo layout

```
apps/
  web/        Next.js App Router PWA — statically exported, CDN-cacheable
  mobile/     Expo (React Native) app — Expo Router, same content core
packages/
  core/       Shared TypeScript: content types, design tokens, i18n strings
  content/    Temple + circuit content (one JSON per temple per locale) + pipeline
infra/        Firebase/GCP config, Firestore security rules
docs/         Phase artifacts: research, design, architecture
```

Both apps consume the **same** `@temple/core` (schema, tokens, 6-locale UI
strings) and `@temple/content` (the temple/circuit data + typed accessors), so
there is exactly one source of truth for content and design.

## Content

- **26 temples** across Tamil Nadu, Karnataka, Kerala, and Andhra/Telangana.
- **5 circuits**: Great Living Chola Temples, Pancha Bhoota Sthalams, Divya
  Desams, Sacred Ensembles of the Hoysalas, and Temples of Kanchipuram.
- **6 locales**: `en` (source of truth), `ta`, `te`, `kn`, `ml`, `hi`.

Content lives as one JSON file per temple/circuit **per locale** under
`packages/content/data/`. A zero-dependency validator enforces the schema and
**cross-locale parity** (every locale mirrors the English catalog exactly, and
structural fields — ids, coordinates, circuit references — stay identical).

```bash
pnpm content:validate     # schema + parity checks
pnpm content:generate     # emit packages/content/src/generated.ts (static imports)
```

`generated.ts` is git-ignored and produced from the JSON at build time so both
Next.js and Metro can bundle content with no runtime filesystem access.

## Prerequisites

- Node 20+ (developed on Node 22)
- pnpm 10 (`corepack enable`)

```bash
pnpm install
```

## Web app (`apps/web`)

Next.js App Router, **fully static export** (`output: 'export'`): every
temple/circuit page is pre-rendered via `generateStaticParams` into
CDN-cacheable, fully-indexable HTML — the SEO requirement behind choosing
Next over Flutter (D3).

```bash
pnpm dev:web       # content:generate + next dev
pnpm build:web     # content:generate + next build → apps/web/out
```

Routes: `/` (language picker) · `/[locale]` (Home) · `/[locale]/temples`
(Discover) · `/[locale]/temples/[id]` (temple detail) · `/[locale]/yatra`
(circuits) · `/[locale]/yatra/[id]` · `/[locale]/listen`.

Highlights: per-page `canonical` + `hreflang` alternates for all six locales,
`HinduTemple` JSON-LD on detail pages, system fonts only (zero web-font
download on the critical path), server components throughout, a hand-rolled
service worker, and a web app manifest.

## Mobile app (`apps/mobile`)

Expo (React Native) + Expo Router, file-based routing mirroring the same 4-tab
IA, reading the same content core. v1 ships content reading + circuits;
audio and offline downloads follow.

```bash
pnpm --filter @temple/mobile dev          # expo start
pnpm --filter @temple/mobile typecheck
pnpm --filter @temple/mobile export:web    # bundle smoke test
```

## Testing & quality

Unit tests run on Node's built-in test runner with native TypeScript
type-stripping — no test-runner dependency, no install step (Node 22+).

```bash
pnpm test        # core logic, catalog invariants, asset integrity
pnpm budget      # performance budget against the built web export
```

CI gates every PR on content validation, translation QA, the unit suite, the
web build + performance budget, and the mobile typecheck. See
[`docs/testing.md`](docs/testing.md) and
[`docs/deploy-readiness.md`](docs/deploy-readiness.md).

## Design system

Warm "cream + temple-stone" palette with turmeric/vermilion accents and full
dark mode, serif display for editorial headings, system UI sans for chrome,
and native system fonts for all six scripts. No deity imagery in UI chrome
(reverence + photography rules). Tokens live in `packages/core/src/tokens.ts`;
UI strings for all six languages in `packages/core/src/i18n.ts`. See
`docs/design/`.

## Backend

Static content on Google's global CDN; Firebase Anonymous Auth; Firestore for
**user state only** (visited stops, saved temples, locale) in `asia-south1`
(D1). No payments in v1 (D2). See `infra/README.md`.

## Deploy

Deployed to Firebase project **`temple-502523`** — live at
**https://temple-502523.web.app**, with the production domain
**https://temples.dsquaregee.com** (Cloudflare DNS → Firebase Hosting; see
`infra/README.md`). `firebase.json` lives at the repo root.

```bash
pnpm build:web
firebase deploy --only hosting,firestore:rules
```

> Firestore uses a **named** database `temple` in `asia-south1` (D1); the
> config targets it. `metadataBase` in `apps/web/app/layout.tsx` is set to the
> production domain, so canonical/hreflang URLs are correct.

## Status & caveats

- Phase 3 build well underway: scaffold, content (26 temples × 6 locales, 5
  circuits), web PWA, mobile shell, and infra are in place. Phase 4
  (Test/Harden) has begun — automated tests, a CI performance budget, security
  response headers + CSP, and PWA raster icons all landed; see
  `docs/deploy-readiness.md` for the remaining Phase 5 checklist.
- **Translations** (`ta te kn ml hi`) — owner sign-off recorded 2026-07-19
  (dsquaregee). Automated QA (`docs/i18n/translation-review.md`) remains a
  mechanical guard for any future content added to the catalog.
- Content prose is original editorial writing; facts are checked against the
  research notes in `docs/research/`.
