# Phase 2 — Design Tokens & Component Inventory

Single source of truth: `packages/core/src/tokens.ts` (these tables are the
human-readable mirror; core exports the machine-readable values shared by web
and native).

## Color tokens

| Token | Light | Dark | Use |
|---|---|---|---|
| `bg.base` | `#FAF6EE` (warm cream) | `#171310` | App background |
| `bg.raised` | `#FFFFFF` | `#211C17` | Cards |
| `bg.sunken` | `#F1EADC` | `#0F0C0A` | Wells, skeletons |
| `ink.strong` | `#2B2118` | `#F2EAD9` | Headings |
| `ink.body` | `#4A3F33` | `#CFC4B2` | Body text |
| `ink.muted` | `#8A7C6A` | `#8F8474` | Captions, meta |
| `accent.turmeric` | `#D98E04` | `#E8A62A` | Primary accent, progress |
| `accent.vermilion` | `#B3411F` | `#D65F3B` | Emphasis, festival badges |
| `accent.leaf` | `#5C7A45` | `#7FA05E` | Success, "visited" |
| `line.default` | `#E5DCC9` | `#33291F` | Hairlines, dividers |

All pairs meet WCAG AA on their backgrounds in both themes.

## Typography

- Display/editorial: system serif stack (`Georgia, 'Noto Serif', serif`) —
  no download.
- UI: platform system sans (`system-ui`).
- Indic scripts: platform system fonts (Noto family ships on Android/iOS) —
  **zero font download on the critical path** by design.
- Scale (rem): 2.0 display / 1.5 title / 1.25 section / 1.0 body / 0.875 meta;
  line-height 1.6 body, 1.2 headings. Indic scripts get +8% line-height.

## Spacing & shape

4-pt grid; radii 12 (cards) / 8 (chips) / 999 (pills); 48 dp min touch target.

## Component inventory (~25, shared web + native)

AppShell/TabBar · TempleCard (hero, compact, row) · CircuitCard ·
CircuitProgress · StopRow (visited/next/upcoming) · AudioStoryCard ·
MiniPlayer · SectionHeading · EditorialProse · FactTile (darshan info) ·
ChipRow (deity/dynasty/style) · LanguagePicker · SearchBar · FilterSheet ·
MapToggle · FestivalCountdown · PanchangStrip · DownloadPackCard ·
SkeletonBlock · EmptyState · ErrorState · OfflineBanner · SignInSheet ·
SettingsRow · LocaleSwitcher

## Performance guardrails designed in

- Preloaded AVIF hero is the LCP element on detail pages.
- Solid-tone skeletons sized to final layout → CLS ≈ 0.
- Per-tab route bundles; no chart/map libs on the critical path (map loads on
  toggle).
- Images: AVIF with WebP/JPEG fallback via CDN negotiation, exact-size
  variants, `loading=lazy` below the fold.
