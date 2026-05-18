'use client';

import Image from 'next/image';
import type { StreamingRemoval } from '@/lib/streamingAvailability';

interface Props {
  items: StreamingRemoval[];
}

function urgencyColor(daysLeft: number): { border: string; badge: string; glow: string } {
  if (daysLeft <= 7) {
    return {
      border: 'border-red-500 animate-pulse',
      badge: 'bg-red-600 text-white',
      glow: 'shadow-[0_0_18px_2px_rgba(239,68,68,0.45)]',
    };
  }
  if (daysLeft <= 14) {
    return {
      border: 'border-orange-500',
      badge: 'bg-orange-500 text-white',
      glow: 'shadow-[0_0_14px_2px_rgba(249,115,22,0.35)]',
    };
  }
  return {
    border: 'border-yellow-500',
    badge: 'bg-yellow-500 text-black',
    glow: 'shadow-[0_0_10px_2px_rgba(234,179,8,0.25)]',
  };
}

function DaysChip({ daysLeft }: { daysLeft: number }) {
  const { badge } = urgencyColor(daysLeft);
  if (daysLeft <= 7) {
    return (
      <span className={`absolute top-2 left-2 text-[10px] font-black px-2 py-0.5 rounded-full ${badge} animate-pulse z-10`}>
        ¡Solo {daysLeft}d!
      </span>
    );
  }
  return (
    <span className={`absolute top-2 left-2 text-[10px] font-black px-2 py-0.5 rounded-full ${badge} z-10`}>
      {daysLeft} días
    </span>
  );
}

function PlatformBadge({ platform }: { platform: string }) {
  const colors: Record<string, string> = {
    Netflix: 'bg-red-700',
    'Prime Video': 'bg-sky-700',
    'Disney+': 'bg-blue-800',
    Max: 'bg-purple-800',
    'Apple TV+': 'bg-gray-700',
    'Paramount+': 'bg-indigo-700',
  };
  const bg = colors[platform] ?? 'bg-gray-700';
  return (
    <span className={`absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full text-white z-10 ${bg}`}>
      {platform}
    </span>
  );
}

function MovieCard({ item }: { item: StreamingRemoval }) {
  const { border, glow } = urgencyColor(item.daysLeft);

  return (
    <div
      className={`relative flex-shrink-0 w-36 md:w-44 rounded-xl overflow-hidden border-2 ${border} ${glow} bg-[#0a0a1a] transition-transform hover:scale-105 cursor-pointer`}
    >
      {/* Poster */}
      <div className="relative w-full aspect-[2/3]">
        {item.posterUrl ? (
          <Image
            src={item.posterUrl}
            alt={item.title}
            fill
            className="object-cover"
            unoptimized
            sizes="(max-width: 768px) 144px, 176px"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-b from-[#1a1a2e] to-[#0a0a1a] flex items-center justify-center">
            <span className="text-4xl">🎬</span>
          </div>
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

        {/* Badges */}
        <DaysChip daysLeft={item.daysLeft} />
        <PlatformBadge platform={item.streamingPlatform} />

        {/* Bottom info */}
        <div className="absolute bottom-0 left-0 right-0 p-2">
          <p className="text-white text-xs font-bold leading-tight line-clamp-2 mb-0.5">
            {item.title}
          </p>
          <div className="flex items-center gap-1.5">
            {item.year > 0 && (
              <span className="text-white/50 text-[10px]">{item.year}</span>
            )}
            {item.imdbRating && (
              <span className="text-yellow-400 text-[10px] font-bold">
                ★ {item.imdbRating.toFixed(1)}
              </span>
            )}
          </div>
          <p className="text-white/60 text-[10px] mt-0.5">
            Sale: {item.removeDate}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function UltimaOportunidad({ items }: Props) {
  if (!items || items.length === 0) return null;

  return (
    <section className="px-4 md:px-8 mb-8">
      {/* Section header */}
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-white text-lg font-black">
          ⏳ Última Oportunidad
        </h2>
        <span className="text-[10px] font-black uppercase tracking-widest bg-red-600 text-white px-2.5 py-0.5 rounded-full animate-pulse">
          URGENTE
        </span>
        <span className="text-dv-muted text-xs ml-1">
          Salen pronto del catálogo
        </span>
      </div>

      {/* Horizontal scroll */}
      <div className="relative">
        {/* Fade right */}
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-dv-bg to-transparent z-10" />

        <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          {items.map((item) => (
            <MovieCard key={item.id} item={item} />
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-2">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse inline-block" />
          <span className="text-white/40 text-[10px]">≤7 días</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-orange-500 inline-block" />
          <span className="text-white/40 text-[10px]">8–14 días</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 inline-block" />
          <span className="text-white/40 text-[10px]">15–30 días</span>
        </div>
      </div>
    </section>
  );
}
