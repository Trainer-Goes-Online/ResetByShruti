/* ============================================================================
   SECTION 04 · Proof
   ----------------------------------------------------------------------------
   OWNED BY: session 4. Styles live in app/sections/s04-proof.css.

   ARJ equivalent: `<section className="af-proof">` in
   _reference/teamfitarjun/app/LandingView.tsx:556-601.
   Anatomy replicated 1:1 —
     .af-eyebrow  →  .proof .eyebrow
     h2 + em      →  .proof h2 + em (brand word + gradient underline bar)
     .af-section-lede → .proof .lede
     .af-tcards   →  .tcards        (grid repeat(2,1fr), gap 24, max 860, auto)
     .af-tcard    →  .tcard         (bg-alt, 1px border, r16, glow ::before, hover lift)
     .af-tphoto   →  .tphoto        (media plate — ours is portrait video, not
                                     their 5:3 before/after split: clients are
                                     private and no before/after set exists)
     .af-tcard-body → .tcard-body   (h4 17 / .meta 13 brand caps / .stars / p 14)
     .af-tcard-more → .tcard-more   (the dashed summary card that closes the grid)
   Stagger is ARJ's: card 1 no delay, then .08 / .16 / .24 … (data-d 1-5).
   ========================================================================== */
import { Ico } from '@/components/Icons';
import { Gap } from '@/components/Price';
import { CONFIG } from '@/lib/config';
import { VIDEOS, CASES } from '@/lib/content';

export default function S04Proof() {
  return (
<section className="section proof">
  <div className="wrap">

    {/* ARJ: p.af-eyebrow → h2 (mb46) → p.af-section-lede (mb40) → .af-tcards */}
    <p className="eyebrow reveal">Real women · real markers · real timelines</p>
    <h2 className="reveal" data-d="1">
      Women Who Were Told It Was Just <em>Discipline</em>
    </h2>
    <p className="lede reveal" data-d="2">
      Corporate lawyers, PhD scholars, psychologists — women with the same three
      conditions and the same stalled scale. These are their numbers, not adjectives.
    </p>

    {/* ── 13a · video testimonials — ARJ's .af-tcard shell, portrait media ── */}
    <div className="tcards tcards-vid">
      {VIDEOS.map((v, i) => {
        const src = CONFIG[v.envKey];
        if (!src) return null;
        return (
          <button
            className="tcard tcard-vid reveal"
            key={v.id}
            data-video={src}
            data-d={i > 0 ? String(i) : undefined}
            type="button"
          >
            {/* display:block is load-bearing — a <span> inside a <button> is
                inline and ignores aspect-ratio, collapsing the plate. */}
            <span className="tphoto">
              <video src={`${src}#t=3`} preload="metadata" muted playsInline />
              <span className="tglass" />
              <span className="tplay"><Ico id="play" /></span>
              <span className="tag ta">Video</span>
            </span>
            <span className="tcard-body">
              <span className="nm">{v.name}</span>
              <span className="meta"><Gap>{v.gap}</Gap></span>
            </span>
          </button>
        );
      })}
    </div>

    {/* ── 13b · written case files — ARJ's 6-cell grid: 5 cases + summary ── */}
    <div className="tcards">
      {CASES.map((c, i) => (
        <article
          className="tcard reveal"
          key={c.name}
          data-d={i > 0 ? String(i) : undefined}
        >
          <div className="tcard-body">
            <h4>{c.name}</h4>
            <div className="meta">{c.meta}{c.metaGap && <> · <Gap>{c.metaGap}</Gap></>}</div>
            {/* ARJ .af-tcard-body .stars — glyphs, not SVG: 14px, ls 1px */}
            <div className="stars" aria-label="5 out of 5">★★★★★</div>
            <p>{c.story}</p>
            <div className="metrics">
              {c.metrics.map((m) => (
                <p className="metric" key={m.k}>
                  <span className="v">{m.v}</span>
                  <span className="k">{m.k} {m.gap && <Gap>{m.gap}</Gap>}</span>
                </p>
              ))}
            </div>
          </div>
        </article>
      ))}

      {/* ARJ .af-tcard-more — "+1,295 More Transformations". Ours carries the
          only client-count fact we hold (CONFIG.CLIENT_COUNT = 300+). */}
      <article className="tcard tcard-more reveal" data-d="5">
        <div>
          <div className="num">{CONFIG.CLIENT_COUNT}</div>
          <div className="ttl">Women Coached</div>
          <p>Eight of their stories are on this page. The rest stay private.</p>
        </div>
      </article>
    </div>

  </div>
</section>
  );
}
