/* ============================================================================
   META CONVERSIONS API — server-side core (H&W-aware)
   ----------------------------------------------------------------------------
   SERVER ONLY. Never import this from a client component — it uses the Node
   `crypto` module and constructs the CAPI access-token request. It is imported
   only by the /api/meta/* and /api/razorpay/webhook route handlers.

   Health & Wellness posture (per META_HW_HARDENING.md):
     · custom event names, never standard `Purchase`/`AddToCart`/`InitiateCheckout`
     · custom_data carries `{value, currency}` only — no content_name/category
     · event_source_url reduced to origin (no health-y path/query reaches Meta)
     · user_data still carries the full hashed 11-signal set on the events that
       have it available (ic_event, sales) — hashed PII is the compliant EMQ
       mechanism, and it is what gets us to 9.3 EMQ.
   ========================================================================== */
import crypto from 'crypto';

const GRAPH = 'https://graph.facebook.com/v25.0';

/** SHA-256 hex of a normalized (trim + lowercase) string. '' for empty input. */
export function sha256(input) {
  if (input === undefined || input === null) return '';
  const s = String(input).trim().toLowerCase();
  if (!s) return '';
  return crypto.createHash('sha256').update(s).digest('hex');
}

/** SHA-256 hex WITHOUT normalization — used for opaque event_id derivations. */
export function sha256Raw(input) {
  return crypto.createHash('sha256').update(String(input)).digest('hex');
}

/** Reduce any URL to its origin, so no path/query reaches Meta. */
export function originOnly(u) {
  try { return new URL(u).origin; } catch { return u || ''; }
}

function digitsPhone(dialCode, phone) {
  return `${dialCode || ''}${phone || ''}`.replace(/\D/g, '');
}

/**
 * Build the user_data object.
 *  - pii:true  → full 11 signals (hashed em/ph/fn/ln/ct/country/external_id
 *                + raw fbc/fbp/ip/ua). EMQ 9+.
 *  - pii:false → raw fbc/fbp/ip/ua only. EMQ ~4-6. Used for atc_event, which
 *                fires at landing-CTA time when no customer PII exists anyway.
 */
export function buildUserData(customer = {}, sig = {}, { pii = true } = {}) {
  const ud = {};
  if (pii) {
    const em = sha256(customer.email);
    const ph = sha256(digitsPhone(customer.dialCode, customer.phone));
    const fn = sha256(customer.firstName);
    const ln = sha256(customer.lastName);
    const ct = sha256((customer.city || '').replace(/[^a-zA-Z]/g, ''));
    const co = sha256(customer.countryCode);
    const ext = sha256(customer.email); // external_id MUST match the sales derivation
    if (em) ud.em = [em];
    if (ph) ud.ph = [ph];
    if (fn) ud.fn = [fn];
    if (ln) ud.ln = [ln];
    if (ct) ud.ct = [ct];
    if (co) ud.country = [co];
    if (ext) ud.external_id = [ext];
  }
  if (sig.fbc) ud.fbc = sig.fbc;
  if (sig.fbp) ud.fbp = sig.fbp;
  if (sig.ip) ud.client_ip_address = sig.ip;
  if (sig.ua) ud.client_user_agent = sig.ua;
  return ud;
}

/** Fire ONE event to the Graph API. Returns 'sent' | 'skipped' | 'error'. */
export async function sendMetaCapiEvent({
  pixelId, accessToken, eventName, eventId, eventSourceUrl,
  userData, customData, actionSource = 'website',
}) {
  if (!pixelId || !accessToken) return 'skipped';
  const payload = {
    data: [{
      event_name: eventName,
      event_time: Math.floor(Date.now() / 1000),
      event_id: eventId,
      action_source: actionSource,
      event_source_url: eventSourceUrl,
      user_data: userData,
      custom_data: customData,
    }],
    /* ⚠ When META_CAPI_TEST_EVENT_CODE is set, EVERY event routes to Meta's
       Test Events tab and does NOT count as a real conversion. Leave it BLANK
       in production — set it only while validating in Events Manager. */
    ...(process.env.META_CAPI_TEST_EVENT_CODE
      ? { test_event_code: process.env.META_CAPI_TEST_EVENT_CODE }
      : {}),
  };
  try {
    const res = await fetch(
      `${GRAPH}/${pixelId}/events?access_token=${encodeURIComponent(accessToken)}`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) },
    );
    if (!res.ok) {
      const t = await res.text().catch(() => '');
      console.log(`[capi] ${eventName} error ${res.status} ${t.slice(0, 200)}`);
      return 'error';
    }
    return 'sent';
  } catch (e) {
    console.log(`[capi] ${eventName} exception ${e && e.message}`);
    return 'error';
  }
}
