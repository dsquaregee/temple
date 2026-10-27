import { type ReactNode } from 'react';
import { type Locale, type TempleCardData } from '@temple/core';
import { TempleCard } from './cards';
import { SaveButton } from './SaveButton';

// A temple card with a ★ Save toggle floated in the corner. Used wherever
// temples are listed (Home, Discover, related) so saving is discoverable
// everywhere, not just on the detail page. The button sits over the card link
// via stopPropagation, so tapping it saves without navigating.
// `badge` renders a small overlay chip (e.g. the "12 km away" distance in the
// Discover "Near me" view); omitted elsewhere.
export function SavableTempleCard({
  locale,
  temple,
  badge,
}: {
  locale: Locale;
  temple: TempleCardData;
  badge?: ReactNode;
}) {
  return (
    <div className="cardwrap">
      <TempleCard locale={locale} temple={temple} />
      {badge != null && <span className="card-dist">{badge}</span>}
      <SaveButton locale={locale} id={temple.id} className="card-save" />
    </div>
  );
}
