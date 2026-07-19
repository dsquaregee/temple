# Infrastructure (Firebase / GCP)

Backend surface for v1 is deliberately small: static content on a global CDN,
anonymous auth, and Firestore for **user state only**. There are no payments in
v1 (decision D2) and no server-rendered content — every temple and circuit page
is pre-built static HTML (decision D3).

## Files

Firebase requires `firebase.json` at the **repo root** (Hosting's `public`
directory must live inside the config's directory), so the config lives at the
root and references the rules/indexes here in `infra/`.

| File | Purpose |
|---|---|
| `../firebase.json` (repo root) | Hosting (serves `apps/web/out`) + CDN cache headers; Firestore rules/indexes wiring (targets the `temple` database); local emulator ports. |
| `../.firebaserc` (repo root) | Project alias (`temple-502523`). |
| `firestore.rules` | Users read/write **only their own** `/users/{uid}` tree; everything else denied. |
| `firestore.indexes.json` | No composite indexes needed yet (user docs are read by id). |

## Database — the named `temple` database (asia-south1)

This project uses a **named** Firestore database, `temple`, in `asia-south1`
(not the conventional `(default)`). `firebase.json` targets it explicitly, and
app code that reads user state must select it, e.g.
`getFirestore(app, 'temple')`.

## Region — asia-south1 (Mumbai), immutable (D1)

Firestore location is chosen **once at database creation and can never be
changed**. It is set in the Google Cloud console / CLI when the database is
first created, not in this repo:

```bash
gcloud firestore databases create --location=asia-south1
```

Most users are in India; a US-east database would add 150–300 ms to every
dynamic read. Static content still reaches the world quickly because Firebase
Hosting sits behind Google's global CDN — the cache headers in `firebase.json`
make temple pages `immutable`/long-lived at the edge, satisfying the
"hosted from the US / fast everywhere" business need without moving the
database.

## Caching strategy (firebase.json headers)

- `/_next/static/**` and hashed assets → `max-age=31536000, immutable`.
- HTML → `max-age=0, s-maxage=86400, stale-while-revalidate=604800`: browsers
  revalidate, but the CDN serves instantly and refreshes in the background.
- `sw.js` → `no-store` so clients always pick up a new service worker.

## Auth

Anonymous sign-in is the default (browse with no account). An anonymous user
can later be **linked** to a real account without losing their saved state.
Sign-in is only surfaced when a feature needs it (saving progress, syncing
downloads).

## Web client configuration (cross-device saved temples)

The web app's saved-temples feature works fully **offline-first from
localStorage with no configuration**. When the Firebase web config is present,
it *additionally* mirrors saves to Firestore under an anonymous auth uid so a
devotee's saves follow them across devices. Config travels as build-time
`NEXT_PUBLIC_*` env vars baked into the static bundle (the standard, safe way to
ship Firebase web config — these keys only identify the project; access is
enforced by `firestore.rules`, not secrecy). See `apps/web/.env.example`:

| Var | Purpose |
|---|---|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase web API key. |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | e.g. `temple-502523`. |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Web app id from the console. |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Optional; defaults to `<projectId>.firebaseapp.com`. |

If any required var is missing, `firebaseConfig()` returns `null` and the app
stays local-only — so previews, local dev, and CI need no secrets. The Firebase
SDK is dynamically imported only when config is present, keeping it off the
critical-path bundle.

**User-state document shape** (in the `temple` database, matching
`firestore.rules`): `users/{uid}` → `{ savedTemples: string[], updatedAt }`.
`savedTemples` holds temple ids. First cross-device contact unions the local and
remote sets so no existing save is lost.

## Deploy

Run from the **repo root** (where `firebase.json` lives):

```bash
# 1. Build the static web export (writes apps/web/out)
pnpm build:web

# 2. Deploy hosting + rules
firebase deploy --only hosting,firestore:rules
```

Non-interactive / CI (service account):

```bash
GOOGLE_APPLICATION_CREDENTIALS=/path/to/sa-key.json \
  firebase deploy --only hosting,firestore:rules --project temple-502523 --non-interactive
```

Local development against emulators:

```bash
firebase emulators:start
```

## Live

- Firebase default domain: https://temple-502523.web.app
- Production custom domain: https://temples.dsquaregee.com (DNS in Cloudflare)
- Firestore rules: released to the `temple` (asia-south1) database.

## Custom domain — temples.dsquaregee.com via Cloudflare

Firebase drives the flow (it verifies ownership and provisions its own SSL
cert); Cloudflare just holds the DNS records.

1. **Firebase Console** → project `temple-502523` → **Hosting → Add custom
   domain** → enter `temples.dsquaregee.com`.
2. Firebase shows a **TXT** verification record. In **Cloudflare → DNS →
   Records**, add it exactly (Name + Value), then click **Verify** in Firebase.
3. Firebase then shows the records that point the subdomain at Hosting. Add them
   in Cloudflare exactly as shown — for a subdomain this is either:
   - a **CNAME**: `temples` → `temple-502523.web.app`, or
   - the **A records** Firebase lists (two IPs).
4. **Set Proxy status to "DNS only" (grey cloud)** on these records so Firebase
   can provision SSL. (You may switch to the orange proxy afterward if you want
   Cloudflare in front — Firebase already has a global CDN, so this is optional.)
5. **Cloudflare → SSL/TLS → Overview → set mode to `Full`** (or Full (strict)).
   Never use **Flexible** — it causes redirect loops with Firebase's forced
   HTTPS.
6. Wait for Firebase status to go **Pending → Connected** (minutes to ~24h).

After the domain is connected, `metadataBase` in `apps/web/app/layout.tsx` is
already set to `https://temples.dsquaregee.com`, so canonical/hreflang URLs are
correct on the next deploy.

## Not in this repo (set up in the GCP/Firebase console)

- Creating the Firebase project and the `asia-south1` Firestore database.
- Enabling Anonymous auth (and later Google/Apple for account linking).
- Adding the custom domain (steps above) — SSL is issued automatically.
