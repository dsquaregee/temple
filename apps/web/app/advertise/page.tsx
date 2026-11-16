import type { Metadata } from 'next';
import { AdvertiseForm } from '@/components/AdvertiseForm';

export const metadata: Metadata = {
  title: 'List your stay · Temple',
  description:
    'List a homestay, guest house or hotel near a temple so devotees planning a visit can find it. Clearly marked as sponsored.',
  alternates: { canonical: '/advertise/' },
};

// Standalone English B2B page — advertisers reach it from the "List your stay
// here" link on any temple's Stay section and from the footer.
export default function AdvertisePage() {
  return (
    <main className="adv">
      <a className="adv-brand" href="/">
        ← Temple
      </a>

      <div className="hero">
        <span className="eyebrow">Advertise</span>
        <h1>List your stay near a temple</h1>
        <p className="native">
          Reach devotees planning a pilgrimage, on the very page for the temple
          they&rsquo;re visiting.
        </p>
      </div>

      <section className="section">
        <h2>How it works</h2>
        <ol className="adv-steps">
          <li>Tell us about your stay and which temple it&rsquo;s near, below.</li>
          <li>
            We check it&rsquo;s a real, relevant place and reply with pricing and
            available slots for that temple.
          </li>
          <li>
            You pay offline (GPay / UPI) and we publish your listing in the
            temple&rsquo;s <strong>Stay nearby</strong> section, in all nine
            languages, marked <strong>Sponsored</strong>.
          </li>
          <li>Listings run for the agreed period and come down automatically when it ends.</li>
        </ol>
        <p className="adv-note">
          We keep listings few per temple and relevant, so the pages stay useful.
          Temple content itself is never for sale — only the Stay slot.
        </p>
      </section>

      <section className="section">
        <h2>Request a listing</h2>
        <AdvertiseForm />
      </section>
    </main>
  );
}
