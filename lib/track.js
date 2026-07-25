/* ============================================================================
   CLIENT-SIDE TRACKING HELPERS  (browser only; every fn is window-guarded)
   ----------------------------------------------------------------------------
   · captureParams / restoreParams — first-touch attribution carried LP →
     checkout → book-a-call → thank-you via localStorage, so the Razorpay
     order.notes (and therefore Pabbly + the sales CAPI event) get the full
     UTM/fbclid set even though the checkout URL itself is clean.
   · trackGa4Once — one gtag event per browser, ever (GA4 brief v2.0 dedup).
   · fireMetaAtcOnce / fireMetaIcOnce — trigger-only POSTs to our CAPI routes;
     the server does all hashing + the Graph POST.

   Storage prefix `reset_` matches the funnel's existing convention
   (`reset_cd_end` in FunnelEffects). Do not invent a new one.
   ========================================================================== */
const PREFIX = 'reset_';
const ATTR_KEY = PREFIX + 'attr';

/* ---- attribution ---------------------------------------------------------- */

export function captureParams() {
  if (typeof window === 'undefined') return;
  try {
    const sp = new URLSearchParams(window.location.search);
    const g = (k) => sp.get(k) || '';
    const attr = {
      source: g('utm_source'), medium: g('utm_medium'), campaign: g('utm_campaign'),
      content: g('utm_content'), term: g('utm_term'),
      fbclid: g('fbclid'), gclid: g('gclid'),
    };
    const hasAny = Object.values(attr).some(Boolean);
    // First-touch: keep the original ad params, never overwrite on later pages.
    if (hasAny && !localStorage.getItem(ATTR_KEY)) {
      localStorage.setItem(ATTR_KEY, JSON.stringify(attr));
    }
  } catch { /* private mode — attribution is best-effort */ }
}

export function restoreParams() {
  if (typeof window === 'undefined') return {};
  try { return JSON.parse(localStorage.getItem(ATTR_KEY) || '{}'); } catch { return {}; }
}

/* ---- GA4 (independent of Meta; no monetary values) ------------------------ */

export function trackGa4Once(event) {
  if (typeof window === 'undefined') return;
  // Do NOT stamp the flag when GA4 is absent (host-gated/dev) — otherwise the
  // event is permanently suppressed for this browser (GA4 brief trap #2).
  if (typeof window.gtag !== 'function') return;
  const key = `${PREFIX}ga4_${event}_fired`;
  try { if (localStorage.getItem(key)) return; } catch { /* fire anyway */ }
  try { localStorage.setItem(key, '1'); } catch { /* best-effort */ }   // stamp BEFORE firing (navigation-safe)
  try { window.gtag('event', event); } catch { /* analytics must never throw */ }
}

/* ---- Meta atc_event (landing CTA; no PII available) ----------------------- */

export function fireMetaAtcOnce() {
  if (typeof window === 'undefined') return;
  const key = `${PREFIX}atc_fired`;
  try { if (localStorage.getItem(key)) return; } catch { /* fire anyway */ }
  try { localStorage.setItem(key, '1'); } catch { /* best-effort */ }   // optimistic — survives tab-kill mid-nav
  const body = JSON.stringify({ eventSourceUrl: window.location.href });
  try {
    const url = '/api/meta/add-to-cart';
    if (navigator.sendBeacon) {
      navigator.sendBeacon(url, new Blob([body], { type: 'application/json' }));
    } else {
      fetch(url, { method: 'POST', body, keepalive: true, headers: { 'Content-Type': 'application/json' } }).catch(() => {});
    }
  } catch { /* never block the click */ }
}

/* ---- Meta ic_event (checkout Pay; full PII, deduped per email) ------------ */

export async function fireMetaIcOnce(customer) {
  if (typeof window === 'undefined') return;
  const emailHash = await sha256Hex((customer.email || '').trim().toLowerCase());
  const key = `${PREFIX}ic_fired`;
  try { if (localStorage.getItem(key) === emailHash) return; } catch { /* fire anyway */ }
  try {
    const res = await fetch('/api/meta/initiate-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customer, eventSourceUrl: window.location.href }),
    });
    if (res.ok) { try { localStorage.setItem(key, emailHash); } catch { /* best-effort */ } }
  } catch { /* never block the payment */ }
}

async function sha256Hex(str) {
  try {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
    return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
  } catch { return str; }
}
