import Script from 'next/script';
import { Newsreader, Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import Icons from '@/components/Icons';
import Lightbox from '@/components/Lightbox';
import FunnelEffects from '@/components/FunnelEffects';
import { CONFIG } from '@/lib/config';

/* C1 · three voices. display = emotion & authorship · mono = spec/precision ·
   sans = neutral body. Loaded through next/font so they are self-hosted and
   never block first paint on a third-party request.

   The funnel now runs a real three-voice system (client direction):
     display  Newsreader      — every h1/h2/h3 and display number
     body     Inter           — unchanged
     eyebrow  JetBrains Mono  — the uppercase wide-tracked labels above heads

   ⚠ Each face exposes its OWN variable (--f-newsreader / --f-inter /
   --f-jetbrains) and globals.css maps them onto --fh/--fb/--fm. Binding
   next/font straight to --f-display the way this file used to do put the
   generated stylesheet and the :root block in a same-specificity race for the
   same custom property — it only ever looked correct because both sides
   happened to name Playfair. Separate names remove the race entirely. */
const newsreader = Newsreader({
  subsets: ['latin'], weight: ['400', '500', '600', '700', '800'],
  style: ['normal', 'italic'], variable: '--f-newsreader', display: 'swap',
});
const inter = Inter({
  subsets: ['latin'], weight: ['400', '500', '600', '700', '800'],
  variable: '--f-inter', display: 'swap',
});
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'], weight: ['400', '500', '600', '700', '800'],
  variable: '--f-jetbrains', display: 'swap',
});

/* metadataBase makes every page's canonical + Open Graph URL resolve to the
   live domain, so relative paths in per-page metadata become absolute. It also
   satisfies Razorpay's check that the site declares its own canonical origin. */
const SITE = CONFIG.CANONICAL_HOST;
const TITLE =
  'Reset by Shruti Solanki: PCOS, Thyroid & Insulin Resistance, Treated Together';
const DESCRIPTION =
  'The 90-day programme for women whose PCOS, thyroid and insulin resistance are all happening at once, backed by a 100% money-back guarantee. A ₹97 call books a 30-minute 1:1 with Shruti.';

/* THE LINK-PREVIEW CARD.
   Without an explicit og:image, WhatsApp / Instagram / iMessage fall back to
   scraping the page and picking whatever large image they find first, which
   here was a client's avatar from the hero cluster: a stranger's face on every
   shared link. This is a purpose-built 1200x630 brand card.

   Constraints it is built to satisfy:
     · 1200 x 630 (1.91:1) is the size every platform crops to cleanly
     · JPEG at 70 KB. WhatsApp routinely fails to generate a preview above
       roughly 300 KB, which the 441 KB PNG version would have tripped
     · absolute URL, which metadataBase above resolves the leading slash into.
       WhatsApp ignores relative og:image paths entirely
   Scrapers cache aggressively, so after a copy change the file must be
   re-cut and the URL re-scraped in each platform's debugger. */
const OG_IMAGE = {
  url: '/og.jpg',
  width: 1200,
  height: 630,
  type: 'image/jpeg',
  alt: 'RESET by Shruti Solanki. PCOS, thyroid and insulin resistance, treated together.',
};

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
    locale: 'en_IN',
    images: [OG_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: [OG_IMAGE.url],
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
    <html lang="en" className={`${newsreader.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
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
