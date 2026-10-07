# Hosting on Cloudflare Pages (replacing Firebase Hosting)

Moves the static site off Firebase Hosting onto **Cloudflare Pages**, so the
whole serving path is Cloudflare (Pages + R2) with no Google in it. The build is
unchanged (`pnpm build:web` → `apps/web/out`); only where it's served changes.

`deploy-pages.yml` builds and deploys to Pages. It runs **in parallel with**
`deploy.yml` (Firebase) so nothing breaks mid-transition — you cut the domain
over to Pages only after verifying it on the `*.pages.dev` URL, then retire the
Firebase workflow.

Headers/CSP/caching are ported to `apps/web/public/_headers` (shipped as
`out/_headers`), a 1:1 copy of the `firebase.json` rules.

---

## Part 1 — Cloudflare setup (owner)

1. **Create the Pages project.** Cloudflare dashboard → **Workers & Pages →
   Create → Pages → Direct Upload** → name it **`temple`** → create (an empty
   project is fine; the Action uploads to it). Set its **production branch to
   `main`** (Pages project → Settings → Builds & deployments → Production branch),
   which is what the deploy Action targets.
2. **API token.** My Profile → **API Tokens → Create Token** → use the
   **"Edit Cloudflare Pages"** template (or a custom token with *Account →
   Cloudflare Pages → Edit*). Copy the token.
3. **Account ID.** Shown in the dashboard URL and on the Workers & Pages
   overview (right sidebar).
4. **GitHub secrets.** Repo → Settings → Secrets and variables → Actions → add:
   - `CLOUDFLARE_API_TOKEN` = the token from step 2
   - `CLOUDFLARE_ACCOUNT_ID` = the account id from step 3

## Part 2 — First deploy + verify (no domain change yet)

5. GitHub → **Actions → "Deploy to Cloudflare Pages" → Run workflow** (or it runs
   on the next push to the default branch). It builds and uploads to the `temple`
   Pages project.
6. Open the deployment's **`https://temple.pages.dev`** URL (or the
   `<hash>.temple.pages.dev` the run prints). Click through a few temple pages —
   confirm the hero photos, Listen audio, and video load (these come from R2), and
   that `/en`, `/ta`, `/te`, etc. all render. The service worker and manifest
   should load without CSP errors (check the browser console).

## Part 3 — Cut the custom domain over (owner)

Only after Part 2 looks right:

7. Pages project → **Custom domains → Set up a custom domain** →
   `temples.dsquaregee.com` → follow the prompt. Because DNS is already on
   Cloudflare, it reconfigures the record automatically (proxied) and provisions
   the cert — **this replaces the Firebase CNAME**, moving the domain to Pages.
8. Wait for the domain to show **Active**, then load
   `https://temples.dsquaregee.com/` and a couple of temple pages to confirm
   it's being served by Pages now.

> The v3 service worker already handles cache invalidation, but if you still see
> a stale page on your own machine right after the cutover, hard-reload or use an
> incognito window (same as the earlier migration).

## Part 4 — Retire Firebase Hosting (optional, after a day or two)

Once the domain has been happily on Pages for a bit:

- Delete `.github/workflows/deploy.yml` (the Firebase deploy), or leave it as a
  warm fallback — it keeps publishing to `temples2.web.app`, which is harmless.
- You can keep the Firebase project around (Firestore `temple` db, Auth) for
  when you add account features later; nothing in the live site uses it today.

## Notes

- **Only hosting moves.** Media still serves from R2, generation still uses the
  GCS staging buckets + Cloud TTS. See `docs/migrate-project.md`.
- **Headers parity.** While both hosts run, keep `_headers` and the `firebase.json`
  headers in sync (the CSP especially — `apps/web/test/csp-parity.test.ts` guards
  the script-src side).
- **Trailing slashes.** The export uses `trailingSlash: true` (directory +
  `index.html`); Pages serves these natively. If any `/path` (no slash) 404s
  instead of redirecting to `/path/`, add a `public/_redirects` rule — not
  expected, but easy if needed.
