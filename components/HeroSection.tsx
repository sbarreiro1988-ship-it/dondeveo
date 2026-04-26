'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { Play, Info, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import StreamingBadge from './StreamingBadge';
import type { Movie } from '@/types';

interface Props {
  movies: Movie[];
  onMovieClick?: (movie: Movie) => void;
}

export default function HeroSection({ movies, onMovieClick }: Props) {
  const slides = movies.slice(0, 5);
  const [current, setCurrent] = useState(0);
  const [transitioning, setTransitioning] = useState(false);

  const goTo = useCallback((idx: number) => {
    setTransitioning(true);
    setTimeout(() => {
      setCurrent(idx);
      setTransitioning(false);
    }, 350);
  }, []);

  const next = useCallback(() => goTo((current + 1) % slides.length), [current, goTo, slides.length]);
  const prev = useCallback(() => goTo((current - 1 + slides.length) % slides.length), [current, goTo, slides.length]);

  useEffect(() => {
    if (slides.length < 2) return;
    const t = setInterval(next, 7000);
    return () => clearInterval(t);
  }, [next, slides.length]);

  if (!slides.length) return null;

  const movie = slides[current];
  const year = movie.releaseDate ? new Date(movie.releaseDate + 'T00:00:00').getFullYear() : '';

  return (
    <div className="relative h-[72vh] min-h-[500px] max-h-[780px] w-full overflow-hidden bg-black">
      {/* Backdrop */}
      <div className={`absolute inset-0 transition-opacity duration-500 ${transitioning ? 'opacity-0' : 'opacity-100'}`}>
        <Image
          key={movie.id}
          src={movie.backdropPath}
          alt={movie.title}
          fill
          priority
          className="object-cover object-center"
          unoptimized
          sizes="100vw"
        />
      </div>

      {/* Gradients */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/65 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-black/30" />

      {/* Content */}
      <div className={`relative h-full flex items-center px-6 md:px-12 lg:px-20 transition-all duration-400 ${transitioning ? 'opacity-0 translate-y-3' : 'opacity-100 translate-y-0'}`}>
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-bold text-dv-accent uppercase tracking-[0.2em] border border-dv-accent/40 px-2.5 py-1 rounded">
              🇺🇾 Disponible en Uruguay
            </span>
          </div>

          <h1 className="text-white text-4xl md:text-6xl font-black leading-tight mb-3 drop-shadow-lg">
            {movie.title}
          </h1>

          <div className="flex items-center gap-3 mb-4 flex-wrap">
            {movie.voteAverage > 0 && (
              <div className="flex items-center gap-1.5">
                <Star size={14} className="text-yellow-400 fill-yellow-400" />
                <span className="text-yellow-400 font-bold">{movie.voteAverage.toFixed(1)}</span>
              </div>
            )}
            {year && <span className="text-gray-300 text-sm">{year}</span>}
            {movie.runtime && <span className="text-gray-400 text-sm">{movie.runtime} min</span>}
            {movie.genres.slice(0, 3).map((g) => (
              <span key={g} className="text-xs text-gray-300 border border-white/20 px-2 py-0.5 rounded">
                {g}
              </span>
            ))}
          </div>

          <p className="text-gray-200 text-base leading-relaxed mb-6 line-clamp-3 max-w-lg drop-shadow">
            {movie.overview}
          </p>

          {movie.platforms.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {movie.platforms.map((pl) => (
                <StreamingBadge key={pl.id} platform={pl} size="lg" />
              ))}
            </div>
          )}

          <div className="flex gap-3">
            {movie.platforms[0] ? (
              <a
                href={movie.platforms[0].url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-dv-accent hover:bg-dv-accent-dark text-dv-bg font-black px-6 py-3 rounded-xl transition-all text-sm shadow-lg hover:shadow-dv-accent/30"
              >
                <Play size={16} fill="currentColor" /> Ver ahora
              </a>
            ) : (
              <button
                onClick={() => onMovieClick?.(movie)}
                className="flex items-center gap-2 bg-dv-accent hover:bg-dv-accent-dark text-dv-bg font-black px-6 py-3 rounded-xl transition-all text-sm shadow-lg hover:shadow-dv-accent/30"
              >
                <Play size={16} fill="currentColor" /> Ver trailer
              </button>
            )}
            <button
              onClick={() => onMovieClick?.(movie)}
              className="flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white font-semibold px-6 py-3 rounded-xl transition-all text-sm backdrop-blur-sm border border-white/10"
            >
              <Info size={16} /> Más info
            </button>
          </div>
        </div>

        {/* Poster (desktop) */}
        <div className="hidden xl:block absolute right-20 top-1/2 -translate-y-1/2">
          <div className={`relative w-56 h-80 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10 transition-all duration-500 ${transitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
            <Image
              src={movie.posterPath}
              alt={movie.title}
              fill
              className="object-cover"
              unoptimized
              sizes="224px"
            />
          </div>
        </div>
      </div>

      {/* Controls */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-2.5 rounded-full transition-all"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-2.5 rounded-full transition-all"
      >
        <ChevronRight size={20} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`rounded-full transition-all ${i === current ? 'w-8 h-2 bg-dv-accent' : 'w-2 h-2 bg-white/30 hover:bg-white/60'}`}
          />
        ))}
      </div>

      {/* Slide counter */}
      <div className="absolute bottom-8 right-6 text-white/40 text-xs font-mono">
        {current + 1} / {slides.length}
      </div>

    </div>
  );
}
