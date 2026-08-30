# Attribution Addendum — UTM Priority (landing_url → referrer → stored)

> **Share this with every client-funnel agent alongside `FUNNEL_ATTRIBUTION_AUDIT_AND_FIX.md`.**
> It amends that playbook's **L3** (referrer recovery). Everything else in that doc stands.
>
> **Origin:** a live client (Reset by Shruti, 2026-08-30) had ~2–3 of every 10 paid leads
> land in the CRM with `utm_source=ig / utm_medium=social / utm_content=link_in_bio` (the
> Instagram *bio link* tag) — **even though the `landing_page_url` or `referrer` clearly
> carried the real AD utm** (`Instagram_Stories`, `TGO VSL…`, `BROAD…`, `VID (2)…`). Meta
> still credited the correct ad via `fbclid`; only our CRM `utm_*` columns were wrong.

---

## 1. The one rule this addendum enforces

**When choosing what to write into `utm_source / utm_medium / utm_campaign / utm_content`, a
real AD utm found in the `landing_page_url` or `referrer` MUST beat an organic `link_in_bio`
(or blank) value sitting in the stored cookie/body.**

Priority, per field:

```
1. landing_page_url  (if it carries a real AD utm)
2. referrer          (if it carries a real AD utm)
3. stored cookie / body utm   (if it is a real AD utm)
4. otherwise → keep the best-filled value we have (landing → referrer → cookie → body),
   which for a GENUINE bio buyer correctly stays link_in_bio. Never fabricate an ad.
```

"Real AD utm" = any utm whose `utm_source` is **not** the organic set (`ig`, `fb`,
`instagram`, `facebook`, `l.instagram.com`, `linktr.ee`, …) and whose `utm_content` is **not**
`link_in_bio`. (See §5 for why this is safe and the one thing to avoid.)

---

## 2. Why the bug happens (so agents recognise it)

The buyer touched **two** tagged entry points inside the 30-day window, both writing the same
attribution cookie in the same in-app-browser cookie jar:

- the **paid ad** → `utm_source=Instagram_Stories`, `utm_medium=TGO VSL…`, `fbclid=…`
- Shruti's **Instagram bio link** → `utm_source=ig`, `utm_medium=social`, `utm_content=link_in_bio`

Three defects then combined:

1. **Last-touch overwrote the ad with the later bio tap.** The stored `utm_*` became
   `link_in_bio`; the first-touch `landing_url` kept the ad. → mismatch.
2. **Referrer/landing recovery only ran when `utm_*` were ALL blank.** Because the store held
   `link_in_bio` (not blank), the resolver never looked at the `landing_url`/`referrer` where
   the ad utm lived.
3. **No quality ranking.** The resolver trusted the cookie by position, with no notion that
   `link_in_bio` is organic housekeeping that a real ad utm should beat.

(Akanksha variant: `landing_url` was `/terms` with no utm; the ad utm was only in the
`referrer` — same defect #2.)

---

## 3. The fix — two changes

### 3a. Quality-aware resolution (the core fix)

Replace the "cookie→body, then referrer-only-if-blank" logic in `resolveAttribution` with a
candidate scan that prefers an **ad-grade** utm from any source, in the order
`landing → referrer → cookie → body`. Only if NO source has an ad-grade utm do we keep the
best-filled (organic) one.

```js
// helpers (pure, Edge-safe)
export const ORGANIC_SOURCES = new Set([
  'ig', 'fb', 'instagram', 'facebook', 'l.instagram.com', 'lm.facebook.com',
  'linktr.ee', 'taplink.cc', 'beacons.ai', 'bio.link',   // ← tune per client
]);
const utmSetOf = (o = {}) => ({
  source: o.source || '', medium: o.medium || '', campaign: o.campaign || '',
  content: o.content || '', term: o.term || '',
});
export const hasUtm = (u = {}) => ['source','medium','campaign','content','term'].some((k) => (u[k] || '').length > 0);
export function isOrganicUtm(u = {}) {
  if (!hasUtm(u)) return false;
  if ((u.content || '').toLowerCase() === 'link_in_bio') return true;
  if (ORGANIC_SOURCES.has((u.source || '').toLowerCase())) return true;
  if ((u.medium || '').toLowerCase() === 'social' && !(u.campaign || '').length) return true;
  return false;
}
export const isAdUtm = (u = {}) => (u.source || '').length > 0 && hasUtm(u) && !isOrganicUtm(u);

// inside resolveAttribution — replace the old utm block with:
const candidates = [
  { label: 'landing',  utm: utmSetOf(parseAttributionFromUrl(landingUrl)) },
  { label: 'referrer', utm: utmSetOf(parseAttributionFromUrl(referrer)) },
  { label: 'cookie',   utm: utmSetOf(cookieAttr) },
  { label: 'body',     utm: utmSetOf(bodyAttr) },
];
let chosen = candidates.find((c) => isAdUtm(c.utm));      // any ad-grade source wins
let utmQuality = 'ad';
if (!chosen) {                                            // else best-filled source
  chosen = candidates.find((c) => hasUtm(c.utm));
  utmQuality = chosen ? (isOrganicUtm(chosen.utm) ? 'organic' : 'other') : 'none';
}
const utm = chosen ? { ...chosen.utm } : utmSetOf({});
const utmSource = chosen ? chosen.label : 'none';
// keep the fbclid/_fbc (L4) logic unchanged; add utmQuality to the return +
// provenance e.g. `utm:${utmSource}/${utmQuality}|clid:${clidSource}`
```

This alone fixes every case, because `landing_url`/`referrer` are re-parsed every time and an
ad utm there beats a `link_in_bio` in the cookie. It also covers the referrer-only case
(Akanksha) and any historical rows when the webhook re-resolves from `notes.rf`/`notes.lp`.

### 3b. Ad-sticky capture (defence-in-depth)

So the cookie doesn't get contaminated in the first place, make last-touch **ad-sticky**: an
organic bio tap must not overwrite a stored ad utm; a real ad tap always wins (and the latest
ad wins). Click IDs (`fbclid`) stay pure last-touch. Apply in BOTH the client `captureParams`
and the edge `mergeAttribution`:

```js
if (hasUtm(live)) {
  // overwrite utm only if the incoming touch is ad-grade, OR nothing ad-grade is stored yet
  if (isAdUtm(live) || !isAdUtm(stored)) { /* copy live.source..term into stored */ }
}
if (live.fbclid) stored.fbclid = live.fbclid;   // click id = last-touch, always
if (live.gclid)  stored.gclid  = live.gclid;
```

This preserves the earlier requirement (**bio-first → ad-second still credits the ad**) while
fixing the new one (**ad-first → bio-second keeps the ad**).

---

## 4. Verification cases (add to the harness)

| Case | Input | Expected `utm_source` |
|---|---|---|
| Pooja/Bijal | cookie=`link_in_bio`, landing_url has `Instagram_Stories` | `Instagram_Stories` (from `landing`) |
| Akanksha | cookie=`link_in_bio`, landing_url=`/terms`, referrer has `Instagram_Feed` | `Instagram_Feed` (from `referrer`) |
| Genuine bio buyer | every source is `link_in_bio` | `ig` / `link_in_bio` (organic — **not** fabricated) |
| Ad-sticky (capture) | stored=ad, then organic bio tap | ad sticks; `fbclid` refreshes |
| Ad wins (capture) | stored=bio, then ad tap | ad overwrites bio |

---

## 5. The only caveat (simple)

The system tells "ad" from "bio" by the `utm_source` value: `ig`/`fb`/`link_in_bio` = organic
bio link; anything else = a real ad. **So keep your paid ads' `utm_source` distinct from the
bio link's.** If you ever tagged a real ad with `utm_source=ig` (the same as the bio link),
the system would mistake that ad for the bio link. No client does this today — ads use
`Instagram_Reels` / `Instagram_Stories` / `Instagram_Feed` / `Facebook_Mobile_Reels`, the bio
uses `ig` / `link_in_bio` — so it just works. If a client's naming differs, edit the
`ORGANIC_SOURCES` set (§3a) to match their organic tags.

---

## 6. What does NOT change

- Meta attribution (still on `fbclid`/`_fbc`, never on utm) — this only corrects the CRM columns.
- The rest of `FUNNEL_ATTRIBUTION_AUDIT_AND_FIX.md`: L1 edge capture, L2 server-reads-cookie,
  L4 hybrid `_fbc`, L5 `packJsonNote`, L6 webhook repair, host gate — all still apply.
- A genuine organic/bio buyer is still reported as `link_in_bio`. We fix mis-attribution, we
  never invent an ad that wasn't there.
