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
- **Content-Security-Policy** — global CSP locking `default-src` to `'self'`,
  `object-src`/`frame-ancestors`/`base-uri` down, `img-src`/`media-src`/
  `connect-src` to `'self'` + `storage.googleapis.com` (the media bucket), and
  `upgrade-insecure-requests`. `script-src`/`style-src` retain `'unsafe-inline'`
  because a Next static export emits inline hydration scripts with no runtime to
  nonce — see the hardening note below for the upgrade path.
- **PWA icons** — `manifest.webmanifest` ships the source SVG plus rasterised
  `192×192` and `512×512` maskable PNGs (generated from the SVG by
  `pnpm --filter @temple/content icons`), satisfying Lighthouse installability.
- **CI gate** — content validation + translation QA + unit tests + web build +
  mobile typecheck must pass on every PR.
- **Performance budget** — `apps/web/scripts/check-budget.mjs` runs in CI after
  the web build and fails the PR if the largest JS chunk, total JS (gzip), or
  largest prerendered HTML exceeds its ceiling. Zero-dependency (Node's gzip).

## Outstanding before the Phase 5 gate

1. **CSP script/style hardening** — the CSP is live but `script-src`/`style-src`
   still allow `'unsafe-inline'` (static-export constraint). Upgrade path:
   post-process the exported HTML to compute per-file SHA-256 **hashes** of the
   inline scripts and emit them either as a per-page `<meta>` CSP or a build-time
   header map, dropping `'unsafe-inline'` for scripts. Needs a build+deploy to
   verify end-to-end.
2. **Lighthouse CI (optional upgrade)** — an asset-size budget already gates CI
   (see Ready). A full Lighthouse CI run against the export would additionally
   catch runtime regressions (LCP, CLS, a11y) the byte-budget can't see.
3. **Firestore composite indexes** — `infra/firestore.indexes.json` is present;
   confirm it matches the queries the favorites/visited features actually issue
   before launch.
4. **Custom domain + CDN cache invalidation** — confirm the production domain,
   its HSTS-preload submission, and the deploy's cache-busting behavior for HTML
   after a content update.
5. **Rollback story** — Firebase Hosting keeps release history; document the
   one-command rollback and who owns it.
6. **Monitoring** — no error/analytics wiring yet. Decide on a
   privacy-respecting analytics choice (most users in India; keep it light) and
   uptime/error alerting before launch.

## Notes

- Region stays `asia-south1` (D1) — immutable; CDN fronts static content for the
  "hosted from US" business need.
- Payments remain out of scope for v1 (D2); donations link out. No Stripe/PCI
  surface to review yet.
