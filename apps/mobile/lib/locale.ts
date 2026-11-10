import { LOCALES, type Locale } from '@temple/core';

export { LOCALES };
export type { Locale };

export const LOCALE_LABELS: Record<Locale, { script: string; gloss: string }> = {
  ta: { script: 'தமிழ்', gloss: 'Tamil' },
  te: { script: 'తెలుగు', gloss: 'Telugu' },
  kn: { script: 'ಕನ್ನಡ', gloss: 'Kannada' },
  ml: { script: 'മലയാളം', gloss: 'Malayalam' },
  hi: { script: 'हिन्दी', gloss: 'Hindi' },
  bn: { script: 'বাংলা', gloss: 'Bengali' },
  mr: { script: 'मराठी', gloss: 'Marathi' },
  en: { script: 'English', gloss: 'English' },
};

export function asLocale(value: string | string[] | undefined): Locale {
  const v = Array.isArray(value) ? value[0] : value;
  return v && (LOCALES as readonly string[]).includes(v)
    ? (v as Locale)
    : 'en';
}
