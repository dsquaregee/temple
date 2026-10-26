# Store screenshots

Phone-sized screenshots of the app UI for the Google Play and App Store
listings, captured from the production web build (`apps/web/out`, the same
shared design system the native app renders) at store device dimensions.

| File prefix | Device profile | Pixels |
|---|---|---|
| `ios-6.7-*` | iPhone 6.7" (App Store) | 1290 × 2796 |
| `android-*` | Play phone | 1080 × 2400 |

Screens captured: **Discover** (catalog + circuit filters), **Yatra/circuit**
(illustrated route map), **Listen** (Carnatic music hub).

## Ready to use
Discover, Yatra and Listen are media-independent and render exactly as on
device — upload these directly (Play needs ≥2 phone screenshots; App Store
wants a 6.7" set).

## Capture the hero-card screens from a device
**Home** and the **temple detail** page lead with a hero photo served from
`media.dsquaregee.com` (Cloudflare R2). Those photos load on real devices and
in production (verified: the hero URL returns HTTP 200), but **not** inside a
sandboxed CI/dev container whose network policy blocks that host — there the
hero renders broken and its credit line overlaps the title. So those two
screens are intentionally **not** included here; capture them from a `preview`
build on a device/emulator, where the heroes load:

```
# build an installable APK / simulator build, then screenshot on-device
eas build -p android --profile preview
```

## Regenerate the web-based set
1. `pnpm build:web`
2. `PORT=4999 node apps/web/scripts/serve-out.mjs &`
3. Drive Playwright (pre-installed) over `http://localhost:4999/en/...` at the
   device viewports above and screenshot each screen (`fullPage: false`).

Apple prefers true on-device captures for final submission; these web-rendered
shots are production-accurate drafts for the media-independent screens.
