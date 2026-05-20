import { Suspense } from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { fetchGHNews, ghTimeAgo } from '@/lib/ghApi';

export const revalidate = 900; // 15 min

const BASE = 'https://www.uru2.com';

export const metadata: Metadata = {
  title: 'Gran Hermano Argentina 2026 — Chismes, Eliminados y Drama | DondeVeo',
  description: 'Todo el chisme de Gran Hermano Argentina 2026: eliminados, escándalos, nominaciones y las últimas noticias del reality más visto de Argentina.',
  keywords: ['Gran Hermano 2026', 'GH Argentina', 'eliminados', 'participantes', 'chismes', 'nominaciones', 'Uruguay'],
  alternates: { canonical: `${BASE}/gran-hermano` },
  openGraph: {
    title: 'Gran Hermano Argentina 2026 | DondeVeo Uruguay',
    description: 'Todo el chisme, eliminados y drama del GH 2026.',
    url: `${BASE}/gran-hermano`,
    type: 'website',
    locale: 'es_UY',
    siteName: 'DondeVeo Uruguay',
  },
};

export default async function GranHermanoListPage() {
  const items = await fetchGHNews().catch(() => []);

  return (
    <div className="min-h-screen bg-[#0d0618]">
      {/* Hero header */}
      <div className="bg-gradient-to-b from-purple-950/60 to-[#0d0618] pt-10 pb-8 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-1.5 text-purple-400 hover:text-white text-sm mb-6 transition-colors">
            ← Volver al inicio
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">🏠</span>
            <div>
              <h1 className="text-white text-3xl md:text-4xl font-black leading-tight flex items-center gap-3 flex-wrap">
                Gran Hermano 2026
                <span className="text-xs font-black uppercase tracking-widest bg-purple-600 text-white px-2 py-1 rounded-full animate-pulse">
                  EN VIVO
                </span>
              </h1>
              <p className="text-purple-400 text-sm mt-1">Todo el chisme, los eliminados y el drama de GH Argentina 🇦🇷</p>
            </div>
          </div>
        </div>
      </div>

      {/* Articles grid */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 pb-16">
        {items.length === 0 ? (
          <p className="text-purple-400 text-center py-20">Cargando las últimas noticias de Gran Hermano...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item, i) => (
              <Link
                key={item.id}
                href={`/gran-hermano/${item.slug}`}
                className="group flex flex-col rounded-xl overflow-hidden bg-[#1a0a2e] border border-purple-900/40 hover:border-purple-500/60 transition-all hover:shadow-xl hover:shadow-purple-900/40 hover:-translate-y-0.5"
              >
                {item.thumbnail ? (
                  <div className="relative h-44 overflow-hidden bg-black flex-shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1a0a2e]/90 to-transparent" />
                    {i === 0 && (
                      <span className="absolute top-2 left-2 text-[10px] font-black uppercase tracking-widest bg-purple-600 text-white px-2 py-0.5 rounded-full">
                        🔥 Destacado
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="h-32 flex-shrink-0 bg-gradient-to-br from-purple-950 via-purple-900 to-[#1a0a2e] flex items-center justify-center">
                    <span className="text-5xl">🏠</span>
                  </div>
                )}
                <div className="p-4 flex flex-col flex-1">
                  <h2 className="text-white font-bold leading-snug mb-2 line-clamp-3 group-hover:text-purple-300 transition-colors flex-1">
                    {item.title}
                  </h2>
                  {item.excerpt && (
                    <p className="text-purple-300/60 text-xs leading-relaxed line-clamp-2 mb-3">
                      {item.excerpt}
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-auto pt-2 border-t border-purple-900/30">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 bg-purple-900/30 px-2 py-0.5 rounded truncate max-w-[130px]">
                      {item.source}
                    </span>
                    {item.pubDate && (
                      <span className="text-[10px] text-purple-400/70 flex-shrink-0">
                        {ghTimeAgo(item.pubDate)}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
