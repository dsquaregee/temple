# Phase 1 — Research Synthesis

*Reconstructed consolidated record of the five research threads (market, users,
content, technical, payments). The original long-form agent reports were lost to
container reclamation before being pushed; this file preserves every
decision-bearing finding.*

## 1. Market & competitors

- Devotional-tech is a large, funded market (~$58.6B addressable; Sri Mandir at
  40M+ downloads, significant VC funding).
- Every funded incumbent (Sri Mandir, Utsav, Temple Connect) is a
  **pooja-booking commerce play focused on the Hindi belt**. Official apps
  (TTD, TN HR&CE) are single-institution utilities.
- **Gap = our positioning**: nobody merges devotion with heritage/architecture
  storytelling, and nobody focuses on South India.
- The NRI diaspora is the high-value wedge: heritage-hungry, high willingness
  to pay, underserved by Hindi-belt commerce apps.

## 2. Users & use cases

- India is ~92% Android; the modal device is a $100–200 phone on congested 4G.
  Budget Android is the primary performance target, not the edge case.
- Regional-language parity is non-negotiable: Tamil, Telugu, Kannada,
  Malayalam, Hindi, English at launch.
- **Audio-first and offline-first are core features, not extras**: significant
  limited-literacy segment; network dead zones are common at remote temple
  sites (documented at Chola-era sites in the Kaveri delta).
- Gen Z is ~53% of spiritual travelers — the app must serve both a
  heritage-seeker mode and an elderly-devotee mode without splitting the UX.

## 3. Content & data

- 42-temple launch catalog researched, anchored on UNESCO clusters (Great
  Living Chola Temples, Group of Monuments at Hampi/Pattadakal/Mahabalipuram).
- Architecture taxonomy: Dravidian umbrella → Pallava, early/imperial Chola,
  Pandya, Vijayanagara/Nayaka phases; Hoysala and Chalukya (Vesara) as Karnataka
  branches; Kerala style as distinct.
- **Pilgrimage circuits must be a first-class entity** (Pancha Bhoota Sthalams,
  Divya Desams, Pancharama Kshetras, Jyotirlingas-in-south) — devotees think in
  circuits, and circuits create multi-session retention.
- Biggest content risk: **photography is prohibited inside most TN temples**
  (HR&CE rules). Mitigation: exterior/gopuram photography, licensed archives,
  commissioned illustration, and an explicit no-deity-imagery UI rule.
- Text must be original prose; Wikipedia-derived facts fine, copied text not.

## 4. Technical architecture

- **Flutter rejected** for this product: Flutter web renders to canvas, so
  content is invisible to search engines. Organic search ("oldest temples in
  India") is the top-of-funnel; SEO is existential. → Next.js PWA (SSG/ISR)
  + React Native/Expo sharing a TypeScript core.
- **Region conflict surfaced to owner**: Firestore's region is immutable.
  US-east DB = 150–300 ms per dynamic read from India. Decision D1: data and
  compute in Mumbai `asia-south1`; global CDN in front of static/ISR content.
- CDN strategy: Firebase Hosting / Cloud CDN edge-caches HTML+assets; images
  via an image CDN with AVIF/WebP negotiation, sized variants, long TTLs.
- Performance budget (budget Android over 4G): LCP < 2.5 s on the temple
  detail page, JS < 170 KB gz on the critical path, zero web-font download for
  first paint (system Indic fonts), offline circuit packs ≤ 64 MB each.

## 5. Payments & compliance

- **Stripe cannot be the v1 India rail** (verified July 2026): India merchant
  onboarding remains invite-only; a foreign (US) Stripe entity gets no UPI,
  and UPI ≈ 85% of Indian digital payments volume.
- **FCRA risk**: a US entity collecting/routing donations to Indian religious
  institutions can constitute a "foreign contribution" — temples need FCRA
  registration to receive it; violations are criminal. Do not touch donation
  money in v1.
- Apple/Google policy: donations to nonprofits must use approved flows (Apple:
  approved nonprofit platforms or link-out; Google: similar), and digital
  content unlocks must use IAP — a donations feature would drag the whole app
  into review risk.
- **Decision D2**: content-only v1; "Support this temple" links out to the
  temple's official donation page. Later phases can add Stripe for
  diaspora-facing premium content (a digital-goods sale, clean under IAP rules
  via web PWA, no FCRA exposure).
