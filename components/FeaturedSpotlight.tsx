'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Star, Info } from 'lucide-react';
import StreamingBadge from './StreamingBadge';
import type { Movie } from '@/types';

interface Props {
  movies: Movie[];
  onMovieClick?: (movie: Movie) => void;
}

export default function FeaturedSpotlight({ movies, onMovieClick }: Props) {
  const slides = movies.filter((m) => m.backdropPath && !m.backdropPath.includes('placeholder')).slice(0, 8);
  const [current, setCurrent] = useState(0);

  const next = useCallback(
    () => setCurrent((c) => (c + 1) % slides.length),
    [slides.length],
  );

  useEffect(() => {
    if (slides.length < 2) return;
    const t = setInterval(next, 6000);
    return () => clearInterval(t);
  }, [next, slides.length]);

  if (!slides.length) return null;

  const movie = slides[current];
  const year  = movie.releaseDate ? new Date(movie.releaseDate + 'T00:00:00').getFullYear() : '';

  return (
    <div className="relative w-full overflow-hidden mb-8" style={{ height: 220 }}>
      {/* Backdrop */}
      <Image
        key={movie.id}
        src={movie.backdropPath}
        alt={movie.title}
        fill
        className="object-cover object-center"
        unoptimized
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#111]/95 via-[#111]/70 to-black/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#111]/70 to-transparent" />

      {/* Content */}
      <div className="relative h-full flex items-center px-6 md:px-10 gap-5">
        {/* Poster */}
        <div className="flex-shrink-0 h-36 w-24 rounded-lg overflow-hidden shadow-2xl ring-1 ring-white/10 hidden sm:block">
          <Image
            src={movie.posterPath}
            alt={movie.title}
            width={96}
            height={144}
            className="object-cover w-full h-full"
            unoptimized
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          {movie.platforms.length > 0 && (
            <div className="flex gap-1.5 mb-2">
              {movie.platforms.slice(0, 2).map((pl) => (
                <StreamingBadge key={pl.id} platform={pl} size="sm" />
              ))}
            </div>
          )}
          <h3 className="text-white text-xl md:text-2xl font-black leading-tight mb-1.5 line-clamp-1">
            {movie.title}
          </h3>
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            {movie.voteAverage > 0 && (
              <span className="flex items-center gap-1 bg-yellow-400/15 border border-yellow-400/30 px-2 py-0.5 rounded-full">
                <Star size={11} className="text-yellow-400 fill-yellow-400" />
                <span className="text-yellow-400 text-xs font-bold">{movie.voteAverage.toFixed(1)}</span>
              </span>
            )}
            {year && <span className="text-gray-400 text-xs">{year}</span>}
            <span className="text-dv-accent text-xs font-semibold">
              {movie.type === 'series' ? 'Serie' : 'Película'}
            </span>
          </div>
          <p className="text-gray-300 text-sm leading-relaxed line-clamp-2 max-w-lg mb-3">
            {movie.overview}
          </p>
          <button
            onClick={() => onMovieClick?.(movie)}
            className="flex items-center gap-2 bg-dv-accent hover:bg-dv-accent-dark text-dv-bg text-xs font-black px-4 py-2 rounded-lg transition-all"
          >
            <Info size={13} />
            Más información
          </button>
        </div>
      </div>

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`rounded-full transition-all ${
              i === current ? 'w-5 h-1.5 bg-dv-accent' : 'w-1.5 h-1.5 bg-white/30 hover:bg-white/60'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
