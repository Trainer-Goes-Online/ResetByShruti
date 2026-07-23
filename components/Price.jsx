import { CONFIG } from '@/lib/config';

/* The price is never inlined into a component (C16). Every appearance reads
   from lib/config.js, which reads .env.local — so a price change is ONE edit. */
export default function Price() {
  return <>{CONFIG.CURRENCY}{CONFIG.ENTRY_PRICE}</>;
}

/* A [MISSING] fact renders as a VISIBLE chip. It must never look like finished
   copy and must never silently vanish — an absent number is a question for the
   client, not a licence to invent one. */
export function Gap({ children }) {
  return <span className="gap">{children}</span>;
}
