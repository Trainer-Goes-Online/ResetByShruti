import { NextResponse } from 'next/server';
import { CONFIG } from '@/lib/config';

/* POST /api/razorpay/create-order
   ----------------------------------------------------------------------------
   Creates a Razorpay order for the ₹97 booking fee and packs ALL tracking data
   into order.notes (9-key JSON-blob strategy, per RAZORPAY_WEBHOOK_MIGRATION §5)
   so the webhook — the sole tracking authority — can rebuild the Pabbly payload
   and the high-EMQ `sales` event server-to-server, even for UPI-away payers.

   Uses the Razorpay Orders REST API directly (Basic auth) — no SDK dependency.
   Body: { amount, currency, customer, utm, fbclid }.
   ========================================================================== */
export const runtime = 'nodejs';

const RZP_ORDERS = 'https://api.razorpay.com/v1/orders';
const trunc = (s, n = 256) => (s == null ? '' : String(s).slice(0, n));

export async function POST(req) {
  const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) return NextResponse.json({ ok: false, error: 'razorpay_not_configured' }, { status: 503 });

  let body = {};
  try { body = await req.json(); } catch { /* ignore */ }

  const amount = Number(body.amount) || Number(CONFIG.ENTRY_PRICE) || 97;
  const currency = body.currency || 'INR';
  const c = body.customer || {};
  const u = body.utm || {};

  const xff = req.headers.get('x-forwarded-for') || '';
  const ip = xff.split(',')[0].trim() || req.headers.get('x-real-ip') || '';
  const ua = req.headers.get('user-agent') || '';
  const fbc = req.cookies.get('_fbc')?.value || '';
  const fbp = req.cookies.get('_fbp')?.value || '';
  const esu = `${CONFIG.CANONICAL_HOST || ''}/checkout`;   // canonical, no query — §5

  const notes = {
    kind: 'client_funnel',   // universal literal — the webhook's gate
    cust: JSON.stringify({
      fn: c.firstName || '', ln: c.lastName || '', em: c.email || '',
      ph: c.phone || '', ct: c.city || '', co: c.countryCode || '', dl: c.dialCode || '',
    }),
    utm: JSON.stringify({
      s: u.source || '', m: u.medium || '', c: u.campaign || '', n: u.content || '', t: u.term || '',
    }),
    clid: trunc(body.fbclid),
    fbc: trunc(fbc),
    fbp: trunc(fbp),
    ip: trunc(ip, 45),
    ua: trunc(ua),
    esu: trunc(esu, 120),
  };

  try {
    const res = await fetch(RZP_ORDERS, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString('base64')}`,
      },
      body: JSON.stringify({
        amount: Math.round(amount * 100),   // rupees → paise
        currency,
        receipt: `rbs_${Date.now()}`,
        notes,
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.id) {
      console.log(`[create-order] razorpay error ${res.status} ${JSON.stringify(data).slice(0, 200)}`);
      return NextResponse.json({ ok: false, error: 'order_failed' }, { status: 502 });
    }
    return NextResponse.json({ ok: true, orderId: data.id, amount: data.amount, currency: data.currency, keyId });
  } catch (e) {
    console.log(`[create-order] exception ${e && e.message}`);
    return NextResponse.json({ ok: false, error: 'exception' }, { status: 500 });
  }
}
