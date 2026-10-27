import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { haversineKm } from '../src/circuit-map.ts';

test('haversineKm is zero for identical points', () => {
  const p = { lat: 10.7828, lng: 79.1318 }; // Brihadeeswarar, Thanjavur
  assert.equal(haversineKm(p, p), 0);
});

test('haversineKm is symmetric', () => {
  const a = { lat: 13.0827, lng: 80.2707 }; // Chennai
  const b = { lat: 9.9195, lng: 78.1193 }; // Madurai (Meenakshi)
  assert.ok(Math.abs(haversineKm(a, b) - haversineKm(b, a)) < 1e-9);
});

test('haversineKm matches a known distance (Chennai→Madurai ≈ 426 km)', () => {
  const chennai = { lat: 13.0827, lng: 80.2707 };
  const madurai = { lat: 9.9195, lng: 78.1193 };
  const km = haversineKm(chennai, madurai);
  // Great-circle distance is ~425 km; allow a small tolerance.
  assert.ok(km > 415 && km < 435, `expected ~426 km, got ${km}`);
});

test('haversineKm orders nearer before farther', () => {
  const me = { lat: 13.0827, lng: 80.2707 }; // Chennai
  const near = { lat: 12.8185, lng: 79.6947 }; // Kanchipuram (~70 km)
  const far = { lat: 8.0883, lng: 77.5385 }; // Kanyakumari (~600 km)
  assert.ok(haversineKm(me, near) < haversineKm(me, far));
});

test('coords.json generator covers every temple with valid lat/lng', () => {
  // The generated file is gitignored, so validate the source instead: every
  // English temple doc must carry numeric coordinates (gen-coords.mjs throws
  // otherwise, which would break the build).
  const dir = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'content', 'data', 'temples', 'en');
  const files = readdirSync(dir).filter((f) => f.endsWith('.json'));
  assert.ok(files.length > 0);
  for (const f of files) {
    const doc = JSON.parse(readFileSync(join(dir, f), 'utf8'));
    assert.equal(typeof doc.location?.lat, 'number', `${f} lat`);
    assert.equal(typeof doc.location?.lng, 'number', `${f} lng`);
  }
});
