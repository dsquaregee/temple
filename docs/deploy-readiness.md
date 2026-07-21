# Deploy readiness (Phase 5 prep)

A standing checklist of what is production-ready today and what remains before
the Phase 5 gate. Reflects the locked decisions in `CLAUDE.md` (static CDN
front, Firestore holds user state only, content-only v1).

## Ready

- **Static export** — `apps/web` builds a fully pre-rendered export
  (`output: 'export'`), every temple/circuit page SSG'd for SEO (D3). CDN-native.
- **Hosting cache policy** (`firebase.json`) — hashed `_next/static` + media
  assets `immutable, max-age=1y`; HTML `s-maxage=1d, stale-while-revalidate=7d`;
  `sw.js` never cached; manifest 1h. Correct for a static catalog behind a CDN.
- **Service worker** — minimal hand-rolled SW: precached shell + offline page,
  stale-while-revalidate navigations, cache-first same-origin assets, versioned
  cache eviction on activate.
- **Firestore rules** — deny-by-default; each user can read/write only their own
  `users/{uid}` subtree. No public content in Firestore (matches D1).
- **Deploy pipeline** — `deploy.yml` builds the web export and ships
  `hosting` + `firestore:rules` to `temple-502523` on default-branch push;
  service-account key written to a temp file and cleaned up `if: always()`.
- **Security response headers** — HSTS (preload), `nosniff`, `X-Frame-Options:
  SAMEORIGIN`, `Referrer-Policy: strict-origin-when-cross-origin`,
  `Permissions-Policy` denying camera/mic/geo/payment/usb/FLoC, and
  `Cross-Origin-Opener-Policy: same-origin-allow-popups` (popup-safe for future
  Firebase Auth account linking). Applied globally via a `**` headers rule.
- **Content-Security-Policy** — global CSP (header) locking `default-src` to
  `'self'`, `object-src`/`frame-ancestors`/`base-uri` down, `img-src`/
  `media-src`/`connect-src` to `'self'` + `storage.googleapis.com` (the media
  bucket), and `upgrade-insecure-requests`.
- **CSP script hashing** — a postbuild step (`apps/web/scripts/csp-hashes.mjs`)
  computes the SHA-256 of every executable inline script per page and injects a
  per-page `<meta>` CSP with `script-src 'self' <hashes>` and **no
  `'unsafe-inline'`**. The header keeps `'unsafe-inline'` (static export can't
  nonce), but the two policies are enforced together, so an injected inline
  script fails the meta's hash check and is blocked. Verified end-to-end with a
  headless browser: the app hydrates with zero violations, and an injected
  unhashed inline script is blocked.
- **CSP `style-src 'self'`** — the export carries **no inline styles**. The only
  ones (per-temple hero background tones + one `display:block`) were moved to
  CSS classes: hero tones map to `.hero-bg-*` utilities (one per `HERO_PALETTE`
  entry, applied via `heroBgClass`), so the header CSP drops `style-src`'s
  `'unsafe-inline'` entirely — no hashes, no `'unsafe-hashes'`. Verified with a
  headless browser under the enforced header: all hero backgrounds render, zero
  CSP violations, and an injected inline `<style>` is blocked. A content test
  guards that every stored `hero.color` stays a palette tone.
- **PWA icons** — `manifest.webmanifest` ships the source SVG plus rasterised
  `192×192` and `512×512` maskable PNGs (generated from the SVG by
  `pnpm --filter @temple/content icons`), satisfying Lighthouse installability.
- **CI gate** — content validation + translation QA + unit tests + web build +
  mobile typecheck must pass on every PR.
- **Performance budget** — `apps/web/scripts/check-budget.mjs` runs in CI after
  the web build and fails the PR if the largest JS chunk, total JS (gzip), or
  largest prerendered HTML exceeds its ceiling. Zero-dependency (Node's gzip).
- **Lighthouse CI** — a `lighthouse` CI job serves the export with the real
  `firebase.json` headers (`scripts/serve-out.mjs`) and runs Lighthouse
  (`@lhci/cli`, `lighthouserc.json`) over six representative pages (home, a
  placeholder-hero temple, a real-photo temple, a circuit, a non-English page,
  and the interactive Listen tab).
  Gates **accessibility ≥ 0.9, SEO ≥ 0.95, best-practices ≥ 0.9, CLS ≤ 0.1**;
  performance is a non-blocking warning (aggregate score varies with runner
  load — the byte budget above is the hard performance gate). Current export
  measures a11y 0.96, SEO 1.0, best-practices ≥ 0.96, CLS ≤ 0.004.

## Outstanding before the Phase 5 gate

1. **Monitoring** — no error/analytics wiring yet. Owner to pick before launch.
   The strict CSP shapes the choice, so the options split into two groups (a
   correction to an earlier note that called Cloudflare Web Analytics "zero CSP
   change" — see the caveat below):

   - **Genuinely zero-code / zero-CSP** — server-side / edge measurement that
     needs no in-page beacon: Cloudflare's **HTTP traffic analytics** (from the
     proxy, already in front of the site) and Firebase Hosting request metrics.
     Coarser — requests, bandwidth, geography, cache-hit ratio, status codes —
     with **no** Core Web Vitals RUM and no per-route (client-nav) views. If the
     owner wants "turn it on, touch nothing," this is the option that delivers.

   - **Client RUM (Cloudflare Web Analytics, GA4, Sentry, Plausible…)** — any of
     these needs a CSP allowance; **none is zero-change**, including Cloudflare's.
     Its beacon loads an external script and POSTs to a Cloudflare host, so the
     browser blocks it under today's policy. Verified in a headless browser
     against the real `serve-out` headers on `/en/temples/brihadeeswarar/`: the
     `static.cloudflareinsights.com/beacon.min.js` load is blocked by
     `script-src-elem` (both the header policy **and** the injected per-page meta
     fire) and the `cloudflareinsights.com/cdn-cgi/rum` POST is blocked by
     `connect-src`.

   Enabling any client RUM therefore takes edits in **two** files, not one — the
   meta policy would block it even if only the header were changed:
   1. `firebase.json` — add the beacon host to `script-src` and the collector
      host to `connect-src` in the global CSP header.
   2. `apps/web/scripts/csp-hashes.mjs` (the `metaFor` template, currently
      `script-src 'self' <hashes>`) — add the same beacon host, or the per-page
      meta re-blocks the script post-build.

   For Cloudflare Web Analytics specifically that is
   `script-src … https://static.cloudflareinsights.com` (both places) and
   `connect-src … https://cloudflareinsights.com` (header). Prefer the
   zero-CSP edge option unless RUM/Web Vitals are a launch requirement.

## Verified findings

- **Custom domain** — `temples.dsquaregee.com` is live (Cloudflare DNS →
  Firebase Hosting) and already baked into `metadataBase`, canonical/hreflang,
  OG, and sitemap URLs. Confirmed by the owner 2026-07-19.
- **Translations** — owner sign-off recorded 2026-07-19; the six-locale catalog
  is cleared for public launch.
- **Firestore composite indexes** — none required today. Favorites are
  anonymous and **on-device** (`localStorage`, `apps/web/lib/favorites.ts`);
  there are no Firestore reads/queries anywhere in the app, so the empty
  `infra/firestore.indexes.json` is correct. Revisit only when server-persisted
  user state (synced favorites, visited stops) is added.
- **Rollback** — Firebase Hosting retains release history. To roll back the live
  site instantly without a rebuild:
  `npx firebase-tools hosting:rollback --project temple-502523`
  (or pin a specific prior release in the Hosting console). Firestore rules are
  versioned in-repo, so a rules rollback is a normal `git revert` + redeploy.

## Notes

- Region stays `asia-south1` (D1) — immutable; CDN fronts static content for the
  "hosted from US" business need.
- Payments remain out of scope for v1 (D2); donations link out. No Stripe/PCI
  surface to review yet.
