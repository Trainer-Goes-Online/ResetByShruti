import Link from 'next/link';
import { Ico } from './Icons';
import Price from './Price';
import { CONFIG, CTA_STRING } from '@/lib/config';

/* THE REPEATED CTA BLOCK.
   Anatomy taken from the live reference funnels, which both run it identically:

     [ full-width CTA pill · the ONE string · circled arrow ]
     [ ✓ trust triad — guarantee · social proof · audience  ]
     [ OFFER ENDS IN · HH HRS : MM MIN : SS SEC             ]

   Button + triad + countdown are ONE indivisible unit — never a lone button,
   never the triad without the button. Built once, placed five times.
   The CTA string never varies between instances.

   ⚠ THE COUNTDOWN: both references run a live clock here. Ours renders the
   slot in the same position but stays EMPTY until a real deadline or intake
   cap exists (Q7.1) — a clock that resets on reload is fabricated scarcity.
   Setting NEXT_PUBLIC_COUNTDOWN_DEADLINE fills it with no layout change. */
export default function CtaBlock({ micro = false, style }) {
  return (
    <div className="ctablock reveal" style={style}>
      <Link className="cta-big" href="/checkout">
        <span>{CTA_STRING}</span>
        <span className="arrow-disc"><Ico id="arrow" className="ico ico-sm arrow" /></span>
      </Link>
{/* 
      {micro && (
        <p className="cta-micro">
          <Price /> to book · {CONFIG.CALL_MINUTES} minutes, 1:1 with Shruti
        </p>
      )} */}

      <ul className="triad">
        <li><Ico id="shield" className="ico ico-sm" />100% Client Satisfaction </li>
        <li><Ico id="users" className="ico ico-sm" /> <b>{CONFIG.CLIENT_COUNT}</b>&nbsp;Success Stories</li>
        <li><Ico id="spark" className="ico ico-sm" /> Trusted by Women Globally</li>
      </ul>

      {/* Countdown slot — same position as the references. Filled by
          FunnelEffects only against a real deadline or a real intake cap. */}
      <div className="countdown" data-urgency style={{ display: 'none' }}>
        <span className="cd-label">Offer ends in</span>
        <span className="cd-clock u-text" />
      </div>
    </div>
  );
}
