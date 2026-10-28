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

// Observance dates (India / Tamil calendar) sourced from Drik Panchang
// (drikpanchang.com), ascending ISO (YYYY-MM-DD). Lunar/solar-lunar festivals
// have no fixed Gregorian date and can vary by ±1 day with location, so these
// are the India observance and MUST be refreshed periodically — when a festival
// runs out of future dates it simply falls back to month-level display (no
// fabricated date is ever shown). Verified/extended 2026-10-27 from Drik Panchang
// (most festivals now carry dates through 2029; the three whose Gregorian date
// Drik lists ambiguously — vaikunta-ekadashi, arudra-darshan, aadi-pooram — carry
// only their confirmed dates and fall back to month-level afterwards). The
// `refresh-festival-dates` routine re-checks these periodically; on refresh,
// drop dates already in the past and append newly published years.
export const FESTIVAL_DATES: Record<string, string[]> = {
  'skanda-shashti': ['2026-11-15', '2027-11-04', '2028-10-23'],
  'karthigai-deepam': ['2026-11-24', '2027-12-12', '2028-11-30'],
  'vaikunta-ekadashi': ['2026-12-20'],
  'arudra-darshan': ['2026-12-24'],
  'thai-poosam': ['2027-01-22', '2028-02-09', '2029-01-29'],
  'masi-magam': ['2027-02-20', '2028-03-10', '2029-02-28'],
  'maha-shivaratri': ['2027-03-06', '2028-02-23', '2029-02-11'],
  'panguni-uthiram': ['2027-03-22', '2028-04-08'],
  'aadi-pooram': ['2027-08-05'],
  'vinayaka-chaturthi': ['2027-09-04', '2028-08-23', '2029-09-11'],
  'navaratri': ['2027-09-30', '2028-09-19', '2029-10-08'],
};

/** A Date as a local-time YYYY-MM-DD string. */
export function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** The next known observance date (ISO) for a festival on or after `from`. */
export function nextFestivalDate(key: string, from: Date = new Date()): string | undefined {
  const iso = toISODate(from);
  return (FESTIVAL_DATES[key] ?? []).find((d) => d >= iso);
}

const SHORT_MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

/** Format an ISO date as "6 Mar 2027" (locale-independent, proper-noun style). */
export function formatFestivalDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d) return iso;
  return `${d} ${SHORT_MONTHS[m - 1]} ${y}`;
}

// --- Add-to-calendar (.ics) --------------------------------------------------
// A downloadable iCalendar event for a festival's next observance, so a devotee
// can drop it into their own calendar app (which then reminds them) — the
// zero-backend reminder path, working on every platform. All-day event on the
// observance date, with a one-day-before display alarm.

// Escape a text value per RFC 5545 §3.3.11 (backslash, comma, semicolon, newline).
function icsEscape(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');
}

// Fold a content line to ≤75 octets per RFC 5545 §3.1 (continuations start with
// a single space). Our values are short ASCII/transliterated, so byte ≈ char.
function icsFold(line: string): string {
  if (line.length <= 75) return line;
  const parts: string[] = [];
  let rest = line;
  parts.push(rest.slice(0, 75));
  rest = rest.slice(75);
  while (rest.length > 74) {
    parts.push(' ' + rest.slice(0, 74));
    rest = rest.slice(74);
  }
  if (rest.length) parts.push(' ' + rest);
  return parts.join('\r\n');
}

/** An ISO `YYYY-MM-DD` as the compact calendar date `YYYYMMDD`. */
function icsDate(iso: string): string {
  return iso.replace(/-/g, '');
}

/** The day after an ISO date, as `YYYYMMDD` (all-day DTEND is exclusive). */
function icsNextDay(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  const dt = new Date(Date.UTC(y!, m! - 1, d! + 1));
  return `${dt.getUTCFullYear()}${String(dt.getUTCMonth() + 1).padStart(2, '0')}${String(
    dt.getUTCDate(),
  ).padStart(2, '0')}`;
}

export interface FestivalICSInput {
  key: string;
  name: string;
  /** Observance date, ISO `YYYY-MM-DD`. */
  iso: string;
  /** Absolute URL of the festival page (optional). */
  url?: string;
  /** Short description (optional). */
  description?: string;
  /** DTSTAMP source; defaults to now. */
  now?: Date;
}

/**
 * Build a single-event iCalendar (.ics) document for a festival observance.
 * All-day, with a VALARM one day before. CRLF line endings per spec.
 */
export function buildFestivalICS(input: FestivalICSInput): string {
  const { key, name, iso, url, description, now = new Date() } = input;
  const stamp =
    `${now.getUTCFullYear()}${String(now.getUTCMonth() + 1).padStart(2, '0')}` +
    `${String(now.getUTCDate()).padStart(2, '0')}T` +
    `${String(now.getUTCHours()).padStart(2, '0')}${String(now.getUTCMinutes()).padStart(2, '0')}` +
    `${String(now.getUTCSeconds()).padStart(2, '0')}Z`;
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Temple//Festivals//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${key}-${iso}@temples.dsquaregee.com`,
    `DTSTAMP:${stamp}`,
    `DTSTART;VALUE=DATE:${icsDate(iso)}`,
    `DTEND;VALUE=DATE:${icsNextDay(iso)}`,
    `SUMMARY:${icsEscape(name)}`,
    ...(description ? [`DESCRIPTION:${icsEscape(description)}`] : []),
    ...(url ? [`URL:${icsEscape(url)}`] : []),
    'BEGIN:VALARM',
    'TRIGGER:-P1D',
    'ACTION:DISPLAY',
    `DESCRIPTION:${icsEscape(name)}`,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ];
  return lines.map(icsFold).join('\r\n') + '\r\n';
}
