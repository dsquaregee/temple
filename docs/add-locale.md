# Adding a content locale (e.g. Bengali bn, Marathi mr, Odia or)

The catalog is 520 temples + 32 circuits per locale, all localized to the same
shape (validate.mjs / qa-translations.mjs enforce it). Adding a language is two
stages: **bootstrap the content** (machine translation), then **wire the locale**
into the app.

## Stage 1 — bootstrap content (machine translation)

`packages/content/scripts/translate-locale.mjs` translates the English source into
a target locale via the Google Cloud Translation API, producing every temple and
circuit JSON in the right shape (nativeName / coordinates / ids kept verbatim;
audio & video dropped since no narration exists yet).

Run it on a machine with gcloud (so no secret is stored):

```bash
GTRANSLATE_TOKEN=$(gcloud auth print-access-token) GCP_PROJECT=temples2 \
  node packages/content/scripts/translate-locale.mjs bn mr or
```

Cost/scale: ~2M translatable characters per language (~6M for all three) → roughly
$120 total at the Cloud Translation list price. Takes a few minutes.

> Machine translation **bootstraps** the locale. The existing locales then had a
> native-fluent review pass (see docs/research/paadal-petra-sthalams.md). Plan the
> same review wave before treating a new language as final — MT can mislabel
> religious proper nouns (Nayanar saints, deity names), which is exactly what the
> review for the other locales caught and fixed.

## Stage 2 — wire the locale into the app (one PR)

After the JSON exists, enable each locale:

1. `packages/core/src/i18n.ts` — add the locale to the `Locale` union / `LOCALES`
   array, and add a full `UiStrings` block (translate the UI chrome). The
   i18n parity test requires the same keys as the other locales.
2. `apps/web/lib/locales.ts` — add a `LOCALE_LABELS` entry (native script + gloss)
   for the onboarding/language picker.
3. `apps/web/scripts/fix-lang.mjs` — add the locale code to its `LOCALES` list so
   `<html lang>` is set for its pages.
4. Fonts: the Indic scripts (Bengali, Devanagari, Odia) are covered by the system
   font stack (design D4, zero font download) — verify rendering.
5. Run the gate: `node packages/content/scripts/validate.mjs`,
   `node packages/content/scripts/qa-translations.mjs`,
   `node --test ...`, `pnpm build:web && node apps/web/scripts/check-budget.mjs`.
6. Bump the service worker VERSION.

Audio narration for the new locales (Google TTS voices: bn-IN, mr-IN, or-IN) can
follow via `audio.yml` as a later wave; until then the Listen/temple pages show
the designed "coming soon" audio state.
