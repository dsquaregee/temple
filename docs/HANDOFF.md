# HANDOFF — continuing this work in a new session

**Read this first if you're picking up a shared conversation or a fresh cloud session.**
A cloud container is ephemeral: it starts with a clean checkout and no prior chat context,
so everything needed to continue lives here and in the two Paadal Petra docs, not in the
conversation. Last updated: 2026-11-22.

## TL;DR — where things stand

- The app is **live on Cloudflare** (`temples.dsquaregee.com`, served by Workers Static
  Assets; media/audio on R2). See `CLAUDE.md` for the full project memory — it is the
  source of truth.
- **Catalog: 520 temples × 9 locales, 32 circuits** (`node packages/content/scripts/validate.mjs`).
  The 9 locales are **ta, te, kn, ml, hi, bn, mr, or, en**. Narration audio covers **8** of
  them (all but Odia, which is text-only); Ken Burns video where ≥3 CC photos qualify
  (~211/locale — the external photo ceiling). Service worker is at **v54**.
- **All five phase gates are passed** (Research → UX → Build → Test/Harden → Deploy).
  Wave C (the 275 Paadal Petra Sthalams) is content-complete and live; the translation gate
  was owner-signed 2026-10-26 (comprehensive AI review accepted for release; an optional
  native-speaker pass is a post-launch enhancement, not a gate). Content/media provenance for
  Wave C is in the historical sections lower down and in the two Paadal Petra docs.
- **🚀 Store launch is the active workstream.** The app ships as three targets from one
  monorepo: the **PWA** (live), and **Android + iOS from the single Expo app** (`apps/mobile`,
  bundle id `com.dsquaregee.temple`). The build+submit pipeline is built and verified — see
  the "Store launch" section next and the runbook **`docs/store-release.md`**.

## Store launch — status & what's left (2026-11-22)

**Ready / verified this session:**
- Expo app with bundle id, icons, splash, adaptive icon; EAS **build and submit** profiles
  (`eas.json`); one-click `.github/workflows/eas-build.yml`; Apple listing metadata
  (`apps/mobile/store.config.json`) + live `/privacy/` page; runbook `docs/store-release.md`.
- **Clean review footprint:** the native app uses no permission-gated APIs → `permissions: []`,
  no iOS usage-description strings. `expo export` (Metro bundle) resolves cleanly.
- **Native parity brought up to the web** (PR #140): circuit maps now draw state boundaries +
  names, temple pages show a locator map, and the onboarding picker offers all 9 locales (it
  had been stuck at 6). **Native perf** (PR #141): the 500+ temple lists on Home/Discover/Listen
  are virtualized (`FlatList`) for low-end Android, and Listen's playback clock no longer
  re-renders the list. **Web fixes** (PR #142, deployed as SW v54): Listen player no longer
  re-renders the whole playlist during playback, the first ▶ tap starts audio synchronously so
  it no longer silently fails on iOS, and Discover "Clear" forgets the saved city.

**Owner-only, before the stores accept anything (`docs/store-release.md` §2):**
1. **Smoke-test a `preview` APK** (Actions → "Build mobile app (EAS)" → profile `preview`)
   before any production submit — `FlatList` scroll/keyboard can't be exercised in CI.
2. `EXPO_TOKEN` repo secret → the first EAS run prints the `projectId` to commit into
   `apps/mobile/app.json` → Apple Developer + Play Console accounts and their API keys.
3. Then: EAS production build → `eas submit` → Play internal track / TestFlight.

**Web-ahead gaps (optional post-launch parity, NOT blockers):** the web has a Festivals tab +
near-me / share / offline / push that the native 4-tab app (the locked D4 design:
Home/Discover/Yatra/Listen) doesn't have. The 4-tab app is a complete, review-ready v1.

## Wave C (Paadal Petra Sthalams) — ✅ complete, kept for provenance

Wave C is done and deployed (all 275 Tevaram Shiva temples; the `paadal-petra-sthalams`
circuit is live with 10 regional groups). The detailed in-progress log and the per-remaining
notes that used to live here are preserved in the historical sections further down and in:
  - **`docs/research/paadal-petra-sthalams.md`** — plan/manifest, decisions, corrections,
    the Translation QA / coordinate-verification passes.
  - **`docs/research/paadal-petra-sthalams-list.md`** — the full verified 276 list by region.
Hero/video coverage is at its external CC-photo ceiling (235 heroes / 207 videos of the
audited set); not an effort gap (`docs/media/photo-audit-auto.md`).

## How to resume in a fresh container

1. The repo is `dsquaregee/temple`. If it's not already checked out, attach it (the
   `add_repo` tool) and clone — one shallow clone, generous timeout (see the clone
   guidance the tool prints).
2. Work on branch **`claude/temple-app-phase-1-jfbtxy`** (the default/deploy branch).
   **Commit and push after every slice** — the remote is the only durable store.
3. Sanity-check the catalog: `node packages/content/scripts/validate.mjs`
   (expect `✓ content valid: 520 temples × 9 locales, 32 circuits`). Also
   `node packages/content/scripts/qa-translations.mjs`. Run `pnpm test`, `pnpm build:web`
   and `pnpm budget` before any deploy; `pnpm --filter mobile typecheck` for native changes.
4. Pushing to the branch auto-deploys via Cloudflare Workers Builds (Git-connected, no
   secrets). After any change that **moves a media URL**, bump the service-worker
   `VERSION` in `apps/web/public/sw.js` (owner rule — see CLAUDE.md "Working rules").

## Environment gotchas discovered this session (important)

- **Direct web fetch is BLOCKED** in this environment's network policy: `WebFetch`, curl
  and raw HTTP to `wikipedia.org`, `shivatemples.com`, `tntemplesproject.in`, etc. all
  fail (403 / DNS). **`WebSearch` WORKS, however** — its summaries return those sites'
  content, and that is how the 276 list was compiled. For research subagents, instruct
  them to use **WebSearch only** (not WebFetch/curl) or they will fall back to unreliable
  memory. (To get true direct fetch for future runs, change the environment's network
  policy — `read_documentation` → environment.network.)
- **Weekly Opus usage limit:** the prior session's background content run died on the
  account's weekly Opus limit. If you launch a large content-generation run on Opus and
  hit it, the reset is weekly — check current status before a big fan-out, and prefer
  **Sonnet** for research subagents (WebSearch compilation doesn't need Opus).

## Wave C — status & exactly what to do next

> **✅ SUPERSEDED — Wave C is complete and deployed (see the TL;DR at the top).** All 275
> Paadal Petra Sthalams are in the catalog, the circuit is live, and audio narration is
> done for all 508 temples. The section below is the historical in-progress log from the
> content run and is kept only for provenance; its counts and "to-do" lists are stale.

**The content run is IN PROGRESS.** Reference implementation every temple mirrors:
**`avinashiappar-avinashi`** (all 6 locales + `docs/research/paadal-petra/avinashiappar-avinashi.md`).
Temples ship text-first (`circuits: []`, no audio/hero/video — the media run adds those).

**Progress (as of 2026-10-16, catalog 285×6, all validating):**
- ✅ **Kongu Nadu** — complete (7/7), live.
- ✅ **Pandya Nadu** — complete (14/14: 5 pre-existing + 9 new), live.
- 🔨 **Nadu Nadu** — 8 of 19 new pushed; **11 still to write** (sivakozhundeesar-tirthanagiri,
  neelakandeswarar-erukkattampuliyur, vennaiyappar-tirunelvennai, atulyanatheswarar-arakandanallur,
  idaiyattrunathar-tiruvidaiyaru, kripapureeswarar-tiruvennainallur, sishtagurunathar-tiruthuraiyur,
  vadukeeswarar-tiruvandarkoil, vamanapureeswarar-tirumanikuzhi, panankatteeswarar-panankattur,
  azhagiyanathar-tiruvamathur). **Research NOTES still owed** for 8 pushed temples:
  theerthapureeswarar-tiruvathurai, sudarkozhundeesar-pennadam, narthanavallabeswarar-koodalaiyathur,
  mangalapureeswarar-tiruchopuram, bhaktajaneswarar-tirunavalur, vriddhagireeswarar-vriddhachalam,
  padaleeswarar-tiruppathiripuliyur, mundeeswarar-tirumundeeswaram.
- ⏳ **Thondai (27), outlying (7), Chola north (54), Chola south (110)** — not started.

**Paadal Petra in catalog: 66 / 276.**

**⏸ Paused on a rate limit:** the Sonnet subagent model hit a **session limit (resets
~23:50 UTC 2026-10-16)**. A one-shot resume trigger (`trig_01LTgffEVYeGBQVLWdizL2Un`)
fires into this session at **2026-10-16T23:55 UTC** to continue the waves automatically.
If you're a human picking this up sooner and the limit has cleared, just resume per below.

**How to run a wave:** spawn ~4 Sonnet subagents × ~4-5 temples each, lean prompt (WebSearch
only; all 6 locales; nativeName Tamil-script identical across locales; circuits:[]; no media;
research note with Sources + "Not verified"). **Check existing files first and skip temples
already written.** After each wave: `content:validate` + `qa-translations`, commit + push the
slice. Names/towns/deities are in `paadal-petra-sthalams-list.md`.

**At the end:** create the `paadal-petra-sthalams` circuit (×6 locales, 10 regional groups,
divya-desams model) seeded with ALL members, add the circuit to each member's `circuits`
field (×6 locales); validate (groups partition stops in order; both sides agree). Sub-split
Chola Nadu south if one regional page would exceed the 600 KB budget. Then refresh CLAUDE.md
/ this file's counts, and flag: (a) narration/media regen for all new temples + the 2 Vaippu
fixes; (b) a native-speaker editorial pass — all translations are AI-drafted.


Per `03-catalog-expansion.md` and the manifest, ship **region by region** (each region =
one circuit `groups` entry + one Yatra page/map, exactly like the Divya Desams). Suggested
order (small/high-value first): **Kongu (7) → Pandya (~10) → Nadu Nadu (~19) → Thondai
(~26) → outlying (Malai/Thulu/Eezha/Vada, ~9) → Chola north (~54) → Chola south (~110)**.

Per temple, the proven pipeline (CLAUDE.md "Narration audio" + `03-catalog-expansion.md`):
1. Research notes (`docs/research/...`) → `en` content JSON → the 5 translations.
2. Pronunciation lexicon entries → `audio.yml` → R2 sync → `media.yml` → hero variants →
   R2 sync → **SW `VERSION` bump** → push.
3. Add each new temple to the `paadal-petra-sthalams` circuit `stops` **and** its own
   `circuits` field (validate.mjs enforces both sides), grouped by region.

### The circuit is intentionally NOT created yet
Owner decision: **hold the `paadal-petra-sthalams` circuit until it is substantially
complete** (a visibly-partial "41 of 276" Yatra page would break the "circuits ship
complete" pattern the Divya Desams set). A circuit `stop` must reference an existing
temple, so instantiate the circuit during the content run — seed its regional `groups`
with the in-catalog members (listed per region in the list file) and grow it as content
lands. Design (10 regional groups) is in the manifest. **Sub-split Chola Nadu south**
(~128) into sub-belts so no single regional page exceeds the 600 KB budget
(`apps/web/scripts/check-budget.mjs`).

### Scope decisions — RESOLVED (owner, 2026-10-15)
- **Thiruparankundram** (`thiruparankundram-murugan`): **include** on the circuit (it is
  canonically a Pandya Nadu member via its Shiva shrine Parangirinathar); page stays
  Murugan-primary, carries `paadal-petra-sthalams` alongside its Arupadai-Veedu membership.
- **Far-north Vada Nadu** (Kedarnath, Mount Kailash, Anekatangavadam, Indra Neela
  Parvatham): **include**, mirroring how the Divya Desams circuit handles its northern
  abodes. Present Mount Kailash reverently as the pilgrimage peak; Indra Neela Parvatham
  is the one edge case (disputed location) — research carefully. Sequence Vada Nadu last.
  Details in `paadal-petra-sthalams.md` → "Owner decisions".

## Follow-up: narration for the corrected Vaippu temples — ✅ RESOLVED (verified 2026-10-26)

`keezhaperumpallam-naganathaswamy`, `thingalur-kailasanathar` and `kachabeswarar-kanchipuram`
were mislabeled as Paadal Petra Sthalams; the **text was fixed** (→ "Vaippu Sthalam", all 6
locales, deployed) and their `audio`/`video` fields removed so the next media run would
re-render them. **Confirmed done:** all three now carry `audio` (v4 path) across all 6
locales (Kachabeswarar also `video`), re-rendered from the corrected text — verified: none
of the three contains any "Paadal Petra" string and all contain "Vaippu". No residual
action. See `paadal-petra-sthalams.md` → "Content corrections".

## Update 2026-10-19 — Jyotirlingas + reconciliation (branch `claude/intelligent-cori-2uwdlj`)

- **The Twelve Jyotirlingas circuit** (`jyotirlingas`, stotram order) is added: 10 new temples
  (`somnath-prabhas-patan`, `nageshwar-dwarka`, `mahakaleshwar-ujjain`, `omkareshwar-mandhata`,
  `kedarnath`, `bhimashankar-pune`, `trimbakeshwar-nashik`, `grishneshwar-ellora`,
  `kashi-vishwanath-varanasi`, `vaidyanath-deoghar`) × 6 locales, plus the existing Srisailam and
  Rameswaram. Research notes in `docs/research/circuits/`. Their audio was rendered on 2026-10-15.
- **`kedarnath` already exists** — use it as the Vada Nadu Paadal Petra member (add
  `paadal-petra-sthalams` to its `circuits` when the circuit is created); do not write a second
  Kedarnath entry.
- **Third Vaippu correction:** `kachabeswarar-kanchipuram` (Karchapeswarar) was also mislabelled
  as a Paadal Petra Sthalam sung by Sundarar; Sundarar's hymn is for the Kachabeswarar temple at
  **Thirukachur** (a separate Thondai Nadu member). Text fixed in all 6 locales.
- **Narration for all three Vaippu fixes** (Thingalur, Keezhaperumpallam, Kachabeswarar) is queued:
  their `audio`/`video` fields were removed so the next `audio.yml`/`media.yml` run re-renders them.
- A parallel branch had also written ~98 Paadal Petra temples under different ids; those were
  **discarded** as duplicates of this main-line run (kept only at git tag `old-cori-pps` locally).

## Pointers

| What | Where |
|---|---|
| Project memory (read first) | `CLAUDE.md` |
| **Store release runbook (PWA / Play / App Store)** | **`docs/store-release.md`** |
| EAS build + submit workflow | `.github/workflows/eas-build.yml`, `apps/mobile/eas.json` |
| Apple listing metadata | `apps/mobile/store.config.json` |
| Wave C plan / decisions / corrections | `docs/research/paadal-petra-sthalams.md` |
| Full verified 276 list (content target) | `docs/research/paadal-petra-sthalams-list.md` |
| Catalog expansion strategy | `docs/research/03-catalog-expansion.md` |
| Deploy / media runbooks | `docs/deploy-cloudflare-pages.md`, CLAUDE.md "Narration audio" |
| Page-size budget | `apps/web/scripts/check-budget.mjs` |
