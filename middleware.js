import { NextResponse } from 'next/server';
import {
  ATTR_COOKIE, ATTR_TTL_SECONDS,
  mergeAttribution, parseAttributionFromUrl, readAttrCookie,
} from '@/lib/attribution';

/* ============================================================================
   L1 · EDGE ATTRIBUTION CAPTURE  —  the layer that actually fixes F1
   ----------------------------------------------------------------------------
   Per FUNNEL_ATTRIBUTION_AUDIT_AND_FIX.md. The old capture lived only in a React
   useEffect, so on a heavy landing page in the Facebook/Instagram in-app browser
   the user could tap the CTA and navigate away BEFORE hydration ran the capture —
   the misses biased toward exactly the paid-social traffic we buy. Reading the
   query string here, at the edge on the first request, removes the race: the
   server writes the reset_attr cookie before any JS runs. The client capture in
   lib/track.js stays as a redundant fallback (localStorage + same cookie).

   Cookie shape is identical to lib/track.js so both writers agree:
     { source, medium, campaign, content, term, fbclid, gclid, ts,
       landing_url, referrer }
   ATTRIBUTION is last-touch; CONTEXT (referrer/landing_url) is first-touch.
   ========================================================================== */
export function middleware(req) {
  const res = NextResponse.next();
  try {
    const live = parseAttributionFromUrl(req.nextUrl.search);
    const stored = readAttrCookie(req.cookies.get(ATTR_COOKIE)?.value);
    const { attr, changed } = mergeAttribution(stored, {
      live,
      landingUrl: req.nextUrl.href,
      referrer: req.headers.get('referer') || '',
      now: Date.now(),
    });
    if (changed) {
      // Pass RAW JSON — Next's cookie API URL-encodes it once. Encoding it here
      // too would double-encode (%257B…) and break the client-side reader.
      res.cookies.set(ATTR_COOKIE, JSON.stringify(attr), {
        path: '/',
        maxAge: ATTR_TTL_SECONDS,
        sameSite: 'lax',
        httpOnly: false,               // lib/track.js reads it as a fallback
        secure: req.nextUrl.protocol === 'https:',
      });
    }
  } catch { /* attribution is best-effort — never break a page render */ }
  return res;
}

/* Run on real page navigations only — skip API routes, Next internals, and any
   path with a file extension (static assets under /public, images, etc.). */
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
