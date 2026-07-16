import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://temples.dsquaregee.com'),
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
      <body>{children}</body>
    </html>
  );
}
