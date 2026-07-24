import { Playfair_Display, Inter } from 'next/font/google';
import './globals.css';
import Icons from '@/components/Icons';
import Lightbox from '@/components/Lightbox';
import FunnelEffects from '@/components/FunnelEffects';
import { CONFIG } from '@/lib/config';

/* C1 · three voices. display = emotion & authorship · mono = spec/precision ·
   sans = neutral body. Loaded through next/font so they are self-hosted and
   never block first paint on a third-party request. */
/* Measured from teamfitarjun.com: Playfair Display 700 for display, Inter for
   everything else. The reference uses NO mono voice — its eyebrows are Inter
   700 uppercase — so --f-mono maps to the same family rather than introducing
   a third face the reference does not have. */
const playfair = Playfair_Display({
  subsets: ['latin'], weight: ['600', '700', '800'], style: ['normal', 'italic'],
  variable: '--f-display', display: 'swap',
});
const inter = Inter({
  subsets: ['latin'], weight: ['400', '500', '600', '700', '800'],
  variable: '--f-sans', display: 'swap',
});

/* metadataBase makes every page's canonical + Open Graph URL resolve to the
   live domain, so relative paths in per-page metadata become absolute. It also
   satisfies Razorpay's check that the site declares its own canonical origin. */
const SITE = CONFIG.CANONICAL_HOST;
const TITLE =
  'Reset by Shruti Solanki — PCOS, Thyroid & Insulin Resistance, Treated Together';
const DESCRIPTION =
  'The 90-day programme for women whose PCOS, thyroid and insulin resistance are all happening at once. ₹97, fully refundable, books a 30-minute 1:1 with Shruti.';

export const metadata = {
  metadataBase: new URL(SITE),
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: SITE,
    siteName: 'Reset by Shruti Solanki',
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }) {
  /* data-accent is the skin's palette switcher. Omitted = the skin's DEFAULT
     gold accent against forest ink. Set data-accent="emerald" here to swap the
     whole funnel to the green accent — one attribute, no stylesheet edit. */
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body>
        <Icons />
        {children}
        {/* C15 · the overlay is authored at the ROOT of the page tree, never
            inside a section. Every decorated section creates a stacking context
            and would trap it beneath the sticky CTA bar. */}
        <Lightbox />
        <FunnelEffects />
      </body>
    </html>
  );
}
