# Hero image backfill — tracking & handoff

Goal: give the **59 temples that still use placeholder silhouettes** a real,
CC/PD-licensed hero photo, deployed to production in **small batches** so
progress is durable and anyone can pick it up mid-way.

**Status:** the original 42 temples already have real heroes. This backfills the
remaining 59 (catalog = 101). Snapshot from the credential-free audit
(`gen-video.mjs` dry-run → `photo-audit-auto.md`), 2026-07-26:

- **32 auto-sourced** — Commons search finds a qualifying hero; no curation needed.
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

- **Batch A** ☐ — `alangudi-apatsahayesvarar,ambalappuzha-krishna,appakkudathan-tiruppernagar,attukal-bhagavathy,bhadrachalam-rama,brahmapureeswarar-thirukkuvalai,dharmasthala-manjunatha,ettumanoor-mahadeva`
- **Batch B** ☐ — `kanaka-durga-vijayawada,kanjanur-agneeswarar,kannayiramudayar-thirukaravasal,kanyakumari-bhagavathy,kukke-subramanya,kutralanathar-courtallam,melukote-cheluvanarayana,murudeshwar-shiva`
- **Batch C** ☐ — `nanjangud-srikanteshwara,nellaiappar-tirunelveli,ranganathaswamy-shivanasamudra,ranganathaswamy-srirangapatna,sarangapani-kumbakonam,srivaikuntanathan-srivaikuntam,suchindram-thanumalayan,thirunageswaram-naganathaswamy`
- **Batch D** ☐ — `thirunallar-dharbaranyeswarar,thiruvalangadu-vadaranyeswarar,thyagaraja-thiruvarur,vaithamanidhi-thirukkolur,vaitheeswaran-koil,varadaraja-perumal-kanchipuram,vedaranyeswarar-vedaranyam,yadadri-lakshmi-narasimha`

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
  (`resume=true` skips temples already done).
- Full Ken Burns videos are a separate, heavier follow-up (drop `hero_only`);
  out of scope for the hero backfill.
