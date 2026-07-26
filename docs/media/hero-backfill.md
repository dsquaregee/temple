# Hero image backfill — tracking & handoff

Goal: give the **59 temples that still use placeholder silhouettes** a real,
CC/PD-licensed hero photo, deployed to production in **small batches** so
progress is durable and anyone can pick it up mid-way.

**Status (2026-07-26): 74 / 101 temples now have real heroes.** The original 42
plus the **32 auto-sourced** (batches A–D) are done and live. **27 remain** —
they need hand-curated Commons files (batches E–G below). From the
credential-free audit (`gen-video.mjs` dry-run → `photo-audit-auto.md`):

- **32 auto-sourced** — Commons search finds a qualifying hero; no curation needed. ✅ **DONE (A–D, deployed)**
- **27 need curation** — no auto-qualifying photo; a Commons file must be picked
  by hand and added to the `CURATED` map in `packages/content/scripts/gen-video.mjs`.

## How each batch works (deploys straight to production)

Heroes are set by `media.yml` (needs GCP creds → runs in CI). We use **`hero_only`
mode** (added 2026-07-26) so a batch sets the hero photo and skips the slow Ken
Burns video render — fast and cheap.

Dispatch **on the production branch** `claude/temple-app-phase-1-jfbtxy` so each
batch commits the heroes there and auto-deploys:

```bash
# 1. Hero photos for the batch (hero_only = fast, no video):
gh workflow run media.yml --ref claude/temple-app-phase-1-jfbtxy \
  -f only="<comma,ids>" -f hero_only=true -f resume=true
# (or the GitHub UI → Actions → "Generate narrated videos" → Run workflow)

# 2. After it commits, add AVIF/WebP + OG variants for the same batch:
gh workflow run hero-variants.yml --ref claude/temple-app-phase-1-jfbtxy \
  -f only="<comma,ids>"
```

Then **verify** each hero is live and depicts the right temple:

```bash
curl -s -o /dev/null -w "%{http_code}\n" \
  "https://storage.googleapis.com/temple-502523-media/heroes/<id>.jpg"
# and open https://temples.dsquaregee.com/en/temples/<id>/ — check the photo is
# the correct temple (auto-search occasionally mis-picks; if so, curate → re-run
# with -f force via a CURATED entry, see below).
```

Tick the batch off in the table below and commit this file so the next person
sees live status.

## Curating the 27 (no auto photo)

For a temple in the "needs curation" list: find a good exterior photo on
[Wikimedia Commons](https://commons.wikimedia.org) that (a) clearly depicts the
**correct** temple, (b) is CC-BY / CC-BY-SA / CC0 / public-domain, and (c) is
landscape and ≥ 2 MP. Add its exact `File:...` title(s) to the `CURATED` map in
`packages/content/scripts/gen-video.mjs` (hero first), commit via PR, then run
the batch commands above (add `-f force=true` on `media.yml` if re-running).
Re-run the dry-run audit to confirm it now resolves:

```bash
VIDEO_DRYRUN=1 VIDEO_ONLY="<id>" node packages/content/scripts/gen-video.mjs
```

---

## Batches

Legend: ☐ not started · ⏳ dispatched · ✅ live & verified

### Auto-sourced (no curation) — 32 temples

- **Batch A** ✅ — `alangudi-apatsahayesvarar,ambalappuzha-krishna,appakkudathan-tiruppernagar,attukal-bhagavathy,bhadrachalam-rama,brahmapureeswarar-thirukkuvalai,dharmasthala-manjunatha,ettumanoor-mahadeva`
- **Batch B** ✅ — `kanaka-durga-vijayawada,kanjanur-agneeswarar,kannayiramudayar-thirukaravasal,kanyakumari-bhagavathy,kukke-subramanya,kutralanathar-courtallam,melukote-cheluvanarayana,murudeshwar-shiva`
- **Batch C** ✅ — `nanjangud-srikanteshwara,nellaiappar-tirunelveli,ranganathaswamy-shivanasamudra,ranganathaswamy-srirangapatna,sarangapani-kumbakonam,srivaikuntanathan-srivaikuntam,suchindram-thanumalayan,thirunageswaram-naganathaswamy`
- **Batch D** ✅ — `thirunallar-dharbaranyeswarar,thiruvalangadu-vadaranyeswarar,thyagaraja-thiruvarur,vaithamanidhi-thirukkolur,vaitheeswaran-koil,varadaraja-perumal-kanchipuram,vedaranyeswarar-vedaranyam,yadadri-lakshmi-narasimha`

_Hero-only (1–2 photos, no video even at full run): kanjanur-agneeswarar,
kukke-subramanya, thirunageswaram-naganathaswamy — heroes still set._

### Needs curation (add CURATED entries first) — 27 temples

- **Batch E** ☐ — `adinathar-alvarthirunagari,amararama-amaravati,annavaram-satyanarayana,aravindalochanar-tholaivillimangalam,basara-saraswati,chottanikkara-bhagavathy,devapiran-tholaivillimangalam,draksharama-bhimeswara,kaisinavendan-thirupulingudi`
- **Batch F** ☐ — `kayarohanaswamy-nagapattinam,keezhaperumpallam-naganathaswamy,ksheerarama-palakollu,kumararama-samalkota,makaranedunkuzhaikkathar-thenthiruperai,parimala-ranganatha-tiruindalur,sabarimala-ayyappa,samayapuram-mariamman,somarama-bhimavaram`
- **Batch G** ☐ — `srinivasan-thirukkulandhai,srivilliputhur-andal,suryanar-koil,thingalur-kailasanathar,thiruvenkadu-swetaranyeswarar,thiruvidaimarudur-mahalingaswamy,vaikom-mahadeva,vaimurnathar-thiruvaimur,vijayasana-thiruvaragunamangai`

---

## Notes

- No temple is ever blank: all 101 have a placeholder silhouette; this only
  upgrades the 59 to real photos.
- `media.yml` / `hero-variants.yml` commit directly to the branch they run on —
  dispatch on the production branch to deploy a batch. Each run is idempotent
  (`resume=true` skips temples already done, but note: `hero_only` temples have
  no `video.url`, so `resume` will re-process them — harmless, just re-uploads).
- **Dispatch media runs ONE AT A TIME — wait for each to finish before the next.**
  Two runs in the same `media-generation` concurrency group will collide: a newer
  queued run *cancels* the older pending one, and a run that finishes while
  another is mid-flight *fails its push* (no rebase in the workflow). Batches A–D
  hit exactly this on the first attempt; C+D were re-run as one clean serial run.
- **Re-curate `bhadrachalam-rama`** (batch A): the auto-pick is a town welcome
  arch, not the temple building. Add a proper Commons `File:` to `CURATED` and
  re-run `media.yml -f only=bhadrachalam-rama -f hero_only=true -f force=true`.
- After all 59 heroes are in, run `hero-variants.yml` **once** over the full
  backfilled id set for AVIF/WebP + OG cards (one pass, not per batch).
- Full Ken Burns videos are a separate, heavier follow-up (drop `hero_only`);
  out of scope for the hero backfill.
