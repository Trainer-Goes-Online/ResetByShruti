'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import { Ico } from '@/components/Icons';
import { CONFIG } from '@/lib/config';
import { restoreParams, trackGa4Once, fireMetaIcOnce } from '@/lib/track';

/* ============================================================================
   CHECKOUT · form + offer block + order summary + sticky pay bar
   ----------------------------------------------------------------------------
   STRUCTURE SOURCE: the LIVE ARJ checkout (vsl.teamfitarjun.com/checkout),
   read from its shipped bundle — matched hierarchy exactly, with our copy:
     .co-offer-banner  ("You just unlocked a special offer!")
     .co-offer-box     (red urgency timer + Special Price Unlocked + ₹999→₹97
                        + code-applied + change-coupon)
     .co-card          (Your Details form → payment-method marks at the foot)
     .co-summary       (product line w/ struck price → collapse → sale row)
     .co-pay-btn       (Pay ₹999 ₹97 …) + .co-paytrust
     .co-sticky        (mobile pay bar)

   DELIBERATE DEVIATIONS from ARJ (client-directed this turn):
     · NO product logo/thumbnail in the summary (client: don't show our logo).
     · Confetti recoloured to OUR palette (burgundy/rose/cream) — ARJ's gold.
   The ₹999 anchor is client-authorised for checkout only (see lib/config.js).

   PAYMENT FLOW (live, unchanged): GA4 initiate_checkout → validate → Meta
   ic_event → create-order → Razorpay modal → verify → /book-a-call. */

/* ── Branded payment marks — inline SVG, real brand colours (C12: a
   third-party mark is never recoloured to a palette, so these — like the
   country flags — sit outside the one-hue rule). ──────────────────────────── */
const PAY_METHODS = [
  { title: 'UPI', svg: (
    <svg viewBox="0 0 40 16" role="img"><path d="M27 1l4 7-4 7-2-.5 3.6-6.5L28.8 1z" fill="#097939" /><path d="M30.5 1l4 7-4 7-2-.5L36.1 8 32.4 1z" fill="#ED752E" /><text x="1" y="12.4" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="11" fill="#0C3F8C">UPI</text></svg>
  ) },
  { title: 'Visa', svg: (
    <svg viewBox="0 0 44 16" role="img"><text x="2" y="13" fontFamily="Arial, sans-serif" fontStyle="italic" fontWeight="900" fontSize="13" letterSpacing=".5" fill="#1A1F71">VISA</text></svg>
  ) },
  { title: 'Mastercard', svg: (
    <svg viewBox="0 0 30 16" role="img"><circle cx="12" cy="8" r="6.4" fill="#EB001B" /><circle cx="18" cy="8" r="6.4" fill="#F79E1B" fillOpacity=".9" /></svg>
  ) },
  { title: 'RuPay', svg: (
    <svg viewBox="0 0 44 16" role="img"><text x="1" y="12.6" fontFamily="Arial, sans-serif" fontWeight="800" fontSize="11.5"><tspan fill="#0C7B3E">Ru</tspan><tspan fill="#F26E22">Pay</tspan></text></svg>
  ) },
  { title: 'American Express', svg: (
    <svg viewBox="0 0 44 16" role="img"><rect width="44" height="16" rx="2" fill="#2E77BC" /><text x="22" y="11.4" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="800" fontSize="7.4" letterSpacing=".4" fill="#fff">AMEX</text></svg>
  ) },
  { title: 'Net Banking', svg: (
    <svg viewBox="0 0 20 16" role="img" fill="none" stroke="#1C1710" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M10 2l8 4H2z" /><path d="M3.5 6.5v6M8 6.5v6M12 6.5v6M16.5 6.5v6" /><path d="M2 14h16" /></svg>
  ) },
];

/* Confetti in OUR palette — canvas-confetti needs literal hex, not CSS vars.
   Burgundy → rose → deep → cream, echoing --brand #6A1B27 and its ramp. */
const CONFETTI_COLORS = ['#6A1B27', '#8A2A38', '#A87A81', '#C98D95', '#50141E', '#F4E8EA'];

/* ARJ app/checkout/countries.ts — same list, same ordering. */
const COUNTRIES = [
  { iso: 'in', name: 'India', dial: '+91' }, { iso: 'us', name: 'United States', dial: '+1' },
  { iso: 'gb', name: 'United Kingdom', dial: '+44' }, { iso: 'ca', name: 'Canada', dial: '+1' },
  { iso: 'au', name: 'Australia', dial: '+61' }, { iso: 'ae', name: 'UAE', dial: '+971' },
  { iso: 'sa', name: 'Saudi Arabia', dial: '+966' }, { iso: 'sg', name: 'Singapore', dial: '+65' },
  { iso: 'my', name: 'Malaysia', dial: '+60' }, { iso: 'nz', name: 'New Zealand', dial: '+64' },
  { iso: 'za', name: 'South Africa', dial: '+27' }, { iso: 'de', name: 'Germany', dial: '+49' },
  { iso: 'fr', name: 'France', dial: '+33' }, { iso: 'it', name: 'Italy', dial: '+39' },
  { iso: 'es', name: 'Spain', dial: '+34' }, { iso: 'nl', name: 'Netherlands', dial: '+31' },
  { iso: 'se', name: 'Sweden', dial: '+46' }, { iso: 'ch', name: 'Switzerland', dial: '+41' },
  { iso: 'ie', name: 'Ireland', dial: '+353' }, { iso: 'bd', name: 'Bangladesh', dial: '+880' },
  { iso: 'pk', name: 'Pakistan', dial: '+92' }, { iso: 'lk', name: 'Sri Lanka', dial: '+94' },
  { iso: 'np', name: 'Nepal', dial: '+977' }, { iso: 'jp', name: 'Japan', dial: '+81' },
  { iso: 'kr', name: 'South Korea', dial: '+82' }, { iso: 'hk', name: 'Hong Kong', dial: '+852' },
  { iso: 'ph', name: 'Philippines', dial: '+63' }, { iso: 'id', name: 'Indonesia', dial: '+62' },
  { iso: 'th', name: 'Thailand', dial: '+66' }, { iso: 'qa', name: 'Qatar', dial: '+974' },
  { iso: 'kw', name: 'Kuwait', dial: '+965' }, { iso: 'om', name: 'Oman', dial: '+968' },
  { iso: 'bh', name: 'Bahrain', dial: '+973' },
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;   /* ARJ EMAIL_RE, verbatim */

/* ARJ validateField — names/town ≥2 chars, email by regex, phone 6–15 digits. */
function validateField(id, value) {
  const v = (value || '').trim();
  if (id === 'fname' || id === 'lname' || id === 'town') return v.length >= 2;
  if (id === 'email') return EMAIL_RE.test(v);
  if (id === 'phone') { const d = v.replace(/\D/g, ''); return d.length >= 6 && d.length <= 15; }
  return true;
}

const KEYS = ['fname', 'lname', 'email', 'phone', 'town'];

/* ARJ .co-struck — a struck "was" beside the live "now". */
function Struck({ was, now }) {
  return (
    <span className="co-struck">
      <span className="co-struck-was">{was}</span>
      <span className="co-struck-now">{now}</span>
    </span>
  );
}

export default function CheckoutForm() {
  const router = useRouter();
  const [form, setForm] = useState({ fname: '', lname: '', email: '', phone: '', town: '' });
  /* `touched` gates the error state — a field is never red before it is blurred. */
  const [touched, setTouched] = useState({});
  const [country, setCountry] = useState(COUNTRIES[0]);
  const [flagOpen, setFlagOpen] = useState(false);
  const [flagSearch, setFlagSearch] = useState('');
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [couponOpen, setCouponOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');
  const [loading, setLoading] = useState(false);
  const flagBoxRef = useRef(null);

  /* Pricing — ₹999 anchor → ₹97, with derived savings + % OFF (ARJ formula). */
  const priceNum = Number(CONFIG.ENTRY_PRICE) || 97;
  const origNum = Number(CONFIG.ORIGINAL_PRICE) || 999;
  const fmt = (n) => `${CONFIG.CURRENCY}${Math.round(n).toLocaleString('en-IN')}`;
  const savings = Math.max(0, origNum - priceNum);
  const pct = origNum > priceNum ? Math.round(((origNum - priceNum) / origNum) * 1000) / 10 : 0;
  const nowStr = fmt(priceNum);
  const wasStr = fmt(origNum);

  /* Confetti on arrival — 3 bursts from both bottom corners, our palette.
     Dynamic import keeps canvas-confetti off the SSR path; reduced-motion off. */
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    let cancelled = false;
    const timers = [];
    import('canvas-confetti').then(({ default: confetti }) => {
      if (cancelled) return;
      const burst = (side) => confetti({
        particleCount: 60, angle: side === 'left' ? 60 : 120, spread: 62, startVelocity: 58,
        origin: { x: side === 'left' ? 0 : 1, y: 0.62 }, colors: CONFETTI_COLORS,
        zIndex: 2147483000, scalar: 1.05, ticks: 220, disableForReducedMotion: true,
      });
      const celebrate = () => { burst('left'); burst('right'); };
      for (let i = 0; i < 3; i += 1) {
        if (i === 0) celebrate();
        else timers.push(window.setTimeout(celebrate, 180 * i));
      }
    }).catch(() => { /* confetti is decorative — never block checkout */ });
    return () => { cancelled = true; timers.forEach((t) => window.clearTimeout(t)); };
  }, []);

  /* 15-minute urgency loop — ARJ's timer, mm:ss, resets when it hits zero. */
  useEffect(() => {
    const windowMs = 60 * (Number(CONFIG.OFFER_WINDOW_MIN) || 15) * 1000;
    let start = Date.now();
    const tick = () => {
      let rem = start + windowMs - Date.now();
      if (rem <= 0) { start = Date.now(); rem = windowMs; }
      const t = Math.floor(rem / 1000);
      setTimeLeft(`${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`);
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  /* Close the country dropdown on an outside click — ARJ's onDocClick. */
  useEffect(() => {
    if (!flagOpen) return undefined;
    const onDocClick = (e) => {
      if (flagBoxRef.current && !flagBoxRef.current.contains(e.target)) setFlagOpen(false);
    };
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, [flagOpen]);

  const filtered = useMemo(() => {
    const q = flagSearch.trim().toLowerCase();
    if (!q) return COUNTRIES;
    return COUNTRIES.filter((c) => c.name.toLowerCase().includes(q) || c.dial.includes(q));
  }, [flagSearch]);

  const update = useCallback((key, value) => setForm((p) => ({ ...p, [key]: value })), []);
  const blur = useCallback((key) => setTouched((p) => ({ ...p, [key]: true })), []);
  const hasError = (key) => Boolean(touched[key]) && !validateField(key, form[key]);

  const buildCustomer = () => ({
    firstName: form.fname.trim(),
    lastName: form.lname.trim(),
    email: form.email.trim(),
    phone: form.phone.trim(),
    city: form.town.trim(),
    countryCode: country.iso.toUpperCase(),
    dialCode: country.dial,
  });

  const onSubmit = async (e) => {
    e.preventDefault();

    /* GA4 initiate_checkout fires FIRST, before validation — the signal is
       "did they attempt to pay" (GA4 brief v2.0). Independent of Meta. */
    trackGa4Once('initiate_checkout');

    const allTouched = {};
    KEYS.forEach((k) => { allTouched[k] = true; });
    setTouched(allTouched);

    const firstBad = KEYS.find((k) => !validateField(k, form[k]));
    if (firstBad) {
      document.getElementById(`f-${firstBad}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setLoading(true);
    const customer = buildCustomer();
    const attr = restoreParams();

    /* Meta ic_event — after validation, before create-order. Full PII (9.3 EMQ).
       Non-blocking: a tracking failure must never stop the payment. */
    try { await fireMetaIcOnce(customer, attr); } catch { /* ignore */ }

    try {
      const res = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // attr carries utm_* + fbclid + referrer + landing_url + ts (click time).
        body: JSON.stringify({
          amount: Number(CONFIG.ENTRY_PRICE) || 97,
          currency: 'INR',
          customer,
          utm: attr,
          fbclid: attr.fbclid || '',
          fbclidTs: attr.ts || 0,
        }),
      });
      const order = await res.json();
      if (!order.ok || !order.orderId) {
        setLoading(false);
        alert('We could not start the payment just now. Please try again in a moment.');
        return;
      }
      openRazorpay(order, customer);
    } catch {
      setLoading(false);
      alert('Something went wrong starting the payment. Please try again.');
    }
  };

  const openRazorpay = (order, customer) => {
    const Rzp = typeof window !== 'undefined' && window.Razorpay;
    if (!Rzp) {
      setLoading(false);
      alert('The payment library did not load. Please refresh the page and try again.');
      return;
    }
    const rzp = new Rzp({
      key: order.keyId,
      amount: order.amount,
      currency: order.currency,
      name: 'Reset by Shruti Solanki',
      description: `${CONFIG.CALL_MINUTES}-minute 1:1 diagnosis call with Shruti`,
      order_id: order.orderId,
      prefill: {
        name: `${customer.firstName} ${customer.lastName}`.trim(),
        email: customer.email,
        contact: `${customer.dialCode}${customer.phone}`,
      },
      notes: { kind: 'client_funnel' },
      theme: { color: '#6A1B27' },
      handler: async (resp) => {
        try {
          const v = await fetch('/api/razorpay/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(resp),
          });
          const vr = await v.json();
          if (vr.ok) router.push('/book-a-call');
          else {
            setLoading(false);
            alert('We could not verify the payment. If you were charged, please contact support and we will sort it out right away.');
          }
        } catch {
          setLoading(false);
          alert('Payment verification failed. If you were charged, please contact support.');
        }
      },
      modal: { ondismiss: () => setLoading(false) },
    });
    rzp.on('payment.failed', () => {
      setLoading(false);
      alert('The payment did not go through. Please try again.');
    });
    rzp.open();
  };

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />
      <div className="co-grid">
        {/* ═══ LEFT · OFFER + YOUR DETAILS ═══════════════════════════════ */}
        <form className="co-form" id="co-form" noValidate onSubmit={onSubmit}>
          {/* Offer banner — "you unlocked a special offer" + code. */}
          <div className="co-offer-banner">
            <span className="co-offer-ic" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="8" width="18" height="4" rx="1" />
                <path d="M12 8v13" />
                <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
                <path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5" />
              </svg>
            </span>
            <div className="co-offer-banner-text">
              <strong>You just unlocked a special offer!</strong>
              <span>Exclusive price applied just for you with code <b className="co-offer-code">{CONFIG.OFFER_CODE}</b></span>
            </div>
          </div>

          {/* Offer box — urgency timer + Special Price Unlocked (₹999→₹97). */}
          <div className="co-offer-box">
            <div className="co-offer-timer">
              <span className="co-offer-timer-lbl">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 22h14M5 2h14M17 22v-4.2a2 2 0 0 0-.6-1.4L12 12l-4.4 4.4a2 2 0 0 0-.6 1.4V22M7 2v4.2a2 2 0 0 0 .6 1.4L12 12l4.4-4.4A2 2 0 0 0 17 6.2V2" />
                </svg>
                Offer may end in:
              </span>
              <span className="co-offer-timer-val">{timeLeft || `${CONFIG.OFFER_WINDOW_MIN}:00`}</span>
            </div>

            <div className="co-offer-unlocked">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="4" y="11" width="16" height="10" rx="2" />
                <path d="M8 11V7a4 4 0 0 1 7.5-2" />
              </svg>
              Special Price Unlocked!
            </div>

            <div className="co-offer-price">
              <div className="co-offer-price-left">
                <span className="co-offer-was">{wasStr}</span>
                <span className="co-offer-off">{pct}% OFF</span>
              </div>
              <span className="co-offer-now">{nowStr}</span>
            </div>

            <div className="co-offer-applied">
              <span className="co-offer-applied-ic" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.6 13.4l-7.2 7.2a2 2 0 0 1-2.8 0l-7.2-7.2a2 2 0 0 1-.6-1.4V4.8a2 2 0 0 1 2-2h7.2a2 2 0 0 1 1.4.6l7.2 7.2a2 2 0 0 1 0 2.8z" />
                  <circle cx="7.5" cy="7.5" r="1.2" fill="currentColor" />
                </svg>
              </span>
              <span className="co-offer-applied-text">
                <b>{CONFIG.OFFER_CODE}</b> applied — saving {fmt(savings)}
              </span>
            </div>

            <button
              type="button" className="co-offer-change"
              aria-expanded={couponOpen}
              onClick={() => setCouponOpen((v) => !v)}
            >
              {couponOpen ? 'Keep this offer' : 'Change coupon code'}
            </button>
            {couponOpen ? (
              <div className="co-offer-change-row">
                <input type="text" className="co-coupon-input" placeholder="ENTER CODE" autoComplete="off" aria-label="Coupon code" />
                <button type="button" className="co-coupon-apply">Apply</button>
              </div>
            ) : null}
          </div>

          {/* Your Details card */}
          <div className="co-card">
            <div className="co-step-head">
              <span className="co-step-num"><Ico id="user" className="ico" /></span>
              <div>
                <p className="co-step-eyebrow">Secure Checkout</p>
                <h2>Your Details</h2>
                <p className="hint">We’ll send your call link to these details.</p>
              </div>
            </div>

            <div className="co-row">
              <CoField
                id="fname" label="First Name" placeholder="Priya" autoComplete="given-name"
                value={form.fname} onChange={update} onBlur={blur}
                hasError={hasError('fname')} errorMsg="Please enter your first name"
              />
              <CoField
                id="lname" label="Last Name" placeholder="Sharma" autoComplete="family-name"
                value={form.lname} onChange={update} onBlur={blur}
                hasError={hasError('lname')} errorMsg="Please enter your last name"
              />
            </div>

            <div className="co-row-full">
              <CoField
                id="email" label="Email Address" note="Call link comes here"
                type="email" inputMode="email" placeholder="priya@example.com" autoComplete="email"
                value={form.email} onChange={update} onBlur={blur}
                hasError={hasError('email')} errorMsg="Please enter a valid email address"
              />
            </div>

            {/* Phone — ARJ .co-phone with the flag/dial picker. */}
            <div className="co-row-full">
              <div className={`co-field${hasError('phone') ? ' has-error' : ''}`} id="f-phone">
                <label className="main" htmlFor="phone">
                  Phone Number <span className="req">*</span>
                </label>

                <div className="co-phone" ref={flagBoxRef}>
                  <button
                    type="button"
                    className={`co-flag-btn${flagOpen ? ' on' : ''}`}
                    aria-haspopup="listbox"
                    aria-expanded={flagOpen}
                    aria-label={`Country code, currently ${country.name} ${country.dial}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setFlagOpen((v) => !v);
                      if (!flagOpen) setFlagSearch('');
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      className="flag-img"
                      src={`https://flagcdn.com/w40/${country.iso}.png`}
                      srcSet={`https://flagcdn.com/w80/${country.iso}.png 2x`}
                      alt="" width={26} height={18}
                    />
                    <span className="code">{country.dial}</span>
                    <Ico id="chev" className="ico caret" />
                  </button>

                  <input
                    type="tel" id="phone" name="phone"
                    className={`co-input${form.phone && !hasError('phone') ? ' valid' : ''}`}
                    placeholder="9876543210" autoComplete="tel-national" inputMode="numeric" required
                    value={form.phone}
                    onChange={(e) => update('phone', e.target.value.replace(/\D/g, ''))}
                    onBlur={() => blur('phone')}
                  />

                  <div className={`co-flag-drop${flagOpen ? ' on' : ''}`}>
                    <div className="co-flag-search">
                      <input
                        type="text" placeholder="Search country…" autoComplete="off"
                        aria-label="Search country"
                        value={flagSearch}
                        onChange={(e) => setFlagSearch(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Escape') setFlagOpen(false);
                          else if (e.key === 'Enter' && filtered[0]) {
                            e.preventDefault();
                            setCountry(filtered[0]);
                            setFlagOpen(false);
                          }
                        }}
                      />
                    </div>
                    <div className="co-flag-list" role="listbox">
                      {filtered.length === 0 ? (
                        <p className="co-flag-empty">No match</p>
                      ) : filtered.map((c) => (
                        <button
                          key={c.iso + c.dial}
                          type="button"
                          role="option"
                          aria-selected={c.iso === country.iso}
                          className={`co-flag-opt${c.iso === country.iso ? ' sel' : ''}`}
                          onClick={() => { setCountry(c); setFlagOpen(false); }}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            className="flag-img"
                            src={`https://flagcdn.com/w40/${c.iso}.png`}
                            srcSet={`https://flagcdn.com/w80/${c.iso}.png 2x`}
                            alt="" width={24} height={16}
                          />
                          <span className="name">{c.name}</span>
                          <span className="dial">{c.dial}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <p className="co-err">
                  <Ico id="x" className="ico" />
                  <span>Please enter a valid mobile number (6–15 digits)</span>
                </p>
              </div>
            </div>

            <div className="co-row-full" style={{ marginBottom: 4 }}>
              <CoField
                id="town" label="Town / City" placeholder="Mumbai" autoComplete="address-level2"
                value={form.town} onChange={update} onBlur={blur}
                hasError={hasError('town')} errorMsg="Please enter your town or city"
              />
            </div>

            {/* Payment marks — ARJ places these at the foot of the form card. */}
            <div className="co-pm">
              <span className="lbl">Accepted payment methods</span>
              {PAY_METHODS.map((m) => (
                <span className="pm-badge" key={m.title} title={m.title} aria-label={m.title}>
                  {m.svg}
                </span>
              ))}
            </div>
          </div>
        </form>

        {/* ═══ RIGHT · ORDER SUMMARY (rides ABOVE the form ≤900px) ════════ */}
        <aside className="co-summary">
          <div className="co-card">
            <div className="co-sum-head">
              <span className="bag"><Ico id="cart" className="ico" /></span>
              <h2>Order Summary</h2>
            </div>

            {/* No product thumbnail — client-directed (don't show our logo). */}
            <div className="co-prod co-prod--nologo">
              <div className="co-prod-info">
                <div className="co-prod-title">
                  <h4 className="co-prod-name">1:1 Root Cause Clarity Call</h4>
                  <span className="co-prod-price"><Struck was={wasStr} now={nowStr} /></span>
                </div>
                <button
                  type="button"
                  className={`co-more-toggle${detailsOpen ? ' is-open' : ''}`}
                  aria-expanded={detailsOpen}
                  aria-controls="co-prod-more"
                  onClick={() => setDetailsOpen((v) => !v)}
                >
                  {detailsOpen ? 'Hide details' : 'Tap for more details'}
                  <Ico id="chev" className="ico" />
                </button>
              </div>
            </div>

            <div className={`co-sum-collapse${detailsOpen ? ' on' : ''}`}>
              <div className="co-sum-collapse-inner">
                <div className={`co-prod-more${detailsOpen ? ' on' : ''}`} id="co-prod-more">
                  <div className="co-prod-more-inner">
                    <p className="co-more-eyebrow">
                      Personalised consultation · {CONFIG.CALL_MINUTES} min · Refundable
                    </p>
                    {/* COPY.md · PAGE 2 — these three, in this order. Item 2 is
                        the highest-leverage line on the page. */}
                    <ul className="co-more-list">
                      <li>Personalised <strong>Hormone Diagnosis &amp; {CONFIG.PROGRAMME_DAYS}-Day Reset Roadmap</strong></li>
                      <li>An honest fit check — <strong>if Reset isn’t right for you, Shruti will say so and refund your {nowStr}</strong></li>
                      <li>A walk-through of the <strong>{CONFIG.PROGRAMME_WEEKS}-week programme</strong> and your path forward</li>
                    </ul>
                  </div>
                </div>

                <div className="co-prices">
                  <div className="co-price-row sale">
                    <span className="lbl">Diagnosis call</span>
                    <span className="val"><Struck was={wasStr} now={nowStr} /></span>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit" form="co-form"
              className={`co-pay-btn${loading ? ' loading' : ''}`}
              disabled={loading}
            >
              <span className="spinner" />
              <span className="pay-lbl">
                Pay <span className="co-pay-was">{wasStr}</span>{' '}
                <span className="co-pay-now">{nowStr}</span>{' '}and Book My Call
              </span>
              <span className="arrow"><Ico id="arrow" className="ico" /></span>
            </button>

            <ul className="co-paytrust">
              <li><Ico id="lock" className="ico" /> 256-bit SSL</li>
              <li><Ico id="shield" className="ico" /> PCI Compliant</li>
              <li><Ico id="check" className="ico" /> {nowStr} Fully Refundable</li>
            </ul>
          </div>
        </aside>
      </div>

      {/* ═══ STICKY MOBILE PAY BAR — ARJ .co-sticky, on from first paint ═══ */}
      <div className="co-sticky on">
        <div className="co-sticky-inner">
          <button
            type="submit" form="co-form"
            className={`co-pay-btn${loading ? ' loading' : ''}`}
            disabled={loading}
          >
            <span className="spinner" />
            <span className="pay-lbl">
              Pay <span className="co-pay-was">{wasStr}</span>{' '}
              <span className="co-pay-now">{nowStr}</span>{' '}&amp; Book Your Slot
            </span>
            <span className="arrow"><Ico id="arrow" className="ico" /></span>
          </button>
        </div>
      </div>
    </>
  );
}


/* ─── Standard text field — ARJ's CoField, same markup ─────────────────────── */
function CoField({
  id, label, note, placeholder, type = 'text', autoComplete, inputMode,
  value, onChange, onBlur, hasError, errorMsg,
}) {
  return (
    <div className={`co-field${hasError ? ' has-error' : ''}`} id={`f-${id}`}>
      <label className="main" htmlFor={id}>
        {label} <span className="req">*</span>
        {note ? <span className="note">{note}</span> : null}
      </label>
      <input
        type={type}
        id={id}
        name={id}
        className={`co-input${value && !hasError ? ' valid' : ''}`}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={inputMode}
        required
        value={value}
        onChange={(e) => onChange(id, e.target.value)}
        onBlur={() => onBlur(id)}
      />
      <p className="co-err">
        <Ico id="x" className="ico" />
        <span>{errorMsg}</span>
      </p>
    </div>
  );
}
