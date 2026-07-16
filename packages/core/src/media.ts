// Deterministic per-temple accent, so a temple looks the same across web,
// mobile, and its generated placeholder hero — no stored asset required.
// Warm, temple-appropriate deep tones (stone, terracotta, bronze, indigo…).
const HERO_PALETTE = [
  '#8A3324', // terracotta
  '#7A5230', // sandstone brown
  '#6B4A2B', // bronze
  '#5C3A2E', // laterite
  '#7C5E1E', // ochre gold
  '#4E5A34', // olive stone
  '#3F5661', // slate teal
  '#5A3D5C', // deep plum
  '#8A4B08', // burnt amber
  '#495B7A', // indigo stone
] as const;

function hash(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return h;
}

/** Stable dominant color for a temple id (hex). */
export function colorForTemple(id: string): string {
  return HERO_PALETTE[hash(id) % HERO_PALETTE.length]!;
}

/** A slightly lighter partner tone for gradients, derived from the base. */
export function colorAccentForTemple(id: string): string {
  return HERO_PALETTE[(hash(id) + 4) % HERO_PALETTE.length]!;
}
