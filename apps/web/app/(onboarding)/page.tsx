import Link from 'next/link';
import { LOCALES, strings } from '@temple/core';

// Onboarding screen 1: the language picker. Native scripts lead, English
// gloss follows (design decision — limited-literacy support; audio preview
// ships with the native apps).
const GLOSS: Record<string, string> = {
  en: 'English',
  ta: 'Tamil',
  te: 'Telugu',
  kn: 'Kannada',
  ml: 'Malayalam',
  hi: 'Hindi',
};

export default function LanguagePicker() {
  return (
    <div className="picker">
      <h1 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>Temple</h1>
      <p className="meta" style={{ marginBottom: '1rem' }}>
        Choose your language · மொழியைத் தேர்ந்தெடுக்கவும் · भाषा चुनें
      </p>
      {LOCALES.map((locale) => (
        <Link key={locale} href={`/${locale}/`} lang={locale}>
          <span className="script">{strings[locale].labels.languageName}</span>
          <span className="meta">{GLOSS[locale]}</span>
        </Link>
      ))}
    </div>
  );
}
