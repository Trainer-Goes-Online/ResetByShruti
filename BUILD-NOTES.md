# RESET · Build Notes & Handoff

## What shipped — Next.js 16 (App Router) + React 19

```
app/
  layout.jsx            Fonts (next/font), icon sprite, root overlay, effects
  globals.css           The design system — skin tokens + every component
  page.jsx              Landing — 20 sections, 5 CTA-block instances
  checkout/page.jsx     R11 mobile-first checkout (+ CheckoutForm.jsx, client)
  book-a-call/page.jsx  Calendly, hardened embed + human fallback
  thank-you/page.jsx    R12 confirmation surface
components/
  Icons.jsx             One bespoke SVG family (C11)
  CtaBlock.jsx          THE repeated CTA block — built once, placed 5×
  Price.jsx             <Price/> + <Gap/> — price never inlined (C16)
  Lightbox.jsx          Overlay, rendered at the page ROOT (C15)
  FunnelEffects.jsx     'use client' — the only client-side behaviour file
lib/
  config.js             THE single source: price, URLs, proof numbers
  content.js            Copy + proof data as real arrays (C16: counts vary)
public/img/             16 derived assets, 2.3MB total
_source/                453MB of raw client source — NOT deployed
.env.local              Every commercial value
```

**Preview:** `npm run dev` → http://localhost:3000

### Architecture note — why almost everything is a server component
Only two files are `'use client'`: `FunnelEffects.jsx` and the checkout form. Every section
is server-rendered HTML, and `FunnelEffects` attaches behaviour by **event delegation** after
mount. That is what makes the reveals genuinely fail-open (C7): if the JS never runs, the
page is still complete and every CTA still works.

## Deliberate deviations from the brief

1. **WebP not produced.** `sips` on this machine reads WebP but cannot write it, and neither
   `cwebp` nor `ffmpeg` is installed. Images ship as sized JPEG — all within the C16 budget
   (largest 336KB, a portrait). Install `webp` and re-derive before launch.
2. **No countdown timer.** No real deadline exists in the strategy doc. A clock that resets
   on reload is fake scarcity. The urgency beat is built and renders automatically the moment
   `NEXT_PUBLIC_COUNTDOWN_DEADLINE` **or** `NEXT_PUBLIC_MONTHLY_INTAKE_CAP` is set.

## Assets — provenance

- Videos are served from the **DigitalOcean CDN**, not `public/`. The local files (72–280MB)
  are source assets and must never be deployed (C16: never commit the source beside the
  derivative). See `ASSETS.md`.
- **Video posters are derived**, not supplied: each card uses `<video src="…#t=3"
  preload="metadata">`, so the browser paints a real seeked frame rather than a blank tile.
- `public/img/chat/*` derived from `_source/Chat Testimonials/` at 620px.
- `public/img/coach/*` derived from `_source/Shruti-Images/` at 900px.
- The three originals folders were MOVED out of `public/` into `_source/` — Next deploys
  everything under `public/`, and 453MB of source video would otherwise ship.

## ⚠️ Discovered during the build — needs your decision

**The "Chat Testimonials" folder is mixed.** It contains genuine WhatsApp testimonials *and*
client-branded before/after graphics (faces already emoji-covered, captions like "Dropped
more than 3kgs and 2+ inches"). You told me no before/afters existed.

- §14's heading was changed to **"What They Send, While It's Still Happening"** so it is
  honest about both content types.
- **Option worth considering:** the before/afters could become a proper §14 transformation
  marquee with the chats as a separate wall — closer to the doctrine's actual §13/§14 split.
  That is a structural change, so it is your call, not mine.
- **PII is live in these images.** `chat-06` shows a sender's initials; others may show more.
  The PII pass and consent (Q14.1) are still outstanding and this **blocks publication**.

## Declared placeholders — what needs rework when the payload lands

| Placeholder | Ships as | Rework required |
|---|---|---|
| **VSL** | Reserved 16:9 frame + branded placeholder | **None.** Set `VSL_VIMEO_URL` → live, one-gesture play, zero layout change. |
| VSL poster | Vimeo auto-thumbnail | Swap image only. |
| §15 coach section | Portrait + gap chips for story/credentials | **Full band rebuild** once Q15.1–15.6 land. Largest remaining work. |
| §13a video attribution | 3 cards reading "Hima, Shirley or Arya" | **13a and 13b collapse into one 8-card grid** once Q13.1/13.2 land. Real rework — highest-value questions. |
| Rating, years, geography, countries, kg range | Visible `[gap]` chips | Fill `config.js`. No layout change. |
| Countdown / capacity | Not rendered | Set one config key. |
| Razorpay | Form routes to `/book-a-call` | Wire the gateway in `app/checkout/CheckoutForm.jsx` (QC.1). **Not a live payment.** |
| WhatsApp + email fallback | Disabled ghost buttons | Set `WHATSAPP_NUMBER` / `SUPPORT_EMAIL`. |
| Legal pages | Footer links to `/privacy`, `/terms`, `/refund-policy` — **these routes do not exist yet and will 404** | Create the three pages or repoint the links (Q20.2). Razorpay requires them. |
| Brand mark | No logo — the credential band is the top, per the reference funnels | Optional. |

## Palette provenance (corrected in v2)

`globals.css` now uses the skin's tokens as written:
- Neutrals, fonts, ease curves, radii, C14–C16 primitives and the C15 ladder: **verbatim**.
- Accent: the skin's **DEFAULT gold** (hue 85) against forest ink. v1 had silently swapped in
  the `[data-accent="emerald"]` switcher — a taste call with no concept-level justification.
- `.cta-big`, `.stickycta` and the credential band now use the skin's **literal signature CSS**
  (green gradient, gold ring, gold shine sweep), tokenised so a re-skin is one edit.
- `[data-accent="emerald"]` and `[data-accent="clay"]` remain available: set the attribute on
  `<html>` in `layout.jsx` to swap the whole funnel's accent. One attribute, no CSS edit.

**One deliberate amendment to a skin value:** `.lit`'s metallic ramp starts at `--gold`, not
`--gold-soft`. On a 0.97-lightness cream canvas a 0.92 highlight all but disappears, and
C12 ("legibility stays sacred") outranks the skin — the brain's own precedence rule.

## Two bugs worth remembering

1. **`background-clip:text` lost on the dark stage.** Re-declaring `background-clip` inside
   `.stage-dark .lit` computed to `border-box`, painting the gradient as a solid block over
   invisible text. Fix: the override sets `background-image` ONLY and inherits the clip.
2. **Env vars undefined in the client bundle.** `lib/config.js` originally read
   `process.env[key]` with a *dynamic* key. Next substitutes `NEXT_PUBLIC_*` into the client
   bundle by static text replacement, so dynamic lookups are never replaced — server
   components resolved fine while the browser got `undefined`, and Calendly never mounted.
   **Every `process.env` access in `lib/config.js` must stay a literal member expression.**


## v3 — rebuilt against the LIVE reference funnels (2026-07-23)

v1/v2 were built from the doctrine's *description* of the reference funnels. v3 was built
after reading all eight reference pages directly (teamfitarjun.com + thefoodfreedomco.com,
landing / checkout / book-a-call / thank-you) and taking the CONVERGENT hierarchy — the
beats both funnels actually run, in their actual order.

**Three sections were REMOVED because neither reference has them:**
- a standalone agitation triplet
- a standalone "why past attempts collapsed" prose section
- a standalone "how the mechanism works" section (our journey spine)

Both funnels dissolve those jobs elsewhere: the blame-relief lives inside the coach's
first-person story and the FAQ, and the named mechanism is a *component inside* "What's
Included" (ARJ's Custom Execution Blueprint™ is item 02; FFC's Metabolic Reversal Framework
is item 04). Ours follows that — The Overlap Reset is component 02, with the four-week
sequence inside its body.

**Anatomy corrected to match:**
| Beat | Was | Now |
|---|---|---|
| Eyebrow pill | outline chip | filled gold lozenge, gated audience line |
| H1 | one italic gold phrase | three-part, two distinct emphasis treatments |
| Sub | muted grey | bold, near-ink, names the mechanism |
| Reach line | mono stat row | a SENTENCE with inline emphasis |
| Condition list | its own section | inside the hero, as the tail of the reach sentence |
| "Watch the short video" | plain text | bordered lozenge |
| Stat cards | 2-line | 3-line (VALUE / LABEL / SUB-LABEL) |
| This Is For You If | hairline ledger, one line each | CARDS with circled tick + a paragraph carrying a bolded clause that moves position |
| Section headings | some bare H2s | mono eyebrow above EVERY H2 (the most consistent rule in both references) |
| Testimonials | metrics only | VERIFIED chip + NAME / AGE · PROFESSION · CITY / ★★★★★ / narrative + metrics |
| Offer components | ruled ledger rows | big ordinal above title, reference layout |
| Checkout | single form | numbered panels [1] Your Details / [2] Order Summary + payment tiles + legal microcopy |
| Book-a-call | trust badges + ledger | step indicator, three ✓ trust cards, "preferred slot not available?" fallback, walk-away 01/02/03, show-up panel, 2-question FAQ, closing push |
| Thank-you | timeline + homework | micro-action, numbered pre-call steps, "What We Will Cover", "Before You Show Up", "What To Keep Ready" |
| Post-conversion footers | none | full legal block on every page, as both references do |

**The countdown.** Both references run a live "OFFER ENDS IN HH:MM:SS" clock inside the CTA
block. Ours holds the same slot in the same position but renders EMPTY until a real deadline
or intake cap exists (Q7.1) — a clock that resets on reload is fabricated scarcity. Setting
`NEXT_PUBLIC_COUNTDOWN_DEADLINE` fills it with no layout change.

**The H1 chip.** The reference wraps a SHORT hard metric in a bordered chip ("10–15 Kilos").
Until the kg range lands (Q3.1) the chip is withheld rather than stretched around a long
phrase — a chip around half a sentence reads as a rendering fault, not emphasis. Supplying
`NEXT_PUBLIC_KG_RANGE` switches it on automatically.

## v4 — ARJ fidelity pass + Mulberry palette (2026-07-23)

Structure, hierarchy and type scale are now taken from **measured computed styles** on
teamfitarjun.com at 390px and 1280px, not estimated. See `design-system.project.md` for the
full token table.

| | ARJ (measured) | RESET |
|---|---|---|
| Display face | Playfair Display **700** | same |
| Body face | Inter | same |
| H1 | 27.69px → 45.70px, ls −0.025em | 27.78px → 45.7px |
| H2 | 24px → 36px, lh 1.12, ls −0.02em | same |
| Eyebrow | Inter **700**, 10→11px, ls .16em, uppercase | same |
| CTA | 13px w700, radius 999px, 3-stop gradient, `0 10px 26px rgba(accent,.2)` | same |
| Section pad | 28px → 80px | same |
| Container | max **1340px**, pad 16px | same |
| Background grid | 56px cells, 1px `#F3EADB` | 56px cells, 1px `#F3E3EC` |
| Alt band | `#FBF6EC` | `#FDF6FA` |
| Credential band | WHITE, figures in accent-bold | same |
| Condition chips | radial "marker dot" + label | same |
| H1 emphasis | ONE coloured phrase + one marker-underlined | same |

**Palette — Mulberry.** One hue plus white, matching the reference standard (SDP blue, FFC
green, ARJ gold). The wellness skin's green/gold is repealed for this project via
`design-system.project.md`. The `[data-accent]` switchers were deliberately **removed** — one
hue is the rule, and a switcher invites a second hue onto the page.

**Countdown — 3 hours,** built to the reference pattern and placed inside every CTA block.
ARJ's and FFC's clocks restart on every page load; ours anchors the deadline in
`sessionStorage` so it counts down continuously across a visit. Same window, same
HRS/MIN/SEC anatomy. A real deadline or intake cap in config overrides it.

**One crash found and fixed:** `/checkout` threw `Cannot read properties of null` because the
v3 restructure removed the collapsible `.summary-bar` while `FunnelEffects` still assumed it
existed — taking down every other behaviour on the page. Now guarded. Worth noting the
overflow sweep passed while the page was crashed, because it was measuring the error overlay.

## Verification performed

- Zero horizontal overflow at **320 / 360 / 390 / 414 / 768 / 1440px**, all four pages.
- Reduced-motion: 30 reveal elements, **0 invisible** — reveals fail open.
- Lightbox: parented to `<body>`, `z-index: 1000`, body scroll-locked, close button `fixed`
  and safe-area-aware.
- Zero console errors.
- No tap target under 44px.
- N=5 case grid centres correctly (3 + 2), does not strand.

## Layering ladder (C15) — declared once, do not improvise

```
0–9   in-flow content
10–19 in-section focal affordances (play discs, badges)
40    sticky nav (unused)
50    sticky CTA bar
1000  overlays — lightbox, authored at the page root
1100  toasts (unused)
```
Only **one** piece of sticky chrome is fixed at a time on mobile (the CTA bar), and `body`
reserves its height via `.has-sticky` so it never covers the footer.
