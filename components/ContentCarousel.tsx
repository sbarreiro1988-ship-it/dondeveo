'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MovieCard from './MovieCard';
import StreamingBadge from './StreamingBadge';
import type { Movie, Platform } from '@/types';

interface Props {
  title: string;
  description?: string;         // shown in sidebar layout
  movies: Movie[];
  showRanks?: boolean;
  platformBadge?: Platform | null;
  platformId?: string;
  cinemaOnly?: boolean;
  layout?: 'default' | 'sidebar'; // sidebar = JustWatch style (title left, cards right)
  onMovieClick?: (movie: Movie) => void;
}

export default function ContentCarousel({
  title,
  description,
  movies,
  showRanks = false,
  platformBadge = null,
  platformId,
  cinemaOnly = false,
  layout = 'default',
  onMovieClick,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft]   = useState(false);
  const [canRight, setCanRight] = useState(true);

  function scroll(dir: 'left' | 'right') {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir === 'left' ? -(el.clientWidth * 0.75) : el.clientWidth * 0.75, behavior: 'smooth' });
  }

  function onScroll() {
    const el = ref.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 10);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 10);
  }

  const verTodosHref    = platformId ? `/plataforma/${platformId}` : null;
  const loNuevoHref     = platformId ? `/novedades/${platformId}` : null;

  if (movies.length === 0) return null;

  // ── Sidebar layout: desktop = title left / cards right, mobile = title above ─
  if (layout === 'sidebar') {
    return (
      <section className="mb-8">
        {/* ── Mobile: título arriba (< md) ── */}
        <div className="md:hidden px-4 mb-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-wrap min-w-0">
              <h2 className="text-white text-base font-bold leading-snug">{title}</h2>
              {platformBadge && <StreamingBadge platform={platformBadge} size="sm" />}
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              {loNuevoHref && (
                <Link href={loNuevoHref} className="text-dv-accent text-xs font-semibold whitespace-nowrap">
                  ✨ Lo nuevo
                </Link>
              )}
              {verTodosHref && (
                <Link href={verTodosHref} className="text-dv-muted text-xs whitespace-nowrap hover:text-white">
                  Ver todos →
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* ── Desktop: sidebar izquierda + cards (>= md) ── */}
        <div className="hidden md:flex items-start">
          <div className="flex-shrink-0 w-52 pl-8 pr-4 pt-1 flex flex-col gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-white text-base font-bold leading-snug">{title}</h2>
              {platformBadge && <StreamingBadge platform={platformBadge} size="sm" />}
            </div>
            {description && (
              <p className="text-dv-muted text-xs leading-relaxed">{description}</p>
            )}
            <div className="flex flex-col gap-1 mt-1">
              {loNuevoHref && (
                <Link href={loNuevoHref} className="text-dv-accent text-xs hover:underline font-semibold">
                  ✨ Lo nuevo →
                </Link>
              )}
              {verTodosHref ? (
                <Link href={verTodosHref} className="text-dv-muted text-xs hover:text-white hover:underline">
                  Ver todo el catálogo →
                </Link>
              ) : (
                <span className="text-dv-muted text-xs select-none">Ver todos →</span>
              )}
            </div>
          </div>
          {/* Cards desktop */}
          <div className="relative flex-1 min-w-0 group/carousel">
            {canLeft && (
              <>
                <div className="absolute left-0 top-0 bottom-2 w-12 bg-gradient-to-r from-dv-bg to-transparent z-10 pointer-events-none" />
                <button onClick={() => scroll('left')} className="absolute left-1 top-[45%] -translate-y-1/2 z-20 bg-black/80 hover:bg-black text-white p-2 rounded-full shadow-lg opacity-0 group-hover/carousel:opacity-100 transition-all">
                  <ChevronLeft size={18} />
                </button>
              </>
            )}
            {canRight && (
              <>
                <div className="absolute right-0 top-0 bottom-2 w-12 bg-gradient-to-l from-dv-bg to-transparent z-10 pointer-events-none" />
                <button onClick={() => scroll('right')} className="absolute right-1 top-[45%] -translate-y-1/2 z-20 bg-black/80 hover:bg-black text-white p-2 rounded-full shadow-lg opacity-0 group-hover/carousel:opacity-100 transition-all">
                  <ChevronRight size={18} />
                </button>
              </>
            )}
            <div ref={ref} onScroll={onScroll} className="flex gap-3 overflow-x-auto scrollbar-hide pr-4 pb-2">
              {movies.map((movie, i) => (
                <MovieCard key={movie.id} movie={cinemaOnly ? { ...movie, platforms: [] } : movie}
                  showRank={showRanks ? (movie.rank ?? i + 1) : undefined} onClick={onMovieClick} />
              ))}
            </div>
          </div>
        </div>

        {/* ── Mobile: cards (< md) ── */}
        <div className="md:hidden relative group/carousel">
          {canLeft && (
            <>
              <div className="absolute left-0 top-0 bottom-2 w-10 bg-gradient-to-r from-dv-bg to-transparent z-10 pointer-events-none" />
              <button onClick={() => scroll('left')} className="absolute left-1 top-[45%] -translate-y-1/2 z-20 bg-black/80 text-white p-2 rounded-full shadow-lg opacity-0 group-hover/carousel:opacity-100 transition-all">
                <ChevronLeft size={16} />
              </button>
            </>
          )}
          {canRight && (
            <>
              <div className="absolute right-0 top-0 bottom-2 w-10 bg-gradient-to-l from-dv-bg to-transparent z-10 pointer-events-none" />
              <button onClick={() => scroll('right')} className="absolute right-1 top-[45%] -translate-y-1/2 z-20 bg-black/80 text-white p-2 rounded-full shadow-lg opacity-0 group-hover/carousel:opacity-100 transition-all">
                <ChevronRight size={16} />
              </button>
            </>
          )}
          <div ref={ref} onScroll={onScroll} className="flex gap-3 overflow-x-auto scrollbar-hide px-4 pb-2">
            {movies.map((movie, i) => (
              <MovieCard key={movie.id} movie={cinemaOnly ? { ...movie, platforms: [] } : movie}
                showRank={showRanks ? (movie.rank ?? i + 1) : undefined} onClick={onMovieClick} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // ── Default layout ─────────────────────────────────────────────────────────
  return (
    <section className="mb-8">
      {/* Title row */}
      <div className="flex items-center justify-between mb-3 px-4 md:px-8">
        <div className="flex items-center gap-2.5">
          <h2 className="text-white text-lg font-bold">{title}</h2>
          {platformBadge && <StreamingBadge platform={platformBadge} size="sm" />}
        </div>
        {verTodosHref ? (
          <Link href={verTodosHref} className="text-dv-accent text-sm hover:underline flex-shrink-0">
            Ver todos →
          </Link>
        ) : (
          <span className="text-dv-muted text-sm flex-shrink-0 select-none">Ver todos →</span>
        )}
      </div>

      {/* Carousel */}
      <div className="relative group/carousel">
        {canLeft && (
          <>
            <div className="absolute left-0 top-0 bottom-2 w-16 bg-gradient-to-r from-dv-bg to-transparent z-10 pointer-events-none" />
            <button
              onClick={() => scroll('left')}
              className="absolute left-1 top-[45%] -translate-y-1/2 z-20 bg-black/80 hover:bg-black text-white p-2.5 rounded-full shadow-lg opacity-0 group-hover/carousel:opacity-100 transition-all hover:scale-110"
            >
              <ChevronLeft size={20} />
            </button>
          </>
        )}
        {canRight && (
          <>
            <div className="absolute right-0 top-0 bottom-2 w-16 bg-gradient-to-l from-dv-bg to-transparent z-10 pointer-events-none" />
            <button
              onClick={() => scroll('right')}
              className="absolute right-1 top-[45%] -translate-y-1/2 z-20 bg-black/80 hover:bg-black text-white p-2.5 rounded-full shadow-lg opacity-0 group-hover/carousel:opacity-100 transition-all hover:scale-110"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
        <div
          ref={ref}
          onScroll={onScroll}
          className="flex gap-3 overflow-x-auto scrollbar-hide px-4 md:px-8 pb-2"
        >
          {movies.map((movie, i) => (
            <MovieCard
              key={movie.id}
              movie={cinemaOnly ? { ...movie, platforms: [] } : movie}
              showRank={showRanks ? (movie.rank ?? i + 1) : undefined}
              onClick={onMovieClick}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
