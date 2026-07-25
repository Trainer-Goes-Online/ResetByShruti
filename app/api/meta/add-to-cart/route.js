import { NextResponse } from 'next/server';
import { CONFIG } from '@/lib/config';
import { sendAtcEvent } from '@/lib/meta-events';

/* POST /api/meta/add-to-cart — fired by a sendBeacon on the FIRST landing-CTA
   click of the browser's lifetime. No customer PII at this point; ships raw
   fbc/fbp/IP/UA only (EMQ ~6). Never surfaces an error to the client. */
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
  try { body = await req.json(); } catch { /* beacon body may be empty */ }

  const capi = await sendAtcEvent({
    pixelId, accessToken,
    sig: reqSignals(req),
    eventSourceUrl: body.eventSourceUrl || '',
    value: Number(CONFIG.ENTRY_PRICE) || 97,
    currency: 'INR',
  });
  console.log(`[atc] capi=${capi}`);
  return NextResponse.json({ ok: true, capi });
}
