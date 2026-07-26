import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy · Temple',
  description:
    'How the Temple app handles your data: it collects no personal information. Saved temples stay on your device.',
  alternates: { canonical: '/privacy/' },
};

// Single canonical privacy policy for all three Temple apps — the PWA, the
// Android (Google Play) app, and the iOS (App Store) app. Google Play and the
// App Store both require a reachable policy URL; this is it:
// https://temples.dsquaregee.com/privacy/. Kept accurate to the shipped apps:
// no accounts, no analytics/ads SDKs, saved temples stored on-device only.
export default function PrivacyPolicy() {
  return (
    <main className="legal">
      <h1>Privacy Policy</h1>
      <p className="updated">Last updated: 26 July 2026</p>

      <p>
        Temple is a free, content-only app for discovering and learning about the
        great temples of South India. This policy explains what data the app does
        and does not handle. It applies to all versions of Temple — the web app
        (Progressive Web App), the Android app on Google Play, and the iOS app on
        the App Store.
      </p>

      <h2>The short version</h2>
      <p>
        <strong>Temple does not collect, store, or share any personal
        information.</strong> There are no accounts, no sign-in, no advertising,
        and no third-party analytics or tracking in the app.
      </p>

      <h2>Information we do not collect</h2>
      <ul>
        <li>We do not ask you to create an account or sign in.</li>
        <li>We do not collect your name, email address, phone number, or location.</li>
        <li>We do not use advertising identifiers or third-party tracking or
          analytics SDKs.</li>
        <li>We do not sell or share any data with third parties.</li>
      </ul>

      <h2>Information stored on your device</h2>
      <p>
        When you save a temple (the ★ favourite) or choose a language, that choice
        is stored locally on your own device — in the browser’s local storage on
        the web, or in on-device app storage on Android and iOS. It never leaves
        your device and is not transmitted to us or anyone else. Clearing the app’s
        data (or the site’s data in your browser) removes it.
      </p>

      <h2>Audio narration</h2>
      <p>
        Temple pages include optional narrated audio, which is streamed from a
        content delivery network (Google Cloud Storage) when you choose to play it.
        As with loading any web page or media, the network that delivers the file
        receives standard technical request data (such as your IP address, device
        type, and the time of the request) purely to deliver the content. This is
        ordinary internet infrastructure data; we do not use it to identify you and
        do not build any profile from it.
      </p>

      <h2>Children</h2>
      <p>
        Temple is a general-audience, educational app and is safe for all ages. It
        does not collect any personal information from anyone, including children.
      </p>

      <h2>Changes to this policy</h2>
      <p>
        If the app’s data practices ever change (for example, if optional
        account-based features are added in a future version), we will update this
        policy and its “last updated” date before those features ship.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about this policy or your privacy? Email{' '}
        <a href="mailto:support@dsquaregee.com">support@dsquaregee.com</a>.
      </p>
    </main>
  );
}
