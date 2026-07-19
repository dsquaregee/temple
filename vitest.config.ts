import { defineConfig } from 'vitest/config';

// Root Vitest config for the monorepo. Unit tests live next to the code they
// cover (`*.test.ts`/`*.test.tsx`). Pure logic runs in the fast `node`
// environment by default; a test that needs a DOM (e.g. the favorites hook)
// opts in per-file with a `// @vitest-environment jsdom` docblock.
export default defineConfig({
  // Use the automatic JSX runtime so `.tsx` tests don't need React in scope.
  esbuild: { jsx: 'automatic' },
  test: {
    globals: true,
    environment: 'node',
    include: ['packages/**/*.test.{ts,tsx}', 'apps/**/*.test.{ts,tsx}'],
    exclude: ['**/node_modules/**', '**/.next/**', '**/dist/**'],
  },
});
