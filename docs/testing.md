# Testing

Phase 4 (Test/Harden) groundwork. The suite runs on Node's **built-in test
runner** with **native TypeScript type-stripping** — no test-runner dependency
and no install step, mirroring the zero-dependency philosophy of the content
validators so tests run pre-install in CI.

## Running

```bash
pnpm test                              # whole monorepo
pnpm --filter @temple/core test        # core logic only
pnpm --filter @temple/content test     # catalog invariants only
node --test "packages/**/test/*.test.ts" "apps/**/test/*.test.ts"
```

Requires **Node 22+** (native `.ts` execution). CI runs the suite in a
dedicated `Unit tests` job on Node 22.

## Coverage

**`packages/core`** — the pure logic shared by web and mobile:

- `discover` — era bucketing boundaries, query matching (case-insensitive,
  multi-token AND, native-script), region faceting.
- `featured` — deterministic daily rotation (`epochDay`, `indexOfDay`: wrap,
  negatives, empty list, whole-catalog coverage).
- `media` — deterministic per-temple accent colors (valid hex, stable, spread).
- `i18n` — every locale mirrors the English UI-string key structure exactly and
  has no empty strings; `t()` fallback.

**`packages/content`** — the real catalog JSON on disk:

- Schema: required prose + factual fields present and non-empty.
- Referential integrity: circuit stops resolve to temples; temple↔circuit
  membership is bidirectional.
- Geographic sanity: century and coordinates within plausible bounds.
- **Cross-locale factual parity**: translations must not drift structural data
  (century, UNESCO flag, coordinates, circuit membership, stop ordering are
  identical across all six locales — only prose is translated).

**`apps/web`** — cross-cutting asset integrity:

- Every temple has a non-empty hero placeholder SVG (guards the LCP preload
  against a temple added without regenerated heroes), and no orphaned heroes.
- CSP hashing (`csp-hashes`): hashes executable inline scripts, skips data
  blocks, dedups, and injects an idempotent `<meta>` policy with no
  `unsafe-inline` (guards the postbuild against regex regressions).
- Hero background tones map to `.hero-bg-*` classes (`heroBgClass`, core) so
  the export carries no inline styles; a content test asserts every stored
  `hero.color` is a `HERO_PALETTE` tone, so the class always resolves.

## Lighthouse CI

A separate `Lighthouse` CI job serves the export with the production
`firebase.json` headers (`apps/web/scripts/serve-out.mjs`) and runs Lighthouse
(`@lhci/cli`, config in `apps/web/lighthouserc.json`) over five representative
pages. Accessibility, SEO, best-practices, and CLS are hard gates; the
performance score is a non-blocking warning (it varies with runner load — the
zero-dependency byte budget is the hard performance gate). Run locally with
`pnpm --filter @temple/web exec lhci autorun` after `pnpm build:web`.

`scripts/validate.mjs` and `scripts/qa-translations.mjs` remain the
zero-dependency CI gate for content; the content tests express the same
contract plus the cross-locale parity checks, runnable from the same harness as
the core tests.

## Conventions

- Test files live in `packages/<pkg>/test/` or `apps/<app>/test/`, named
  `*.test.ts`.
- Import the module under test directly (`../src/foo.ts`) — modules use
  type-only internal imports, which strip cleanly under native execution.
- Use `node:test` + `node:assert/strict`.
