'use client';

import Link from 'next/link';
import { ghTimeAgo } from '@/lib/ghApi';
import type { GHItem } from '@/lib/ghApi';

interface Props { items: GHItem[] }

function GHCard({ item }: { item: GHItem }) {
  return (
    <a
      href={item.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col rounded-xl overflow-hidden bg-[#1a0a2e] border border-purple-900/40 hover:border-purple-500/60 transition-all hover:shadow-xl hover:shadow-purple-900/40 hover:-translate-y-0.5"
    >
      {/* Thumbnail o placeholder */}
      {item.thumbnail ? (
        <div className="relative h-36 overflow-hidden bg-black flex-shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.thumbnail}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a0a2e]/90 to-transparent" />
        </div>
      ) : (
        <div className="h-24 flex-shrink-0 bg-gradient-to-br from-purple-950 via-purple-900 to-[#1a0a2e] flex items-center justify-center">
          <span className="text-4xl">🏠</span>
        </div>
      )}

      {/* Content */}
      <div className="p-3 flex flex-col flex-1">
        <h3 className="text-white text-sm font-bold leading-snug mb-2 line-clamp-3 group-hover:text-purple-300 transition-colors flex-1">
          {item.title}
        </h3>
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-purple-900/30">
          <span className="text-[9px] font-bold uppercase tracking-wider text-purple-400 bg-purple-900/30 px-1.5 py-0.5 rounded truncate max-w-[120px]">
            {item.source}
          </span>
          {item.pubDate && (
            <span className="text-[10px] text-purple-400/70 flex-shrink-0">
              {ghTimeAgo(item.pubDate)}
            </span>
          )}
        </div>
      </div>
    </a>
  );
}

function GHFeatured({ item }: { item: GHItem }) {
  return (
    <a
      href={item.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative rounded-xl overflow-hidden col-span-2 block bg-[#1a0a2e] border border-purple-800/50 hover:border-purple-400/60 transition-all hover:shadow-2xl hover:shadow-purple-900/50"
    >
      {item.thumbnail ? (
        <div className="relative h-52 md:h-64">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.thumbnail}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0618]/95 via-[#1a0a2e]/50 to-transparent" />
          <div className="absolute bottom-0 inset-x-0 p-4">
            <p className="text-purple-300 text-xs font-bold uppercase tracking-widest mb-1">
              🔥 Más leído · {item.source}
            </p>
            <h3 className="text-white text-lg font-black leading-tight line-clamp-2 group-hover:text-purple-200 transition-colors">
              {item.title}
            </h3>
          </div>
        </div>
      ) : (
        <div className="p-5 bg-gradient-to-r from-purple-950 to-[#1a0a2e]">
          <p className="text-purple-300 text-xs font-bold uppercase tracking-widest mb-2">🔥 Más leído</p>
          <h3 className="text-white text-lg font-black leading-tight group-hover:text-purple-200 transition-colors">
            {item.title}
          </h3>
        </div>
      )}
    </a>
  );
}

export default function GranHermanoSection({ items }: Props) {
  if (!items || items.length === 0) return null;

  const [featured, ...rest] = items;
  const cards = rest.slice(0, 6);

  return (
    <section className="mb-10 px-4 md:px-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🏠</span>
          <div>
            <h2 className="text-white text-xl font-black leading-tight flex items-center gap-2">
              Gran Hermano 2026
              <span className="text-[10px] font-black uppercase tracking-widest bg-purple-600 text-white px-2 py-0.5 rounded-full animate-pulse">
                EN VIVO
              </span>
            </h2>
            <p className="text-purple-400 text-xs mt-0.5">Chismes, eliminados, escándalos y todo el drama 🇦🇷</p>
          </div>
        </div>
        <a
          href="https://news.google.com/search?q=Gran+Hermano+Argentina+2026&hl=es-419"
          target="_blank"
          rel="noopener noreferrer"
          className="text-purple-400 text-xs font-bold border border-purple-700/50 px-3 py-1.5 rounded-lg hover:bg-purple-900/30 transition-colors hidden sm:inline-flex"
        >
          Ver todo →
        </a>
      </div>

      {/* Featured + 1 card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
        {featured && <GHFeatured item={featured} />}
        {cards[0] && <GHCard item={cards[0]} />}
      </div>

      {/* Grid */}
      {cards.length > 1 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {cards.slice(1).map(item => (
            <GHCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </section>
  );
}
