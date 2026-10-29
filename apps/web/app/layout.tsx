import type { Metadata, Viewport } from 'next';
import { SITE_URL, CF_ANALYTICS_TOKEN } from '@/lib/site';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Temple — the great temples of South India',
    template: '%s · Temple',
  },
  description:
    'Find, learn, and experience the oldest temples of India — history, architecture, legends, and darshan guidance in six languages.',
  applicationName: 'Temple',
  manifest: '/manifest.webmanifest',
  appleWebApp: { capable: true, statusBarStyle: 'default', title: 'Temple' },
  icons: { icon: '/icon.svg', apple: '/icon.svg' },
  // Site-wide social defaults so shares of any page (home, circuits, festivals)
  // render a card. Pages with a better image (e.g. a temple's hero OG) override
  // `openGraph.images` in their own metadata. A per-page canonical URL is set via
  // `alternates`, so OG `url` is intentionally left to Next's metadataBase.
  openGraph: {
    type: 'website',
    siteName: 'Temple',
    title: 'Temple — the great temples of South India',
    description:
      'Find, learn, and experience the oldest temples of India — history, architecture, legends, and darshan guidance in six languages.',
    images: [{ url: '/icon-512.png', width: 512, height: 512, alt: 'Temple' }],
  },
  twitter: {
    card: 'summary',
    title: 'Temple — the great temples of South India',
    description:
      'Find, learn, and experience the oldest temples of India, in six languages.',
    images: ['/icon-512.png'],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#faf6ee' },
    { media: '(prefers-color-scheme: dark)', color: '#171310' },
  ],
  width: 'device-width',
  initialScale: 1,
};

// App Router requires <html>/<body> in the root layout, which runs above the
// [locale] segment and so cannot know the locale — it is emitted as "en" and
// corrected per-page by LocaleClient. Content language is signalled to search
// engines via hreflang alternates on each localized page.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        {/* Cloudflare Web Analytics — cookieless, no PII. External script, so
            it is allowed by the CSP via its host (no inline hash needed). */}
        {CF_ANALYTICS_TOKEN && (
          <script
            type="module"
            src="https://static.cloudflareinsights.com/beacon.min.js"
            data-cf-beacon={`{"token": "${CF_ANALYTICS_TOKEN}"}`}
          />
        )}
      </body>
    </html>
  );
}
