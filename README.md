# Reset by Shruti Solanki — VSL funnel

Four-page conversion funnel for a PCOS / thyroid / insulin-resistance coaching practice.
A ₹97 refundable booking fee buys a 30-minute 1:1 diagnostic call; the 12-week programme is
sold on that call, never on the page.

**Stack:** Next.js 16 (App Router) · React 19 · JavaScript · no CSS framework.

---

## Quick start

```bash
npm install
cp .env.example .env.local     # fill in the values you have
npm run dev                    # http://localhost:3000
```

> ⚠ `NEXT_PUBLIC_*` variables are baked into the bundle at build/start, **not** read at
> runtime. After editing `.env.local`, **restart the dev server** — otherwise you will see a
> stale value and conclude the change did not work.

| Route | Purpose |
|---|---|
| `/` | Landing page — 9 sections, 5 repeated CTA blocks |
| `/checkout` | ₹97 booking fee. **Razorpay is not wired yet (QC.1)** — the form advances to `/book-a-call` so the flow is previewable. It is not a payment. |
| `/book-a-call` | Calendly embed, hardened, with a human fallback welded beneath it |
| `/thank-you` | Confirmation + pre-call homework. Optimised for show-up rate, not for selling. |

---

## Architecture

```
app/
  layout.jsx          fonts, icon sprite, root overlay, behaviour mount
  globals.css         the entire design system — tokens + every component
  page.jsx            landing page: composition only
  checkout/ book-a-call/ thank-you/
components/
  sections/S01…S09    one component per landing-page section
  CtaBlock.jsx        THE repeated CTA block — built once, placed 5×
  FunnelEffects.jsx   'use client' — ALL behaviour, via event delegation
  Icons.jsx           one bespoke SVG family
  Price.jsx           <Price/> and <Gap/>
lib/
  config.js           single source for price, URLs, proof numbers (reads env)
  content.js          copy + proof data as arrays
public/img/           derived, web-sized assets only
```

**Almost everything is a server component.** The only client files are `FunnelEffects.jsx` and
`checkout/CheckoutForm.jsx`. Sections render as real HTML before any JS runs, which is what
makes reveal-on-scroll *fail open* — if the JS never executes, the page is still complete and
every CTA still works.

---

## Design system

One brand hue plus white, following the reference standard the funnel is modelled on.

**`--brand` at the top of `app/globals.css` is the only colour you edit.** The full ramp, ink,
borders, background grid, alternating bands, button gradient and shadows are all derived from
it with `color-mix()`. Ten candidate hues are listed in the comment above it.

Structure, hierarchy, type scale, spacing and animation are matched to a live reference funnel
(`teamfitarjun.com`) — measured from its source, not approximated. Rationale and the token
mapping are in `design-system.project.md`.

---

## Honesty rules baked into the code

This funnel makes health claims to real people, so the codebase enforces a rule: **no fact is
ever invented.** Client counts, ratings, geographies, credentials, testimonials, refund terms
and statistics come from the client or they do not ship.

Anything missing renders as a visible `<Gap>` chip on screen, keyed to a numbered question in
`QUESTIONS-FOR-CLIENT.txt`. That is deliberate — a hole you can see is safer than a plausible
number you cannot verify. **A testimonial is never drafted.**

Currently outstanding: the VSL video, star rating, years coaching, geography, kg range,
Shruti's own story and credentials, the video→client mapping, and Razorpay keys.

---

## ⚠ Before this goes live

- [ ] **Consent + PII pass on `public/img/chat/*`** (Q14.1). These are real client WhatsApp
      messages and progress shots. At least one shows a sender's initials. **Blocking.**
- [ ] Wire Razorpay (QC.1)
- [x] ~~Create `/privacy`, `/terms`, `/refund-policy`~~ — done, plus `/contact`.
      **All four are DRAFTS pending legal review, and carry visible gaps for the
      registered entity, address, grievance officer and jurisdiction (QL.1–QL.12).
      Razorpay verification will fail until those are filled and the site is on a
      real domain.**
- [ ] Legal review of the medical disclaimer (Q20.1)
- [ ] Define the "80–85% success rate" claim or remove it (Q8.1)
- [ ] Supply the VSL (Q6.1) and re-derive images to WebP

---

## Docs

| File | What it holds |
|---|---|
| `COPY.md` | Every approved line, annotated with its conversion job |
| `QUESTIONS-FOR-CLIENT.txt` | The open questions, grouped by section, ★-ranked |
| `ASSETS.md` | Media inventory, CDN URLs, derivation notes |
| `BUILD-NOTES.md` | Build history, bugs found, declared placeholders |
| `design-system.project.md` | Palette override and its rationale |
| `SESSION-HANDOFF.md` | How the parallel build sessions were briefed |

Client videos stream from a DigitalOcean CDN and are **not** in this repo — see `ASSETS.md`.
Raw source media lives in `_source/` locally and is gitignored (453 MB).
