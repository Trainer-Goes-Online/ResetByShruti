import LegalPage from '@/components/LegalPage';
import { Gap } from '@/components/Price';
import { CONFIG } from '@/lib/config';

export const metadata = {
  title: 'Terms & Conditions · Reset by Shruti Solanki',
  description:
    'The terms on which Reset by Shruti Solanki provides nutrition and lifestyle coaching.',
};

/* ============================================================================
   TERMS & CONDITIONS

   ⚠ DRAFT — REQUIRES LEGAL REVIEW BEFORE YOU RELY ON IT.

   The load-bearing clause here is §4: this is nutrition and lifestyle coaching,
   NOT medical treatment. The business discusses TSH, HbA1c and medication doses
   with clients. Without an explicit scope-of-practice clause, that is the kind
   of thing that gets characterised as practising medicine. Section 4 is not
   boilerplate — it is the clause that protects the practice, and it should be
   the first thing the reviewing lawyer reads.
   ========================================================================== */
export default function TermsPage() {
  const mail = CONFIG.SUPPORT_EMAIL
    ? <a href={`mailto:${CONFIG.SUPPORT_EMAIL}`}>{CONFIG.SUPPORT_EMAIL}</a>
    : <Gap>support email · QB.2</Gap>;

  return (
    <LegalPage kicker="Policy" title="Terms & Conditions">
      <p>
        These terms govern your use of this website and any coaching you buy through it. By
        booking a call or enrolling in the programme, you agree to them. Please read section 4
        carefully — it explains what this service is and, just as importantly, what it is not.
      </p>

      <h2>1. Who we are</h2>
      <p>
        This website is operated by {CONFIG.LEGAL_ENTITY || <Gap>registered entity · QL.1</Gap>},
        trading as <strong>Reset by Shruti Solanki</strong>, at{' '}
        {CONFIG.BUSINESS_ADDRESS || <Gap>registered address · QL.2</Gap>}.
      </p>

      <h2>2. Who can use this service</h2>
      <ul>
        <li>You must be 18 or over.</li>
        <li>You must be legally able to enter a contract.</li>
        <li>The information you give us must be accurate and your own.</li>
      </ul>
      <p>
        Coaching is offered to women managing PCOS, thyroid conditions and insulin resistance.
        We may decline to work with anyone where we believe coaching is not appropriate — and
        if we do, we refund you.
      </p>

      <h2>3. What you are buying</h2>
      <h3>The diagnosis call — ₹{CONFIG.ENTRY_PRICE}</h3>
      <p>
        A {CONFIG.CALL_MINUTES}-minute one-to-one video consultation with Shruti Solanki. It is a
        diagnostic conversation, not a sales call. If the programme is a fit, it is explained at
        the end. If it is not, you are told so directly.
      </p>
      <h3>The Reset programme — {CONFIG.PROGRAMME_WEEKS} weeks</h3>
      <p>
        Individually built nutrition and lifestyle coaching, including weekly plans, condition-
        specific protocols, optional at-home workouts, weekly check-ins and progress tracking.
        The programme is agreed separately after the call and is not sold on this website.
      </p>

      <h2>4. What this service is — and is not</h2>
      <div className="legal-note">
        <p>
          <strong>Reset provides nutrition and lifestyle coaching. It is not medical
          treatment, diagnosis or prescription, and Shruti Solanki is not acting as your
          doctor.</strong>
        </p>
        <p>
          We may discuss blood markers such as TSH and HbA1c in order to build your plan around
          them. Doing so is not a diagnosis and does not replace medical care.
        </p>
        <p>
          <strong>Never start, stop or change any medication because of anything said in this
          programme.</strong> Medication is between you and your doctor. Please keep your
          treating clinician informed that you are working with a coach, and consult them
          before making changes to diet or exercise, particularly if you are pregnant, trying to
          conceive, breastfeeding, diabetic, or managing any other condition.
        </p>
        <p>
          PCOS and thyroid conditions are <strong>managed, not cured.</strong> Anyone who tells
          you otherwise is selling you something.
        </p>
      </div>

      <h2>5. Results</h2>
      <p>
        Results depend on your body, your history, your consistency and factors outside anyone's
        control. Testimonials on this site describe what specific individuals achieved. They are
        not a prediction of what you will achieve, and they are not typical or guaranteed.
      </p>
      <p>
        We make one promise: that you will feel lighter — less bloating, less puffiness — within
        the first fourteen days. That describes what the first phase does. No specific weight,
        measurement or blood-marker outcome is promised at any point.
      </p>

      <h2>6. Payment</h2>
      <ul>
        <li>Payments are processed by <strong>Razorpay</strong>. We never see your card or bank details.</li>
        <li>Prices are in Indian Rupees and include applicable taxes unless stated otherwise.</li>
        <li>Your call slot is confirmed only once payment succeeds.</li>
        <li>Programme fees, schedule and instalments are agreed in writing before you enrol.</li>
      </ul>
      <p>
        Refunds are governed by our <a href="/refund-policy">Refund &amp; Cancellation Policy</a>,
        which forms part of these terms.
      </p>

      <h2>7. What we ask of you</h2>
      <ul>
        <li>Give accurate information about your health. The plan is only as good as what you tell us.</li>
        <li>Tell us about diagnoses, medication and symptoms that could affect your plan, and tell us if they change.</li>
        <li>Attend your call on time, and let us know if you cannot.</li>
        <li>Use the material for yourself only.</li>
      </ul>

      <h2>8. Your plan belongs to you. The system does not.</h2>
      <p>
        All programme content — frameworks, protocols, templates, workout videos and written
        material — remains our intellectual property. You get a personal, non-transferable
        licence to use it for yourself for as long as you are a client.
      </p>
      <p>
        Please do not share, resell, republish or teach it. Your own plan, your own data and your
        own results are yours.
      </p>

      <h2>9. Ending the arrangement</h2>
      <p>
        You may stop at any time. Refund entitlement is set out in the Refund Policy.
      </p>
      <p>
        We may end coaching if information you gave was materially false, if the material is
        shared or resold, or if a coach is treated abusively. Where we end it for reasons that
        are not your fault, we refund the unused portion pro-rata.
      </p>

      <h2>10. Limitation of liability</h2>
      <p>
        To the fullest extent permitted by law, our total liability arising out of these terms is
        limited to the amount you actually paid us in the twelve months before the claim.
      </p>
      <p>
        We are not liable for indirect or consequential loss. <strong>Nothing in these terms
        limits liability for death or personal injury caused by negligence, for fraud, or for
        anything else that cannot lawfully be limited.</strong>
      </p>

      <h2>11. Third-party services</h2>
      <p>
        This site relies on services we do not control — Razorpay, Calendly, Vimeo, WhatsApp and
        our hosting provider. If one of them is unavailable, we will find you another route
        rather than leaving you stuck, but we are not responsible for their own failures.
      </p>

      <h2>12. Privacy</h2>
      <p>
        How we handle your information, including health information, is set out in our{' '}
        <a href="/privacy">Privacy Policy</a>, which forms part of these terms.
      </p>

      <h2>13. Grievances</h2>
      <p>
        Complaints go to {CONFIG.GRIEVANCE_OFFICER || <Gap>grievance officer · QL.4</Gap>} at{' '}
        {mail}. We acknowledge within 48 hours and aim to resolve within 30 days, as required by
        the Consumer Protection (E-Commerce) Rules, 2020.
      </p>

      <h2>14. Governing law</h2>
      <p>
        These terms are governed by the laws of India. The courts at{' '}
        {CONFIG.JURISDICTION || <Gap>jurisdiction city · QL.5</Gap>} have exclusive
        jurisdiction. We would much rather resolve things by talking first.
      </p>

      <h2>15. Changes</h2>
      <p>
        We may update these terms. The version that applies to you is the one published on the
        day you paid. Material changes are dated at the top of this page.
      </p>
    </LegalPage>
  );
}
