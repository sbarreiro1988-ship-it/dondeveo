import { Suspense } from 'react';
import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'DondeVeo 🇺🇾 — Películas y series en Uruguay',
  description: 'Encontrá dónde ver películas, series y deportes en tus plataformas de streaming en Uruguay. Netflix, Disney+, Max, Prime Video y más.',
  keywords: ['streaming', 'Uruguay', 'películas', 'series', 'Netflix', 'Disney+', 'Max', 'donde ver'],
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  openGraph: {
    title: 'DondeVeo 🇺🇾',
    description: 'Tu guía de streaming en Uruguay',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-UY">
      <head>
        {/* Google AdSense — se activa cuando Google apruebe el sitio */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4971004283595233"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <Suspense fallback={null}>
          <Navbar />
        </Suspense>
        {/* Google Analytics */}
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-4CS9M4DMP0" strategy="afterInteractive" />
        <Script id="ga-init" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-4CS9M4DMP0');
        `}</Script>
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
              <a
                href="https://www.themoviedb.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-dv-accent hover:underline"
              >
                The Movie Database (TMDB)
              </a>{' '}
              · watch_region=UY
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
