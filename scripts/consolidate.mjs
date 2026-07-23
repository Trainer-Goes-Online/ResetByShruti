#!/usr/bin/env node
/* ============================================================================
   CONSOLIDATE — collapse the per-session CSS split back into one stylesheet.

   WHY THE SPLIT EXISTED: twelve parallel sessions editing one globals.css would
   clobber each other. One file per owner made that impossible. That constraint
   dies the moment the last session reports, and this script removes it.

   WHAT IT DOES
     1. Reads the section-stylesheet import order out of app/layout.jsx
     2. Appends each app/sections/*.css into app/globals.css, in that order,
        under a labelled banner
     3. Rewrites layout.jsx to a single `import './globals.css'`
     4. Deletes app/sections/
     5. Verifies brace balance before and after — refuses to write if broken

   WHAT IT DOES NOT TOUCH
     components/sections/*.jsx stays. One component per section IS idiomatic
     Next.js — it is the CSS fragmentation that was the temporary scaffold.

   USAGE
     node scripts/consolidate.mjs --check    # report only, write nothing
     node scripts/consolidate.mjs            # perform the merge
   ========================================================================== */

import { readFileSync, writeFileSync, rmSync, existsSync, readdirSync } from 'node:fs';
import { join, basename } from 'node:path';

const ROOT = process.cwd();
const LAYOUT = join(ROOT, 'app/layout.jsx');
const GLOBALS = join(ROOT, 'app/globals.css');
const SECTIONS_DIR = join(ROOT, 'app/sections');
const CHECK_ONLY = process.argv.includes('--check');

const balance = (css) => (css.match(/{/g) || []).length - (css.match(/}/g) || []).length;

function fail(msg) {
  console.error(`\n✗ ${msg}\n`);
  process.exit(1);
}

if (!existsSync(SECTIONS_DIR)) fail('app/sections/ does not exist — already consolidated?');

/* ---- 1. import order is the source of truth for cascade order ------------ */
const layout = readFileSync(LAYOUT, 'utf8');
const order = [...layout.matchAll(/import '\.\/sections\/([^']+)';/g)].map((m) => m[1]);

const onDisk = readdirSync(SECTIONS_DIR).filter((f) => f.endsWith('.css')).sort();
const missing = onDisk.filter((f) => !order.includes(f));
if (missing.length) {
  fail(
    `these stylesheets exist but are NOT imported in layout.jsx, so their cascade ` +
    `position is unknown — add the imports first:\n  ${missing.join('\n  ')}`
  );
}

console.log(`\nMerging ${order.length} section stylesheets in cascade order:`);

/* ---- 2. validate every input before touching anything -------------------- */
let broken = false;
for (const f of order) {
  const p = join(SECTIONS_DIR, f);
  if (!existsSync(p)) fail(`layout.jsx imports ${f} but the file is missing`);
  const b = balance(readFileSync(p, 'utf8'));
  const flag = b === 0 ? '✓' : `✗ brace balance ${b > 0 ? '+' : ''}${b}`;
  if (b !== 0) broken = true;
  console.log(`  ${flag}  ${f}`);
}
if (broken) fail('one or more stylesheets have unbalanced braces — fix before merging');

const globalsCss = readFileSync(GLOBALS, 'utf8');
if (balance(globalsCss) !== 0) fail(`app/globals.css brace balance is ${balance(globalsCss)}`);

if (CHECK_ONLY) {
  console.log('\n✓ check passed — all inputs balanced and accounted for. Nothing written.\n');
  process.exit(0);
}

/* ---- 3. concatenate ------------------------------------------------------ */
const banner = (f) => {
  const name = basename(f, '.css');
  const bar = '='.repeat(76);
  return `\n\n/* ${bar}\n   ${name.toUpperCase()}\n   ${bar} */\n`;
};

let merged = globalsCss.trimEnd() + '\n';
for (const f of order) {
  let css = readFileSync(join(SECTIONS_DIR, f), 'utf8');
  // strip the per-file ownership header — it is meaningless post-merge
  css = css.replace(/^\/\*[\s\S]*?OWNED BY[\s\S]*?\*\/\s*/, '');
  merged += banner(f) + css.trim() + '\n';
}

if (balance(merged) !== 0) fail(`merged output brace balance is ${balance(merged)} — aborted`);

/* ---- 4. write ------------------------------------------------------------ */
writeFileSync(GLOBALS, merged);

const newLayout = layout
  .replace(/import '\.\/sections\/[^']+';\n?/g, '')
  .replace(
    /\/\* Shared layer first[\s\S]*?section\. \*\/\n/,
    ''
  );
writeFileSync(LAYOUT, newLayout);

rmSync(SECTIONS_DIR, { recursive: true, force: true });

console.log(`
✓ merged into app/globals.css (${merged.split('\n').length} lines, braces balanced)
✓ layout.jsx now imports one stylesheet
✓ app/sections/ removed

Next:
  1. npx next build          (dev server must be STOPPED first)
  2. visual regression sweep at 320/360/390/414/768/1280/1440 on all four routes
`);
