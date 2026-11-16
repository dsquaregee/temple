'use client';

import { useState } from 'react';

// Posts a stay-listing enquiry to the advertise Worker (same-origin
// /api/advertise — see infra/advertise-worker). The Worker stores it and
// notifies support@. If the endpoint isn't reachable yet (Worker not deployed),
// the form degrades to a mailto so the page is never a dead end.
const ENDPOINT = '/api/advertise';
const SUPPORT = 'support@dsquaregee.com';

type Status = 'idle' | 'sending' | 'ok' | 'error';

export function AdvertiseForm() {
  const [status, setStatus] = useState<Status>('idle');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    // Honeypot: real people never fill a hidden field. Pretend success.
    if ((fd.get('company') as string)?.trim()) {
      setStatus('ok');
      form.reset();
      return;
    }
    setStatus('sending');
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fd.get('name'),
          listing: fd.get('listing'),
          place: fd.get('place'),
          url: fd.get('url'),
          email: fd.get('email'),
          phone: fd.get('phone'),
          message: fd.get('message'),
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus('ok');
      form.reset();
    } catch {
      setStatus('error');
    }
  }

  if (status === 'ok') {
    return (
      <div className="adv-ok" role="status">
        <h2>Thank you</h2>
        <p>
          We&rsquo;ve received your request and will reply at the email you gave.
          Questions? Write to <a href={`mailto:${SUPPORT}`}>{SUPPORT}</a>.
        </p>
      </div>
    );
  }

  const mailto = `mailto:${SUPPORT}?subject=${encodeURIComponent('Stay listing enquiry')}`;

  return (
    <form className="adv-form" onSubmit={onSubmit} noValidate>
      <label className="adv-field">
        <span>Your name</span>
        <input name="name" type="text" required autoComplete="name" />
      </label>
      <label className="adv-field">
        <span>Stay / homestay name</span>
        <input name="listing" type="text" required />
      </label>
      <label className="adv-field">
        <span>Temple or town it&rsquo;s near</span>
        <input name="place" type="text" required placeholder="e.g. Thiruvannamalai" />
      </label>
      <label className="adv-field">
        <span>Listing link (Airbnb, booking page, etc.)</span>
        <input name="url" type="url" required placeholder="https://" />
      </label>
      <label className="adv-field">
        <span>Email</span>
        <input name="email" type="email" required autoComplete="email" />
      </label>
      <label className="adv-field">
        <span>Phone / WhatsApp (optional)</span>
        <input name="phone" type="tel" autoComplete="tel" />
      </label>
      <label className="adv-field">
        <span>Anything else (optional)</span>
        <textarea name="message" rows={3} />
      </label>
      {/* Honeypot — hidden from people, catnip for bots. */}
      <input className="adv-hp" name="company" type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" />

      {status === 'error' && (
        <p className="adv-error" role="alert">
          Sorry — that didn&rsquo;t send. Please email us directly at{' '}
          <a href={mailto}>{SUPPORT}</a> and we&rsquo;ll take it from there.
        </p>
      )}

      <button className="adv-submit" type="submit" disabled={status === 'sending'}>
        {status === 'sending' ? 'Sending…' : 'Submit listing'}
      </button>
      <p className="adv-fineprint">
        Paid listings are shown with a &ldquo;Sponsored&rdquo; label. We only use
        your details to reply about your listing.
      </p>
    </form>
  );
}
