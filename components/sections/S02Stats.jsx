/* ============================================================================
   SECTION 02 · Stat band  →  ARJ credibility strip
   ----------------------------------------------------------------------------
   OWNED BY: session 2. Styles live in app/sections/s02-*.css.
   Structural replica of ARJ LandingView.tsx:504-522 — <section .af-creds>
   → .af-wrap → .af-creds-grid[data-af-reveal] → 4 × .af-cred-item, each
   three lines: .af-cred-num / .af-cred-label / .af-cred-sub.
   ARJ reveals the GRID as one unit (no per-card stagger) — matched.
   ========================================================================== */
import { Gap } from '@/components/Price';
import { STATS } from '@/lib/content';

export default function S02Stats() {
  return (
    <>
{/* ═══ CREDIBILITY STRIP ×4 — three-line cards (VALUE / LABEL / SUB), with the
    entry price in the fourth. Both references frame the price as a stat
    sitting inside the credibility row, not as a cost. ═══ */}
<section className="creds">
  <div className="wrap">
    <div className="creds-grid reveal">
      {STATS.map((s) => (
        <div className="cred-item" key={s.label}>
          <div className="cred-num">
            {s.count
              ? <span data-count={s.count} data-suffix={s.suffix || ''}>{s.value}</span>
              : s.value}
          </div>
          <div className="cred-label">{s.label}</div>
          <div className="cred-sub">{s.sub || <Gap>{s.subGap}</Gap>}</div>
        </div>
      ))}
    </div>
  </div>
</section>

    </>
  );
}
