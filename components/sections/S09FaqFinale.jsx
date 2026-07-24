/* ============================================================================
   SECTION 09 · FAQ + closing CTA + footer + sticky CTA
   ----------------------------------------------------------------------------
   OWNED BY: session 9. Styles live in app/sections/s09-faq-finale.css.

   Structure is ARJ's, class for class:
     .af-faq          → .faqband      (eyebrow · H2 · accordion · closing CTA)
     .af-q            → .qa           (card shell, NOT a ruled row)
     .af-q-head       → .qa .q
     .af-q-body(-inner) → .qa .a > div
     .af-faq-cta      → .faq-cta      (closing CTA INSIDE the FAQ band, so
                                       there is no background seam — ARJ
                                       deleted its old .af-final band for
                                       exactly this reason)
     .af-foot         → .foot
     .af-stuck        → .stickycta  (+ .stuck-beam / .stuck-inner / .stuck-trust)

   ⚠ The sticky bar's MARKUP used to live in app/page.jsx. ARJ's bar is a
   two-row unit (CTA pill above, trust pair below) and could not be reached by
   CSS alone, so it moved here. The hooks FunnelEffects.jsx relies on
   (`#stickycta`, `.in`, `#finale`) are unchanged. Flagged in the report.
   ========================================================================== */
import Link from 'next/link';
import { Ico } from '@/components/Icons';
import CtaBlock from '@/components/CtaBlock';
import Price from '@/components/Price';
import { CONFIG, CTA_STRING } from '@/lib/config';
import { FAQS } from '@/lib/content';

export default function S09FaqFinale() {
  return (
    <>
{/* ═══ FAQ — ARJ .af-faq: eyebrow, centred H2 with one brand-coloured clause,
    then a stack of CARD accordions (not hairline rows). First item open with
    the MOST ASKED pill, as both references run it. The closing CTA lives at
    the bottom of this same band. ═══ */}
<section className="section faqband">
  <div className="wrap">
    <p className="eyebrow center faq-eyebrow reveal">Straight answers. No sales spin.</p>
    <h2 className="faq-h2 reveal">
      Before You Book, <span>Quick Answers</span>
    </h2>

    <div className="faq">
      {FAQS.map((f, i) => (
        <div
          className={i === 0 ? 'qa open reveal' : 'qa reveal'}
          key={f.q}
          data-d={String(Math.min(i + 1, 5))}
        >
          <button className="q" type="button" aria-expanded={i === 0}>
            <span className="t">
              {f.q}
              {f.mostAsked && <span className="mostasked">Most asked</span>}
            </span>
            <span className="ic"><Ico id="plus" /></span>
          </button>
          <div className="a"><div><p>{f.a}</p></div></div>
        </div>
      ))}
    </div>

    {/* ARJ .af-faq-cta — max-width 820, 36px of air above a hairline rule,
        same background as the FAQ so the page never seams here.
        id="finale" is the hook FunnelEffects uses to retract the sticky bar
        once a real CTA is on screen. */}
    <div className="faq-cta" id="finale">
      <p className="eyebrow center finale-eyebrow">
        And it all starts with a {CONFIG.CALL_MINUTES}-minute call
      </p>
      <h2 className="finale-line reveal">
        Become The Woman Who Stopped <em>Negotiating With Her Own Body.</em>
      </h2>
      <CtaBlock />
    </div>
  </div>
</section>

{/* ═══ FOOTER — ARJ .af-foot: grid-tinted band, centred, bold copyright line,
    the long disclaimer in muted 11.5px, "owned and operated by", then the
    three policy links. Bottom padding clears the sticky bar. ═══ */}
<footer className="foot">
  <div className="wrap">
    <div className="copy">© 2026 Reset by Shruti Solanki. All rights reserved.</div>
    <p>
      All content, systems and coaching services provided by Reset are intended for
      educational and informational purposes only and do not guarantee specific results.
      This is not medical advice. PCOS and thyroid conditions are managed, not cured.
      Always consult a qualified healthcare professional before making changes to your
      diet, exercise or lifestyle, and never change medication without your doctor.
      Client results and testimonials vary based on individual factors such as
      consistency, medical history, lifestyle and adherence to the process. Outcomes are
      not typical or guaranteed. This website is not affiliated with or endorsed by Meta.
      FACEBOOK and INSTAGRAM are trademarks of Meta Platforms, Inc.
    </p>
    <p className="ownedby">
      Owned and operated by Reset by Shruti Solanki
    </p>
    <div className="links">
      <Link href="/privacy">Privacy Policy</Link>
      <span aria-hidden="true">·</span>
      <Link href="/terms">Terms &amp; Conditions</Link>
      <span aria-hidden="true">·</span>
      <Link href="/refund-policy">Refund Policy</Link>
      {CONFIG.INSTAGRAM_URL && (
        <>
          <span aria-hidden="true">·</span>
          <a href={CONFIG.INSTAGRAM_URL}>Instagram</a>
        </>
      )}
    </div>
  </div>
</footer>

{/* ═══ STICKY CTA — ARJ .af-stuck. Two rows, centred: the full CTA string in
    the primary pill, and a two-item trust pair beneath it. A brand beam
    sweeps the top edge. Visibility is FunnelEffects' job (.in). ═══ */}
<div className="stickycta" id="stickycta">
  <span className="stuck-beam" aria-hidden="true" />
  <div className="stuck-inner">
    <Link className="cta-big stuck-cta" href="/checkout">
      <span>{CTA_STRING}</span>
      <span className="arrow-disc"><Ico id="arrow" className="ico ico-sm arrow" /></span>
    </Link>
    <ul className="stuck-trust">
      <li>
        <span className="trust-ic"><Ico id="shield" className="ico ico-sm" /></span>
        <b><Price /></b>&nbsp;Fully Refundable
      </li>
      <li>
        <span className="trust-ic"><Ico id="users" className="ico ico-sm" /></span>
        <b>{CONFIG.CLIENT_COUNT}</b>&nbsp;Women Coached
      </li>
    </ul>
  </div>
</div>
    </>
  );
}
