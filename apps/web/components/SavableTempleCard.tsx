import { type Locale, type TempleCardData } from '@temple/core';
import { TempleCard } from './cards';
import { SaveButton } from './SaveButton';

// A temple card with a ★ Save toggle floated in the corner. Used wherever
// temples are listed (Home, Discover, related) so saving is discoverable
// everywhere, not just on the detail page. The button sits over the card link
// via stopPropagation, so tapping it saves without navigating.
export function SavableTempleCard({
  locale,
  temple,
}: {
  locale: Locale;
  temple: TempleCardData;
}) {
  return (
    <div className="cardwrap">
      <TempleCard locale={locale} temple={temple} />
      <SaveButton locale={locale} id={temple.id} className="card-save" />
    </div>
  );
}
