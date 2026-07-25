import Script from 'next/script';
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
  'The 90-day programme for women whose PCOS, thyroid and insulin resistance are all happening at once — backed by a 100% money-back guarantee. A ₹97 call books a 30-minute 1:1 with Shruti.';

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
        {/* ── Analytics + Pixel (afterInteractive so they never block paint) ──
            GA4 + Clarity carry no monetary values and are independent of Meta.
            The Meta Pixel fires PageView ONLY (no standard conversion events,
            no content params) — its job here is to set the `_fbp` cookie that
            the server-side ic_event / sales events need to reach 9.3 EMQ. All
            purchase-quality signal is sent server-side via CAPI, never here. */}
        {CONFIG.GA4_ID && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${CONFIG.GA4_ID}`} strategy="afterInteractive" />
            <Script id="ga4-init" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${CONFIG.GA4_ID}');`}
            </Script>
          </>
        )}
        {CONFIG.CLARITY_ID && (
          <Script id="clarity-init" strategy="afterInteractive">
            {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${CONFIG.CLARITY_ID}");`}
          </Script>
        )}
        {CONFIG.META_PIXEL_ID && (
          <Script id="meta-pixel" strategy="afterInteractive">
            {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${CONFIG.META_PIXEL_ID}');fbq('track','PageView');`}
          </Script>
        )}
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
