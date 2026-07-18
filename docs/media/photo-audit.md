# Temple photo/video audit (Wikimedia Commons)

Two-stage selection, July 2026:

1. **Automatic quality gate** (gen-video.mjs): JPEG/PNG, ≥ 2 MP, landscape,
   CC/PD license; ≥ 3 qualifying photos required or the temple is skipped.
   All 10 v1 temples pass with 6 photos each.
2. **Editorial audit** (this document): every hero photo and candidate pool
   reviewed by eye. The resolution-ranked search favored things it cannot
   see — stereo-pair scans rendered as side-by-side duplicates, archival
   black-and-white photos, a burned-in camera datestamp, construction
   clutter, and in one case a photo of a *different* Kanchipuram temple
   (Kamakshi Ambal). Seven temples were re-curated with exact Commons titles
   (the `CURATED` map in `packages/content/scripts/gen-video.mjs`), then
   heroes and videos were regenerated.

| Temple | Photos | Selection | Hero (after audit) |
|---|---|---|---|
| airavatesvara | 6 | ✍️ curated | Full temple at dusk, dramatic sky |
| arunachaleswarar | 6 | ✍️ curated | Raja gopuram over the temple tank |
| brihadeeswarar | 6 | ✍️ curated | Blue-hour vimana, Maha Shivaratri lighting |
| ekambareswarar | 6 | ✍️ curated | Raja Gopuram against blue sky |
| gangaikonda-cholapuram | 6 | ✅ automatic | Vimana + enclosure wall, lawns |
| jambukeswarar | 6 | ✍️ curated | East tower at night |
| meenakshi-madurai | 6 | ✅ automatic | Painted gopuram sculpture close-up |
| nataraja-chidambaram | 6 | ✍️ curated | East gopuram full view |
| ramanathaswamy-rameswaram | 6 | ✍️ curated | The famous pillared corridor |
| srikalahasti | 6 | ✅ automatic | White gopuram from the river |

## What curation removed

- **Stereo-pair scans** (image duplicated side by side): were the top-ranked
  "photos" for airavatesvara and jambukeswarar and most of the
  arunachaleswarar pool — the highest-megapixel files in each batch.
- **Archival B&W photography** (1961 street scene, ekambareswarar) — fine
  history, wrong register for a devotional hero image.
- **Burned-in datestamp** (ramanathaswamy-rameswaram gopuram).
- **Construction clutter** (arunachaleswarar courtyard with barriers and gas
  cylinders).
- **Wrong temple**: a Kamakshi Ambal Temple gateway surfaced under the
  ekambareswarar search; every curated title was verified to name the right
  temple.

## Known acceptable imperfections

- The ekambareswarar hero has the photographer's faint watermark (CC BY-SA
  attribution is also carried in `hero.credit` / `video.credit`).
- Photos are what Commons offers: mixed lighting styles across temples.
  Commissioned photography can replace any of this later — same bucket
  paths, no code changes.

## Still pending (needs a human)

- Native-speaker sign-off per language — checklist in
  `docs/i18n/translation-review.md`.
