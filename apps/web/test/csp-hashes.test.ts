import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { hashesFor, metaFor, injectMeta } from '../scripts/csp-hashes.mjs';

const sha = (s: string) => `'sha256-${createHash('sha256').update(s, 'utf8').digest('base64')}'`;

test('hashesFor hashes executable inline scripts and skips data blocks', () => {
  const html = `
    <script type="application/ld+json">{"@context":"x"}</script>
    <script>self.__next_f.push([0]);</script>
    <script src="/_next/chunk.js" async=""></script>
    <script type="application/json">{"a":1}</script>
  `;
  const hashes = hashesFor(html);
  // Only the one executable inline script (no src, JS type) is hashed.
  assert.deepEqual(hashes, [sha('self.__next_f.push([0]);')]);
});

test('hashesFor deduplicates identical inline scripts', () => {
  const html = `<script>run();</script><script>run();</script>`;
  assert.deepEqual(hashesFor(html), [sha('run()' + ';')]);
});

test('metaFor builds a script-src policy with self + hashes and no unsafe-inline', () => {
  const meta = metaFor(`<script>run();</script>`)!;
  assert.match(meta, /http-equiv="Content-Security-Policy"/);
  assert.match(meta, /script-src 'self' 'sha256-/);
  assert.doesNotMatch(meta, /unsafe-inline/);
});

test('metaFor returns null when there is nothing executable to hash', () => {
  assert.equal(metaFor(`<script src="/x.js"></script>`), null);
  assert.equal(metaFor(`<script type="application/ld+json">{}</script>`), null);
});

test('injectMeta places the policy first in <head> and is idempotent', () => {
  const html = `<!doctype html><html><head><meta charset="utf-8"></head><body><script>run();</script></body></html>`;
  const meta = metaFor(html)!;
  const once = injectMeta(html, meta);
  assert.ok(once.indexOf(meta) < once.indexOf('<meta charset'), 'policy should precede other head tags');
  // Re-running replaces rather than stacks a second policy.
  const twice = injectMeta(once, meta);
  assert.equal(twice.match(/Content-Security-Policy/g)!.length, 1);
});
