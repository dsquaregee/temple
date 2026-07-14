/** @type {import('next').NextConfig} */
const nextConfig = {
  // Fully static export: every page is pre-rendered HTML served from the
  // Firebase Hosting CDN (D1) — no server runtime, fully indexable (D3).
  output: 'export',
  trailingSlash: true,
  transpilePackages: ['@temple/core', '@temple/content'],
};

export default nextConfig;
