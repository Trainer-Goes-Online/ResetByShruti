/* ============================================================================
   SECTION 05 · Message wall
   ----------------------------------------------------------------------------
   OWNED BY: session 5. Styles live in app/sections/s05-*.css.
   Reference: teamfitarjun.com — see SESSION-HANDOFF.md for the exact ARJ
   classes this section must match.

   ARJ EQUIVALENT: the "Before & After Transformations" carousel gallery —
   `.af-gallery` > `.af-wrap`(eyebrow + h2) then TWO full-bleed marquee rows
   `.af-gal-carousel` > `.af-gal-track` > `.af-gal-set` > `.af-gslide`.
   Row 1 runs ltr, row 2 runs rtl and carries `.af-gal-carousel-row2`.

   ARJ clones the set in JS (`set.cloneNode(true)`) and assigns the animation
   from a `useEffect`. We are a server component, so the duplicate set is
   authored in the markup and the animation lives in CSS — same result, and
   the marquee is real HTML before any JS runs (fails open, no CLS).

   Click → the shared `#lightbox` overlay, via the existing `[data-img]`
   delegation in FunnelEffects. No shared file was touched.
   ========================================================================== */
import { Gap } from '@/components/Price';
import { CHAT_SHOTS } from '@/lib/content';

/* ARJ splits its slides across two rows (ROW_1 / ROW_2) so the two marquees
   never show the same frame side by side. 14 shots → 7 + 7. */
const ROW_1 = CHAT_SHOTS.slice(0, 7);
const ROW_2 = CHAT_SHOTS.slice(7);

/* ARJ .af-gal-set — the set is rendered twice; the second copy is decorative
   (aria-hidden, not focusable) and exists only so the -50% translate loops
   seamlessly. */
function Set({ slides, clone = false }) {
  return (
    <div className="gal-set" aria-hidden={clone || undefined}>
      {slides.map((s) => (
        <button
          key={s.src}
          type="button"
          className="gshot"
          data-img={s.src}
          data-alt={s.alt}
          tabIndex={clone ? -1 : undefined}
          aria-label={clone ? undefined : 'Open message full size'}
        >
          <img src={s.src} alt={clone ? '' : s.alt} loading="lazy" decoding="async" />
        </button>
      ))}
    </div>
  );
}

/* ARJ CarouselRow — chassis + track + set + cloned set.
   data-marquee is the hook FunnelEffects drives; its value is the seconds one
   set takes to travel past, i.e. the old CSS animation-duration. */
function Row({ slides, dir, className = '' }) {
  return (
    <div className={`gal-row ${className}`.trim()} data-dir={dir} data-marquee="40">
      <div className="gal-track">
        <Set slides={slides} />
        <Set slides={slides} clone />
      </div>
    </div>
  );
}

export default function S05Wall() {
  return (
    <>
{/* ═══ TRANSFORMATION STRIP — ARJ runs a before/after gallery here and
    FFC a scrolling name·kgs marquee. We have neither, so this slot
    holds the message wall: same position in the hierarchy, same
    component — ARJ's two-row continuous marquee. ═══ */}
<section className="section wallsec" id="wall">
  <div className="wrap">
    <div className="section-head">
      {/* <span className="eyebrow">Real clients · unprompted · no filters</span> */}
      <h2>Thousands Of Messages. Hundreds Of <em className="u-word"> Wins.</em></h2>
      <p className="lede reveal" data-d="2">Here's a small glimpse into our clients' journeys.</p>
    </div>
  </div>

  {/* Full-bleed — ARJ's carousels sit OUTSIDE .af-wrap so the edge mask has
      room to taper. Only the heading is wrapped. */}
  <Row slides={ROW_1} dir="ltr" />
  <Row slides={ROW_2} dir="rtl" className="gal-row2" />

  {/* <div className="wrap">
    <p className="center mt-m"><Gap>PII pass + consent pending · Q14.1</Gap></p>
  </div> */}
</section>

    </>
  );
}
