import LegalPage from '@/components/LegalPage';
import { CONFIG } from '@/lib/config';

export const metadata = {
  title: 'Refund Policy · Reset by Shruti Solanki',
  description:
    'The Reset by Shruti Solanki 90-day programme is backed by a 100% Money-Back Guarantee when the personalised plan is followed consistently.',
  alternates: { canonical: '/refund-policy' },
};

/* ============================================================================
   REFUND POLICY

   Body content is the client's own approved copy (Shruti Project File),
   reproduced verbatim. The email is read from CONFIG (C16) rather than inlined;
   it already resolves to the address stated in the copy.
   ========================================================================== */
export default function RefundPolicyPage() {
  const mail = CONFIG.SUPPORT_EMAIL;

  return (
    <LegalPage kicker="Policy" title="Refund Policy">
      <p>
        At <strong>Reset by Shruti Solanki</strong>, our goal is to help you achieve sustainable
        weight loss by addressing the root causes behind your health challenges, not by offering
        quick fixes.
      </p>
      <p>
        We stand behind our programme with a <strong>100% Money-Back Guarantee</strong>, because we
        are confident in our process when it is followed consistently.
      </p>

      <h2>1. The ₹{CONFIG.ENTRY_PRICE} Booking Fee</h2>
      <p>
        The ₹{CONFIG.ENTRY_PRICE} you pay on this website is a one-time booking fee for your initial
        1:1 diagnostic call with Shruti. Because it secures and pays for that consultation, it is{' '}
        <strong>non-refundable</strong>. It is separate from the 90-day programme, which is enrolled
        into only after the call and carries its own Money-Back Guarantee, set out below.
      </p>

      <h2>2. 90-Day Money-Back Guarantee</h2>
      <p>
        If you enrol into <em>RESET by Shruti Solanki</em> 90-day programme and:
      </p>
      <ul>
        <li>Complete the full 90-day programme,</li>
        <li>Follow your personalised plan as instructed,</li>
        <li>Meet all programme participation requirements, and</li>
        <li>Do not lose between <strong>4-10 kilograms</strong> during the programme,</li>
      </ul>
      <p>
        we will refund <strong>100% of your programme investment.</strong>
      </p>

      <h2>3. Eligibility Requirements</h2>
      <p>To qualify for the Money-Back Guarantee, you must:</p>
      <ul>
        <li>Follow your personalised nutrition plan throughout the programme.</li>
        <li>Attend all scheduled weekly check-ins.</li>
        <li>Submit your meal logs, progress updates and requested progress photos on time.</li>
        <li>Follow the recommendations provided by your coach.</li>
        <li>Complete the full 90-day programme from your official start date.</li>
      </ul>
      <p>
        The guarantee is intended for clients who actively participate in the programme. If the
        agreed plan is not followed consistently, the guarantee will not apply.
      </p>

      <h2>4. Healthy BMI Clause</h2>
      <p>
        The 4-10 kg guarantee applies to clients whose <strong>starting BMI is above 25.</strong>
      </p>
      <p>
        If you are already within a healthy BMI range for your height, losing 4-10 kg may not be
        physiologically appropriate. In such cases, a personalised transformation goal will be
        agreed upon during your consultation before you enrol, and that agreed outcome will form
        the basis of the Money-Back Guarantee.
      </p>

      <h2>5. Refund Request Process</h2>
      <p>
        If you believe you are eligible for a refund, please email us within <strong>3 days</strong>{' '}
        of completing your programme at:
      </p>
      <p>
        {mail ? <strong><a href={`mailto:${mail}`}>{mail}</a></strong> : <strong>shrutisouls18@gmail.com</strong>}
      </p>
      <p>
        Your request will be reviewed along with your programme records to confirm that all
        eligibility requirements have been met.
      </p>
      <p>
        Once approved, refunds will be processed within <strong>7-14 business days</strong> using
        the original payment method wherever possible.
      </p>

      <h2>6. Situations Where the Guarantee Does Not Apply</h2>
      <p>The Money-Back Guarantee does not apply if:</p>
      <ul>
        <li>Weekly check-ins were missed.</li>
        <li>Meal logs, progress updates or requested photos were not submitted consistently.</li>
        <li>The personalised nutrition plan was not followed.</li>
        <li>The programme was discontinued before completion.</li>
        <li>Required information requested by the coaching team was not provided.</li>
        <li>The refund request is made after the 3-day refund request window.</li>
      </ul>

      {/* Client-supplied clause. Carried in .legal-note (the same callout the
          Terms page uses for the medical disclaimer) because a visitor who
          skims the bullet list above must not miss it: pausing is common and
          the consequence is total. */}
      <div className="legal-note">
        <p>
          If any pauses are taken in plan (I have clients who pause plan for a week or so if they
          are travelling, visiting home, etc.), <strong>no refund would be given.</strong>
        </p>
      </div>

      <h2>7. Our Commitment</h2>
      <p>Reset is built on honesty.</p>
      <p>
        We will never promise miracle cures or unrealistic results. We also believe that when a
        personalised plan is followed consistently, your body responds.
      </p>
      <p>
        That’s why we confidently stand behind our programme with this Money-Back Guarantee.
      </p>
    </LegalPage>
  );
}
