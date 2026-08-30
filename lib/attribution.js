/* ============================================================================
   ATTRIBUTION CORE — pure, Edge-safe (no node:crypto, no DOM)
   ----------------------------------------------------------------------------
   Shared by the edge middleware (L1), create-order (L2–L5) and the webhook (L6).
   Per FUNNEL_ATTRIBUTION_AUDIT_AND_FIX.md. The reliability fix is architectural:
   capture the query string SERVER-SIDE on the first request (middleware) so it
   no longer depends on a React effect winning a race against a link tap in the
   in-app browser. Everything here is a pure function so it runs identically at
   the edge and in the Node route handlers.

   Precedence per field:  URL → cookie → body → referrer → _fbc → none
   `referrer` is a valid fallback for utm_* only, NEVER for fbclid — Razorpay's
   256-char note cap truncates the fbclid inside a referrer URL (49 of 195 chars
   observed), so `_fbc` is the only complete fbclid source.

   ⚠ The attribution cookie (`reset_attr`, raw utm/fbclid) is a DIFFERENT cookie
   from the pixel MAM cookie (hashed PII). Never merge them.
   ========================================================================== */

export const ATTR_COOKIE = 'reset_attr';                 // matches lib/track.js
export const ATTR_TTL_SECONDS = 30 * 24 * 60 * 60;

export const URL_TO_KEY = {
  utm_source: 'source', utm_medium: 'medium', utm_campaign: 'campaign',
  utm_content: 'content', utm_term: 'term', fbclid: 'fbclid', gclid: 'gclid',
};
export const UTM_KEYS = ['source', 'medium', 'campaign', 'content', 'term'];

const isFilled = (v) => typeof v === 'string' && v.length > 0;

/* ── UTM QUALITY (ad vs organic) ─────────────────────────────────────────────
   An IG "link in bio", a Linktree, etc. are ORGANIC housekeeping links. They
   must NEVER override the real ad's utm when that ad's utm is present in the
   landing_url or referrer. This denylist is the tunable definition of "organic"
   — extend it per client. Everything with a utm_source that isn't organic is
   treated as ad-grade. */
export const ORGANIC_SOURCES = new Set([
  'ig', 'fb', 'instagram', 'facebook', 'l.instagram.com', 'lm.facebook.com',
  'linktr.ee', 'taplink.cc', 'beacons.ai', 'bio.link',
]);

const utmSetOf = (o = {}) => ({
  source: o.source || '', medium: o.medium || '', campaign: o.campaign || '',
  content: o.content || '', term: o.term || '',
});
export const hasUtm = (u = {}) => UTM_KEYS.some((k) => isFilled(u[k]));
export function isOrganicUtm(u = {}) {
  if (!hasUtm(u)) return false;
  if ((u.content || '').toLowerCase() === 'link_in_bio') return true;
  if (ORGANIC_SOURCES.has((u.source || '').toLowerCase())) return true;
  if ((u.medium || '').toLowerCase() === 'social' && !isFilled(u.campaign)) return true;
  return false;
}
export const isAdUtm = (u = {}) => isFilled(u.source) && hasUtm(u) && !isOrganicUtm(u);

/** Parse utm_* / fbclid / gclid out of a URL or a bare query string. */
export function parseAttributionFromUrl(input) {
  const out = {};
  if (!input) return out;
  try {
    const search = input.includes('?') ? input.slice(input.indexOf('?')) : input;
    const sp = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search);
    for (const [param, key] of Object.entries(URL_TO_KEY)) {
      const v = sp.get(param);
      if (isFilled(v)) out[key] = v;
    }
  } catch { /* malformed URL — best effort */ }
  return out;
}

/** _fbc is `fb.<subdomainIndex>.<clickTsMs>.<fbclid>` — the ONLY complete fbclid source. */
export function parseFbc(fbc) {
  if (!isFilled(fbc)) return {};
  const p = fbc.split('.');
  if (p.length < 4 || p[0] !== 'fb') return {};
  const ts = Number(p[2]);
  return { fbclid: p.slice(3).join('.'), ts: Number.isFinite(ts) && ts > 0 ? ts : undefined };
}

/* Tolerant of both wire forms: the value Next has already URL-decoded once
   (raw JSON — parse directly), and a still-encoded value (decode then parse).
   Parsing raw FIRST avoids corrupting %-sequences that legitimately live inside
   a landing_url string. */
export function readAttrCookie(raw) {
  if (!isFilled(raw)) return {};
  const attempts = [raw];
  try { attempts.push(decodeURIComponent(raw)); } catch { /* malformed % — skip */ }
  for (const s of attempts) {
    try {
      const parsed = JSON.parse(s);
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) return parsed;
    } catch { /* try next form */ }
  }
  return {};
}

/* ATTRIBUTION = last-touch, but AD-STICKY: an organic touch (link-in-bio) never
   overwrites a stored ad utm — only another ad touch does. CONTEXT (referrer /
   landing_url) = first-touch (session entry, set once). Click IDs are pure
   last-touch (a fresh fbclid is always the most recent click). */
export function mergeAttribution(stored, { live, landingUrl, referrer, now }) {
  const attr = { ...stored };
  let changed = false;
  if (!isFilled(attr.landing_url) && isFilled(landingUrl)) {
    attr.landing_url = landingUrl;
    attr.referrer = isFilled(referrer) ? referrer : '';
    changed = true;
  }
  if (live && (hasUtm(live) || isFilled(live.fbclid) || isFilled(live.gclid))) {
    let touched = false;
    if (hasUtm(live)) {
      // Overwrite the utm only if the incoming touch is ad-grade, OR nothing
      // ad-grade is stored yet. This stops a bio-link tap from wiping the ad.
      if (isAdUtm(live) || !isAdUtm(attr)) {
        attr.source = live.source || ''; attr.medium = live.medium || '';
        attr.campaign = live.campaign || ''; attr.content = live.content || ''; attr.term = live.term || '';
        touched = true;
      }
    }
    if (isFilled(live.fbclid)) { attr.fbclid = live.fbclid; touched = true; }
    if (isFilled(live.gclid)) { attr.gclid = live.gclid; touched = true; }
    if (touched) { attr.ts = now; changed = true; }
  }
  return { attr, changed };
}

/* Resolve the final attribution set from every source, in precedence order. */
export function resolveAttribution({
  cookieAttr = {}, bodyAttr = {}, referrer = '', landingUrl = '', fbc = '', now = Date.now(),
} = {}) {
  /* ── UTM selection — QUALITY-AWARE (the link-in-bio fix) ───────────────────
     The landing_url and referrer are the authoritative record of the session's
     real entry, so they lead the precedence. Prefer an AD-grade utm from ANY
     source — landing_url → referrer → cookie → body — so an organic "link_in_bio"
     sitting in the cookie (a later bio-link tap that last-touch stored) can never
     beat the real ad utm present in the landing_url/referrer. Only if NO source
     carries an ad-grade utm do we keep an organic one. */
  const candidates = [
    { label: 'landing', utm: utmSetOf(parseAttributionFromUrl(landingUrl)) },
    { label: 'referrer', utm: utmSetOf(parseAttributionFromUrl(referrer)) },
    { label: 'cookie', utm: utmSetOf(cookieAttr) },
    { label: 'body', utm: utmSetOf(bodyAttr) },
  ];
  let chosen = candidates.find((c) => isAdUtm(c.utm));      // any ad-grade source wins
  let utmQuality = 'ad';
  if (!chosen) {                                            // else best-filled source
    chosen = candidates.find((c) => hasUtm(c.utm));
    utmQuality = chosen ? (isOrganicUtm(chosen.utm) ? 'organic' : 'other') : 'none';
  }
  const utm = chosen ? { ...chosen.utm } : utmSetOf({});
  const utmSource = chosen ? chosen.label : 'none';

  // L4 — fbclid + click ts: cookie → body → derived from _fbc (never referrer).
  let fbclid = '', fbclidTs = 0, clidSource = 'none';
  if (isFilled(cookieAttr.fbclid))    { fbclid = cookieAttr.fbclid; clidSource = 'cookie'; fbclidTs = Number(cookieAttr.ts) || 0; }
  else if (isFilled(bodyAttr.fbclid)) { fbclid = bodyAttr.fbclid;   clidSource = 'body';   fbclidTs = Number(bodyAttr.ts) || 0; }
  else {
    const f = parseFbc(fbc);
    if (isFilled(f.fbclid)) { fbclid = f.fbclid; clidSource = 'fbc'; fbclidTs = f.ts || 0; }
  }
  if (!fbclidTs) fbclidTs = Number(cookieAttr.ts) || Number(bodyAttr.ts) || 0;

  return {
    utm, fbclid, fbclidTs: fbclidTs || now,
    gclid: [cookieAttr.gclid, bodyAttr.gclid].find(isFilled) || '',
    referrer: [referrer, cookieAttr.referrer, bodyAttr.referrer].find(isFilled) || '',
    landingUrl: [landingUrl, cookieAttr.landing_url, bodyAttr.landing_url].find(isFilled) || '',
    provenance: `utm:${utmSource}/${utmQuality}|clid:${clidSource}`,
    utmSource, utmQuality, clidSource,
  };
}

/* L5 — pack an object as JSON GUARANTEED to fit `max`, by shortening the LONGEST
   value until it fits. Never use truncate(JSON.stringify(obj), 256): that slices
   mid-JSON, the parse throws, and EVERY field is lost — not one clipped. */
export function packJsonNote(obj, max = 256) {
  const w = {};
  for (const [k, v] of Object.entries(obj)) w[k] = typeof v === 'string' ? v : String(v ?? '');
  let json = JSON.stringify(w);
  let guard = 0;
  while (json.length > max && guard < 200) {
    guard += 1;
    let key = null, len = 0;
    for (const [k, v] of Object.entries(w)) if (v.length > len) { len = v.length; key = k; }
    if (!key || len === 0) break;
    const cut = Math.max(1, Math.min(len, json.length - max));
    w[key] = w[key].slice(0, len - cut);
    json = JSON.stringify(w);
  }
  return json.length > max ? '{}' : json;
}
