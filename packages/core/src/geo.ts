// South Asia land outline (Natural Earth 1:10m, public domain; lng 66–98,
// lat 4–37 — all of India, Nepal and Sri Lanka) drawn under every circuit route
// map. Shared by web and mobile; regenerate with apps/web/scripts/gen-land-outline.mjs.
import land from '../geo/south-asia-land.json';

export const SOUTH_ASIA_LAND: number[][][] = land.rings;

// India state boundaries (dissolved from district polygons, ODbL; see
// packages/core/geo/india-states.json), drawn faintly under the route so a
// viewer can tell which state each stop is in. Rings are [lng,lat]; `label`
// is a representative interior point for the state's name.
import states from '../geo/india-states.json';

export interface StateFeature {
  name: string;
  rings: number[][][];
  label: number[] | null;
}

export const INDIA_STATES: StateFeature[] = states.states as StateFeature[];
