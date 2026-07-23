import Link from 'next/link';
import { Ico } from '@/components/Icons';
import Price, { Gap } from '@/components/Price';
import { CONFIG, CTA_SHORT } from '@/lib/config';

import S01Hero from '@/components/sections/S01Hero';
import S02Stats from '@/components/sections/S02Stats';
import S03FitCards from '@/components/sections/S03FitCards';
import S04Proof from '@/components/sections/S04Proof';
import S05Wall from '@/components/sections/S05Wall';
import S06Coach from '@/components/sections/S06Coach';
import S07Included from '@/components/sections/S07Included';
import S08Guarantee from '@/components/sections/S08Guarantee';
import S09FaqFinale from '@/components/sections/S09FaqFinale';

/* ============================================================================
   PAGE 1 · LANDING — composition only.

   ⚠ DO NOT ADD SECTION MARKUP HERE. Each section is a component owned by one
   session (see SESSION-HANDOFF.md). This file exists so nine parallel sessions
   never edit the same file. Changing the ORDER below is a cross-section
   decision — flag it, don't do it unilaterally.
   ========================================================================== */
export default function LandingPage() {
  return (
    <>
      {/* Announce bar is page chrome, not a section — but it is visually part
          of the hero, so section 1 owns its styling. */}
      <div className="credband">
        <div className="credband-inner">
          <span>
            {CONFIG.YEARS_COACHING ? <b>{CONFIG.YEARS_COACHING}+ Years</b> : <Gap>yrs · Q2.1</Gap>} Of Coaching
          </span>
          <span className="sep" />
          <span><b>{CONFIG.CLIENT_COUNT}</b> Women Coached</span>
        </div>
      </div>

      <main>
        <S01Hero />
        <S02Stats />
        <S03FitCards />
        <S04Proof />
        <S05Wall />
        <S06Coach />
        <S07Included />
        <S08Guarantee />
        <S09FaqFinale />
      </main>

      {/* R8 · sticky CTA — MARKUP MOVED into S09FaqFinale.jsx (session 9).
          ARJ's .af-stuck is a two-row unit (CTA pill over a trust pair) and
          could not be reached from CSS alone. FunnelEffects still drives it
          through the same #stickycta / .in hooks. */}
    </>
  );
}
