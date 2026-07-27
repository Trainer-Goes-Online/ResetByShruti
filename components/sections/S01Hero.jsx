/* ============================================================================
   SECTION 01 · Hero
   ----------------------------------------------------------------------------
   OWNED BY: session 1. Styles live in app/sections/s01-*.css.
   Reference: teamfitarjun.com — see SESSION-HANDOFF.md for the exact ARJ
   classes this section must match.
   ========================================================================== */
import Link from 'next/link';
import Image from 'next/image';
import { Ico } from '@/components/Icons';
import CtaBlock from '@/components/CtaBlock';
import Price, { Gap } from '@/components/Price';
import { CONFIG, CTA_SHORT } from '@/lib/config';
import { CONDITIONS } from '@/lib/content';

export default function S01Hero() {
  return (
    <>
{/* ═══════════ HERO ═══════════
    ARJ's element order, verbatim, with their stagger delays:
    proofrow → callout (.06s) → h1 (.12s) → sub-strong (.16s) →
    sub-markers (.2s) → markers (.24s) → watch (.26s) → video → CTA ═══ */}
<section className="section hero gridbg" id="hero">
  <div className="wrap">

    {/* Social-proof row — reference leads with an overlapping avatar cluster
        BEFORE the stars. Two are the client's own women photos; the third is a
        poster frame of Hima's testimonial video — genuinely her client. */}
    <div className="credrow reveal">
      <div className="credrow-text">
        <span className="cred-avatars" aria-hidden="true">
          <span className="cred-av">
            <img src="/img/Icons/Women_Icon1.jpeg" alt="" loading="lazy" />
          </span>
          <span className="cred-av">
            <img src="/img/Icons/Women_Icon2.jpeg" alt="" loading="lazy" />
          </span>
          <span className="cred-av">
            <img src="/img/Icons/Women_Icon3.jpeg" alt="" loading="lazy" />
          </span>
          <span className="cred-av">
            <img src="/img/Icons/Women_Icon4.jpeg" alt="" loading="lazy" />
          </span>
          {CONFIG.VIDEO_2 && (
            <span className="cred-av">
              <video src={`${CONFIG.VIDEO_2}#t=1.5`} muted playsInline preload="metadata" />
            </span>
          )}
        </span>
        {CONFIG.RATING ? (
          <span className="af-stars">
            <span className="sbox">
              {[0,1,2,3,4].map((i) => <Ico key={i} id="star" />)}
            </span>
            <span><b>{CONFIG.RATING}</b> Review</span>
          </span>
        ) : (
          <span className="af-stars"><Gap>rating · Q2.2</Gap></span>
        )}
      </div>

      {/* Second line of the proof stack, as in the reference: the avatars and
          rating establish WHO, this removes the risk of acting on it. Unlike
          the numbers above it this claim is not gated on config — the
          money-back guarantee is a fixed term of the offer, and section 08
          states it in full.

          i-shield, not a bespoke refund mark: the sticky bar (S09FaqFinale)
          already pairs this exact shield with this exact sentence, so a second
          symbol for the same claim would read as two different promises. */}
      <p className="cred-guarantee">
        <Ico id="shield" className="ico ico-sm" />
        <span><b>100%</b> Money-Back Guarantee</span>
      </p>
    </div>

    <div className="eyebrow-pill reveal" data-d="1">
      FOR WORKING WOMEN WHO ARE DONE WITH DIETS THAT NEVER LAST 
    </div>

    {/* Three explicit lines, exactly as ARJ hard-breaks theirs:
        boxed metric → coloured second outcome → plain identity line. */}
    {/* Sreshtha-style hero: light serif, high readability, ONLY the metric
        carries a filled pill — the condition line stays plain ink so nothing
        shouts. The client's copy fixes the metric at "5-15 Kilos"; supplying
        NEXT_PUBLIC_KG_RANGE overrides it without a code change. */}
    {/* Hard breaks are DESKTOP-ONLY (.h1-br). On mobile the line balances
        naturally (text-wrap: balance) like the reference, so no clause is left
        orphaned on its own line. */}
    <h1 className="reveal h1-soft" data-d="1">
      Lose <span className="h1-chip">{CONFIG.KG_RANGE || '5-15'} Kilos</span>,<br className="h1-br" />
      {' '}Even If You Have PCOS,<br className="h1-br" />
      {' '}Thyroid &amp; Insulin Resistance
    </h1>

    <p className="sub reveal" data-d="2">
      Through A Personalised Hormone Reset Approach Designed To Help
      Working Women Finally Take Control Of Their Weight & Health.
    </p>

    <p className="reach-para reveal" data-d="3">
      <b>{CONFIG.CLIENT_COUNT} Women</b>{' '}
      {/* Only the geography carries the highlight — "across" stays plain ink. */}
      across {CONFIG.GEOGRAPHY ? <span className="u">{CONFIG.GEOGRAPHY}</span> : <Gap>geography · Q4.1</Gap>}{' '}
      have achieved lasting{' '}
      <span className="pill">weight loss </span> while improving their metabolic & hormone health, including:
    </p>

    <ul className="chips reveal" data-d="3">
      {CONDITIONS.map((c, i) => (
        <li key={c} style={{ '--pd': `${i * 0.22}s` }}>{c}</li>
      ))}
    </ul>

    <div className="watch-row reveal" data-d="4">
      <button type="button" className="watch-pill" onClick={undefined}>
        Watch The Short Video Below
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M19 12l-7 7-7-7" /></svg>
      </button>
    </div>

    {/* VSL · aspect reserved so the embed can never land at 0px (C16).
        DECLARED PLACEHOLDER — NEXT_PUBLIC_VSL_VIMEO_URL makes it live. */}
    <div className="vslframe reveal" data-d="4" id="vslframe">
      <div className="vsl-ph">
        <span className="playdisc"><Ico id="play" /></span>
        {!CONFIG.VSL_VIMEO_URL && (
          <span className="eyebrow ph-note">Placeholder — VSL not yet recorded (Q6.1)</span>
        )}
      </div>
    </div>

    <CtaBlock micro />
  </div>
</section>

    </>
  );
}
