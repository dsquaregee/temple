# Paadal Petra Sthalams master list: notes

Companion to `pps.tsv` (same directory), which has 276 rows. Built 2026-10-14. No repo files were changed.

## Sources
Direct page fetches were blocked in this environment: shivatemples.com, Wikipedia and aanmeegam.org all failed with DNS errors or a proxy 403. So the list comes from WebSearch result text plus a reconstruction of the traditional Tamil list, "Thevara thala murai", region by region. These were checked against:
- **shivatemples.com regional indexes**, as seen in search snippets: `/pnaadu/`, `/nnaadu/`, `/tnaadu/`, `/knaadu/`, and `/sofc/scNNN` page numbers. Points confirmed: the Pandya order 1–14; the Nadu Naadu order 1–23 (Kiliyanur is nn23); Thondai 1–31 (Achirupakkam tn28, Mylapore tn23, Verkadu tn22, Irumbai tn31); Kongu kn1 Bhavani and kn4 Murugapoondi; south sc024 Pazhayarai, sc069 Karukudi, sc114 Perayil, sc120 Kanrappur, sc126 Agasthiyanpalli.
- **Ordinal checkpoints** from Wikipedia, Dinamalar and blog snippets ("Nth Shiva temple on the north/south bank of Cauvery praised in Thevaram"):
  - North: 10 Pallavaneecharam, 14 Sirkazhi, 25 Thirumanancheri, 28 Kurakkukka, 43 Thiruvisanallur, 60 Thiruvanaikaval.
  - South: 12 Kandiyur, 17 Chakkarappalli, 43 Nanipalli, 59 Pampuram, 74 Thiruvirkudi, 79 Chenkattankudi, 85 Thevur, 87/88 Thiruvarur/Araneri, 91 Karaiveeram, 94 Kudavasal, 105 Kalar, 125 Vedaranyam, 128 Thiruvidaivai.
  - Nadu Naadu: 10 Nelvennai, 15 Thiruthuraiyur, 18 Pathiripuliyur.
- **tntemplesproject.in** (infopage-pps): regional totals. **veludharan.blogspot.com**: a note that the list was earlier 274, and that Thiruvidaivai and Kiliyanur were added later. Also the Vada Nadu order. **templenet.com** and **scribd** lists were used as cross-references.
- `docs/research/03-catalog-expansion.md` and the catalog JSON in `packages/content/data/temples/en/` were used for matching.

## Numbering convention
`no` is a global serial number from 1 to 276. It joins **shivatemples.com's per-region numbering** in the traditional region order:

| Region | Count | Global `no` |
|---|---:|---|
| chola-nadu-north (Kaveri vada karai) | 63 | 1–63 |
| chola-nadu-south (Kaveri then karai) | 128 | 64–191 |
| eezha-nadu | 2 | 192–193 |
| pandya-nadu | 14 | 194–207 |
| malai-nadu | 1 | 208 |
| kongu-nadu | 7 | 209–215 |
| nadu-nadu | 23 | 216–238 |
| thondai-nadu | 32 | 239–270 |
| tulu-nadu | 1 | 271 |
| vada-nadu | 5 | 272–276 |
| **Total** | **276** | |

The regional number is `no` minus the offset (63, 191, 193, 207, 208, 215, 238, 270, 271).

Count variants in the sources:
- The classical list has 274 entries. **Thiruvidaivai** (an inscription found in 1917; south no. 128, global 191) and **Kiliyanur** (Nadu Naadu 23, global 238) were added later, which gives 276.
- tntemplesproject gives 129 for the south bank and 22 for Nadu Naadu. Other lists give 31 for Thondai and 23 for Nadu Naadu.
- shivatemples' Thondai index numbers 1–31 inside Tamil Nadu and lists Srikalahasti separately as "Andhra Pradesh (part of Thondai Naadu)". I numbered Srikalahasti as Thondai 32 (global 270).
- Pandya follows shivatemples' order: 7 Punavayil, 8 Rameswaram, 9 Adanai, 10 Kanapper, 11 Poovanam, 12 Chuzhiyal. This differs from some other lists.

## Matches already in the catalog: 41
nataraja-chidambaram, thiruvenkadu-swetaranyeswarar, vaitheeswaran-koil, veerateeswarar-korukkai, kanjanur-agneeswarar, apatsahayar-thirupazhanam, aiyarappar-thiruvaiyaru, neyyadiappar-thillaisthanam, jambukeswarar, pushpavananathar-thirupoonthuruthi, brahmasirakandeeswarar-thirukandiyur, odhanavaneswarar-thiruchotruthurai, vedapureeswarar-thiruvedhikudi, adi-kumbeswarar-kumbakonam, thirunageswaram-naganathaswamy, thiruvidaimarudur-mahalingaswamy, veerateeswarar-thirupariyalur, amritaghateswarar-thirukkadaiyur, thirunallar-dharbaranyeswarar, veerateeswarar-thiruvirkudi, kayarohanaswamy-nagapattinam, thyagaraja-thiruvarur, alangudi-apatsahayesvarar, kannayiramudayar-thirukaravasal, brahmapureeswarar-thirukkuvalai, vaimurnathar-thiruvaimur, vedaranyeswarar-vedaranyam, meenakshi-madurai, thiruparankundram-murugan (see the caveat below), ramanathaswamy-rameswaram, kutralanathar-courtallam, nellaiappar-tirunelveli, veerattaneswarar-thiruvathigai, veerattaneswarar-thirukkovilur, arunachaleswarar, ekambareswarar, thiruvalangadu-vadaranyeswarar, kapaleeshwarar-mylapore, srikalahasti, gokarna-mahabaleshwara, srisailam-mallikarjuna.

That leaves 235 rows that need a new entry. All 235 proposed ids are unique and do not collide with any existing file name. The check is scripted in `gen/build.py`.

### Catalog vs. list caveats
- **thiruparankundram-murugan** (global 196): the Tevaram hymn is about the Shiva shrine, Parangirinathar, inside the Murugan cave temple. It is matched here as "already in the catalog", but the owner may prefer to give the Shiva shrine its own entry.
- **Catalog temples that are not on the 276 list**, even though their prose says they are Paadal Petra Sthalams or Tevaram-sung:
  - **kachabeswarar-kanchipuram**: says Sundarar sang it. Sundarar's hymn is on **Thirukachur** Kachabeswarar near Singaperumalkoil (global 263, a new row). This looks like a name confusion in the catalog text.
  - **thingalur-kailasanathar**: the text says it is a Paadal Petra Sthalam. It is a Vaippu/Appoothi Adigal site and is not among the 276.
  - **keezhaperumpallam-naganathaswamy**: the text says it is a Paadal Petra Sthalam. It is not on the list.
  - **veerateeswarar-vazhuvur**: the text only says "named in the Tevaram", which is accurate for a Vaippu sthalam. It is not on the list.
  - Suryanar Koil, Papanasam (Tirunelveli), the Nava Kailasam temples, Kailasanathar Kanchipuram and Airavatesvara (Darasuram) are not on the list either.
  - Brihadeeswarar is correctly absent.
  - These prose claims in the catalog may need fixing.

## Uncertain rows (`?` in proposed_id)
- **273, Indraneelaparuppatham**: traditionally identified with a Himalayan peak near Badrinath (Neelakanth). There is no agreed physical temple. The deity and consort names are traditional.
- **274, Anekathangapatham**: traditionally placed at Gaurikund near Kedarnath. The identification is traditional, not settled.

These rows were first marked uncertain, then confirmed by search, and the `?` was removed: Pazhayarai Vadathali (Dharmapureeswarar/Vimalanayaki), Thirukarukudi = Marudhanallur, Thirupperayil = Ogaiperaiyur (Jagadeeswarar), Thirukanrapur = Kanrappur (Nadutariappar), Thirunelvennai = Neivanai, Thiruthuraiyur (Sishtagurunatheswarar).

### Other soft spots (identification is fine, but details are less certain)
- **Eezha Nadu order** (192 Koneswaram, 193 Ketheeswaram) is not confirmed against shivatemples.
- **Kongu order**: only kn1 Bhavani and kn4 Murugapoondi are confirmed. Positions 2 Tiruchengode, 3 Karur, 5 Kodumudi, 6 Avinashi and 7 Venjamakoodal follow the order shivatemples' index listed them in.
- **North positions 7–9 and 35–49, and south positions 95–124** follow the traditional Tamil order. They sit between confirmed checkpoints but were not each checked one by one.
- **Mount Kailash** (276) has no built temple. It is included because it is part of the canonical 276.
- **Two "Mayanam" sites**: Kadavur Mayanam (global 111, at Thirumeignanam near Thirukkadaiyur, Mayiladuthurai) and Nalur Mayanam (global 159, Thanjavur district). They are easy to confuse.

### Columns that need editorial verification before publishing
- **`singers`**: this is a best-effort attribution of Appar, Sambandar and Sundarar, written from the traditional record and only spot-checked (for example Kanrappur is Appar, Kiliyanur and Nelvennai are Sambandar, Thiruthuraiyur and Kodikkarai are Sundarar). Treat it as provisional until it is checked against a pathikam index such as shaivam.org.
- **`consort`**: alternate names are given in parentheses. Tamil and Sanskrit names vary between sources.
- **`district_state`**: uses current districts: Mayiladuthurai (2020), Kallakurichi, Ranipet, Chengalpattu, Tenkasi, and Tirupati (AP, 2022) for Srikalahasti.
