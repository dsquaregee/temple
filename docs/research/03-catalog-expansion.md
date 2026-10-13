# Catalog expansion — candidate circuits (2026-10)

Status: **proposal for owner review**. Baseline: 206 temples × 6 locales, 17 circuits;
every existing circuit is complete (see `02-circuit-audit.md`). Circuits remain the
organising unit — a temple enters the catalog as a member of a recognised group,
which keeps selection principled and gives every addition a Yatra page and route map.

"New" = temples not yet in `packages/content/data`. Overlaps with the shipped
catalog are listed so a circuit's real cost is visible.

## Wave A — new circuits built mostly from temples we already have (~9 new temples)

Highest value per effort: new Yatra pages with maps, little new writing.

| Circuit | Members | Already shipped | New |
|---|---|---|---|
| **Pancha Pandava temples** (Chengannur, Kerala; Mahabharata) | Thrichittatt, Puliyur, Aranmula, Thiruvanvandoor, Thrikodithanam | all 5 (`imayavarappan-thiruchenkundrur`, `mayappiran-thiruppuliyur`, `parthasarathy-aranmula`, `kamalanatha-thiruvanvandoor`, `adbhuta-narayana-thrikkodithanam`) | **0** |
| **Char Dham** (Adi Shankara's four abodes) | Badrinath, Dwarka, Puri, Rameswaram | 3 | 1 — Jagannath, Puri |
| **Trilinga Kshetras** (the three lingas that name "Telugu" land) | Srisailam, Draksharamam, Kaleshwaram | 2 | 1 — Kaleshwara Mukteswara |
| **Shakti Peethas of the South** (southern members of Adi Shankara's 18) | Kamakshi (Kanchi), Chamundeshwari, Jogulamba (Alampur), Bhramaramba (Srisailam), Puruhutika (Pithapuram), Manikyamba (Draksharamam) | 4 | 2 — Jogulamba, Pithapuram |
| **Nalambalam** (Karkidakam pilgrimage, Thrissur/Ernakulam) | Triprayar (Rama), Koodalmanikyam (Bharata), Moozhikkulam (Lakshmana), Payammal (Shatrughna) | 1 (`lakshmana-perumal-thirumoozhikkulam`) | 3 |
| **Temples of Coastal Karnataka** (curated) | Udupi, Kollur, Kukke, Gokarna, Murudeshwar, Dharmasthala, Sringeri + Kateel, Horanadu | 7 | 2 |

## Wave B — compact canonical South Indian circuits (~47 new temples)

| Circuit | Size | New | Notes |
|---|---|---|---|
| **Nava Kailasam** (Thamirabarani; Agastya) | 9 | 9 | Shaiva twin of Nava Tirupati, which we already ship; same river, one-day yatra; each shrine tied to a graha |
| **Saptha Sthanam** (Thiruvaiyaru) | 7 | 6 | Nandi's wedding procession of seven glass palanquins; Aiyarappar already shipped |
| **Ashta Veerattanam** | 8 | 8 | Shiva's eight heroic deeds; includes Thirukkadaiyur; seven are Tevaram sthalams |
| **Ahobilam Nava Narasimha** | 9 | 8 | Nine shrines in the Nallamala hills; `narasimha-ahobilam` becomes the anchor; some are reached only on foot (say so in `visit`) |
| **Alampur Navabrahma + Jogulamba** | 10 | 9 | Badami Chalukya temples on the Tungabhadra; pairs with the Badami circuit |
| **Hampi — Vijayanagara temples** (UNESCO) | ~7 | 6 | Vittala, Hazara Rama, Achyutaraya, Krishna, Kodandarama, Hemakuta group; `virupaksha-hampi` shipped |

## Wave C — large programmes (owner decision needed)

1. **Paadal Petra Sthalams** (276 Tevaram temples). This is the Shaiva counterpart of the
   Divya Desams, and the obvious flagship after them. About 191 of the 276 are in Chola Nadu.
   Ship it region by region, the way the Divya Desams were (`groups`, one page per region):
   - Pandya Nadu (14) and Kongu Nadu (7) first;
   - then Nadu Nadu and Thondai Nadu;
   - then Chola Nadu north and south of the Kaveri.
   Roughly 30–40 members are already in the catalog. That leaves **~240 new temples**,
   which needs the Discover change below first.
2. **12 Jyotirlingas.** Srisailam and Rameswaram are shipped; the other 10 are new. They are
   in Gujarat, Madhya Pradesh, Maharashtra, Uttarakhand, Uttar Pradesh and Jharkhand.
   - Very high search demand and diaspora appeal.
   - Goes beyond the South-India focus, so it needs an explicit scope decision.
   - Kedarnath could later anchor Panch Kedar or Chota Char Dham.
3. **Full 18 Shakti Peethas.** Not recommended as a single circuit:
   - Sharada Peeth is in Pakistan-administered Kashmir.
   - The Sri Lankan site is disputed.
   - The southern subset in Wave A captures the coherent part.

## Capacity and process

- **Page size.** The Discover listing grows ~2.5 KB raw (~0.35 KB gzip) per temple. The
  budget is now 600 KB raw, which leaves room for about 75 more temples, so Waves A and B fit.
  Before Wave C, Discover should server-render the first page of cards and let the client
  render the rest (planned in `docs/roadmap-next.md`). With that in place, page size stays
  flat however big the catalog grows.
- **Pipeline per wave** is the proven one:
  1. Research notes per temple, then en content, then 5 translations.
  2. Lexicon entries, then `audio.yml`, then R2 sync.
  3. `media.yml` (only=ids), then `hero-variants.yml`, then R2 sync.
  4. SW bump, then PR.
  - Budget about 1 agent wave per 5–6 temples.
- **Photos.** Small rural shrines (Nava Kailasam, Ahobilam forest shrines, Ashta
  Veerattanam) will often lack Commons photos. Per owner direction, they ship with text,
  narration and map anyway.

## Recommendation

1. Ship **Wave A** next: six new circuits for ~9 new temples, a fast and visible win.
2. Then **Wave B**: ~47 temples in 6 circuits, deepening the South-India core.
3. Decide on **Wave C** scope. The Paadal Petra Sthalams are the natural flagship, and
   need the Discover pagination change first.
