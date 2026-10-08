import { t, type Locale } from '@temple/core';
import { SOCIAL } from '@/lib/site';
import { BrandIcon } from './BrandIcon';

// Site-wide footer: the owner's social channels (handle: DeeSqrGee). Plain
// outbound links — YouTube leads (the Carnatic music channel). rel="me" lets the
// site assert these profiles as its own.
export function SiteFooter({ locale }: { locale: Locale }) {
  const ui = t(locale);
  return (
    <footer className="sitefooter">
      <span className="sitefooter-label">
        {ui.footer.follow} · DeeSqrGee
      </span>
      <ul className="social" aria-label="DeeSqrGee">
        {SOCIAL.map((s) => (
          <li key={s.name}>
            <a
              href={s.url}
              aria-label={s.name}
              target="_blank"
              rel="me noopener noreferrer"
            >
              <BrandIcon name={s.name} />
            </a>
          </li>
        ))}
      </ul>
    </footer>
  );
}
