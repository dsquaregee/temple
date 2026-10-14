# Circuit audit (02): are all temples included in each circuit?

Date: 2026-10-13. Scope: the six curated circuits plus a check of the canonical circuits.
Method: read each circuit's description and `stops` in `packages/content/data/circuits/en/`, cross-checked against all temples in `packages/content/data/temples/en/` (name, `location.city`, `state`). External facts come from web searches (Wikipedia, ASI, UNESCO, Karnataka tourism and similar) and from domain knowledge where noted.

**Caveats for whoever implements this.**
- The working copy has 135 temple files. CLAUDE.md says 191, so `ls` the data dir before creating anything. Another branch may already hold some of the "NEW" temples below.
- Wikipedia's API was unreachable from the sandbox. Every NEW-temple coordinate below is approximate, good to about 1-3 km, and written from memory. Replace each with the Wikipedia infobox or ASI value before shipping, to 4 decimals.
- Dates for early Chalukya, Pandya and Kerala temples are scholarly ranges. Write them as "c." ranges in the content.

---

## 1. badami-chalukya-monuments

**Current stops (3):** `aihole-durga-temple`, `badami-cave-temples`, `pattadakal-virupaksha`.

**Theme.** The Chalukya "cradle" at Aihole, the cave-temple capital at Badami, and the UNESCO ensemble at Pattadakal. The circuit text says "royal ensemble of finished temples", but the stops give Pattadakal only one temple and Aihole only one.

**What defines each site.**
- **Pattadakal (UNESCO 1987).** Ten major monuments: nine Shiva temples and one Jain temple. They are Kadasiddheshwara, Jambulinga, Galaganatha, Chandrashekhara, Sangameshwara, Mallikarjuna, Papanatha, Kashivishvanatha, Virupaksha and the Jain Narayana shrine ([ASI](https://asi.nic.in/pages/WorldHeritagePattadakal), [UNESCO](https://whc.unesco.org/document/153022), [Bagalkot district](https://bagalkot.nic.in/?p=26286)).
  - Sangameshwara is the oldest, c. 696-733 (Vijayaditya Satyashraya). Virupaksha is c. 740-745. Mallikarjuna is c. 733-745. Both of those two are Dravida vimanas.
  - Papanatha (c. 680 or later) is the Nagara-style experiment, set apart toward the village.
  - The Jain Narayana is a 9th-century Rashtrakuta-era addition.
  - The ASI groups the Dravida-style Virupaksha, Mallikarjuna and Sangameshwara together, and the Nagara-style Kadasiddheshwara, Jambulinga, Galaganatha, Kashivishvanatha and Papanatha together.
- **Aihole.** About 120 monuments. The standard principal set is the Durga temple (late 7th to early 8th century), the Lad Khan temple (a Chalukya-period hall, dated variously from c. 450 to the 8th century), the Ravana Phadi rock-cut Shiva cave (6th century), the Meguti Jain temple (dated by inscription to 634) and the Hucchappayya Matha. ([Karnataka Tourism](https://www.karnatakatourism.org/tour-item/aihole/), [Bagalkot district](https://bagalkot.nic.in/en/tourist-place/aihole/).)
- **Badami.** Four caves (Shaiva, two Vaishnava, Jain; c. 6th century), the Bhutanatha group on Agastya Lake, the Upper and Lower Shivalaya, and the Malegitti Shivalaya. The living Banashankari (Shakambhari) temple is 5 km away at Cholachagudda.
- **Mahakuta.** About 15 km from Badami. A tank-side 7th-century group, with Mahakuteshwara the main shrine.

**Recommended membership (about 9), grouped by site:**
1. Aihole: Durga temple (existing)
2. Aihole: Lad Khan temple (NEW)
3. Badami: Cave Temples (existing)
4. Badami: Bhutanatha group (NEW)
5. Mahakuta group (NEW; optional but recommended, since it sits on the Badami-Pattadakal road)
6. Pattadakal: Virupaksha (existing)
7. Pattadakal: Sangameshwara (NEW)
8. Pattadakal: Papanatha (NEW)
9. Banashankari, Cholachagudda (NEW; the living temple)

**Tier-2, not recommended for now.** Aihole's Ravana Phadi and Meguti Jain temple, Pattadakal's Mallikarjuna, Kashivishvanatha and Jain Narayana, and the Badami Upper and Lower Shivalaya. These are either cave or ASI-site detail that fits better as sections inside the parent pages.

**Catalog ids to add:** none. Every other Karnataka temple in the catalog is Hoysala, Mysuru, Udupi or similar, and none is Chalukya.

**Notes.**
- `aihole-durga-temple` and `pattadakal-virupaksha` are single-temple records standing in for sites. Keep them as they are and add the new ones beside them.
- A circuit page with 3 pins forms a thin map. At 9 stops it works well.

---

## 2. kakatiya-temples

**Current stops (2):** `thousand-pillar-warangal` (1163), `ramappa-palampet` (1213; UNESCO 2021).

**Theme.** "Star-shaped platforms, black basalt, lathe-turned pillars", "set in the countryside around Warangal", and "an easy day" of one another.

**Candidate Kakatiya temples:**

| Temple | Place | Date | Note |
|---|---|---|---|
| Kota Gullu (Ghanpur group) | Ghanpur/Ganapuram, Jayashankar Bhupalpally | c. 1234-1235 for the main Ganapeswara shrine; built under Ganapatideva (r. 1199-1262), by the Recherla chief Ganapati Reddy | Walled complex of about 22 shrines, about 9 km from Ramappa ([Wikipedia](https://en.wikipedia.org/wiki/Kota_Gullu), [Deccan Chronicle](https://www.deccanchronicle.com/southern-states/telangana/kota-gullu-a-forgotten-kakatiya-masterpiece-waiting-to-be-rediscovered-1981415)). Best fit for the theme. |
| Pillalamarri Erakeswara/Trikuta temples | Pillalamarri, Suryapet | early 13th century (c. 1200-1250; the "Erakeswara" shrine is attributed to Recherla Rudra's circle, not firmly dated) | Famous for fine carving. About 140 km from Warangal, so it does not fit "around Warangal". |
| Nagulapadu / Kusumanchi Ganapeswara | Nagulapadu (Khammam); Kusumanchi (Suryapet) | 13th century | Minor, and far from Warangal. |
| Warangal Fort remains, Swayambhu temple | Warangal | 13th century | Ruins. The Kakatiya Kala Thoranam gateway is the symbol of Telangana. |
| Bhadrakali Temple | Warangal | Traditionally 625 CE; Kakatiya patronage | Living temple, but its dating is disputed. |
| Mulugu Ghanpur and Palampet lake | Palampet | 1213 | Part of Ramappa, not separate. |

**Recommendation (4-5 stops, in two tiers).**
1. Thousand Pillar Temple, Hanamkonda (existing; 1163, Rudradeva)
2. Ramappa, Palampet (existing; 1213, Recherla Rudra under Ganapatideva)
3. Kota Gullu, Ghanpur (NEW; c. 1234)
4. Bhadrakali, Warangal (optional)
5. Pillalamarri (NEW; optional)

For a locally coherent day-trip circuit, the first three suffice. Pillalamarri and the Warangal Fort are a second-day extension. I created Pillalamarri in the tier-1 NEW list so the circuit has four stops. Drop it if the catalog target is tight.

**Catalog ids to add:** none. `bhadrachalam-rama` and `basara-saraswati` are Telangana but Godavari-belt temples, and they are not Kakatiya.

---

## 3. temples-of-kanchipuram

**Current stops (3):** `ekambareswarar`, `kailasanathar-kanchipuram`, `kanchi-kamakshi`.

**Theme.** "City of a thousand temples", "Pallava capital", "three greatest shrines in a short drive." The description names these three specifically. The title, though, claims the city's temples, and Vishnu Kanchi (Varadaraja, Vaikunta Perumal) is the Pallava capital's other pole.

**Catalog temples already in Kanchipuram or its Thoopul/Thiruputkuzhi outskirts:**

| Id | Temple | Role |
|---|---|---|
| `varadaraja-perumal-kanchipuram` | Varadaraja Perumal (Hastigiri; Divya Desam; Vijayanagara hall of 100 pillars) | **Add. Major.** |
| `vaikunta-perumal-kanchipuram` | Vaikunta Perumal (Pallava, c. 8th century, Nandivarman II) | **Add. Major.** Pallava masterpiece. |
| `ulagalantha-thiruooragam` | Ulagalantha Perumal (Thiruooragam) | **Add.** Divya Desam in the Kanchi core, with a tall Trivikrama image. |
| `ashtabhujakara-kanchipuram` | Ashtabhuja Perumal | **Add.** Divya Desam. |
| `pandavadoothar-thiruppadagam` | Pandava Thoothar | Add as secondary. |
| `adi-varaha-thirukkalvanur` | Shrine inside the Kamakshi temple | Not a separate stop; covered by `kanchi-kamakshi`. |
| `jagadeeshwara-thiruneeragam`, `karunakara-thirukkaragam`, `kalvar-thirukkarvanam`, `nilathingal-thundathan-kanchipuram`, `pavalavannar-kanchipuram`, `mukunda-nayaka-thiruvelukkai`, `yathothkari-thiruvekka` | Small Divya Desam shrines (several within the Ulagalantha complex or nearby) | Do **not** add to this circuit. They are 108-Divya-Desam entries. Link them from a "Kanchi Divya Desams" sub-section instead. |
| `deepaprakasa-thiruthanka` (Thoopul) | Divya Desam; birthplace of Vedanta Desika | Optional. About 4 km from Kanchi. |
| `vijayaraghava-thiruputkuzhi` | Thiruputkuzhi | Not in the city; leave out. |

**Missing from the catalog entirely.**
- **Kachabeswarar (Kachapeshwarar) Temple, Kanchipuram (NEW).** A Tevaram Vaippu Sthalam (mentioned by Appar; not one of the 276 Paadal Petra Sthalams, and distinct from the Kachabeswarar temple at Thirukachur sung by Sundarar) and one of the main Shiva temples of the city. It is the home of the Kanda Puranam tradition (Kachiyappa Sivachariyar).
- **Kumarakottam Murugan Temple (NEW; tier-2).** The home of Kachiyappa's Kanda Puranam.
- **Mukteswara and Matangeswara Pallava temples.** Minor Pallava shrines; leave out.
- **Kanchi Kamakoti Peetham.** A matha, not a temple; leave out.

**Recommended membership (6-7):** ekambareswarar, kailasanathar-kanchipuram, kanchi-kamakshi, **varadaraja-perumal-kanchipuram**, **vaikunta-perumal-kanchipuram**, **ulagalantha-thiruooragam**, NEW Kachabeswarar. Add `ashtabhujakara-kanchipuram` if an 8th stop is wanted.

---

## 4. sacred-temples-of-kerala

**Current stops (5):** `chottanikkara-bhagavathy`, `vaikom-mahadeva`, `ettumanoor-mahadeva`, `ambalappuzha-krishna`, `sabarimala-ayyappa`.

**Theme.** "Great living shrines of Kerala: Shiva, Devi, Krishna and Ayyappa." The description says "five of the state's most revered", but it also mentions Kaduthuruthy as the third temple of the Vaikathashtami trio, and that temple is not a stop.

**Kerala catalog temples (state = Kerala):** adbhuta-narayana-thrikkodithanam, ambalappuzha-krishna, attukal-bhagavathy, chottanikkara-bhagavathy, ettumanoor-mahadeva, guruvayur-krishna, imayavarappan-thiruchenkundrur, kamalanatha-thiruvanvandoor, lakshmana-perumal-thirumoozhikkulam, mayappiran-thiruppuliyur, navamukunda-thirunavaya, padmanabhaswamy-thiruvananthapuram, parthasarathy-aranmula, sabarimala-ayyappa, sreevallabha-thiruvalla, uyyavanda-thirumittakode, vadakkunnathan-thrissur, vaikom-mahadeva, vamana-thrikkakara. Most of the Vishnu temples in this list (Thrikkodithanam, Thiruchenkundrur, Thiruvanvandoor, Thirumoozhikkulam, Thiruppuliyur, Thirunavaya, Thiruvalla, Thirumittakode, Thrikkakara) are Divya Desams and belong to that circuit.

**Missing from the circuit but already in the catalog (ADD):**
- `guruvayur-krishna` (Krishna; the foremost Krishna temple of Kerala)
- `padmanabhaswamy-thiruvananthapuram` (Vishnu; the best-known temple of the state)
- `vadakkunnathan-thrissur` (Shiva; Thrissur Pooram)
- `attukal-bhagavathy` (Devi; the Attukal Pongala)
- `parthasarathy-aranmula` (Krishna as Arjuna's charioteer; the Aranmula Valla Sadya and the boat race. Optional.)

All of these fit the four-way theme (Shiva, Devi, Krishna, Ayyappa) or the "great living shrines" claim. The other Divya Desam temples (Thiruvalla Sreevallabha, Thrikkakara Vamana and so on) stay in the Divya Desams circuit.

**Missing from the catalog, genuinely important (NEW):**
- **Kodungallur Kurumba Bhagavathy Temple** (Bhadrakali/Kurumba Amma; the Bharani festival; one of the oldest Devi temples).
- **Kaduthuruthy Thaliyil Mahadeva Temple** (the third of the Vaikathashtami trio; the description already refers to it).
- Tier-2: Thiruvanchikulam Mahadeva (Kodungallur; Chera-era Shiva), Poornathrayeesa Thrippunithura (the temple of the Kochi royal family), Rajarajeshwara Taliparamba, Thirunelli (Western Ghats Vishnu), Mannarasala Nagaraja, Haripad and Chettikulangara. None is essential.

**Recommended membership (10):** the 5 existing + guruvayur, padmanabhaswamy, vadakkunnathan, attukal, parthasarathy-aranmula, and NEW Kodungallur and Kaduthuruthy (12 in all if both are created).

---

## 5. temples-of-the-deep-south

**Current stops (5):** `ramanathaswamy-rameswaram`, `nellaiappar-tirunelveli`, `thiruchendur-murugan`, `suchindram-thanumalayan`, `kanyakumari-bhagavathy`.

**Theme.** The old pilgrim road to the land's end, from Rameswaram through Tirunelveli and Thiruchendur to Suchindram and Kanyakumari.

**Catalog candidates:**
- `kutralanathar-courtallam` (the Chitra Sabha of the five Sabhais, a Pandya-region Shiva temple in the Western Ghats, about 55 km from Tirunelveli). **Add.**
- `meenakshi-madurai` (the road between Rameswaram and Tirunelveli passes Madurai; essential in practice, though the description skips it). **Add.**
- `adikesava-thiruvattar` (Kanyakumari district; a 9th-century-origin Divya Desam of Kerala-style architecture) and `thiruvazhmarban-thiruppathisaram`. **Add** the first; the second is optional.
- Not recommended here: the Nava Tirupati temples (they have their own circuit), `nambi-thirukkurungudi` and `thothadrinatha-vanamamalai` (Divya Desams).

**Missing from the catalog (NEW):**
- **Sankaranarayanar Temple, Sankarankovil** (the Hari-Hara temple; a Pandya foundation, c. 9th-11th century with later Nayak work; one of the principal temples of the Tirunelveli region).
- Tier-2: Kazhugumalai Vettuvan Koil (an 8th-century rock-cut Pandya temple), Nagaraja Temple at Nagercoil, Kasi Viswanathar at Tenkasi, Krishnapuram, Kalakkad.

**Recommended membership (8-9):** the 5 existing + meenakshi-madurai, kutralanathar-courtallam, adikesava-thiruvattar, NEW Sankarankovil.

---

## 6. kaveri-delta-temple-towns

**Current stops (6):** `brihadeeswarar`, `gangaikonda-cholapuram`, `airavatesvara`, `sarangapani-kumbakonam`, `thyagaraja-thiruvarur`, `ranganathaswamy-srirangam`.

**Theme.** "No stretch of India is more densely woven with living temples." The circuit's own text names Thanjavur, Gangaikonda Cholapuram, Darasuram, Kumbakonam, Thiruvarur and Srirangam. Kumbakonam is represented only by Sarangapani, and no Shaiva temple of Kumbakonam appears.

**Catalog temples that fit and are missing (ADD):**
- `jambukeswarar` (Thiruvanaikaval, an island-neighbour of Srirangam; Pancha Bhoota water temple)
- `thiruvidaimarudur-mahalingaswamy` (the "Madhyarjuna" Shaiva temple, a big Thevaram site near Kumbakonam)
- `swamimalai-murugan` (Arupadai Veedu near Kumbakonam)
- `oppiliappan-thiruvinnagar` and `thirunageswaram-naganathaswamy` (Thirunageswaram; Rahu and Vishnu temples)
- `neelamega-thanjavur` (the Thanjavur Divya Desam)
- `nataraja-chidambaram` (optional; it lies on the Kollidam, the northern edge of the delta)
- `thingalur-kailasanathar`, `suryanar-koil`, `kapisthalam`, `amaruviappan-therazhundur` (Kamban's birthplace) are optional extras, and the Navagraha temples already have their own circuit.

**Missing from the catalog (NEW):**
- **Adi Kumbeswarar Temple, Kumbakonam** (Shiva as Kumbeswarar, the principal Shaiva temple of the town, a Chola-era foundation with Nayak expansion, 7th-century Thevaram).
- **Aiyarappar (Panchanadeeswarar) Temple, Thiruvaiyaru** (Shiva; the Saptasthanam centre; the Thyagaraja Aradhana is held on the Kaveri bank next door; Chola era, 9th century or earlier).
- **Kampahareswarar (Sarabeswara) Temple, Thirubuvanam (Tribhuvanam)** (the late Chola temple of Kulottunga III, 1176-1216, a counterpart to Darasuram; a leading candidate for UNESCO extension).
- Tier-2: Chakrapani and Ramaswamy (Kumbakonam), Patteeswaram Durga, Thirukkadaiyur Amritaghateswarar, Mayuranathar (Mayiladuthurai), Nageswaran Kumbakonam, Kasi Viswanathar Kumbakonam.

**Recommended membership (about 14):** the 6 existing + jambukeswarar, thiruvidaimarudur-mahalingaswamy, swamimalai-murugan, thirunageswaram-naganathaswamy, oppiliappan-thiruvinnagar, neelamega-thanjavur, and NEW Adi Kumbeswarar, Aiyarappar, Kampahareswarar.

---

## 7. Canonical circuits

| Circuit | Verdict |
|---|---|
| pancha-bhoota-sthalams | Complete (Kanchi, Thiruvanaikaval, Thiruvannamalai, Srikalahasti, Chidambaram). |
| pancha-sabhai-sthalams | Complete (Chidambaram, Madurai, Tirunelveli, Thiruvalangadu, Courtallam). |
| pancharama-kshetras | Complete (Amaravati, Draksharama, Samalkota, Palakollu, Bhimavaram). |
| sapta-vidanga-sthalams | Complete (Thiruvarur, Nagapattinam, Thirukkaravasal, Thirukkuvalai, Thiruvaimur, Thirunallar, Vedaranyam). |
| navagraha-temples | Complete (9). |
| nava-tirupati | Complete (9, with the twin Irattai Tirupati). |
| arupadai-veedu | Complete (6). Variant: the classical Tirumurugarruppadai text lists **Tirupparamkunram, Tiruchendur, Tiruvavinankudi (Palani), Tiruveragam (Swamimalai), Kunrutoradal (hill shrines, usually Thiruttani) and Pazhamudircholai**. The catalog's list is the standard modern one, and it should stay. |
| sacred-ensembles-of-the-hoysalas | Complete as the UNESCO listing (Belur, Halebidu, Somanathapura). |
| great-living-chola-temples | Complete (Thanjavur, Gangaikonda Cholapuram, Darasuram). Tribhuvanam is an extension candidate, not a member. |
| pancharanga-kshetrams | See below. |

**Pancharanga variants.** The five temples in the circuit are Srirangapatna (Adi Ranga), Shivanasamudra (Madhya Ranga), Srirangam (Antya Ranga), Koviladi/Appakkudathaan (Appalarangam) and Tiruindalur/Parimala Ranganatha. That matches the usual Wikipedia list ([Wikipedia](https://en.wikipedia.org/wiki/Pancharanga_Kshetrams)). The variants are:
- Some traditions replace Shivanasamudra, or the last slot, with **Sarangapani at Kumbakonam**, or with a "Vatarangam".
- A 2003 forum list drops Shivanasamudra and treats Kumbakonam and Indalur separately ([SriPedia archive](https://www.ibiblio.org/sripedia/srirangasri/archives/dec03/msg00082.html)).
- One Wikipedia table lists Nellore, which looks like an outlier.

Recommendation: keep the current five. `sarangapani-kumbakonam` is already in the catalog, so add a one-line note on the circuit page: "some traditions name Sarangapani (Kumbakonam) for the fifth slot". No new stops.

---

## NEW temples to create (15, tier 1)

Coordinates are approximate and must be verified against Wikipedia or ASI.

| # | Suggested id | Name | Place, state | Approx. lat, lng | Deity | Dynasty and date | Circuit |
|---|---|---|---|---|---|---|---|
| 1 | `lad-khan-aihole` | Lad Khan Temple | Aihole, Karnataka | 15.9503, 75.8789 | Shiva (originally Surya) | Early Chalukya, c. 5th-8th century (disputed) | Badami |
| 2 | `bhutanatha-badami` | Bhutanatha Temples | Badami, Karnataka | 15.9206, 75.6866 | Shiva | Early Chalukya, 7th-8th century (later additions) | Badami |
| 3 | `mahakuta-temples` | Mahakuta Group (Mahakuteshwara) | Mahakuta, near Badami, Karnataka | 15.9347, 75.7336 | Shiva | Early Chalukya, 7th century | Badami |
| 4 | `sangameshwara-pattadakal` | Sangameshwara (Vijayeshvara) Temple | Pattadakal, Karnataka | 15.9486, 75.8166 | Shiva | Chalukya, Vijayaditya, c. 696-733 | Badami |
| 5 | `papanatha-pattadakal` | Papanatha Temple | Pattadakal, Karnataka | 15.9475, 75.8185 | Shiva | Chalukya, c. 680-8th century | Badami |
| 6 | `banashankari-badami` | Banashankari (Shakambari) Temple | Cholachagudda, Karnataka | 15.8797, 75.7060 | Banashankari/Shakambari (Parvati) | Chalukya origin; present building 18th century (Maratha) | Badami |
| 7 | `kota-gullu-ghanpur` | Kota Gullu (Ghanpur Temples) | Ghanpur/Ganapuram, Telangana | 18.3150, 79.9000 | Shiva (Ganapeswara) | Kakatiya, c. 1234 | Kakatiya |
| 8 | `pillalamarri-erakeswara` | Pillalamarri Erakeswara Temple | Pillalamarri, Suryapet, Telangana | 17.1396, 79.6234 | Shiva | Kakatiya, early 13th century | Kakatiya |
| 9 | `kachabeswarar-kanchipuram` | Kachabeswarar (Kachapeshwarar) Temple | Kanchipuram, Tamil Nadu | 12.8392, 79.7042 | Shiva | Pallava origin; later Chola and Vijayanagara additions (7th-16th century) | Kanchipuram |
| 10 | `kodungallur-bhagavathy` | Kodungallur Kurumba Bhagavathy Temple | Kodungallur, Kerala | 10.2270, 76.1960 | Bhadrakali (Kurumba Amma) | Chera-era tradition; present form medieval | Kerala |
| 11 | `kaduthuruthy-thaliyil-mahadeva` | Kaduthuruthy Thaliyil Mahadeva Temple | Kaduthuruthy, Kerala | 9.7500, 76.4333 | Shiva | Medieval Kerala (undated) | Kerala |
| 12 | `adi-kumbeswarar-kumbakonam` | Adi Kumbeswarar Temple | Kumbakonam, Tamil Nadu | 10.9587, 79.3797 | Shiva (Kumbeswarar) with Mangalambikai | Chola; Nayak additions; 7th-century Thevaram | Kaveri delta |
| 13 | `aiyarappar-thiruvaiyaru` | Aiyarappar (Panchanadeeswarar) Temple | Thiruvaiyaru, Tamil Nadu | 10.8783, 79.1045 | Shiva (Aiyarappar), Dharmasamvardhini | Chola, 9th century or earlier | Kaveri delta |
| 14 | `kampahareswarar-thirubuvanam` | Kampahareswarar (Sarabeswara) Temple | Thirubuvanam, Tamil Nadu | 10.9810, 79.4400 | Shiva | Late Chola, Kulottunga III, 1176-1216 | Kaveri delta |
| 15 | `sankaranarayanar-sankarankovil` | Sankaranarayanar Temple | Sankarankovil, Tamil Nadu | 9.1716, 77.5422 | Hari-Hara (Shiva-Vishnu) with Gomathi Amman | Pandya (Ukkira Pandiyan), c. 9th-11th century; Nayak gopuram | Deep south |

**Tier-2 (only if the owner wants more):** Kumarakottam Murugan, Kanchipuram; Meguti Jain temple and Ravana Phadi, Aihole; Mallikarjuna and Kashivishvanatha, Pattadakal; Thiruvanchikulam, Kodungallur; Poornathrayeesa, Thrippunithura; Chakrapani, Kumbakonam; Kazhugumalai Vettuvan Koil; Bhadrakali, Warangal.

---

## Summary of recommended changes

**Catalog ids to ADD to existing circuits (24).**
- **temples-of-kanchipuram (3):** varadaraja-perumal-kanchipuram, vaikunta-perumal-kanchipuram, ulagalantha-thiruooragam (optional 4th: ashtabhujakara-kanchipuram).
- **sacred-temples-of-kerala (5):** guruvayur-krishna, padmanabhaswamy-thiruvananthapuram, vadakkunnathan-thrissur, attukal-bhagavathy, parthasarathy-aranmula.
- **temples-of-the-deep-south (3):** meenakshi-madurai, kutralanathar-courtallam, adikesava-thiruvattar.
- **kaveri-delta-temple-towns (6):** jambukeswarar, thiruvidaimarudur-mahalingaswamy, swamimalai-murugan, thirunageswaram-naganathaswamy, oppiliappan-thiruvinnagar, neelamega-thanjavur.
- **badami-chalukya-monuments and kakatiya-temples:** no existing ids to add.

**NEW temples to create: 15** (table above), plus attach each to its circuit's `stops` and the temple's `circuits` (kept in sync by `validate.mjs`). Resulting sizes: Badami 9, Kakatiya 4, Kanchipuram 7, Kerala 12, Deep South 9, Kaveri delta 15. Because the Kaveri-delta circuit would pass 12 stops, it renders compact numbered dots (per CLAUDE.md).

**Canonical circuits:** no membership changes. Add a variant note to pancharanga-kshetrams (Sarangapani, Kumbakonam, in some traditions' fifth slot) and to arupadai-veedu (Kunrutoradal).

**Caveats to resolve before building.**
1. Coordinates for all 15 NEW temples need infobox verification.
2. Check the data dir for the 191-temple catalog (CLAUDE.md) before creating anything, since some NEW temples may already exist there.
3. New temples need research notes, 6 locales and media, so each new temple has a real cost. Consider shipping tier 1 in two batches: Badami and Kakatiya first (the circuits with 2-3 stops), then the rest.

Sources: [Wikipedia: Kota Gullu](https://en.wikipedia.org/wiki/Kota_Gullu); [ASI: Pattadakal](https://asi.nic.in/pages/WorldHeritagePattadakal); [UNESCO: Pattadakal](https://whc.unesco.org/document/153022); [Bagalkot district: Aihole](https://bagalkot.nic.in/en/tourist-place/aihole/); [Karnataka Tourism: Aihole](https://www.karnatakatourism.org/tour-item/aihole/); [Wikipedia: Pancharanga Kshetrams](https://en.wikipedia.org/wiki/Pancharanga_Kshetrams); [Wikipedia: Temples of Telangana](https://en.wikipedia.org/wiki/Temples_of_Telangana). Kerala, Kanchipuram, Kaveri-delta and deep-south entries rest on domain knowledge and were not individually confirmed by search.
