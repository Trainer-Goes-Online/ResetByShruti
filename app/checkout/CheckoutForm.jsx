'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import { Ico } from '@/components/Icons';
import Price from '@/components/Price';
import { CONFIG } from '@/lib/config';
import { restoreParams, trackGa4Once, fireMetaIcOnce } from '@/lib/track';

/* ============================================================================
   CHECKOUT · form + order summary + sticky pay bar
   ----------------------------------------------------------------------------
   STRUCTURE SOURCE: _reference/teamfitarjun/app/checkout/CheckoutView.tsx.
   The whole .co-grid lives here rather than being split across page.jsx,
   because ARJ's summary owns the pay button and the pay button owns the
   form's submit — one client boundary, one source of truth for validity.

   PAYMENT FLOW (live):
     GA4 initiate_checkout (before validation) → validate → Meta ic_event
     (full PII, 9.3 EMQ) → create-order (packs UTM/fbclid/fbc/fbp/IP/UA into
     order.notes) → Razorpay ₹97 modal → success handler → checkout-signature
     verify → redirect to /book-a-call. The `sales` event + Pabbly row are the
     webhook's job (server-to-server), so a UPI-away payer is still tracked.
   ========================================================================== */

/* ARJ app/checkout/countries.ts — same list, same ordering. */
const COUNTRIES = [
  { iso: 'in', name: 'India', dial: '+91' },
  { iso: 'us', name: 'United States', dial: '+1' },
  { iso: 'gb', name: 'United Kingdom', dial: '+44' },
  { iso: 'ca', name: 'Canada', dial: '+1' },
  { iso: 'au', name: 'Australia', dial: '+61' },
  { iso: 'ae', name: 'UAE', dial: '+971' },
  { iso: 'sa', name: 'Saudi Arabia', dial: '+966' },
  { iso: 'sg', name: 'Singapore', dial: '+65' },
  { iso: 'my', name: 'Malaysia', dial: '+60' },
  { iso: 'nz', name: 'New Zealand', dial: '+64' },
  { iso: 'za', name: 'South Africa', dial: '+27' },
  { iso: 'de', name: 'Germany', dial: '+49' },
  { iso: 'fr', name: 'France', dial: '+33' },
  { iso: 'it', name: 'Italy', dial: '+39' },
  { iso: 'es', name: 'Spain', dial: '+34' },
  { iso: 'nl', name: 'Netherlands', dial: '+31' },
  { iso: 'se', name: 'Sweden', dial: '+46' },
  { iso: 'ch', name: 'Switzerland', dial: '+41' },
  { iso: 'ie', name: 'Ireland', dial: '+353' },
  { iso: 'bd', name: 'Bangladesh', dial: '+880' },
  { iso: 'pk', name: 'Pakistan', dial: '+92' },
  { iso: 'lk', name: 'Sri Lanka', dial: '+94' },
  { iso: 'np', name: 'Nepal', dial: '+977' },
  { iso: 'jp', name: 'Japan', dial: '+81' },
  { iso: 'kr', name: 'South Korea', dial: '+82' },
  { iso: 'hk', name: 'Hong Kong', dial: '+852' },
  { iso: 'ph', name: 'Philippines', dial: '+63' },
  { iso: 'id', name: 'Indonesia', dial: '+62' },
  { iso: 'th', name: 'Thailand', dial: '+66' },
  { iso: 'qa', name: 'Qatar', dial: '+974' },
  { iso: 'kw', name: 'Kuwait', dial: '+965' },
  { iso: 'om', name: 'Oman', dial: '+968' },
  { iso: 'bh', name: 'Bahrain', dial: '+973' },
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;   /* ARJ EMAIL_RE, verbatim */

/* ARJ validateField — names/town ≥2 chars, email by regex, phone 6–15 digits. */
function validateField(id, value) {
  const v = (value || '').trim();
  if (id === 'fname' || id === 'lname' || id === 'town') return v.length >= 2;
  if (id === 'email') return EMAIL_RE.test(v);
  if (id === 'phone') {
    const d = v.replace(/\D/g, '');
    return d.length >= 6 && d.length <= 15;
  }
  return true;
}

const KEYS = ['fname', 'lname', 'email', 'phone', 'town'];

/* ── Branded payment marks — inline SVG, real brand colours ────────────────
   Razorpay settles UPI / cards / net-banking, so these are the honest set.
   Rendered as SVG rather than .webp bitmaps: crisp at every DPR, no extra
   asset pipeline, and self-contained (the reference funnel does the same).
   Each viewBox is normalised to height 16 so the badge shell can size them
   uniformly with `height:18px; width:auto`. */
const PAY_METHODS = [
  {
    title: 'UPI',
    svg: (
      <svg viewBox="0 0 40 16" xmlns="http://www.w3.org/2000/svg" role="img">
        <path d="M27 1l4 7-4 7-2-.5 3.6-6.5L28.8 1z" fill="#097939" />
        <path d="M30.5 1l4 7-4 7-2-.5L36.1 8 32.4 1z" fill="#ED752E" />
        <text x="1" y="12.4" fontFamily="Arial, Helvetica, sans-serif" fontWeight="700" fontSize="11" fill="#0C3F8C">UPI</text>
      </svg>
    ),
  },
  {
    title: 'Visa',
    svg: (
      <svg viewBox="0 0 44 16" xmlns="http://www.w3.org/2000/svg" role="img">
        <text x="2" y="13" fontFamily="Arial, Helvetica, sans-serif" fontStyle="italic" fontWeight="900" fontSize="13" letterSpacing=".5" fill="#1A1F71">VISA</text>
      </svg>
    ),
  },
  {
    title: 'Mastercard',
    svg: (
      <svg viewBox="0 0 30 16" xmlns="http://www.w3.org/2000/svg" role="img">
        <circle cx="12" cy="8" r="6.4" fill="#EB001B" />
        <circle cx="18" cy="8" r="6.4" fill="#F79E1B" fillOpacity=".9" />
      </svg>
    ),
  },
  {
    title: 'RuPay',
    svg: (
      <svg viewBox="0 0 44 16" xmlns="http://www.w3.org/2000/svg" role="img">
        <text x="1" y="12.6" fontFamily="Arial, Helvetica, sans-serif" fontWeight="800" fontSize="11.5">
          <tspan fill="#0C7B3E">Ru</tspan><tspan fill="#F26E22">Pay</tspan>
        </text>
      </svg>
    ),
  },
  {
    title: 'American Express',
    svg: (
      <svg viewBox="0 0 44 16" xmlns="http://www.w3.org/2000/svg" role="img">
        <rect width="44" height="16" rx="2" fill="#2E77BC" />
        <text x="22" y="11.4" textAnchor="middle" fontFamily="Arial, Helvetica, sans-serif" fontWeight="800" fontSize="7.4" letterSpacing=".4" fill="#fff">AMEX</text>
      </svg>
    ),
  },
  {
    title: 'Net Banking',
    svg: (
      <svg viewBox="0 0 20 16" xmlns="http://www.w3.org/2000/svg" role="img" fill="none" stroke="#1C1710" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 2l8 4H2z" />
        <path d="M3.5 6.5v6M8 6.5v6M12 6.5v6M16.5 6.5v6" />
        <path d="M2 14h16" />
      </svg>
    ),
  },
];

export default function CheckoutForm() {
  const router = useRouter();
  const [form, setForm] = useState({ fname: '', lname: '', email: '', phone: '', town: '' });
  /* `touched` gates the error state — a field is never red before it is blurred. */
  const [touched, setTouched] = useState({});
  const [country, setCountry] = useState(COUNTRIES[0]);
  const [flagOpen, setFlagOpen] = useState(false);
  const [flagSearch, setFlagSearch] = useState('');
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const flagBoxRef = useRef(null);

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

    /* Meta ic_event — after validation, before create-order. Full PII (9.3 EMQ).
       Non-blocking: a tracking failure must never stop the payment. */
    try { await fireMetaIcOnce(customer); } catch { /* ignore */ }

    try {
      const attr = restoreParams();
      const res = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Number(CONFIG.ENTRY_PRICE) || 97,
          currency: 'INR',
          customer,
          utm: attr,
          fbclid: attr.fbclid || '',
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
      theme: { color: '#A8542F' },
      handler: async (resp) => {
        /* Verified capture only → advance. Tracking is the webhook's job. */
        try {
          const v = await fetch('/api/razorpay/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(resp),
          });
          const vr = await v.json();
          if (vr.ok) {
            router.push('/book-a-call');
          } else {
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
        {/* ═══ LEFT · YOUR DETAILS ═══════════════════════════════════════ */}
        <form className="co-form" id="co-form" noValidate onSubmit={onSubmit}>
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

            {/* ARJ .co-trust-row — four chips, 4-up desktop / 2-up mobile. */}
            <div className="co-trust-row">
              <div className="co-trust-chip"><Ico id="lock" className="ico" /> SSL Secure</div>
              <div className="co-trust-chip"><Ico id="shield" className="ico" /> Verified</div>
              <div className="co-trust-chip"><Ico id="check" className="ico" /> Protected</div>
              <div className="co-trust-chip"><Ico id="clock" className="ico" /> Instant</div>
            </div>
          </div>
        </form>

        {/* ═══ RIGHT · ORDER SUMMARY (rides ABOVE the form ≤900px) ════════
            Anatomy matched to the reference: title + price row → disclosure
            toggle → a tinted "what's included" panel with filled ticks and an
            inline footer → ruled price line → total. No product thumbnail —
            the reference summary carries none. */}
        <aside className="co-summary">
          <div className="co-card">
            <div className="co-sum-head">
              <span className="bag"><Ico id="cart" className="ico" /></span>
              <h2>Order Summary</h2>
            </div>

            <div className="co-prod">
              <div className="co-prod-info">
                <div className="co-prod-title">
                  <h3>1:1 Diagnostic Call with Shruti</h3>
                  <span className="co-prod-price"><Price /></span>
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

            {/* Everything down to the pay button collapses on mobile; CSS forces
                it open ≥901px, so the state is mobile-only. */}
            <div className={`co-sum-collapse${detailsOpen ? ' on' : ''}`}>
              <div className="co-sum-collapse-inner">
                <div className={`co-prod-more${detailsOpen ? ' on' : ''}`} id="co-prod-more">
                  <div className="co-prod-more-inner">
                    <p className="co-more-eyebrow">
                      Personalised consultation · 1:1 With Shruti
                    </p>
                    {/* COPY.md · PAGE 2 — these three, in this order. Item 2 is
                        the highest-leverage line on the page: volunteering that
                        she might be disqualified is what makes ₹97 read as safe
                        rather than as a trap. */}
                    <ul className="co-more-list">
                      <li>Personalised Hormone Diagnosis &amp; {CONFIG.PROGRAMME_DAYS}-Day Reset Roadmap</li>
                      <li>An honest fit check — if Reset isn’t right for you, Shruti will tell you honestly, with no pressure to enrol</li>
                      <li>A walk-through of the {CONFIG.PROGRAMME_WEEKS}-week programme and your path forward</li>
                    </ul>
                    {/* <p className="co-more-foot">Refundable · Secure checkout</p> */}
                  </div>
                </div>

                {/* No struck anchor and no discount row — see p01-checkout.css. */}
                <div className="co-prices">
                  {/* <div className="co-price-row">
                    <span className="lbl">Diagnosis call</span>
                    <span className="val"><Price /></span>
                  </div> */}
                  <div className="co-divider" />
                </div>

                <div className="co-total-row">
                  <span className="lbl">Total due today</span>
                  <span className="new"><Price /></span>
                </div>

                {/* Branded payment marks. Third-party logos keep their real
                    colours (C12 — never recolour a mark to fit a palette), so
                    these sit outside the one-hue rule exactly as the flags do. */}
                <div className="co-pm">
                  <span className="lbl">Accepted payment methods</span>
                  {PAY_METHODS.map((m) => (
                    <span className="pm-badge" key={m.title} title={m.title} aria-label={m.title}>
                      {m.svg}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <button
              type="submit" form="co-form"
              className={`co-pay-btn${loading ? ' loading' : ''}`}
              disabled={loading}
            >
              <span className="spinner" />
              <span className="pay-lbl">Pay <Price /> and Book My Call</span>
              <span className="arrow"><Ico id="arrow" className="ico" /></span>
            </button>

            <ul className="co-paytrust">
              <li><Ico id="lock" className="ico" /> 256-bit SSL</li>
              <li><Ico id="shield" className="ico" /> PCI Compliant</li>
              <li><Ico id="check" className="ico" /> 90-Day Money-Back Guarantee</li>
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
            <span className="pay-lbl">Pay <Price /> &amp; Book My Slot</span>
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
