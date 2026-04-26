'use client';

import Image from 'next/image';
import { Info, Tv } from 'lucide-react';
import StreamingBadge from './StreamingBadge';
import type { Movie } from '@/types';

interface Props {
  title: string;
  movies: Movie[];
  onMovieClick?: (movie: Movie) => void;
}

function BigCard({ movie, onMovieClick }: { movie: Movie; onMovieClick?: (m: Movie) => void }) {
  const year = movie.releaseDate ? new Date(movie.releaseDate + 'T00:00:00').getFullYear() : '';

  return (
    <div
      className="relative rounded-xl overflow-hidden cursor-pointer group bg-dv-card"
      style={{ aspectRatio: '16/9' }}
      onClick={() => onMovieClick?.(movie)}
    >
      <Image
        src={movie.backdropPath || movie.posterPath}
        alt={movie.title}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        unoptimized
        sizes="(max-width: 768px) 100vw, 50vw"
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
        {/* Badges */}
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-dv-accent text-[#111] text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider flex items-center gap-1">
            <Tv size={9} />
            {movie.type === 'series' ? 'Serie' : 'Película'}
          </span>
          {movie.platforms.slice(0, 1).map((pl) => (
            <StreamingBadge key={pl.id} platform={pl} size="sm" />
          ))}
          {year && <span className="text-white/60 text-[10px]">{year}</span>}
        </div>

        <h3 className="text-white text-lg md:text-xl font-black leading-tight mb-1.5 line-clamp-1">
          {movie.title}
        </h3>

        {movie.overview && (
          <p className="text-gray-300 text-xs leading-relaxed line-clamp-2 mb-3 max-w-sm">
            {movie.overview}
          </p>
        )}

        <button
          className="flex items-center gap-1.5 bg-dv-accent hover:bg-dv-accent-dark text-[#111] text-xs font-black px-3 py-1.5 rounded-lg transition-all"
          onClick={(e) => { e.stopPropagation(); onMovieClick?.(movie); }}
        >
          <Info size={12} />
          Más información
        </button>
      </div>
    </div>
  );
}

export default function NewSeriesCards({ title, movies, onMovieClick }: Props) {
  const featured = movies.filter((m) => m.backdropPath && !m.backdropPath.includes('placeholder')).slice(0, 2);
  if (featured.length === 0) return null;

  return (
    <section className="mb-8 px-4 md:px-8">
      <h2 className="text-white text-lg font-bold mb-3">{title}</h2>
      <div className={`grid gap-3 ${featured.length === 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
        {featured.map((m) => (
          <BigCard key={m.id} movie={m} onMovieClick={onMovieClick} />
        ))}
      </div>
    </section>
  );
}
