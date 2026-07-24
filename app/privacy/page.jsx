import LegalPage from '@/components/LegalPage';
import { CONFIG } from '@/lib/config';

export const metadata = {
  title: 'Privacy Policy · Reset by Shruti Solanki',
  description:
    'How Reset by Shruti Solanki collects, uses and protects your personal and health information.',
};

/* ============================================================================
   PRIVACY POLICY

   Modelled on the two reference funnels (teamfitarjun.com/privacy-policy and
   thefoodfreedomco.com/privacy): short, plain-language, contact by email +
   phone only. No registered entity, address or grievance officer is printed —
   the references print none, and Razorpay verifies the merchant from the
   account KYC, not from text on this page.

   One thing the generic reference does not have and this business does: it
   handles HEALTH information. That is called out plainly (§3) because it is
   both the honest thing to do and the reassuring thing to do.
   ========================================================================== */
export default function PrivacyPage() {
  const mail = CONFIG.SUPPORT_EMAIL;

  return (
    <LegalPage kicker="Policy" title="Privacy Policy">
      <p>
        Reset by Shruti Solanki ("we", "us") respects your privacy. This policy explains what we
        collect, why, and how we look after it. Because this is a health coaching practice, some
        of what you share is about your body — we treat that as the sensitive information it is.
      </p>

      <h2>1. Information we collect</h2>
      <ul>
        <li>Your name, email address and phone number, when you book a call.</li>
        <li>Your town or city.</li>
        <li>
          What you choose to tell us about your health, lifestyle and goals — such as your
          diagnoses, symptoms, cycle, medication, weight and eating patterns.
        </li>
        <li>
          Payment confirmation from Razorpay. We never see or store your card, UPI or bank
          details — those go directly to Razorpay.
        </li>
        <li>Basic technical data — IP address, browser and device type — collected automatically.</li>
      </ul>

      <h2>2. How we use it</h2>
      <ul>
        <li>To schedule and run your call, and to build and adjust your plan.</li>
        <li>To contact you about your booking — confirmations, reminders and prep notes.</li>
        <li>To take payment and issue refunds through Razorpay.</li>
        <li>To improve our service.</li>
        <li>To send you programme updates, where you have agreed to receive them.</li>
      </ul>

      <h2>3. Your health information</h2>
      <p>
        Anything you share about your health is used <strong>only</strong> to understand your
        situation and build your plan. It is never sold, never used for advertising, and never
        shared with anyone outside the coaching team without your explicit permission. You decide
        how much to share, and you can decline any question.
      </p>

      <h2>4. Who we share it with</h2>
      <p>
        We do not sell, trade or rent your personal information. We use a small number of trusted
        services to run the business, each with its own privacy policy:
      </p>
      <ul>
        <li><strong>Razorpay</strong> — to process payments.</li>
        <li><strong>Calendly</strong> — to schedule your call.</li>
        <li><strong>WhatsApp and email providers</strong> — to send confirmations and reminders.</li>
      </ul>
      <p>We may also disclose information where the law requires it.</p>

      <h2>5. Your rights</h2>
      <p>
        You can ask us to access, correct or delete the information we hold about you, or to stop
        sending you marketing messages, at any time. Just email us at the address below.
      </p>

      <h2>6. Security and cookies</h2>
      <p>
        This site is served over HTTPS and access to your information is limited to the people who
        need it to coach you. No system is perfectly secure, but we take reasonable steps to
        protect your data. We use minimal cookies to help the site work; you can control cookies
        through your browser settings.
      </p>

      <h2>7. Age</h2>
      <p>
        This service is for adults aged 18 and over. We do not knowingly collect information from
        children.
      </p>

      <h2>8. Changes</h2>
      <p>
        We may update this policy from time to time. The current version is always the one
        published on this page, with the date shown above.
      </p>

      <h2>9. Contact us</h2>
      <p>
        For any question about your privacy, or to exercise any of your rights, contact us:
      </p>
      <ul>
        {mail && <li><strong>Email:</strong> <a href={`mailto:${mail}`}>{mail}</a></li>}
        {CONFIG.WHATSAPP_DISPLAY && <li><strong>Phone / WhatsApp:</strong> {CONFIG.WHATSAPP_DISPLAY}</li>}
      </ul>
    </LegalPage>
  );
}
