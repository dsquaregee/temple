# Infrastructure (Firebase / GCP)

Backend surface for v1 is deliberately small: static content on a global CDN,
anonymous auth, and Firestore for **user state only**. There are no payments in
v1 (decision D2) and no server-rendered content — every temple and circuit page
is pre-built static HTML (decision D3).

## Files

| File | Purpose |
|---|---|
| `firebase.json` | Hosting (serves `apps/web/out`) + CDN cache headers; Firestore rules/indexes wiring; local emulator ports. |
| `firestore.rules` | Users read/write **only their own** `/users/{uid}` tree; everything else denied. |
| `firestore.indexes.json` | No composite indexes needed yet (user docs are read by id). |
| `.firebaserc` | Project alias — replace `temple-app` with the real GCP project id. |

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

## Deploy

```bash
# 1. Build the static web export (writes apps/web/out)
pnpm build:web

# 2. From this directory, deploy hosting + rules
cd infra
firebase deploy --only hosting,firestore:rules
```

Local development against emulators:

```bash
cd infra
firebase emulators:start
```

## Not in this repo (set up in the GCP/Firebase console)

- Creating the Firebase project and the `asia-south1` Firestore database.
- Enabling Anonymous auth (and later Google/Apple for account linking).
- Custom domain + SSL for Hosting.
