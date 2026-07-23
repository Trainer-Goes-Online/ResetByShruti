/* ============================================================================
   SECTION 08 · Guarantee
   ----------------------------------------------------------------------------
   OWNED BY: session 8. Styles live in app/sections/s08-*.css.
   Reference: teamfitarjun.com — see SESSION-HANDOFF.md for the exact ARJ
   classes this section must match.
   ========================================================================== */
import Price, { Gap } from '@/components/Price';
import { RECIPROCAL } from '@/lib/content';

export default function S08Guarantee() {
  return (
    <>
{/* ═══════════ GUARANTEE / PROMISE ═══════════
    ARJ `.af-money.af-guar` element order, verbatim, with their stagger:
      badge (0) → eyebrow (.02s) → h2 (.04s) → lede (.06s) → card (.1s)
    The badge sits ABOVE the eyebrow — it is the first thing in the section,
    not an ornament inside the card. Card carries "What We Ask In Return" as a
    tick list, and the refundable-fee note is the LAST thing inside the card.

    ⚠ Refund terms are contractual and fixed. The ₹97 booking fee is
    refundable if the call does not happen or she finishes it unsatisfied.
    The 12-week programme is non-refundable and that is NEVER stated. The
    fourteen-day line is a PROMISE, not a money-back guarantee. ═══ */}
<section className="section guar" id="promise">
  <div className="wrap">

    {/* ARJ .af-guar-badge — 76px disc, 3D bevel, with a pulsing .af-guar-ring
        halo. Their shield-with-tick path, verbatim. */}
    <div className="guar-badge reveal" aria-hidden="true">
      <span className="guar-ring" />
      <svg viewBox="0 0 24 24">
        <path d="M12 2.4l7.6 2.9v6.4c0 4.7-3.2 8.8-7.6 9.6-4.4-.8-7.6-4.9-7.6-9.6V5.3L12 2.4z" />
        <path d="M8.7 12.2l2.3 2.3 4.3-4.5" className="tick" />
      </svg>
    </div>

    <p className="guar-eyebrow reveal" data-d="1">The Risk Is Ours. Not Yours.</p>

    <h2 className="guar-h2 reveal" data-d="1">
      Fourteen Days. <em>One Promise.</em> Nothing Else Dressed Up As One.
    </h2>

    {/* ARJ .af-section-lede is a single paragraph. Our approved §18a copy runs
        to two — the promise, then the qualifier that stops it reading as a
        scale claim. Both are kept; the second is the same lede block. */}
    <div className="guar-lede reveal" data-d="2">
      <p>
        In the first fourteen days you will feel lighter — less bloating, less puffiness,
        rings and shoes that stop being tight.
      </p>
      <p>
        That is the promise, and it is the only one Shruti makes, because week one is gut
        and water retention and it behaves predictably. She will not promise you a number
        on the scale in fourteen days. Most of what moves that early is water, and you will
        be told so as it happens.
      </p>
    </div>

    <div className="guar-card reveal" data-d="3">
      <h4>What We Ask In Return</h4>
      <ul>
        {RECIPROCAL.map((r) => (
          <li key={r}>
            {/* ARJ .af-guar-tick — 24px disc, gradient bevel, 3px stroke. */}
            <span className="guar-tick" aria-hidden="true">
              <svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5" /></svg>
            </span>
            <span>{r}</span>
          </li>
        ))}
      </ul>
      <p className="guar-note">
        The <Price /> booking fee is fully refundable if the call does not happen, or if you
        sit through the whole call and it was not worth your time. You do not have to justify
        it. <Gap>refund window · Q18.2</Gap>
      </p>
    </div>

  </div>
</section>

    </>
  );
}
