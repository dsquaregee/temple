'use client';

import { buildFestivalICS, t, type Locale } from '@temple/core';

// "Add to calendar" — downloads a one-event .ics for a festival's next
// observance, which the visitor's own calendar app then reminds them about. No
// backend, works on every platform. Rendered only when an upcoming date is
// known (the parent passes `iso`); otherwise there is nothing to add.
export function AddToCalendar({
  locale,
  festivalKey,
  name,
  iso,
  url,
  description,
}: {
  locale: Locale;
  festivalKey: string;
  name: string;
  iso: string;
  url?: string;
  description?: string;
}) {
  const ui = t(locale);

  function download() {
    const ics = buildFestivalICS({ key: festivalKey, name, iso, url, description });
    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const href = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = href;
    a.download = `${festivalKey}.ics`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    // Revoke on the next tick so the download has started.
    setTimeout(() => URL.revokeObjectURL(href), 1000);
  }

  return (
    <button type="button" className="calbtn" onClick={download}>
      <span aria-hidden="true">🗓️</span> {ui.festivals.addToCalendar}
    </button>
  );
}
