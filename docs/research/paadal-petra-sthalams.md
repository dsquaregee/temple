# Paadal Petra Sthalams — Wave C expansion manifest

Status: **PLANNING / owner review.** This is the queue and plan for the catalog's
flagship expansion — the **276 Paadal Petra Sthalams**, the Shiva temples praised in
the Tamil Tevaram (Thevaram) hymns of the Nayanar saints (Appar, Sambandar, Sundarar).
It is the Shaiva counterpart of the Divya Desams (already shipped complete) and was
named the natural next flagship in `03-catalog-expansion.md` (Wave C).

This document is the **source of the plan, not yet of the content.** Per the project
rule, every temple gets verified research notes before its content is written; this
manifest exists so that work has a precise, region-ordered target and so we never
re-add a temple the catalog already has.

---

## ⚠️ Environment constraint discovered while compiling this (read first)

The authoritative per-temple lists live on `shivatemples.com`, `tntemplesproject.in`
and Wikipedia. **In the current cloud session, direct page fetch to those hosts is
blocked** (the egress proxy returns 403 / DNS does not resolve for `en.wikipedia.org`,
`ta.wikipedia.org`, `shivatemples.com`, `tntemplesproject.in`, `divinetraveller.net`).
Only `WebSearch` (US-side search summaries) comes through.

Consequence:
- The **region structure and counts** below are confirmed from search summaries of the
  authoritative sources — reliable.
- The **in-catalog set** below is verified against this repository's own content —
  reliable.
- The **missing-temple name lists** (Appendix A) were compiled from search summaries +
  model knowledge under that blocked-network constraint. They are a **working draft, not
  authoritative** — treat them as a checklist to verify, never as finished data.

To complete the authoritative list, do one of:
1. run this compilation in an environment whose network policy allows those hosts, or
2. have the owner paste the canonical per-region lists (shivatemples.com has one clean
   page per region), or
3. verify each temple individually at content-generation time (the pipeline does this
   anyway), seeding from Appendix A.

---

## Authoritative structure & counts

The traditional classification groups the 276 by *nadu* (region). Sources agree on the
276 total but differ by one or two temples on a few boundary cases (noted):

| Region | Count | Notes |
|---|---:|---|
| **Chola Nadu** — north of the Kaveri (*Vadakarai*) | 63 | sources agree |
| **Chola Nadu** — south of the Kaveri (*Thenkarai*) | 128 | shivatemples.com 128; tntemplesproject.in 129 |
| **Pandya Nadu** | 14 | sources agree |
| **Nadu Nadu** | 22 | shivatemples.com lists 23; Wikipedia/Divine Traveller 22 |
| **Thondai Nadu** | 31–32 | shivatemples.com 31 (omits Srikalahasti); others 32 |
| **Kongu Nadu** | 7 | sources agree |
| **Malai Nadu** (Kerala) | 1 | Thiruvanchikulam (Kodungallur) |
| **Thulu Nadu** | 1 | Gokarna Mahabaleshwara |
| **Eezha Nadu** (Sri Lanka) | 2 | Thiruketheeswaram, Thirukoneswaram |
| **Vada Nadu** (North India / beyond the Tamil country) | 5–7 | Srisailam, Kedarnath, Kailash (Kailayam), Indra Neela Parvatham, …; sources give 5 or 7 |
| **Total** | **276** | Wikipedia also cites 275 in one place; ~266 of the 276 are within Tamil Nadu (incl. Puducherry) |

Primary sources (via WebSearch; not directly fetchable in this session):
- shivatemples.com — "The Listing of the Paadal Petra Shivasthalams" (per-region index pages)
- tntemplesproject.in — "Paadal Petra Sthalams"
- en.wikipedia.org — "Paadal Petra Sthalam"

**Boundary cases to settle against one chosen primary source before shipping:** the
Chola south 128-vs-129 count; Nadu Nadu 22-vs-23; whether Srikalahasti is counted under
Thondai Nadu or Vada Nadu; the Vada Nadu 5-vs-7 membership. Recommend adopting
**shivatemples.com** as the single canonical source for consistency (its 191 Chola /
63+128 split is the most widely cited).

---

## Already in the catalog (verified from repo content)

**43 of the 276 are already shipped** (+1 borderline), verified against
`packages/content/data/temples/en` — either they state "Paadal Petra Sthalam" / Tevaram
in their own content, or they were confirmed individually by town + deity. These must
**not** be rewritten; they only need to be added to the new circuit's `stops` (and their
`circuits` field updated) when it is stood up.

> Note on method: a plain keyword scan both over- and under-counts. It wrongly flagged
> `airavatesvara` (Darasuram) — a 12th-c. Chola temple that post-dates the Tevaram, so
> **not** a Paadal Petra Sthalam — and it missed `meenakshi-madurai`,
> `ramanathaswamy-rameswaram`, `gokarna-mahabaleshwara`, `srisailam-mallikarjuna`, whose
> pages never say "Tevaram" yet are genuine members. The set below is the reconciled,
> individually-checked result.

### Chola Nadu (29)
`jambukeswarar` (Thiruvanaikaval) · `aiyarappar-thiruvaiyaru` · `apatsahayar-thirupazhanam` ·
`odhanavaneswarar-thiruchotruthurai` · `vedapureeswarar-thiruvedhikudi` ·
`brahmasirakandeeswarar-thirukandiyur` · `pushpavananathar-thirupoonthuruthi` ·
`neyyadiappar-thillaisthanam` · `thingalur-kailasanathar` · `kanjanur-agneeswarar` ·
`adi-kumbeswarar-kumbakonam` · `thiruvidaimarudur-mahalingaswamy` ·
`thirunageswaram-naganathaswamy` · `thyagaraja-thiruvarur` · `alangudi-apatsahayesvarar` ·
`brahmapureeswarar-thirukkuvalai` · `vaimurnathar-thiruvaimur` ·
`kannayiramudayar-thirukaravasal` · `kayarohanaswamy-nagapattinam` ·
`vedaranyeswarar-vedaranyam` · `keezhaperumpallam-naganathaswamy` ·
`amritaghateswarar-thirukkadaiyur` · `thiruvenkadu-swetaranyeswarar` · `vaitheeswaran-koil` ·
`veerateeswarar-korukkai` · `veerateeswarar-thiruvirkudi` · `veerateeswarar-thirupariyalur` ·
`nataraja-chidambaram` · `thirunallar-dharbaranyeswarar`

(Several of these are the Navagraha temples — Suryanar aside, which is a separate shrine:
Thingalur, Thirunageswaram, Alangudi, Kanjanur, Vaitheeswaran Koil, Thiruvenkadu,
Keezhaperumpallam — already shipped as the `navagraha-temples` circuit.)

### Pandya Nadu (4 + 1 borderline)
`meenakshi-madurai` (Thiru Aalavai) · `kutralanathar-courtallam` · `nellaiappar-tirunelveli` ·
`ramanathaswamy-rameswaram` · *borderline:* `thiruparankundram-murugan` (modelled as a
Murugan temple in the catalog; traditionally counted among the Paadal Petra Sthalams for
its Shiva shrine Parangirinathar — **owner decision** whether to list it on this circuit).

### Nadu Nadu (3)
`arunachaleswarar` (Thiruvannamalai) · `veerattaneswarar-thiruvathigai` (Panruti) ·
`veerattaneswarar-thirukkovilur`

### Thondai Nadu (5)
`ekambareswarar` (Kanchipuram) · `kachabeswarar-kanchipuram` · `kapaleeshwarar-mylapore` ·
`thiruvalangadu-vadaranyeswarar` · `srikalahasti`

### Thulu Nadu (1)
`gokarna-mahabaleshwara`

### Vada Nadu (1)
`srisailam-mallikarjuna`

> Region assignment of the in-catalog set follows the research draft; the north-vs-south
> Kaveri split and the Thondai-vs-Nadu-Nadu boundary are refined per temple at content
> time against the chosen primary source.

---

## Remaining to write (target ≈ 233)

| Region | Canonical | In catalog | **To write** |
|---|---:|---:|---:|
| Chola Nadu (north) | 63 | — | — |
| Chola Nadu (south) | 128 | — | — |
| Chola Nadu (combined) | 191 | 29 | **~162** |
| Pandya Nadu | 14 | 4 (+1) | **~9** |
| Nadu Nadu | 22 | 3 | **~19** |
| Thondai Nadu | 31–32 | 5 | **~26** |
| Kongu Nadu | 7 | 0 | **7** |
| Malai Nadu | 1 | 0 | **1** |
| Thulu Nadu | 1 | 1 | 0 |
| Eezha Nadu | 2 | 0 | **2** |
| Vada Nadu | 5–7 | 1 | **~6** |
| **Total** | **276** | **43 (+1)** | **≈ 233** |

---

## Batch / wave plan

Ship **region by region**, exactly as the Divya Desams were — one `groups` entry per
region, one Yatra page + route map per region. Suggested order (smallest / highest-value
first, to prove the pipeline and give fast visible wins before the large Chola belt):

1. **Kongu Nadu** (7) — small, self-contained, zero already shipped.
2. **Pandya Nadu** (~9) — anchored by Madurai & Rameswaram, already shipped.
3. **Nadu Nadu** (~19) — the Veerattanam/Vriddhachalam belt; two anchors shipped.
4. **Thondai Nadu** (~26) — Kanchipuram cluster; five anchors shipped.
5. **Outlying**: Malai (1) + Eezha (2) + Vada (~6) — distant sthalams; photos often
   scarce, ship with text/narration/map per owner direction.
6. **Chola Nadu north** (~34 new of 63) — Tiruchi/Thanjavur/Mayiladuthurai belt.
7. **Chola Nadu south** (~128) — **the largest region; split it.** See budget note.

Budget per the proven pipeline: ~1 agent wave per 5–6 temples (research notes → en
content → 5 translations → lexicon → audio → R2 sync → media → hero → SW bump → PR).

### Page-budget note (carries the Discover prerequisite finding)
The Wave C prerequisite from `03-catalog-expansion.md` ("Discover should server-render
the first page and let the client render the rest") is **already satisfied** — Discover
is paginated (`DISCOVER_PAGE_SIZE = 48`, `temples/page/[n]` route, full catalogue served
on demand from `/catalog/<locale>.json`), the Home page renders only the launch-core
shelf, and the largest page is now a grouped circuit overview (~300 KB vs the 600 KB
ceiling in `check-budget.mjs`). Page size no longer grows with the catalogue.

**The one remaining size risk is a single over-large *regional circuit page*.** Chola
Nadu south alone is ~128 temples; one region page listing 128 member cards would
approach the 600 KB raw ceiling. Mitigation: **sub-split Chola Nadu south** into
traditional sub-belts (e.g. the Kumbakonam, Mayiladuthurai/Sirkazhi, Nagapattinam/
Thiruvarur, Thanjavur clusters) as separate `groups` so no single region page is huge —
the `groups` mechanism already supports one page per group. Decide the sub-split when
that region's content is compiled.

---

## Circuit scaffold design (ready to instantiate)

The circuit follows the `divya-desams` model exactly: top-level `stops` (all members,
flat) + `groups` (one `{id, name, stops[]}` per region), in all 6 locales, with
`validate.mjs` enforcing that groups partition stops in order and that every stop's
temple lists the circuit in its own `circuits` field.

```
id:         paadal-petra-sthalams
name:       Paadal Petra Sthalams            (localized per locale)
nativeName: பாடல் பெற்ற தலங்கள்               (Tamil, shared across locales)
groups (ids, URLs — fixed across locales):
  chola-nadu-north · chola-nadu-south · pandya-nadu · nadu-nadu ·
  thondai-nadu · kongu-nadu · malai-nadu · thulu-nadu · eezha-nadu · vada-nadu
  (chola-nadu-south further sub-grouped if the page-budget note above requires)
```

**Not yet created, by design.** A circuit stop must reference an existing temple, so the
circuit can only ever contain shipped members. Standing it up today would publish a
visibly-partial "Paadal Petra Sthalams: 43 of 276" Yatra page — a break from the
"circuits ship complete" pattern the Divya Desams set. **Owner decision (see below)**
before it is instantiated. When greenlit, instantiating it is mechanical: seed each
group with the in-catalog members above, add `paadal-petra-sthalams` to each member's
`circuits` field (×6 locales), and grow it region by region as content lands.

---

## Owner decisions needed

1. **Canonical source** — adopt shivatemples.com as the single source of truth for
   membership/counts (resolves the boundary-case discrepancies)? (Recommended.)
2. **Circuit visibility** — stand the circuit up now as a visibly-partial, "being
   completed in waves" page seeded with the 43 shipped members, or hold it hidden until
   it is substantially complete? (Divya Desams precedent = ship complete.)
3. **Thiruparankundram** — list the Murugan-primary `thiruparankundram-murugan` on this
   Shaiva circuit (traditionally counted) or leave it off?
4. **Verification path** — resolve the blocked-network constraint (run in a
   web-enabled environment, or paste the canonical per-region lists) so the Appendix A
   draft can be promoted to an authoritative target list.

---

## Appendix A — UNVERIFIED WORKING DRAFT of member names

> **Do not ship from this without per-temple verification.** Compiled under the blocked-
> network constraint above, from search summaries + model knowledge, by region. Counts
> fall short of canonical where sources could not be reached (Chola north 27/63, Chola
> south 51/128, Vada 4/7). Goddess names, district names (several districts were
> recently reorganised), and north/south-bank classification are the least reliable
> columns. In-catalog members are marked ✅. This appendix is a starting checklist for
> the content run, nothing more.

The draft region tables (Chola Nadu north, Chola Nadu south, Pandya, Nadu Nadu, Kongu,
Thondai, Eezha, Thulu, Malai, Vada) are retained in the session working notes rather than
committed here, to keep this document authoritative. Promote them into this appendix once
verified against the canonical source. See "Verification path" above.
