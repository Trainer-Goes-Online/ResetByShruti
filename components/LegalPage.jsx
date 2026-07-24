import Link from 'next/link';
import { Ico } from '@/components/Icons';
import UtilityFooter from '@/components/UtilityFooter';
import { CONFIG } from '@/lib/config';

/* ============================================================================
   Shared shell for the three policy pages (privacy, terms, refund).

   These are LIGHT-toned utility surfaces like the rest of the post-conversion
   pages — a legal page is a place to reassure, not to sell. No CTA block, no
   countdown, no sticky bar.

   Modelled on the two reference funnels (teamfitarjun.com, thefoodfreedomco.com):
   plain-language, contact-by-email-and-phone, no printed registered entity or
   address. Razorpay verifies the merchant from the account's KYC, not from text
   on the page, so nothing here depends on a value the client cannot supply.
   ========================================================================== */
export default function LegalPage({ title, kicker, updated, children }) {
  return (
    <div className="legal">
      <header className="legal-head">
        <Link href="/" className="legal-back">
          <Ico id="arrow" className="ico ico-sm legal-back-ico" />
          Back to Reset
        </Link>
      </header>

      <main className="legal-main">
        <div className="legal-wrap">
          <p className="legal-kicker">{kicker}</p>
          <h1>{title}</h1>
          <p className="legal-updated">
            Last updated: {updated || CONFIG.POLICY_UPDATED}
          </p>

          <div className="legal-body">{children}</div>

          <div className="legal-links">
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms &amp; Conditions</Link>
            <Link href="/refund-policy">Refund &amp; Cancellation</Link>
          </div>

          <UtilityFooter />
        </div>
      </main>
    </div>
  );
}
