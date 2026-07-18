import { LOCALE_LABELS, type Locale } from '@/lib/locales';

// Global 404 (static export → out/404.html, which Firebase Hosting serves with
// a 404 status for any unmatched path). It renders above the [locale] segment,
// so the visitor's language is unknown — we lead them (back) to the language
// picker's choices so they always land somewhere useful, in their own script.
const ORDER: Locale[] = ['ta', 'te', 'kn', 'ml', 'hi', 'en'];

export default function NotFound() {
  return (
    <main className="picker">
      <p className="code">404</p>
      <h1>Temple</h1>
      <p className="sub">
        This page could not be found · இந்தப் பக்கம் கிடைக்கவில்லை
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
