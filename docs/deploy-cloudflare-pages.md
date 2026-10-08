# Hosting on Cloudflare (Workers Static Assets, replacing Firebase)

Serves the static site from **Cloudflare** instead of Firebase Hosting, so the
whole serving path is Cloudflare (static site + R2 media) with no Google in it.
The build is unchanged (`pnpm build:web` → `apps/web/out`); only the host changes.

Uses **Cloudflare Workers Builds** (Git-connected): Cloudflare clones the repo on
each push, runs the build, and deploys the static export via `wrangler deploy`,
reading `wrangler.jsonc` at the repo root. **No API tokens or GitHub secrets** —
Cloudflare handles build + deploy, with free per-push preview URLs.

Headers/CSP/caching live in `apps/web/public/_headers` (shipped as `out/_headers`);
Workers Static Assets honors `_headers` and `_redirects`. Firebase's `deploy.yml`
stays intact so the cutover is reversible: deploy to Cloudflare, verify on the
`*.workers.dev` URL, move the domain, then retire Firebase.

---

## Part 1 — Create the project (owner, in the Cloudflare dashboard)

1. **Workers & Pages → Create application → Import a repository** (Git) → authorize
   GitHub → select **`dsquaregee/temple`**.
2. In the build configuration:
   - **Project name:** `temple` (must match `name` in `wrangler.jsonc`)
   - **Build command:** `pnpm build:web`
   - **Deploy command:** `npx wrangler deploy`
   - **Preview command:** leave blank (or `npx wrangler versions upload`)
   - **Advanced settings:** set **Production branch** to
     `claude/temple-app-phase-1-jfbtxy`; leave root directory `/`. If a Node
     version is offered, pick 20.
3. **Save and Deploy.** Cloudflare builds and deploys. Watch the build log — first
   run takes a few minutes (pnpm install + content generate + next build).

## Part 2 — Verify (no domain change yet)

4. Open the deployment URL Cloudflare gives you (`temple.<account>.workers.dev`).
   Click through a few temple pages — confirm heroes / Listen audio / video load
   (served from R2), `/en` `/ta` `/te` all render, and the browser console shows
   no CSP errors (the service worker + manifest should load).

> **Status (2026-10-08): done.** The domain is cut over and verified —
> `temples.dsquaregee.com` is served by Cloudflare (`server: cloudflare`) with
> R2 media, single-valued cache headers, and CSP/HSTS intact. Firebase Hosting
> has been retired (Part 4). The steps below are kept as the runbook of record.

## Part 3 — Cut the custom domain over (owner)

Only after Part 2 looks right:

5. Project → **Settings → Domains → Add custom domain** → `temples.dsquaregee.com`.
   (In the current dashboard the tab is just **Domains**, not "Domains & Routes".)
   DNS is already on Cloudflare, so it reconfigures the
   record automatically (proxied) and provisions the cert — **this replaces the
   Firebase CNAME**, moving the domain to Cloudflare's static-assets Worker.
6. Once it shows Active, load `https://temples.dsquaregee.com/` and a couple of
   temple pages to confirm Cloudflare is serving.

> If you still see a stale page on your own machine right after the cutover,
> hard-reload or use an incognito window (the v3 service worker self-heals).

## Part 4 — Retire Firebase Hosting (done)

- `.github/workflows/deploy.yml` (the Firebase hosting/Firestore-rules deploy) has
  been **removed** — Cloudflare Workers Builds handles deploys now.
- The Firebase project (`temples2`) is kept for when account features are added
  later; nothing in the live site uses Firestore/Auth today. Firestore rules are
  no longer auto-deployed — push them manually with
  `firebase deploy --only firestore:rules --project temples2` if you add them.

## Notes

- **Only hosting moved.** Media stays on R2; generation still uses the GCS staging
  buckets + Cloud TTS. See `docs/migrate-project.md`.
- **CSP source of truth is now `_headers`.** `firebase.json` is no longer part of
  the serving path; keep the CSP in `apps/web/public/_headers` current (the
  `apps/web/test/csp-parity.test.ts` guard still cross-checks the script-src side).
- **Config:** `wrangler.jsonc` (repo root) points Static Assets at `apps/web/out`
  and serves `404.html` for unmatched routes. Trailing-slash directories resolve
  to `index.html` natively.
- **Preview builds on PRs.** Cloudflare posts a "Deploying Preview" check on each
  PR that fails instantly (0s) — preview deployments aren't configured and aren't
  needed. It's cosmetic and never blocks: only the **production** build (on the
  production branch, after merge) deploys the live site. Ignore the red preview
  check, or turn previews off in the dashboard (Workers & Pages → the project →
  Settings → Builds) if you'd rather not see it.
