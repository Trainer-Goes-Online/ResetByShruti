# SESSION HANDOFF — Reset by Shruti Solanki · VSL funnel

**You are one of twelve parallel Claude Code sessions**, split across two tracks:

| Track | Sessions | Each owns |
|---|---|---|
| **A · Landing page** | 1–9 | one landing-page SECTION |
| **B · Post-conversion pages** | `checkout` · `book-a-call` · `thank-you` | one WHOLE page |

**The only input you will be given is your assignment** — a section number (`3`) or a page
name (`checkout`). Everything else is in this file. Read it end to end before touching
anything.

Track A sessions: read §3 then your brief in §8.
Track B sessions: read §3B then your brief in §8B. **§1 (absolute rules), §2 (the reference),
§5 (workflow), §6 (verification) and §7 (report format) apply to both tracks.**

---

## 0 · TL;DR — what you are doing

The client, Shruti Solanki, coaches Indian women whose PCOS + thyroid + insulin resistance
overlap. We are building her ₹97-entry VSL funnel. The **structure, hierarchy, type scale,
spacing, animation and style rules must match teamfitarjun.com exactly** — a funnel that is
live and converting. **Only the copy and the brand hue differ.**

Your job: take your assigned section from "roughly right" to "indistinguishable in structure
from ARJ's equivalent", on every device.

You do **not** redesign. You do **not** improve on the reference. You match it, then report.

---

## 1 · ABSOLUTE RULES — breaking any of these is a failed session

1. **Never invent a fact.** No client counts, ratings, geographies, prices, credentials,
   testimonials, refund terms, statistics or medical claims that are not already in
   `COPY.md` / `lib/content.js`. If a number is missing it renders as a visible `<Gap>` chip
   mapped to a question in `QUESTIONS-FOR-CLIENT.txt`. **A testimonial is never drafted.**
2. **Never edit another session's files.** See §3. If you need a change outside your
   ownership, **flag it in your report** — do not make it.
3. **Never edit `app/globals.css`** (shared tokens/primitives). Same rule: flag it.
4. **One hue + white.** The palette is a single `--brand` and white. Never introduce a second
   hue. The *only* exception already in the codebase is the red countdown, copied from ARJ.
5. **Never run `next build` while the dev server is running.** It corrupts the output and
   kills the server. Stop the server first, or just don't build — `next dev` type-checks.
6. **Never self-run a dev server for the user.** You may run one for your own
   `agent-browser` verification (see §6); kill it when you are done.
7. **Verify before reporting.** A section is not done because the code looks right. It is
   done when you have screenshotted it at mobile and desktop and compared against ARJ.
8. **Mobile-first.** ~99% of traffic is phones. Zero horizontal overflow at 320/360/390/414
   is a hard gate.

---

## 2 · THE REFERENCE (already vendored — do not re-clone)

| What | Where |
|---|---|
| **ARJ full source** | `_reference/teamfitarjun/` — the real Next.js app |
| ↳ hero + all section markup | `_reference/teamfitarjun/app/LandingView.tsx` |
| ↳ base styles | `_reference/teamfitarjun/app/landing.css` (1655 lines) |
| ↳ **premium overrides — these win** | `_reference/teamfitarjun/app/landing-premium.css` (2406 lines) |
| ↳ tokens | `_reference/teamfitarjun/app/globals.css` |
| ↳ checkout / book-a-call / thank-you | `_reference/teamfitarjun/app/{checkout,book-a-call,thank-you}/` |
| **Rendered text of all 8 reference pages** | `_reference/captures/*.txt` (ARJ + FoodFreedomCo) |
| Live sites | teamfitarjun.com · thefoodfreedomco.com · sdp.sciencedrivenperformance.in |

⚠ **`landing-premium.css` overrides `landing.css`.** Always check the premium file second —
several base rules (H1 size, hero grid opacity) are completely replaced there. Reading only
`landing.css` will give you the wrong numbers.

**Doctrine** (read fresh; they were corrected on 2026-07-23 after this project):
- `~/.claude/system/vsl-funnel-doctrine.md` — 20-section copy blueprint
- `~/.claude/system/vsl-funnel-shape-doctrine.md` — section→component map, authoritative order
- `~/.claude/system/design-system.base.md` — concepts C1–C16, recipes R1–R12, anti-slop
- `~/.claude/shape/structure-library.md` — component vocabulary
- `design-system.project.md` *(this repo)* — the palette override and its rationale

---

## 3 · FILE OWNERSHIP — who may edit what

| Session | Section | JSX (yours) | CSS (yours) |
|---|---|---|---|
| 1 | Hero + announce bar | `components/sections/S01Hero.jsx` | `app/sections/s01-hero.css` |
| 2 | Stat band ×4 | `S02Stats.jsx` | `s02-stats.css` |
| 3 | This Is For You If ×5 | `S03FitCards.jsx` | `s03-fitcards.css` |
| 4 | Proof (videos + cases) | `S04Proof.jsx` | `s04-proof.css` |
| 5 | Message wall | `S05Wall.jsx` | `s05-wall.css` |
| 6 | Coach | `S06Coach.jsx` | `s06-coach.css` |
| 7 | What's Included | `S07Included.jsx` | `s07-included.css` |
| 8 | Guarantee / Promise | `S08Guarantee.jsx` | `s08-guarantee.css` |
| 9 | FAQ + Finale + footer + sticky CTA | `S09FaqFinale.jsx` | `s09-faq-finale.css` |

**Shared — nobody edits without flagging:**
`app/globals.css` · `app/layout.jsx` · `app/page.jsx` · `components/CtaBlock.jsx` ·
`components/Icons.jsx` · `components/Price.jsx` · `components/FunnelEffects.jsx` ·
`lib/config.js` · `lib/content.js`

> **`lib/content.js` exception:** you MAY edit the export block that belongs to your own
> section (e.g. session 3 owns `FIT_CARDS`, session 7 owns `INCLUDED`). Touch nothing else in
> that file, and say in your report that you did.

**Adding a shared icon:** `Icons.jsx` is shared. If you need a new `<symbol>`, add it and say
so loudly in your report — it is the one shared file with a low collision risk, but two
sessions adding the same id will conflict.

---

## 3B · FILE OWNERSHIP — Track B (whole pages)

| Session | Page | Files you own |
|---|---|---|
| `checkout` | `/checkout` | `app/checkout/page.jsx` · `app/checkout/CheckoutForm.jsx` · **create** `app/sections/p01-checkout.css` |
| `book-a-call` | `/book-a-call` | `app/book-a-call/page.jsx` · **create** `app/sections/p02-bookacall.css` |
| `thank-you` | `/thank-you` | `app/thank-you/page.jsx` · **create** `app/sections/p03-thankyou.css` |

**Create your CSS file, then add ONE import line to `app/layout.jsx`** at the end of the
existing import list. That is the single shared-file edit Track B is pre-authorised to make —
one line, in a fixed place, so three sessions cannot collide. Declare it in your report.

Page-level styles currently live in `app/globals.css` under the "POST-CONVERSION SURFACES"
comment (`.utility`, `.card`, `.summary`, `.field`, `.embed-frame`, `.fallback`,
`.successseal`, `.steps`, `.panel-n`, `.paytiles`, `.showup`, `.coverlist`, `.u-footer`).
**Move the rules your page owns into your new file** and delete them from `globals.css` —
that is the one deletion you are authorised to make there. If two Track B pages share a rule
(`.utility`, `.card`, `.field`), **leave it in `globals.css`** and flag it.

⚠ Track B pages **stay LIGHT-toned**. Never re-introduce the landing page's dark stage after
the customer has paid — it reads as pressure at exactly the moment you owe them relief.

---

## 4 · CURRENT STATE

- **Next.js 16 + React 19, App Router, JavaScript (no TS).** `npm run dev` → :3000.
- Almost everything is a **server component**. The only client files are
  `components/FunnelEffects.jsx` (all behaviour, via event delegation) and
  `app/checkout/CheckoutForm.jsx`. This is what makes reveal-on-scroll fail open: the markup
  is real HTML before any JS runs.
- **Section 1 (Hero) is DONE** and is the fidelity benchmark. Read `S01Hero.jsx` +
  `s01-hero.css` before starting your own — they show the expected standard, including how
  ARJ's values are cited in comments.
- Sections 2–9 are structurally correct but **not yet matched to ARJ's card shells, hover
  states, shadows, grids and stagger timings**. That is the work.

### Palette — one variable
`--brand` at the top of `app/globals.css` drives everything (ramp, ink, borders, grid, bands,
button, shadows) via `color-mix()`. Currently `#A8542F` (terracotta). The client is still
choosing. **Do not hardcode any colour** — always `var(--brand)` or a `color-mix()` of it.
Ten candidates are listed in the comment above the variable.

---

## 5 · THE WORKFLOW (follow in order)

**Step 1 — Read the reference for YOUR section.**
Find your section's markup in `_reference/teamfitarjun/app/LandingView.tsx`, note every class,
then pull each class from `landing.css` **and** `landing-premium.css`. Write down the exact
values: font-size, weight, line-height, letter-spacing, padding, radius, border, shadow,
gap, transition, animation, breakpoints.

**Step 2 — Diff against ours.** List every difference between ARJ's anatomy and our current
component. Structural differences matter more than colour.

**Step 3 — Build.** Match ARJ's values exactly, substituting `var(--brand)` for their gold.
Cite ARJ's class in a CSS comment for anything non-obvious, e.g.
`/* ARJ .af-markers li — 7px 14px, brand-soft, 22% border */`.

**Step 4 — Verify with agent-browser** (§6). Screenshot mobile + desktop. Compare against the
live ARJ section. Iterate until it matches. **Do not skip this** — several past errors only
appeared on screen.

**Step 5 — Report** (§7).

---

## 6 · VERIFICATION PROTOCOL

```bash
AB=/Users/manavlohia945/.npm-global/bin/agent-browser

# start your own dev server on a UNIQUE port (use 3100 + your section number)
npx next dev --port 3103 &   # session 3
sleep 9

# screenshot your section, mobile + desktop
$AB set viewport 390 844
$AB open "http://localhost:3103/"
$AB eval "document.querySelector('.fitcards').scrollIntoView({block:'start'})"
$AB screenshot /tmp/mine-mobile.png

# compare against the live reference
$AB open "https://www.teamfitarjun.com/"
$AB screenshot /tmp/arj-mobile.png

# HARD GATE — zero horizontal overflow
for w in 320 360 390 414 768 1280 1440; do
  $AB set viewport $w 800
  $AB open "http://localhost:3103/"
  $AB eval "document.documentElement.scrollWidth===window.innerWidth ? 'ok' : 'OVERFLOW'"
done

# read computed values back to prove the match
$AB eval "(function(){var e=document.querySelector('YOUR_SELECTOR');var s=getComputedStyle(e);
  return s.fontSize+' w'+s.fontWeight+' lh'+s.lineHeight+' pad'+s.padding+' r'+s.borderRadius})()"

pkill -f "next dev --port 3103"
```

**Traps that have already bitten this project:**
- A dimension sweep passes on a **crashed** page. Always confirm the page actually rendered
  (`document.body.scrollHeight > 600` and no error overlay), not just that widths match.
- `agent-browser errors` prints `✗` when there are **no** errors. Check `console` too.
- A `<span>` inside a `<button>` is `display:inline` and **ignores `aspect-ratio`** — it
  collapses the card to a sliver.
- Re-declaring `background-clip` in an override loses it to `border-box` and paints the
  gradient as a solid block over invisible text.
- Over-greedy regex edits on CSS leave orphaned `@media {` openers, which kill parsing for
  the rest of the file. Prefer targeted edits over regex sweeps. Verify with:
  `python3 -c "s=open('app/sections/sNN.css').read();print(s.count('{')-s.count('}'))"` → must be `0`.

---

## 7 · REPORT FORMAT (end your session with exactly this)

1. **Section N — matched / partially matched.** One line.
2. **The diff table** — `Element | ARJ value | ours before | ours now`.
3. **Anything I could not match, and why** — especially where our copy is longer than ARJ's,
   or where an asset does not exist.
4. **Flags for shared files** — what you need changed in `globals.css`, `CtaBlock.jsx`,
   `page.jsx`, `Icons.jsx` or another section, and why. Do not make these changes.
5. **Verification evidence** — overflow results at all 7 widths, plus the computed values you
   read back.
6. **New `[MISSING]` items** — anything the client must supply, phrased as a question to
   append to `QUESTIONS-FOR-CLIENT.txt`.

---

## 8 · SECTION BRIEFS

Each brief names the ARJ classes to read. Read the markup in `LandingView.tsx` first to see
how they nest.

### Section 1 — Hero + announce bar ✅ DONE (benchmark)
ARJ: `.af-announce.af-announce-static` · `.af-proofrow` · `.af-avatars` · `.af-callout` ·
`.af-h1` + `.af-hl-block` + `.af-accent` · `.af-sub-strong` · `.af-sub-markers` + `.af-hl` +
`.af-hl-pill` · `.af-markers` + `.af-marker-dot` · `.af-watch` + `.af-watch-box` ·
`.af-video-frame` + `.af-video` + `.af-play`.
Key values already matched: H1 `clamp(37px,3.57vw,54px)` lh1.14 ls−.025em (45.696px @1280) ·
hero wrap **1340px** vs page 1180px · grid **hero-only**, 56px, opacity .34, masked
`radial-gradient(ellipse at 50% 42%, transparent 22%, #000 62%, transparent 88%)` ·
VSL capped **680px** · reveal `translateY(24px) .7s cubic-bezier(.2,.8,.2,1)`, **hero excluded** (LCP).
**Open:** mobile H1 runs 6 lines vs ARJ's 3 — our clauses are longer. Copy decision, flagged
to the client. Boxed metric is wired but off until `NEXT_PUBLIC_KG_RANGE` is supplied.

### Section 2 — Stat band ×4
ARJ: `.af-creds` · `.af-creds-grid` · `.af-cred` (or equivalent — grep `af-creds` in
`landing-premium.css`). Note ARJ's is `padding:38px 0 36px`, `border-top`+`border-bottom`
1px, `background:var(--bg)`, and the grid is `repeat(3,1fr)` with `gap:1px` — **check the
real column count against `LandingView.tsx`, ours has 4 cards.** Cards are three-line:
VALUE / LABEL / SUB-LABEL. Ours currently has a flat outline; ARJ's have a brand top-border,
radius and shadow. Count-up on arrival already exists in `FunnelEffects`.

### Section 3 — This Is For You If ×5
ARJ: `.af-qual` / the fit-list card stack — grep `This Is For You` in `LandingView.tsx`.
Each item is a **card** with a circled tick and **one paragraph carrying a bolded clause
whose position moves card to card**. Ours currently renders as cards but without ARJ's card
shell, hover lift or stagger. Match: card border, radius, shadow, tick disc gradient, hover
`translateY(-2px)` + shadow, and the per-card reveal delay.

### Section 4 — Proof (3 videos + 5 written cases)
ARJ: `.af-cases` / testimonial cards with before/after images, `.af-case-meta`, star row.
Ours has no before/after images — clients are private. We show 3 CDN videos (poster derived
from a seeked `#t=` frame) and 5 written case files. Match ARJ's **card shell, attribution
typography (NAME / AGE · PROFESSION · CITY), star row and hover**, not their image layout.
⚠ Video → client mapping is unresolved (Hima / Shirley / Arya — Q13.1). Do not invent it.

### Section 5 — Message wall
ARJ: `.af-ba` before/after gallery — a **continuous marquee** (see the transformation strip in
`landing-premium.css`, and `structure-library.md` §6 "continuous transformation marquee").
The client has asked for our chat wall to become a moving carousel like ARJ's.
⚠ Implementation trap: `scrollLeft` rounds to integers — drive the drift from a float
accumulator, pause on hover/touch/focus and on `document.hidden`, and honour reduced-motion.
⚠ **PII pass and consent are outstanding (Q14.1) — this section cannot publish until then.**
The folder is mixed: genuine WhatsApp screenshots *and* client-branded before/after graphics.

### Section 6 — Coach
ARJ: `.af-coach` · the stat trio (`104kg → 65kg` / `1,400+ clients`) · "The Coach Who's Lived
Both Sides" + first-person narrative.
⚠ **This section is a declared placeholder.** The strategy doc contains nothing about Shruti
personally — no origin story, no credentials, no own-transformation number. Biography is never
drafted. Build the *shell* to ARJ's spec with `<Gap>` chips in place; it fills when
Q15.1–Q15.6 land. Portrait is at `/img/coach/shruti-1.jpg`.

### Section 7 — What's Included
ARJ: `.af-incl` — a **card grid with an icon tile per item**, brand top-border on the first
card, hover lift. Grep `What's Included` in `LandingView.tsx`. Ours is currently a flat ruled
ledger — the client has explicitly asked for ARJ's boxes, icons, animations and hover effects.
Seven items; item 02 is the named mechanism (The Overlap Reset Sequence) — both reference
funnels put the mechanism *inside* this section rather than giving it one of its own.

### Section 8 — Guarantee / Promise
ARJ: `.af-guar` — seal, eyebrow "THE RISK IS OURS. NOT YOURS.", headline with an underlined
accent word, body, then a **card** containing "What We Ask In Return" as a tick list, and the
refundable-fee line last inside the card.
⚠ **Refund terms are contractual and fixed:** the ₹97 booking fee is refundable if the call
does not happen or she finishes it unsatisfied. The 12-week programme is **non-refundable and
this is never stated anywhere.** The 14-day "feel lighter" line is a **promise, not a
money-back guarantee** (client instruction, resolving a conflict in the strategy doc).

### Section 9 — FAQ + Finale + footer + sticky CTA
ARJ: `.af-faq` (accordion, first item open with a "MOST ASKED" pill) · the closing identity
line + final CTA block · `.af-footer` (copyright, long disclaimer, "owned and operated by",
Privacy · Terms · Refund) · the sticky CTA bar.
⚠ The client flagged **the sticky CTA does not match ARJ's structure** — that is yours.
⚠ Footer links point at `/privacy`, `/terms`, `/refund-policy` which **do not exist and 404**.
Razorpay requires all three (Q20.2) — flag, don't invent policy text.

---

## 8B · PAGE BRIEFS (Track B)

Reference source: `_reference/teamfitarjun/app/{checkout,book-a-call,thank-you}/`.
Each has a `*View.tsx` (markup) and a `*.css` (styles). Rendered text of both ARJ's and
FoodFreedomCo's versions is in `_reference/captures/arj-co.txt`, `arj-bk.txt`, `arj-ty.txt`
(and `ffc-*`).

### Page · CHECKOUT — `.co-*`
Source: `checkout/CheckoutView.tsx` + `checkout/checkout.css` (1125 lines).
ARJ's element order: `.co-trust-bar` (itm · sep) → `.co-body` → `.co-grid` →
`.co-form` with `.co-card` panels, each led by `.co-step-head` (`.co-step-num` +
`.co-step-eyebrow`) → `.co-row` / `.co-row-full` fields with `.req` and `.note` →
`.co-phone` **country selector** (`.flag-img`, `.code`, `.caret`, `.co-flag-search`,
`.co-flag-list`, `.co-flag-opt`) → `.co-err` → `.co-trust-row` of `.co-trust-chip` →
order summary with `.co-checks`/`.co-check` → `.co-coupon-*` → pay button.
Also: `.co-expect` / `.co-expect-grid` / `.co-expect-card` — a "what to expect" block ARJ
runs on checkout that **we do not have**; evaluate whether it earns its place.
- Ours is close on anatomy but flat: no `.co-card` shell, no numbered step heads styled to
  ARJ's spec, no country-flag selector, no coupon row.
- ⚠ **Do not fabricate a struck anchor price.** FFC shows ₹999→₹97; ARJ shows ₹97 flat. We
  have no legitimate anchor, so we ship flat. A fake "total value" is a fabricated saving.
- ⚠ Razorpay is **not wired** (QC.1). The form currently routes to `/book-a-call` so the flow
  is previewable. Keep that, keep the `<Gap>` chip, do not write a fake payment.
- ⚠ Coupon UI: only build it if the client actually has codes — otherwise it is a dead
  control that invites abandonment. Flag rather than assume.

### Page · BOOK-A-CALL — `.bk-*`
Source: `book-a-call/BookACallView.tsx` + `bookacall.css` (1105 lines).
ARJ's element order: `.bk-status` (✓ check · sep) → `.bk-header` (`.bk-logo`) →
`.bk-steps` (`.bk-step.done` / `.bk-step.active`, `.num`, `.bk-line`) → `.bk-hero` /
`.bk-hero-inner` / `.bk-eyebrow` / h1 with `.af-accent` → `.bk-cal` + `.bk-cal-sub` +
`calendly-inline-widget` → `.bk-trust` / `.bk-trust-item` / `.bk-trust-tick` →
`.bk-trans` + `.bk-trans-sub` + **`.af-gal-carousel` transformation gallery**
(`.af-gal-track`, `.af-gal-set`, `.af-gslide`) with a root-level lightbox
(`.af-lbox`, `.af-lbox-img`, `.af-lbox-nav`, `.af-lbox-prev/next`, `.af-lbox-counter`,
`.af-lbox-close`) → `.bk-mid` CTA → `.bk-walk` walk-away outcomes → `.bk-faq` → `.bk-final`
→ `.bk-footer` / `.bk-foot-links`.
- Calendly is **live and working**: `https://calendly.com/shrutisouls18/30min`, 30 min.
  Mounted by `FunnelEffects.jsx` (shared — flag if it needs changing).
- ⚠ The embed must keep its **height reservation** and the **human-fallback weld** beneath it
  (WhatsApp + email). An embed is a dependency we do not control; shipping it as the only
  path forward ships a dead end at the moment she has already paid.
- ⚠ WhatsApp number and support email are still `[MISSING]` (QB.2) — the fallback buttons
  render disabled with a `<Gap>`. Do not invent contact details.
- ⚠ Show-up urgency: ARJ uses a real stat ("38% of people who pay never show up"). **We have
  no funnel data (QB.5).** Do not write a number. The panel is built and fills when supplied.
- The gallery carousel is optional for us — we have no before/after set. If you build it,
  use the chat/progress screenshots and note the same PII caveat as section 5.
  ⚠ `scrollLeft` rounds to integers — drive drift from a float accumulator, pause on
  hover/touch/focus and `document.hidden`, honour reduced-motion.

### Page · THANK-YOU — `.ty-*` (+ `.qz-*`)
Source: `thank-you/ThankYouView.tsx` + `thankyou.css` (1676 lines) + `quizQuestions.ts`.
ARJ's element order: `.af-header` (`.af-logo`) → `.ty-hero` / `.ty-hero-inner` →
`.ty-conf` (`.ty-check` + `.ty-conf-text`) → `.ty-kicker` → `.ty-h1` with `.af-accent` →
`.ty-sub` → `.ty-vframe` + `.ty-vplay` (**a video on the thank-you page**) →
`.ty-form-cta` → `.ty-donow` (`.ty-donow-eyebrow` / `-title` / `-sub`) → `.ty-steps`
(`.ty-step-num`) → `.ty-call` → `.ty-sec-label` → `.ty-goal-box` → `.af-foot`.
- ⚠ **ARJ runs a 10-question diagnostic QUIZ modal here** (`.qz-*`, `quizQuestions.ts`) —
  a pre-call intake that arrives with the prospect. **We do not have this and it is a
  product decision, not a styling one.** Do NOT build it. Read it, then write it up in your
  report as a recommendation with a rough scope, and add a question to
  `QUESTIONS-FOR-CLIENT.txt` about whether Shruti wants a pre-call intake form.
- ⚠ ARJ also has a thank-you **video**. We have none (Q6.1 covers the VSL only). Reserve the
  frame per C16 or omit — do not ship an empty black box.
- ⚠ Refund posture on this page is **fixed and contractual**: the ₹97 is refundable if the
  call does not happen or she finishes it unsatisfied; the programme is non-refundable and
  **that is never stated**. ARJ's thank-you states a strict no-reschedule policy — ours does
  not. Do not copy their terms.
- Our pre-call homework block is the commitment device and the real reason this page exists.
  Keep it; match ARJ's card shell around it.

---

## 9 · SHARED CONTEXT YOU MAY NEED

- **The one CTA string** — `lib/config.js` `CTA_STRING`, repeated verbatim at every CTA. Never
  write a variant.
- **Countdown** — 3-hour window, anchored in `sessionStorage`, red capsule (ARJ's one break
  from its own hue). Lives in `CtaBlock.jsx` + `FunnelEffects.jsx`. Shared.
- **The programme** — Reset · The Overlap Reset · 12 weeks / 90 days · ₹97 refundable entry ·
  30-min 1:1 call with Shruti · Calendly `https://calendly.com/shrutisouls18/30min`.
- **Real proof we have:** 300+ clients · 80–85% success rate *(definition pending, Q8.1)* ·
  5 written transformation cases with real metrics · 3 video testimonials (unmapped) ·
  14 chat/progress screenshots (consent pending).
- **Still missing:** VSL video, rating, years coaching, geography, kg range, Shruti's story
  and credentials, video→client mapping. All render as `<Gap>` chips. See
  `QUESTIONS-FOR-CLIENT.txt` (47 questions).

**Project docs:** `COPY.md` (all approved copy) · `ASSETS.md` (media + CDN URLs) ·
`BUILD-NOTES.md` (build history, bugs, placeholders) · `design-system.project.md` (palette).

---

## 9B · WHAT HAPPENS AFTER YOU REPORT (do not do this yourself)

An orchestrator session merges all twelve outputs:
1. Runs `node scripts/consolidate.mjs` — collapses every `app/sections/*.css` back into a
   single `app/globals.css` in the cascade order declared by `layout.jsx`, then deletes the
   split. `components/sections/*.jsx` stays (one component per section is idiomatic Next.js;
   the CSS fragmentation was the temporary scaffold).
2. Arbitrates every shared-file flag from your report.
3. Runs the full regression sweep across all four routes.

**Implications for you:**
- Keep your CSS **brace-balanced** — the merge script refuses to run otherwise. Check with
  `node scripts/consolidate.mjs --check`.
- **Scope your selectors.** After the merge every rule lives in one file with no ordering
  protection. A bare `.card` or `.title` from your section will collide with someone else's.
  Prefix anything generic, or nest it under your section's own class.
- Do not rely on your stylesheet loading last.

---

## 10 · DEFINITION OF DONE

- [ ] Every ARJ value for your section read from **both** CSS files and matched
- [ ] Screenshotted at 390px **and** 1280px and visually compared against live ARJ
- [ ] Zero horizontal overflow at 320 / 360 / 390 / 414 / 768 / 1280 / 1440
- [ ] Page actually renders (no error overlay, `scrollHeight > 600`)
- [ ] Reduced-motion honoured; reveals fail open
- [ ] Tap targets ≥ 44px
- [ ] Brace balance `0` in your CSS file
- [ ] No colour hardcoded — everything derives from `--brand`
- [ ] No invented facts; every gap is a `<Gap>` chip with a question number
- [ ] You edited **only** your two files (plus your own `lib/content.js` export, if declared)
- [ ] Report delivered in the §7 format
