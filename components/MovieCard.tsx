'use client';

import Image from 'next/image';
import { Star, Info } from 'lucide-react';
import StreamingBadge from './StreamingBadge';
import type { Movie } from '@/types';

interface Props {
  movie: Movie;
  showRank?: number;
  onClick?: (movie: Movie) => void;
}

export default function MovieCard({ movie, showRank, onClick }: Props) {
  // JustWatch uses ~130px wide poster cards
  const POSTER_W = 140;
  // Ranked cards need left space for the number — number takes ~55px visible
  const RANK_OFFSET = 52;
  const totalWidth = showRank ? POSTER_W + RANK_OFFSET : POSTER_W;

  return (
    <div
      className="relative flex-shrink-0 cursor-pointer group/card"
      style={{ width: totalWidth }}
      onClick={() => onClick?.(movie)}
    >
      {/* ── Rank number (JustWatch style: huge, behind card, left-aligned) ── */}
      {showRank && (
        <div
          className="absolute bottom-6 left-0 z-0 select-none pointer-events-none leading-none"
          style={{
            fontSize: '130px',
            fontWeight: 900,
            fontFamily: '"Arial Black", "Arial Bold", Impact, sans-serif',
            color: 'transparent',
            WebkitTextStroke: '2px rgba(255,255,255,0.14)',
            lineHeight: 1,
            letterSpacing: '-0.04em',
          }}
        >
          {showRank}
        </div>
      )}

      {/* ── Poster ── */}
      <div
        className={`relative z-10 overflow-hidden bg-dv-card transition-all duration-300
          group-hover/card:scale-[1.04] group-hover/card:shadow-2xl group-hover/card:shadow-black/70
          rounded-lg ${showRank ? `ml-[${RANK_OFFSET}px]` : ''}`}
        style={{
          width: POSTER_W,
          aspectRatio: '2/3',
          marginLeft: showRank ? RANK_OFFSET : 0,
        }}
      >
        <Image
          src={movie.posterPath}
          alt={movie.title}
          fill
          className="object-cover transition-transform duration-500 group-hover/card:scale-105"
          sizes="140px"
          unoptimized
        />

        {/* Permanent bottom gradient for title */}
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

        {/* Platform badge — top-left, always visible */}
        {movie.platforms.length > 0 && (
          <div className="absolute top-1.5 left-1.5 flex flex-col gap-0.5">
            {movie.platforms.slice(0, 1).map((pl) => (
              <StreamingBadge key={pl.id} platform={pl} size="sm" />
            ))}
          </div>
        )}

        {/* Title at bottom — always visible */}
        <div className="absolute bottom-0 inset-x-0 px-2 pb-2">
          <p className="text-white text-[11px] font-semibold leading-tight line-clamp-2 drop-shadow">
            {movie.title}
          </p>
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/card:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-2.5 gap-1.5">
          {/* Rating row */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {movie.voteAverage > 0 && (
              <span className="flex items-center gap-1 bg-yellow-400/20 border border-yellow-400/30 px-1.5 py-0.5 rounded-full">
                <Star size={9} className="text-yellow-400 fill-yellow-400" />
                <span className="text-yellow-400 text-[10px] font-bold">{movie.voteAverage.toFixed(1)}</span>
              </span>
            )}
            <span className="text-gray-300 text-[10px]">
              {movie.type === 'series'
                ? movie.seasons ? `${movie.seasons} temp.` : 'Serie'
                : movie.runtime  ? `${movie.runtime} min` : 'Película'}
            </span>
          </div>

          {/* Más info button */}
          <button
            className="w-full flex items-center justify-center gap-1 bg-dv-accent hover:bg-dv-accent-dark text-[#111] text-[10px] font-black py-1.5 rounded-md transition-colors"
            onClick={(e) => { e.stopPropagation(); onClick?.(movie); }}
          >
            <Info size={10} />
            Más info
          </button>
        </div>
      </div>
    </div>
  );
}
