/* ============================================================================
   SECTION 08 · Guarantee
   ----------------------------------------------------------------------------
   OWNED BY: session 8. Styles live in app/sections/s08-*.css.
   Reference: teamfitarjun.com "100% Results Guarantee" + the dark money-back
   reference — badge → eyebrow → H2 (plain "100%" + accent phrase) → one-line
   lede with the metric emphasised → "What We Ask In Return" card with a bold
   lead per item, and the refundable-fee note as the last line.

   Copy is the client's own (project file): a 100% money-back guarantee tied to
   a 4-10 kg result over the 90-day programme.
   ========================================================================== */

export default function S08Guarantee() {
  return (
    <>
<section className="section guar" id="promise">
  <div className="wrap">
   {/* Contrasting dark, outlined "stage" card (à la sciencedrivenperformance.in)
       so the guarantee lifts off the light page and reads as the payload. */}
   <div className="guar-box reveal">

    {/* 76px disc, 3D bevel, pulsing halo. Shield-with-tick. */}
    <div className="guar-badge reveal" aria-hidden="true">
      <span className="guar-ring" />
      <svg viewBox="0 0 24 24">
        <path d="M12 2.4l7.6 2.9v6.4c0 4.7-3.2 8.8-7.6 9.6-4.4-.8-7.6-4.9-7.6-9.6V5.3L12 2.4z" />
        <path d="M8.7 12.2l2.3 2.3 4.3-4.5" className="tick" />
      </svg>
    </div>

    <p className="guar-eyebrow reveal" data-d="1">The Risk Is Ours. Not Yours.</p>

    <h2 className="guar-h2 reveal" data-d="1">
      100% <em>Money-Back Guarantee.</em>
    </h2>

    <div className="guar-lede reveal" data-d="2">
      <p>
        If you don’t lose between <strong>4-10 kilos</strong> within your{' '}
        <strong>90-day programme</strong>, we’ll refund every rupee you paid us.
      </p>
    </div>

    <div className="guar-card reveal" data-d="3">
      <h4>What We Ask In Return</h4>
      <ul>
        <li>
          <span className="guar-tick" aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5" /></svg>
          </span>
          <span>
            <strong>You complete the programme.</strong> Meal plans followed. Weekly check-ins
            attended. Progress updates, meal logs and requested photos shared on schedule.
          </span>
        </li>
        <li>
          <span className="guar-tick" aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5" /></svg>
          </span>
          <span>
            <strong>Your starting BMI is above 25.</strong> If you’re already close to a healthy
            weight for your height, losing 5-10 kilos may not be physiologically appropriate. In
            that case, we’ll agree on a personalised transformation goal with you during your
            consultation before you enrol.
          </span>
        </li>
        <li>
          <span className="guar-tick" aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5" /></svg>
          </span>
          <span>
            <strong>The 90 days run from your programme start date.</strong>
          </span>
        </li>
      </ul>
    </div>

   </div>
  </div>
</section>

    </>
  );
}
