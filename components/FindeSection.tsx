'use client';

import Image from 'next/image';
import { Star, Play, Tv, Film } from 'lucide-react';
import type { Movie } from '@/types';
import { IMAGE_BASE } from '@/lib/tmdb';

interface Props {
  movies: Movie[];
  onMovieClick: (movie: Movie) => void;
}

function PlatformBadge({ platform }: { platform: Movie['platforms'][0] | undefined }) {
  if (!platform) return null;
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wide"
      style={{ backgroundColor: platform.bgColor, color: platform.textColor }}
    >
      {platform.shortName}
    </span>
  );
}

function FindeCard({ movie, rank, onMovieClick }: { movie: Movie; rank: number; onMovieClick: (m: Movie) => void }) {
  const platform  = movie.platforms[0];
  const backdrop  = movie.backdropPath;
  const isNew     = movie.releaseDate && new Date(movie.releaseDate) > new Date(Date.now() - 7 * 86400000);

  return (
    <div
      onClick={() => onMovieClick(movie)}
      className="group relative rounded-2xl overflow-hidden cursor-pointer flex-1 min-w-[280px]
                 border border-white/10 hover:border-white/30 transition-all duration-300
                 hover:shadow-2xl hover:shadow-black/70 hover:-translate-y-1"
      style={{ aspectRatio: '16/10' }}
    >
      {/* Backdrop image */}
      <Image
        src={backdrop}
        alt={movie.title}
        fill
        className="object-cover group-hover:scale-105 transition-transform duration-700"
        unoptimized
        sizes="(max-width: 768px) 100vw, 33vw"
        priority={rank === 1}
      />

      {/* Gradients */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/10" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />

      {/* Top badges */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
        {/* Rank */}
        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-dv-accent text-[#111] text-sm font-black shadow-lg">
          {rank}
        </span>

        {/* Platform badge */}
        {platform && (
          <div
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-black text-xs shadow-lg"
            style={{ backgroundColor: platform.bgColor, color: platform.textColor }}
          >
            <span>{platform.name}</span>
          </div>
        )}
      </div>

      {/* Type + NEW badge */}
      <div className="absolute top-3 left-14 flex items-center gap-2">
        <span className="flex items-center gap-1 bg-black/60 text-white/70 text-[10px] px-2 py-0.5 rounded-full">
          {movie.type === 'series'
            ? <><Tv size={9} /> Serie</>
            : <><Film size={9} /> Película</>
          }
        </span>
        {isNew && (
          <span className="bg-red-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wide">
            Nuevo
          </span>
        )}
      </div>

      {/* Bottom content */}
      <div className="absolute bottom-0 inset-x-0 p-4">
        {/* Genres */}
        {movie.genres.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {movie.genres.slice(0, 2).map((g) => (
              <span key={g} className="text-[10px] text-white/50 bg-white/10 px-2 py-0.5 rounded-full">
                {g}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h3 className="text-white font-black text-lg md:text-xl leading-tight mb-2 line-clamp-2
                       group-hover:text-dv-accent transition-colors drop-shadow-lg">
          {movie.title}
        </h3>

        {/* Rating + Play button */}
        <div className="flex items-center justify-between">
          {movie.voteAverage > 0 && (
            <div className="flex items-center gap-1.5">
              <Star size={13} className="text-yellow-400 fill-yellow-400" />
              <span className="text-yellow-400 text-sm font-bold">{movie.voteAverage.toFixed(1)}</span>
              {movie.type === 'series' && movie.seasons && (
                <span className="text-white/40 text-xs ml-1">{movie.seasons} temp.</span>
              )}
              {movie.type === 'movie' && movie.runtime && (
                <span className="text-white/40 text-xs ml-1">{movie.runtime} min</span>
              )}
            </div>
          )}

          <div className="flex items-center gap-1.5 bg-dv-accent/90 hover:bg-dv-accent text-[#111] px-3 py-1.5 rounded-full text-xs font-black transition-colors">
            <Play size={10} fill="#111" />
            Ver más
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FindeSection({ movies, onMovieClick }: Props) {
  if (!movies || movies.length === 0) return null;

  // Día de la semana para el título dinámico
  const today      = new Date();
  const dayOfWeek  = today.getDay(); // 0=dom, 5=vie, 6=sab
  const isWeekend  = dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6;
  const label      = isWeekend ? 'este finde' : 'para el finde';

  return (
    <section className="mb-10 px-4 md:px-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-white text-xl md:text-2xl font-black flex items-center gap-2">
            <span className="text-2xl">🍿</span>
            <span>Recomendados <span className="text-dv-accent">{label}</span> en Uruguay</span>
          </h2>
          <p className="text-dv-muted text-sm mt-0.5">
            Lo más popular en streaming · Actualizado automáticamente
          </p>
        </div>
        <span className="hidden md:flex items-center gap-1.5 text-[11px] text-dv-muted bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
          <span className="w-1.5 h-1.5 bg-dv-accent rounded-full animate-pulse" />
          En vivo
        </span>
      </div>

      {/* Cards grid */}
      <div className="flex flex-col md:flex-row gap-4">
        {movies.map((movie, i) => (
          <FindeCard
            key={movie.id}
            movie={movie}
            rank={i + 1}
            onMovieClick={onMovieClick}
          />
        ))}
      </div>
    </section>
  );
}
