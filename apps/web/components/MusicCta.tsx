import { t, type Locale } from '@temple/core';
import { YOUTUBE_CHANNEL } from '@/lib/site';
import { BrandIcon } from './BrandIcon';

// Carnatic-music call-to-action linking out to the owner's YouTube channel
// (channel-growth goal). Plain outbound link — no embed, no third-party script.
// Used on the Listen tab and temple detail pages.
export function MusicCta({ locale }: { locale: Locale }) {
  const ui = t(locale);
  return (
    <a
      className="musiccard"
      href={YOUTUBE_CHANNEL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${ui.music.heading} — ${ui.music.cta} · DeeSqrGee`}
    >
      <span className="musiccard-icon" aria-hidden="true">
        <BrandIcon name="YouTube" size={26} />
      </span>
      <span className="musiccard-text" aria-hidden="true">
        <span className="musiccard-title">{ui.music.heading}</span>
        <span className="musiccard-sub">DeeSqrGee</span>
      </span>
      <span className="musiccard-cta" aria-hidden="true">
        {ui.music.cta}
      </span>
    </a>
  );
}
