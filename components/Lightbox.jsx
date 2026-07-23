import { Ico } from './Icons';

/* C15 · OVERLAY AT THE PAGE ROOT.
   Rendered from the layout, outside every section. A modal authored inside a
   decorated section is trapped by that section's stacking context and gets
   painted over by the sticky CTA bar — invisible on desktop, and it TRAPS the
   user on mobile where the chrome is proportionally huge.
   Behaviour lives in FunnelEffects (delegated), so this stays a server component. */
export default function Lightbox() {
  return (
    <div className="overlay" id="lightbox" role="dialog" aria-modal="true" aria-label="Media viewer">
      <div className="overlay-bg" />
      <button className="overlay-close" aria-label="Close"><Ico id="x" /></button>
      <div className="overlay-inner" />
    </div>
  );
}
