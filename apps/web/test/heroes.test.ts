import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, existsSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// Guards a real deploy risk: every temple's page preloads a hero as its LCP
// element, falling back to the generated placeholder SVG at
// apps/web/public/heroes/<id>.svg. A temple added without regenerating heroes
// (`pnpm --filter @temple/web gen:heroes`) would 404 that preload. This asserts
// one-to-one coverage before it can ship.

const here = dirname(fileURLToPath(import.meta.url));
const templesEnDir = join(here, '..', '..', '..', 'packages', 'content', 'data', 'temples', 'en');
const heroesDir = join(here, '..', 'public', 'heroes');

const templeIds = readdirSync(templesEnDir)
  .filter((f) => f.endsWith('.json'))
  .map((f) => f.replace(/\.json$/, ''))
  .sort();

test('every temple has a non-empty hero placeholder SVG', () => {
  const missing: string[] = [];
  const empty: string[] = [];
  for (const id of templeIds) {
    const p = join(heroesDir, `${id}.svg`);
    if (!existsSync(p)) missing.push(id);
    else if (statSync(p).size === 0) empty.push(id);
  }
  assert.deepEqual(missing, [], `temples without a hero placeholder SVG: ${missing.join(', ')}`);
  assert.deepEqual(empty, [], `temples with an empty hero SVG: ${empty.join(', ')}`);
});

test('no orphaned hero SVG without a matching temple', () => {
  const ids = new Set(templeIds);
  const orphans = readdirSync(heroesDir)
    .filter((f) => f.endsWith('.svg'))
    .map((f) => f.replace(/\.svg$/, ''))
    .filter((id) => !ids.has(id));
  assert.deepEqual(orphans, [], `hero SVGs with no temple: ${orphans.join(', ')}`);
});
