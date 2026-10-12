// South Asia land outline (Natural Earth 1:10m, public domain; lng 66–98,
// lat 4–37 — all of India, Nepal and Sri Lanka) drawn under every circuit route
// map. Shared by web and mobile; regenerate with apps/web/scripts/gen-land-outline.mjs.
import land from '../geo/south-asia-land.json';

export const SOUTH_ASIA_LAND: number[][][] = land.rings;
