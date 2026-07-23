/* C11 · ONE bespoke icon family, one stroke weight (1.6), coloured via
   currentColor from tokens. No emoji as UI, no icon fonts, no mixed weights.
   Rendered once at the document root; every component references by <use>. */
export default function Icons() {
  return (
    <svg style={{ display: 'none' }} aria-hidden="true">
      <symbol id="i-check" viewBox="0 0 24 24">
        <path d="M4 12.5l5.2 5.2L20 7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </symbol>
      <symbol id="i-shield" viewBox="0 0 24 24">
        <path d="M12 2.6l7.5 3v6.1c0 4.6-3.1 8.4-7.5 9.7-4.4-1.3-7.5-5.1-7.5-9.7V5.6z" />
        <path d="M8.8 12.2l2.2 2.2 4.2-4.4" />
      </symbol>
      <symbol id="i-users" viewBox="0 0 24 24">
        <circle cx="9" cy="8" r="3.2" />
        <path d="M2.8 20c0-3.4 2.8-5.6 6.2-5.6s6.2 2.2 6.2 5.6" />
        <path d="M16.4 5.2a3.2 3.2 0 010 5.9M17.6 14.8c2.2.6 3.6 2.4 3.6 5.2" />
      </symbol>
      <symbol id="i-spark" viewBox="0 0 24 24">
        <path d="M12 2.8l2.2 5.6 5.6 2.2-5.6 2.2L12 18.4l-2.2-5.6L4.2 10.6l5.6-2.2z" />
      </symbol>
      <symbol id="i-play" viewBox="0 0 24 24"><path d="M8 5.2l11 6.8-11 6.8z" /></symbol>
      <symbol id="i-arrow" viewBox="0 0 24 24"><path d="M4 12h15M13 6l6 6-6 6" /></symbol>
      <symbol id="i-arrow-d" viewBox="0 0 24 24"><path d="M12 4.5v14M6 13l6 6 6-6" /></symbol>
      <symbol id="i-plus" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" /></symbol>
      <symbol id="i-x" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18" /></symbol>
      <symbol id="i-clock" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="M12 7v5.4l3.4 2" /></symbol>
      <symbol id="i-lock" viewBox="0 0 24 24"><rect x="4.5" y="10.5" width="15" height="10" rx="2.2" /><path d="M8 10.5V7.8a4 4 0 018 0v2.7" /></symbol>
      <symbol id="i-cart" viewBox="0 0 24 24"><path d="M3 4.5h2.6l2.3 11h9.6l2.1-8H6.4" /><circle cx="9.4" cy="19" r="1.4" /><circle cx="17.2" cy="19" r="1.4" /></symbol>
      <symbol id="i-chev" viewBox="0 0 24 24"><path d="M6 9.5l6 6 6-6" /></symbol>
      <symbol id="i-mail" viewBox="0 0 24 24"><rect x="3" y="5.5" width="18" height="13" rx="2.2" /><path d="M3.6 6.8L12 12.6l8.4-5.8" /></symbol>
      <symbol id="i-chat" viewBox="0 0 24 24"><path d="M20.5 11.6c0 4-3.8 7.2-8.5 7.2a9.7 9.7 0 01-2.8-.4L4.5 20l1.3-3.5a6.9 6.9 0 01-2.3-5c0-4 3.8-7.2 8.5-7.2s8.5 3.2 8.5 7.3z" /></symbol>
      <symbol id="i-star" viewBox="0 0 24 24"><path d="M12 2.6l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.6l-5.9 3 1.2-6.5L2.5 9.5l6.6-.9z" /></symbol>
      <symbol id="i-user" viewBox="0 0 24 24"><circle cx="12" cy="8" r="3.4" /><path d="M5 20c0-3.6 3.1-6 7-6s7 2.4 7 6" /></symbol>
      {/* ── Added by the `thank-you` session (Track B). Seven marks the
          post-conversion pages needed and the family did not have. No
          presentation attributes: stroke, fill and width stay in CSS so a
          consumer can size and colour them from currentColor. ── */}
      <symbol id="i-calendar" viewBox="0 0 24 24">
        <rect x="3.2" y="5.4" width="17.6" height="15.4" rx="2.2" />
        <path d="M16 3.2v4.2M8 3.2v4.2M3.2 11h17.6M9.2 15.4l2 2 3.6-3.8" />
      </symbol>
      <symbol id="i-info" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9.2" />
        <path d="M12 7.6v.2M12 11v5.6" />
      </symbol>
      <symbol id="i-file" viewBox="0 0 24 24">
        <path d="M13.8 2.8H6.6a2 2 0 00-2 2v14.4a2 2 0 002 2h10.8a2 2 0 002-2V8.4z" />
        <path d="M13.8 2.8v5.6h5.6M8.8 13.4h6.4M8.8 17h4.4" />
      </symbol>
      <symbol id="i-pill" viewBox="0 0 24 24">
        <rect x="4.4" y="8.4" width="15.2" height="11.8" rx="2.4" />
        <path d="M12 8.4V4.2M9 4.2h6" />
        <circle cx="12" cy="14.3" r="2" />
      </symbol>
      <symbol id="i-plate" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="8.8" />
        <circle cx="12" cy="12" r="4.6" />
      </symbol>
      <symbol id="i-repeat" viewBox="0 0 24 24">
        <path d="M4 11.2A8 8 0 0117.6 6.6l2.4 2.2M20 12.8A8 8 0 016.4 17.4L4 15.2" />
        <path d="M20 4.6v4.2h-4.2M4 19.4v-4.2h4.2" />
      </symbol>
      <symbol id="i-eye" viewBox="0 0 24 24">
        <path d="M2.4 12S6 5.6 12 5.6 21.6 12 21.6 12 18 18.4 12 18.4 2.4 12 2.4 12z" />
        <circle cx="12" cy="12" r="3" />
      </symbol>
    </svg>
  );
}

export function Ico({ id, className = 'ico' }) {
  return <svg className={className} aria-hidden="true"><use href={`#i-${id}`} /></svg>;
}
