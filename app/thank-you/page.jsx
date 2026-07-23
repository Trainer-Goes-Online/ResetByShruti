import Link from 'next/link';
import { Ico } from '@/components/Icons';
import Price, { Gap } from '@/components/Price';
import UtilityFooter from '@/components/UtilityFooter';
import { CONFIG } from '@/lib/config';

export const metadata = {
  title: 'Booking Confirmed · Reset by Shruti Solanki',
  robots: { index: false, follow: false },
};

/* ============================================================================
   PAGE 4 · THANK-YOU
   STRUCTURE SOURCE: _reference/teamfitarjun/app/thank-you/ThankYouView.tsx
   Styles: app/sections/p03-thankyou.css (every value cited there).

   ARJ's element order, matched section for section:
     .af-header            → .ty-topbar
     .ty-hero              → .ty-conf (.ty-check + .ty-kicker + .ty-h1 + .ty-sub)
                             .ty-vframe            ← OMITTED, we have no video
                             .ty-form-cta (.ty-donow + .ty-steps)
     .ty-call              → what the call actually does + .ty-goal-box
     .ty-appt              → appointment locked + .ty-receive + .ty-join-note
     .ty-policy            → important, please read once
     .ty-ready             → what to keep ready (6-card grid) + callout
     (ours) .ty-hw         → the three questions — ARJ has no equivalent, and
                             this is the block the page actually exists for
     .ty-final             → pillars + sign-off
     .af-foot              → .ty-foot wrapping the shared <UtilityFooter/>

   DELIBERATELY NOT COPIED FROM ARJ (see the report):
     · the 10-question `.qz-*` diagnostic quiz modal — a product decision, not
       a styling one, and it is not ours to make
     · the thank-you VIDEO — we have no asset, and an empty black box is worse
       than no frame at all
     · ARJ's refund/reschedule policy text — theirs is "no rescheduling, missed
       calls count as completed". Ours is the opposite and is contractual.
     · the sticky CTA bar — its only action here is the WhatsApp handoff, whose
       destination is still [MISSING]. A sticky bar carrying a dead button is
       chrome that costs and returns nothing.

   NO SELLING LETTERS and NO new primary CTA — the calm IS the point, and the
   only KPI on this page is show-up rate.
   ========================================================================== */

/* What the call does. Lifted from COPY.md page 3's approved walk-away
   outcomes — the same three promises she was sold, restated after payment so
   the page confirms rather than re-pitches. */
const GOALS = [
  'An honest read on which of the three — PCOS, thyroid or insulin resistance — is actually holding your weight',
  "The exact thing in your week that's undoing the other six days",
  `Your first ${CONFIG.PROGRAMME_DAYS} days, mapped week by week`,
];

/* COPY.md page 4 · next-steps timeline. Every line here is a promise about
   what her inbox does, so it carries a VERIFY chip until QT.2 is answered. */
const RECEIVE = [
  { i: 'mail', t: 'Calendar invite', s: 'Within 5 minutes of booking' },
  { i: 'chat', t: 'Prep message', s: 'Within 24 hours' },
  { i: 'clock', t: 'Reminder', s: 'One hour before the call' },
  { i: 'user', t: `${CONFIG.CALL_MINUTES} minutes, 1:1`, s: 'With Shruti herself' },
];

/* ARJ runs six. Four are the marker-led items this programme genuinely needs;
   the last two come from COPY.md's approved pre-call homework and show-up
   rules, so nothing here is invented. */
const READY = [
  { i: 'file', t: 'Recent blood reports', b: 'If you have them. Anything from the last 6 months helps — TSH, HbA1c, fasting insulin, vitamin D.' },
  { i: 'pill', t: 'Medications & supplements', b: 'A quick list of what you are currently taking, including doses.' },
  { i: 'clock', t: 'Your real daily routine', b: 'Wake time, work hours, when you actually eat, when you sleep. Not the ideal version.' },
  { i: 'plate', t: 'Typical meals', b: 'Home-cooked and outside food — what you actually eat, not what you think you should say.' },
  { i: 'repeat', t: 'What you have already tried', b: 'The last two or three attempts: what you tried, how long it held, where it broke.' },
  { i: 'chat', t: 'Somewhere quiet to talk', b: 'Not between meetings, not while driving. Camera on if you can.' },
];

/* COPY.md page 4 · pre-call homework. This mirrors §12 of the landing page —
   she diagnoses her own missing mechanism, which primes the call. */
const HOMEWORK = [
  'What did your last two or three attempts look like — what did you try, how long did it hold, and where exactly did it break?',
  'What does a normal Tuesday actually look like, hour by hour?',
  `What would have to be true in ${CONFIG.PROGRAMME_DAYS} days for you to call this worth it?`,
];

/* The trailing space before each <br> is load-bearing: at ≤640px the rule
   hides the <br> (ARJ's own .ty-pillar h5 br{display:none}) and without it the
   two halves weld into "Seeing thewhole overlap". ARJ ships that defect; we
   don't. */
const PILLARS = [
  { i: 'eye', t: <>Seeing the <br />whole overlap</> },
  { i: 'spark', t: <>Changing one <br />thing at a time</> },
  { i: 'clock', t: <>Giving it the <br />full {CONFIG.PROGRAMME_WEEKS} weeks</> },
];

export default function ThankYouPage() {
  const waHref = CONFIG.WHATSAPP_NUMBER
    ? `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(
        'Hi Shruti — I just booked my Reset call. What made me book: '
      )}`
    : undefined;

  return (
    <div className="typg">
      {/* ── HEADER · ARJ .af-header ─────────────────────────────────────── */}
      <header className="ty-topbar">
        <div className="wrap">
          <Link href="/" className="ty-mark" aria-label="Reset by Shruti Solanki — home">
            Reset
          </Link>
        </div>
      </header>

      {/* ── 01 · HERO · ARJ .ty-hero ────────────────────────────────────── */}
      <section className="ty-hero">
        <div className="wrap ty-hero-inner">
          <div className="ty-conf">
            {/* Inlined rather than taken from the sprite: the tick is drawn by
                a stroke-dashoffset animation, so the path must inherit its
                stroke from CSS instead of carrying its own attributes. */}
            <div className="ty-check" aria-hidden="true">
              <svg viewBox="0 0 24 24"><path d="M4 12l5 5L20 6" /></svg>
            </div>
            <div className="ty-conf-text">
              <div className="ty-kicker">Booking Confirmed</div>
              <h1 className="ty-h1">
                Your Call With Shruti Is <span className="ty-accent">Locked In.</span>
              </h1>
              <p className="ty-sub">
                Check your email for the confirmation and your prep checklist. We’ll also WhatsApp
                you the meeting link before the call — save the number when it arrives, that’s how
                we reach you. <Gap>confirm what your system sends · QT.2</Gap>
              </p>
            </div>
          </div>

          {/* ARJ's .ty-vframe sits here — a Vimeo-hosted welcome video. We have
              no such asset (QT.4), and C16 says reserve or omit, never ship an
              empty black box. Omitted. */}

          <div className="ty-form-cta reveal">
            {/* ARJ's strongest beat on this page. A 30-second task is a
                consistency hook and measurably lifts show-up. */}
            <div className="ty-donow">
              <div className="ty-donow-eyebrow">Do One Thing Right Now · Takes 30 Seconds</div>
              <p className="ty-donow-title">
                Message Shruti and tell her one line: what made you book this call.
              </p>
              <p className="ty-donow-sub">
                She reads these personally before your session, so she walks in already knowing
                your situation instead of starting cold.
              </p>
              <a className="ty-cta" href={waHref} aria-disabled={!waHref}>
                <span>Message Shruti on WhatsApp</span>
                <span className="arrow" aria-hidden="true"><Ico id="arrow" className="" /></span>
              </a>
              {!waHref && (
                <span className="ty-cta-gap"><Gap>WhatsApp destination · QT.1</Gap></span>
              )}
            </div>

            <ol className="ty-steps">
              <li>
                <span className="ty-step-num">1</span>
                Reply to the WhatsApp message when it arrives, so we know we’ve reached you.
              </li>
              <li>
                <span className="ty-step-num">2</span>
                Note down your last two or three attempts: what you tried, how long it held, and
                where exactly it broke.
              </li>
              <li>
                <span className="ty-step-num">3</span>
                Take the call from a quiet place, camera on if possible. {CONFIG.CALL_MINUTES}{' '}
                focused minutes beats an hour of distracted ones.
              </li>
            </ol>
          </div>
        </div>
      </section>

      {/* ── 02 · WHAT THIS CALL WILL DO · ARJ .ty-call ──────────────────── */}
      <section className="ty-call">
        <div className="ty-narrow">
          <div className="reveal">
            <span className="ty-sec-label">
              What This Call Will <span className="acc">Actually</span> Do
            </span>
          </div>
          <h2 className="reveal" data-d="1">
            This is <span className="ty-accent">not a generic consultation.</span>
          </h2>
          <p className="reveal" data-d="2">
            Shruti looks at how your <strong>markers, your routine and your real week interact</strong>{' '}
            — not at how any one of them reads on paper.
          </p>
          <div className="ty-goal-box reveal" data-d="3">
            <div className="lead">You walk away with:</div>
            <ul>
              {GOALS.map((g) => <li key={g}>{g}</li>)}
            </ul>
          </div>
        </div>
      </section>

      {/* ── 03 · APPOINTMENT LOCKED · ARJ .ty-appt ──────────────────────── */}
      <section className="ty-appt">
        <div className="wrap">
          <div className="ty-appt-card reveal">
            <div className="ty-appt-icon" aria-hidden="true"><Ico id="calendar" className="" /></div>
            <h2>Your Appointment Is <span>Locked</span></h2>
            <p>
              Your 1:1 session is scheduled. The date and time you picked are confirmed — nothing
              else is needed from you right now.
            </p>
            <span className="ty-receive-lbl">What You’ll Receive</span>
            <ul className="ty-receive">
              {RECEIVE.map((r) => (
                <li key={r.t}>
                  <span className="ic" aria-hidden="true"><Ico id={r.i} className="" /></span>
                  <span className="tx">{r.t}<small>{r.s}</small></span>
                </li>
              ))}
            </ul>
            <div className="ty-join-note">
              Please join <strong>5 minutes before your scheduled time</strong> so the{' '}
              {CONFIG.CALL_MINUTES} minutes are all yours.{' '}
              <Gap>confirm the delivery timings above · QT.2</Gap>
            </div>
          </div>
        </div>
      </section>

      {/* ── 04 · IMPORTANT · ARJ .ty-policy ─────────────────────────────
          ⚠ ARJ's terms here are strict — no rescheduling, missed calls treated
          as completed. Ours are contractual and different, so only the SHELL
          is ARJ's. The ₹97 is refundable if the call does not happen or she
          finishes it unsatisfied. Nothing is stated about the programme fee. */}
      <section className="ty-policy">
        <div className="wrap">
          <div className="ty-policy-card reveal">
            <div className="ty-policy-head">
              <div className="ic" aria-hidden="true"><Ico id="info" className="" /></div>
              <h2>
                Before The Call
                <small>Please read once</small>
              </h2>
            </div>
            <p>
              This is a <strong>personal, time-blocked session</strong> — the slot is held for you
              and nobody else. Three things worth knowing:
            </p>
            <ul className="ty-policy-list">
              <li>
                <span className="mk" aria-hidden="true"><Ico id="check" className="" /></span>
                <span>
                  Rescheduling is for genuine emergencies. Tell us as early as you can.{' '}
                  <Gap>how she requests one, and to whom · QB.4</Gap>
                </span>
              </li>
              <li>
                <span className="mk" aria-hidden="true"><Ico id="check" className="" /></span>
                <span>
                  Your <Price /> comes back to you if the call does not happen, or if you finish it
                  and it was not worth your time.
                </span>
              </li>
              <li>
                <span className="mk" aria-hidden="true"><Ico id="check" className="" /></span>
                <span>
                  Be honest on the call, including about the parts you would rather skip. That is
                  the whole difference between a useful {CONFIG.CALL_MINUTES} minutes and a polite one.
                </span>
              </li>
            </ul>
            <div className="ty-policy-foot">
              <Ico id="lock" className="" />
              Your slot has been reserved specifically for you.
            </div>
          </div>
        </div>
      </section>

      {/* ── 05 · WHAT TO KEEP READY · ARJ .ty-ready ─────────────────────── */}
      <section className="ty-ready">
        <div className="wrap">
          <div className="ty-ready-head reveal">
            <h2>What To Keep Ready <span>Before The Call</span></h2>
            <p>
              To make the session worth its {CONFIG.CALL_MINUTES} minutes, have this to hand. You do{' '}
              <strong>not</strong> need perfect data. <Gap>confirm this list · QT.3</Gap>
            </p>
          </div>
          <div className="ty-ready-grid">
            {READY.map((r, n) => (
              <div className="ty-ready-item reveal" data-d={String((n % 3) + 1)} key={r.t}>
                <div className="ic" aria-hidden="true"><Ico id={r.i} className="" /></div>
                <h4>{r.t}</h4>
                <p>{r.b}</p>
              </div>
            ))}
          </div>
          <div className="ty-ready-callout reveal">
            <p>
              We work with <em>your actual life</em>, not ideal conditions. Bring what is true for
              you today.
            </p>
          </div>
        </div>
      </section>

      {/* ── 06 · THE THREE QUESTIONS ────────────────────────────────────
          ARJ has no equivalent block. This is the commitment device and the
          real reason this page exists, so it gets ARJ's .ty-call anatomy on
          the white surface rather than being demoted to a footnote. */}
      <section className="ty-hw">
        <div className="ty-narrow">
          <div className="reveal">
            <span className="ty-sec-label">
              Three Questions To <span className="acc">Sit With</span>
            </span>
          </div>
          <h2 className="reveal" data-d="1">
            Answer these before we speak, <span className="ty-accent">even roughly.</span>
          </h2>
          <p className="reveal" data-d="2">
            You do not have to write anything down. Thinking them through once is enough — it is
            what turns the first ten minutes of the call from history-taking into work.
          </p>
          <div className="ty-goal-box reveal" data-d="3">
            <div className="lead">Before your call:</div>
            <ul>
              {HOMEWORK.map((h) => <li key={h}>{h}</li>)}
            </ul>
          </div>
        </div>
      </section>

      {/* ── 07 · FINAL NOTE · ARJ .ty-final ─────────────────────────────── */}
      <section className="ty-final">
        <div className="wrap ty-final-inner">
          <h2 className="reveal">This Isn’t About Getting It <em>Perfect.</em></h2>
          <p className="reveal" data-d="1">
            It is about three unglamorous things that compound into a body that responds again:
          </p>
          <div className="ty-pillars">
            {PILLARS.map((p, n) => (
              <div className="ty-pillar reveal" data-d={String(n + 2)} key={p.i}>
                <div className="ic" aria-hidden="true"><Ico id={p.i} className="" /></div>
                <h5>{p.t}</h5>
              </div>
            ))}
          </div>
          <div className="ty-sign-off reveal" data-d="5">
            <p>Come as you actually are. Say the parts you would rather not.</p>
            <p className="strong">The rest is our job.</p>
          </div>
        </div>
      </section>

      {/* ── 08 · FOOTER · ARJ .af-foot ──────────────────────────────────── */}
      <footer className="ty-foot">
        <div className="wrap">
          <UtilityFooter />
        </div>
      </footer>
    </div>
  );
}
