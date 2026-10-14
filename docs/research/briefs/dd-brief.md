# Brief: adding Divya Desam temples to the Temple app catalog

You are adding a batch of the **108 Divya Desams** (the abodes of Vishnu sung by the
twelve Alvars in the Nalayira Divya Prabandham) to a reverent, editorial temple app.
Repo: `/home/user/temple`. The master list of all Divya Desams (region, id,
traditional name, place) is `/tmp/claude-0/-home-user-temple/2ceda9b0-f01b-5109-85ca-20088c5554aa/scratchpad/dd.tsv`.
You own ONLY the ids assigned to you. Do not create, edit or delete any other file
(not circuits, not other temples, not scripts). Do not run git commit/push.

## 1. Research each temple first (required)

Use WebSearch (Wikipedia, temple/HR&CE/Devaswom sites, reputable references). WebFetch
may fail for some domains — rely on WebSearch result text when it does. For each
temple establish, with sources:
- presiding deity name(s) (moolavar/utsavar) and the consort (Thayar/Nachiyar), as
  locally named; posture (standing / seated / reclining) and facing direction if known;
- which Alvars sang it (mangalasasanam) and, if reliably stated, the pasuram count;
- precise coordinates (decimal degrees, ≥3 dp — e.g. from the Wikipedia infobox);
- history: dynasties, inscriptions, notable patrons, age as attested;
- architecture: vimana name, gopuram (tiers), temple tank (pushkarani) name, notable halls;
- the sthala purana / legends associated with the shrine;
- main festivals (Brahmotsavam month, Vaikunta Ekadashi, special local festivals).
Write the notes to `docs/research/divya-desams/<id>.md` (bullet facts + a "Sources"
list of URLs). **Never invent facts.** If something can't be confirmed, leave it out
or phrase it as tradition ("tradition holds…", "the sthala purana tells…").
If the master list's name/place is wrong for a temple, use the correct facts and note
the correction at the top of the research file (keep the assigned id).

## 2. Write the English entry

File: `packages/content/data/temples/en/<id>.json`. Match the existing schema exactly —
read `packages/content/data/temples/en/vaithamanidhi-thirukkolur.json` and
`packages/content/data/temples/en/ranganathaswamy-srirangam.json` as models.
Keys, in this order: `id, locale, name, nativeName, deity, tradition, location{city,
state, lat, lng}, period, century, dynasty, style, unesco, circuits, summary,
sections{history, architecture, legends, festivals, experience}, visit{timings,
dressCode, photography, gettingThere}`. Do NOT add `audio`, `hero` or `video` (the media
pipeline adds them).
- `name`: "<Deity> Perumal Temple, <Place>" style (English), e.g. "Oppiliappan Temple, Thirunageswaram".
- `nativeName`: the temple's name in the local script — Tamil for Tamil Nadu temples,
  Malayalam for Kerala, Telugu for Andhra Pradesh, Devanagari (Hindi) for North India,
  Nepali (Devanagari) for Muktinath, Gujarati is NOT needed — use Devanagari for Dwarka.
  The same `nativeName` string goes in all six locale files.
- `tradition`: "Vaishnavism". `unesco`: false. `circuits`: ["divya-desams"].
- `century`: integer — the century of earliest firm attestation (the Alvar hymns are
  usually placed 6th–9th c.; use 8 when nothing earlier/firmer is known).
- `period`: one phrase, e.g. "A Divya Desam of the Chola country, sung by Thirumangai
  Alvar in the Nalayira Divya Prabandham". `dynasty`, `style`: short phrases.
- `summary`: ONE sentence, ≤ 230 characters.
- Sections: original, reverent, editorial prose (never copied text). Lengths:
  history 90–150 words, architecture 60–110, legends 60–120, festivals 40–80,
  experience 40–80. Concrete and specific to THIS temple (names, Alvars, the legend,
  the tank, the vimana) — avoid generic filler that could describe any temple.
  Say it is one of the 108 Divya Desams and name its region (Chola Nadu, Pandya Nadu,
  Malai Nadu, Nadu Nadu, Thondai Nadu or Vada Nadu).
- `visit`: practical and safe — no exact clock times; say to confirm timings locally.
  `gettingThere`: nearest town/rail/airport and road route, accurate.
- Shrines inside a larger temple (e.g. within the Ulagalantha Perumal, Ekambareswarar,
  Kamakshi or Nataraja temples): say so plainly in history/experience and gettingThere.
- Sensitive sites: keep strictly devotional and historical, neutral, no politics or
  disputes (Ayodhya: present the Sri Vaishnava Divya Desam tradition, e.g. the Ammaji
  Mandir, respectfully; Muktinath: note it is also revered by Buddhists).
- Tone: respectful, warm, editorial; British/Indian spelling consistent with the repo.

## 3. Translate into ta, te, kn, ml, hi

Files `packages/content/data/temples/<locale>/<id>.json` for ta (Tamil), te (Telugu),
kn (Kannada), ml (Malayalam), hi (Hindi). Same keys/structure and the same `id`,
`nativeName`, `century`, `unesco`, `circuits`, `lat`, `lng`; `locale` = the locale.
Translate every other string fully into the target script (names transliterated;
`location.city`/`state` in the target script). Faithful, natural, reverent — not
word-for-word. Use the established terminology of the existing files: read the
`vaithamanidhi-thirukkolur.json` and `ranganathaswamy-srirangam.json` files in each
locale folder for how "Divya Desam", "Alvar", "Perumal", "Vaishnavism", "Dravidian",
"Nalayira Divya Prabandham", visit phrasing etc. are rendered, and match them.
Keep Latin letters out of non-English prose (numerals are fine).

## 4. Check your work

- Every file must be valid JSON (`node -e "JSON.parse(require('fs').readFileSync(f))"`).
- Run `node packages/content/scripts/validate.mjs`. Other agents are writing other
  temples in parallel, so ignore errors about ids that are not yours (e.g. a circuit
  stop with no temple file yet). Fix every error that names one of YOUR ids.
- Re-read each English file once for accuracy against your research notes.

## 5. Report back (final message)

For each id: one line — deity/consort, Alvars, coordinates used, any corrections to
the master list, and anything you could not verify. Keep it short.

## RESUME MODE (read this — it overrides the order above)

An earlier run was interrupted. Before doing anything for an id, check what exists:
- If `docs/research/divya-desams/<id>.md` exists, USE it as your research basis. Do at
  most 1–2 WebSearch calls per temple only to fill a clear gap (e.g. unverified
  coordinates). If it doesn't exist, research as in §1 but keep it to ~3 searches.
- If `packages/content/data/temples/en/<id>.json` exists, do NOT rewrite it — just
  re-read it against the notes, fix only factual errors, then translate it.
- Skip any locale file that already exists and is valid JSON.
- Work ONE temple at a time and finish all six locale files for it before starting the
  next, so partial progress is always complete per temple.

## Reader-facing wording
Never mention your research process in the content ("the sources we have", "not
recorded in our sources", "research notes", "unverified"). If a fact is unknown, simply
leave it out and write what IS known; for festivals, name the observances that are
customary and add "confirm dates locally".
