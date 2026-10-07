# Migrating to a new GCP / Firebase project

> **Status (2026-10-07): executed once — `temple-502523` → `temples2`.** Repo
> retargeted (`infra/migrate-project.mjs --to temples2`), Firestore `temples2`
> database created in `asia-south1`, and all media regenerated into the
> `temples2-media` / `temples2-audio` buckets (audio 101×6, heroes 92,
> AVIF/WebP/OG variants, narrated video 78×6) — all verified live. The work sits
> on PR #40; the production publish (merge → `deploy.yml`) + the
> `temples.dsquaregee.com` DNS repoint remain owner steps. This runbook is kept
> generic for any future migration.

Use this when the current project must be replaced — e.g. it was
locked/suspended and a fresh project is needed. The repo is parameterised so the
**code side is a single command**; the **GCP side needs the owner's Google
credentials** (project + buckets + service-account key can't be created from CI or
an agent session).

Everything the app serves — the static web export (Firebase Hosting), the hero /
video / OpenGraph images (`<project>-media` bucket), and the narration audio
(`<project>-audio` bucket) — is pinned to the project id in exactly three string
forms, baked across `.firebaserc`, the workflows, and ~600 content JSON files
(every `hero`/`video`/`audio` URL). `infra/migrate-project.mjs` rewrites all of
them at once.

> **Nothing here deletes or weakens the locked project.** A new project is
> additive. Keep the old one around until the new one is verified live.

---

## Part A — Owner steps in GCP / Firebase (needs the owner's Google login)

These cannot be automated from this repo; they mint the credentials everything
else depends on. Pick a new project id up front — these docs use `NEW_PROJECT_ID`.

1. **Create the project.** Firebase console → *Add project* (or
   `firebase projects:create NEW_PROJECT_ID`). Upgrade it to the **Blaze** plan
   (required for the named Firestore DB and for Hosting custom domains).

2. **Firestore.** Create a Firestore database in **Native mode** in region
   **`asia-south1` (Mumbai)** — this matches locked decision **D1**; the region is
   immutable, so set it correctly now. The database ID is cosmetic (no app code
   depends on it); whatever you name it, set `firestore[].database` in
   `firebase.json` to match. (The current project uses database id `temples2`.)
   Enable **Anonymous** sign-in under Authentication.

3. **Storage buckets.** Create two GCS buckets. Keep the naming convention so the
   codemod's defaults apply:
   - `NEW_PROJECT_ID-media` — heroes, videos, OG cards
   - `NEW_PROJECT_ID-audio` — narration MP3s
   Make objects publicly readable (the app fetches them by public URL;
   `allUsers` → *Storage Object Viewer*, matching the old setup). If you must use
   different bucket names, pass them to the codemod via `--media-bucket` /
   `--audio-bucket` in Part B.

4. **Service-account key.** Create (or reuse) a service account with
   **Firebase Admin**, **Firebase Hosting Admin**, and **Storage Admin**, and
   download a JSON key. This replaces the old `FIREBASE_SERVICE_ACCOUNT`.

5. **GitHub secret.** In the repo → *Settings → Secrets and variables → Actions*,
   set **`FIREBASE_SERVICE_ACCOUNT`** to the full contents of that JSON key.
   (The deploy, media, audio, and hero-variants workflows all read this one
   secret.) Nothing is committed — the key never enters git.

6. **Custom domain** (optional, after first deploy verifies): in the new project's
   Hosting, add `temples.dsquaregee.com` and update the DNS record at the
   registrar to the value Firebase shows. Allow for propagation + the CDN
   `stale-while-revalidate` window before the domain fully cuts over.

---

## Part B — Retarget the repo (one command, no credentials needed)

From a clean checkout of the production branch:

```bash
# Preview first — writes nothing, prints per-file counts:
node infra/migrate-project.mjs --to NEW_PROJECT_ID --dry-run

# Apply:
node infra/migrate-project.mjs --to NEW_PROJECT_ID
```

This rewrites, in one pass (defaults assume `NEW_PROJECT_ID-media` /
`NEW_PROJECT_ID-audio`):

- `.firebaserc` → `projects.default`
- `.github/workflows/deploy.yml` → `--project` and header comment
- `.github/workflows/{audio,media,hero-variants}.yml` → `*_BUCKET` env values
- every `packages/content/data/**/*.json` → `hero`/`video`/`audio` URLs
- the docs that reference the project/buckets

Non-standard bucket names:

```bash
node infra/migrate-project.mjs --to NEW_PROJECT_ID \
  --media-bucket my-media-bucket --audio-bucket my-audio-bucket
```

Verify and commit:

```bash
# Three files keep the old id ON PURPOSE (this codemod, this runbook, and the
# CLAUDE.md "was locked" history note); exclude them from the leftover check:
grep -rln "temple-502523" . --exclude-dir=.git --exclude-dir=node_modules \
  | grep -vE '^\./(infra/migrate-project\.mjs|docs/migrate-project\.md|CLAUDE\.md)$' || echo clean
pnpm install --frozen-lockfile
pnpm -w build && pnpm -w test
git add -A && git commit -m "infra: retarget to NEW_PROJECT_ID"
git push
```

No CSP change is needed: `firebase.json` allows `https://storage.googleapis.com`
at the host level (not a specific bucket), so renaming the buckets keeps
`img-src`/`media-src`/`connect-src` valid.

---

## Part C — Move the media/audio objects into the new buckets

The content URLs now point at the new buckets, but those buckets are empty until
the files are there. Two options:

**C1 — Copy the existing objects (fast, if the old buckets are still readable).**
If `temple-502523-*` is only locked for billing/console but the objects are still
accessible to a service account you control:

```bash
gcloud storage cp -r gs://temple-502523-media/* gs://NEW_PROJECT_ID-media/
gcloud storage cp -r gs://temple-502523-audio/* gs://NEW_PROJECT_ID-audio/
```

**C2 — Regenerate from source (if the old buckets are gone).** Re-run the media
and audio pipelines against the new project. They read `FIREBASE_SERVICE_ACCOUNT`
(set in Part A) and the `*_BUCKET` env the codemod already updated:

```bash
# Narration (all temples, all locales):
gh workflow run audio.yml --ref <production-branch>

# Heroes + videos — ONE run at a time (see docs/media/hero-backfill.md):
gh workflow run media.yml --ref <production-branch> -f only="<ids>" -f resume=true
gh workflow run hero-variants.yml --ref <production-branch> -f only="<ids>"
```

> **Dispatch media runs one at a time.** Two runs in the `media-generation`
> concurrency group collide (newer cancels older; a finishing run fails its push).
> This bit us during the hero backfill — see `docs/media/hero-backfill.md`.

The 9 placeholder temples with no Commons photo stay on their branded placeholder
(same as before the migration) — no action needed.

---

## Part D — Deploy & verify

Pushing to the production branch triggers `deploy.yml`, which builds the static
export and deploys Hosting + Firestore rules to the new project. Then verify:

```bash
# Web app live on the new project:
curl -s -o /dev/null -w "%{http_code}\n" https://NEW_PROJECT_ID.web.app/en/

# A media object resolves in the new bucket:
curl -s -o /dev/null -w "%{http_code}\n" \
  "https://storage.googleapis.com/NEW_PROJECT_ID-media/heroes/brihadeeswarar.jpg"

# An audio object resolves:
curl -s -o /dev/null -w "%{http_code}\n" \
  "https://storage.googleapis.com/NEW_PROJECT_ID-audio/audio/en/brihadeeswarar.mp3"
```

Open a few temple pages and confirm the hero photo, Listen audio, and video all
load. Once the custom domain (Part A.6) is cut over, repeat the checks against
`https://temples.dsquaregee.com/`.

## Mobile apps

The Expo apps (`apps/mobile`) read the same public media URLs from the content
package, so the codemod updates them automatically. If a native build embeds the
Firebase project config (e.g. `google-services.json` / `GoogleService-Info.plist`
for a future Firebase SDK integration), regenerate those from the new project and
bump the build number before the next store submission — see `docs/store-release.md`.

---

## Disaster recovery — surviving a project lock without re-generating media

The slow part of the `temple-502523 → temples2` recovery was the media: the old
buckets were locked (403), so nothing could be copied and all 600+ objects had
to be re-generated from source (hours of CI). Code and content were never at
risk (they live in GitHub). To make a future lock a minutes-not-hours event,
keep an **off-Google copy of the media** and know the restore path.

### The backup — `.github/workflows/backup-media-r2.yml`

A scheduled job (weekly + manual dispatch) mirrors `temples2-media` and
`temples2-audio` to **Cloudflare R2** with `rclone sync` (incremental — only
changed objects move). R2 is independent of GCP and has $0 egress, so it also
works as a primary CDN origin if you ever want to cut bandwidth cost.

One-time setup:

1. **Cloudflare → R2** → create two buckets: `temples2-media-backup`,
   `temples2-audio-backup`.
2. **R2 → Manage API Tokens** → create a token with **Object Read & Write** →
   note the **Access Key ID**, **Secret Access Key**, and your **Account ID**
   (the R2 S3 endpoint is `https://<account-id>.r2.cloudflarestorage.com`).
3. **GitHub → Settings → Secrets and variables → Actions** → add
   `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`.
   (`FIREBASE_SERVICE_ACCOUNT` is already set and grants the GCS read side.)
4. Run it once: **Actions → "Backup media to Cloudflare R2" → Run workflow**
   (optionally with `dry_run` first to preview). After it succeeds, the two R2
   buckets hold a full copy that the weekly schedule keeps current.

### The restore — if the GCP project is ever locked again

The media already exists in R2, so recovery is a copy, not a rebuild. Stand up
the new project with **Part A–B** above (codemod + buckets), then pick one:

**R1 — rehydrate the new GCS buckets from R2** (keeps serving from GCS):
```bash
# Same rclone remotes the backup workflow configures (gcs: and r2:):
rclone sync r2:temples2-media-backup gcs:<NEW_PROJECT_ID>-media --fast-list --transfers 16
rclone sync r2:temples2-audio-backup gcs:<NEW_PROJECT_ID>-audio --fast-list --transfers 16
```
Then make the new buckets public (Part A.3) and deploy (Part B–D). No
re-generation, no Commons/TTS dependency — minutes.

**R2 — serve media straight from R2** (fastest; also the cost-saving option):
Expose the R2 buckets on a public domain (R2 → Settings → Public access, or a
custom domain like `media.dsquaregee.com`), then run the codemod pointing the
media host at R2 instead of a GCS bucket and redeploy. Hosting/Firestore can be
rebuilt separately; the images/audio/video never go dark.

### Beyond media

- **Hosting** is a static export, so it also deploys to **Cloudflare Pages** /
  Netlify / GitHub Pages in minutes — keep one as a warm standby if you want
  hosting to survive a Firebase outage too.
- **Firestore**: content-only v1 has no durable user data (decision D2). When
  accounts/favorites sync to Firestore later, add scheduled Firestore exports to
  a bucket and mirror those to R2 with the same job.
- **Prevention**: set GCP **billing alerts**, keep a valid payment method, answer
  Google verification emails promptly, and avoid bursting heavy new workloads on
  a brand-new unverified project (a likely trigger of the original lock).
