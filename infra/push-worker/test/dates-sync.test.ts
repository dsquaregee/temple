import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { FESTIVAL_DATES } from '../../../packages/core/src/festivals.ts';

// The Worker ships its own copy of the festival dates (it is deployed separately
// and cannot import the web app's bundle). This guards against drift: when the
// `refresh-festival-dates` routine updates core, this fails until the Worker's
// festival-dates.json is updated to match.
test('push worker festival-dates.json matches core FESTIVAL_DATES', () => {
  const file = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'festival-dates.json');
  const worker = JSON.parse(readFileSync(file, 'utf8'));
  assert.deepEqual(worker, FESTIVAL_DATES);
});
