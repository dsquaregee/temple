# Phase 2 — Information Architecture

*Owner-approved hybrid direction (D4): Kovil home + Sthala detail + Yatra circuits.*

## Navigation — 4 tabs

1. **Home** (Kovil) — warm devotional daily anchor: date/panchang strip,
   "temple of the day" hero, continue-listening card, nearby temples,
   festival countdowns.
2. **Discover** (Sthala) — the catalog: search, filters (deity, dynasty,
   architecture style, state, circuit, UNESCO), map toggle, editorial
   collections ("Chola masterworks", "Temples older than 1000 years").
3. **Yatra** — circuits as first-class objects: circuit list → circuit detail
   (progress bar; visited / next / upcoming stop states; next stop expands to
   an action card; downloadable offline pack ≤ 64 MB per circuit).
4. **Listen** — audio library: temple stories, sthala puranas, architecture
   walkthroughs; background playback; downloads.

## Key screens

### Temple detail (flagship)
Editorial serif storytelling on warm cream. Order: AVIF hero (gopuram /
exterior; preloaded LCP) → name + native-script name → orientation strip
(deity · dynasty · century · style · circuit chips) → audio story card →
"Why this temple matters" summary → sections (History / Architecture /
Legends / Festivals / Visit) → practical darshan tiles (timings, dress,
photography rules, how to reach) → circuit membership card → related temples.

### Onboarding
Screen 1 is the language picker: native scripts lead (தமிழ், తెలుగు, ಕನ್ನಡ,
മലയാളം, हिन्दी, English) with English glosses; tap-and-hold plays an audio
preview of that language (limited-literacy support). No forced sign-in —
anonymous browsing; auth appears only when a feature requires it (saving
progress, downloads sync).

### Circuit detail
Progress ("3 of 5 visited"), ordered stop list with visited/next/upcoming
states, next stop expanded (distance, timings, mark-visited), offline pack
download with size shown before download.

## Visual language

- Warm cream base, deep temple-stone browns, turmeric/vermilion accents;
  full dark mode.
- Serif display for editorial headings (system-stack first), system UI sans
  for interface text, native system fonts for all six scripts — zero web-font
  download on the critical path.
- **No deity imagery in UI chrome** — reverence + photography-rule compliance.
  Photography limited to exteriors/gopurams/architecture.
- Solid-tone skeletons matching final layout (zero CLS).

## Accessibility (blocking rules)

- 48 dp minimum touch targets; WCAG AA contrast in both themes.
- Every long-form text has an audio alternative.
- Full UI parity in all six languages (no English-only surfaces).
