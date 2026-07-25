import { Ico } from '@/components/Icons';
import Price from '@/components/Price';
import UtilityFooter from '@/components/UtilityFooter';
import CheckoutForm from './CheckoutForm';

export const metadata = {
  title: 'Secure Checkout · Reset by Shruti Solanki',
  robots: { index: false, follow: false },
};

/* ============================================================================
   PAGE 2 · CHECKOUT
   STRUCTURE SOURCE: _reference/teamfitarjun/app/checkout/ — CheckoutView.tsx
   + checkout.css, cross-checked against the rendered capture in
   _reference/captures/arj-co.txt.

   ARJ's element order, which this reproduces exactly:
     .co-trust-bar (itm · sep) → .co-body → .co-grid → .co-form → .co-summary
     → .co-sticky

   ⚠ WHAT ARJ'S SOURCE CONTAINS BUT ITS LIVE PAGE DOES NOT — and so neither
   does this: a `.co-hero` (badge + H1 + instruction) and a `.co-expect`
   three-column "what to expect" block. Both are dead CSS in checkout.css;
   arj-co.txt starts at "SECURE CHECKOUT / Your Details". A checkout that
   opens on a headline is a checkout that asks the buyer to read again after
   she has already decided. We keep the H1 for assistive tech only.

   ABSENCE LIST, deliberate and matched: no nav · no VSL · no testimonials ·
   no countdown · no long copy · no payment-plan options · no coupon control.

   NOTE ON ORDER: on desktop the summary is a sticky right rail; ≤900px the
   grid becomes a flex column and `.co-summary { order: -1 }` lifts it above
   the form — "what am I paying and how much" before a field is touched.
   ========================================================================== */
export default function CheckoutPage() {
  return (
    <div className="co-page">
      {/* ── SECTION 01 · trust bar ─────────────────────────────────────── */}
      <div className="co-trust-bar">
        <div className="co-wrap">
          <span className="itm"><Ico id="lock" className="ico" /> Secure Checkout</span>
          <span className="sep" />
          <span className="itm"><Ico id="shield" className="ico" /> Privacy Protected</span>
          <span className="sep" />
          <span className="itm"><Ico id="check" className="ico" /> Razorpay Verified · 256-bit SSL</span>
        </div>
      </div>

      {/* ── SECTION 03 · checkout grid ─────────────────────────────────── */}
      <section className="co-body">
        <div className="co-wrap">
          <h1 className="sr-only">Complete your booking</h1>

          <CheckoutForm />

          <p className="co-legal">
            By completing this booking you agree to our Terms, Privacy Policy &amp; Refund Policy.
            We never share your details. Your call slot is confirmed only after payment.
          </p>

          <div className="co-foot">
            <UtilityFooter />
          </div>
        </div>
      </section>
    </div>
  );
}
