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
