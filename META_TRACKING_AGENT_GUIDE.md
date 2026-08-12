# Meta Tracking — Drop-in Agent Guide

Single canonical guide for implementing the full Meta tracking stack in any sibling funnel (paid info-product, lead-gen, course launch, fitness, fertility, health, etc.). Hand this file to a fresh Claude Code session in any new project — it's self-contained.

The pattern shipped here delivers:
- **CAPI EMQ: 9.5+/10** on every paid conversion
- **Browser PageView EMQ: 6.0 for cold, 8.0+ for return / post-form-fill visitors**
- **Deterministic ad attribution** via a **hybrid `_fbc`** (cookie-first, rebuilt from `fbclid` when absent) — see **Section 2a**
- **Robust UTM/attribution capture** (last-touch + first-party cookie mirror + read-live-URL-first + referrer/landing_url) — see **Section 4.6**
- **Zero diagnostic warnings** from Meta (event_source_url, MAM, domain allow list, dedup)
- **Restricted-category compliant** (health/prenatal/financial/political)
- **Single deterministic conversion signal** for campaign optimization (`Purchase` standard + custom event — but see **Section 0**: health/wellness datasets fire the **custom event ONLY**)

Reference repo: `Trainer-Goes-Online/ankita-prenatal`. The code patterns in this guide are extracted verbatim from that repo's `lib/analytics.ts`, `app/api/razorpay/verify-payment/route.ts`, `app/layout.tsx`, `components/CheckoutForm.tsx`, and `app/thank-you/page.tsx`.

> **⚠ 2026-08 REVISION.** Two hardening changes are now part of this guide after a
> live client (Reset by Shruti) showed sales that Meta credited to an ad while our
> own UTM sheet went blank or stale:
>   1. **Hybrid `_fbc`** (Section 2a + 4.2) — never read the cookie alone; rebuild
>      `fb.1.<clickTs>.<fbclid>` when it's absent. `_fbc` is the click ID Meta uses
>      to attribute to the exact ad; UTMs do **not** drive Meta attribution.
>   2. **Attribution capture module** (Section 4.6) — last-touch UTM + first-party
>      cookie mirror + read-live-URL-first + first-touch `referrer`/`landing_url`,
>      forwarded to the payment route so Pabbly/CRM rows stay complete.

---

## Section 0 — ⚠️ Health & Wellness restriction override (READ FIRST)

**If the pixel/dataset is categorized "Health and wellness condition" in Events Manager (all prenatal/postpartum/fertility/health funnels in this org are), the standard `Purchase` event is restricted by name and the dual-event pattern below is INVERTED:**

| Topic | Pre-restriction baseline (rest of this guide) | **Health & Wellness override (current default for our funnels)** |
|---|---|---|
| CAPI events fired | `Purchase` (standard) **+** `<custom>` | **`<custom>` ONLY** (e.g. `sales`) — drop `Purchase` entirely |
| Browser-side Purchase | Escalation only (Section 7) | **Never** — also drops the health-y `content_name` it carried |
| Campaign optimization target | `Purchase` | **The custom event directly** (no Custom Conversion needed) |
| `event_source_url` | Full page URL | **Host-only origin** (core setup strips the path anyway; avoids leaking health-y path/UTMs) |
| Reporting (Results column) | ~2× real if browser Purchase on | **≈ 1× real** |

**Why:** Meta's data-source-category restriction blocks mid/lower-funnel *standard* events (Purchase / AddToCart / InitiateCheckout / Subscribe / Lead) **by name** for health-categorized datasets — first "core setup" (strips URL path + custom params), then full standard-event blocking on a ~17-day clock. **Confirmed custom events with PHI-free payloads are NOT in that bucket.** A Custom Conversion gives no bypass advantage over optimizing on the raw custom event (same "custom" data) — optimize directly on the custom event. Self-categorization appeals for a genuine health funnel get rejected.

**Keep the custom event clean** so Meta doesn't filter it as sensitive: neutral event name (`sales`), neutral params (`value`/`currency`/`payment_id` only — no product/`content_name` strings like "Prenatal Challenge"), host-only `event_source_url`. The last residual health signal is the **subdomain** (e.g. `prenatal.`) — only fixable by moving to a neutral host (clean-domain escalation).

Everything below is the pre-restriction baseline. Apply the override table whenever the dataset is health/wellness-categorized.

---

## Section 1 — The drop-in prompt (paste this into the agent)

```
You're implementing the Meta tracking stack in this codebase. The full pattern is documented in META_TRACKING_AGENT_GUIDE.md — read it end to end before writing any code. The patterns there are extracted from a live, working reference implementation.

Your work proceeds in this order:

STEP 1 — AUDIT (report before editing)
Find and tell me:
- The root layout file (where the Meta Pixel base script lives, typically app/layout.tsx)
- The form component that collects user info before payment/submit
- The server route that handles successful payment (verify-payment OR Razorpay webhook)
- The success page (typically /thank-you, /success, /confirmation)
- The payment provider (Razorpay/Stripe/PayPal/...) and the transaction id format it issues
- Form fields collected (email, phone, names, address, anything else)
- Any existing Meta integration code (fbq calls, CAPI logic, env vars)
- UTM/attribution capture: cookie or localStorage? first-touch or last-touch? cookie mirror? Are referrer/landing_url captured? Is _fbc rebuilt from fbclid when the cookie is absent?
- Free/test/coupon code path that should skip CAPI firing
- Whether the project uses Next.js App Router (assumed by reference pattern), Pages Router, or something else

Report in 6-10 bullets. Do not edit yet.

STEP 2 — PROPOSE
Based on the audit, tell me:
- Which files you'll create or modify
- What custom event name fits (default `sales` for paid product; `leads` for lead-gen; `signup` for free registration — match the project's terminology)
- How to thread event_source_url from client to server given the stack
- Which form fields map to which Meta user_data keys (em/ph/fn/ln/ct/country/db/zp/st/ge)
- The hybrid _fbc plan (Section 2a) and the attribution capture module (Section 4.6)
- The pixel ID and CAPI access token sources

Wait for my approval before editing.

STEP 3 — IMPLEMENT
Match the reference patterns in META_TRACKING_AGENT_GUIDE.md EXACTLY. The files to land:
1. lib/analytics.ts (or equivalent) — MAM helper with cookie persistence + Web Crypto SHA-256 hashing
2. lib/track.ts (or equivalent) — attribution capture module (Section 4.6): captureParams/restoreParams, last-touch + cookie mirror + referrer/landing_url
3. app/api/.../verify-payment (or webhook) route.ts — sendMetaCapiEvent + HYBRID _fbc rebuild (Section 4.2)
4. app/layout.tsx — Meta Pixel base + cookie-aware inline script that reads the MAM cookie BEFORE firing PageView
5. components/CheckoutForm.tsx — form-fill MAM useEffect + pass restored attribution (fbclid, fbclidTs, referrer, landing_url) into the payment request
6. app/thank-you/page.tsx — reapplyMamFromCookie() backup call on mount

DO NOT add a browser-side Purchase event. That's reserved for an escalation path documented in this guide.

STEP 4 — TYPE-CHECK / LINT
Run the project's type-checker. Must pass with no new errors.

STEP 5 — OUTPUT SIDE-BY-SIDE VERIFICATION TABLE (see Section 9 of this guide for the exact format)

STEP 6 — TELL ME WHAT THE MEDIA BUYER NEEDS TO DO
At the end of your output, give me a "Media buyer action list" — what Meta UI toggles to flip (auto events OFF, AAM OFF), the attribution window to set (7-day click, no view), what to verify in Events Manager, what diagnostic warnings to expect to clear.

Show me the full output. I will manually verify against the reference repo's commit history.
```

---

## Section 2 — Architecture (what fires where, with what payload)

### Browser side (Meta Pixel via `fbq`)

| Event | When | Payload | event_id |
|---|---|---|---|
| **`PageView`** | Every initial page load + every Next.js client-side route change (Meta's SPA hook fires automatically) | Auto: IP, UA, `_fbp`, `_fbc`, `event_source_url`. Plus: `em`, `ph`, `fn`, `ln`, `ct`, `country`, `external_id` (hashed via SHA-256) if the MAM cookie present | none |

That's it. **No browser-side `Purchase`, `InitiateCheckout`, `ViewContent`, `AddToCart`, or `Lead`** by default. Conversion events come from CAPI server-side.

### Server side (Conversions API)

Single HTTP POST to `https://graph.facebook.com/v25.0/{PIXEL_ID}/events?access_token={TOKEN}` per successful verified payment. Skipped entirely for free/test/QA orders.

Payload contains **two events** in the `data` array — both share `event_id`, `user_data`, `custom_data`, `event_source_url`:

| Event | event_name | Why |
|---|---|---|
| 1 | `Purchase` (standard) | Campaign optimization target. Mature global ML priors. iOS attribution (AEM is automatic since Oct 2024). |
| 2 | `<custom>` (e.g. `sales`/`leads`/`signup`) | Internal source-of-truth label. Excludes inferred Purchases or other sources. |

> **Health & Wellness override (Section 0):** for health-categorized datasets, fire **only** the custom event (event 2). The standard `Purchase` (event 1) is restricted by name and is removed — the `data` array carries a single event. The reference repo (`ankita-prenatal`) is in this state.

Both events ship with this `user_data` (11 matching signals = EMQ 9.5+):

| Field | Source | Hashed? | Format |
|---|---|---|---|
| `em` | email | SHA-256 | `[hashedHex]` |
| `ph` | dial code + phone | SHA-256 | `[hashedHex]` (digits only, no `+`) |
| `fn` | first name | SHA-256 | `[hashedHex]` (lowercase, trimmed) |
| `ln` | last name | SHA-256 | `[hashedHex]` (lowercase, trimmed) |
| `ct` | city | SHA-256 | `[hashedHex]` (lowercase, a-z only) |
| `country` | 2-letter ISO | SHA-256 | `[hashedHex]` (lowercase) |
| `external_id` | **same value as `em`** | SHA-256 | `[hashedHex]` — must match browser MAM |
| `fbc` | **hybrid: `_fbc` cookie, else rebuilt from `fbclid`** (Section 2a) | raw | string |
| `fbp` | `_fbp` cookie | raw | string (if present) |
| `client_ip_address` | request header | raw | string |
| `client_user_agent` | request header | raw | string |

Plus `custom_data`: `{ currency, value, payment_id }` and `event_source_url` (the URL the client was on when conversion happened — typically `/checkout`).

### How the data flows end-to-end

```
User journey:                            What ships to Meta:
───────────────────                    ──────────────────────────────────────
1. Lands on / (ad URL w/ utm+fbclid)     PageView (anonymous OR identified via cookie)
                                         captureParams() → stores utm/fbclid/ts + referrer/landing_url
                                           (last-touch, mirrored to localStorage + cookie)
2. Clicks "Get Instant Access"           PageView fires for /checkout
3. Starts filling form                   nothing
4. Form valid + filled (500ms idle)      fbq init with hashed em/ph/fn/ln/ct/country/external_id
                                         + MAM cookie WRITTEN (30-day TTL)
5. Clicks "Pay"                          (still nothing — Razorpay opens)
                                         restoreParams() → payload carries fbclid + fbclidTs + referrer + landing_url
6. Razorpay verifies payment             nothing
7. success handler / webhook fires       server rebuilds _fbc = fb.1.<ts>.<fbclid> if cookie absent
                                         CAPI fires: { Purchase } { sales } (or custom-only)
                                         Pabbly row: utm_* + fbc + referrer + landing_url + …
8. /thank-you renders                    auto PageView with MAM inherited
9. User returns 5 days later             PageView fires on / with full identity (EMQ ~8)
```

---

## Section 2a — Hybrid `_fbc` and why UTM does not control attribution

**Meta attributes conversions on `_fbc` / `fbp` / hashed PII within its attribution window — never on your `utm_*` parameters.** UTMs are a reporting convention for your GA/Sheet; Meta's Ads Manager ignores them. A recurring client ask — *"send the UTMs so Meta credits the right ad"* — does not work; Meta would still ignore them.

The lever that makes Meta credit the **exact** ad/placement is **`_fbc`**, the click identifier derived from `fbclid`. When `_fbc` is present, attribution is deterministic to that click. When it's absent (very common on iOS / in-app browsers), Meta falls back to probabilistic view-through / 7-day-click matching — *"Meta decides on its own"* — and you see the reverse-mismatch (a real ad sale your UTM caught, but the ad shows fewer results in Ads Manager).

**Fix — hybrid `_fbc`, applied to EVERY server event (purchase, ic, atc):**
1. Prefer the real `_fbc` cookie (it carries Meta's own subdomain index + timestamp).
2. When the cookie is absent but a `fbclid` was captured, **rebuild** `fb.1.<clickTimestampMs>.<fbclid>`. The click timestamp comes from the attribution capture module (Section 4.6); fall back to the event time.

UTM/referrer/landing_url stay the source of truth for **your** CRM (Pabbly/Sheet). To reduce the inherent Meta-vs-UTM gap, the media buyer sets the ad set's attribution window to **7-day click, no view** — a Meta UI setting, not code.

---

## Section 3 — Required env vars

```
META_PIXEL_ID              = <pixel ID from Events Manager>     # server-only, NO NEXT_PUBLIC_ prefix
META_CAPI_ACCESS_TOKEN     = <CAPI access token>                # server-only, NEVER add NEXT_PUBLIC_
```

The pixel ID also appears as a literal constant in `app/layout.tsx` (because it must be inlined in the client bundle anyway for `fbq('init', ...)`). Pixel IDs aren't secrets — they're already visible to anyone using the Meta Pixel Helper browser extension. The **access token** is server-only.

---

## Section 4 — Reference code (adapt to project specifics)

### 4.1 — `lib/analytics.ts` (the MAM helper module)

```ts
'use client';

// Mirror of the literal in app/layout.tsx so this helper can re-init the pixel
// with Advanced Matching. Pixel IDs aren't secrets - they're already exposed in
// the client bundle - so duplicating as a literal is fine.
const META_PIXEL_ID = '<PIXEL_ID>';

// First-party cookie that persists hashed MAM values across pages and sessions
// so every PageView (not just the one after form-fill) inherits user identity.
// 30-day TTL aligns with typical Meta attribution windows. Same-origin only,
// SameSite=Lax. Read by the inline pixel script in app/layout.tsx BEFORE the
// first PageView fires.
const MAM_COOKIE_NAME = 'bw_mam';                       // rename per project if desired
const MAM_COOKIE_TTL_SECONDS = 30 * 24 * 60 * 60;

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

async function sha256Hex(value: string): Promise<string> {
  if (typeof crypto === 'undefined' || !crypto.subtle) return value;
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

async function buildHashedMatching(data: {
  email?: string; phone?: string; firstName?: string; lastName?: string;
  city?: string; country?: string;
}): Promise<Record<string, string>> {
  const normalised: Record<string, string | undefined> = {};
  if (data.email)     normalised.em      = data.email.trim().toLowerCase();
  if (data.phone) {
    const digits = data.phone.replace(/\D/g, '');
    if (digits) normalised.ph = digits;
  }
  if (data.firstName) normalised.fn      = data.firstName.trim().toLowerCase();
  if (data.lastName)  normalised.ln      = data.lastName.trim().toLowerCase();
  if (data.city) {
    const ct = data.city.trim().toLowerCase().replace(/[^a-z]/g, '');
    if (ct) normalised.ct = ct;
  }
  if (data.country) {
    const country = data.country.trim().toLowerCase();
    if (country) normalised.country = country;
  }

  const keys = Object.keys(normalised) as Array<keyof typeof normalised>;
  const hashes = await Promise.all(keys.map((k) => sha256Hex(normalised[k] as string)));
  const matching: Record<string, string> = {};
  keys.forEach((k, i) => { matching[k as string] = hashes[i]; });
  if (matching.em) matching.external_id = matching.em;  // user-stable, matches CAPI
  return matching;
}

function writeMamCookie(matching: Record<string, string>) {
  if (typeof document === 'undefined') return;
  if (Object.keys(matching).length === 0) return;
  const value = encodeURIComponent(JSON.stringify(matching));
  document.cookie = `${MAM_COOKIE_NAME}=${value}; Path=/; Max-Age=${MAM_COOKIE_TTL_SECONDS}; SameSite=Lax`;
}

export function readMamCookie(): Record<string, string> | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${MAM_COOKIE_NAME}=([^;]+)`));
  if (!match) return null;
  try {
    const parsed = JSON.parse(decodeURIComponent(match[1]));
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch { return null; }
}

export async function setMetaAdvancedMatching(data: {
  email?: string; phone?: string; firstName?: string; lastName?: string; city?: string; country?: string;
}) {
  if (typeof window === 'undefined' || !window.fbq) return;
  const matching = await buildHashedMatching(data);
  if (Object.keys(matching).length === 0) return;
  window.fbq('init', META_PIXEL_ID, matching);
  writeMamCookie(matching);
}

export function reapplyMamFromCookie() {
  if (typeof window === 'undefined' || !window.fbq) return;
  const matching = readMamCookie();
  if (!matching || Object.keys(matching).length === 0) return;
  window.fbq('init', META_PIXEL_ID, matching);
}
```

> **Note — two separate cookies, two separate concerns.** The `bw_mam` cookie
> here stores **hashed PII for the pixel** (Advanced Matching). It is NOT the
> attribution cookie. The attribution capture module (Section 4.6) writes its own
> `<prefix>_attr` cookie holding **raw utm/fbclid/referrer/landing_url**. Do not
> merge them.

### 4.2 — Server CAPI handler (`verify-payment` OR `webhook` route)

```ts
import crypto from 'crypto';

function sha256(value: string): string {
  return crypto.createHash('sha256').update(value.trim().toLowerCase()).digest('hex');
}

const CUSTOM_EVENT_NAME = 'sales'; // or 'leads', 'signup' - per project

// ── HYBRID _fbc (2026-08) ────────────────────────────────────────────────
// _fbc is the click identifier Meta uses to attribute to the exact ad click.
// Prefer Meta's own cookie; rebuild from fbclid when it's absent (iOS/in-app).
function resolveFbc(opts: {
  cookieFbc?: string; fbclid?: string; fbclidTs?: number;
}): string {
  if (opts.cookieFbc) return opts.cookieFbc;
  if (opts.fbclid) return `fb.1.${opts.fbclidTs || Date.now()}.${opts.fbclid}`;
  return '';
}

async function sendMetaCapiEvent(params: {
  pixelId: string; accessToken: string; paymentId: string;
  email: string; phone: string; firstName: string; lastName: string;
  city: string; countryCode: string; eventSourceUrl: string;
  fbc: string | undefined; fbp: string | undefined;
  clientIp: string | undefined; clientUserAgent: string | undefined;
  valueRupees: number; currency: string;
}) {
  const hashedEmail = sha256(params.email);
  const rawPhone = params.phone.replace(/\D/g, '');
  const externalId = sha256(params.email);
  const fn = params.firstName.trim().toLowerCase();
  const ln = params.lastName.trim().toLowerCase();
  const ct = params.city.trim().toLowerCase().replace(/[^a-z]/g, '');
  const country = params.countryCode.trim().toLowerCase();

  const baseEvent = {
    event_time: Math.floor(Date.now() / 1000),
    event_id: params.paymentId,
    action_source: 'website',
    event_source_url: params.eventSourceUrl,
    user_data: {
      em: [hashedEmail],
      ...(rawPhone && { ph: [sha256(rawPhone)] }),
      ...(fn && { fn: [sha256(fn)] }),
      ...(ln && { ln: [sha256(ln)] }),
      ...(ct && { ct: [sha256(ct)] }),
      ...(country && { country: [sha256(country)] }),
      external_id: [externalId],
      ...(params.fbc && { fbc: params.fbc }),          // hybrid value (see resolveFbc)
      ...(params.fbp && { fbp: params.fbp }),
      ...(params.clientUserAgent && { client_user_agent: params.clientUserAgent }),
      ...(params.clientIp && { client_ip_address: params.clientIp }),
    },
    custom_data: { currency: params.currency, value: params.valueRupees, payment_id: params.paymentId },
  };

  const events = [
    { ...baseEvent, event_name: 'Purchase' },          // drop for health datasets (Section 0)
    { ...baseEvent, event_name: CUSTOM_EVENT_NAME },
  ];

  const res = await fetch(
    `https://graph.facebook.com/v25.0/${params.pixelId}/events?access_token=${params.accessToken}`,
    { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ data: events }) },
  );
  if (!res.ok) throw new Error(JSON.stringify(await res.json()));
  return res.json();
}

// In the POST handler (webhook reads these from order.notes; verify route from cookies/body):
const cookieFbc = req.cookies.get('_fbc')?.value;      // (webhook: notes.fbc)
const fbclid    = body.fbclid || notes?.clid;          // captured fbclid
const fbclidTs  = Number(body.fbclidTs || notes?.ts);  // click time (Section 4.6)
const fbc = resolveFbc({ cookieFbc, fbclid, fbclidTs });
const fbp = req.cookies.get('_fbp')?.value;            // (webhook: notes.fbp)
// … then pass `fbc`/`fbp` into sendMetaCapiEvent, and into the Pabbly payload.
```

> **Razorpay-webhook variant.** When the tracking authority is the Razorpay
> webhook (server-to-server, no cookies), the client's create-order call snapshots
> `_fbc`/`_fbp`/`fbclid`/`ts`/`referrer`/`landing_url` into `order.notes`, and the
> webhook rebuilds `_fbc` from `notes.clid` + `notes.ts`. Same `resolveFbc` logic;
> the inputs come from notes instead of the request.

### 4.3 — `app/layout.tsx` (inline pixel script with cookie-aware MAM)

```tsx
const META_PIXEL_ID = '<PIXEL_ID>';

{META_PIXEL_ID && (
  <>
    <Script id="meta-pixel-init" strategy="afterInteractive">{`
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '${META_PIXEL_ID}');
      try {
        var m = document.cookie.match(/(?:^|;\\s*)bw_mam=([^;]+)/);
        if (m) {
          var mam = JSON.parse(decodeURIComponent(m[1]));
          if (mam && typeof mam === 'object' && Object.keys(mam).length) {
            fbq('init', '${META_PIXEL_ID}', mam);
          }
        }
      } catch (e) {}
      fbq('track', 'PageView');
    `}</Script>
    <noscript>
      <img height="1" width="1" style={{ display: 'none' }} alt=""
        src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`} />
    </noscript>
  </>
)}
```

Adjust the cookie name in the regex if the project uses a name other than `bw_mam`.

### 4.4 — Form component (`components/CheckoutForm.tsx`)

```tsx
'use client';
import { useEffect } from 'react';
import { setMetaAdvancedMatching } from '@/lib/analytics';
import { restoreParams } from '@/lib/track';

// Form-fill MAM (unchanged) — fires when the form is valid + filled, 500ms debounce.
useEffect(() => {
  const allFilled = /* all required fields non-empty + valid */ true;
  if (!allFilled) return;
  const timer = setTimeout(() => {
    void setMetaAdvancedMatching({ email, phone: `${dial}${phone}`, firstName, lastName, city, country });
  }, 500);
  return () => clearTimeout(timer);
}, [/* fields */]);

// On submit: restore attribution and thread it into BOTH the ic event and the
// payment request so the server can rebuild _fbc and Pabbly gets referrer/landing_url.
const attr = restoreParams();
// ic_event (optional): fireMetaIcOnce(customer, attr)
await fetch('/api/.../create-order', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    amount, currency, customer,
    utm: attr,                       // carries utm_* + referrer + landing_url + ts
    fbclid: attr.fbclid || '',
    fbclidTs: attr.ts || 0,          // click time → _fbc rebuild
  }),
});
```

Also pass `eventSourceUrl: typeof window !== 'undefined' ? window.location.href : undefined` if the route expects it.

### 4.5 — Success page (`app/thank-you/page.tsx`)

```tsx
'use client';
import { useEffect } from 'react';
import { reapplyMamFromCookie } from '@/lib/analytics';

useEffect(() => { reapplyMamFromCookie(); }, []);
```

### 4.6 — Attribution capture module (`lib/track.ts`) — NEW

The layer that decides whether your Sheet row has UTMs at all. Mount `captureParams()` on **every** page (global effects component / layout). Storage model:

- **ATTRIBUTION** (`utm_*` + `fbclid` + `gclid` + `ts`) is **LAST-TOUCH** — a later ad click overwrites a stale link-in-bio value. Clean internal URLs never wipe it.
- **CONTEXT** (`referrer` + `landing_url`) is **FIRST-TOUCH** — the true session entry, set once, even for untagged traffic (classifies blank-UTM buyers by channel).
- **`ts`** = click time, stored for the `_fbc` rebuild (Section 2a).
- **Mirror to BOTH localStorage AND a first-party `<prefix>_attr` cookie** (30-day, SameSite=Lax) for durability across in-app browsers / ITP.
- **`restoreParams()` reads live-URL-first, then storage.**

```ts
const ATTR_KEY = '<prefix>_attr';
const ATTR_TTL_DAYS = 30;

function readAttr() {
  try { const ls = localStorage.getItem(ATTR_KEY); if (ls) return JSON.parse(ls); } catch {}
  try {
    const m = document.cookie.match(new RegExp(`(?:^|;\\s*)${ATTR_KEY}=([^;]+)`));
    if (m) return JSON.parse(decodeURIComponent(m[1]));
  } catch {}
  return {};
}
function writeAttr(attr: Record<string, unknown>) {
  const json = JSON.stringify(attr);
  try { localStorage.setItem(ATTR_KEY, json); } catch {}
  try {
    document.cookie = `${ATTR_KEY}=${encodeURIComponent(json)}; Path=/; Max-Age=${ATTR_TTL_DAYS * 86400}; SameSite=Lax`;
  } catch {}
}

export function captureParams() {
  if (typeof window === 'undefined') return;
  try {
    const sp = new URLSearchParams(window.location.search);
    const g = (k: string) => sp.get(k) || '';
    const url = {
      source: g('utm_source'), medium: g('utm_medium'), campaign: g('utm_campaign'),
      content: g('utm_content'), term: g('utm_term'), fbclid: g('fbclid'), gclid: g('gclid'),
    };
    const hasAttribution = Object.values(url).some(Boolean);
    const attr: Record<string, unknown> = readAttr();
    let changed = false;
    if (!attr.landing_url) {                      // CONTEXT — first-touch
      attr.landing_url = window.location.href;
      attr.referrer = document.referrer || '';
      changed = true;
    }
    if (hasAttribution) {                         // ATTRIBUTION — last-touch
      Object.assign(attr, url, { ts: Date.now() });
      changed = true;
    }
    if (changed) writeAttr(attr);
  } catch {}
}

export function restoreParams(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const attr = readAttr();
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
  } catch {}
  return attr as Record<string, string>;
}
```

The server route reads `referrer` / `landing_url` off the restored attribution (via `body.utm`) and writes them into the Pabbly payload (SOP fields #24/#25), and uses `fbclid` + `fbclidTs` for the `_fbc` rebuild.

---

## Section 5 — Adapting to project variations

The reference repo collects: firstName, lastName, email, phone (+ country code), city. About 90% of funnels collect the same shape. For the 10% that differ:

### Extra fields the form might collect

| Form field | Maps to | Format before hashing |
|---|---|---|
| Date of birth | `db` | `YYYYMMDD` (e.g. `19910526`) |
| Postcode / PIN code | `zp` | lowercase, alphanumeric only |
| State / region | `st` | 2-letter lowercase (US/IN) or full lowercase name |
| Gender | `ge` | `f` or `m` (single char, lowercase) |
| Address line 1 | (no Meta field — skip) | — |

If the form collects any of these, ADD them to `buildHashedMatching`, the `setMetaAdvancedMatching` call sites, and `sendMetaCapiEvent`. Each additional field adds ~6-11% to EMQ.

> `referrer` / `landing_url` are **CRM/Pabbly** fields (SOP #24/#25), not Meta
> `user_data` — do not add them to the hashed pixel payload. They travel capture
> → order notes → Pabbly only.

### Custom event name

| Funnel type | Suggested `event_name` |
|---|---|
| Paid product / course | `sales` |
| Free webinar / lead capture | `leads` |
| Account signup / app install | `signup` |
| Booking / appointment | `booking` |
| Quote request | `quote_request` |

### Payment provider mapping

| Provider | Transaction ID source | event_id value |
|---|---|---|
| Razorpay | `razorpay_payment_id` from modal response | `pay_xxx` |
| Stripe | PaymentIntent id | `pi_xxx` |
| PayPal | `txn_id` from PDT/IPN | `transaction-id` |
| Cashfree | `cf_payment_id` | UUID |
| PhonePe | `merchantTransactionId` | UUID |

### Free / test / QA order skip

The CAPI block must be guarded by the project's test-mode pattern (`!isFreeOrder`, `!livemode`, price-floor, etc.). CAPI fires only for real revenue events.

### Cookie names

MAM (hashed PII): `bw_mam` / `<client>_mam`. Attribution (raw utm): `<client>_attr`. Keep both consistent within the project; the layout inline-script regex must match the MAM name.

---

## Section 6 — Verification checklist

| Check | How |
|---|---|
| Type-check / lint passes | `npm run type-check` (or project equivalent) |
| MAM cookie written after form fill | DevTools → Application → Cookies → `bw_mam` after valid form data |
| MAM cookie holds 7 SHA-256 hashes | 64-char hex; `em` == `external_id` |
| Attribution cookie written on tagged landing | DevTools → Cookies → `<prefix>_attr` holds utm_*/fbclid/ts + referrer/landing_url |
| **Last-touch works** | Land with UTM A, re-land with UTM B, check stored `source` == B and `landing_url` still == first entry |
| **Hybrid _fbc works** | Complete a payment in an in-app browser (no `_fbc` cookie); confirm CAPI `fbc` / Pabbly `fbc` is `fb.1.<ts>.<fbclid>`, not blank |
| Meta Pixel Helper shows PageView with MAM | After form fill, Advanced Matching Parameters listed |
| Server CAPI fires both events | Test payment → logs show `events_received: 2` (or 1 for health) |
| Test Events shows the event(s) | Events Manager → Test Events (external_id isn't shown — expected) |
| EMQ ≥ 9.5 | 24h after first real conversion |
| Free/test orders skipped | Free coupon flow → CAPI logs "skipped" |
| Pabbly row complete | referrer + landing_url + fbc populated |

---

## Section 7 — When to add browser-side `Purchase` (escalation only)

**Do NOT add this by default.** With the right Meta UI toggles off (auto events OFF, AAM OFF), server-only CAPI Purchase is sufficient and cleaner.

Add browser-side Purchase ONLY on these symptoms: "Improve deduplication for Purchase event" notice; `Purchase` count much higher than `<custom>` count; campaign Results far off real transaction count; Purchase EMQ < 9.0 despite correct CAPI. When triggered, fire `fbq('track','Purchase', {value,currency,content_name}, {eventID: paymentId})` AFTER `setMetaAdvancedMatching`, using the same `event_id` as the server event so dedup collapses them.

---

## Section 8 — Anti-patterns (do not do)

| Mistake | Why it breaks things |
|---|---|
| Hashing `fbc`/`fbp`/`referrer`/`landing_url`/IP/UA | These are sent RAW. Hashing breaks them as matching/context signals. |
| **Reading `_fbc` from the cookie only** | On iOS / in-app browsers the cookie is often absent → weak match → Meta under-attributes real ad sales. **Rebuild from `fbclid`** (Section 2a). |
| **First-touch freezing UTM** | A buyer who first hit link-in-bio then clicked the ad shows `link_in_bio` forever. Use **last-touch** overwrite (Section 4.6). |
| **Relying on localStorage only for attribution** | Evicted by ITP / lost across in-app→external handoff. **Mirror to a first-party cookie.** |
| **Expecting UTM to control Meta attribution** | Meta ignores utm_* entirely. The lever is `_fbc`. Narrow the window (7-day click, no view) media-side. |
| Pre-hashing `em`/`ph`/... in code AND ALSO sending raw to `fbq` | Double-hashing. Either pre-hash OR send raw, not both. |
| Sending `value` in paise/cents | Meta expects major units. 297 not 29700. |
| Sending the custom event WITHOUT standard `Purchase` | No global ML priors. **EXCEPTION — health/wellness (Section 0):** custom-only is required. |
| Skipping `event_source_url` | Required for `action_source: 'website'`. |
| Adding browser `Purchase` by default | See Section 7 — escalation only. |
| `external_id` that changes per transaction | Must be user-stable: `sha256(normalised_email)`. |
| Different `external_id` on browser vs CAPI | Meta requires consistency across channels. |
| Forgetting the free/test order guard | QA transactions reported as real conversions. |
| Allow-listing staging/preview domains in Meta | Preview URL events pollute the production pixel. |

---

## Section 9 — Final output the agent must produce

After implementation, the agent's response must end with this structure:

```
## Changes made
### File 1: <MAM helper> — <bullets>
### File 2: <attribution capture module lib/track> — <bullets>
### File 3: <server CAPI route> — <bullets, incl. hybrid _fbc>
### File 4: <root layout> — <bullets>
### File 5: <form component> — <bullets, incl. restoreParams threading>
### File 6: <success page> — <bullets>

## Verification checklist for the user
[ ] Type-check / lint passes
[ ] bw_mam cookie written after form fill; holds 7 hashes incl external_id (= em)
[ ] <prefix>_attr cookie holds utm/fbclid/ts + referrer/landing_url
[ ] Last-touch overwrite verified (UTM A then B → stored B, landing_url first)
[ ] Hybrid _fbc verified (in-app browser payment → fbc rebuilt, not blank)
[ ] Meta Pixel Helper shows MAM on PageView
[ ] Server CAPI logs 2 events per real payment (1 for health)
[ ] Test Events shows the event(s); event_source_url populated
[ ] Free/test orders do NOT fire CAPI
[ ] Pabbly row complete incl. referrer + landing_url + fbc

## Side-by-side comparison with the reference repo
| Aspect | Reference (Prenatal repo) | This project |
|---|---|---|
| MAM helper location | lib/analytics.ts | ? |
| Attribution module | lib/track.ts (last-touch + cookie mirror) | ? |
| Cookie names (MAM / attr) | bw_mam / <prefix>_attr | ? |
| Server route path | app/api/razorpay/verify-payment (or webhook) | ? |
| Payment provider | Razorpay | ? |
| Transaction ID source | razorpay_payment_id | ? |
| Custom event name | sales | ? |
| Hashed PII fields (CAPI) | em, ph, fn, ln, ct, country, external_id | ? |
| Server-context fields (CAPI) | fbc (hybrid), fbp, IP, UA | ? |
| _fbc mechanism | cookie-first, rebuilt fb.1.<ts>.<fbclid> | ? |
| Attribution model | last-touch + first-party cookie mirror | ? |
| referrer/landing_url | captured first-touch → notes → Pabbly | ? |
| external_id formula | sha256(normalised email) | ? |
| Browser Purchase event | NOT FIRED (default) | ? |
| Auto Event Detection / AAM | OFF | ? |

## Notes / decisions
<deviations>

## Media buyer action list
1. Events Manager → "Track events automatically without code" OFF
2. Events Manager → "Automatic Advanced Matching" OFF
3. Ad-set attribution window → 7-day click, no view (reduces Meta-vs-UTM gap)
4. Production domain on the allow list only
5. Run a test purchase → confirm EMQ 9.5+ and both events in Test Events
```

---

## Section 10 — Reference repo & commit history

Live working implementation: [github.com/Trainer-Goes-Online/ankita-prenatal](https://github.com/Trainer-Goes-Online/ankita-prenatal). Key commits:

| Commit | What landed |
|---|---|
| `11b7e48` | CAPI dual-event firing (Purchase + sales) with EMQ payload + event_source_url |
| `eb59d50` | Manual Advanced Matching on payment success |
| `ae663fc` | external_id on CAPI + persistent MAM cookie + browser PageView with cookie-read MAM |
| `7efe8d5` | external_id corrected to user-stable sha256(email) |
| `2026-08`  | **Hybrid _fbc (cookie-first, fbclid rebuild) + last-touch attribution + first-party cookie mirror + referrer/landing_url capture→notes→Pabbly** |

If the agent's diff doesn't match this pattern, that's a deliberate deviation that should be flagged in "Notes / decisions" — never silent.
