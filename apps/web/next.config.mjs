/** @type {import('next').NextConfig} */
const nextConfig = {
  // Fully static, CDN-cacheable HTML — every temple/circuit page is
  // pre-rendered at build time (the SEO requirement behind D3).
  output: 'export',
  reactStrictMode: true,
  // Workspace packages ship raw TypeScript; Next compiles them.
  transpilePackages: ['@temple/core', '@temple/content'],
  // Static export cannot use the on-demand image optimizer.
  images: { unoptimized: true },
  // Clean, trailing-slash URLs map neatly onto CDN object storage.
  trailingSlash: true,
};

export default nextConfig;
