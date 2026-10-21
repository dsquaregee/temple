# HANDOFF — continuing this work in a new session

**Read this first if you're picking up a shared conversation or a fresh cloud session.**
A cloud container is ephemeral: it starts with a clean checkout and no prior chat context,
so everything needed to continue lives here and in the two Paadal Petra docs, not in the
conversation. Last updated: 2026-10-20.

## TL;DR — where things stand

- The app is **live on Cloudflare** (`temples.dsquaregee.com`). See `CLAUDE.md` for the
  full project memory — read it; it is the source of truth.
- **✅ Wave C — the Paadal Petra Sthalams — is CONTENT-COMPLETE (2026-10-20).** All **275**
  Tevaram Shiva temples are in the catalog and the **`paadal-petra-sthalams` circuit is
  live** (275 stops, 10 regional groups, 6 locales). Catalog now **508 temples × 6 locales,
  31 circuits** (`node packages/content/scripts/validate.mjs`). Membership was reconciled
  strictly against the verified list; this fixed 3 prior-session duplicate temples.
- **✅ Media pipeline run & deployed (2026-10-20).** Narration **audio is complete for all
  508 temples** (`audio.yml` → R2 sync). Hero photos + Ken Burns videos were rendered via
  `media.yml` from qualifying Creative-Commons Wikimedia photos (gate: CC/PD, ≥2 MP,
  landscape; hero ≥1 photo, video ≥3) and synced to R2 — **235 have a real hero, 207 a
  video**; the rest use the honest placeholder gopuram SVG + audio-only player and fill in
  as qualifying CC photos appear (`docs/media/photo-audit-auto.md`). SW bumped to **v14**;
  deployed to Cloudflare (PR #74 content/circuit, PR #75 CI fixes + SW bump).
- **Remaining for Wave C — and why each is at its true floor:**
  1. **Translation QA — objective pass complete (2026-10-20), human fluency sign-off left.**
     `qa-translations.mjs` is 0 errors / 0 warnings (100% native-script ratio, mirrored key
     structure, no empty strings, no length outliers). A numeric/factual audit across all
     508×5 locales found **zero fact/date drift** (every digit difference was a legitimate
     word-vs-digit form, e.g. "7th"→"ഏഴാം"); the one real defect — a truncated `style` on
     `sathyagirinatha-thirumeyyam` (te/kn/ml/hi) — was fixed. A **comprehensive fluency review of all 237 Wave-C
     temples × 5 locales** (name/deity/summary) was completed 2026-10-20/21 (PRs #80–#83,
     ~190 verified targeted edits): removed caste claims and unsourced "female devotee"
     claims not in the English, fixed a wrong goddess name, a Pranava→Prana deity error,
     "protest" mistranslations, an added "northwest of Chennai", and a catalog-wide cleanup
     of Tamil-script letters left in te/kn/ml/hi prose. The drafts are now reviewed and
     clean; a human native-speaker sign-off remains the nominal final gate (not an effort
     gap). See the Translation QA pass in `docs/research/paadal-petra-sthalams.md`.
  2. **Coordinates — verified 2026-10-20.** The 36 flagged temples were re-checked; 10 were
     upgraded to precise sourced values, the other 26 have no precise temple coordinate
     published anywhere and remain honest town/village-level (adequate at circuit-map scale;
     all pass validation). See the coordinate-verification pass in
     `docs/research/paadal-petra-sthalams.md`. Refine opportunistically only.
  3. **Hero/video coverage is at its external ceiling.** `media.yml`'s photo audit attempted
     **all 508** temples; 273 have no Creative-Commons/PD photo meeting the gate (≥2 MP,
     landscape), so 235 heroes / 207 videos is the maximum the CC-sourced pipeline can
     produce — re-running will not add more until new qualifying photos exist. Not an effort
     gap (`docs/media/photo-audit-auto.md`).
- (Earlier state, for reference: this workstream began at 41 of 276 in the catalog.)
- Everything for Wave C is planned and verified:
  - **`docs/research/paadal-petra-sthalams.md`** — the plan/manifest (decisions, counts,
    batch order, circuit design, page-budget note, content corrections).
  - **`docs/research/paadal-petra-sthalams-list.md`** — the full verified 276 list, region
    by region, with the in-catalog members marked. **This is the content target.**

## How to resume in a fresh container

1. The repo is `dsquaregee/temple`. If it's not already checked out, attach it (the
   `add_repo` tool) and clone — one shallow clone, generous timeout (see the clone
   guidance the tool prints).
2. Work on branch **`claude/temple-app-phase-1-jfbtxy`** (the default/deploy branch).
   **Commit and push after every slice** — the remote is the only durable store.
3. Sanity-check the catalog: `node packages/content/scripts/validate.mjs`
   (expect `✓ content valid: 261 temples × 6 locales, 29 circuits`, or higher as content
   lands). Also `node packages/content/scripts/qa-translations.mjs`.
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

## Follow-up: narration for the 2 corrected Vaippu temples

`keezhaperumpallam-naganathaswamy` and `thingalur-kailasanathar` were mislabeled as Paadal
Petra Sthalams; the **text is fixed** (→ "Vaippu Sthalam", all 6 locales, deployed). Their
**narration audio still says "Paadal Petra"** and must be re-rendered. This was queued for
the next media run rather than a standalone 2-temple pipeline. When you next run
`audio.yml`/`media.yml`, ensure these two are re-rendered (resume off or targeted) and bump
the SW `VERSION`. See `paadal-petra-sthalams.md` → "Content corrections".

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
| Wave C plan / decisions / corrections | `docs/research/paadal-petra-sthalams.md` |
| Full verified 276 list (content target) | `docs/research/paadal-petra-sthalams-list.md` |
| Catalog expansion strategy | `docs/research/03-catalog-expansion.md` |
| Deploy / media runbooks | `docs/deploy-cloudflare-pages.md`, CLAUDE.md "Narration audio" |
| Page-size budget | `apps/web/scripts/check-budget.mjs` |
