import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { CONFIG } from '@/lib/config';
import { sha256 } from '@/lib/meta-capi';
import { sendSalesEvent } from '@/lib/meta-events';

/* POST /api/razorpay/webhook  —  THE SOLE TRACKING AUTHORITY
   ----------------------------------------------------------------------------
   Razorpay-triggered, server-to-server. Fires regardless of whether the buyer
   returned to the funnel tab, so UPI-away payers are captured. Pipeline (each
   step short-circuits):
     1. HMAC verify (raw body, webhook secret)   → 400 on mismatch
     2. event === 'payment.captured'             → 200 ignored otherwise
     3. payment.entity present                   → 400 otherwise
     4. notes.kind === 'client_funnel'           → 200 ignored otherwise
     5. test-mode gate                           → 200 skipped when off
     6. unpack notes → Pabbly + `sales` CAPI (event_id = payment_id, EMQ 9.3)
   Every log line carries paymentId for trace reconstruction in Vercel logs.
   ========================================================================== */
export const runtime = 'nodejs';

export async function POST(req) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const raw = await req.text();
  const sigHeader = req.headers.get('x-razorpay-signature') || '';

  if (!secret) return NextResponse.json({ ok: false, error: 'not_configured' }, { status: 503 });

  // 1 · HMAC signature (raw bytes — never re-serialize before this)
  const expected = crypto.createHmac('sha256', secret).update(raw).digest('hex');
  let valid = false;
  try {
    valid = expected.length === sigHeader.length
      && crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(sigHeader));
  } catch { valid = false; }
  if (!valid) return NextResponse.json({ ok: false, error: 'invalid_signature' }, { status: 400 });

  // 2 · event filter
  let evt = {};
  try { evt = JSON.parse(raw); } catch { return NextResponse.json({ ok: false, error: 'bad_json' }, { status: 400 }); }
  if (evt.event !== 'payment.captured') {
    return NextResponse.json({ ok: true, ignored: true, reason: 'event_not_captured', event: evt.event });
  }

  // 3 · payment entity
  const payment = evt.payload && evt.payload.payment && evt.payload.payment.entity;
  if (!payment) return NextResponse.json({ ok: false, error: 'no_payment_entity' }, { status: 400 });
  const paymentId = payment.id;
  const notes = payment.notes || {};

  // 4 · kind gate — ignore any payment on this account that isn't ours
  if (notes.kind !== 'client_funnel') {
    return NextResponse.json({ ok: true, ignored: true, reason: 'kind_mismatch', kind: notes.kind || null });
  }

  // 5 · test-mode gate
  if (process.env.TRACKING_ENABLED !== 'true') {
    console.log(`[webhook] paymentId=${paymentId} skipped test_mode`);
    return NextResponse.json({ ok: true, paymentId, skipped: 'test_mode' });
  }

  // 6 · unpack + derive
  let cust = {};
  let utm = {};
  try { cust = JSON.parse(notes.cust || '{}'); } catch { /* defensive */ }
  try { utm = JSON.parse(notes.utm || '{}'); } catch { /* defensive */ }

  const amount = Math.round(Number(payment.amount) / 100);   // paise → rupees
  const currency = payment.currency || 'INR';
  const customer = {
    firstName: cust.fn, lastName: cust.ln, email: cust.em,
    phone: cust.ph, city: cust.ct, countryCode: cust.co, dialCode: cust.dl,
  };
  /* fbc should already be set by create-order (cookie or rebuilt from fbclid).
     Defensive fallback for any order created before that change, or if the note
     was empty: rebuild from the stored fbclid so Meta still gets a click match. */
  const fbc = notes.fbc || (notes.clid ? `fb.1.${Math.floor((payment.created_at || Date.now() / 1000) * 1000)}.${notes.clid}` : '');
  const sig = { fbc, fbp: notes.fbp || '', ip: notes.ip || '', ua: notes.ua || '' };

  // Pabbly (non-blocking)
  let pabbly = 'skipped';
  const pabblyUrl = process.env.PABBLY_WEBHOOK_URL;
  if (pabblyUrl) {
    try {
      const r = await fetch(pabblyUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildPabblyPayload({ paymentId, payment, cust, utm, notes, amount, currency, fbc })),
      });
      pabbly = r.ok ? 'sent' : 'error';
      console.log(`[webhook] paymentId=${paymentId} Pabbly ${pabbly} (${r.status})`);
    } catch (e) {
      pabbly = 'error';
      console.log(`[webhook] paymentId=${paymentId} Pabbly exception ${e && e.message}`);
    }
  }

  // Meta `sales` (non-blocking; skips cleanly if pixel/token absent)
  const capi = await sendSalesEvent({
    pixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID,
    accessToken: process.env.META_CAPI_ACCESS_TOKEN,
    customer, sig,
    eventSourceUrl: notes.esu || `${CONFIG.CANONICAL_HOST}/checkout`,
    value: amount, currency,
    eventId: paymentId,   // Meta dedup key (48h)
  });
  console.log(`[webhook] paymentId=${paymentId} sales capi=${capi}`);

  return NextResponse.json({ ok: true, paymentId, kind: 'client_funnel', pabbly, capi });
}

/* One CRM row per lead. Field names are the stable contract Pabbly maps on. */
function buildPabblyPayload({ paymentId, payment, cust, utm, notes, amount, currency, fbc }) {
  const created = payment.created_at ? new Date(payment.created_at * 1000) : new Date();
  const inIST = (opts) => created.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', ...opts });
  return {
    lead_id: paymentId,
    created_at: created.toISOString(),
    payment_date: inIST({ year: 'numeric', month: '2-digit', day: '2-digit' }),
    payment_time: inIST({ hour: '2-digit', minute: '2-digit', hour12: false }),
    first_name: cust.fn || '',
    last_name: cust.ln || '',
    full_name: `${cust.fn || ''} ${cust.ln || ''}`.trim(),
    email: cust.em || '',
    phone: cust.ph || '',
    city: cust.ct || '',
    country_code: cust.co || '',
    dial_code: cust.dl || '',
    amount,
    currency,
    fbc: fbc || notes.fbc || '',
    fbp: notes.fbp || '',
    client_ip_address: notes.ip || '',
    client_user_agent: notes.ua || '',
    external_id: sha256(cust.em || ''),
    event_source_url: notes.esu || '',
    fbclid: notes.clid || '',
    referrer: notes.ref || '',
    landing_url: notes.lp || '',
    utm_source: utm.s || '',
    utm_medium: utm.m || '',
    utm_campaign: utm.c || '',
    utm_content: utm.n || '',
    utm_term: utm.t || '',
    purchase_event_id: paymentId,
    is_test: String(process.env.TRACKING_ENABLED !== 'true'),
  };
}
