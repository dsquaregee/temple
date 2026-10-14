# Brief: Wave A/B new temples (addendum to dd-brief.md)

Follow /tmp/claude-0/-home-user-temple/2ceda9b0-f01b-5109-85ca-20088c5554aa/scratchpad/dd-brief.md (research → notes → en → 5 translations;
reader-facing wording rule; RESUME MODE; ONE temple at a time, all 6 locales before the next),
with these differences:
- Your temples (ids, names, places, circuits, notes) are in your batch section of
  /tmp/claude-0/-home-user-temple/2ceda9b0-f01b-5109-85ca-20088c5554aa/scratchpad/wab.md. Keep the given ids exactly.
- Coordinates: find each temple's own point (Wikipedia/Wikidata infobox, ASI, OSM) to ≥3 dp and
  report the source. Small shrines in one compound/village (Alampur, Hampi, Ahobilam) MUST
  each get their own distinct coordinates, not one shared village point.
- These are NOT Divya Desams. Research notes go to `docs/research/circuits/<id>.md`.
- `tradition`: as given (match how existing files phrase it: grep `ekambareswarar`,
  `kanchi-kamakshi`, `pattadakal-virupaksha`, `virupaksha-hampi`, `narasimha-ahobilam`).
- `circuits`: exactly as given in wab.md. The circuit files are maintained by the lead —
  do not edit circuit JSONs or any temple file not assigned to you.
- `unesco`: true only for temples inside a UNESCO World Heritage property (Hampi group);
  false otherwise.
- `nativeName`: local script (Tamil / Telugu / Kannada / Malayalam; Odia for Puri).
  The same nativeName string goes in all six locale files.
- Model files for style/terminology: `virupaksha-hampi`, `pattadakal-virupaksha`,
  `aihole-durga-temple`, `ekambareswarar`, `kanchi-kamakshi`, `narasimha-ahobilam`,
  `guruvayur-krishna`, `vaikom-mahadeva`, `kutralanathar-courtallam` in each locale folder.
- Monuments not in active worship: `visit` reflects a protected monument (ASI ticketing,
  hours to confirm locally), not darshan.
- Small shrines in a group (Navabrahma, Nava Narasimha, Nava Kailasam, Saptha Sthanam):
  write what is specific to THIS shrine (its form, its role in the group's legend or
  procession, its planet, its carving, its setting) and present the group context briefly;
  shorter sections are fine (history ≥ 70 words) — never pad with generic filler, and never
  copy the same paragraph across sibling temples.
- Do not run git commit/push. Ignore validate.mjs errors about ids that are not yours.
- Final report: one line per id — deity, coordinates (and source), corrections, unverified items.
