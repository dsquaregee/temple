import type { Metadata } from 'next';
import { LOCALE_LABELS, type Locale } from '@/lib/locales';

export const metadata: Metadata = {
  title: 'Offline · Temple',
  robots: { index: false, follow: false },
};

// Served by the service worker when a navigation can't be fulfilled from cache
// or network (the visitor is offline and hasn't visited that page before).
// Pages already visited stay available offline via the runtime cache; this
// screen points the visitor back to them, in their own script.
const ORDER: Locale[] = ['ta', 'te', 'kn', 'ml', 'hi', 'en'];

export default function OfflinePage() {
  return (
    <main className="picker">
      <p className="code">OFFLINE</p>
      <h1>Temple</h1>
      <p className="sub">
        You’re offline · நீங்கள் இணையம் இல்லாமல் உள்ளீர்கள். Pages you’ve
        already opened are still available.
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
