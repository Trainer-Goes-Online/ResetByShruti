import { NextResponse } from 'next/server';
import { CONFIG } from '@/lib/config';
import { sendIcEvent } from '@/lib/meta-events';

/* POST /api/meta/initiate-checkout — fired from the checkout submit handler
   AFTER client validation passes and BEFORE create-order. Body: {customer,
   eventSourceUrl}. Ships the FULL 11-signal user_data (EMQ 9.3). Never blocks
   the payment. */
export const runtime = 'nodejs';

function reqSignals(req) {
  const xff = req.headers.get('x-forwarded-for') || '';
  return {
    fbc: req.cookies.get('_fbc')?.value || '',
    fbp: req.cookies.get('_fbp')?.value || '',
    ip: xff.split(',')[0].trim() || req.headers.get('x-real-ip') || '',
    ua: req.headers.get('user-agent') || '',
  };
}

export async function POST(req) {
  if (process.env.TRACKING_ENABLED !== 'true') return NextResponse.json({ ok: true, skipped: 'test_mode' });
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const accessToken = process.env.META_CAPI_ACCESS_TOKEN;
  if (!pixelId || !accessToken) return NextResponse.json({ ok: true, skipped: 'env_missing' });

  let body = {};
  try { body = await req.json(); } catch { /* ignore */ }
  const customer = body.customer || {};
  if (!customer.email) return NextResponse.json({ ok: false, error: 'no_email' }, { status: 400 });

  const capi = await sendIcEvent({
    pixelId, accessToken,
    customer,
    sig: reqSignals(req),
    eventSourceUrl: body.eventSourceUrl || '',
    value: Number(CONFIG.ENTRY_PRICE) || 97,
    currency: 'INR',
  });
  console.log(`[ic] capi=${capi}`);
  return NextResponse.json({ ok: true, capi });
}
