import { Suspense } from 'react';
import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import Navbar from '@/components/Navbar';

const BASE = 'https://www.uru2.com';

export const metadata: Metadata = {
  metadataBase: new URL(BASE),
  title: {
    default: 'DondeVeo Uruguay — Dónde ver películas y series en streaming',
    template: '%s | DondeVeo Uruguay',
  },
  description: 'Encontrá dónde ver películas, series y documentales en Uruguay. Netflix, Disney+, Max, Prime Video, Paramount+, Apple TV+ y más plataformas de streaming.',
  keywords: [
    'streaming Uruguay', 'donde ver películas Uruguay', 'Netflix Uruguay',
    'Disney Plus Uruguay', 'Max Uruguay', 'Prime Video Uruguay',
    'series streaming Uruguay', 'películas online Uruguay', 'estrenos streaming',
    'novedades Netflix', 'catalogo streaming UY', 'ver series online Uruguay',
  ],
  authors: [{ name: 'DondeVeo', url: BASE }],
  creator: 'DondeVeo Uruguay',
  publisher: 'DondeVeo Uruguay',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  openGraph: {
    type: 'website',
    locale: 'es_UY',
    url: BASE,
    siteName: 'DondeVeo Uruguay',
    title: 'DondeVeo Uruguay — Dónde ver películas y series en streaming',
    description: 'Tu guía de streaming en Uruguay. Encontrá dónde ver tus películas y series favoritas.',
    images: [{ url: `${BASE}/og-image.png`, width: 1200, height: 630, alt: 'DondeVeo Uruguay' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DondeVeo Uruguay — Streaming Guide',
    description: 'Encontrá dónde ver películas y series en Uruguay.',
    images: [`${BASE}/og-image.png`],
  },
  alternates: {
    canonical: BASE,
  },
  verification: {
    google: 'GzH06nFfoNJ_mk_e2mWZARgvc_rIRmieXAS8kFOQ4ac',
  },
};

// JSON-LD global — WebSite + Organization
const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${BASE}/#website`,
      url: BASE,
      name: 'DondeVeo Uruguay',
      description: 'Guía de streaming en Uruguay',
      inLanguage: 'es-UY',
      potentialAction: {
        '@type': 'SearchAction',
        target: { '@type': 'EntryPoint', urlTemplate: `${BASE}/?q={search_term_string}` },
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'Organization',
      '@id': `${BASE}/#organization`,
      name: 'DondeVeo Uruguay',
      url: BASE,
      logo: {
        '@type': 'ImageObject',
        url: `${BASE}/favicon.svg`,
        width: 32,
        height: 32,
      },
      sameAs: [],
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-UY">
      <head>
        {/* Google Analytics — debe estar en <head> para verificación Search Console */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-4CS9M4DMP0" />
        <script dangerouslySetInnerHTML={{ __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-4CS9M4DMP0');
        `}} />
        {/* Google AdSense */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4971004283595233"
          crossOrigin="anonymous"
        />
        {/* JSON-LD global */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body>
        <Suspense fallback={null}>
          <Navbar />
        </Suspense>
        {children}
        <footer className="mt-16 border-t border-white/8 py-8 px-4 md:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <p className="text-white font-bold text-lg mb-1">
              DondeVeo <span className="text-dv-accent">🇺🇾</span>
            </p>
            <p className="text-dv-muted text-sm mb-4">
              Tu guía de streaming hecha en Uruguay.
            </p>
            <p className="text-dv-muted text-xs">
              Los datos de disponibilidad son orientativos y se actualizan periódicamente desde TMDB.
              Algunos títulos pueden variar según tu suscripción y región.
            </p>
            <p className="text-dv-muted text-xs mt-2">
              Datos provistos por{' '}
              <a href="https://www.themoviedb.org" target="_blank" rel="noopener noreferrer" className="text-dv-accent hover:underline">
                The Movie Database (TMDB)
              </a>
              {' '}· watch_region=UY
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
