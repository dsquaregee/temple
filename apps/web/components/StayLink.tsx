'use client';

import type { TempleStay } from '@temple/core';
import { trackStay } from '@/lib/analytics';

// A single "Stay nearby" link. Client component only so a click on a featured
// listing can fire a PII-free count beacon (trackStay) before the new tab opens.
export function StayLink({
  stay,
  sponsoredLabel,
}: {
  stay: TempleStay;
  sponsoredLabel: string;
}) {
  return (
    <a
      className={`stay-link${stay.featured ? ' stay-link--featured' : ''}`}
      href={stay.url}
      target="_blank"
      rel="noopener noreferrer nofollow"
      onClick={() => trackStay(stay.trackId)}
    >
      {stay.featured && (
        <span className="stay-star" aria-hidden="true">
          ★
        </span>
      )}
      <span className="stay-name">{stay.name}</span>
      {stay.note && <span className="stay-note-inline">{stay.note}</span>}
      {stay.sponsored && <span className="stay-sponsored">{sponsoredLabel}</span>}
      <span className="stay-ext" aria-hidden="true">
        ↗
      </span>
    </a>
  );
}
