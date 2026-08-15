import { CONFIG } from '@/lib/config';

/* ============================================================================
   HOST GATE (F8) — never fire real Meta/Pabbly events from a non-canonical host
   ----------------------------------------------------------------------------
   A Vercel preview or localhost that happens to have TRACKING_ENABLED=true would
   otherwise pump test events into the live dataset. This gates every event-firing
   route on the request's Host matching CONFIG.CANONICAL_HOST.

   Fail-open when CANONICAL_HOST is unset (nothing to compare against) so a
   missing env var can never silently kill tracking in production.
   ========================================================================== */
export function hostAllowed(req) {
  const canon = CONFIG.CANONICAL_HOST;
  if (!canon) return true;                              // not configured → don't gate
  let canonHost;
  try { canonHost = new URL(canon).host; } catch { canonHost = String(canon).replace(/^https?:\/\//, '').replace(/\/.*$/, ''); }
  if (!canonHost) return true;
  const reqHost = (req.headers.get('host') || '').toLowerCase();
  return reqHost === canonHost.toLowerCase();
}
