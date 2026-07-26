import { NextResponse } from 'next/server';
import crypto from 'crypto';

/* POST /api/razorpay/verify-payment
   ----------------------------------------------------------------------------
   REDIRECT GATE ONLY. Verifies the Razorpay CHECKOUT signature returned to the
   browser's success handler, so we redirect to /book-a-call only on a genuine,
   verified capture. This route fires NO tracking — Pabbly + the `sales` CAPI
   event are the webhook's job (server-to-server, UPI-away-safe). This is the
   checkout-signature HMAC (order_id|payment_id, keyed by the API secret), which
   is distinct from the webhook-signature HMAC (raw body, keyed by the webhook
   secret).
   ========================================================================== */
export const runtime = 'nodejs';

export async function POST(req) {
  const keySecret = process.env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_SECRET;
  if (!keySecret) return NextResponse.json({ ok: false, error: 'not_configured' }, { status: 503 });

  let body = {};
  try { body = await req.json(); } catch { /* ignore */ }
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return NextResponse.json({ ok: false, error: 'missing_fields' }, { status: 400 });
  }

  const expected = crypto
    .createHmac('sha256', keySecret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  let valid = false;
  try {
    valid = expected.length === razorpay_signature.length
      && crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(razorpay_signature));
  } catch { valid = false; }

  if (!valid) return NextResponse.json({ ok: false, error: 'invalid_signature' }, { status: 400 });
  return NextResponse.json({ ok: true, paymentId: razorpay_payment_id });
}
