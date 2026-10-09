// South India + Sri Lanka coastline (Natural Earth 1:10m, public domain) drawn
// under every circuit route map. Shared by web and mobile; regenerate with
// apps/web/scripts/gen-land-outline.mjs.
import land from '../geo/south-india-land.json';

export const SOUTH_INDIA_LAND: number[][][] = land.rings;
