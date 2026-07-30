'use client';

import { useEffect } from 'react';
import { CONFIG } from '@/lib/config';
import { captureParams, trackGa4Once, fireMetaAtcOnce } from '@/lib/track';

/* ============================================================================
   All funnel behaviour, mounted ONCE at the page root.

   Why event delegation on the document rather than per-component state:
   every section is a SERVER component, so the markup is real HTML before any
   JS runs. That is what makes the reveals genuinely fail-open (C7) — if this
   file never executes, the page is still complete and every CTA still works.

   Build-time rules honoured here (shape.md · Build-time gotchas):
     · never setState or read a ref's .current during render — everything is
       inside useEffect
     · rAF loops bail on document.hidden so they don't burn cycles or desync
     · the overlay is moved to document.body, never given a bigger z-index
   ========================================================================== */
export default function FunnelEffects() {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const $ = (s, r = document) => r.querySelector(s);
    const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
    const cleanups = [];

    /* ------------------------------------------- ATTRIBUTION (LP → thank-you)
       First-touch capture of the utm params, fbclid and gclid into localStorage,
       so checkout can pack them into the Razorpay order.notes and the webhook can
       rebuild the full Pabbly row + high-EMQ `sales` event. Runs on every page;
       only writes on the first page that actually carries params. */
    captureParams();

    /* --------------------------------------- CTA TRACKING (add_to_cart / atc)
       One delegated, capture-phase listener covers EVERY checkout CTA — hero,
       mid-page, pricing, closing, and the sticky bar — including ones injected
       later. Capture phase + optimistic dedup flags mean the signal survives
       the navigation the click triggers. Fires GA4 `add_to_cart` (once) and the
       Meta `atc_event` beacon (once), both independent, both non-blocking. */
    const onCtaClick = (e) => {
      const t = e.target;
      const a = t && t.closest && t.closest('a.cta-big, a.stuck-cta, a[href="/checkout"]');
      if (!a) return;
      trackGa4Once('add_to_cart');
      fireMetaAtcOnce();
    };
    document.addEventListener('click', onCtaClick, true);
    cleanups.push(() => document.removeEventListener('click', onCtaClick, true));

    /* ------------------------------------------------- BOOK_CALL (GA4, iframe)
       Calendly books inside an iframe — no button of ours to attach to — so we
       listen for its postMessage. Origin-checked, fires GA4 `book_call` once on
       a real scheduled event. */
    const onCalendlyMsg = (e) => {
      if (typeof e.origin === 'string' && e.origin.endsWith('calendly.com')
        && e.data && e.data.event === 'calendly.event_scheduled') {
        trackGa4Once('book_call');
      }
    };
    window.addEventListener('message', onCalendlyMsg);
    cleanups.push(() => window.removeEventListener('message', onCalendlyMsg));

    /* ---------------------------------------------------- REVEAL (fail-open)
       The element is VISIBLE from the server. We add `.armed` to <body> only
       now, which is what actually applies opacity:0 — so content can never get
       stuck blank waiting on an observer that may never fire. Revealed on the
       FIRST of: intersection, already-above-fold, or a rAF sweep catching
       content already scrolled past (anchor jumps / restored scroll). */
    const revealEls = $$('.reveal');
    if (revealEls.length && !reduced && 'IntersectionObserver' in window) {
      document.body.classList.add('armed');
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
          });
        },
        { rootMargin: '0px 0px -8% 0px', threshold: 0.02 }
      );
      revealEls.forEach((el) => {
        if (el.getBoundingClientRect().top < window.innerHeight * 1.05) el.classList.add('in');
        else io.observe(el);
      });
      requestAnimationFrame(() => {
        revealEls.forEach((el) => {
          if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add('in');
        });
      });
      cleanups.push(() => { io.disconnect(); document.body.classList.remove('armed'); });
    }

    /* ------------------------------------------------------------- COUNT-UP
       The real value is already in the HTML, so a failed animation leaves the
       correct number on screen — never a zero. */
    const counters = $$('[data-count]');
    if (counters.length && !reduced && 'IntersectionObserver' in window) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (!e.isIntersecting) return;
            io.unobserve(e.target);
            const el = e.target;
            const target = parseFloat(el.dataset.count);
            const suffix = el.dataset.suffix || '';
            if (Number.isNaN(target)) return;
            const start = performance.now();
            const tick = (now) => {
              if (document.hidden) { el.textContent = target + suffix; return; }
              const p = Math.min((now - start) / 1300, 1);
              el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))) + suffix;
              if (p < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
          });
        },
        { threshold: 0.4 }
      );
      counters.forEach((el) => io.observe(el));
      cleanups.push(() => io.disconnect());
    }

    /* ------------------------------------------------------------------ FAQ
       R4/C6 — the CSS does the physical part (wash + stripe + indent + icon
       rotate). This only flips the class and ARIA. */
    const onFaq = (e) => {
      const btn = e.target.closest('.qa .q');
      if (!btn) return;
      const qa = btn.closest('.qa');
      const open = qa.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(open));
    };
    document.addEventListener('click', onFaq);
    cleanups.push(() => document.removeEventListener('click', onFaq));

    /* -------------------------------------------------- ORDER SUMMARY (R11) */
    /* The summary is only collapsible when it actually ships a toggle bar. The
       reference checkout renders it as an open panel, so on that layout there
       is no bar — guard rather than assume, or the whole effects file throws
       and takes every other behaviour on the page down with it. */
    const summary = $('#summary');
    const summaryBar = summary && $('.summary-bar', summary);
    if (summary && summaryBar) {
      if (window.innerWidth >= 860) summary.classList.add('is-open');
      const onSum = () => {
        const open = summary.classList.toggle('is-open');
        summaryBar.setAttribute('aria-expanded', String(open));
      };
      summaryBar.addEventListener('click', onSum);
      cleanups.push(() => summaryBar.removeEventListener('click', onSum));
    }

    /* -------------------------------------------------------- LIGHTBOX (C15)
       The node is authored in the layout at the page root. We defensively
       re-parent to <body> — an overlay inside a decorated section is trapped
       by that section's stacking context and painted over by page chrome. The
       fix is always to MOVE the node, never to raise the z-index. */
    const ov = $('#lightbox');
    if (ov) {
      if (ov.parentElement !== document.body) document.body.appendChild(ov);
      const slot = $('.overlay-inner', ov);
      let lastFocus = null;

      const close = () => {
        ov.classList.remove('open');
        document.body.classList.remove('locked');
        slot.replaceChildren();
        if (lastFocus) { try { lastFocus.focus(); } catch {} }
      };
      const open = (node) => {
        lastFocus = document.activeElement;
        slot.replaceChildren(node);
        ov.classList.add('open');
        document.body.classList.add('locked');
        $('.overlay-close', ov)?.focus();
      };

      const onOpen = (e) => {
        const vid = e.target.closest('[data-video]');
        if (vid) {
          const v = document.createElement('video');
          v.src = vid.dataset.video;
          v.controls = true; v.autoplay = true; v.playsInline = true; v.preload = 'metadata';
          open(v);
          return;
        }
        const img = e.target.closest('[data-img]');
        if (img) {
          const i = document.createElement('img');
          i.src = img.dataset.img;
          i.alt = img.dataset.alt || 'Client message';
          open(i);
        }
      };
      const onKey = (e) => { if (e.key === 'Escape' && ov.classList.contains('open')) close(); };

      document.addEventListener('click', onOpen);
      document.addEventListener('keydown', onKey);
      $('.overlay-close', ov).addEventListener('click', close);
      $('.overlay-bg', ov).addEventListener('click', close);
      cleanups.push(() => {
        document.removeEventListener('click', onOpen);
        document.removeEventListener('keydown', onKey);
      });
    }

    /* ------------------------------------------------------ STICKY CTA (R8)
       Hidden until past the hero; hides again at the final CTA so it never
       duplicates a CTA the user can already see. */
    const bar = $('#stickycta');
    const hero = $('#hero');
    if (bar && hero) {
      document.body.classList.add('has-sticky');   // reserve its height
      const finale = $('#finale');
      let ticking = false;
      const update = () => {
        const pastHero = hero.getBoundingClientRect().bottom < 0;
        const atFinale = finale ? finale.getBoundingClientRect().top < window.innerHeight * 0.9 : false;
        bar.classList.toggle('in', pastHero && !atFinale);
      };
      const onScroll = () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => { update(); ticking = false; });
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      update();
      cleanups.push(() => {
        window.removeEventListener('scroll', onScroll);
        document.body.classList.remove('has-sticky');
      });
    }

    /* -------------------------------------------- JOURNEY SPINE (R9 · heavy)
       The rail fill and glowing head track scroll progress; each node ignites
       as the head reaches it. The page's one heavy moment. */
    const spine = $('#spine');
    if (spine) {
      const rows = $$('.stagerow', spine);
      if (reduced) {
        rows.forEach((r) => r.classList.add('lit'));
      } else {
        let ticking = false;
        const update = () => {
          if (document.hidden) return;
          const box = spine.getBoundingClientRect();
          const anchor = window.innerHeight * 0.55;
          const fill = Math.max(0, Math.min(1, (anchor - box.top) / box.height));
          spine.style.setProperty('--fill', fill.toFixed(4));
          spine.style.setProperty('--headop', fill > 0.001 && fill < 0.999 ? '1' : '0');
          rows.forEach((row) => row.classList.toggle('lit', row.getBoundingClientRect().top < anchor + 40));
        };
        const onScroll = () => {
          if (ticking) return;
          ticking = true;
          requestAnimationFrame(() => { update(); ticking = false; });
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', update, { passive: true });
        update();
        cleanups.push(() => {
          window.removeEventListener('scroll', onScroll);
          window.removeEventListener('resize', update);
        });
      }
    }

    /* -------------------------------------- TESTIMONIAL VIDEO PREVIEWS
       Play each muted testimonial clip only while it is on screen — iOS needs a
       programmatic play() on a muted + inline element to paint a frame (a
       seeked-frame poster stays blank there), and gating by viewport keeps all
       four clips from decoding at once on a phone. */
    const previewVids = $$('.tcard-vid video');
    if (previewVids.length) {
      const tryPlay = (v) => { const p = v.play && v.play(); if (p && p.catch) p.catch(() => {}); };
      if ('IntersectionObserver' in window) {
        const vio = new IntersectionObserver((entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) tryPlay(e.target);
            else { try { e.target.pause(); } catch { /* ignore */ } }
          });
        }, { threshold: 0.25 });
        previewVids.forEach((v) => vio.observe(v));
        cleanups.push(() => vio.disconnect());
      } else {
        previewVids.forEach(tryPlay);
      }
    }

    /* ------------------------------------------ VSL · GA4 video_play (C16)
       The Vimeo player is rendered natively in the markup (it shows the
       thumbnail configured in Vimeo + its own play button). We attach the Vimeo
       Player SDK and fire GA4 `video_play` on the player's `play` event —
       trackGa4Once dedupes to once per browser even if the visitor replays.
       player.js loads afterInteractive, so we poll briefly until it's ready.
       Fail-open: if the SDK never loads, the video still plays, we just lose the
       GA4 signal. */
    const frame = $('#vslframe');
    if (frame && CONFIG.VSL_VIMEO_URL) {
      const facade = $('.vsl-facade', frame);
      if (facade) {
        const play = () => {
          const url = CONFIG.VSL_VIMEO_URL;
          const sep = url.includes('?') ? '&' : '?';
          const f = document.createElement('iframe');
          f.src = `${url}${sep}autoplay=1&playsinline=1&badge=0&autopause=0&title=0&byline=0&portrait=0&dnt=1`;
          f.allow = 'autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share';
          f.setAttribute('allowfullscreen', '');
          f.referrerPolicy = 'strict-origin-when-cross-origin';
          f.title = 'Reset by Shruti Solanki — watch the short video';
          frame.appendChild(f);
          facade.remove();               // reveal the player (Vimeo controls now show)
          trackGa4Once('video_play');    // once per browser, on OUR play button
        };
        /* <button> so Enter/Space work natively; just wire the click. */
        facade.addEventListener('click', play);
      }
    }

    /* ------------------------------------------------ SLIDEABLE MARQUEES
       Every [data-marquee] row — the two message-wall rows and the case-file
       row — is a native horizontal scroll container whose set is authored
       twice. Autoplay is a scrollLeft loop rather than a CSS transform, which
       is what makes the row draggable: the visitor and the loop are now moving
       the SAME property, so a swipe or a click-drag simply takes over instead
       of fighting a transform that owns the element.

       The wrap is by half the scroll width — one full set — so the seam is
       invisible in both directions and the row can be pushed past either end
       without ever running out of content.

       Fails open: if this never runs the rows are static but still swipeable
       and trackpad-scrollable, because that part is pure CSS. */
    $$('[data-marquee]').forEach((row) => {
      const track = row.firstElementChild;
      if (!track) return;

      const durSec = Number(row.getAttribute('data-marquee')) || 40;
      const back = row.getAttribute('data-dir') === 'rtl';
      let half = 0;
      let pos = 0;
      let hovering = false;
      let dragging = false;
      let holdUntil = 0;          /* grace period after a manual interaction */
      let raf = 0;

      /* scrollWidth halves because the set is rendered twice. Re-measured on
         resize AND after images decode — a row measured before its lazy images
         have intrinsic size would wrap at the wrong offset. */
      const measure = () => {
        const next = row.scrollWidth / 2;
        if (next > 0 && Math.abs(next - half) > 1) {
          half = next;
          pos = back ? half : 0;
          row.scrollLeft = pos;
        }
      };
      measure();

      const manual = () => hovering || performance.now() < holdUntil || reduced;

      /* pos is tracked as a float and written to scrollLeft each frame. Adding
         a sub-pixel delta straight onto scrollLeft would be rounded away at
         these speeds and the row would never move at all. */
      let last = 0;
      const step = (ts) => {
        raf = requestAnimationFrame(step);
        const dt = last ? Math.min(ts - last, 64) : 0;
        last = ts;
        if (document.hidden || half <= 0) return;

        /* Anything that moved the row other than this loop — a swipe, touch
           momentum, a trackpad, an end-clamp — wins. Resyncing here rather
           than yanking the row back to a stale pos is what lets autoplay
           resume from wherever the visitor let go. */
        if (Math.abs(row.scrollLeft - pos) > 2) pos = row.scrollLeft;

        if (dragging || manual()) return;

        pos += (back ? -1 : 1) * (half / durSec) * (dt / 1000);
        if (pos >= half) pos -= half;
        else if (pos < 0) pos += half;
        row.scrollLeft = pos;
      };
      raf = requestAnimationFrame(step);
      cleanups.push(() => cancelAnimationFrame(raf));

      /* Native touch/trackpad scrolling moves scrollLeft with no pointer event
         we drive, and a scroll container CLAMPS at both ends — so without this
         a hard swipe parks the visitor against a dead edge. Re-entering by one
         set is invisible because the second set is a copy of the first.

         Two things keep this from ping-ponging at the seam. It only runs while
         the row is under manual control (autoplay does its own wrapping on pos,
         and its post-wrap position would otherwise trip the low branch every
         cycle), and the thresholds are offset by a pixel so a row sitting
         exactly on the boundary satisfies neither branch. */
      const onScroll = () => {
        if (half <= 0 || dragging || !manual()) return;
        if (row.scrollLeft >= half + 1) row.scrollLeft -= half;
        else if (row.scrollLeft < 1) row.scrollLeft += half;
      };
      row.addEventListener('scroll', onScroll, { passive: true });

      const hold = () => { holdUntil = performance.now() + 1400; };

      const onEnter = () => { hovering = true; };
      const onLeave = () => { hovering = false; };
      row.addEventListener('pointerenter', onEnter);
      row.addEventListener('pointerleave', onLeave);
      row.addEventListener('focusin', onEnter);
      row.addEventListener('focusout', onLeave);

      /* Mouse click-drag. Touch is deliberately left to the platform — its
         native momentum scrolling is better than anything reimplemented here,
         and preventDefault on a touch pointerdown would kill it. */
      let startX = 0;
      let startScroll = 0;
      let moved = 0;

      const onDown = (e) => {
        if (e.pointerType !== 'mouse' || e.button !== 0) { hold(); return; }
        dragging = true; moved = 0;
        startX = e.clientX;
        startScroll = row.scrollLeft;
        row.classList.add('is-dragging');
        try { row.setPointerCapture(e.pointerId); } catch {}
        e.preventDefault();
      };

      const onMove = (e) => {
        if (!dragging) return;
        const dx = e.clientX - startX;
        moved = Math.max(moved, Math.abs(dx));
        row.scrollLeft = startScroll - dx;
        pos = row.scrollLeft;
      };

      const onUp = (e) => {
        if (!dragging) return;
        dragging = false;
        row.classList.remove('is-dragging');
        try { row.releasePointerCapture(e.pointerId); } catch {}
        hold();
        /* A drag that crossed the slop threshold must not also fire the click
           that would open the lightbox under the cursor. Swallowed once, in
           the capture phase, before the delegated [data-img] handler sees it. */
        if (moved > 6) {
          const swallow = (ev) => { ev.preventDefault(); ev.stopPropagation(); };
          row.addEventListener('click', swallow, { capture: true, once: true });
          setTimeout(() => row.removeEventListener('click', swallow, true), 350);
        }
      };

      row.addEventListener('pointerdown', onDown);
      row.addEventListener('pointermove', onMove);
      row.addEventListener('pointerup', onUp);
      row.addEventListener('pointercancel', onUp);

      const onResize = () => { half = 0; measure(); };
      window.addEventListener('resize', onResize);
      const settle = setTimeout(measure, 600);   /* after lazy images decode */

      cleanups.push(() => {
        clearTimeout(settle);
        window.removeEventListener('resize', onResize);
        row.removeEventListener('scroll', onScroll);
        row.removeEventListener('pointerenter', onEnter);
        row.removeEventListener('pointerleave', onLeave);
        row.removeEventListener('focusin', onEnter);
        row.removeEventListener('focusout', onLeave);
        row.removeEventListener('pointerdown', onDown);
        row.removeEventListener('pointermove', onMove);
        row.removeEventListener('pointerup', onUp);
        row.removeEventListener('pointercancel', onUp);
      });
    });

    /* --------------------------------------------------- COUNTDOWN (3-HOUR)
       The reference funnels run a 3-hour "OFFER ENDS IN HH : MM : SS" clock
       inside every CTA block, and it restarts on every page load. Ours keeps
       the same 3-hour window and the same HRS/MIN/SEC anatomy, but anchors the
       deadline in sessionStorage — so it counts down continuously across a
       visit instead of resetting each time she scrolls back or reloads.
       A real deadline or intake cap in config overrides it. */
    const urgencyHosts = $$('[data-urgency]');
    if (urgencyHosts.length) {
      /* Two paint modes against the SAME slot.
         · segments — the clock. Writes only the digit nodes CtaBlock already
           rendered, so nothing is destroyed and nothing reflows.
         · sentence — the intake-cap variant. Replaces the segments outright,
           so the host is flagged .cd-plain and the CSS stands the segment
           geometry down. */
      const paintClock = (h, m, s) => urgencyHosts.forEach((host) => {
        host.style.display = '';
        const seg = { h, m, s };
        const cells = $$('[data-cd]', host);
        if (!cells.length) {                       // markup without segments
          const t = $('.u-text', host);
          if (t) t.textContent = `${h} Hrs : ${m} Min : ${s} Sec`;
          return;
        }
        cells.forEach((cell) => {
          const next = seg[cell.getAttribute('data-cd')];
          if (next !== undefined && cell.textContent !== next) cell.textContent = next;
        });
      });

      const paintSentence = (txt) => urgencyHosts.forEach((host) => {
        host.style.display = '';
        host.classList.add('cd-plain');
        const t = $('.u-text', host);
        if (t) t.textContent = txt;
      });

      if (CONFIG.MONTHLY_INTAKE_CAP) {
        paintSentence(`Only ${CONFIG.MONTHLY_INTAKE_CAP} new clients taken each month`);
      } else {
        const WINDOW_MS = 5 * 60 * 60 * 1000;
        let end;
        if (CONFIG.COUNTDOWN_DEADLINE) {
          end = new Date(CONFIG.COUNTDOWN_DEADLINE).getTime();
        } else {
          const KEY = 'reset_cd_end';
          const stored = Number(sessionStorage.getItem(KEY));
          end = stored && stored > Date.now() ? stored : Date.now() + WINDOW_MS;
          try { sessionStorage.setItem(KEY, String(end)); } catch {}
        }

        const pad = (n) => String(n).padStart(2, '0');
        const tick = () => {
          const left = end - Date.now();
          if (left <= 0) { paintClock('00', '00', '00'); return; }
          const h = Math.floor(left / 36e5);
          const m = Math.floor((left % 36e5) / 6e4);
          const sec = Math.floor((left % 6e4) / 1000);
          paintClock(pad(h), pad(m), pad(sec));
        };
        tick();
        const id = setInterval(tick, 1000);
        cleanups.push(() => clearInterval(id));
      }
    }

    /* ------------------------------------------------------- CALENDLY (C16) */
    const cal = $('#calendly');
    if (cal && CONFIG.CALENDLY_URL && !cal.querySelector('iframe')) {
      const url = CONFIG.CALENDLY_URL;
      const sep = url.includes('?') ? '&' : '?';
      const f = document.createElement('iframe');
      f.src = `${url}${sep}hide_gdpr_banner=1`;
      f.title = 'Book your call with Shruti';
      f.loading = 'lazy';
      cal.appendChild(f);
    }

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return null;
}
