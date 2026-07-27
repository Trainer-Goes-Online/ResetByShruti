# Parallel Section-Build Technique — Orchestrator Brief

> **You are the ORCHESTRATOR.** You are a Claude Code agent that has just been
> handed this file for a **new client** with a **different niche** and a
> **different reference funnel** than the one this technique was proven on.
>
> **Your job is NOT to build the funnel yourself.** Your job is to:
> 1. Understand the technique in this document (it is the whole method).
> 2. Interview the human with the questions in §7 until you have what you need.
> 3. Ingest the reference funnel so your instructions are exact, not approximate.
> 4. Produce **two artifacts** (§8): a **MASTER HANDOFF** doc and a **per-section
>    session prompt template**.
> 5. Hand those back to the human. The human will open one fresh Claude Code
>    session per section and paste the **per-section prompt + a section number**
>    — nothing else. Then you consolidate and verify (§5, §6).
>
> Do not write funnel code until §4 is complete and the human approves the plan.

---

## 1. What the technique is (and why it exists)

A conversion funnel (landing / checkout / booking / thank-you) is built by **many
Claude Code sessions running in parallel — one session per landing-page
section**, plus one session per additional page. Each session is small,
self-contained, and **owns a disjoint set of files** so sessions never collide.
The orchestrator (you) writes the briefs, then **merges the outputs into one
clean, idiomatic project**.

Why this beats one big session:
- **Speed** — sections build simultaneously instead of sequentially.
- **Focus** — each session reasons about one section against one reference
  section, so fidelity is higher.
- **No merge hell** — strict file ownership (one component per session) means
  parallel edits never touch the same file.

The human's entire per-session effort is: *open a session → paste the per-section
prompt → type a section number.* Everything a session needs to know that is
**common** lives in the MASTER HANDOFF; the only **variable** is the number.

---

## 2. The non-negotiable rules that make parallelism safe

These are the rules that let N sessions run without stepping on each other. Bake
them into every brief you write.

1. **One section = one owned component file.** Session *k* creates/edits exactly
   `components/sections/S0k<Name>.jsx` (adapt the path to the chosen stack) and
   **nothing else that another session also touches**.
2. **No shared-file edits during the parallel phase.** The global stylesheet,
   the layout/root file, the config, and the content/data file are **owned by
   the orchestrator**, not by section sessions. If a section needs a token, a
   config key, or a content entry, it **declares it in its output** and *you*
   add it during consolidation. (In the proven run, sections were first given
   their own CSS file, then merged; simplest is: sections write scoped CSS in a
   clearly-fenced block you relocate. Pick one and state it.)
3. **CSS is namespaced per section** so two sessions can't define the same
   selector. Prefix every class with the section's slug (e.g. `.s04-…`) or scope
   under a section root class. State the convention in the MASTER HANDOFF.
4. **Server components by default.** All behaviour (reveal-on-scroll, carousels,
   sticky bars, embeds, countdowns) lives in **one** client file owned by the
   orchestrator, driven by **event delegation on `document`** — never per-section
   `useEffect`/state. Sections emit real, complete HTML.
5. **Fail-open.** Content is real HTML before any JS runs; JS only *enhances*
   (adds an `.armed`/`.in` class, mounts an embed). If the client JS never runs,
   the page is still complete and every CTA still works.
6. **Single design-system variable.** One brand hue drives the whole palette via
   `color-mix()` (ramp, ink, borders, background grid, bands, buttons, shadows).
   Sessions consume tokens; they never hardcode colours.
7. **Honesty / no invented facts.** Numbers, names, ratings, geographies,
   credentials, testimonials, refund terms — if the human hasn't supplied them,
   they render as a **visible `<Gap>` chip** keyed to a numbered question, never
   a plausible-looking guess. A testimonial is **never** drafted.

---

## 3. Reference-source fidelity (the quality bar)

The output must match the reference funnel in **structure, hierarchy, type
scale, spacing, and animation** — *only the copy differs*. To hit that:

- **Get the reference as source if at all possible.** A public repo or the
  live site's CSS lets you read **exact** values (font sizes, paddings, easings,
  breakpoints) instead of eyeballing. Vendor it read-only into `_reference/`
  (gitignored) and cite file+line in each brief.
- **Read the LIVE pages too** — some sections only exist at runtime. Never
  invent a section the reference doesn't have; never drop one it does.
- When two references disagree or a premium stylesheet overrides a base one,
  **the override wins** — measure the shipped value, not the first declaration.
- Each section brief must name the **exact reference element** it mirrors and
  the values to match (or the file+line to read them from).

---

## 4. The workflow you (orchestrator) run

**Phase 0 — Read.** This document, end to end.

**Phase 1 — Interview.** Ask the human the §7 questions. Ask them in one batched,
scannable message; don't drip one at a time. Stop and wait for answers.

**Phase 2 — Ingest the reference.** Fetch/clone the reference funnel. Map its
pages and, for the landing page, its **section list in order**. Produce a
numbered section index (S01…SN) and get the human to confirm it — that numbering
is the contract the whole run depends on.

**Phase 3 — Decompose & assign ownership.** For each section and each extra
page, define: the owned file path, the CSS namespace, the reference element it
mirrors, the copy (real or `<Gap>`), and any tokens/config/content it will need
you to add centrally.

**Phase 4 — Produce the two artifacts (§8) and STOP for approval.** Do not build
yet. The human approves the MASTER HANDOFF + the section index.

**Phase 5 — Parallel build.** The human opens one session per section and pastes
`<per-section prompt> + <section number>`. Each session builds only its owned
file(s) and ends by emitting a short **"consolidation manifest"**: tokens/config/
content keys it needs, and any deviation from the brief.

**Phase 6 — Consolidate.** You merge every section into the standard project
shape: one stylesheet (sections' scoped CSS relocated in cascade order), one
layout importing everything, config + content centralised, the single client
behaviour file wired. Resolve the manifests (add the declared tokens/keys).
**Keep the framework's idiomatic structure — no leftover per-section CSS files.**

**Phase 7 — Verify.** Build clean. Then, per page × per breakpoint: zero
horizontal overflow, the page actually renders (not a crashed white screen),
reveals fire, embeds mount, CTAs navigate. Fix collisions (the only real risk is
two sections having declared the same selector or token — namespacing prevents
this, verification catches leaks).

---

## 5. Consolidation contract (how merge-back stays deterministic)

- **Cascade order matters.** Section CSS is concatenated in section order under
  the base/tokens; later sections can override earlier utility only intentionally.
  State the order explicitly (usually S01→SN then page-specific).
- **Brace-balance check** the merged stylesheet (a dropped `}` silently kills
  everything below it). Validate before trusting a green build.
- **One source of truth** for commercial values (price, URLs, proof numbers) in a
  config module read from env; **one** content module for copy/data arrays.
- Sessions that need a shared value **declare** it; you add it once. Sections
  never edit the shared files themselves.

---

## 6. Anti-patterns (learned the hard way — put these in the briefs)

- **Don't** let a section session touch the global stylesheet, layout, config, or
  content file. Declare-and-hand-up instead.
- **Don't** add a second browser-side framework or per-section `useEffect`;
  behaviour is delegated in the one client file.
- **Don't** invent a section, a statistic, or a testimonial. Gap-chip it.
- **Don't** run a production build against a running dev server (it can kill it) —
  stop the dev server first.
- **Don't** trust a width-match as "passing" — confirm the page actually rendered
  (has real height, no error overlay) at each breakpoint.
- **Don't** ship the interim "one CSS file per section" layout — that's a build
  convenience; the final repo uses the framework's normal structure.

---

## 7. Questions to ask the human (Phase 1)

Batch these. Mark blockers ★.

### A. Reference funnel ★
1. **Reference funnel URL(s)** — one per page (landing, checkout, booking,
   thank-you, any upsell). ★
2. Is there a **source repo** (GitHub) for the reference, or only the live site?
   (Repo = pixel-exact values; live-only = you measure from rendered CSS.) ★
3. Anything in the reference to **deliberately NOT copy** (their branding, their
   claims, sections that don't apply)?

### B. This client / offer ★
4. **Client/brand name**, niche, and the offer (what's actually sold, and the
   price / entry price). ★
5. **Funnel model** — e.g. low-ticket call → high-ticket programme? Straight
   product sale? What's the conversion action on each page? ★
6. The **ONE brand hue** (hex), or should you propose options for the niche?
   Any hues that are off-limits (e.g. used by the reference)?
7. **Fonts** — match the reference, or specific families? Logo + favicon assets?

### C. Stack & repo ★
8. **Framework / stack** (e.g. Next.js App Router version), **JS or TS**, and the
   **CSS approach** (no framework / Tailwind / other). ★
9. **Where is the codebase** — fresh repo to scaffold, or an existing path? ★
10. **Deploy target** (Vercel / other) — affects env-var handling.

### D. Copy & data
11. Is there a **client copy doc**, or should sections write to the reference's
    structure with `<Gap>` placeholders for anything unconfirmed?
12. **Known facts now:** price, booking/Calendly URL, testimonial media (CDN
    links), proof numbers (client count, rating, geography), coach bio. List what
    you have; the rest become gap chips + questions.
13. **Testimonials / screenshots** — do you have real, **consented** client
    assets, or should those slots stay gapped? (Never fabricate or borrow another
    funnel's real people.)

### E. Integrations (only if this funnel needs them)
14. **Payments** (Razorpay / Stripe / none) and **tracking** (GA4 id, Meta
    pixel+CAPI, Clarity, Pabbly/CRM webhook)? These are usually separate
    follow-on work, not part of the section build — confirm scope.

### F. Process
15. **How many parallel sessions** do you want to run at once, and confirm the
    **section decomposition** once you propose it from the reference.
16. Consolidation preference confirmed: **single stylesheet + standard framework
    structure** in the final repo (recommended), yes?

---

## 8. What you must PRODUCE (Phase 4)

### Artifact 1 — `MASTER-HANDOFF.md`
The single doc every section session receives. It contains everything **common**:
- The client/brand, niche, offer, conversion actions.
- The stack, repo path, file-ownership map, CSS-namespace convention.
- The design-system tokens (the one hue + how the ramp derives), fonts.
- The reference funnel location (repo path or URLs) and the rule: *match
  structure/hierarchy/type/spacing/animation; only copy differs.*
- The honesty/`<Gap>` rule + the numbered question list for unknown facts.
- The **numbered section index** (S01…SN) with, for EACH: the owned file path,
  the exact reference element it mirrors (file+line or URL+description), the copy
  (real or gap), and any central token/config/content it may declare.
- The behaviour model (server components + one delegated client file) and the
  fail-open rule.
- The "end your session by emitting a consolidation manifest" instruction.

### Artifact 2 — the per-section session prompt (the thing the human pastes)
A short, fixed prompt the human copies into each new session, then appends the
section number. It must tell that session to:
- Read `MASTER-HANDOFF.md` (attached) end to end.
- Build **only** the section whose number was given — its owned file(s) only.
- Match the referenced element exactly; use `<Gap>` for any unconfirmed fact.
- Not touch any shared file; declare needs in a consolidation manifest instead.
- Stop and report the manifest; not commit/push.

Template:

```
You are building ONE section of a funnel. Read MASTER-HANDOFF.md (attached) in
full before anything else — it defines the client, the stack, the reference
funnel, the file you own, the design tokens, the CSS namespace, and the honesty
rules.

Build ONLY section number: <N>

Rules (from MASTER-HANDOFF):
- Create/edit ONLY the file that section <N> owns. Touch no shared file
  (stylesheet/layout/config/content) — if you need a token/config/content key,
  list it in your manifest and stop; the orchestrator adds it.
- Match the reference element named for section <N> exactly: structure,
  hierarchy, font-size, spacing, animation. Only the copy differs.
- Any fact not supplied = a visible <Gap> chip keyed to its question number.
  Never invent a number, name, or testimonial.
- Server component + real HTML; no per-section client JS.
- End by printing a "consolidation manifest": tokens/config/content you need,
  reference values you used, and any deviation. Do NOT commit or push.
```

---

## 9. Definition of done
- Every section built by its own session; orchestrator merged them into the
  standard framework structure with one stylesheet and centralised config/content.
- Build is clean; every page renders with zero horizontal overflow at all
  breakpoints; reveals/embeds/CTAs work; fail-open verified with JS disabled.
- Every unknown fact is a visible gap chip mapped to a question, not a guess.
- The human only ever supplied: this technique file (to you), and a section
  number (to each section session).

---

*This is a portable method, not a one-client script. Nothing about the reference
funnel, niche, palette, or copy is fixed here — you gather all of that in Phase 1
and encode it into the MASTER-HANDOFF you generate.*
