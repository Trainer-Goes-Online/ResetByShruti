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
    </svg>
  );
}

export function Ico({ id, className = 'ico' }) {
  return <svg className={className} aria-hidden="true"><use href={`#i-${id}`} /></svg>;
}
