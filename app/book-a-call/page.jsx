import Link from 'next/link';
import { Ico } from '@/components/Icons';
import Price, { Gap } from '@/components/Price';
import UtilityFooter from '@/components/UtilityFooter';
import { CONFIG } from '@/lib/config';
import { WALKAWAY, CASES } from '@/lib/content';

export const metadata = {
  title: 'Pick Your Time · Reset by Shruti Solanki',
  robots: { index: false, follow: false },
};

/* ============================================================================
   PAGE 02 · BOOK-A-CALL
   STRUCTURE SOURCE: _reference/teamfitarjun/app/book-a-call/BookACallView.tsx

   ARJ's element order, matched one for one:
     .bk-status → .bk-header/.bk-logo → .bk-steps → .bk-hero → .bk-cal (+embed
     +.bk-trust) → .bk-trans gallery → .bk-mid CTA → .bk-walk ×3 → .bk-loss
     show-up panel → testimonial card → .bk-faq → .bk-final → .bk-footer
     → .bk-sticky

   Ours adds ONE beat ARJ does not run — the human fallback welded directly
   under the embed. An embed is a dependency we do not control; shipping it as
   the only path forward ships a dead end at the moment she has already paid.

   Three ARJ beats carry a visible gap rather than ARJ's content, because the
   fact behind them does not exist yet and is never drafted:
     · the transformation gallery  — consent + PII pass outstanding (Q14.1)
     · the 38% no-show statistic   — we have no funnel data (QB.5)
     · the pull-quote testimonial  — replaced by a REAL written case file

   The money is already taken. This page is not more selling — every beat
   protects the show-up rate, which is where these funnels actually leak.

   No new JS. The FAQ (`.qa/.q/.a`), the Calendly mount (`#calendly`), the
   reveals (`.reveal`) and the sticky bar (`#stickycta` + `#hero` + `#finale`)
   all run on the delegated handlers already in components/FunnelEffects.jsx.
   ========================================================================== */
export default function BookACallPage() {
  const waHref = CONFIG.WHATSAPP_NUMBER
    ? `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(
        'Hi Shruti — I’ve paid for my Reset call but none of the times on the calendar work for me. My name, email and preferred day/time are: '
      )}`
    : undefined;
  const mailHref = CONFIG.SUPPORT_EMAIL
    ? `mailto:${CONFIG.SUPPORT_EMAIL}?subject=${encodeURIComponent('Reset call — preferred slot not available')}`
    : undefined;

  /* The reference runs a drafted pull-quote here. A testimonial is never
     written for the client — this is a real case file from lib/content.js. */
  const caseFile = CASES[1];

  return (
    <div className="bk-page">
      {/* ── 01 · status bar ── ARJ .bk-status ─────────────────────────────── */}
      <div className="bk-status">
        <span className="check"><Ico id="check" /></span>
        <strong>Payment confirmed</strong>
        <span className="sep">·</span>1 step left
        <span className="sep">·</span>{CONFIG.CALL_MINUTES} min with Shruti
      </div>

      {/* ── 02 · logo header ── ARJ .bk-header. No logo asset exists (QB.6),
             so the same chip carries a wordmark. ────────────────────────────── */}
      <header className="bk-header">
        <Link href="/" className="bk-logo" aria-label="Reset by Shruti Solanki — home">
          <span className="bk-logo-mark">
            <b>Reset</b>
            <i>by Shruti Solanki</i>
          </span>
        </Link>
      </header>

      <div className="bk-wrap">
        {/* ── 03 · step indicator ── ARJ .bk-steps ───────────────────────── */}
        <div className="bk-steps reveal">
          <div className="bk-step done">
            <span className="num"><Ico id="check" /></span>
            <span>Paid</span>
          </div>
          <div className="bk-line" />
          <div className="bk-step active">
            <span className="num">2</span>
            <span>Book call</span>
          </div>
        </div>

        {/* ── 04 · hero ── ARJ .bk-hero. #hero is the anchor the shared sticky
               handler measures against. ───────────────────────────────────── */}
        <section className="bk-hero" id="hero">
          <div className="bk-hero-inner">
            <span className="bk-eyebrow reveal">One step left</span>
            <h1 className="reveal" data-d="1">
              Pick A Time. Show Up.<br />
              <span className="bk-accent">Walk Away With Your 90-Day Reset Roadmap.</span>
            </h1>
            <p className="reveal" data-d="2">
              Your <Price /> is in. Now lock the {CONFIG.CALL_MINUTES} minutes that tell you which
              of the three is actually holding your weight. Pick a slot below.
            </p>
          </div>
        </section>

        {/* ── 05 · calendar card ── ARJ .bk-cal ──────────────────────────── */}
        <section className="bk-cal reveal" id="bk-calendar">
          <h2>Pick A Slot That Works For You</h2>
          <p className="bk-cal-sub">All times in your local zone.</p>

          {/* C16 · the embed is HARDENED: an explicit height reservation so it
              can never land at 0px, and a branded placeholder underneath while
              it loads. FunnelEffects.jsx mounts the iframe into #calendly. */}
          <div className="bk-embed" id="calendly">
            <div className="bk-embed-ph">
              <span className="spinner" />
              <span className="eyebrow">Loading Shruti’s calendar…</span>
            </div>
          </div>

          {/* Three ✓ trust lines — both references run exactly these three. */}
          <div className="bk-trust">
            <div className="bk-trust-item">
              <span className="bk-trust-tick"><Ico id="check" /></span>
              <span><strong>1:1 directly with Shruti.</strong> Not a team member, not an assistant.</span>
            </div>
            <div className="bk-trust-item">
              <span className="bk-trust-tick"><Ico id="check" /></span>
              <span><strong>Link in your inbox</strong> the moment you book. <Gap>platform · QB.3</Gap></span>
            </div>
            <div className="bk-trust-item">
              <span className="bk-trust-tick"><Ico id="check" /></span>
              <span><strong>Emergencies only</strong> for rescheduling — the slot is held for you, not resold. <Gap>route · QB.4</Gap></span>
            </div>
          </div>
        </section>

        {/* ── 05b · human fallback weld (not in ARJ; FFC runs it verbatim) ── */}
        <div className="bk-fallback reveal">
          <p className="bk-fb-title">Preferred slot not available?</p>
          <p>
            You have already paid and your seat is reserved, so you will not lose it. If none of
            the times above suit you, message us your name, email, phone number and preferred day
            and time, and we will personally set up your slot.
          </p>
          <div className="bk-fb-acts">
            <a className="bk-ghost" href={waHref} aria-disabled={!waHref}>
              <Ico id="chat" className="ico ico-sm" /> Message us on WhatsApp
            </a>
            <a className="bk-ghost" href={mailHref} aria-disabled={!mailHref}>
              <Ico id="mail" className="ico ico-sm" /> Email us
            </a>
          </div>
          {(!waHref || !mailHref) && <p style={{ marginTop: 12, marginBottom: 0 }}><Gap>WhatsApp + email · QB.2</Gap></p>}
        </div>

        {/* ── 06 · transformation strip ── ARJ .bk-trans runs a dual-row
               before/after marquee. Ours holds the slot; the images stay out
               until consent and the PII pass land. ────────────────────────── */}
        <section className="bk-trans">
          <h2 className="reveal">Before &amp; After <span className="bk-accent">Transformations</span></h2>
          <p className="bk-trans-sub reveal" data-d="1">
            Real women. Real markers. Real weeks that had to keep working.
          </p>
          <div className="bk-trans-hold reveal" data-d="2">
            <Gap>before/after gallery — client consent + PII pass · Q14.1</Gap>
            <p>
              Fourteen client screenshots are on file. None of them publishes until every woman in
              them has given consent and names, numbers and faces have been cleared.
            </p>
          </div>
        </section>

        {/* ── 07 · mid CTA ── ARJ .bk-mid ────────────────────────────────── */}
        <section className="bk-mid">
          <h3 className="reveal">
            They were stuck in exactly this place too. Then they <span className="bk-accent">picked a slot.</span>
          </h3>
          <a href="#bk-calendar" className="bk-cta reveal" data-d="1">
            <span>Pick my slot</span>
            <span className="arrow"><Ico id="arrow" /></span>
          </a>
        </section>

        {/* ── 08 · walk-aways ── ARJ .bk-walk ────────────────────────────── */}
        <section className="bk-walk">
          <h2 className="reveal">
            What you walk away with in <span className="bk-accent">{CONFIG.CALL_MINUTES} minutes</span>
          </h2>
          <div className="bk-walk-grid">
            {WALKAWAY.map((o, i) => (
              <div className="bk-walk-card reveal" data-d={i + 1} key={o.title}>
                <span className="bk-walk-num">{String(i + 1).padStart(2, '0')}</span>
                <h3>{o.title}</h3>
                <p>{o.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── 09 · show-up panel ── ARJ .bk-loss leads with a real funnel
               statistic. We have none (QB.5) and a statistic is never
               invented, so the number renders as a gap in its own slot. ───── */}
        <section className="bk-loss reveal">
          <h2>
            <span className="bk-loss-big"><Gap>no-show % · QB.5</Gap></span> of the women who pay
            never come back to pick a slot.<br />Don’t be one of them.
          </h2>
          <p>
            Most people who pay and don’t book immediately tell themselves they’ll do it Monday.
            Monday comes and goes.
          </p>
          <p className="bk-loss-punch">
            Three weeks later: the same body, the same frustration, and a <Price /> that bought
            nothing.
          </p>
          {/* No countdown here, deliberately. The 3-hour clock belongs to the
              pre-payment page; after she has paid, a ticking timer reads as
              pressure at the moment we owe her relief. */}
          <div>
            <a href="#bk-calendar" className="bk-cta bk-cta-large">
              <span>Pick my slot</span>
              <span className="arrow"><Ico id="arrow" /></span>
            </a>
          </div>
        </section>

        {/* ── 10 · client file ── ARJ .bk-testimonial is a drafted pull-quote.
               A testimonial is never written for the client; this is a real
               case file, in its own voice, in the same slot. ──────────────── */}
        <section className="bk-case reveal">
          <span className="bk-case-label">Client file</span>
          <p className="bk-case-body">{caseFile.story}</p>
          <ul className="bk-case-metrics">
            {caseFile.metrics.map((m) => (
              <li key={m.k}>
                <b>{m.v}</b> {m.k}
                {m.gap ? <Gap>{m.gap}</Gap> : null}
              </li>
            ))}
          </ul>
          <p className="bk-case-author">
            <strong>{caseFile.name}</strong> &nbsp;·&nbsp; {caseFile.meta}
            {caseFile.metaGap ? <> &nbsp;<Gap>{caseFile.metaGap}</Gap></> : null}
          </p>
        </section>

        {/* ── 11 · FAQ ── ARJ .bk-faq. COPY.md specifies three questions here;
               the first is open, matching both references. ────────────────── */}
        <section className="bk-faq">
          <h2 className="reveal">Three quick questions before you book</h2>

          <div className="qa open reveal">
            <button className="q" type="button" aria-expanded="true">
              <span className="t">Is this call directly with Shruti?</span>
              <span className="ic"><Ico id="plus" /></span>
            </button>
            <div className="a">
              <div>
                <p>
                  Yes. Every call is 1:1 with Shruti herself — no team member, no assistant, no
                  junior coach. She runs every one personally, because the diagnosis is only as
                  sharp as the person reading your markers.
                </p>
              </div>
            </div>
          </div>

          <div className="qa reveal" data-d="1">
            <button className="q" type="button" aria-expanded="false">
              <span className="t">What if I need to reschedule?</span>
              <span className="ic"><Ico id="plus" /></span>
            </button>
            <div className="a">
              <div>
                <p>
                  Rescheduling is for genuine emergencies. The slot is time-blocked and held for
                  you rather than resold, so we ask you to keep it if you possibly can.{' '}
                  <Gap>exact route + notice period · QB.4</Gap>
                </p>
              </div>
            </div>
          </div>

          <div className="qa reveal" data-d="2">
            <button className="q" type="button" aria-expanded="false">
              <span className="t">Does the call cost anything more?</span>
              <span className="ic"><Ico id="plus" /></span>
            </button>
            <div className="a">
              <div>
                <p>
                  No. The <Price /> you have already paid is the whole cost of the call, and it
                  comes back to you if the call does not happen or you finish it and it was not
                  worth your time. If Reset is a fit, Shruti will walk you through the programme
                  at the end — you will not be asked to commit to anything on the call itself.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── 12 · final CTA ── ARJ .bk-final. #finale is what tells the shared
               sticky handler to stand down. ──────────────────────────────── */}
        <section className="bk-final reveal" id="finale">
          <h2>You’ve paid. Now <span className="bk-accent">lock the call.</span></h2>
          <p>One slot. {CONFIG.CALL_MINUTES} minutes with Shruti. Everything after that is on her.</p>
          <a href="#bk-calendar" className="bk-cta bk-cta-large">
            <span>Take me to the calendar</span>
            <span className="arrow"><Ico id="arrow" /></span>
          </a>
        </section>
      </div>

      {/* ── 13 · footer ── ARJ .bk-footer plate around the shared legal block. */}
      <footer className="bk-footer">
        <UtilityFooter />
      </footer>

      {/* ── 14 · sticky CTA ── ARJ .bk-sticky ──────────────────────────────── */}
      <div className="bk-sticky" id="stickycta">
        <div className="bk-sticky-label">
          <strong>Pick your slot</strong>
          <span>{CONFIG.CALL_MINUTES} minutes with Shruti, then you’re done.</span>
        </div>
        <a href="#bk-calendar" className="bk-cta">
          <span>Book now</span>
        </a>
      </div>
    </div>
  );
}
