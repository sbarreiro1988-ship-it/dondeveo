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
        <footer className="mt-16 border-t border-white/8 py-10 px-4 md:px-8">
          <div className="max-w-5xl mx-auto">
            {/* Top row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
              {/* Brand */}
              <div>
                <p className="text-white font-black text-lg mb-2">
                  Donde<span className="text-dv-accent">Veo</span> <span className="text-sm">🇺🇾</span>
                </p>
                <p className="text-dv-muted text-xs leading-relaxed">
                  Tu guía de streaming hecha en Uruguay. Encontrá dónde ver tus películas y series favoritas.
                </p>
              </div>
              {/* Plataformas */}
              <div>
                <p className="text-white font-bold text-sm mb-3">Plataformas</p>
                <ul className="space-y-1.5">
                  {['netflix','disneyplus','max','prime','paramountplus','appletv'].map((p) => (
                    <li key={p}>
                      <a href={`/novedades/${p}`} className="text-dv-muted text-xs hover:text-white transition-colors capitalize">
                        {p === 'disneyplus' ? 'Disney+' : p === 'paramountplus' ? 'Paramount+' : p === 'appletv' ? 'Apple TV+' : p.charAt(0).toUpperCase() + p.slice(1)}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              {/* Géneros */}
              <div>
                <p className="text-white font-bold text-sm mb-3">Géneros</p>
                <ul className="space-y-1.5">
                  {[['accion','Acción'],['comedia','Comedia'],['drama','Drama'],['terror','Terror'],['ciencia','Ciencia ficción'],['thriller','Thriller']].map(([slug,label]) => (
                    <li key={slug}>
                      <a href={`/genero/${slug}`} className="text-dv-muted text-xs hover:text-white transition-colors">{label}</a>
                    </li>
                  ))}
                </ul>
              </div>
              {/* DondeVeo */}
              <div>
                <p className="text-white font-bold text-sm mb-3">DondeVeo</p>
                <ul className="space-y-1.5">
                  {[
                    ['/guias', 'Guías'],
                    ['/acerca', 'Acerca de'],
                    ['/contacto', 'Contacto'],
                    ['/noticias', 'Noticias'],
                    ['/privacidad', 'Privacidad'],
                    ['/terminos', 'Términos de uso'],
                    ['/novedades/netflix', 'Lo nuevo'],
                  ].map(([href, label]) => (
                    <li key={href}>
                      <a href={href} className="text-dv-muted text-xs hover:text-white transition-colors">{label}</a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bottom */}
            <div className="border-t border-white/8 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
              <p className="text-dv-muted text-xs">
                © 2026 DondeVeo Uruguay. Datos de{' '}
                <a href="https://www.themoviedb.org" target="_blank" rel="noopener noreferrer" className="text-dv-accent hover:underline">TMDB</a>.
                La disponibilidad puede variar según tu suscripción y región.
              </p>
              <div className="flex items-center gap-4">
                <a href="/privacidad" className="text-dv-muted text-xs hover:text-white transition-colors">Privacidad</a>
                <span className="text-white/10">·</span>
                <a href="/terminos" className="text-dv-muted text-xs hover:text-white transition-colors">Términos</a>
                <span className="text-white/10">·</span>
                <a href="/contacto" className="text-dv-muted text-xs hover:text-white transition-colors">Contacto</a>
              </div>
            </div>
          </div>
        </footer>

        {/* Terra Ads — solo en noticias, ver app/noticias/[slug]/page.tsx */}
      </body>
    </html>
  );
}
