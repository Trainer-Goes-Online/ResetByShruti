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
import { isAdUtm } from './attribution';

const PREFIX = 'reset_';
const ATTR_KEY = PREFIX + 'attr';
const ATTR_TTL_DAYS = 30;

/* ---- attribution ----------------------------------------------------------
   Storage model (chosen 2026-08-12, replacing the old first-touch freeze):
     · ATTRIBUTION (utm_* + fbclid/gclid + ts) is LAST-TOUCH — every page whose
       URL carries fresh attribution overwrites the stored set, so a buyer who
       first arrived via link-in-bio and later clicks the ad has the AD credited,
       not the stale bio link. Pages with a clean URL (internal navigation) leave
       the stored set untouched.
     · CONTEXT (referrer + landing_url) is FIRST-TOUCH — the true entry point of
       the session, set once. This is what lets us classify an UNTAGGED buyer
       (no utm) by channel (referrer = instagram/facebook/google/…).
     · ts is the click time, stored so the server can rebuild _fbc as
       `fb.1.<ts>.<fbclid>` when Meta's own _fbc cookie is absent.
   Mirrored to BOTH localStorage and a first-party cookie so the value survives
   contexts where one or the other is evicted (in-app browsers, ITP). */

function readAttr() {
  try {
    const ls = localStorage.getItem(ATTR_KEY);
    if (ls) return JSON.parse(ls);
  } catch { /* fall through to cookie */ }
  try {
    const m = document.cookie.match(new RegExp(`(?:^|;\\s*)${ATTR_KEY}=([^;]+)`));
    if (m) return JSON.parse(decodeURIComponent(m[1]));
  } catch { /* private mode */ }
  return {};
}

function writeAttr(attr) {
  const json = JSON.stringify(attr);
  try { localStorage.setItem(ATTR_KEY, json); } catch { /* best-effort */ }
  try {
    const maxAge = ATTR_TTL_DAYS * 24 * 60 * 60;
    document.cookie = `${ATTR_KEY}=${encodeURIComponent(json)}; Path=/; Max-Age=${maxAge}; SameSite=Lax`;
  } catch { /* best-effort */ }
}

export function captureParams() {
  if (typeof window === 'undefined') return;
  try {
    const sp = new URLSearchParams(window.location.search);
    const g = (k) => sp.get(k) || '';
    const url = {
      source: g('utm_source'), medium: g('utm_medium'), campaign: g('utm_campaign'),
      content: g('utm_content'), term: g('utm_term'),
      fbclid: g('fbclid'), gclid: g('gclid'),
    };
    const hasAttribution = Boolean(
      url.source || url.medium || url.campaign || url.content || url.term || url.fbclid || url.gclid,
    );

    const attr = readAttr();
    let changed = false;

    // CONTEXT — first-touch: capture the entry point once, even for untagged
    // (no-utm) traffic, so blank-UTM buyers can still be classified by referrer.
    if (!attr.landing_url) {
      attr.landing_url = window.location.href;
      attr.referrer = document.referrer || '';
      changed = true;
    }

    // ATTRIBUTION — last-touch, but AD-STICKY (mirrors mergeAttribution): an
    // organic bio-link tap must NOT overwrite a stored ad utm. Click IDs stay
    // pure last-touch (a fresh fbclid is always the most recent click).
    if (hasAttribution) {
      const hasUtm = Boolean(url.source || url.medium || url.campaign || url.content || url.term);
      if (hasUtm && (isAdUtm(url) || !isAdUtm(attr))) {
        attr.source = url.source; attr.medium = url.medium; attr.campaign = url.campaign;
        attr.content = url.content; attr.term = url.term;
        changed = true;
      }
      if (url.fbclid) { attr.fbclid = url.fbclid; changed = true; }
      if (url.gclid) { attr.gclid = url.gclid; changed = true; }
      if (changed) attr.ts = Date.now();    // click time, for _fbc reconstruction
    }

    if (changed) writeAttr(attr);
  } catch { /* private mode — attribution is best-effort */ }
}

export function restoreParams() {
  if (typeof window === 'undefined') return {};
  const attr = readAttr();
  // Overlay any attribution live on THIS URL, in case captureParams hasn't run
  // yet on this page (belt-and-braces before a create-order call).
  try {
    const sp = new URLSearchParams(window.location.search);
    const live = {
      source: sp.get('utm_source'), medium: sp.get('utm_medium'), campaign: sp.get('utm_campaign'),
      content: sp.get('utm_content'), term: sp.get('utm_term'), fbclid: sp.get('fbclid'), gclid: sp.get('gclid'),
    };
    if (Object.values(live).some(Boolean)) {
      Object.assign(attr, Object.fromEntries(Object.entries(live).filter(([, v]) => v)));
      if (!attr.ts) attr.ts = Date.now();
    }
  } catch { /* ignore */ }
  return attr;
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

export async function fireMetaIcOnce(customer, attr = {}) {
  if (typeof window === 'undefined') return;
  const emailHash = await sha256Hex((customer.email || '').trim().toLowerCase());
  const key = `${PREFIX}ic_fired`;
  try { if (localStorage.getItem(key) === emailHash) return; } catch { /* fire anyway */ }
  try {
    const res = await fetch('/api/meta/initiate-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // fbclid + click-time let the server rebuild _fbc when the cookie is absent.
      body: JSON.stringify({
        customer,
        eventSourceUrl: window.location.href,
        fbclid: attr.fbclid || '',
        fbclidTs: attr.ts || 0,
      }),
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
