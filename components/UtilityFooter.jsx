import Link from 'next/link';

/* Both reference funnels repeat the full legal block on every post-conversion
   page, not just the landing page. Razorpay requires the three policy links to
   be reachable from the checkout flow. */
export default function UtilityFooter() {
  return (
    <div className="u-footer">
      <p className="eyebrow">Shruti Solanki · The Overlap Reset</p>
      <div className="links">
        <Link href="/privacy">Privacy</Link>
        <Link href="/terms">Terms</Link>
        <Link href="/refund-policy">Refund</Link>
      </div>
      <p className="disclaimer">
        All content, systems and coaching services provided by Reset are intended for educational
        and informational purposes only and do not guarantee specific results. This is not medical
        advice. PCOS and thyroid conditions are managed, not cured. Always consult a qualified
        healthcare professional before making changes to your diet, exercise or lifestyle. Client
        results vary based on individual factors.
      </p>
      <p className="cr" style={{ marginTop: 12, fontFamily: 'var(--f-mono)', fontSize: 10, letterSpacing: '.09em', color: 'var(--ink-3)' }}>
        © 2026 Reset by Shruti Solanki. All rights reserved.
      </p>
    </div>
  );
}
