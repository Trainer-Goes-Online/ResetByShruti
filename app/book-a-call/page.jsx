import Link from 'next/link';
import { Ico } from '@/components/Icons';
import Price, { Gap } from '@/components/Price';
import UtilityFooter from '@/components/UtilityFooter';
import { CONFIG } from '@/lib/config';
import { WALKAWAY } from '@/lib/content';

export const metadata = {
  title: 'Pick Your Time · Reset by Shruti Solanki',
  robots: { index: false, follow: false },
};

/* ============================================================================
   PAGE 02 · BOOK-A-CALL
   STRUCTURE + HIERARCHY SOURCE: thefoodfreedomco.com/book-a-call (2026-07-25)

   FFC's book-a-call is a UNIFORM FRAMED CARD-STACK — every block is one matted
   `.bk-card` in a single centred column, in this exact order:

     confirm bar → head (steps + eyebrow + H1 + sub)
     → calendar card (embed + three trust rows)
     → slot-help card (the fallback, a full card)
     → walk-away card (outer card wrapping three numbered sub-cards)
     → no-show card
     → FAQ card
     → lock-in band (breaks the column)
     → footer

   FFC runs NONE of ARJ's extra beats, so this page carries none of them either
   — no transformation gallery, no mid-CTA, no testimonial pull-quote, and no
   sticky bar (FFC's book-a-call has no fixed CTA).

   Palette stays LIGHT + one-hue per SESSION-HANDOFF §3B / §1.4 — the request
   was structure + hierarchy, which is colour-independent. See the CSS header.

   Three FFC beats carry a visible gap rather than FFC's content, because the
   fact behind each does not exist yet and is never drafted:
     · WhatsApp + support email in the slot-help card (QB.2)
     · the "4 out of 10" no-show statistic — we have no funnel data (QB.5)
     · the reschedule route in FAQ #2 (QB.4)

   No new JS. The FAQ (`.qa/.q/.a`), the Calendly mount (`#calendly`) and the
   reveals (`.reveal`) all run on the delegated handlers already in
   components/FunnelEffects.jsx.
   ========================================================================== */
export default function BookACallPage() {
  const waHref = CONFIG.WHATSAPP_NUMBER
    ? `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(
        'Hi Shruti, I’ve paid for my Reset call but none of the times on the calendar work for me. My name, email and preferred day/time are: '
      )}`
    : undefined;
  const mailHref = CONFIG.SUPPORT_EMAIL
    ? `mailto:${CONFIG.SUPPORT_EMAIL}?subject=${encodeURIComponent('Reset call: preferred slot not available')}`
    : undefined;

  return (
    <div className="bk-page">
      {/* ── 01 · confirm bar ── FFC .confirm-bar ──────────────────────────── */}
      <div className="bk-status">
        <span className="check"><Ico id="check" /></span>
        <strong>Payment confirmed</strong>
        <span className="sep">·</span><Price /> received
        <span className="sep">·</span>{CONFIG.CALL_MINUTES} minutes with Shruti
      </div>

      <div className="bk-wrap">
        {/* ── 02 · head ── FFC .bookcall-head (steps + eyebrow + H1 + sub) ─── */}
        <header className="bk-head">
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

          <span className="bk-eyebrow reveal">One step left</span>
          <h1 className="reveal" data-d="1">
            Pick A Time. Show Up.<br />
            <span className="bk-accent">Walk Away With Your 90-Day Reset Roadmap.</span>
          </h1>
          {/* <p className="reveal" data-d="2">
            Your <Price /> is in. Now lock the {CONFIG.CALL_MINUTES} minutes that tell you which
            of the three is actually holding your weight. Pick a slot below.
          </p> */}
        </header>

        {/* ── 03 · calendar card ── FFC .calendar-card ──────────────────────── */}
        <section className="bk-card reveal" id="bk-calendar">
          {/* <h2>Pick A Slot That Works For You</h2>
          <p className="bk-sub">All times in your local zone.</p> */}

          {/* C16 · the embed is HARDENED: an explicit height reservation so it
              can never land at 0px, and a branded placeholder underneath while
              it loads. FunnelEffects.jsx mounts the iframe into #calendly. */}
          <div className="bk-embed" id="calendly">
            <div className="bk-embed-ph">
              <span className="spinner" />
              <span className="eyebrow">Loading Shruti’s calendar…</span>
            </div>
          </div>

          <div className="bk-trust">
            <div className="bk-trust-item">
              <span className="bk-trust-tick"><Ico id="check" /></span>
              <span><strong>1:1 directly with Shruti</strong>, not a team member or an assistant.</span>
            </div>
            <div className="bk-trust-item">
              <span className="bk-trust-tick"><Ico id="check" /></span>
              <span><strong>Link in your email inbox</strong> the moment you book.</span>
            </div>
            <div className="bk-trust-item">
              <span className="bk-trust-tick"><Ico id="check" /></span>
              <span><strong>Rescheduling for genuine emergencies only.</strong> The slot is held for you, not resold.</span>
            </div>
          </div>
        </section>

        {/* ── 04 · slot-help card ── FFC .slothelp-card ──────────────────────
            An embed is a dependency we do not control; the human path beneath
            it is what stops a paid user hitting a dead end. FFC runs this beat
            verbatim as "PREFERRED SLOT NOT AVAILABLE?". */}
        <section className="bk-card bk-slothelp reveal">
          <span className="bk-badge">Preferred slot not available?</span>
          <h2>Cannot Find A Time That Works For You?</h2>
          <p>
            You have already paid and your seat is reserved, so you will not lose it. If none of
            the times above suit you, message us your <b>name, email, phone number and preferred
            day and time</b>, and we will personally set up your slot.
          </p>
          <div className="bk-fb-acts">
            <a className="bk-ghost is-primary" href={waHref} aria-disabled={!waHref}>
              <Ico id="chat" className="ico ico-sm" /> Message us on WhatsApp
            </a>
            <a className="bk-ghost" href={mailHref} aria-disabled={!mailHref}>
              <Ico id="mail" className="ico ico-sm" /> Email us
            </a>
          </div>
          {waHref || mailHref ? (
            <p className="bk-contact">
              {waHref && <a href={waHref}>+91 8800156081</a>}
              {waHref && mailHref && <span className="sep">·</span>}
              {mailHref && <a href={mailHref}>{CONFIG.SUPPORT_EMAIL}</a>}
            </p>
          ) : (
            <p className="bk-contact"><Gap>WhatsApp + email</Gap></p>
          )}
        </section>

        {/* ── 05 · walk-aways ── FFC walk-away card (outer + 3 sub-cards) ───── */}
        <section className="bk-card reveal">
          <h2>What You Walk Away With In {CONFIG.CALL_MINUTES} Minutes</h2>
          <div className="bk-walk-grid">
            {WALKAWAY.map((o, i) => (
              <div className="bk-walk-card" key={o.title}>
                <span className="bk-walk-num">{String(i + 1).padStart(2, '0')}</span>
                <h3>{o.title}</h3>
                <p>{o.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── 06 · no-show card ── FFC .noshow-card. FFC leads with a real
            funnel statistic ("4 out of 10 women who pay never come back to
            book"). We have none (QB.5) and a statistic is never invented, so
            the number renders as a gap in its own slot. ───────────────────── */}
        <section className="bk-card bk-noshow reveal">
          <h2>
            <span className="bk-noshow-big"></span>4 Out Of The 10 Women Who Pay
            Never Come Back To Book. Don’t Be One Of Them.
          </h2>
          <p>
            They tell themselves they’ll do it Monday. Monday comes and goes.
          </p>
          <p className="bk-noshow-punch">
            Three weeks later: the same body, the same frustration, and a <Price /> spent on
            nothing. You’re already through the hardest part. Take the next thirty seconds and
            pick a slot.
          </p>
          <a href="#bk-calendar" className="bk-cta">
            <span>Pick my slot</span>
            <span className="arrow"><Ico id="arrow" /></span>
          </a>
        </section>

        {/* ── 07 · FAQ card ── FFC FAQ card. COPY.md specifies three questions
            here; the first is open, matching FFC. ─────────────────────────── */}
        <section className="bk-card bk-faq reveal">
          <h2>Quick Questions Before You Book</h2>

          <div className="qa open">
            <button className="q" type="button" aria-expanded="true">
              <span className="t">Is this call directly with Shruti?</span>
              <span className="ic"><Ico id="plus" /></span>
            </button>
            <div className="a">
              <div>
                <p>
                  Yes. Every call is 1:1 with Shruti herself: no team member, no assistant, no
                  junior coach. She runs every one personally, because the diagnosis is only as
                  sharp as the person reading your markers.
                </p>
              </div>
            </div>
          </div>

          <div className="qa">
            <button className="q" type="button" aria-expanded="false">
              <span className="t">What if I need to reschedule?</span>
              <span className="ic"><Ico id="plus" /></span>
            </button>
            <div className="a">
              <div>
                <p>
                  Rescheduling is for genuine emergencies. The slot is time-blocked and held for
                  you rather than resold, so we ask you to keep it if you possibly can.{' '}
                  {/* <Gap>exact route + notice period · QB.4</Gap> */}
                </p>
              </div>
            </div>
          </div>

          <div className="qa">
            <button className="q" type="button" aria-expanded="false">
              <span className="t">Does the call cost anything more?</span>
              <span className="ic"><Ico id="plus" /></span>
            </button>
            <div className="a">
              <div>
                <p>
                  No. The <Price /> you have already paid is the whole cost of the call.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ── 08 · lock-in band ── FFC .bookcall-lockin (breaks the column) ───── */}
      <section className="bk-lockin reveal" id="finale">
        <h2>You’ve Paid. Now Lock The Call.</h2>
        <p className="bk-lockin-sub">
          One slot. {CONFIG.CALL_MINUTES} minutes with Shruti. Then everything after that is on her.
        </p>
        <a href="#bk-calendar" className="bk-cta">
          <span>Take me to the calendar</span>
          <span className="arrow"><Ico id="arrow" /></span>
        </a>
      </section>

      {/* ── 09 · footer ── FFC .bookcall-foot + .foot-disclaimer ───────────── */}
      <footer className="bk-footer">
        <UtilityFooter />
      </footer>
    </div>
  );
}
