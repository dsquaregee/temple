import type { Metadata } from 'next';
import { LOCALE_LABELS, type Locale } from '@/lib/locales';

export const metadata: Metadata = {
  title: 'Choose your language · Temple',
  alternates: { canonical: '/' },
};

// Onboarding screen 1 (design D4): the language picker. Native scripts lead,
// English gloss below. No forced sign-in — anonymous browsing from here.
const ORDER: Locale[] = ['ta', 'te', 'kn', 'ml', 'hi', 'en'];

export default function LanguagePicker() {
  return (
    <main className="picker">
      <h1>Temple</h1>
      <p className="sub">
        Choose your language · உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்
      </p>
      <div className="langlist">
        {ORDER.map((loc) => (
          <a key={loc} href={`/${loc}/`} lang={loc} hrefLang={loc}>
            <span className="script">{LOCALE_LABELS[loc].script}</span>
            {LOCALE_LABELS[loc].gloss !== LOCALE_LABELS[loc].script && (
              <span className="gloss">{LOCALE_LABELS[loc].gloss}</span>
            )}
          </a>
        ))}
      </div>
    </main>
  );
}
