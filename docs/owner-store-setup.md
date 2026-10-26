# Owner setup — publishing Temple to Google Play & the Apple App Store

A linear, do-this-then-that checklist for the **account, payment, credential, and
submission** work that only the owner (dsquaregee) can do. The engineering is
already done and verified — the app is an Expo/React-Native build
(`apps/mobile`, bundle id / package **`com.dsquaregee.temple`**) wired to EAS
Build + EAS Submit.

This guide is the *human* half. For the *build* half (the one-click GitHub
Action, `eas build`, `eas submit`, version bumps) see **`docs/store-release.md`** —
it is referenced at each point below. The web PWA is already live at
`temples.dsquaregee.com` and needs no store.

> **Legend:** 🧑 = only the owner can do it (login, payment, identity).
> 💻 = a developer/CI step, documented in `store-release.md`.
> ⏱ = expect a wait (review, verification, or a fixed testing window).

---

## 0. Decide: personal vs. organization account

Do this first, because it changes identity verification and timelines.

- **Apple** — registering as an **Organization** (recommended for a brand like
  dsquaregee) requires a **D-U-N-S number** for the legal entity (free from
  Dun & Bradstreet, ⏱ can take 1–2 weeks if you don't already have one) and a
  legal entity name that matches. A personal/individual account uses your own
  name and no D-U-N-S, but the app shows **your name** as the seller.
- **Google Play** — choose **Organization** account type if dsquaregee is a
  registered business. Note the requirement in §2: brand-new **personal** Play
  accounts must run a 14-day closed test with ≥12 testers before they can ship
  to production. **Organization** accounts are exempt. If dsquaregee is a
  company, register as an organization to skip that gate.

Pick the same identity for both stores. If you need the D-U-N-S number, **start
that application today** — everything else can proceed in parallel.

---

## 1. Apple — one-time account & identity 🧑 ⏱

1. Go to **developer.apple.com** and sign in with the Apple ID that will own the
   app (use a shared company Apple ID you control, not a personal one you might
   lose access to).
2. Enrol in the **Apple Developer Program** — **US$99 / year**. Organization
   enrolment asks for the D-U-N-S number and legal entity details; Apple verifies
   these (⏱ a few days, occasionally longer).
3. Once approved, open **App Store Connect** (appstoreconnect.apple.com) and
   accept the latest **Paid Apps / Free Apps agreements** under *Agreements, Tax,
   and Banking*. The app can't go live until the agreement is active. (Temple is
   free, so no banking details are required, but the Free Apps agreement must be
   accepted.)

---

## 2. Google Play — one-time account & identity 🧑 ⏱

1. Go to **play.google.com/console** and sign in with the Google account that
   will own the app.
2. Pay the **one-time US$25** registration fee.
3. Complete **identity/organization verification** (Google now requires a
   verified name, address, and — for organizations — a D-U-N-S number and
   official contact). ⏱ Verification can take a few days.
4. Note the **personal-account testing gate**: if this ends up a *personal*
   account, you must complete a **closed test with at least 12 testers opted in
   for 14 continuous days** before Google will let you promote to production.
   Plan for this two-week window, or register as an **organization** to avoid it.

---

## 3. Create the two app records 🧑

**Apple — App Store Connect → My Apps → ➕ → New App:**
- Platform **iOS**, Name **Temple — South India temples**, Primary language
  **English (U.S.)**, Bundle ID **`com.dsquaregee.temple`** (pick it from the
  list — see §4 for registering it), SKU any unique string (e.g. `temple-ios`).

**Google Play — Play Console → Create app:**
- App name **Temple — South India temples**, default language **English (US)**,
  **App** (not game), **Free**. Accept the declarations. The package name
  **`com.dsquaregee.temple`** is set by the first upload, not typed here.

---

## 4. Generate the credentials the build needs 🧑 → hand to 💻

These are the keys EAS uses to upload builds for you. Create them once; they are
**git-ignored** and must never be committed.

### Apple — App Store Connect API key
1. App Store Connect → **Users and Access → Integrations → App Store Connect API
   → ➕**. Create a **Team key** with role **App Manager** (or Admin).
2. **Download the `.p8` file — you can only download it once.** Save it to
   `apps/mobile/asc-api-key.p8`.
3. Copy the **Key ID** and the **Issuer ID** shown on that page.
4. Register the bundle id: **developer.apple.com → Certificates, IDs & Profiles
   → Identifiers → ➕ → App IDs → App**, description "Temple", Bundle ID
   **explicit** `com.dsquaregee.temple`. (EAS can also create this for you on the
   first iOS build; doing it here just lets you pick it in §3.)
5. Signing certificates and provisioning profiles are **generated and stored by
   EAS** on the first iOS build — let EAS manage them. The one caveat: the first
   time, run `eas credentials` (or the first `eas build -p ios`) **from a machine
   logged in to the Apple Developer account**, because CI can't log in to Apple
   interactively (`store-release.md` §3, step 3).

### Google Play — service account JSON
1. In **Play Console → Setup → API access**, link a Google Cloud project and
   **create a service account** (this opens Google Cloud IAM).
2. In Google Cloud, create a **JSON key** for that service account and download
   it to `apps/mobile/play-service-account.json`.
3. Back in Play Console → API access, **grant** that service account access with
   permission to **manage releases** (Admin or a release role).

> Before Play will accept an API upload at all, you must upload **one `.aab`
> manually** to create the app's first release (Play's long-standing
> "bootstrap" requirement). The first production build from §6 covers this — do
> the very first upload by hand in the Play Console, then `eas submit` works for
> every release after.

### Hand the four Apple values + two files to CI 💻
To use the **one-click GitHub Action** instead of a local machine, add these repo
secrets (**Settings → Secrets and variables → Actions**), per `store-release.md` §3:
- `EXPO_TOKEN` (from expo.dev → Account → Access tokens) — **required for any
  build**.
- Android submit: `PLAY_SERVICE_ACCOUNT_JSON` (paste the JSON file contents).
- iOS submit: `ASC_API_KEY_P8` (the `.p8` contents), `ASC_API_KEY_ID`,
  `ASC_API_KEY_ISSUER_ID`.

---

## 5. Fill in the store listings 🧑

The text is already written and kept in the repo — copy it in, don't rewrite it:

- **iOS listing text** lives in `apps/mobile/store.config.json` and can be pushed
  automatically with `eas metadata:push` (💻), or pasted into App Store Connect.
- **Play listing text** is in `docs/store-release.md` §5 (title, short & full
  description).
- **Privacy policy URL** (required by both): **`https://temples.dsquaregee.com/privacy/`**
  — already live.
- **Category:** Travel (primary) / Education. **Price:** Free.

**Graphics you must create outside the repo** 🧑 (`store-release.md` §5):
- **Play:** 512×512 icon (`apps/mobile/assets/icon.png`), a **1024×500 feature
  graphic**, and **≥2 phone screenshots**.
- **App Store:** 1024×1024 icon (upload in App Store Connect), plus screenshots
  for a **6.7″** and a **6.5″/5.5″** iPhone.
- Capture real screenshots from a **preview build** on a device/emulator
  (`eas build -p android --profile preview` → installable APK; or an iOS
  Simulator build) — store screenshots must show the actual app UI.

**Privacy questionnaires — answer "no data collected" for both** (Temple has no
accounts, no ads, no analytics; saved temples live on-device; audio is streamed):
- Play → **Data safety**: *No data collected / No data shared.*
- Apple → **App Privacy**: *Data Not Collected.*
- Play **content rating** (IARC questionnaire): reference/education, no
  objectionable content → Everyone / PEGI 3.
- **Target audience:** general audience, not directed at children.

---

## 6. Build, submit, and send for review ⏱

**Build** (💻, `store-release.md` §3) — the easiest path is
**GitHub → Actions → "Build mobile app (EAS)" → Run workflow**, platform **all**,
profile **production**. Or locally from `apps/mobile`:
`eas build --platform all --profile production`. EAS assigns fresh build numbers
automatically (remote versioning).

**First-ever Play upload** 🧑 — download the resulting `.aab` from expo.dev and
upload it once by hand in **Play Console → your app → Testing → Internal testing
→ Create release** (satisfies the bootstrap requirement in §4).

**Submit** (💻, `store-release.md` §4):
- `eas submit --platform android --profile production` → pushes to the Play
  **internal** track as a **draft**.
- `eas submit --platform ios --profile production` → pushes to **App Store
  Connect / TestFlight**.

**Then, in each console** 🧑:
- **Apple:** attach the build to the app version, finish the listing + App
  Privacy, and **Submit for Review**. ⏱ Review is typically a day or two. Use
  **TestFlight** first to try it on real devices.
- **Google:** promote the build from **internal testing** up through **closed →
  open →** **production** (personal accounts: complete the 14-day / 12-tester
  closed test first, §2). Complete Data safety + content rating, then **roll out
  to Production**. ⏱ First review can take a few days.

---

## 7. Future releases (after the first launch)

1. Edit `apps/mobile/app.json` → raise **`version`** (e.g. `1.0.1`) for a
   user-visible change. Build numbers increment automatically — don't touch them.
2. Rebuild + resubmit (same one-click Action, or `eas build` then `eas submit`).
3. The **PWA needs no store step** — it redeploys to Cloudflare on merge to the
   default branch, and the service worker updates returning visitors.

---

## One-page checklist

| # | Step | Who | Cost | Wait |
|---|---|---|---|---|
| 0 | Choose personal vs org; start D-U-N-S if org | 🧑 | free | ⏱ 0–2 wk |
| 1 | Apple Developer Program enrolment | 🧑 | $99/yr | ⏱ days |
| 2 | Google Play Console registration + verification | 🧑 | $25 once | ⏱ days |
| 3 | Create the two app records (`com.dsquaregee.temple`) | 🧑 | — | — |
| 4 | ASC API key `.p8` + Play service-account JSON + repo secrets | 🧑→💻 | — | — |
| 5 | Paste listings (repo), make graphics, "no data collected" | 🧑 | — | — |
| 6 | Build (Action), first manual Play upload, submit, send to review | 🧑+💻 | — | ⏱ days |
| 7 | Future releases: bump `version`, rebuild, resubmit | 🧑+💻 | — | ⏱ days |

Everything in the repo (EAS profiles, submit config, listing text, privacy
policy, icons) is already in place. The critical-path blockers are the **paid
accounts and their identity verification** (and, if org, the **D-U-N-S number**)
— begin those first; the rest follows in a day.
