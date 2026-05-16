'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Search, X } from 'lucide-react';
import MovieCard from '@/components/MovieCard';
import MovieModal from '@/components/MovieModal';
import StreamingBadge from '@/components/StreamingBadge';
import type { Movie, Platform } from '@/types';

interface Props {
  platform: Platform;
  movies: Movie[];
  series: Movie[];
}

export default function PlatformClient({ platform, movies, series }: Props) {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [tab, setTab] = useState<'all' | 'movie' | 'series'>('all');
  const [genre, setGenre] = useState('');
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState<'popularity' | 'rating' | 'date'>('popularity');

  const allGenres = useMemo(() => {
    const pool = [...movies, ...series];
    const set = new Set<string>();
    pool.forEach((m) => m.genres.forEach((g) => set.add(g)));
    return Array.from(set).sort();
  }, [movies, series]);

  const pool = useMemo(() => {
    if (tab === 'movie')  return movies;
    if (tab === 'series') return series;
    return [...movies, ...series];
  }, [tab, movies, series]);

  const filtered = useMemo(() => {
    let result = pool;

    if (genre) result = result.filter((m) => m.genres.includes(genre));
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      result = result.filter(
        (m) => m.title.toLowerCase().includes(q) || m.originalTitle.toLowerCase().includes(q),
      );
    }

    // Dedup
    const seen = new Set<number>();
    result = result.filter((m) => {
      if (seen.has(m.id)) return false;
      seen.add(m.id);
      return true;
    });

    // Sort
    if (sortBy === 'rating') result = [...result].sort((a, b) => b.voteAverage - a.voteAverage);
    else if (sortBy === 'date') result = [...result].sort((a, b) => {
      if (!a.releaseDate) return 1;
      if (!b.releaseDate) return -1;
      return b.releaseDate.localeCompare(a.releaseDate);
    });
    // popularity: already sorted by TMDB discover popularity.desc

    return result;
  }, [pool, genre, query, sortBy]);

  return (
    <div className="min-h-screen bg-dv-bg">
      <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />

      {/* ── Header ── */}
      <div
        className="relative py-10 px-4 md:px-8"
        style={{ background: `linear-gradient(135deg, ${platform.bgColor}22 0%, #0a0a14 60%)` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-dv-bg" />
        <div className="relative max-w-7xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-dv-muted hover:text-white text-sm mb-6 transition-colors"
          >
            <ArrowLeft size={15} />
            Volver al inicio
          </Link>

          <div className="flex items-center gap-4 mb-2 flex-wrap">
            <StreamingBadge platform={platform} size="lg" />
            <div>
              <h1 className="text-white text-3xl font-black">{platform.name}</h1>
              <p className="text-dv-muted text-sm mt-0.5">
                {filtered.length} títulos disponibles
              </p>
            </div>
            <Link
              href={`/novedades/${platform.id}`}
              className="ml-auto flex items-center gap-1.5 bg-dv-accent/10 hover:bg-dv-accent/20 border border-dv-accent/30 text-dv-accent text-sm font-bold px-4 py-2 rounded-xl transition-all"
            >
              ✨ Lo nuevo en {platform.name} →
            </Link>
          </div>
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="sticky top-14 z-40 bg-dv-bg/95 backdrop-blur-md border-b border-dv-border px-4 md:px-8 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-3">
          {/* Type tabs */}
          <div className="flex gap-1 bg-white/5 rounded-lg p-0.5">
            {(['all', 'movie', 'series'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                  tab === t ? 'bg-dv-accent text-dv-bg' : 'text-dv-muted hover:text-white'
                }`}
              >
                {t === 'all' ? 'Todo' : t === 'movie' ? '🎬 Películas' : '📺 Series'}
              </button>
            ))}
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="bg-white/8 border border-white/15 text-white text-xs rounded-lg px-3 py-1.5 outline-none focus:border-dv-accent cursor-pointer"
          >
            <option value="popularity">Popularidad</option>
            <option value="rating">Mejor valorados</option>
            <option value="date">Más recientes</option>
          </select>

          {/* Genre */}
          <select
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="bg-white/8 border border-white/15 text-white text-xs rounded-lg px-3 py-1.5 outline-none focus:border-dv-accent cursor-pointer"
          >
            <option value="">Todos los géneros</option>
            {allGenres.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>

          {/* Search */}
          <div className="relative ml-auto">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-dv-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar en catálogo…"
              className="bg-white/8 border border-white/15 text-white text-xs rounded-lg pl-7 pr-7 py-1.5 w-44 outline-none focus:border-dv-accent placeholder:text-dv-muted"
            />
            {query && (
              <button onClick={() => setQuery('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-dv-muted hover:text-white">
                <X size={12} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Grid ── */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-5xl mb-4">🔍</p>
            <p className="text-white font-semibold">Sin resultados</p>
            <p className="text-dv-muted text-sm mt-1">Probá con otros filtros</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-3">
            {filtered.map((m) => (
              <MovieCard key={m.id} movie={m} onClick={setSelectedMovie} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
