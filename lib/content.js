/* ============================================================================
   RESET · funnel content
   ----------------------------------------------------------------------------
   STRUCTURE PROVENANCE — this file is shaped to the CONVERGENT hierarchy of the
   two live reference funnels (teamfitarjun.com + thefoodfreedomco.com), read
   page by page on 2026-07-23, not to a summary of them.

   `bold:` arrays mark the clauses that carry mixed-weight emphasis, because
   both references write these as ONE paragraph with a bolded clause rather
   than a bold lead + separate body.

   PROVENANCE RULE unchanged: every number, name and condition comes from the
   strategy document or the transformation stories. `gap:` marks a fact we are
   not allowed to invent; it renders as a visible chip mapped to a question in
   QUESTIONS-FOR-CLIENT.txt.
   ========================================================================== */

/* ---- HERO ---------------------------------------------------------------
   Both references put the condition list INSIDE the hero, as the tail of the
   reach sentence — not as a separate section further down. */
export const CONDITIONS = [
  'PCOS',
  'Thyroid',
  'Insulin Resistance',
  'Irregular Periods',
  'Stubborn Weight',
];

/* ---- STAT CARDS ×4 ------------------------------------------------------
   ARJ's cards are three-line: VALUE / LABEL / SUB-LABEL. FFC's count up.
   Both put the entry price in the fourth card — the price framed as a stat,
   not a cost. */
export const STATS = [
  { value: '300+', label: 'Women Coached', sub: 'PCOS · Thyroid · Insulin', count: 300, suffix: '+' },
  { value: '80–85%', label: 'Success Rate', sub: null, subGap: 'define · Q8.1' },
  { value: '90', label: 'Day Programme', sub: 'Individually built', count: 90 },
  { value: '₹97', label: 'To Start', sub: 'Fully Refundable' },
];

/* ---- "THIS IS FOR YOU IF" ×5 -------------------------------------------
   Exactly five in both references. Each is a CARD with a circled tick, and
   the copy is one paragraph carrying a bolded clause — the bold moves
   position card to card (start, middle, end), which is what stops five cards
   reading like a template. */
export const FIT_CARDS = [
  [
    { t: 'Your TSH is still out of range and the dose went up again', b: true },
    { t: ', even though you have taken the tablet every single morning without missing one.' },
  ],
  [
    { t: 'You eat clean five days out of seven, you walk, you sleep when you can — and ' },
    { t: 'the scale has not moved in months', b: true },
    { t: '. Nobody has been able to tell you why.' },
  ],
  [
    { t: 'Every plan you have tried removed rice, roti and gluten, and you already know ' },
    { t: 'you cannot live like that for twelve weeks', b: true },
    { t: ', let alone for the rest of your life.' },
  ],
  [
    { t: 'You are at your desk ten to fourteen hours a day. Cooking twice a day was never realistic, so meals default to whatever is grabbable — and ' },
    { t: 'you have been told that is the whole problem', b: true },
    { t: '.' },
  ],
  [
    { t: 'You want the weight gone, but you will not post a before-and-after and you would rather not set foot in a gym. ' },
    { t: 'You are looking for something private, individual and built around the week you actually have', b: true },
    { t: '.' },
  ],
];

/* ---- §PROOF · video testimonials ---------------------------------------
   Speaker identity UNRESOLVED — the client named Hima, Shirley and Arya but
   did not map them to files, and none appears in the transformation stories.
   Q13.1 / Q13.2. Posters are DERIVED from a seeked #t= frame (C16). */
export const VIDEOS = [
  { id: 'v1', envKey: 'VIDEO_1', name: 'Hima, Shirley or Arya', gap: 'which client · Q13.1' },
  { id: 'v2', envKey: 'VIDEO_2', name: 'Hima, Shirley or Arya', gap: 'which client · Q13.1' },
  { id: 'v3', envKey: 'VIDEO_3', name: 'Hima, Shirley or Arya', gap: 'which client · Q13.1' },
];

/* ---- §PROOF · written case files ---------------------------------------
   Attribution matches the reference pattern exactly: NAME / AGE · PROFESSION ·
   CITY / ★★★★★ / narrative. Complete for Sneha only — cities are Q13.3. */
export const CASES = [
  {
    name: 'Sneha Vaswendra',
    meta: '26 · CORPORATE LAWYER · FARIDABAD',
    story: 'PCOS and insulin resistance on 12–16 hour days, and three years with other dieticians and coaches that left her heavier than when she started. Working with Shruti she came down from 104 kg to 95 kg, lost six inches off her waist and five off her hips — without a gym and without giving up the food she actually eats.',
    metrics: [
      { v: '104 → 95 kg', k: 'Weight' },
      { v: '46″ → 40″', k: 'Waist', gap: 'Q13.4a' },
      { v: '50″ → 45″', k: 'Hips' },
    ],
  },
  {
    name: 'Simran Jha',
    meta: '25 · CORPORATE COMMUNICATIONS',
    metaGap: 'city · Q13.3',
    story: 'Hypothyroid with a TSH of 6.51, and years of restrictive dieting that had turned every meal into a negotiation. Over twelve weeks her TSH came down to 1.83, she released 4.75 kg, and she went from XXL to XL — but the change she talks about is that food stopped being something she had to win against.',
    metrics: [
      { v: '6.51 → 1.83', k: 'TSH, in 12 weeks' },
      { v: '93 → 88.75 kg', k: 'Weight', gap: 'Q13.4b' },
      { v: 'XXL → XL', k: 'Clothing' },
    ],
  },
  {
    name: 'Adithi',
    meta: '27 · PhD SCHOLAR',
    metaGap: 'city · Q13.3',
    story: 'PCOS, insulin resistance, subclinical thyroid and pre-diabetic markers all at once, plus acanthosis nigricans, hair fall and acne — while running lab work, vivas and submissions. She lost 2.5 kg in the first two weeks, had her HbA1c and fasting glucose back in range by week three, and finished at 56.7 kg.',
    metrics: [
      { v: '62.7 → 56.7 kg', k: 'Weight' },
      { v: 'Week 3', k: 'HbA1c back in range' },
      { v: '2.5 kg', k: 'First two weeks' },
    ],
  },
  {
    name: 'Urvashi',
    meta: '25 · PSYCHOLOGIST',
    metaGap: 'city · Q13.3',
    story: 'PCOD, irregular cycles and low energy, spending her days looking after everyone else’s wellbeing and none of her own. In eight weeks she released 3.5 kg and an inch and a half, her acne settled, and her cycle became regular for the first time in years — without ever being told to cut out her favourite foods.',
    metrics: [
      { v: '63.2 → 59.6 kg', k: 'Weight' },
      { v: '1.5 inches', k: 'In 8 weeks' },
      { v: 'Regular', k: 'Cycle returned' },
    ],
  },
  {
    name: 'Devika',
    meta: '25',
    metaGap: 'profession + city · Q13.3',
    story: 'PCOS and thyroid together — the overlap that makes the scale barely move no matter how carefully she eats. Over twelve weeks she released 5.15 kg through gradual, steady change rather than restriction, and came out of it with a routine she could keep running on her own.',
    metrics: [
      { v: '80 → 74.85 kg', k: 'Weight' },
      { v: '5.15 kg', k: 'Total fat loss' },
      { v: '12 weeks', k: 'Duration' },
    ],
  },
];

/* ---- §TRANSFORMATION STRIP ---------------------------------------------
   ARJ runs a before/after gallery here; FFC runs a scrolling NAME · KGS ·
   CONDITION marquee. We have neither a before/after set nor kg-per-client
   data for a marquee, so this slot holds the chat wall — same position in the
   hierarchy, different component. */
export const CHAT_SHOTS = Array.from({ length: 14 }, (_, i) => {
  const n = String(i + 1).padStart(2, '0');
  return { src: `/img/chat/chat-${n}.jpg`, alt: 'Message from a Reset client' };
});

/* ---- §WHAT'S INCLUDED ---------------------------------------------------
   Both references make the NAMED MECHANISM one of these components rather
   than giving it its own section — ARJ's "Custom Execution Blueprint™" is
   item 02, FFC's "Metabolic Reversal Framework" is item 04. The Overlap Reset
   sits at 02 here, with the four-week sequence inside its body. */
export const INCLUDED = [
  {
    icon: 'read',
    title: 'The Overlap Read',
    body: 'Before a single meal is planned, Shruti maps your markers, your symptoms and your history as one connected picture — which of PCOS, thyroid and insulin resistance is actually holding the weight, and in what order they need to be handled.',
  },
  {
    icon: 'sequence',
    title: 'The Overlap Reset Sequence',
    body: 'The four-week core, run in an order that matters. Week one is gut and water retention, not a deficit — seed cycling for PCOS, selenium and thyroid-supportive foods on top. Week two adds a deficit small enough to survive your week. Week three raises protein and fiber, so you eat more, not less. Week four reintroduces and holds. Your PCOS, thyroid and insulin protocols run simultaneously inside those weeks — that is the overlap, and it is the part nobody else is doing.',
  },
  {
    icon: 'weekly',
    title: 'A New Plan Every Week',
    body: 'Not one plan for twelve weeks. A fresh one each week, built on what the last week actually did — and around your hours, your kitchen and what is realistically cookable on a Tuesday.',
  },
  {
    icon: 'layers',
    title: 'Your Condition Layers',
    body: 'Seed cycling and spearmint for androgen-driven symptoms like hormonal acne and hair fall. Selenium, iodine and thyroid-supportive foods where relevant. Insulin handled through structure, fiber and meal timing rather than elimination.',
  },
  {
    icon: 'training',
    title: 'At-Home Training, Beginner-First',
    body: 'Short guided workouts you can do in your own room, with no gym and no equipment you do not already own. Optional — several clients get their results without training at all.',
  },
  {
    icon: 'support',
    title: 'Weekly Check-Ins & Direct Access',
    body: 'A check-in every week on WhatsApp so a stall gets caught in days rather than months, with an optional weekly call if you would rather talk it through than type it out.',
    gap: 'Shruti or team · Q17.1',
  },
  {
    icon: 'progress',
    title: 'Progress Tracking Beyond The Scale',
    body: 'Every marker, weight, measurement and symptom logged and adjusted weekly — so change stays visible even in the weeks the scale is flat, which with PCOS and thyroid is most of them.',
    gap: 'client access? · Q17.3',
  },
];

/* ---- §GUARANTEE · what we ask in return --------------------------------- */
export const RECIPROCAL = [
  'You show up on time. The slot is held for you and it is not resold.',
  'You answer honestly, including the parts you would rather skip — the diagnosis is only as good as what you tell her.',
  'You say so on the call if it is not for you, so we can refund you and free the slot for someone else.',
];

/* ---- §FAQ ---------------------------------------------------------------
   Both references run the first question open with a "MOST ASKED" pill. The
   last answer is deliberately SLOWER than the reader hopes — that is the
   trust move, and it is not softened. */
export const FAQS = [
  {
    q: 'Is this a sales call?',
    mostAsked: true,
    a: 'No. It is diagnostic. Shruti will look at your markers, your symptoms and the week you actually have, and tell you which of PCOS, thyroid or insulin resistance is holding your weight. If Reset is the right fit she will walk you through it at the end. If it is not, she will say so directly and refund your ₹97. You will not be asked to commit to anything financially on the call.',
  },
  {
    q: 'Is this just another PCOS diet?',
    a: 'No, and the difference is what it treats. A PCOS plan works on your PCOS. Reset sequences your PCOS, your thyroid and your insulin resistance together, because in most of the women who come to us all three are running at once. Treating one and leaving two running is exactly why the last plan stalled at week five.',
  },
  {
    q: 'Will I have to give up rice, roti and gluten?',
    a: 'No. Shruti does not remove them — she limits and reintroduces them, and week four is built specifically around bringing them back. Parathas, pasta and momos live inside her fat-loss plans. This is the single biggest reason her clients stay past week six instead of quietly quitting.',
  },
  {
    q: 'Will this work with a 12-hour desk job and no time to cook?',
    a: 'That is the design input, not the exception. Every plan is built around the week you actually have — your hours, your commute, what is realistically cookable. One of the clients above is a corporate lawyer working 12 to 16 hour days who did this without a gym.',
  },
  {
    q: 'I have tried everything and nothing lasted. Why would this be different?',
    a: 'Because nothing you tried was wrong about the food. It was incomplete about the cause. When a plan addresses one of three overlapping problems it works for a few weeks and then stops — which is what you experienced, and which you were probably told was a discipline problem. It was not.',
  },
  {
    q: 'How long until I actually see something?',
    a: 'You will feel lighter in the first three or four days — less bloating, less puffiness, rings and shoes looser. Most of that is water, and you should know that going in. Real fat loss shows around weeks three to four. Markers like TSH and HbA1c move over months, not weeks — Simran’s TSH took the full twelve. Anyone promising faster is selling you something.',
  },
];

/* ---- BOOK-A-CALL · walk-away outcomes ×3 --------------------------------
   Pattern from both references: an honest diagnosis, a NAMED personal
   failure-point, and a 30-day map. */
export const WALKAWAY = [
  {
    title: 'An Honest Read On What Is Actually Keeping Your Weight Stuck',
    body: 'Where it is PCOS, where it is thyroid, where it is insulin, and where it is simply a week that no plan could survive. Named, not guessed.',
  },
  {
    title: 'The Exact Pattern In Your Week That Undoes The Other Six Days',
    body: 'The 4pm biscuit, the skipped lunch that becomes a 10pm dinner, the Sunday that resets everything. The specific point we structure around.',
  },
  {
    title: 'The Next 90 Days, Mapped',
    body: 'What changes first, what waits, and what you should realistically expect the scale to do — including the weeks it will not move at all.',
  },
];
