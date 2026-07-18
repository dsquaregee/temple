'use client';

import { t, type Locale } from '@temple/core';
import { useFavorites } from '@/lib/favorites';

// Toggle for saving a temple. A star (not deity imagery — allowed in chrome)
// plus a text label so the state is clear and accessible. stopPropagation lets
// it sit over a card link without triggering navigation.
export function SaveButton({
  locale,
  id,
  className,
}: {
  locale: Locale;
  id: string;
  className?: string;
}) {
  const { has, toggle } = useFavorites();
  const f = t(locale).favorites;
  const saved = has(id);
  return (
    <button
      type="button"
      className={`savebtn${saved ? ' is-saved' : ''}${className ? ` ${className}` : ''}`}
      aria-pressed={saved}
      aria-label={saved ? f.saved : f.save}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(id);
      }}
    >
      <span className="savebtn__icon" aria-hidden="true">
        {saved ? '★' : '☆'}
      </span>
      <span className="savebtn__label">{saved ? f.saved : f.save}</span>
    </button>
  );
}
