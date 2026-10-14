# Brief: Paadal Petra Sthalams (Tevaram temples) — addendum to dd-brief.md

Follow /tmp/claude-0/-home-user-temple/2ceda9b0-f01b-5109-85ca-20088c5554aa/scratchpad/dd-brief.md (research → notes → en → 5 translations;
reader-facing wording rule; RESUME MODE; ONE temple at a time, all 6 locales before the next),
with these differences:
- Your rows are in your batch section of /tmp/claude-0/-home-user-temple/2ceda9b0-f01b-5109-85ca-20088c5554aa/scratchpad/pps-batches.md (columns from pps.tsv:
  no, region, place, temple, deity, consort, district/state, singers, id). Keep the given id exactly.
  The master list is a reconstruction: CONFIRM deity, consort, singers and place with your own
  search; if a row's facts are wrong, use the correct facts and note the correction.
- These are Shiva temples sung in the Tevaram (Appar, Sambandar, Sundarar). Say it is one of the
  276 Paadal Petra Sthalams and name its Tevaram region (e.g. "a Paadal Petra Sthalam of Thondai
  Nadu"). Name the singers only as confirmed; a pathigam count only if reliably stated.
- Research notes → `docs/research/paadal-petra/<id>.md`.
- `tradition`: "Shaivism". `unesco`: false. `circuits`: ["paadal-petra-sthalams"].
  `century`: earliest firm attestation — 7 for Appar/Sambandar hymns, 8 if only Sundarar sang it,
  earlier only if an inscription or structure is firmly older.
- `nativeName`: Tamil for Tamil Nadu and Puducherry and for the Sri Lankan temples; Malayalam for
  Kerala; Kannada for Karnataka; Telugu for Andhra Pradesh; Devanagari for North India and Tibet.
- Coordinates: the temple's own point (Wikipedia/Wikidata infobox, map listings) to ≥3 dp; never
  reuse the point of a different temple in the same town (many towns also have a Divya Desam —
  check `packages/content/data/temples/en/` for same-town entries and keep yours distinct).
  Report how each coordinate was obtained.
- Model files: `veerateeswarar-korukkai`, `apatsahayar-thirupazhanam`, `ekambareswarar`,
  `kapaleeshwarar-mylapore`, `thiruvalangadu-vadaranyeswarar` in each locale folder.
- Special rows: Sri Lankan temples (Koneswaram, Ketheeswaram) — `location.state` "Eastern
  Province, Sri Lanka" / "Northern Province, Sri Lanka", purely devotional and historical, no
  politics. Mount Kailash — a sacred mountain, not a built temple; `location.state` "Tibet
  Autonomous Region, China"; present the Tevaram tradition (Appar's journey) and the Kailash
  Mansarovar pilgrimage neutrally. Rows marked `?` — present the traditional identification as
  tradition ("tradition places…").
- Small village temples: shorter sections are fine (history ≥ 70 words); never pad, never copy
  paragraphs across temples; write what is specific to this shrine (its legend, its saint, its
  form, its tank, its inscriptions).
- Do not edit circuit files or any temple not assigned to you. Do not commit.
- Final report: one line per id — deity/consort, singers, coordinates (and source),
  corrections, unverified items.
