import LegalPage from '@/components/LegalPage';
import { CONFIG } from '@/lib/config';

export const metadata = {
  title: 'Terms & Conditions · Reset by Shruti Solanki',
  description:
    'The terms on which Reset by Shruti Solanki provides nutrition and lifestyle coaching.',
  alternates: { canonical: '/terms' },
};

/* ============================================================================
   TERMS & CONDITIONS

   Modelled on teamfitarjun.com/terms-and-conditions and
   thefoodfreedomco.com/terms: short, plain, contact by email + phone only.

   §3 (coaching, not medical care) is the load-bearing clause and is kept even
   in this trimmed version — the business discusses TSH / HbA1c with clients, so
   the scope-of-practice line is what keeps that from being characterised as
   practising medicine. Both reference funnels carry the equivalent clause.
   ========================================================================== */
export default function TermsPage() {
  const mail = CONFIG.SUPPORT_EMAIL;

  return (
    <LegalPage kicker="Policy" title="Terms & Conditions">
      <p>
        These terms govern your use of this website and any coaching you buy through it. By
        booking a call or enrolling in the programme, you agree to them. This website is operated
        by <strong>Reset by Shruti Solanki</strong>.
      </p>

      <h2>1. What we offer</h2>
      <p>
        A ₹{CONFIG.ENTRY_PRICE} booking fee buys a {CONFIG.CALL_MINUTES}-minute one-to-one video
        consultation with Shruti Solanki. The {CONFIG.PROGRAMME_WEEKS}-week Reset programme is a
        separate, individually built coaching programme that is discussed only on that call, and
        only if it is a fit. It is not sold on this website.
      </p>

      <h2>2. Bookings and payment</h2>
      <ul>
        <li>Payments are processed securely by <strong>Razorpay</strong>. We never see or store your card or bank details.</li>
        <li>Prices are in Indian Rupees and include applicable taxes unless stated otherwise.</li>
        <li>Your call slot is confirmed only once payment succeeds.</li>
        <li>We may update prices at any time; the price that applies to you is the one shown when you pay.</li>
        <li>Programme fees and any instalments are agreed in writing before you enrol.</li>
      </ul>

      <h2>3. Coaching, not medical care</h2>
      <div className="legal-note">
        <p>
          <strong>Reset provides nutrition and lifestyle coaching. It is not medical treatment,
          diagnosis or prescription, and Shruti Solanki is not acting as your doctor.</strong>
        </p>
        <p>
          We may discuss blood markers such as TSH and HbA1c in order to build your plan around
          them, but this is not a diagnosis and does not replace medical care. Never start, stop
          or change any medication because of anything in this programme — that is between you and
          your doctor. Please consult a qualified doctor before making changes to your diet or
          exercise, particularly if you are pregnant, trying to conceive, breastfeeding, diabetic
          or managing any other condition. PCOS and thyroid conditions are managed, not cured.
        </p>
      </div>

      <h2>4. Results</h2>
      <p>
        Results depend on your body, your history and your consistency. The transformations and
        testimonials shown on this site are the real experiences of past clients; they are
        individual outcomes and are not typical, promised or guaranteed. Our one promise is that
        you will feel lighter — less bloating and puffiness — within the first fourteen days. No
        specific weight, measurement or blood-marker outcome is promised.
      </p>

      <h2>5. Refunds</h2>
      <p>
        The ₹{CONFIG.ENTRY_PRICE} booking fee is refundable on the terms set out in our{' '}
        <a href="/refund-policy">Refund &amp; Cancellation Policy</a>. Once you enrol, the Reset
        programme fee is non-refundable. Full details are in the Refund Policy, which forms part
        of these terms.
      </p>

      <h2>6. Intellectual property</h2>
      <p>
        All content on this site and within the programme — text, designs, frameworks, protocols,
        templates and videos — belongs to us. You get a personal, non-transferable licence to use
        your own material for yourself. Please do not copy, share, resell or republish it.
      </p>

      <h2>7. Acceptable use</h2>
      <p>
        Use this site lawfully and give accurate information about yourself and your health. We may
        decline or end service where information is materially false, where the material is shared
        or resold, or where a coach is treated abusively.
      </p>

      <h2>8. Liability</h2>
      <p>
        To the fullest extent permitted by law, our total liability to you is limited to the amount
        you actually paid us. We are not liable for indirect or consequential loss. Nothing in
        these terms limits any liability that cannot lawfully be limited.
      </p>

      <h2>9. Governing law</h2>
      <p>
        These terms are governed by the laws of India, and the courts of India have jurisdiction.
        We would always rather resolve things by talking first.
      </p>

      <h2>10. Changes</h2>
      <p>
        We may update these terms. The version that applies to you is the one published on the day
        you paid, with the date shown above.
      </p>

      <h2>11. Contact us</h2>
      <ul>
        {mail && <li><strong>Email:</strong> <a href={`mailto:${mail}`}>{mail}</a></li>}
        {CONFIG.WHATSAPP_DISPLAY && <li><strong>Phone / WhatsApp:</strong> {CONFIG.WHATSAPP_DISPLAY}</li>}
      </ul>
    </LegalPage>
  );
}
