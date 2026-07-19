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
- **PWA icons** — `manifest.webmanifest` ships the source SVG plus rasterised
  `192×192` and `512×512` maskable PNGs (generated from the SVG by
  `pnpm --filter @temple/content icons`), satisfying Lighthouse installability.
- **CI gate** — content validation + translation QA + unit tests + web build +
  mobile typecheck must pass on every PR.
- **Performance budget** — `apps/web/scripts/check-budget.mjs` runs in CI after
  the web build and fails the PR if the largest JS chunk, total JS (gzip), or
  largest prerendered HTML exceeds its ceiling. Zero-dependency (Node's gzip).

## Outstanding before the Phase 5 gate

1. **CSP style-src hardening (optional)** — inline scripts are now hash-pinned
   (see Ready); `style-src` still allows `'unsafe-inline'` because Next injects
   inline styles that are harder to enumerate and far lower risk than script
   injection. Hashing or externalising them would close the last `unsafe-inline`.
2. **Lighthouse CI (optional upgrade)** — an asset-size budget already gates CI
   (see Ready). A full Lighthouse CI run against the export would additionally
   catch runtime regressions (LCP, CLS, a11y) the byte-budget can't see.
3. **Monitoring** — no error/analytics wiring yet. Recommended default:
   **Cloudflare Web Analytics** (DNS is already on Cloudflare) — privacy-first,
   cookieless, and **zero code / zero CSP change** when enabled at the Cloudflare
   dashboard, so it doesn't touch the strict `script-src`. An in-app tool (e.g.
   GA4, Sentry) would instead need a `script-src`/`connect-src` allowance. Owner
   to pick before launch.

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
