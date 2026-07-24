export const LOCALES = ['en', 'ta', 'te', 'kn', 'ml', 'hi'] as const;
export type Locale = (typeof LOCALES)[number];

export interface TempleLocation {
  city: string;
  state: string;
  lat: number;
  lng: number;
}

export interface TempleSections {
  history: string;
  architecture: string;
  legends: string;
  festivals: string;
  experience: string;
}

export interface TempleVisit {
  timings: string;
  dressCode: string;
  photography: string;
  gettingThere: string;
}

// Hero image for a temple. Optional: until licensed exterior/architecture
// photography is available, the apps fall back to a generated placeholder
// keyed on the temple id. `color` is the dominant tone used for the
// zero-layout-shift placeholder and the loading background.
export interface TempleHero {
  src: string;
  color: string;
  alt: string;
  sources?: { avif?: string; webp?: string };
  // Social-share (OpenGraph) card, 1200×630, derived from the hero photo.
  og?: string;
  credit?: string;
}

// Narrated audio story for a temple, per the Listen tab. Optional until audio
// is produced; the app uses the temple's prose as the transcript / accessible
// alternative in the meantime.
export interface TempleAudio {
  storyUrl: string;
  durationSec: number;
}

// Narrated video (Ken Burns over real, CC-licensed exterior photos + the audio
// story). Optional. `credit` carries the required photo attributions.
export interface TempleVideo {
  url: string;
  posterUrl?: string;
  durationSec?: number;
  credit?: string;
}

export interface Temple {
  id: string;
  locale: Locale;
  name: string;
  nativeName: string;
  deity: string;
  tradition: string;
  location: TempleLocation;
  period: string;
  century: number;
  dynasty: string;
  style: string;
  unesco: boolean;
  circuits: string[];
  summary: string;
  sections: TempleSections;
  visit: TempleVisit;
  hero?: TempleHero;
  audio?: TempleAudio;
  video?: TempleVideo;
}

// The subset of a Temple needed to list, search, facet, and sort it — but NOT
// the long-form `sections`/`visit` prose, hero, or media. The Discover tab is a
// client component, so anything on the Temple object it receives is serialized
// into the page's HTML for hydration; projecting to this shape keeps the full
// catalog prose (the bulk of each temple) off the listing payload. A full
// Temple structurally satisfies it, so it can be used anywhere a card is shown.
export type TempleCardData = Pick<
  Temple,
  | 'id'
  | 'name'
  | 'nativeName'
  | 'deity'
  | 'tradition'
  | 'dynasty'
  | 'style'
  | 'period'
  | 'century'
  | 'unesco'
  | 'circuits'
> & { location: Pick<TempleLocation, 'city' | 'state'> };

export interface Circuit {
  id: string;
  locale: Locale;
  name: string;
  nativeName: string;
  theme: string;
  region: string;
  description: string;
  stops: string[];
}
