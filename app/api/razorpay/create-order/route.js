import { NextResponse } from 'next/server';
import { CONFIG } from '@/lib/config';
import { ATTR_COOKIE, readAttrCookie, resolveAttribution, packJsonNote } from '@/lib/attribution';

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
  /* Accept every naming convention so a mislabelled env var can't silently
     503 the checkout: RAZORPAY_KEY_ID / RAZORPAY_KEY (public id) and
     RAZORPAY_KEY_SECRET / RAZORPAY_SECRET (secret). */
  const keyId = process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY
    || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY;
  const keySecret = process.env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_SECRET;
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
  const fbp = req.cookies.get('_fbp')?.value || '';
  const fbcCookie = req.cookies.get('_fbc')?.value || '';
  const esu = `${CONFIG.CANONICAL_HOST || ''}/checkout`;   // canonical, no query — §5

  /* L2 · server reads the reset_attr cookie (written at the edge by middleware.js
     BEFORE any JS ran — the fix for the in-app-browser hydration race). The
     client body is only a supplement. resolveAttribution then applies the
     precedence chain (URL→cookie→body→referrer→_fbc→none), recovers utm_* from
     the referrer when all are blank (L3), and derives fbclid+click-ts (L4). */
  const cookieAttr = readAttrCookie(req.cookies.get(ATTR_COOKIE)?.value);
  const bodyAttr = {
    source: u.source || '', medium: u.medium || '', campaign: u.campaign || '',
    content: u.content || '', term: u.term || '', gclid: u.gclid || '',
    fbclid: body.fbclid || u.fbclid || '',
    ts: Number(body.fbclidTs) || Number(u.ts) || 0,
    referrer: u.referrer || '', landing_url: u.landing_url || '',
  };
  const resolved = resolveAttribution({
    cookieAttr, bodyAttr,
    referrer: bodyAttr.referrer || cookieAttr.referrer || '',
    landingUrl: bodyAttr.landing_url || cookieAttr.landing_url || '',
    fbc: fbcCookie,
  });

  /* _fbc is the click identifier Meta attributes on. Prefer Meta's own cookie;
     else rebuild fb.1.<ts>.<fbclid> from the resolved fbclid (F4). */
  const fbc = fbcCookie || (resolved.fbclid ? `fb.1.${resolved.fbclidTs}.${resolved.fbclid}` : '');

  if (resolved.utmSource === 'none' && !resolved.fbclid) {
    console.error('[create-order] ATTRIBUTION MISSING — no utm, no fbclid, no referrer recovery');
  }

  const notes = {
    kind: 'client_funnel',   // universal literal — the webhook's gate
    // L5 · packJsonNote guarantees valid JSON under 256 by shortening the LONGEST
    // value — never truncate(JSON.stringify()), which slices mid-JSON and a long
    // campaign name would drop EVERY field (or 502 the order).
    cust: packJsonNote({
      fn: c.firstName || '', ln: c.lastName || '', em: c.email || '',
      ph: c.phone || '', ct: c.city || '', co: c.countryCode || '', dl: c.dialCode || '',
    }),
    utm: packJsonNote({
      s: resolved.utm.source, m: resolved.utm.medium, c: resolved.utm.campaign,
      n: resolved.utm.content, t: resolved.utm.term,
    }),
    clid: trunc(resolved.fbclid),
    ts: trunc(String(resolved.fbclidTs || '')),
    fbc: trunc(fbc),
    fbp: trunc(fbp),
    ip: trunc(ip, 45),
    ua: trunc(ua),
    esu: trunc(esu, 120),
    ref: trunc(resolved.referrer, 200),       // where the session actually began
    lp: trunc(resolved.landingUrl, 200),      //  (classifies untagged buyers)
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
