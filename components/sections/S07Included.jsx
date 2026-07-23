/* ============================================================================
   SECTION 07 · What's Included
   ----------------------------------------------------------------------------
   OWNED BY: session 7. Styles live in app/sections/s07-included.css.

   Structure is a 1:1 replica of ARJ's `.af-incl` block
   (_reference/teamfitarjun/app/LandingView.tsx L677-707):

     <section.af-incl>
       <div.af-wrap>
         h2 (centred, .af-accent on the last phrase)
         p.af-section-lede (.af-underline-ink on one phrase)
         div.af-incl-grid  ← 3 columns
           article.af-incl-card × n
             span.af-incl-ic  (44px raised chip, 22px stroked svg)
             h4
             p
         <CtaBlock marginTop:44 />

   Icons are declared inline here — exactly as ARJ declares INCL_ICONS inside
   LandingView — so no shared file (components/Icons.jsx) is touched.
   24px box, fill:none, stroke:currentColor, stroke-width 1.7, round caps.
   ========================================================================== */
import CtaBlock from '@/components/CtaBlock';
import { Gap } from '@/components/Price';
import { CONFIG } from '@/lib/config';
import { INCLUDED } from '@/lib/content';

/* One icon per item, keyed by the `icon` field on INCLUDED. */
const INCL_ICONS = {
  /* diagnosis — clipboard carrying a pulse line (ARJ `diagnosis`) */
  read: (
    <>
      <path d="M9 3H6.6A1.6 1.6 0 005 4.6v14.8A1.6 1.6 0 006.6 21h10.8a1.6 1.6 0 001.6-1.6V4.6A1.6 1.6 0 0017.4 3H15" />
      <rect x="9" y="1.9" width="6" height="3.2" rx="1.1" />
      <path d="M8.6 12.4h2l1.2-2.4 1.6 4.4 1.2-2h2" />
    </>
  ),
  /* sequence — folded route map: the ORDER is the mechanism (ARJ `blueprint`) */
  sequence: (
    <>
      <path d="M2.9 6.6l6.3-2.7 5.6 2.7 5.3-2.7v13.5l-5.3 2.7-5.6-2.7-6.3 2.7V6.6z" />
      <path d="M9.2 3.9v13.5M14.8 6.6v13.5" />
    </>
  ),
  /* weekly — calendar with a refresh loop */
  weekly: (
    <>
      <rect x="3.2" y="4.8" width="17.6" height="16" rx="2.2" />
      <path d="M3.2 9.6h17.6M8 2.8v4M16 2.8v4" />
      <path d="M14.8 14.6a2.9 2.9 0 10-.9 2.6" />
      <path d="M14.9 11.9v2.7h-2.7" />
    </>
  ),
  /* layers — three stacked planes, one per condition */
  layers: (
    <>
      <path d="M12 3.2l8.4 4.2-8.4 4.2-8.4-4.2z" />
      <path d="M3.6 12l8.4 4.2 8.4-4.2M3.6 16.4l8.4 4.2 8.4-4.2" />
    </>
  ),
  /* training — dumbbell (ARJ `training`) */
  training: (
    <>
      <path d="M2.6 9.6v4.8M6.2 7.2v9.6M17.8 7.2v9.6M21.4 9.6v4.8M6.2 12h11.6" />
    </>
  ),
  /* support — chat bubble (ARJ `support`) */
  support: (
    <>
      <path d="M20.6 14.4a2.2 2.2 0 01-2.2 2.2H7.2L3.4 20.4V5.6a2.2 2.2 0 012.2-2.2h12.8a2.2 2.2 0 012.2 2.2v8.8z" />
      <path d="M8.4 8.6h7.2M8.4 12h4.8" />
    </>
  ),
  /* progress — bars with a trend line (ARJ `progress`) */
  progress: (
    <>
      <path d="M3.2 20.4V13M9.1 20.4V8.6M14.9 20.4v-6.6M20.8 20.4V4.4" />
      <path d="M3.2 10.2l5.9-4.4 5.8 3.3 5.9-5.5" />
    </>
  ),
};

/* Fallback keeps the chip from collapsing if content.js gains an item before
   an icon exists for it — a visible generic mark, never an empty box. */
const ICON_ORDER = ['read', 'sequence', 'weekly', 'layers', 'training', 'support', 'progress'];

export default function S07Included() {
  return (
    <>
{/* ═══ WHAT'S INCLUDED — the named mechanism lives HERE as component 02,
    exactly as both references do it, rather than in a section of its
    own. ARJ's `.af-incl`: icon-chip card grid, 3-up. ═══ */}
<section className="section incl stage-soft">
  <div className="wrap">
    <div className="section-head">
      <span className="eyebrow reveal">The programme</span>
      <h2 className="reveal">
        What’s Included In Your{' '}
        <span className="incl-accent">{CONFIG.PROGRAMME_WEEKS}-Week Reset</span>
      </h2>
      <p className="incl-lede reveal" data-d="1">
        Everything working together, so the weight that comes off is{' '}
        <span className="underline-ink">the weight that stays off</span>.
      </p>
    </div>

    <div className="incl-grid reveal" data-d="2">
      {INCLUDED.map((item, i) => (
        <article className="incl-card" key={item.title}>
          <span className="incl-ic" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              {INCL_ICONS[item.icon || ICON_ORDER[i]] || INCL_ICONS.read}
            </svg>
          </span>
          <h4>{item.title}</h4>
          <p>{item.body} {item.gap && <Gap>{item.gap}</Gap>}</p>
        </article>
      ))}
    </div>

    {/* ARJ: <CtaBlock extraStyle={{ marginTop: 44 }} /> */}
    <CtaBlock style={{ marginTop: 44 }} />
  </div>
</section>

    </>
  );
}
