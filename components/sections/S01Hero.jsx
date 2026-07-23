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
import {
  CONDITIONS, STATS, FIT_CARDS, VIDEOS, CASES, CHAT_SHOTS,
  INCLUDED, RECIPROCAL, FAQS,
} from '@/lib/content';

export default function S01Hero() {
  return (
    <>
{/* ═══════════ HERO ═══════════
    ARJ's element order, verbatim, with their stagger delays:
    proofrow → callout (.06s) → h1 (.12s) → sub-strong (.16s) →
    sub-markers (.2s) → markers (.24s) → watch (.26s) → video → CTA ═══ */}
<section className="section hero gridbg" id="hero">
  <div className="wrap">

    {/* Social-proof row. ARJ leads with an avatar cluster of four client
        after-photos; Shruti's clients are private and no such set exists,
        so the cluster is omitted rather than filled with stock faces. */}
    <div className="credrow reveal">
      <div className="credrow-text">
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
        <span className="divider" />
        <span className="proof-claim">
          <span className="proof-ic"><Ico id="shield" /></span>
          <span><Price /> Fully Refundable</span>
        </span>
      </div>
    </div>

    <div className="eyebrow-pill reveal" data-d="1">
      For women whose PCOS, thyroid and insulin resistance are all happening at once
    </div>

    {/* Three explicit lines, exactly as ARJ hard-breaks theirs:
        boxed metric → coloured second outcome → plain identity line. */}
    <h1 className="reveal" data-d="1">
      Lose{' '}
      {/* ARJ boxes a SHORT hard metric ("10–20 Kilos"). Our kg range is
          still Q3.1, and a box around a full phrase clips at 37px on a
          390px screen — so until the number lands the clause is plain
          ink and only the second clause carries colour, which is ARJ's
          one-coloured-phrase rule. Supplying NEXT_PUBLIC_KG_RANGE
          switches the box on automatically. */}
      {CONFIG.KG_RANGE
        ? <><span className="h1-chip">{CONFIG.KG_RANGE} Kilos</span>,</>
        : <>The Stubborn Weight,</>}<br />
      Bring Your <span className="h1-accent">Markers Back In Range</span>,<br />
      &amp; Stop Fighting Your Body
    </h1>

    <p className="sub reveal" data-d="2">
      Through The Overlap Reset, a {CONFIG.PROGRAMME_DAYS}-day protocol designed for women
      whose weight will not move because three things are happening at the same time.
    </p>

    <p className="reach-para reveal" data-d="3">
      <b>{CONFIG.CLIENT_COUNT} Women</b>{' '}
      {CONFIG.GEOGRAPHY ? <span className="u">across {CONFIG.GEOGRAPHY}</span> : <Gap>geography · Q4.1</Gap>}{' '}
      have worked with Shruti on{' '}
      <span className="pill">stubborn weight</span>, brought markers back into range and
      improved the symptoms linked to:
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
