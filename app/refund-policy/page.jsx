import LegalPage from '@/components/LegalPage';
import { CONFIG } from '@/lib/config';

export const metadata = {
  title: 'Refund & Cancellation Policy · Reset by Shruti Solanki',
  description:
    'Refund and cancellation terms for the ₹97 diagnosis call and the 12-week Reset programme.',
  alternates: { canonical: '/refund-policy' },
};

/* ============================================================================
   REFUND & CANCELLATION POLICY

   Modelled on thefoodfreedomco.com/refund and teamfitarjun.com/refund-policy:
   short, plain, contact by email + phone, a stated processing window.

   The ₹97-refundable / programme-non-refundable split is taken directly from
   the client's own terms. Both reference funnels state the programme is
   non-refundable on their refund page, so doing the same here is consistent
   with the references and is what Razorpay's review expects to see.
   ========================================================================== */
export default function RefundPolicyPage() {
  const mail = CONFIG.SUPPORT_EMAIL;
  const contact = (
    <>
      {mail && <>email <a href={`mailto:${mail}`}>{mail}</a></>}
      {mail && CONFIG.WHATSAPP_DISPLAY && <> or </>}
      {CONFIG.WHATSAPP_DISPLAY && <>WhatsApp us at {CONFIG.WHATSAPP_DISPLAY}</>}
    </>
  );

  return (
    <LegalPage kicker="Policy" title="Refund & Cancellation Policy">
      <p>
        This policy explains when money is returned, how to ask for it, and how long it takes. Two
        separate things are sold, and they have different terms.
      </p>

      <h2>1. The ₹{CONFIG.ENTRY_PRICE} booking fee — fully refundable</h2>
      <p>Your ₹{CONFIG.ENTRY_PRICE} is returned in full in any of these situations:</p>
      <ul>
        <li>
          <strong>The call does not take place</strong> — for any reason, on either side, whether
          we cancel, there is a technical failure, or you are unable to attend.
        </li>
        <li>
          <strong>You attend the full call and feel it was not worth your time.</strong> You do not
          have to explain or justify it — just tell us.
        </li>
        <li>
          <strong>We decide Reset is not right for you.</strong> If Shruti concludes on the call
          that she cannot help you, we refund you without being asked.
        </li>
      </ul>
      <p>
        To request a refund, {contact}, from the same email or phone number you used at checkout.
        One line is enough. Refunds are made to your original payment method through Razorpay
        within <strong>5–7 business days</strong> of approval; your bank may take a few additional
        days to show it.
      </p>

      <h2>2. Cancelling or rescheduling your call</h2>
      <p>
        You can cancel your call at any time before it starts and receive a full refund of the
        ₹{CONFIG.ENTRY_PRICE}, using the link in your booking confirmation email. Rescheduling is
        available for genuine emergencies — the slot is held for you rather than resold, so please
        keep it if you reasonably can. To cancel or reschedule, contact us using the details below.
      </p>

      <h2>3. The {CONFIG.PROGRAMME_WEEKS}-week Reset programme</h2>
      <p>
        The programme is a separate purchase, agreed on the call and not paid for through this
        website. <strong>Once you enrol, the programme fee is non-refundable, in full or in part,
        at any stage.</strong> This is because your plan is built individually — your intake is
        reviewed and a plan is written specifically for you — and coaching capacity is reserved for
        the full term. You are told this clearly on the call before you enrol, so you can make an
        unpressured decision.
      </p>
      <p>
        Our promise that you will feel lighter within the first fourteen days describes what the
        first phase does. It is not a money-back guarantee and does not create a right to a refund
        of programme fees. PCOS and thyroid conditions are managed, not cured, and no specific
        weight, measurement or blood-marker result is promised.
      </p>

      <h2>4. If we cancel</h2>
      <p>
        If we cancel your call and cannot offer you a replacement slot you are happy with, you
        receive a full refund. If we are unable to continue an enrolled programme for reasons on
        our side, we refund the unused portion of your fee, calculated pro-rata by week.
      </p>

      <h2>5. Delayed refunds</h2>
      <p>
        If an approved refund has not reached you within 7–10 days, please check with your bank or
        card issuer first, then contact us and we will chase it with Razorpay.
      </p>

      <h2>6. Contact us</h2>
      <p>For anything about a refund or cancellation, {contact}. We aim to reply within 2 business days.</p>
    </LegalPage>
  );
}
