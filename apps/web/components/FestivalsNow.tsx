'use client';

import { useEffect, useState } from 'react';
import {
  currentTamilMonthKey,
  nextTamilMonthKey,
  t,
  type Locale,
} from '@temple/core';

export interface MonthSummary {
  key: string;
  name: string;
  gregorian: string;
  festivals: { key: string; name: string; count: number; date?: string }[];
}

// "What's on now": the festivals of the current Tamil month (or the next month
// with any, if this one is quiet). Server-renders the build-day month; the
// client re-picks for the visitor's actual date after mount (same pattern as the
// Temple of the Day), so a cached page still shows the right month on revisit.
export function FestivalsNow({
  locale,
  months,
  initialMonthKey,
}: {
  locale: Locale;
  months: MonthSummary[];
  initialMonthKey: string;
}) {
  const ui = t(locale);
  const byKey = new Map(months.map((m) => [m.key, m]));

  // The month to show, and whether it is the current one or a look-ahead.
  function pick(todayKey: string): { month: MonthSummary; upcoming: boolean } | null {
    if (byKey.get(todayKey)?.festivals.length) {
      return { month: byKey.get(todayKey)!, upcoming: false };
    }
    let key = todayKey;
    for (let i = 0; i < 12; i++) {
      key = nextTamilMonthKey(key);
      const m = byKey.get(key);
      if (m?.festivals.length) return { month: m, upcoming: true };
    }
    return null;
  }

  const [picked, setPicked] = useState(() => pick(initialMonthKey));
  useEffect(() => {
    setPicked(pick(currentTamilMonthKey(new Date())));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!picked) return null;
  const { month, upcoming } = picked;

  return (
    <section className="section" aria-labelledby="festnow-h">
      <h2 id="festnow-h">
        {upcoming ? ui.festivals.comingUp : ui.festivals.thisMonth}
        {' · '}
        {month.name} ({month.gregorian})
      </h2>
      <div className="stops stops--explicit">
        {month.festivals.map((f) => (
          <a
            key={f.key}
            className="card"
            href={`/${locale}/festivals/${f.key}/`}
          >
            <h3>{f.name}</h3>
            <div className="meta">
              {f.date ? `${f.date} · ` : ''}
              {f.count} {ui.festivals.temples}
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
