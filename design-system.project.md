# Skin — RESET (Mulberry) · Layer 3 project override

> Overrides `~/.claude/system/design-system.skin.tgo-wellness.md` for this project only.
> The brain (`design-system.base.md`, Layers 1–2) is untouched and still governs: if a value
> here fights a concept, **the concept wins**.

## Why an override exists

Two reasons, both explicit client decisions:

1. **The reference standard is one hue + white.** SDP is white + light/dark blue. FFC is white
   + light/dark green. ARJ is white + light/dark gold. The brand must read as *one hue plus
   white*, not as a multi-colour palette.
2. **The hue must not be gold, green or blue** — those are taken by the three reference
   funnels. Chosen: **Mulberry** (a deep plum-rose). It is unmistakably distinct from all
   three, it is credible for a women's hormonal-health practice without collapsing into
   wellness-pink cliché, and it holds AA contrast against white at text sizes.

The wellness skin's green/gold tokens are therefore **repealed** for this project. Everything
structural — the C15 ladder, the C14 primitives, the recipes — is inherited unchanged.

## Structural fidelity target

Metrics below are **measured from teamfitarjun.com**, not estimated: computed styles read at
390px and 1280px on 2026-07-23. The instruction is that structure, hierarchy, type scale and
style rules match the reference exactly, and only the copy and the hue differ.

| Token | ARJ (measured) | RESET |
|---|---|---|
| Display face | Playfair Display 700 | Playfair Display 700 |
| Body face | Inter 400 | Inter 400 |
| H1 | 27.69px → 45.70px, lh 1.14–1.18, ls −0.025em | identical |
| H2 | 24px → 36px, lh 1.12, ls −0.02em | identical |
| Body | 13.5–14.5px → 16px, lh 1.45–1.55 | identical |
| Eyebrow | 10px → 11px, w700, ls 0.14–0.18em, uppercase | identical |
| CTA pill | 13px w700, radius 999px, pad 12/18/11 | identical |
| CTA shadow | `0 10px 26px rgba(accent,.2)` | identical, accent swapped |
| Section pad | 28px → 80px | identical |
| Container | max 1340px, pad 16px | identical |
| Background grid | 56px cells, 1px lines in a pale accent tint | identical, tint swapped |
| Alternating band | `#FBF6EC` (pale accent wash) | `#FDF6FA` (pale mulberry wash) |

## Tokens

```css
:root {
  /* Surfaces — the page is WHITE first. The alternating band is a pale wash of
     the accent, never a second hue. */
  --canvas: #FFFFFF;
  --canvas-2: #FDF6FA;      /* alternating section band  (ARJ: #FBF6EC) */
  --sand: #FAEEF4;          /* third, slightly deeper wash */
  --grid: #F3E3EC;          /* 56px background grid line (ARJ: #F3EADB) */

  /* Ink — near-black carrying a trace of the hue, never pure #000 (C12) */
  --ink: #1D1419;           /* ARJ: #1C1710 */
  --ink-2: #4A3A43;
  --ink-3: #7C6B74;
  --hair: #EADCE4;

  /* Mulberry ramp — the single accent, spent like a spotlight (C2) */
  --accent-deep: #8C2F5E;   /* headings accent, eyebrows, links  (ARJ: #9A6614) */
  --accent: #A63C70;        /* mid — button gradient top         (ARJ: #B07C22) */
  --accent-2: #8A2F5C;      /* button gradient middle            (ARJ: #95651A) */
  --accent-light: #E7B9D0;  /* dot highlights, inner rings       (ARJ: #E9C489) */
  --accent-soft: #F7E6EF;
  --hl: rgba(196, 108, 156, .34);   /* marker-pen underline      (ARJ: rgba(201,149,77,.34)) */

  /* Dark stage — the "mix of light and dark within the one hue". Used sparingly:
     the VSL band and the finale only. */
  --dark-1: #2A1220;
  --dark-2: #1B0B14;
}
```

## Rules carried over from the reference

- **No second hue anywhere.** Success ticks, ratings, urgency and focus rings all use the
  mulberry ramp. A green tick or a red timer would break the one-hue rule.
- **The grid is background, not decoration.** It sits behind white sections at 56px and stops
  at the alternating bands, exactly as ARJ does it.
- **Dark sections are dark *mulberry*,** not neutral charcoal — same hue, lower lightness.
- **Display face never drops below headline size** (C1, inherited).

## Deviations from the reference, and why

- **Countdown.** Built to the reference's 3-hour pattern at client instruction. ARJ's and
  FFC's clocks restart on every page load. Ours anchors the deadline in `sessionStorage`, so
  it counts down consistently for the duration of a visit rather than resetting on every
  scroll-triggered reload. Same structure, same 3-hour window, one degree less artificial.
- **`.lit` gradient-clip** is kept from the brain for the key value moments, ramped in
  mulberry rather than gold.
