/* ============================================================================
   SECTION 06 · Coach
   ----------------------------------------------------------------------------
   OWNED BY: session 6. Styles live in app/sections/s06-coach.css.
   Reference: ARJ `.af-about` — LandingView.tsx "D · About Arjun".
   Anatomy replicated 1:1:
     .af-about-grid  ( .9fr / 1.1fr · 50px · max 1100px · centred )
       .af-about-photo  4/5 · badge top-left · .frame inner rule
                        · .count stat pair over a bottom scrim
       .af-about-text   eyebrow · h2 with accent span · two paragraphs
   ARJ has NO CTA inside this section — the next section (What's Included)
   carries it. Ours now matches; the CtaBlock that used to sit here is gone.
   ========================================================================== */
import Image from 'next/image';
import { Gap } from '@/components/Price';
import { CONFIG } from '@/lib/config';

export default function S06Coach() {
  return (
    <>
{/* ═══ MEET YOUR COACH — both references lead this with the coach's OWN
    transformation number BEFORE any credential, then a first-person
    narrative. This is also where FFC does its relieve-the-blame work
    ("the real issue was never a lack of discipline"), which is why
    there is no separate section for it.
    DECLARED PLACEHOLDER — the strategy document has nothing on Shruti
    personally, and biography is never drafted. The SHELL is ARJ-exact;
    the words are <Gap> chips until Q15.1–Q15.6 land. ═══ */}
<section className="section coachsec">
  <div className="wrap">
    <div className="coach-grid">

      {/* ARJ .af-about-photo — 4/5, badge, inner rule, stat overlay */}
      <div className="coach-photo reveal">
        <span className="coach-badge">Meet Your Coach</span>
        <div className="coach-frame" aria-hidden="true" />
        <Image
          src="/img/coach/shruti-1.jpg"
          alt="Shruti Solanki"
          fill
          sizes="(max-width: 900px) 100vw, 440px"
          className="coach-img"
        />
        {/* ARJ .count — own-transformation number FIRST, then scale */}
        <div className="coach-count">
          <div><b><Gap>her own number · Q15.1</Gap></b><span>Her Own Journey</span></div>
          <div><b>{CONFIG.CLIENT_COUNT}</b><span>Women Coached</span></div>
        </div>
      </div>

      {/* ARJ .af-about-text */}
      <div className="coach-text reveal" data-d="1">
        <p className="eyebrow coach-eyebrow">Meet Your Coach</p>
        <h2>
          The Coach Behind<br className="br-mob" />{' '}
          <span>The Overlap Reset</span>
        </h2>
        <p>
          <Gap>First-person origin story · Q15.1</Gap> — both reference funnels run the
          coach’s own transformation here, in her own words, before any qualification.
          It is also where the blame-relief lands: the reader learns that the coach
          failed the same way she did, and why.
        </p>
        <p>
          <Gap>Credentials · Q15.2</Gap>{' '}<Gap>Years in practice · Q15.3</Gap>{' '}
          <Gap>Why this specialism · Q15.4</Gap> — ARJ closes this paragraph on scale and
          reach, which for us is{' '}
          <span className="coach-pill">{CONFIG.CLIENT_COUNT} women</span> coached through{' '}
          <span className="coach-hl">PCOS, thyroid and insulin resistance together</span>.
        </p>
      </div>

    </div>
  </div>
</section>

    </>
  );
}
