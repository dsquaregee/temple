import { t, type Locale } from '@temple/core';
import { YOUTUBE_CHANNEL } from '@/lib/site';
import { BrandIcon } from './BrandIcon';

// Carnatic-music call-to-action linking out to YouTube (channel-growth goal).
// Plain outbound link — no embed, no third-party script. Defaults to the channel
// with the localized "Carnatic music" heading; pass `href`/`title`/`sub` to point
// at a specific playlist (used by the Listen-tab playlist hub).
export function MusicCta({
  locale,
  href,
  title,
  sub = 'DeeSqrGee',
}: {
  locale: Locale;
  href?: string;
  title?: string;
  sub?: string;
}) {
  const ui = t(locale);
  const heading = title ?? ui.music.heading;
  return (
    <a
      className="musiccard"
      href={href ?? YOUTUBE_CHANNEL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${heading} — ${ui.music.cta} · ${sub}`}
    >
      <span className="musiccard-icon" aria-hidden="true">
        <BrandIcon name="YouTube" size={26} />
      </span>
      <span className="musiccard-text" aria-hidden="true">
        <span className="musiccard-title">{heading}</span>
        <span className="musiccard-sub">{sub}</span>
      </span>
      <span className="musiccard-cta" aria-hidden="true">
        {ui.music.cta}
      </span>
    </a>
  );
}
