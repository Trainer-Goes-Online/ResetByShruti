import LegalPage from '@/components/LegalPage';
import { Gap } from '@/components/Price';
import { CONFIG } from '@/lib/config';

export const metadata = {
  title: 'Privacy Policy · Reset by Shruti Solanki',
  description:
    'How Reset by Shruti Solanki collects, uses, stores and protects your personal and health information.',
};

/* ============================================================================
   PRIVACY POLICY

   ⚠ DRAFT — REQUIRES LEGAL REVIEW BEFORE YOU RELY ON IT.

   Written against India's Digital Personal Data Protection Act, 2023, which is
   the governing regime here. Two things make this business higher-risk than a
   generic e-commerce merchant, and both are addressed explicitly rather than
   buried:
     1. It processes HEALTH information — blood markers, diagnoses, medication,
        menstrual history. Volunteered on a call and in check-ins.
     2. Its customers are private individuals who chose it BECAUSE it is
        discreet. The privacy posture is part of the product.
   ========================================================================== */
export default function PrivacyPage() {
  const mail = CONFIG.SUPPORT_EMAIL
    ? <a href={`mailto:${CONFIG.SUPPORT_EMAIL}`}>{CONFIG.SUPPORT_EMAIL}</a>
    : <Gap>support email · QB.2</Gap>;

  return (
    <LegalPage kicker="Policy" title="Privacy Policy">
      <p>
        Reset is a health coaching practice. That means we handle information about your body —
        your weight, your blood markers, your medication, your cycle. We treat that as the
        sensitive material it is, and this page explains exactly what happens to it.
      </p>
      <p>
        This policy is written under the <strong>Digital Personal Data Protection Act, 2023</strong>.
        In it, "we" means the business named above and "you" means anyone who visits this
        website, books a call, or joins the programme.
      </p>

      <h2>1. What we collect</h2>

      <h3>When you book a call</h3>
      <ul>
        <li>First and last name</li>
        <li>Email address — this is where your call link is sent</li>
        <li>Phone number, with country code — used for WhatsApp reminders</li>
        <li>Town or city</li>
        <li>Payment confirmation from Razorpay. <strong>We never see or store your card,
          UPI or bank details</strong> — those go directly to Razorpay.</li>
      </ul>

      <h3>Health information you choose to share</h3>
      <p>
        On the call, and during the programme, you may tell us about your diagnoses, blood test
        results, medication and dosages, menstrual cycle, symptoms, weight and measurements,
        sleep, and eating patterns.
      </p>
      <div className="legal-note">
        <p>
          <strong>You decide how much of this to share.</strong> You can decline any question.
          Sharing less may make the coaching less precise, but it will never mean you are
          refused service or treated differently.
        </p>
        <p>
          Health information is used <strong>only</strong> to build and adjust your plan. It is
          never used for advertising, never sold, and never shared with anyone outside the
          coaching team without your explicit, specific permission.
        </p>
      </div>

      <h3>Automatically</h3>
      <ul>
        <li>Standard technical data — IP address, browser, device type, pages viewed.</li>
        <li>
          Advertising and analytics identifiers, if those tools are enabled.{' '}
          <Gap>confirm Meta Pixel / GA — QX.5</Gap>
        </li>
      </ul>

      <h2>2. Why we use it</h2>
      <ul>
        <li>To deliver what you paid for — scheduling and running your call, building your plan.</li>
        <li>To contact you about your booking: confirmations, reminders, prep notes.</li>
        <li>To take payment and issue refunds, through Razorpay.</li>
        <li>To improve the programme, using aggregated patterns rather than individual records.</li>
        <li>To meet legal, tax and accounting obligations.</li>
      </ul>
      <p>
        We do <strong>not</strong> sell your data. We do <strong>not</strong> share your health
        information with advertisers. Ever.
      </p>

      <h2>3. Consent, and taking it back</h2>
      <p>
        We process your information because you gave it to us for a stated purpose. You can
        withdraw consent at any time by emailing {mail}. Withdrawing consent for essential
        processing means we can no longer deliver the service, and we will tell you that
        plainly rather than quietly degrading it.
      </p>

      <h2>4. Who else touches your data</h2>
      <p>We use a small number of third-party services. Each has its own privacy policy.</p>
      <ul>
        <li><strong>Razorpay</strong> — payment processing. Receives your name, email, phone and payment details.</li>
        <li><strong>Calendly</strong> — call scheduling. Receives your name, email and chosen time.</li>
        <li><strong>Video conferencing</strong> — to run the call. <Gap>platform · QB.3</Gap></li>
        <li><strong>WhatsApp (Meta)</strong> — reminders and weekly check-ins, if you opt in.</li>
        <li><strong>Vimeo</strong> — video hosting. Sets cookies if you play a video.</li>
        <li><strong>Notion</strong> — internal progress tracking. Access restricted to the coaching team.</li>
        <li><strong>Hosting and email providers</strong> — to run the website and send confirmations.</li>
      </ul>
      <p>
        We may also disclose information where the law requires it, or to establish or defend a
        legal claim.
      </p>

      <h2>5. Testimonials and photographs</h2>
      <p>
        We publish client results. <strong>Nothing identifying you is ever published without
        your specific, separate, written permission</strong> — not your name, not your
        photographs, not your messages, not your markers.
      </p>
      <p>
        Permission is asked for each use, it is never assumed from having been a client, and you
        can withdraw it later by emailing {mail}. We will remove the material from anything we
        control. Material already printed or cached elsewhere may take longer to disappear, and
        we will tell you honestly what we can and cannot reach.
      </p>

      <h2>6. How long we keep it</h2>
      <ul>
        <li><strong>Booking and contact details</strong> — while you are a client, then up to 3 years.</li>
        <li><strong>Health and progress records</strong> — while you are a client, then up to 3 years, so we can help you properly if you return.</li>
        <li><strong>Payment and invoice records</strong> — 8 years, as Indian tax law requires.</li>
        <li><strong>Marketing contact</strong> — until you unsubscribe.</li>
      </ul>
      <p>You can ask us to delete your data sooner. See section 8.</p>

      <h2>7. Security</h2>
      <p>
        Access is limited to the people who need it to coach you. Payments are handled entirely
        by Razorpay, which is PCI-DSS compliant, and this site is served over HTTPS.
      </p>
      <p>
        No system is perfectly secure, and we will not claim otherwise. If a breach affects your
        personal data, we will notify you and the Data Protection Board as the DPDP Act requires.
      </p>

      <h2>8. Your rights</h2>
      <p>Under the DPDP Act, 2023, you have the right to:</p>
      <ul>
        <li>Access a copy of the personal data we hold about you</li>
        <li>Have inaccurate or incomplete data corrected</li>
        <li>Have your data erased, where we are not legally required to keep it</li>
        <li>Withdraw consent</li>
        <li>Nominate someone to exercise these rights if you die or become incapacitated</li>
        <li>Raise a grievance, and escalate it to the Data Protection Board of India</li>
      </ul>
      <p>
        To exercise any of these, email {mail}. We respond within 30 days and will not charge you
        for it.
      </p>

      <h2>9. Cookies</h2>
      <p>
        This site uses cookies that are necessary for it to work, and — if enabled — analytics
        and advertising cookies that help us understand which content brings the right people
        here. You can block cookies in your browser; the site will still work, though the
        booking flow may not remember you.{' '}
        <Gap>confirm which analytics/ad tools are live · QX.5</Gap>
      </p>

      <h2>10. Children</h2>
      <p>
        This service is for adults aged 18 and over. We do not knowingly collect data from
        children. If you believe a child has given us information, email {mail} and we will
        delete it.
      </p>

      <h2>11. Grievance officer</h2>
      <p>
        In accordance with the DPDP Act, 2023 and the Information Technology Act, 2000:
      </p>
      <ul>
        <li><strong>Name:</strong> {CONFIG.GRIEVANCE_OFFICER || <Gap>grievance officer · QL.4</Gap>}</li>
        <li><strong>Email:</strong> {mail}</li>
        <li><strong>Address:</strong> {CONFIG.BUSINESS_ADDRESS || <Gap>registered address · QL.2</Gap>}</li>
      </ul>
      <p>Grievances are acknowledged within 48 hours and resolved within 30 days.</p>

      <h2>12. Changes</h2>
      <p>
        We may update this policy. The version that applies to you is the one published when you
        gave us your data. Material changes are dated at the top of this page and, where the
        change is significant, notified by email.
      </p>
    </LegalPage>
  );
}
