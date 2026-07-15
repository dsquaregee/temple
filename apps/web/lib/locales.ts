import { LOCALES, type Locale } from '@temple/core';

export { LOCALES };
export type { Locale };

// Native-script label + English gloss for the onboarding language picker
// and the in-app language switcher (native scripts lead — design D4).
export const LOCALE_LABELS: Record<Locale, { script: string; gloss: string }> = {
  ta: { script: 'தமிழ்', gloss: 'Tamil' },
  te: { script: 'తెలుగు', gloss: 'Telugu' },
  kn: { script: 'ಕನ್ನಡ', gloss: 'Kannada' },
  ml: { script: 'മലയാളം', gloss: 'Malayalam' },
  hi: { script: 'हिन्दी', gloss: 'Hindi' },
  en: { script: 'English', gloss: 'English' },
};

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}
