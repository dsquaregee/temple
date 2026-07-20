import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { metaFor, EXTRA_SCRIPT_SRC } from '../scripts/csp-hashes.mjs';

// The site ships TWO CSPs that the browser enforces together: the global header
// in firebase.json, and a per-page <meta> injected post-build by csp-hashes.mjs.
// A script host allowed by only one is still blocked by the other (verified in a
// headless browser for the Cloudflare beacon — see docs/deploy-readiness.md).
// This guards that real footgun: adding a monitoring/RUM host to the header but
// forgetting the meta template (or vice versa) must fail CI, not fail silently
// in production.

const here = dirname(fileURLToPath(import.meta.url));
const firebase = JSON.parse(
  readFileSync(join(here, '..', '..', '..', 'firebase.json'), 'utf8'),
);

function headerCsp(): string {
  for (const rule of firebase.hosting?.headers ?? []) {
    for (const h of rule.headers ?? []) {
      if (h.key === 'Content-Security-Policy') return h.value;
    }
  }
  throw new Error('no Content-Security-Policy header found in firebase.json');
}

// Pull one directive's token list out of a CSP string.
function directive(csp: string, name: string): string[] {
  const found = csp
    .split(';')
    .map((d) => d.trim())
    .find((d) => d === name || d.startsWith(name + ' '));
  if (!found) return [];
  return found.slice(name.length).trim().split(/\s+/).filter(Boolean);
}

// External host allowlist entries only — drop 'self', quoted keywords, and
// hashes/nonces (all of which start with a quote).
const hosts = (tokens: string[]) =>
  tokens.filter((t) => !t.startsWith("'")).sort();

test('header and meta CSP allow the same external script hosts', () => {
  const header = hosts(directive(headerCsp(), 'script-src'));

  // The meta template's script-src, minus the per-page hashes it appends.
  const meta = metaFor('<script>run();</script>')!;
  const metaContent = /content="([^"]*)"/.exec(meta)![1];
  const metaHosts = hosts(directive(metaContent, 'script-src'));

  assert.deepEqual(
    metaHosts,
    header,
    'script-src external hosts differ between the firebase.json header and the ' +
      'csp-hashes.mjs meta template — add the host to BOTH (EXTRA_SCRIPT_SRC and ' +
      'the header), or the meta re-blocks what the header allows.',
  );
});

test('EXTRA_SCRIPT_SRC is the meta template source of external script hosts', () => {
  // The meta hosts must be exactly EXTRA_SCRIPT_SRC — the single knob the
  // deploy-readiness runbook points at. Guards against hosts being hard-coded
  // into metaFor() out of band.
  const meta = metaFor('<script>run();</script>')!;
  const metaContent = /content="([^"]*)"/.exec(meta)![1];
  assert.deepEqual(hosts(directive(metaContent, 'script-src')), [...EXTRA_SCRIPT_SRC].sort());
});
