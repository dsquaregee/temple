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

## Part 3 — Cut the custom domain over (owner)

Only after Part 2 looks right:

5. Project → **Settings → Domains & Routes → Add → Custom domain** →
   `temples.dsquaregee.com`. DNS is already on Cloudflare, so it reconfigures the
   record automatically (proxied) and provisions the cert — **this replaces the
   Firebase CNAME**, moving the domain to Cloudflare's static-assets Worker.
6. Once it shows Active, load `https://temples.dsquaregee.com/` and a couple of
   temple pages to confirm Cloudflare is serving.

> If you still see a stale page on your own machine right after the cutover,
> hard-reload or use an incognito window (the v3 service worker self-heals).

## Part 4 — Retire Firebase Hosting (optional, after a day or two)

- Delete `.github/workflows/deploy.yml` (the Firebase deploy), or leave it as a
  warm fallback publishing to `temples2.web.app` (harmless).
- Keep the Firebase project for when you add account features later; nothing in
  the live site uses Firestore/Auth today.

## Notes

- **Only hosting moves.** Media stays on R2; generation still uses the GCS staging
  buckets + Cloud TTS. See `docs/migrate-project.md`.
- **Headers parity.** While both hosts run, keep `_headers` and `firebase.json`'s
  headers in sync (the CSP especially — `apps/web/test/csp-parity.test.ts` guards
  the script-src side).
- **Config:** `wrangler.jsonc` (repo root) points Static Assets at `apps/web/out`
  and serves `404.html` for unmatched routes. Trailing-slash directories resolve
  to `index.html` natively.
