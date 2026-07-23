import LegalPage from '@/components/LegalPage';
import { Ico } from '@/components/Icons';
import { Gap } from '@/components/Price';
import { CONFIG } from '@/lib/config';

export const metadata = {
  title: 'Contact Us · Reset by Shruti Solanki',
  description: 'How to reach Reset by Shruti Solanki — email, WhatsApp and registered address.',
};

/* ============================================================================
   CONTACT US

   Razorpay's merchant verification requires a reachable contact page with a
   working email/phone and the registered address. It is one of the commonest
   reasons an application is sent back, and it is trivially avoidable — so this
   page exists even though the funnel itself does not link to it prominently.
   ========================================================================== */
export default function ContactPage() {
  const wa = CONFIG.WHATSAPP_NUMBER
    ? `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent('Hi Shruti — I have a question about Reset.')}`
    : null;

  return (
    <LegalPage kicker="Get in touch" title="Contact Us">
      <p>
        A real person reads everything that comes in. If it is about a booking, a refund or your
        plan, mention the email or phone number you used at checkout and we will find you faster.
      </p>

      <div className="legal-contact">
        {CONFIG.SUPPORT_EMAIL ? (
          <a className="legal-cc" href={`mailto:${CONFIG.SUPPORT_EMAIL}`}>
            <span className="legal-cc-ic"><Ico id="mail" className="ico ico-sm" /></span>
            <span>
              <span className="legal-cc-t">Email</span>
              <span className="legal-cc-s">{CONFIG.SUPPORT_EMAIL}</span>
            </span>
          </a>
        ) : (
          <div className="legal-cc">
            <span className="legal-cc-ic"><Ico id="mail" className="ico ico-sm" /></span>
            <span>
              <span className="legal-cc-t">Email</span>
              <span className="legal-cc-s"><Gap>support email · QB.2</Gap></span>
            </span>
          </div>
        )}

        {wa ? (
          <a className="legal-cc" href={wa}>
            <span className="legal-cc-ic"><Ico id="chat" className="ico ico-sm" /></span>
            <span>
              <span className="legal-cc-t">WhatsApp</span>
              <span className="legal-cc-s">{CONFIG.WHATSAPP_DISPLAY}</span>
            </span>
          </a>
        ) : (
          <div className="legal-cc">
            <span className="legal-cc-ic"><Ico id="chat" className="ico ico-sm" /></span>
            <span>
              <span className="legal-cc-t">WhatsApp</span>
              <span className="legal-cc-s"><Gap>number · QB.2</Gap></span>
            </span>
          </div>
        )}
      </div>

      <h2>Registered address</h2>
      <p>
        {CONFIG.LEGAL_ENTITY || <Gap>registered entity · QL.1</Gap>}<br />
        {CONFIG.BUSINESS_ADDRESS || <Gap>registered address · QL.2</Gap>}
      </p>
      {CONFIG.SUPPORT_PHONE && <p><strong>Phone:</strong> {CONFIG.SUPPORT_PHONE}</p>}
      {CONFIG.GSTIN && <p><strong>GSTIN:</strong> {CONFIG.GSTIN}</p>}

      <h2>Response times</h2>
      <ul>
        <li><strong>Refund requests</strong> — acknowledged within 48 hours.</li>
        <li><strong>Booking and scheduling</strong> — usually the same working day.</li>
        <li><strong>Grievances</strong> — acknowledged within 48 hours, resolved within 30 days.</li>
      </ul>

      <h2>Grievance officer</h2>
      <p>
        {CONFIG.GRIEVANCE_OFFICER || <Gap>grievance officer · QL.4</Gap>}
        {CONFIG.SUPPORT_EMAIL && <> · <a href={`mailto:${CONFIG.SUPPORT_EMAIL}`}>{CONFIG.SUPPORT_EMAIL}</a></>}
      </p>
      <p>
        Appointed under the Consumer Protection (E-Commerce) Rules, 2020 and the Digital Personal
        Data Protection Act, 2023.
      </p>

      <h2>Before you write about a refund</h2>
      <p>
        The ₹{CONFIG.ENTRY_PRICE} booking fee is returned if the call does not happen or if you
        finish it and feel it was not worth your time — no justification needed. Full terms are
        in the <a href="/refund-policy">Refund &amp; Cancellation Policy</a>.
      </p>
    </LegalPage>
  );
}
