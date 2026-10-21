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

## ✅ Status update — list verified; see `paadal-petra-sthalams-list.md`

**The full 276 list is now compiled and committed** as `paadal-petra-sthalams-list.md`,
region by region, via **WebSearch against shivatemples.com** (adopted as canonical per
owner decision #1). Membership and towns are reliable; goddess/native-name columns are
partially flagged and get verified per temple at content time. The environment constraint
below explains the method (direct fetch is blocked; WebSearch is the working path).

## ⚠️ Environment constraint (method note)

The authoritative per-temple lists live on `shivatemples.com`, `tntemplesproject.in`
and Wikipedia. **In this cloud session, direct page fetch to those hosts is blocked**
(the egress proxy returns 403 / DNS does not resolve). **`WebSearch` works, however** —
its summaries return the authoritative per-region lists, which is how the list file was
built. (For future runs that need direct fetch, the lever is the environment's network
policy — see `read_documentation` → environment.network.)

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

**42 of the 276 are already shipped**, verified against
`packages/content/data/temples/en` and cross-referenced to the canonical list. The full
per-region in-catalog breakdown lives in `paadal-petra-sthalams-list.md` (each region's
table names its shipped members with their canonical row number). These must **not** be
rewritten; they only need to be added to the new circuit's `stops` (and their `circuits`
field updated) when it is stood up.

> **Count notes:** two temples that claim "Paadal Petra Sthalam" in their catalog content
> — `keezhaperumpallam-naganathaswamy` (Ketu) and `thingalur-kailasanathar` (Chandran) —
> are in fact **Vaippu Sthalams** (mentioned in Appar's hymns but the deity is not named),
> *not* among the 276 (so the raw 43 → 41; see "Content corrections"). With
> `thiruparankundram-murugan` confirmed a member (owner decision), the in-catalog total is
> **42**.

> Note on method: a plain keyword scan both over- and under-counts. It wrongly flagged
> `airavatesvara` (Darasuram) — a 12th-c. Chola temple that post-dates the Tevaram, so
> **not** a Paadal Petra Sthalam — and it missed `meenakshi-madurai`,
> `ramanathaswamy-rameswaram`, `gokarna-mahabaleshwara`, `srisailam-mallikarjuna`, whose
> pages never say "Tevaram" yet are genuine members. The set below is the reconciled,
> individually-checked result.

In-catalog members by region (full per-temple detail + canonical row numbers in
`paadal-petra-sthalams-list.md`):

| Region | In catalog |
|---|---:|
| Chola Nadu north | 9 |
| Chola Nadu south | 18 |
| Pandya Nadu | 5 (incl. `thiruparankundram-murugan`) |
| Nadu Nadu | 3 |
| Thondai Nadu | 5 (incl. `srikalahasti`) |
| Thulu Nadu | 1 (`gokarna-mahabaleshwara`) |
| Vada Nadu | 1 (`srisailam-mallikarjuna`) |
| **Total** | **42** |

Seven of the in-catalog Chola temples are shipped Navagraha temples that are also Paadal
Petra Sthalams (Thirunageswaram, Alangudi, Kanjanur, Vaitheeswaran Koil, Thiruvenkadu,
plus Thirunallar). The other two Navagraha shrines in the catalog — Thingalur and
Keezhaperumpallam — are **Vaippu Sthalams, not Paadal Petra** (see corrections below).

---

## Remaining to write (target ≈ 234)

| Region | Canonical | In catalog | **To write** |
|---|---:|---:|---:|
| Chola Nadu (north) | 63 | — | — |
| Chola Nadu (south) | 128 | — | — |
| Chola Nadu (combined) | 191 | 29 | **~162** |
| Pandya Nadu | 14 | 5 | **~9** |
| Nadu Nadu | 22 | 3 | **~19** |
| Thondai Nadu | 31–32 | 5 | **~26** |
| Kongu Nadu | 7 | 0 | **7** |
| Malai Nadu | 1 | 0 | **1** |
| Thulu Nadu | 1 | 1 | 0 |
| Eezha Nadu | 2 | 0 | **2** |
| Vada Nadu | 5–7 | 1 | **~6** |
| **Total** | **276** | **42** | **≈ 234** |

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

## Owner decisions

1. **Canonical source — RESOLVED:** shivatemples.com adopted as the single source of
   truth for membership/counts.
2. **Circuit visibility — RESOLVED:** hold the circuit until it is **substantially
   complete** (do not stand up a visibly-partial page). It will be instantiated during
   the content run, not now.
3. **Thiruparankundram — RESOLVED: include.** `thiruparankundram-murugan` is canonically
   one of the 14 Pandya Nadu Paadal Petra Sthalams (its Shiva shrine Parangirinathar is
   the Tevaram-sung aspect). It will carry the `paadal-petra-sthalams` circuit in addition
   to its Murugan/Arupadai-Veedu membership; the temple page stays Murugan-primary with a
   one-line note on the Parangirinathar shrine. (Owner decision 2026-10-15.)
4. **Verification path — RESOLVED:** done in-session via WebSearch (see status note at
   top). The full list is committed in `paadal-petra-sthalams-list.md`. Goddess/native
   columns still get per-temple verification at content time.
5. **Far-north Vada Nadu scope — RESOLVED: include, mirroring the Divya Desams.** The
   completed Divya Desams circuit already includes its northern/Nepal abodes (Badrinath,
   Muktinath) and omits only the two purely celestial ones; the Shaiva flagship follows
   the same rule. Include the earthly Vada Nadu members — Srisailam (shipped), Kedarnath
   (high-value, also seeds a future Panch Kedar/Char Dham circuit), Mount Kailash and
   Anekatangavadam/Gowrikund — presenting Mount Kailash reverently as the pilgrimage abode
   (a peak, not a built temple to "visit"). **Indra Neela Parvatham** is the one edge case
   (location disputed/obscure): research carefully and present honestly as "traditionally
   identified with…". Sequence Vada Nadu last. (Owner decision 2026-10-15.)

## Coordinate verification pass (2026-10-20)

The 36 Wave-C temples whose research notes flagged an **unsourced / town-level / derived**
coordinate were re-checked against mapping sources (Wikipedia infoboxes, AroundUs) via
WebSearch. Outcome:

- **10 upgraded to precise sourced coordinates** (updated in all 6 locale JSONs): material
  improvements `onakantheeswarar-kanchipuram`, `pasupatheeswarar-karur`,
  `vilvanatheswarar-thiruvalam` (temple point, ~8 km better than the town value),
  `sivalokanathar-tirupunkur`, `tarukavaneswarar-tirupparaithurai`; and 5 whose town-level
  value was **confirmed** against a Wikipedia infobox and refined to its exact decimals
  (`aadanainathar-tiruvadanai`, `mahakaleswarar-irumbai`, `thiruvalleeswarar-padi`,
  `kalaiyarnathar-kalaiyarkoil`, `tirumeninathar-tiruchuli`).
- **26 remain town/village-level** — no precise temple coordinate is published online (the
  searches returned nothing better, or only arcminute-rounded values ≈ the current one).
  These are **the honest best available** and are fully adequate at circuit-route-map scale
  (regional maps spanning 100s of km; all pass `validate.mjs`'s 4–37 N / 66–98 E gate and
  sit within a few km of their town). Not a blocker; refine opportunistically if a sourced
  temple-level coordinate later appears.

## Translation QA pass (2026-10-20)

Two layers beyond the mechanical `qa-translations.mjs` (which is 0/0):

1. **Numeric/factual audit** across all 508×5 locales — zero fact/date drift; the only
   defect was a truncated `style` on `sathyagirinatha-thirumeyyam` (te/kn/ml/hi), fixed.
2. **Comprehensive fluency review** of **all 237 Wave-C temples × 5 locales**
   (name/deity/summary) via native-fluent review against the English source — a 45-temple
   sample first, then the remaining 192 in four batches (PRs #80–#83). **~190 verified,
   targeted edits** in total (nothing auto-rewritten wholesale); every semantic fix checked
   against the English, and cross-locale agreement (the same point flagged independently in
   3–5 languages) used to confirm the universal errors. Highlights:
   - **Faithfulness / not-in-source:** caste claims removed where the English says only
     "humble devotee" / "devout priest" (`sivalokanathar`, `satchinathar`); unsourced
     "female devotee" corrected (`arunajadeswarar`, 4 locales; `ponvaithanathar`;
     `arunajadeswarar`); an added "northwest of Chennai" removed (`thiripuranthakeswarar`,
     all 5 locales).
   - **Factual mistranslations:** wrong goddess name (`mullaivananathar`: Karpaga Nayaki →
     Garbarakshambigai); Pranava→Prana deity name (`pranavanatheswarar`); "sang out in
     protest" → familiarity/freely (`tirumuruganathaswamy`, 4 locales); "a lamp that would
     not burn" → "extinguished torches" (`mahalakshminathar`, 4 locales); "humbling of
     Mahabali" → "humility" (`vamanapureeswarar`, 4 locales); "celestial maidens" → plain
     maidens (`kadambavaneswarar`, 4 locales); "vel is a lance" vs trident
     (`vennailingeswarar`); "Swami Rock" → "Swamimalai"; "fine gold"; "both names mean the
     sun"; bricks-to-gold miracle subject; Vishnu/discus tradition; Nethrambigai; etc.
   - **Terminology / consistency:** Nayanmars vs the Nair-community term; "child-saint"
     Sambandar as ascetic/renunciant; oleander not hibiscus; Chola (ചോള not ചോഴ); Kudavasal,
     Kuthalam, Coromandel spellings; Paadal-Petra / pathigam / Nadu-Nadu transliteration;
     Hindi gender agreement; a leftover editing artifact `—alla,` removed.
   - **Catalog-wide script cleanup:** Tamil letters (ழ etc.) left untransliterated in
     te/kn/ml/hi prose, remapped to each script's equivalent across 115 fields (photographer
     credits and `nativeName` left verbatim).
   The earlier 45-temple sample's **19 fixes** are included in the total:
   - Place-name transliteration typos: `agneeswarar-tiruanniyur`, `gnanapureeswarar-mayanam`
     (கூடவாசல்→குடவாசல்), `masilamaniswarar-tiruvaduthurai` (கூத்தனூர்→குத்தாலம், ta; கുത്താള→കുത്താല, ml).
   - Mistranslations: te `pasupatheeswarar-karur` (సంత→సాధు "saint"), te
     `pazhampathinathar-tiruppunavasal` (untranslated ఆవుడయార్→పీఠం "pedestal" + missing
     epithet), ml `amravaneswarar-tirumaandurai` (reversed "deer blessed with a mango"), ml
     `neenerinathar-thandalaicheri` (ഉറപ്പ്→അചഞ്ചലമായ നിഷ്ഠ "steadfast"), hi
     `saaraparameswarar-tirucherai` (garbled नाडा→पूजा), hi `sargunalingeswarar-karukudi`
     (mangled "lady of non-duality" gloss).
   - Dropped fact: kn `bhaktajaneswarar-tirunavalur` (restored "mother").
   - Transliteration/term consistency: kn ಪೆತ್ರ ಸ್ಥಲ→ಪೆಟ್ರ ಸ್ಥಳ, ಪತಿಕ→ಪದಿಗ; ml പെറ്റ→പെറ്റ്ര,
     പതിഗ→പതിക; Hindi gender agreement (कोंपल/पादुका feminine).
   - Deferred as low-confidence/subjective (no clear catalog-dominant form): ml
     `saaraparameswarar` കുടവാസൽ↔കൂടവാസൽ, ml `uthvedeeswarar` plural, ml `jalanatheeswarar`
     chillu encoding.

   The sample shows the AI drafts are substantively sound. A **full human native-speaker
   pass over all Wave-C prose remains the recommended sign-off** — it is a human gate, not an
   effort gap (rewriting validated prose without a native speaker risks regressions).

## Content corrections (found during this audit)

Two catalog temples assert "Paadal Petra Sthalam" in their content but are actually
**Vaippu Sthalams** (praised by Appar without naming the deity → not among the 276):

| Temple | Current (wrong) | Correct | Source |
|---|---|---|---|
| `keezhaperumpallam-naganathaswamy` (Ketu) | "one of the Paadal Petra Sthalams" | Vaippu Sthalam | Wikipedia: "no mention of the deity, not classified as Padal Petra" |
| `thingalur-kailasanathar` (Chandran) | "a Paadal Petra Sthalam sung in the Tevaram" | Vaippu Sthalam (Tevaram) | tntemplesproject / temple guides |

Fix = change the wording (×6 locales each) **and re-run narration** for those temples
(the audio currently says "Paadal Petra"), per the CLAUDE.md audio pipeline. Because this
touches content + media, it is flagged for the owner rather than done inline here. (A
prior session corrected three other Vaippu temples; these two were missed.)

---

## The member list

The full region-by-region list of all 276 — **promoted from draft to a committed,
WebSearch-verified reference** — is in **`paadal-petra-sthalams-list.md`**, with each
region's shipped (in-catalog) members marked and the content target implied by the rest.
Membership and towns are reliable; goddess/native-name columns carry per-row `?` flags
and get verified per temple at content time.
