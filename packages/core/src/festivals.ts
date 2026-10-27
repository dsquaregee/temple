// Festival calendar model. Temple festival data is prose-only (sections.festivals),
// so this module adds a structured layer: a curated dictionary of the major
// South-Indian temple festivals that have a well-defined Tamil month, plus a
// detector that finds which temples celebrate each one by scanning the English
// festivals prose (the source of truth across all locales).
//
// Festival and Tamil-month names are kept as transliterated proper nouns (Latin)
// and shown as-is in every locale — the same policy the catalog already uses for
// proper nouns like "Chola" and "UNESCO". Only the page chrome is localized.
// This deliberately avoids inventing native-script festival names, which would
// bypass the native-fluent review the catalog content goes through.

export interface TamilMonth {
  key: string;
  /** Transliterated Tamil month name, shown in every locale. */
  name: string;
  /** Approximate Gregorian window, e.g. "Feb–Mar". */
  gregorian: string;
}

// Tamil calendar order (Chithirai is the first month of the Tamil year).
export const TAMIL_MONTHS: TamilMonth[] = [
  { key: 'chithirai', name: 'Chithirai', gregorian: 'Apr–May' },
  { key: 'vaikasi', name: 'Vaikasi', gregorian: 'May–Jun' },
  { key: 'aani', name: 'Aani', gregorian: 'Jun–Jul' },
  { key: 'aadi', name: 'Aadi', gregorian: 'Jul–Aug' },
  { key: 'avani', name: 'Avani', gregorian: 'Aug–Sep' },
  { key: 'purattasi', name: 'Purattasi', gregorian: 'Sep–Oct' },
  { key: 'aippasi', name: 'Aippasi', gregorian: 'Oct–Nov' },
  { key: 'karthigai', name: 'Karthigai', gregorian: 'Nov–Dec' },
  { key: 'margazhi', name: 'Margazhi', gregorian: 'Dec–Jan' },
  { key: 'thai', name: 'Thai', gregorian: 'Jan–Feb' },
  { key: 'masi', name: 'Masi', gregorian: 'Feb–Mar' },
  { key: 'panguni', name: 'Panguni', gregorian: 'Mar–Apr' },
];

export const MONTH_BY_KEY: Record<string, TamilMonth> = Object.fromEntries(
  TAMIL_MONTHS.map((m) => [m.key, m])
);

// Approximate Gregorian start of each Tamil solar month (the sun's entry into
// each rasi / sankranti). These shift ±1 day year to year, which is fine for a
// "what's on this month" surface — not for a precise single-day claim. Keyed by
// month; [month-1..12, day].
const MONTH_START: Record<string, [number, number]> = {
  chithirai: [4, 14],
  vaikasi: [5, 15],
  aani: [6, 15],
  aadi: [7, 16],
  avani: [8, 17],
  purattasi: [9, 17],
  aippasi: [10, 18],
  karthigai: [11, 16],
  margazhi: [12, 16],
  thai: [1, 14],
  masi: [2, 13],
  panguni: [3, 14],
};

// The Tamil month a Gregorian date falls in. Walks the 12 month-starts and
// returns the last one on or before the date (wrapping through the year).
export function currentTamilMonthKey(date: Date): string {
  const md = (date.getMonth() + 1) * 100 + date.getDate();
  let current = 'margazhi'; // the month spanning the Dec→Jan year boundary
  let best = -1;
  for (const m of TAMIL_MONTHS) {
    const ms = MONTH_START[m.key];
    if (!ms) continue;
    const start = ms[0] * 100 + ms[1];
    if (md >= start && start > best) {
      best = start;
      current = m.key;
    }
  }
  return current;
}

/** The Tamil month after the given one, in calendar order. */
export function nextTamilMonthKey(key: string): string {
  const i = TAMIL_MONTHS.findIndex((m) => m.key === key);
  const next = TAMIL_MONTHS[(i + 1) % TAMIL_MONTHS.length];
  return next?.key ?? 'chithirai';
}

export interface Festival {
  key: string;
  /** Transliterated festival name, shown in every locale. */
  name: string;
  /** Tamil month key this festival falls in. */
  month: string;
  /** Lowercase substrings to detect in the English festivals prose. */
  patterns: string[];
}

// Only festivals with a well-defined Tamil month are listed — a temple's generic
// annual Brahmotsavam, whose timing varies per temple, is intentionally excluded
// so the calendar never implies a month it cannot stand behind.
export const FESTIVALS: Festival[] = [
  { key: 'thai-poosam', name: 'Thai Poosam', month: 'thai',
    patterns: ['thai poosam', 'thaipusam', 'thaipoosam'] },
  { key: 'maha-shivaratri', name: 'Maha Shivaratri', month: 'masi',
    patterns: ['shivaratri'] },
  { key: 'masi-magam', name: 'Masi Magam', month: 'masi',
    patterns: ['masi magam', 'masimagam'] },
  { key: 'panguni-uthiram', name: 'Panguni Uthiram', month: 'panguni',
    patterns: ['panguni uthiram'] },
  { key: 'aadi-pooram', name: 'Aadi Pooram', month: 'aadi',
    patterns: ['aadi pooram', 'adi pooram'] },
  { key: 'vinayaka-chaturthi', name: 'Vinayaka Chaturthi', month: 'avani',
    patterns: ['vinayaka chaturthi', 'vinayaka chathurthi', 'ganesh chaturthi'] },
  { key: 'navaratri', name: 'Navaratri', month: 'purattasi',
    patterns: ['navaratri', 'navratri'] },
  { key: 'skanda-shashti', name: 'Skanda Shashti', month: 'aippasi',
    patterns: ['skanda shashti', 'skanda sashti', 'kandha sashti', 'kanda sashti'] },
  { key: 'karthigai-deepam', name: 'Karthigai Deepam', month: 'karthigai',
    patterns: ['karthigai deepam'] },
  { key: 'arudra-darshan', name: 'Arudra Darshan', month: 'margazhi',
    patterns: ['arudra', 'thiruvathirai', 'arudhra'] },
  { key: 'vaikunta-ekadashi', name: 'Vaikunta Ekadashi', month: 'margazhi',
    patterns: ['vaikunta ekadashi', 'vaikuntha ekadashi', 'vaikunta ekadasi'] },
];

export const FESTIVAL_BY_KEY: Record<string, Festival> = Object.fromEntries(
  FESTIVALS.map((f) => [f.key, f])
);

/** Keys of festivals mentioned in a temple's English festivals prose. */
export function detectFestivals(enFestivalProse: string | undefined): string[] {
  if (!enFestivalProse) return [];
  const hay = enFestivalProse.toLowerCase();
  return FESTIVALS.filter((f) => f.patterns.some((p) => hay.includes(p))).map(
    (f) => f.key
  );
}
