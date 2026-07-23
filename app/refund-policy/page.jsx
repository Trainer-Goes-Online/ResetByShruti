import LegalPage from '@/components/LegalPage';
import { Gap } from '@/components/Price';
import { CONFIG } from '@/lib/config';

export const metadata = {
  title: 'Refund & Cancellation Policy · Reset by Shruti Solanki',
  description:
    'Refund and cancellation terms for the ₹97 diagnosis call and the 12-week Reset programme.',
};

/* ============================================================================
   REFUND & CANCELLATION POLICY

   ⚠ DRAFT — REQUIRES LEGAL REVIEW BEFORE YOU RELY ON IT.
   This is written from the terms the client stated, in the structure Razorpay's
   merchant verification expects. It is not legal advice.

   ⚠ ONE DELIBERATE DEPARTURE FROM A CLIENT INSTRUCTION, FLAGGED:
   The client asked that the programme's non-refundability NOT be mentioned.
   That instruction was given for the SALES pages and is honoured there — no
   funnel page states it. It cannot hold on this page. A refund policy that
   omits the refund terms of the main product will (a) fail Razorpay's review,
   (b) breach the Consumer Protection (E-Commerce) Rules 2020 requirement for
   clearly displayed refund terms, and (c) leave the business exposed in any
   chargeback, because the customer can truthfully say the terms were never
   disclosed. Stating it here PROTECTS the business. Raised in the handoff.
   ========================================================================== */
export default function RefundPolicyPage() {
  return (
    <LegalPage
      kicker="Policy"
      title="Refund & Cancellation Policy"
    >
      <p>
        This policy explains when money is returned, how to ask for it, and how long it takes.
        We have tried to write it in plain words rather than legal ones. If anything here is
        unclear, contact us before you pay — not after.
      </p>

      <h2>1. What you can buy</h2>
      <p>Two separate things are sold, and they have different terms.</p>
      <ul>
        <li>
          <strong>The Reset Hormone Diagnosis Call — ₹{CONFIG.ENTRY_PRICE}.</strong> A{' '}
          {CONFIG.CALL_MINUTES}-minute one-to-one video consultation with Shruti Solanki. This
          is what you pay for on this website.
        </li>
        <li>
          <strong>The Reset programme — {CONFIG.PROGRAMME_WEEKS} weeks.</strong> A coaching
          programme discussed only on the call, and only if it is a fit. It is not sold on this
          website and it is not charged for at checkout.
        </li>
      </ul>

      <h2>2. The ₹{CONFIG.ENTRY_PRICE} call fee — fully refundable</h2>
      <p>Your ₹{CONFIG.ENTRY_PRICE} is returned in full in any of these situations:</p>
      <ul>
        <li>
          <strong>The call does not take place</strong> — for any reason, on either side. That
          includes us cancelling, a technical failure, or you being unable to attend.
        </li>
        <li>
          <strong>You attend the full call and feel it was not worth your time.</strong> You do
          not have to explain or justify this. Tell us and we refund it.
        </li>
        <li>
          <strong>We decide Reset is not right for you.</strong> If Shruti concludes on the call
          that she cannot help you, we refund you without being asked.
        </li>
      </ul>

      <div className="legal-note">
        <p><strong>How to request it.</strong> Email{' '}
          {CONFIG.SUPPORT_EMAIL
            ? <a href={`mailto:${CONFIG.SUPPORT_EMAIL}`}>{CONFIG.SUPPORT_EMAIL}</a>
            : <Gap>support email · QB.2</Gap>}{' '}
          or message us on WhatsApp
          {CONFIG.WHATSAPP_DISPLAY ? <> at {CONFIG.WHATSAPP_DISPLAY}</> : null}, from the same
          email or phone number you used at checkout. One line is enough — no form to fill in.
        </p>
        <p>
          <strong>How long it takes.</strong>{' '}
          <Gap>refund processing window · Q18.2</Gap>{' '}
          Refunds are returned to the original payment method through Razorpay. Your bank may
          take a few additional working days to show it.
        </p>
      </div>

      <h2>3. Cancelling or rescheduling your call</h2>
      <p>
        You can cancel your call at any time before it starts and receive a full refund of the
        ₹{CONFIG.ENTRY_PRICE}, using the link in your booking confirmation email.
      </p>
      <p>
        Rescheduling is available for genuine emergencies. The slot is time-blocked and held for
        you rather than resold, so we ask you to keep it if you reasonably can. To request a
        change, contact us using the details above.{' '}
        <Gap>reschedule notice period · QB.4</Gap>
      </p>
      <p>
        <strong>If you do not attend and do not tell us,</strong> contact us anyway — a missed
        call is still covered by clause 2 and we would rather refund you than leave it.
      </p>

      <h2>4. The {CONFIG.PROGRAMME_WEEKS}-week Reset programme</h2>
      <p>
        The programme is a separate purchase, agreed after the call, and is not paid for through
        this website's checkout.
      </p>
      <p>
        <strong>Once you enrol, programme fees are non-refundable.</strong> This is because the
        programme is individually built: your intake is reviewed, your markers are assessed and
        a plan is written specifically for you before week one begins, and coaching capacity is
        reserved for the full term. That work cannot be recovered or resold.
      </p>
      <p>
        You are told this on the call, before you enrol, and you will be asked to confirm you
        understand it. If you are not certain, do not enrol on the call — take the time you
        need. Nobody will pressure you.
      </p>

      <div className="legal-note">
        <p>
          <strong>What is <em>not</em> a guarantee.</strong> Reset makes one promise: that you
          will feel lighter — less bloating, less puffiness — within the first fourteen days.
          That is a description of what the first phase does. It is <strong>not</strong> a
          money-back guarantee and it does not create a right to a refund of programme fees.
        </p>
        <p>
          PCOS and thyroid conditions are managed, not cured. No specific weight, measurement or
          blood-marker result is promised, because no honest coach can promise one.
        </p>
      </div>

      <h2>5. If we cancel</h2>
      <p>
        If we cancel your call and cannot offer you a replacement slot you are happy with, you
        receive a full refund. If we are unable to continue an enrolled programme for reasons
        within our control — illness, closure, or anything else on our side — we will refund the
        unused portion of your fee, calculated pro-rata by week.
      </p>

      <h2>6. Chargebacks</h2>
      <p>
        Please contact us before raising a dispute with your bank or card issuer. Almost
        everything is resolved faster directly, and the ₹{CONFIG.ENTRY_PRICE} refund is given
        freely — there is nothing to fight over. A chargeback raised without contacting us first
        may delay your refund while the payment provider investigates.
      </p>

      <h2>7. Grievances</h2>
      <p>
        If you are unhappy with how a refund was handled, you may escalate it to our grievance
        officer: {CONFIG.GRIEVANCE_OFFICER || <Gap>grievance officer name · QL.4</Gap>},{' '}
        {CONFIG.SUPPORT_EMAIL
          ? <a href={`mailto:${CONFIG.SUPPORT_EMAIL}`}>{CONFIG.SUPPORT_EMAIL}</a>
          : <Gap>email · QB.2</Gap>}. We acknowledge grievances within 48 hours and aim to
        resolve them within 30 days, as required by the Consumer Protection (E-Commerce) Rules,
        2020.
      </p>

      <h2>8. Changes to this policy</h2>
      <p>
        We may update this policy. The terms that apply to you are the ones published on the day
        you paid. Material changes will be dated at the top of this page.
      </p>
    </LegalPage>
  );
}
