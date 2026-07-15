import { LOCALES, LOCALE_LABELS, type Locale } from '@/lib/locales';

// Compact language switcher in the top bar. `pathSuffix` (e.g.
// "temples/brihadeeswarar/") keeps the user on the same content when they
// switch language — every id exists in every locale (schema parity).
export function LangSwitch({
  locale,
  pathSuffix = '',
}: {
  locale: Locale;
  pathSuffix?: string;
}) {
  return (
    <div className="langswitch" aria-label="Language">
      {LOCALES.map((loc) => (
        <a
          key={loc}
          href={`/${loc}/${pathSuffix}`}
          aria-current={loc === locale ? 'true' : undefined}
          hrefLang={loc}
          lang={loc}
        >
          {LOCALE_LABELS[loc].script}
        </a>
      ))}
    </div>
  );
}
