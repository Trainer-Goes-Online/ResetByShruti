/* ============================================================================
   SECTION 03 · This Is For You If
   ----------------------------------------------------------------------------
   OWNED BY: session 3. Styles live in app/sections/s03-*.css.
   Reference: teamfitarjun.com — see SESSION-HANDOFF.md for the exact ARJ
   classes this section must match.

   STRUCTURAL REPLICA of ARJ LandingView.tsx:524-553 — <section .af-two .af-foryou>
     .af-eyebrow          → .eyebrow            (data-af-reveal, no delay)
     h2 + .af-accent .af-underline → h2 + em.u-word   (--d .04s → data-d="1")
     ul.af-foryou-list    → ul.foryou-list      (--d .08s → data-d="1")
       li > span.af-foryou-tick + p > strong
     CtaBlock .af-two-cta, marginTop 40

   ARJ carries ONE reveal on the whole <ul> (not a per-item stagger) — the list
   fades in as a block. Matched verbatim; see the report note.
   ========================================================================== */
import CtaBlock from '@/components/CtaBlock';
import { FIT_CARDS } from '@/lib/content';

export default function S03FitCards() {
  return (
    <>
{/* ═══ THIS IS FOR YOU IF ×5 — cards with a circled tick and one
    paragraph carrying a bolded clause whose position moves card to
    card. Exactly five in both references. ═══ */}
<section className="section foryou">
  <div className="wrap">
    <div className="section-head">
      <span className="eyebrow reveal">For working women with PCOS, thyroid &amp; insulin resistance</span>
      <h2 className="reveal" data-d="1">This Is For You <em className="u-word">If</em></h2>
    </div>

    <ul className="foryou-list reveal" data-d="1">
      {FIT_CARDS.map((parts, i) => (
        <li key={i}>
          {/* ARJ .af-foryou-tick — inline 24-box path, not the shared <use>
              sprite: ARJ strokes at 2.6 and a <use> clone can't inherit
              stroke-width. Same geometry as theirs. */}
          <span className="foryou-tick" aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5" /></svg>
          </span>
          <p>
            {parts.map((p, j) => (p.b ? <strong key={j}>{p.t}</strong> : <span key={j}>{p.t}</span>))}
          </p>
        </li>
      ))}
    </ul>

    <CtaBlock style={{ marginTop: 40 }} />
  </div>
</section>

    </>
  );
}
