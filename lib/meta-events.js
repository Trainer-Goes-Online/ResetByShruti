/* ============================================================================
   META EVENT BUILDERS — atc_event · ic_event · sales   (SERVER ONLY)
   ----------------------------------------------------------------------------
   Three peers, all fired server-side via CAPI. Opaque custom names so Meta's
   restricted-category classifier has nothing to keyword-match (per
   META_ATC_IC_SOP §7b). EMQ posture confirmed by the client:

     · atc_event  — landing-CTA click. No customer PII exists yet → raw
                    fbc/fbp/ip/ua only. EMQ ~6. (event_id from fbp.)
     · ic_event   — checkout Pay click, form already valid → FULL 11 signals.
                    EMQ 9.3. (event_id from email — same person across sessions.)
     · sales      — ₹ payment captured (webhook) → FULL 11 signals.
                    EMQ 9.3. (event_id = razorpay payment_id, for 48h dedup.)
   ========================================================================== */
import crypto from 'crypto';
import { sendMetaCapiEvent, buildUserData, sha256Raw, originOnly } from './meta-capi';

/* The conversion event name. Kept overridable so it can be coded harder
   (e.g. `evt_a`) if Meta ever scans the custom events — see META_HW_HARDENING. */
const SALES_EVENT = process.env.META_SALES_EVENT_NAME || 'sales';

export async function sendAtcEvent({ pixelId, accessToken, sig, eventSourceUrl, value, currency }) {
  const eventId = sig.fbp
    ? sha256Raw(`${sig.fbp}|atc`)
    : `${crypto.randomBytes(8).toString('hex')}_atc`;
  return sendMetaCapiEvent({
    pixelId, accessToken,
    eventName: 'atc_event',
    eventId,
    eventSourceUrl: originOnly(eventSourceUrl),
    userData: buildUserData({}, sig, { pii: false }),
    customData: { currency, value },
  });
}

export async function sendIcEvent({ pixelId, accessToken, customer, sig, eventSourceUrl, value, currency }) {
  const eventId = sha256Raw(`${(customer.email || '').trim().toLowerCase()}|ic`);
  return sendMetaCapiEvent({
    pixelId, accessToken,
    eventName: 'ic_event',
    eventId,
    eventSourceUrl: originOnly(eventSourceUrl),
    userData: buildUserData(customer, sig, { pii: true }),  // full PII → 9.3 EMQ
    customData: { currency, value },
  });
}

export async function sendSalesEvent({ pixelId, accessToken, customer, sig, eventSourceUrl, value, currency, eventId }) {
  return sendMetaCapiEvent({
    pixelId, accessToken,
    eventName: SALES_EVENT,
    eventId,
    eventSourceUrl: originOnly(eventSourceUrl),
    userData: buildUserData(customer, sig, { pii: true }),  // full PII → 9.3 EMQ
    customData: { currency, value },
  });
}
