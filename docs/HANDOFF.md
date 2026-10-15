# HANDOFF — continuing this work in a new session

**Read this first if you're picking up a shared conversation or a fresh cloud session.**
A cloud container is ephemeral: it starts with a clean checkout and no prior chat context,
so everything needed to continue lives here and in the two Paadal Petra docs, not in the
conversation. Last updated: 2026-10-15.

## TL;DR — where things stand

- The app is **live on Cloudflare** (`temples.dsquaregee.com`), catalog **261 temples ×
  6 locales, 29 circuits**, Phase 4 (Test/Harden) in progress. See `CLAUDE.md` for the
  full project memory — read it; it is the source of truth.
- **Active workstream: Wave C — the Paadal Petra Sthalams** (the 276 Tevaram Shiva
  temples, the Shaiva counterpart to the completed Divya Desams). This is the flagship
  catalog expansion. **41 of 276 are already in the catalog; ~234 remain to write.**
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

## Wave C — exactly what to do next

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

### Open decisions to confirm with the owner
- **Thiruparankundram** (`thiruparankundram-murugan`): Murugan-primary temple
  traditionally counted among the Paadal Petra Sthalams — list it on the circuit or not?
  (Flagged *borderline* in the list.)
- **Far-north Vada Nadu shrines** (Kedarnath, Mount Kailash, etc.): go beyond the app's
  South-India focus; need an explicit scope decision like the Jyotirlingas.

## Follow-up: narration for the 2 corrected Vaippu temples

`keezhaperumpallam-naganathaswamy` and `thingalur-kailasanathar` were mislabeled as Paadal
Petra Sthalams; the **text is fixed** (→ "Vaippu Sthalam", all 6 locales, deployed). Their
**narration audio still says "Paadal Petra"** and must be re-rendered. This was queued for
the next media run rather than a standalone 2-temple pipeline. When you next run
`audio.yml`/`media.yml`, ensure these two are re-rendered (resume off or targeted) and bump
the SW `VERSION`. See `paadal-petra-sthalams.md` → "Content corrections".

## Pointers

| What | Where |
|---|---|
| Project memory (read first) | `CLAUDE.md` |
| Wave C plan / decisions / corrections | `docs/research/paadal-petra-sthalams.md` |
| Full verified 276 list (content target) | `docs/research/paadal-petra-sthalams-list.md` |
| Catalog expansion strategy | `docs/research/03-catalog-expansion.md` |
| Deploy / media runbooks | `docs/deploy-cloudflare-pages.md`, CLAUDE.md "Narration audio" |
| Page-size budget | `apps/web/scripts/check-budget.mjs` |
