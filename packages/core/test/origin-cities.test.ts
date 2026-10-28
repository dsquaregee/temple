import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ORIGIN_CITIES, ORIGIN_CITY_BY_NAME } from '../src/origin-cities.ts';
import { haversineKm } from '../src/circuit-map.ts';

test('origin cities have unique names and plausible Indian coordinates', () => {
  assert.ok(ORIGIN_CITIES.length >= 10);
  const names = new Set<string>();
  for (const c of ORIGIN_CITIES) {
    assert.ok(c.name.trim().length > 0, 'name');
    assert.ok(!names.has(c.name), `duplicate ${c.name}`);
    names.add(c.name);
    assert.ok(c.lat > 6 && c.lat < 36, `lat in India range: ${c.name}`);
    assert.ok(c.lng > 68 && c.lng < 98, `lng in India range: ${c.name}`);
  }
});

test('ORIGIN_CITY_BY_NAME resolves each city', () => {
  for (const c of ORIGIN_CITIES) {
    assert.equal(ORIGIN_CITY_BY_NAME[c.name], c);
  }
});

test('ranking from a city orders nearer temples first', () => {
  const chennai = ORIGIN_CITY_BY_NAME['Chennai'];
  const kanchi = { lat: 12.8185, lng: 79.6947 }; // ~70 km from Chennai
  const kanyakumari = { lat: 8.0883, lng: 77.5385 }; // ~600 km
  assert.ok(haversineKm(chennai, kanchi) < haversineKm(chennai, kanyakumari));
});
