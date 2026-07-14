# Phase 3 — Approved Build Plan

*Owner-approved in plan mode. Scope answers: build PWA + native in parallel
(D5); v1 content = 10 temples × 6 languages (D6).*

## Monorepo

pnpm workspaces + turbo. `apps/web` (Next.js App Router, SSG), `apps/mobile`
(Expo), `packages/core` (schema, tokens, i18n), `packages/content` (JSON
content), `infra/` (Firebase/GCP).

## Content model (packages/core → zod schema)

- **Temple** (per locale file `content/temples/<locale>/<id>.json`): id, locale,
  name, nativeName, deity, tradition, location{city,state,lat,lng}, period,
  dynasty, style, unesco, circuits[], summary, sections{history, architecture,
  legends, festivals, experience}, visit{timings, dressCode, photography,
  gettingThere}, audio{storyDuration}.
- **Circuit** (`content/circuits/<locale>/<id>.json`): id, locale, name,
  nativeName, theme, description, stops[] (ordered temple ids), region.
- Locales: `en ta te kn ml hi`. English is the source-of-truth authoring
  locale; other locales are translations of it.

## Web app (apps/web)

- Next.js App Router, **all temple/circuit pages statically generated** from
  packages/content at build time (`generateStaticParams`) — CDN-cacheable HTML,
  fully indexable (the SEO requirement that killed Flutter).
- Routes: `/[locale]` home · `/[locale]/temples` (Discover) ·
  `/[locale]/temples/[id]` (flagship detail) · `/[locale]/yatra` ·
  `/[locale]/yatra/[id]` · `/[locale]/listen`.
- PWA: manifest + minimal hand-rolled service worker (precache shell,
  stale-while-revalidate for pages, cache-first for images). No heavy SW libs.
- Performance budget enforced: system fonts only, no client state lib, server
  components by default, LCP hero preloaded.

## Mobile app (apps/mobile)

Expo (React Native), tabs mirroring the IA, consuming the same
packages/core + packages/content. v1 ships content reading + circuits;
audio/downloads follow.

## Backend (infra/, v1 surface)

- Firebase project in `asia-south1` (D1): Hosting+CDN for web, Auth
  (anonymous → link account later), Firestore for user state only (visited
  stops, saved temples, locale) — content itself is static/CDN, not DB reads.
- Firestore security rules: users read/write only their own doc tree.
- No payments in v1 (D2).

## Slices (commit + push after each)

0. Docs + CLAUDE.md (this reconstruction)
1. Monorepo scaffold: core schema/tokens/i18n, content pipeline, web shell
2. Content: 10 temples EN (agents), validated against schema
3. Translations: ta te kn ml hi (agents), validated
4. Web pages wired to content; build green; PWA manifest/SW
5. Mobile shell wired to content
6. Infra config (firebase.json, rules) + README
