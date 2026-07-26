# Store release runbook — PWA · Google Play · App Store

Temple ships as **three separate apps from one monorepo**, sharing `packages/core`
(schema, i18n, discovery/search logic) and `packages/content` (the catalog):

| Target | Source | Output | Distribution |
|---|---|---|---|
| **PWA** (web) | `apps/web` (Next.js static export) | `apps/web/out` | Firebase Hosting → `temples.dsquaregee.com` (auto-deploy on merge to the default branch) |
| **Android** | `apps/mobile` (Expo RN) | `.aab` via EAS Build | Google Play |
| **iOS** | `apps/mobile` (Expo RN) | `.ipa` via EAS Build | Apple App Store |

Android and iOS are the **same Expo codebase** producing **two separate store
apps** (bundle id / package `com.dsquaregee.temple`). This is the intended
architecture (decision D3: one shared TypeScript core, native apps per platform).

Everything in the repo is configured and verified. The remaining steps need
owner accounts and credentials and are called out as **[owner]** below.

---

## 1. PWA — already live ✅

The web app is a production, installable PWA:

- `apps/web/public/manifest.webmanifest` — `name`, `short_name`, `description`,
  `start_url`/`scope` `/`, `display: standalone`, `theme_color`,
  `background_color`, and 192/512 PNG + SVG icons marked `any maskable`.
- Service worker (`sw.js`, `no-store`) with an offline fallback page; hashed
  assets cached `immutable`; HTML served with `s-maxage` + `stale-while-revalidate`.
- Deployed automatically to Firebase Hosting on merge to the default branch.

Nothing to do — it installs from the browser ("Add to Home Screen" / install
prompt). No store review required.

---

## 2. Prerequisites (once) — [owner]

- **Expo account** and EAS CLI: `npm i -g eas-cli && eas login`.
- **Google Play**: a Play Console developer account; create the app
  `com.dsquaregee.temple`. Create a **service account** with the *Play Android
  Developer API* and grant it release permissions; download its JSON key to
  `apps/mobile/play-service-account.json` (git-ignored).
- **Apple**: an Apple Developer Program membership; in App Store Connect create
  the app with bundle id `com.dsquaregee.temple`. Create an **App Store Connect
  API key** (App Manager role); download the `.p8` to `apps/mobile/asc-api-key.p8`
  (git-ignored) and note its Key ID and Issuer ID.

Credentials (keystore, iOS certs/profiles) are generated and stored by EAS on
first build — let EAS manage them.

---

## 3. Build — [owner]

From `apps/mobile`:

```bash
# Android App Bundle (.aab) for Play
eas build --platform android --profile production

# iOS build (.ipa) for the App Store
eas build --platform ios --profile production

# (or both)  eas build --platform all --profile production
```

Profiles are in `eas.json`. `production` builds an **app-bundle** on Android;
`preview` builds an installable **APK** for device testing. `appVersionSource`
is `local`, so the release version comes from `app.json`:
`version` `1.0.0`, `android.versionCode` `1`, `ios.buildNumber` `1`. **Bump these
for every subsequent upload** (Play rejects a re-used `versionCode`; App Store a
re-used `buildNumber`).

The gitignored generated catalog (`packages/content/src/generated.ts`) is rebuilt
automatically during the build by the `eas-build-post-install` hook in
`apps/mobile/package.json` — no manual step.

## 4. Submit — [owner]

```bash
eas submit --platform android --profile production   # → Play internal track, as a draft
eas submit --platform ios --profile production        # → App Store Connect / TestFlight
```

`eas.json` → `submit.production` points Android at
`play-service-account.json` (internal track, draft release) and iOS at
`asc-api-key.p8` (EAS will prompt for the Key ID / Issuer ID / App ID if not
supplied via env).

Optionally push the iOS listing text from `apps/mobile/store.config.json`:
`eas metadata:push`.

---

## 5. Store listing content

Icon/splash come from `apps/mobile/assets/` (regenerate with
`pnpm --filter @temple/mobile gen:icons` after editing the brand SVGs).

**Title:** Temple — South India temples
**Short description (Play, ≤80):** Discover South India's great temples — history, architecture & audio, in 6 languages.
**Full description:** see `apps/mobile/store.config.json` (kept identical for both stores).

**Privacy policy URL (required by both stores):**
`https://temples.dsquaregee.com/privacy/` — live, served by the web app
(`apps/web/app/privacy/page.tsx`).

**Graphics — [owner], created outside the repo:**
- Play: 512×512 icon (use `assets/icon.png`), 1024×500 feature graphic, ≥2 phone
  screenshots.
- App Store: 1024×1024 icon (App Store Connect; `assets/icon.png` is opaque, no
  alpha, as required), screenshots for 6.7" and 5.5" iPhone.
- Capture screenshots from a `preview` build on a device/emulator
  (`eas build -p android --profile preview`) or an iOS Simulator build. Real
  store screenshots must show the actual app UI.

---

## 6. Data safety / App privacy — [owner], both "no data collected"

Temple collects **no** personal data (no accounts; saved temples are stored
on-device; audio is streamed; no ads/analytics/tracking SDKs — see the privacy
policy). Answer the questionnaires accordingly:

- **Google Play → Data safety:** "No data collected" / "No data shared". No
  data types. (On-device-only storage is not "collection".)
- **Apple → App Privacy:** "Data Not Collected".
- **Play content rating (IARC):** reference/education app, no objectionable
  content → Everyone / PEGI 3.
- **Target audience:** general / not directed at children (no data collection
  regardless).

---

## 7. Version bumps for future releases

Edit `apps/mobile/app.json`: raise `version` (e.g. `1.0.1`) and increment
`android.versionCode` and `ios.buildNumber`, then rebuild + resubmit. The PWA
needs no version bump — it redeploys on merge and the service worker updates
clients automatically.
