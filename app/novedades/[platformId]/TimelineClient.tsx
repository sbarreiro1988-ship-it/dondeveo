'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Film, Tv, Calendar, Star, Play } from 'lucide-react';
import MovieModal from '@/components/MovieModal';
import type { Movie, Platform } from '@/types';
import { PLATFORMS } from '@/lib/mockData';

// Platforms available in the selector strip (must match PLATFORM_PROVIDER_ID keys)
const PLATFORM_NAV = [
  { id: 'netflix',       label: 'Netflix' },
  { id: 'disneyplus',    label: 'Disney+' },
  { id: 'max',           label: 'Max' },
  { id: 'prime',         label: 'Prime Video' },
  { id: 'paramountplus', label: 'Paramount+' },
  { id: 'appletv',       label: 'Apple TV+' },
  { id: 'plutotv',       label: 'Pluto TV' },
  { id: 'directvgo',     label: 'DIRECTV GO' },
  { id: 'crunchyroll',     label: 'Crunchyroll' },
  { id: 'mubi',            label: 'MUBI' },
  { id: 'mercadoplay',     label: 'Mercado Play' },
  { id: 'curiositystream', label: 'Curiosity Stream' },
  { id: 'plex',            label: 'Plex' },
  { id: 'googleplay',      label: 'Google Play' },
  { id: 'universalplus',   label: 'Universal+' },
  { id: 'viki',            label: 'Rakuten Viki' },
];

interface Props {
  platform: Platform;
  movies: Movie[];
  series: Movie[];
  platformId: string;
}

// Group content by release date (YYYY-MM-DD)
function groupByDate(items: Movie[]): Map<string, Movie[]> {
  const map = new Map<string, Movie[]>();
  for (const m of items) {
    const key = m.releaseDate || 'sin-fecha';
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(m);
  }
  // Sort dates descending
  const sorted = Array.from(map.entries()).sort((a, b) => b[0].localeCompare(a[0]));
  return new Map(sorted);
}

function formatDate(dateStr: string): string {
  if (dateStr === 'sin-fecha') return 'Sin fecha';
  const d = new Date(dateStr + 'T12:00:00');
  const today  = new Date(); today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today.getTime() - 86400000);
  const dt = new Date(dateStr + 'T00:00:00');
  if (dt.toDateString() === today.toDateString())     return 'Hoy';
  if (dt.toDateString() === yesterday.toDateString()) return 'Ayer';
  return d.toLocaleDateString('es-UY', { day: 'numeric', month: 'short', year: 'numeric' });
}

function TimelineCard({ movie, onClick }: { movie: Movie; onClick: (m: Movie) => void }) {
  const isNew = movie.releaseDate && new Date(movie.releaseDate) > new Date(Date.now() - 7 * 86400000);

  return (
    <div
      className="relative flex-shrink-0 w-36 cursor-pointer group/card"
      onClick={() => onClick(movie)}
    >
      <div className="relative rounded-lg overflow-hidden bg-[#1c1c1c] transition-all duration-300 group-hover/card:scale-[1.05] group-hover/card:shadow-2xl group-hover/card:shadow-black/70"
        style={{ aspectRatio: '2/3' }}>
        <Image
          src={movie.posterPath}
          alt={movie.title}
          fill
          className="object-cover"
          unoptimized
          sizes="144px"
        />

        {/* Gradient */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/95 via-black/50 to-transparent" />

        {/* NEW badge */}
        {isNew && (
          <div className="absolute top-1.5 left-1.5">
            <span className="bg-dv-accent text-[#111] text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-wide">
              Nuevo
            </span>
          </div>
        )}

        {/* Type badge */}
        <div className="absolute top-1.5 right-1.5">
          <span className="bg-black/70 text-white/80 text-[8px] px-1.5 py-0.5 rounded">
            {movie.type === 'series' ? (
              movie.seasons ? `Temp. ${movie.seasons}` : 'Serie'
            ) : (
              movie.runtime ? `${movie.runtime} min` : 'Película'
            )}
          </span>
        </div>

        {/* Bottom info */}
        <div className="absolute bottom-0 inset-x-0 p-2">
          <p className="text-white text-[10px] font-semibold leading-tight line-clamp-2">
            {movie.title}
          </p>
          {movie.voteAverage > 0 && (
            <div className="flex items-center gap-1 mt-1">
              <Star size={8} className="text-yellow-400 fill-yellow-400" />
              <span className="text-yellow-400 text-[9px] font-bold">{movie.voteAverage.toFixed(1)}</span>
            </div>
          )}
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/card:opacity-100 transition-opacity flex items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-dv-accent/90 flex items-center justify-center">
            <Play size={16} fill="#111" className="text-[#111] ml-0.5" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TimelineClient({ platform, movies, series, platformId }: Props) {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [tab, setTab] = useState<'all' | 'movie' | 'series'>('all');
  const [genreFilter, setGenreFilter] = useState('');

  const allContent = useMemo(() => {
    const pool =
      tab === 'movie'  ? movies :
      tab === 'series' ? series :
      [...movies, ...series];

    const seen = new Set<number>();
    return pool.filter((m) => {
      if (seen.has(m.id)) return false;
      seen.add(m.id);
      if (genreFilter && !m.genres.includes(genreFilter)) return false;
      return true;
    });
  }, [tab, movies, series, genreFilter]);

  const grouped = useMemo(() => groupByDate(allContent), [allContent]);

  const allGenres = useMemo(() => {
    const set = new Set<string>();
    [...movies, ...series].forEach((m) => m.genres.forEach((g) => set.add(g)));
    return Array.from(set).sort();
  }, [movies, series]);

  const totalCount = movies.length + series.length;

  return (
    <div className="min-h-screen bg-[#111]">
      <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />

      {/* ── Platform header ── */}
      <div
        className="pt-20 pb-6 px-4 md:px-8 border-b border-white/5"
        style={{ background: `linear-gradient(135deg, ${platform.bgColor}15 0%, #111 70%)` }}
      >
        <Link href="/" className="inline-flex items-center gap-1.5 text-[#8a8a9a] hover:text-white text-sm mb-5 transition-colors">
          <ArrowLeft size={15} /> Inicio
        </Link>

        {/* Title */}
        <div className="flex items-center gap-3 mb-1">
          <span className="text-2xl font-black" style={{ color: platform.color }}>
            {platform.name}
          </span>
          <span className="text-[#8a8a9a] text-sm">— Lo nuevo</span>
        </div>
        <p className="text-[#8a8a9a] text-sm">
          {totalCount} títulos agregados recientemente · datos en tiempo real
        </p>
      </div>

      {/* ── Platform selector strip ── */}
      <div className="border-b border-white/5 px-4 md:px-8 py-2 flex items-center gap-1.5 overflow-x-auto scrollbar-hide">
        {PLATFORM_NAV.map((pl) => {
          const data = PLATFORMS[pl.id];
          if (!data) return null;
          const isActive = pl.id === platformId;
          return (
            <Link
              key={pl.id}
              href={`/novedades/${pl.id}`}
              className={`flex-shrink-0 px-3 py-1.5 rounded-md text-xs font-bold transition-all border ${
                isActive
                  ? 'border-transparent text-white'
                  : 'border-white/10 text-[#8a8a9a] hover:text-white hover:border-white/20'
              }`}
              style={isActive ? { backgroundColor: data.bgColor, color: data.textColor } : {}}
            >
              {pl.label}
            </Link>
          );
        })}
      </div>

      {/* ── Filter bar ── */}
      <div className="sticky top-14 z-40 bg-[#111]/95 backdrop-blur-md border-b border-white/5 px-4 md:px-8 py-2.5 flex items-center gap-3 flex-wrap">
        {/* Type tabs */}
        <div className="flex gap-1 bg-white/5 rounded-lg p-0.5">
          {([['all', 'Todos'], ['movie', '🎬 Filmes'], ['series', '📺 Series']] as const).map(([t, label]) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                tab === t ? 'bg-dv-accent text-[#111]' : 'text-[#8a8a9a] hover:text-white'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Genre */}
        <select
          value={genreFilter}
          onChange={(e) => setGenreFilter(e.target.value)}
          className="bg-white/8 border border-white/12 text-white text-xs rounded-lg px-3 py-1.5 outline-none focus:border-dv-accent cursor-pointer"
        >
          <option value="">Todos los géneros</option>
          {allGenres.map((g) => <option key={g} value={g}>{g}</option>)}
        </select>

        <span className="text-[#8a8a9a] text-xs ml-auto">
          {allContent.length} títulos
        </span>
      </div>

      {/* ── Timeline ── */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
        {grouped.size === 0 ? (
          <div className="text-center py-24">
            <p className="text-5xl mb-4">📭</p>
            <p className="text-white font-semibold">Sin contenido reciente</p>
            <p className="text-[#8a8a9a] text-sm mt-1">Probá cambiando los filtros</p>
          </div>
        ) : (
          <div className="relative">
            {/* Vertical timeline line */}
            <div className="absolute left-[7px] top-2 bottom-2 w-px bg-white/10 hidden md:block" />

            <div className="space-y-8">
              {Array.from(grouped.entries()).map(([date, items]) => (
                <div key={date} className="relative">
                  {/* Date row */}
                  <div className="flex items-center gap-3 mb-4">
                    {/* Dot */}
                    <div className="w-3.5 h-3.5 rounded-full border-2 flex-shrink-0 hidden md:block"
                      style={{ borderColor: platform.color, backgroundColor: '#111' }} />

                    {/* Date pill */}
                    <div className="flex items-center gap-2">
                      <span className="bg-white/8 border border-white/12 text-white text-xs font-semibold px-3 py-1 rounded-full">
                        {formatDate(date)}
                      </span>

                      {/* Platform + count */}
                      <span className="flex items-center gap-1.5 text-xs font-bold px-2 py-1 rounded"
                        style={{ backgroundColor: platform.bgColor + '20', color: platform.color }}>
                        {platform.name}
                      </span>
                      <span className="text-[#8a8a9a] text-xs">
                        {items.length} {items.length === 1 ? 'título' : 'títulos'}
                      </span>
                    </div>
                  </div>

                  {/* Cards row */}
                  <div className="md:ml-8 flex gap-3 overflow-x-auto scrollbar-hide pb-2">
                    {items.map((m) => (
                      <TimelineCard key={m.id} movie={m} onClick={setSelectedMovie} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
