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
  credit?: string;
}

// Narrated audio story for a temple, per the Listen tab. Optional until audio
// is produced; the app uses the temple's prose as the transcript / accessible
// alternative in the meantime.
export interface TempleAudio {
  storyUrl: string;
  durationSec: number;
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
}

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
