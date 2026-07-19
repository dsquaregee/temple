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
- **CI gate** — content validation + translation QA + unit tests + web build +
  mobile typecheck must pass on every PR.

## Outstanding before the Phase 5 gate

1. **Content-Security-Policy** *(highest priority)* — not yet set. A Next static
   export emits inline bootstrap scripts with no runtime to attach a nonce, so a
   strict `script-src 'self'` would break hydration. The correct approach is to
   compute per-build script **hashes** at export time and emit a hashed CSP as a
   `firebase.json` header (plus `img/media-src` allowing
   `https://storage.googleapis.com`, `frame-ancestors 'none'`). Tracked
   separately because it needs a build+deploy to verify end-to-end.
2. **PWA icons** — `manifest.webmanifest` ships only `icon.svg`. Lighthouse
   installability wants raster `192×192` and `512×512` maskable PNGs; generate
   them in the existing `sharp` media pipeline.
3. **Lighthouse/perf budget in CI** — the design promises "designed-in"
   performance (AVIF LCP, system Indic fonts, zero CLS). Add a Lighthouse CI run
   (or asset-size budget) against the built export so regressions fail the PR.
4. **Firestore composite indexes** — `infra/firestore.indexes.json` is present;
   confirm it matches the queries the favorites/visited features actually issue
   before launch.
5. **Custom domain + CDN cache invalidation** — confirm the production domain,
   its HSTS-preload submission, and the deploy's cache-busting behavior for HTML
   after a content update.
6. **Rollback story** — Firebase Hosting keeps release history; document the
   one-command rollback and who owns it.
7. **Monitoring** — no error/analytics wiring yet. Decide on a
   privacy-respecting analytics choice (most users in India; keep it light) and
   uptime/error alerting before launch.

## Notes

- Region stays `asia-south1` (D1) — immutable; CDN fronts static content for the
  "hosted from US" business need.
- Payments remain out of scope for v1 (D2); donations link out. No Stripe/PCI
  surface to review yet.
