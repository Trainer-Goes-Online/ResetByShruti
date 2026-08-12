# SOP — Meta CAPI Downstream Feedback System for **VSL Funnels**

> **Funnel type this SOP covers:** Video Sales Letter (VSL) — low-ticket tripwire purchase → 1:1 sales call → high-ticket close.
> **For webinar / live-challenge funnels, use `META_CAPI_SOP_WEBINAR.md` instead.**

This document is a complete implementation playbook. It is designed to be pasted into a Claude Code session inside a sibling client project (which already has a frontend + backend + Razorpay). The agent reads it, audits the existing code, produces a plan, gets human approval, then executes.

You will also be given two **reference files** from the working SDP implementation:
- `apps-script/Code.gs` — the proven Apps Script source (your template)
- `apps-script/README.md` — its deployment + ops guide

Use those as the canonical reference. Adapt them to this project's actual code, form fields, and client name — do not copy blindly.

> **⚠ 2026-08 REVISION — attribution-capture hardening.** Three changes are now
> baked into this SOP after a live client (Reset by Shruti) showed UTM rows
> going blank while Meta still credited the ad. Read **Section 4.5** (new) and
> the updated fields **#9 `fbc`**, **#24 `referrer`**, **#25 `landing_url`**:
>   1. **Hybrid `_fbc`** — prefer the real cookie, else rebuild `fb.1.<ts>.<fbclid>`.
>   2. **Last-touch UTM capture + first-party cookie mirror + read-live-URL-first.**
>   3. **`referrer` + `landing_url`** carried capture → notes → Pabbly, so untagged
>      buyers are still classifiable.
> The field count grew **23 → 25** and the auto-fill Sheet block grew **A–W → A–Y**
> (lifecycle columns shift +2 to **Z–AL**). Everything else is unchanged.

---

## ▶️ Kickoff prompt (paste this alongside the SOP)

```
You're implementing a Meta Conversions API downstream feedback system in this
project. Read META_CAPI_SOP_VSL.md end-to-end before touching code. Also read
the two reference files apps-script/Code.gs and apps-script/README.md from the
SDP implementation — they are your template.

This is a VSL funnel. Do NOT start coding. Work the SOP's workflow in order:

1. AUDIT the existing codebase (payment verification route / Razorpay webhook,
   current Pabbly webhook payload, current Meta CAPI event firing, checkout form
   fields, UTM/cookie capture, fbp/fbc handling, referrer/landing_url capture).
2. COMPARE the existing Pabbly payload against the 25-field target in Step 1
   of the SOP. Produce a diff table (have / missing / needs-transform).
3. PLAN all changes: the Step 1 backend enrichment, the Section 4.5 capture
   layer, the Sheet schema, the Apps Script. Propose client-specific custom
   event names. Surface every deviation from the SOP explicitly.
4. WAIT for my approval of the plan.
5. EXECUTE only after I approve, one step at a time.

Hard rule: this project's backend already fires its Meta CAPI conversion
event(s) after payment. DO NOT change, remove, or duplicate that event firing.
The ONLY backend change in Step 1 is adding fields to the Pabbly webhook JSON
body + the attribution-capture hardening in Section 4.5. Confirm you understand
this before planning.
```

---

## 1. What you're building — the 4-layer architecture

```
Layer 1  Meta Ad → Landing/VSL → tripwire purchase (₹X) → Razorpay
Layer 2  Payment-verify server route / Razorpay webhook:
           • fires existing Purchase + sales CAPI events  (DO NOT TOUCH)
           • POSTs an ENRICHED payload to the Pabbly webhook  → Step 1 change
Layer 3  Pabbly → writes ONE row per lead into a Google Sheet CRM
Layer 4  Sales team marks lifecycle status in the Sheet →
           Apps Script fires downstream Meta CAPI events:
             • CallBooked-equivalent   (lead booked the sales call)
             • CallDone-equivalent     (lead attended the call)
             • HighTicketPurchase      (lead bought the high-ticket offer)
```

The point: feed Meta not just the tripwire purchase, but the **downstream revenue-quality signals** — so Meta's algorithm optimises toward buyers who book, show up, and buy high-ticket, not just anyone who pays the tripwire.

**Key architecture decisions (do not deviate without flagging):**
- Downstream events fire from **Apps Script directly to Meta Graph API** — no backend proxy. Secrets live in Apps Script `PropertiesService`. This keeps each client a self-contained, copy-paste deployment.
- The tripwire `Purchase` + `sales` events keep firing from the backend exactly as they do today.
- The Google Sheet is the single source of truth linking a lead's payment-time identifiers to their later lifecycle status.

---

## 1a. ⚠ How Meta actually attributes — read before touching UTM

A recurring client misconception: *"we have UTMs and per-ad placements, so if we send the UTMs to Meta it will credit the right ad."* **False.** Meta's Ads Manager does **not** attribute conversions on `utm_source`/`utm_content` — it never reads them. Attribution is decided by:

1. **`fbc`** (the click identifier, derived from `fbclid`) → deterministic, ties the conversion to the *exact* ad click / placement.
2. If `fbc` is missing → `fbp` + hashed PII + Meta's probabilistic view-through / 7-day-click model → *"Meta decides on its own."*

So the lever that makes Meta credit the correct ad is a **strong `fbc`** (Section 4.5 + field #9), **not** UTM. UTM is the source of truth for **your Sheet/CRM**, not for Meta's attribution. The two systems will never perfectly agree — Meta over-attributes via view-through, UTM is deterministic last-click. Narrow Meta's window (ad-set setting: *7-day click, no view*) to reduce the gap; that's a media-buyer action, not code.

---

## 2. Hard constraints — what you must NOT change

1. **Do NOT touch the existing Meta CAPI event firing.** This project fires its conversion event(s) (`Purchase` + `sales`, or custom-only for health datasets) after payment. They stay exactly as-is — same event names, same event_id, same payload, same dedup. Your Step 1 change adds fields to the **Pabbly webhook body only** + the Section 4.5 capture hardening.
2. **Do NOT add or change client-side Pixel events.** Browser fires `PageView` only. If the project fires `fbq('track', 'Purchase')` or similar client-side, leave it; if it does not, do not add it.
3. **Do NOT introduce a backend endpoint for downstream events.** Apps Script talks to Meta directly.
4. **Do NOT change the payment flow, redirect behavior, or any user-facing copy/UI.**
5. **Do NOT invent form fields.** Hash and forward only what the checkout form actually collects. If the form lacks `city` or `last_name`, omit those user_data fields — never fabricate.
6. **Do NOT hash `fbc`/`fbp`/`referrer`/`landing_url`/IP/UA.** These are raw matching/context signals.

---

## 3. Your workflow (follow in order — do not skip ahead)

### Phase A — Audit (report, don't change)
Find and report on:
1. The server route that handles **successful payment** (payment-verify route OR the Razorpay webhook — the sole tracking authority). This is where the Pabbly webhook is POSTed and where the existing CAPI events fire.
2. The **current Pabbly webhook payload** — list every field it currently sends.
3. The **current Meta CAPI event firing** — confirm the event names, note the event_id used and the user_data fields included.
4. The **checkout form fields** collected (email, phone, first/last name, city, country, etc.).
5. **UTM + click-ID capture** — how UTMs, `fbclid`, `gclid` are captured and persisted (cookie? localStorage? first-touch or last-touch? is there a cookie mirror?). **Note whether `referrer` / `landing_url` are captured at all.**
6. **fbp / fbc handling** — where `_fbc` / `_fbp` cookies are read server-side, and **whether `_fbc` is rebuilt from `fbclid` when the cookie is absent** (usually it is NOT — that's the gap).
7. The **transaction ID** format the payment provider issues (used as `lead_id` + event_id base).

Output a 5-10 bullet audit summary before proceeding.

### Phase B — Compare (the diff that drives Step 1)
Produce a table: for each of the **25 target fields** (Section 4), mark `HAVE` (already in Pabbly payload), `MISSING` (need to add), or `TRANSFORM` (present but wrong format/name). This table IS the Step 1 work list.

### Phase C — Plan
Propose, in writing, awaiting approval:
- The exact Step 1 backend change (which file, which fields added, how each is derived)
- The Section 4.5 capture-layer change (last-touch + cookie mirror + live-URL-first + referrer/landing_url + fbclid timestamp)
- The Google Sheet schema (Section 5)
- The Apps Script event config + **client-specific event names** (Section 6)
- A risk list + a verification plan
Flag every deviation from this SOP explicitly under a "Deviations" heading.

### Phase D — Approval gate
Stop. Wait for the human to approve the plan.

### Phase E — Execute
Implement one step at a time. Commit each step. Do not push unless told.

---

## 4. STEP 1 — Enrich the Pabbly webhook payload (UNIVERSAL — identical for every funnel)

After payment, the server must POST these **25 fields** to the Pabbly webhook. They become columns A–Y in the CRM Sheet, and they carry every identifier the downstream Apps Script needs to fire high-EMQ events later.

| # | Field name (JSON key) | Type | How to derive it server-side |
|---|---|---|---|
| 1 | `lead_id` | string | The payment/transaction ID (Razorpay `payment_id`). Canonical unique key per lead. |
| 2 | `created_at` | ISO 8601 | Payment timestamp, e.g. `new Date().toISOString()` (store with timezone). |
| 3 | `first_name` | string | From checkout form. |
| 4 | `last_name` | string | From checkout form. |
| 5 | `email` | string | From checkout form (raw — Pabbly stores raw; hashing happens later for CAPI). |
| 6 | `phone` | string | Dial code + number, digits where possible, e.g. `+919876543210`. |
| 7 | `city` | string | From checkout form. |
| 8 | `country_code` | string | 2-letter ISO (e.g. `IN`). |
| 9 | `fbc` | string | **HYBRID (2026-08):** prefer the raw `_fbc` cookie from the request; when it is absent — common on iOS / in-app browsers — **reconstruct it from the captured `fbclid`** as `fb.1.<clickTimestampMs>.<fbclid>`. Empty string only if neither the cookie nor a `fbclid` exists. The click timestamp comes from the capture layer (Section 4.5); fall back to the order/event time. This is the single highest-leverage EMQ + attribution field — do not leave it cookie-only. |
| 10 | `fbp` | string | The `_fbp` cookie value from the request (raw). Empty string if absent. |
| 11 | `client_ip_address` | string | First IP in `x-forwarded-for`, else `x-real-ip`. |
| 12 | `client_user_agent` | string | The `user-agent` request header. |
| 13 | `external_id` | string | **`sha256(lowercase(trim(email)))`** computed server-side, lowercase hex. Same hash used in your existing CAPI user_data if present. |
| 14 | `event_source_url` | string | The canonical checkout URL (host + path, no query for health datasets). |
| 15 | `amount` | number/string | The tripwire amount actually charged (e.g. `97`, or `0` for a test/bypass coupon). |
| 16 | `is_test` | string | `"true"` / `"false"` — whether this was a test/bypass-coupon order. |
| 17 | `purchase_event_id` | string | The `event_id` used by your existing conversion CAPI events (typically = `lead_id`). Stored so downstream events can reference the purchase + so dedup is auditable. |
| 18 | `utm_source` | string | From your UTM capture (Section 4.5). |
| 19 | `utm_medium` | string | From your UTM capture. |
| 20 | `utm_campaign` | string | From your UTM capture. |
| 21 | `utm_content` | string | From your UTM capture. |
| 22 | `utm_term` | string | From your UTM capture. |
| 23 | `fbclid` | string | Facebook click ID from your capture. **Backup for `fbc` reconstruction (field #9)** — always forward it even when a `_fbc` cookie also exists. |
| 24 | `referrer` | string | **NEW (2026-08):** `document.referrer` at the *first* page of the session (first-touch), carried through capture → order notes → here. Classifies **untagged** buyers by channel (instagram/facebook/google/…) when all UTMs are blank. Empty if the entry was direct. |
| 25 | `landing_url` | string | **NEW (2026-08):** the full URL of the first page of the session (first-touch). The raw entry point (query string included) for audit/debug of where attribution should have come from. |

**Implementation rules:**
- Add these fields to the **existing** Pabbly webhook payload object. Keep any fields the project already sends — Pabbly will just map what the Sheet needs and ignore the rest.
- Every field must be present in the POST body even when empty (send `""` not `undefined`) so Pabbly's mapping is stable.
- `external_id` MUST be computed identically to how the existing CAPI computes its `external_id` (if it does). Consistency = Meta links browser + server + downstream into one user.
- **`fbc` is hybrid, never cookie-only.** Reconstruct from `fbclid` when the cookie is missing (field #9). Do this once, server-side, at order-creation time so the value flows to BOTH Pabbly and the CAPI event; add a defensive rebuild in the webhook too for orders created before the change.
- **Do not touch the CAPI event firing in the same route.** Only the Pabbly POST body changes (plus reading the rebuilt `fbc` into the CAPI `user_data`).

**Deliverable for Step 1:** the diff table from Phase B + the enriched payload code, committed as one focused commit (e.g. `"Step 1: enrich Pabbly webhook payload with Meta matching identifiers"`).

---

## 4.5 STEP 1b — Client-side attribution capture layer (NEW — the layer that feeds Step 1)

Step 1 can only forward what the client captured. This layer is where blank-UTM rows and mis-attributed sales are actually born, so it is now part of the SOP. Implement a small client module (e.g. `lib/track.js`) mounted on **every** page (via the global effects component / layout), exposing `captureParams()` (runs on mount) and `restoreParams()` (read at checkout submit).

**Storage model — do NOT use the old first-touch freeze:**

- **ATTRIBUTION** (`utm_*` + `fbclid` + `gclid` + `ts`) is **LAST-TOUCH.** Every page whose URL carries fresh attribution **overwrites** the stored set. A buyer who first arrived via link-in-bio and later clicks the ad then has the **ad** credited, not the stale bio link. Pages with a clean URL (internal navigation) leave the stored set untouched.
- **CONTEXT** (`referrer` + `landing_url`) is **FIRST-TOUCH.** The true entry point of the session, set once — even for untagged (no-UTM) traffic. This is what lets you classify an untagged buyer by channel.
- **`ts`** is the **click time** (`Date.now()` when attribution was captured), stored so the server can rebuild `_fbc` as `fb.1.<ts>.<fbclid>` (field #9).
- **Mirror to BOTH `localStorage` AND a first-party cookie** (`<prefix>_attr`, 30-day, `SameSite=Lax`, `Path=/`) so the value survives contexts where one or the other is evicted (in-app browsers, ITP).
- **`restoreParams()` reads live-URL-first, then storage** — overlay any attribution present on the current URL over the stored set, in case `captureParams()` hasn't run yet on that page.

**Reference implementation (adapt names to the project):**

```js
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

function writeAttr(attr) {
  const json = JSON.stringify(attr);
  try { localStorage.setItem(ATTR_KEY, json); } catch {}
  try {
    const maxAge = ATTR_TTL_DAYS * 24 * 60 * 60;
    document.cookie = `${ATTR_KEY}=${encodeURIComponent(json)}; Path=/; Max-Age=${maxAge}; SameSite=Lax`;
  } catch {}
}

export function captureParams() {
  if (typeof window === 'undefined') return;
  try {
    const sp = new URLSearchParams(window.location.search);
    const g = (k) => sp.get(k) || '';
    const url = {
      source: g('utm_source'), medium: g('utm_medium'), campaign: g('utm_campaign'),
      content: g('utm_content'), term: g('utm_term'), fbclid: g('fbclid'), gclid: g('gclid'),
    };
    const hasAttribution = Object.values(url).some(Boolean);
    const attr = readAttr();
    let changed = false;

    // CONTEXT — first-touch: entry point once, even for untagged traffic.
    if (!attr.landing_url) {
      attr.landing_url = window.location.href;
      attr.referrer = document.referrer || '';
      changed = true;
    }
    // ATTRIBUTION — last-touch: overwrite whenever this URL carries params.
    if (hasAttribution) {
      Object.assign(attr, url, { ts: Date.now() });
      changed = true;
    }
    if (changed) writeAttr(attr);
  } catch {}
}

export function restoreParams() {
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
  return attr;
}
```

**At checkout submit**, pass the restored `attr` into the create-order/verify request body: `utm` (the object), `fbclid`, and `fbclidTs` (= `attr.ts`). The server maps `attr.referrer` / `attr.landing_url` into notes (fields #24/#25) and uses `fbclid` + `fbclidTs` to rebuild `fbc` (field #9).

**Server-side `fbc` rebuild (create-order OR verify route):**

```ts
const fbclid   = body.fbclid || attr.fbclid || '';
const fbclidTs = Number(body.fbclidTs) || Number(attr.ts) || Date.now();
const fbcCookie = req.cookies.get('_fbc')?.value || '';
const fbc = fbcCookie || (fbclid ? `fb.1.${fbclidTs}.${fbclid}` : '');
```

Do the same in the **initiate-checkout / add-to-cart** CAPI routes if they exist — the `fbc` lever applies to every server event, not just the purchase.

---

## 5. STEP 2 — Google Sheet CRM schema (VSL funnel)

One Sheet, **one row per lead**, 38 columns A–AL. Columns A–Y are auto-filled by Pabbly (identical to every funnel). Columns Z–AL are the VSL lifecycle (sales team + Apps Script).

> **⚠ 2026-08:** the auto-fill block grew from A–W (23) to **A–Y (25)** with the
> addition of `referrer` (X) and `landing_url` (Y). The lifecycle block therefore
> shifted **+2**: it now runs **Z–AL** (was X–AJ). If you are upgrading an
> existing sheet, insert two columns after `fbclid` and re-point the Apps Script
> `COL` map (Section 6) — every lifecycle index moves by 2.

### Auto-fill columns A–Y (Pabbly writes — UNIVERSAL)

```
lead_id | created_at | first_name | last_name | email | phone | city | country_code | fbc | fbp | client_ip_address | client_user_agent | external_id | event_source_url | amount | is_test | purchase_event_id | utm_source | utm_medium | utm_campaign | utm_content | utm_term | fbclid | referrer | landing_url
```

### Manual + Apps-Script columns Z–AL (VSL lifecycle)

| Col | Field | Written by | Notes |
|---|---|---|---|
| Z  | `call_booked` | Sales team | Dropdown `TRUE`/`FALSE` (see note below). Fires the CallBooked event. |
| AA | `booking_time` | Sales team | Date+time (IST), `yyyy-mm-dd hh:mm`. **Fill BEFORE setting status TRUE.** |
| AB | `schedule_capi_event_id` | Apps Script | `<lead_id>_schedule` |
| AC | `schedule_capi_sent` | Apps Script | `TRUE` after fire — dedup flag |
| AD | `call_showed` | Sales team | Dropdown `TRUE`/`FALSE`. Fires the CallDone event. |
| AE | `showup_time` | Sales team | Date+time (IST). Fill before status. |
| AF | `showup_capi_event_id` | Apps Script | `<lead_id>_showup` |
| AG | `showup_capi_sent` | Apps Script | `TRUE` after fire |
| AH | `sale_closed` | Sales team | Dropdown `TRUE`/`FALSE`. Fires the HighTicketPurchase event. |
| AI | `contracted_value` | Sales team | Plain integer, INR, no symbols/commas (e.g. `60000`). **Fill BEFORE status.** Use CONTRACTED value (the full committed amount), not collected. |
| AJ | `sales_time` | Sales team | Date+time (IST). |
| AK | `htsale_capi_event_id` | Apps Script | `<lead_id>_htsale` |
| AL | `htsale_capi_sent` | Apps Script | `TRUE` after fire |

**Dropdown, NOT checkbox** for `call_booked` / `call_showed` / `sale_closed`: use a Data Validation dropdown with values `TRUE` and `FALSE` and leave the cell **blank by default**. (A checkbox defaults to FALSE, but Pabbly's "Add Row" writes a brand-new row where these manual cells must be genuinely empty so the Apps Script onEdit logic and the dedup checks behave correctly. A blank dropdown stays blank on row creation; a checkbox would render as unchecked=FALSE which muddies "never touched" vs "explicitly FALSE".)

**Column formats:**
- Z, AD, AH — Data Validation dropdown: `TRUE`, `FALSE` (blank default)
- AA, AE, AJ — Date+time cell (`yyyy-mm-dd hh:mm`, IST)
- AI — Plain number (no thousands separator)
- AB, AC, AF, AG, AK, AL — leave for Apps Script (text + dropdown/TRUE)

**Plus a hidden `_Errors` tab** with header: `timestamp | row_number | event_type | http_status | response_body | retry_count`.

**Spreadsheet timezone** must be set to the client's operating timezone (File → Settings → Timezone) so datetime columns parse correctly.

---

## 6. STEP 3 — Apps Script (downstream event engine)

Use the provided `apps-script/Code.gs` as your template. It is funnel-agnostic in structure; you customize **two things**:

### 6.1 The `EVENTS` config — event names + column mapping

For a VSL funnel there are **3 downstream events**. Customize the `eventName` for this client (see naming guide §7). **⚠ 2026-08:** the `COL.*` indices moved +2 (referrer/landing_url added at X/Y). Update the `COL` map so the lifecycle columns point at **Z–AL**, not X–AJ. Template shape:

```js
// COL indices now start the lifecycle block at Z (col 26, 0-indexed 25).
const EVENTS = {
  CALL_BOOKED: {
    eventName: '<ClientTag>CallBooked',      // ← client-specific
    triggerCol: COL.CALL_BOOKED,             // Z   (was X)
    timeCol: COL.BOOKING_TIME,               // AA  (was Y)
    eventIdCol: COL.SCHEDULE_CAPI_EVENT_ID,  // AB  (was Z)
    sentCol: COL.SCHEDULE_CAPI_SENT,         // AC  (was AA)
    eventIdSuffix: 'schedule',
    includeValue: false,
  },
  CALL_SHOWED: {
    eventName: '<ClientTag>CallDone',        // ← client-specific
    triggerCol: COL.CALL_SHOWED,             // AD  (was AB)
    timeCol: COL.SHOWUP_TIME,                // AE  (was AC)
    eventIdCol: COL.SHOWUP_CAPI_EVENT_ID,    // AF  (was AD)
    sentCol: COL.SHOWUP_CAPI_SENT,           // AG  (was AE)
    eventIdSuffix: 'showup',
    includeValue: false,
  },
  SALE_CLOSED: {
    eventName: '<ClientTag>HighTicketPurchase', // ← client-specific
    triggerCol: COL.SALE_CLOSED,             // AH  (was AF)
    timeCol: COL.SALES_TIME,                 // AJ  (was AH)
    eventIdCol: COL.HTSALE_CAPI_EVENT_ID,    // AK  (was AI)
    sentCol: COL.HTSALE_CAPI_SENT,           // AL  (was AJ)
    eventIdSuffix: 'htsale',
    includeValue: true,
    valueCol: COL.CONTRACTED_VALUE,          // AI  (was AG)
  },
};
```

### 6.2 The Script Properties (per-client secrets)

| Property | Value |
|---|---|
| `META_PIXEL_ID` | this client's pixel ID |
| `META_CAPI_ACCESS_TOKEN` | this client's CAPI access token |
| `EVENT_SOURCE_URL_DEFAULT` | this client's post-purchase/booking page URL |

Everything else in `Code.gs` — SHA-256 hashing, `user_data` construction (em, ph, fn, ln, ct, country, external_id + raw fbc/fbp/IP/UA), retry/backoff, `_Errors` logging, `setupTriggers`, `replayPendingEvents`, the `onSheetEdit` dispatcher — **stays identical**. Do not rewrite it; reuse it.

**What the Apps Script does per event** (already implemented in the template):
- Sales team sets the trigger dropdown to `TRUE` → `onSheetEdit` fires
- Reads the row, builds high-EMQ `user_data` (hashes em/ph/fn/ln/ct/country + external_id, forwards raw fbc/fbp/IP/UA)
- For HighTicketPurchase, includes `value` = contracted_value + `currency: INR`
- POSTs to `graph.facebook.com/v25.0/<pixel_id>/events`
- On success: stamps `*_capi_event_id` + `*_capi_sent = TRUE`
- On failure: logs to `_Errors`, leaves the row retry-able

---

## 7. Naming guide — client-specific event names

Reference (SDP's VSL): `CallBookedWithSDP`, `CallDoneWithSDP`, `SDPHighTicketPurchase`.

For a new client, derive a short ClientTag from the brand/product name and apply the same pattern:

| Logical event | Pattern | Example (client "AcmeFit") |
|---|---|---|
| Call booked | `<Tag>CallBooked` or `CallBookedWith<Tag>` | `AcmeFitCallBooked` |
| Call attended | `<Tag>CallDone` or `CallDoneWith<Tag>` | `AcmeFitCallDone` |
| High-ticket sale | `<Tag>HighTicketPurchase` | `AcmeFitHighTicketPurchase` |

Rules:
- Alphanumeric only, no spaces, ≤ 40 chars, consistent casing.
- Pick once, never change (Meta's ML needs naming stability).
- Propose the names in your Phase C plan and let the human confirm before coding.
- These are **custom events**. The tripwire `Purchase` + `sales` events keep their standard names — do not rename those.

---

## 8. STEP 4 — Deploy + smoke test

Follow the deployment section of the reference `apps-script/README.md`. Summary:
1. Open the client's CRM Sheet → Extensions → Apps Script. Paste `Code.gs` + `appsscript.json`.
2. Set the 3 Script Properties (§6.2).
3. Run `setupTriggers`, authorize permissions.
4. In Meta Events Manager → Test Events, generate a test code.
5. Drive a dummy row through the lifecycle (fill time → set status TRUE) for each of the 3 events; confirm each arrives in Test Events with EMQ 9+ and the `*_capi_sent` + `*_capi_event_id` columns auto-populate.
6. Confirm one real tripwire payment produces a complete Sheet row (all 25 auto-fill columns populated, especially **fbc (rebuilt when cookie absent)**, fbp/external_id/IP/UA, **referrer + landing_url**).

---

## 9. Verification, dedup, error handling, rollout

- **Dedup**: per-row `*_capi_sent` flag + deterministic `event_id` (`<lead_id>_<suffix>`). Meta dedupes same event_name+event_id within 48h.
- **Errors**: non-200 from Meta → logged to `_Errors` tab, flag left unset, row retry-able. Bulk recover via `replayPendingEvents`.
- **fbc smoke test**: complete a payment in an in-app browser (no `_fbc` cookie). Confirm the Sheet `fbc` column is still populated (rebuilt `fb.1.<ts>.<fbclid>`), not blank.
- **Attribution smoke test**: land via a UTM link, then re-land via a *different* UTM link, then buy — confirm the Sheet shows the **second** (last-touch) UTM set, and `landing_url` still shows the **first** entry.
- **Rollout order**: Section 4.5 capture layer + Step 1 backend enrichment → verify a real payment fills the Sheet → deploy Apps Script → smoke test → go live. Do not deploy Apps Script before the Sheet reliably receives complete rows.
- **Token rotation**: update `META_CAPI_ACCESS_TOKEN` in Script Properties; no redeploy needed.
- **Media-buyer follow-ups (not code):** set ad-set attribution to *7-day click, no view*; add `referrer` + `landing_url` columns in the Pabbly→Sheet mapping.

---

## 10. Required deliverables from the agent

1. Phase A audit summary (5-10 bullets) — including whether capture is first- or last-touch, whether a cookie mirror exists, whether `fbc` is rebuilt from `fbclid`, and whether `referrer`/`landing_url` are captured.
2. Phase B compare table (25 fields: have / missing / transform)
3. Phase C plan: backend change spec + Section 4.5 capture-layer change + Sheet schema + Apps Script event config + proposed client event names + risk list + verification plan + explicit Deviations section
4. **Stop for approval**
5. Post-approval: execute step-by-step, one commit per step, push only when told
6. Final side-by-side: this project's implementation vs. the SDP reference (route path, payment provider, transaction ID source, event names, hashed fields, capture model, fbc mechanism, etc.)

Do not silently deviate from this SOP. Any change from the reference pattern must be called out and justified.
