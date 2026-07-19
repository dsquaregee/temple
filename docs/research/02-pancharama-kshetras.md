# Catalog expansion — the Pancharama Kshetras

The Phase-1 synthesis (`00-research-synthesis.md`) named the **Pancharama
Kshetras** as a first-class circuit worth carrying, alongside the Pancha Bhoota
Sthalams and the Divya Desams, but the 42-temple launch catalog did not build
them out. This note records the five temples and the standard applied, so the
expansion is grounded the same way the 42 are.

The Pancharama Kshetras are five ancient Shiva temples of coastal Andhra
Pradesh — the Krishna and Godavari deltas — bound together by a single legend
and, historically, by the temple-building of the Eastern Chalukyas of Vengi
(and later renovators). They are a canonical, closed set of exactly five, which
is why they research cleanly as one circuit rather than an open-ended tag.

## The five (new circuit `pancharama-kshetras`)

| # | id | Temple / deity | Place | State |
|---|----|----------------|-------|-------|
| 1 | `amararama-amaravati` | Amareswara Swamy (Shiva) | Amaravati, Palnadu (on the Krishna) | Andhra Pradesh |
| 2 | `somarama-bhimavaram` | Someswara Swamy (Shiva) | Gunupudi, Bhimavaram, West Godavari | Andhra Pradesh |
| 3 | `ksheerarama-palakollu` | Ksheera Ramalingeswara Swamy (Shiva) | Palakollu, West Godavari | Andhra Pradesh |
| 4 | `draksharama-bhimeswara` | Bhimeswara Swamy (Shiva) | Draksharamam, Konaseema (East Godavari) | Andhra Pradesh |
| 5 | `kumararama-samalkota` | Kumara Bhimeswara Swamy (Shiva) | Samalkota (Samarlakota), Kakinada dist. | Andhra Pradesh |

Distinctive, well-documented facts carried into the content:

- **Amararama** — a tall white lingam so high that the upper part is worshipped
  from an upstairs level; associated with Indra and the devas (*amara* = the
  deathless ones); set above the Krishna at ancient Amaravati, the old Satavahana
  capital. Long a living kshetra; the visible temple owes much to the
  eighteenth-century patronage of Vasireddy Venkatadri Nayudu.
- **Somarama** — the lingam is said to change hue with the phases of the moon
  (pale at full moon, dark at new moon); associated with Chandra, the moon god;
  an upstairs shrine to the goddess (Annapurna / Rajarajeswari). At Gunupudi,
  Bhimavaram.
- **Ksheerarama** — a milk-white lingam (*ksheera* = milk), linked in legend to
  Vishnu and to Rama; crowned by one of the tallest gopurams in the Godavari
  country (about nine storeys). At Palakollu.
- **Draksharama** — a great two-tiered shrine around a very tall lingam, built by
  the Eastern Chalukyas of Vengi (Bhima I, c. 9th–10th century). The site is also
  the **Manikyamba Shakti Peetha**, one of the eighteen Maha Shakti Peethas, so
  Shakti worship stands beside Shiva here.
- **Kumararama** — at Samalkota; built by the Eastern Chalukya king Chalukya
  Bhima I (c. late 9th–early 10th century) and said to be installed by Kumara
  Swamy (Kartikeya) himself, hence *Kumara* Bhimeswara; a two-storey structure
  with a hundred-pillar hall.

## The uniting legend

All five share one story. The demon **Tarakasura** wore a Shiva lingam
(*atma-linga*) at his throat that made him all but invincible. When
**Kumara Swamy** (Kartikeya / Subrahmanya, the same Murugan of the Arupadai
Veedu) slew him, the lingam could not be destroyed; on divine counsel it was
broken, and the pieces flew apart to five places in the Telugu country. Each
fragment set itself in the earth and the gods fixed and consecrated it — the
five became the Pancharama Kshetras. The thread from Kumara Swamy ties this
circuit quietly to the six abodes of Murugan already in the catalog.

## Fields fixed for the build

- **Tradition**: Shaivism (Draksharama additionally honoured as a Shakti Peetha,
  noted in its prose but tradition kept as Shaivism for the primary deity).
- **Style**: Dravidian (Vengi Chalukya lineage; later Vijayanagara/Nayaka and
  modern renovation on several).
- **Century** (single representative integer per the schema): the Chalukya-era
  foundations place the set in the classical bucket — Draksharama and Kumararama
  at 10 (Eastern Chalukya), Somarama and Ksheerarama at 11, Amararama at 11
  (medieval kshetra, eighteenth-century development noted in `period` prose).
- **unesco**: false for all; **circuits**: `["pancharama-kshetras"]` for all.
- Coordinates are the temple locations in the Krishna/Godavari deltas.

## Standard (same as the shipped 42)

Each temple ships in all six locales (`en ta te kn ml hi`) with original,
reverent editorial prose (summary + history, architecture, legends, festivals,
experience; visit guidance), facts grounded in well-established history, a
generated hero placeholder, and must pass the content validator, translation QA
(target-script prose), the unit suite, the web build + performance budget, and a
headless-browser render check. Telugu leads as the regional language (native
names are in Telugu). Non-English prose is a careful draft under the owner's
standing translation sign-off.

This brings the catalog to **47 temples across 9 circuits**.
