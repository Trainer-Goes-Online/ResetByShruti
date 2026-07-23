import Link from 'next/link';
import { Ico } from '@/components/Icons';
import { Gap } from '@/components/Price';
import UtilityFooter from '@/components/UtilityFooter';
import { CONFIG } from '@/lib/config';

/* ============================================================================
   Shared shell for the three policy pages + contact.

   These are LIGHT-toned utility surfaces like the rest of the post-conversion
   pages — a legal page is a place to reassure, not to sell. No CTA block, no
   countdown, no sticky bar.

   Razorpay's verification team reads these pages manually. Three things they
   check that are easy to get wrong:
     · the entity name and address must match the Razorpay account
     · a working contact route must be reachable from every policy page
     · the refund policy must describe the ACTUAL product being charged for
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

          {/* One entity block, repeated on every policy page, so a reviewer can
              verify the merchant from whichever page they land on. */}
          <div className="legal-entity">
            <p className="legal-entity-h">Who this policy is from</p>
            <dl>
              <div><dt>Business</dt><dd>{CONFIG.LEGAL_ENTITY || <Gap>registered entity · QL.1</Gap>}</dd></div>
              <div><dt>Trading as</dt><dd>Reset by Shruti Solanki</dd></div>
              <div><dt>Address</dt><dd>{CONFIG.BUSINESS_ADDRESS || <Gap>registered address · QL.2</Gap>}</dd></div>
              <div><dt>Email</dt><dd>{CONFIG.SUPPORT_EMAIL
                ? <a href={`mailto:${CONFIG.SUPPORT_EMAIL}`}>{CONFIG.SUPPORT_EMAIL}</a>
                : <Gap>support email · QB.2</Gap>}</dd></div>
              <div><dt>Phone</dt><dd>{CONFIG.SUPPORT_PHONE || <Gap>support phone · QL.3</Gap>}</dd></div>
              {CONFIG.GSTIN && <div><dt>GSTIN</dt><dd>{CONFIG.GSTIN}</dd></div>}
            </dl>
          </div>

          <div className="legal-body">{children}</div>

          <div className="legal-links">
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms &amp; Conditions</Link>
            <Link href="/refund-policy">Refund &amp; Cancellation</Link>
            <Link href="/contact">Contact Us</Link>
          </div>

          <UtilityFooter />
        </div>
      </main>
    </div>
  );
}
