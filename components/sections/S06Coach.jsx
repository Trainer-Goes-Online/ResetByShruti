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
import { CONFIG } from '@/lib/config';

export default function S06Coach() {
  return (
    <>
{/* ═══ MEET YOUR COACH — both references lead this with the coach's OWN
    story before any credential, then the blame-relief ("told to simply eat
    less and move more"). Copy is the client's own, from the project file. ═══ */}
<section className="section coachsec">
  <div className="wrap">
    <div className="coach-grid">

      {/* ARJ .af-about-photo — 4/5, badge, inner rule, stat overlay */}
      <div className="coach-photo reveal">
        <span className="coach-badge">Meet Your Coach</span>
        <div className="coach-frame" aria-hidden="true" />
        <Image
          src="/img/coach/shruti-2.jpg"
          alt="Shruti Solanki"
          fill
          sizes="(max-width: 900px) 100vw, 440px"
          className="coach-img"
        />
        {/* ARJ .count — credential pair over the bottom scrim */}
        <div className="coach-count">
          <div><b>BSc · MSc</b><span>Nutrition &amp; Health</span></div>
          <div><b>{CONFIG.CLIENT_COUNT}</b><span>Women Coached</span></div>
        </div>
      </div>

      {/* ARJ .af-about-text */}
      <div className="coach-text reveal" data-d="1">
        <p className="eyebrow coach-eyebrow">Meet Your Coach</p>
        <h2>
          The Nutritionist Who’s Lived The<br className="br-mob" />{' '}
          <span>Same Hormonal Struggles As You</span>
        </h2>
        <p>
          Shruti Solanki was diagnosed with <strong>Hashimoto’s at just 12 years old.</strong>{' '}
          She knows what it’s like to battle stubborn weight, fatigue and hormonal imbalances
          while being told to simply “eat less and move more.”
        </p>
        <p>
          Instead of accepting that answer, she spent years studying nutrition, earning her{' '}
          <strong>BSc &amp; MSc in Nutrition &amp; Health</strong>, along with multiple
          certifications in <strong>Weight Loss Advisory, Diabetes Education, and Skin &amp;
          Nutrition.</strong>
        </p>
        <p>
          Today, through <strong>RESET by Shruti Solanki</strong>, she’s helped{' '}
          <span className="coach-pill">{CONFIG.CLIENT_COUNT} women</span> across <span className="coach-hl">India, the UK,
          the US and Canada</span> lose weight sustainably while improving{' '} PCOS, thyroid health and insulin resistance, without
          restrictive diets or giving up the foods they love.
        </p>
      </div>

    </div>
  </div>
</section>

    </>
  );
}
