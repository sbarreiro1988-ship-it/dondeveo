'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Star, Calendar, Clock, Tv, Youtube, Play, ExternalLink, Film } from 'lucide-react';
import type { Movie } from '@/types';
import type { Platform } from '@/types';

interface CastMember {
  id: number;
  name: string;
  character: string;
  profilePath: string | null;
}

interface Props {
  movie: Movie | null;
  onClose: () => void;
}

interface WatchProvider {
  provider_id:   number;
  provider_name: string;
  logo_path:     string;
}
interface RegionProviders {
  flatrate?: WatchProvider[];
  rent?:     WatchProvider[];
  buy?:      WatchProvider[];
  free?:     WatchProvider[];
  cinema?:   WatchProvider[];
}

const LOGO = (path: string) => `https://image.tmdb.org/t/p/original${path}`;

// ─── Platform logo from our own data (fallback when TMDB has no UY data) ─────
function FallbackPlatformLogo({ platform }: { platform: Platform }) {
  return (
    <div className="flex flex-col items-center gap-1.5 w-16">
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md"
        style={{ backgroundColor: platform.bgColor }}
      >
        <span className="text-[11px] font-black" style={{ color: platform.textColor }}>
          {platform.shortName || platform.name.slice(0, 4)}
        </span>
      </div>
      <span className="text-[9px] text-gray-400 text-center leading-tight line-clamp-2">
        {platform.name}
      </span>
    </div>
  );
}

// ─── Provider logo with name ──────────────────────────────────────────────────
function ProviderLogo({ p }: { p: WatchProvider }) {
  return (
    <div className="flex flex-col items-center gap-1.5 w-16">
      <div className="w-12 h-12 rounded-xl overflow-hidden ring-1 ring-white/10 flex-shrink-0 bg-black">
        <Image
          src={LOGO(p.logo_path)}
          alt={p.provider_name}
          width={48}
          height={48}
          className="object-cover"
          unoptimized
        />
      </div>
      <span className="text-[9px] text-gray-400 text-center leading-tight line-clamp-2">
        {p.provider_name}
      </span>
    </div>
  );
}

export default function MovieModal({ movie, onClose }: Props) {
  const [trailerKey,     setTrailerKey]     = useState<string | null>(null);
  const [trailerLoading, setTrailerLoading] = useState(false);
  const [showTrailer,    setShowTrailer]    = useState(false);
  const [providers,      setProviders]      = useState<RegionProviders | null>(null);
  const [providersLoading, setProvidersLoading] = useState(false);
  const [activeTab,      setActiveTab]      = useState<'stream' | 'cinema' | 'rent' | 'buy'>('stream');
  const [cast,           setCast]           = useState<CastMember[]>([]);
  const [castLoading,    setCastLoading]    = useState(false);

  // Lock scroll
  useEffect(() => {
    document.body.style.overflow = movie ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [movie]);

  // Fetch trailer
  useEffect(() => {
    if (!movie?.tmdbId) { setTrailerKey(null); return; }
    setTrailerKey(null); setShowTrailer(false); setTrailerLoading(true);
    const type = movie.type === 'series' ? 'tv' : 'movie';
    fetch(`/api/trailer?id=${movie.tmdbId}&type=${type}`)
      .then((r) => r.json())
      .then((d) => setTrailerKey(d.key ?? null))
      .catch(() => setTrailerKey(null))
      .finally(() => setTrailerLoading(false));
  }, [movie?.tmdbId, movie?.type]);

  // Fetch cast
  useEffect(() => {
    if (!movie?.tmdbId) { setCast([]); return; }
    setCast([]); setCastLoading(true);
    const type = movie.type === 'series' ? 'tv' : 'movie';
    fetch(`/api/cast?id=${movie.tmdbId}&type=${type}`)
      .then((r) => r.json())
      .then((d) => setCast(d.cast ?? []))
      .catch(() => setCast([]))
      .finally(() => setCastLoading(false));
  }, [movie?.tmdbId, movie?.type]);

  // Fetch watch providers
  useEffect(() => {
    if (!movie?.tmdbId) { setProviders(null); return; }
    setProviders(null); setProvidersLoading(true);
    const type = movie.type === 'series' ? 'tv' : 'movie';
    fetch(`/api/watch-providers?id=${movie.tmdbId}&type=${type}`)
      .then((r) => r.json())
      .then((data: Record<string, RegionProviders>) => {
        // Prefer UY, fall back to AR, then MX
        const region = data['UY'] ?? data['AR'] ?? data['MX'] ?? null;
        setProviders(region);
        // Set best default tab
        if (region?.flatrate?.length) setActiveTab('stream');
        else if (region?.free?.length) setActiveTab('stream');
        else if (region?.rent?.length) setActiveTab('rent');
        else if (region?.buy?.length) setActiveTab('buy');
        else setActiveTab('stream');
      })
      .catch(() => setProviders(null))
      .finally(() => setProvidersLoading(false));
  }, [movie?.tmdbId, movie?.type]);

  const handleEsc = useCallback(
    (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); }, [onClose],
  );
  useEffect(() => {
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [handleEsc]);

  if (!movie) return null;

  const year = movie.releaseDate ? new Date(movie.releaseDate + 'T00:00:00').getFullYear() : '';

  // Is it a recent movie (last 120 days) with no streaming? → still in cinemas
  const isRecentRelease = movie.releaseDate
    ? new Date(movie.releaseDate) >= new Date(Date.now() - 120 * 86400000)
    : false;

  // Merge flatrate + free for Stream tab
  const streamProviders = [
    ...(providers?.flatrate ?? []),
    ...(providers?.free     ?? []),
  ].filter((p, i, arr) => arr.findIndex(x => x.provider_id === p.provider_id) === i);

  const rentProviders = providers?.rent ?? [];
  const buyProviders  = providers?.buy  ?? [];

  const hasStream = streamProviders.length > 0;
  const hasRent   = rentProviders.length > 0;
  const hasBuy    = buyProviders.length > 0;

  // Our curated platform data (from carousel fetch + manual overrides).
  // Always preferred over TMDB regional data, which is often wrong for UY/AR.
  const curatedPlatforms = movie.platforms;
  const useCurated = curatedPlatforms.length > 0;

  // Only use TMDB stream data when we have no curated info
  const effectiveHasStream = useCurated || hasStream;

  // A movie is "in cinemas" if: no stream/rent/buy yet, it's a movie (not series), and released recently
  const inCinemas = !providersLoading && !effectiveHasStream && !hasRent && !hasBuy
    && movie.type === 'movie' && isRecentRelease;

  const streamCount = useCurated ? curatedPlatforms.length : streamProviders.length;
  const tabs = [
    { id: 'stream' as const, label: 'Stream',   count: streamCount,         show: true },
    { id: 'rent'   as const, label: 'Alquilar', count: rentProviders.length, show: hasRent },
    { id: 'buy'    as const, label: 'Comprar',  count: buyProviders.length,  show: hasBuy },
  ].filter(t => t.show);

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-3 md:p-6"
      onClick={onClose}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative w-full max-w-2xl bg-[#1a1a1a] rounded-2xl overflow-hidden shadow-2xl max-h-[92vh] flex flex-col animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Trailer / Backdrop ── */}
        {showTrailer && trailerKey ? (
          <div className="relative w-full flex-shrink-0" style={{ paddingBottom: '56.25%' }}>
            <iframe
              className="absolute inset-0 w-full h-full"
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0`}
              allow="autoplay; encrypted-media"
              allowFullScreen
              title="Trailer"
            />
          </div>
        ) : (
          <div className="relative h-48 md:h-64 flex-shrink-0">
            <Image
              src={movie.backdropPath}
              alt={movie.title}
              fill
              className="object-cover"
              unoptimized
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-black/40 to-transparent" />

            {/* Play trailer button */}
            {trailerKey && !trailerLoading && (
              <button
                onClick={() => setShowTrailer(true)}
                className="absolute inset-0 flex flex-col items-center justify-center gap-2 group"
                aria-label="Ver trailer"
              >
                <div className="w-16 h-16 rounded-full bg-red-600/90 group-hover:bg-red-600 flex items-center justify-center shadow-2xl transition-all group-hover:scale-110">
                  <Play size={28} fill="white" className="text-white ml-1" />
                </div>
                <span className="text-white/80 text-sm font-medium group-hover:text-white">
                  Ver trailer
                </span>
              </button>
            )}

            {/* Title overlay */}
            <div className="absolute bottom-3 left-4 right-14">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-dv-accent text-[10px] font-bold uppercase tracking-widest">
                  {movie.type === 'series' ? 'Serie' : 'Película'}
                </span>
                {inCinemas && (
                  <span className="bg-yellow-500 text-black text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
                    🎬 En cines
                  </span>
                )}
              </div>
              <h2 className="text-white text-xl md:text-2xl font-black leading-tight drop-shadow-xl line-clamp-2">
                {movie.title}
              </h2>
            </div>
          </div>
        )}

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 bg-black/70 hover:bg-black text-white p-2 rounded-full z-10"
        >
          <X size={16} />
        </button>

        {/* ── Scrollable content ── */}
        <div className="overflow-y-auto flex-1 p-4 md:p-5 space-y-5">

          {/* Meta row */}
          <div className="flex items-center gap-3 flex-wrap">
            {movie.voteAverage > 0 && (
              <div className="flex items-center gap-1 bg-yellow-400/10 border border-yellow-400/30 px-2.5 py-1 rounded-full">
                <Star size={12} className="text-yellow-400 fill-yellow-400" />
                <span className="text-yellow-400 font-bold text-sm">{movie.voteAverage.toFixed(1)}</span>
                <span className="text-yellow-600 text-xs">/10</span>
              </div>
            )}
            {year && (
              <div className="flex items-center gap-1 text-gray-400 text-sm">
                <Calendar size={12} /> {year}
              </div>
            )}
            {movie.runtime && (
              <div className="flex items-center gap-1 text-gray-400 text-sm">
                <Clock size={12} /> {movie.runtime} min
              </div>
            )}
            {movie.type === 'series' && movie.seasons && (
              <div className="flex items-center gap-1 text-gray-400 text-sm">
                <Tv size={12} /> {movie.seasons} temp.
              </div>
            )}
          </div>

          {/* Genres — clicables */}
          {movie.genres.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {movie.genres.map((g) => {
                const slug = g.toLowerCase()
                  .replace('acción', 'accion').replace('animación', 'animacion')
                  .replace('ciencia ficción', 'ciencia').replace('fantasía', 'fantasia')
                  .replace('suspenso', 'thriller').replace('suspenso', 'thriller')
                  .replace(/\s+/g, '-');
                return (
                  <Link key={g} href={`/genero/${slug}`} onClick={onClose}
                    className="text-xs px-2.5 py-0.5 rounded-full border border-white/15 text-gray-300 bg-white/5 hover:border-dv-accent/50 hover:text-dv-accent transition-colors">
                    {g}
                  </Link>
                );
              })}
            </div>
          )}

          {/* Overview */}
          <p className="text-gray-300 text-sm leading-relaxed">
            {movie.overview || 'Sin descripción disponible.'}
          </p>

          {/* ══ DÓNDE VER (core feature) ══════════════════════════════════ */}
          <div className="border border-white/10 rounded-xl overflow-hidden">
            {/* Header */}
            <div className="bg-white/5 px-4 py-2.5 border-b border-white/10">
              <p className="text-white text-xs font-black uppercase tracking-widest">
                🎬 Dónde ver en Uruguay
              </p>
            </div>

            {providersLoading ? (
              <div className="flex items-center justify-center py-8 gap-2 text-gray-500 text-sm">
                <div className="w-4 h-4 border-2 border-gray-600 border-t-gray-300 rounded-full animate-spin" />
                Buscando disponibilidad…
              </div>
            ) : (
              <div className="p-4">
                {/* Tabs */}
                {tabs.length > 0 && (
                  <div className="flex gap-1 mb-4 bg-black/30 rounded-lg p-0.5 w-fit">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${
                          activeTab === tab.id
                            ? 'bg-white text-black'
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        {tab.label}
                        {tab.count > 0 && (
                          <span className={`ml-1 text-[10px] ${activeTab === tab.id ? 'text-gray-600' : 'text-gray-600'}`}>
                            ({tab.count})
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                )}

                {/* Stream providers */}
                {activeTab === 'stream' && (
                  useCurated ? (
                    /* Plataformas curadas (de carruseles + overrides manuales) — siempre prioritarias */
                    <div className="flex flex-wrap gap-4">
                      {curatedPlatforms.map((pl) => (
                        <FallbackPlatformLogo key={pl.id} platform={pl} />
                      ))}
                    </div>
                  ) : hasStream ? (
                    <div className="flex flex-wrap gap-4">
                      {streamProviders.map((p) => <ProviderLogo key={p.provider_id} p={p} />)}
                    </div>
                  ) : inCinemas ? (
                    /* ── SOLO EN CINES ── */
                    <div className="flex items-center gap-4 bg-[#111] border border-white/10 rounded-xl p-4">
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                        <span className="text-3xl">🎬</span>
                      </div>
                      <div>
                        <span className="inline-block bg-yellow-500 text-black text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded mb-1">
                          Solo en cines
                        </span>
                        <p className="text-white font-bold text-sm mb-0.5">
                          Actualmente en cartelera
                        </p>
                        <p className="text-gray-500 text-xs">
                          Disponible en cines de Uruguay. Aún no llega al streaming.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-5">
                      <Film size={32} className="text-gray-700 mx-auto mb-2" />
                      <p className="text-gray-400 text-sm font-semibold mb-1">
                        No disponible en streaming
                      </p>
                      <p className="text-gray-600 text-xs">
                        {hasRent || hasBuy
                          ? 'Podés alquilarla o comprarla →'
                          : 'No está disponible en plataformas de Uruguay/Argentina.'}
                      </p>
                    </div>
                  )
                )}

                {/* Rent providers */}
                {activeTab === 'rent' && (
                  hasRent ? (
                    <div className="flex flex-wrap gap-4">
                      {rentProviders.map((p) => <ProviderLogo key={p.provider_id} p={p} />)}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm text-center py-4">No disponible para alquilar</p>
                  )
                )}

                {/* Buy providers */}
                {activeTab === 'buy' && (
                  hasBuy ? (
                    <div className="flex flex-wrap gap-4">
                      {buyProviders.map((p) => <ProviderLogo key={p.provider_id} p={p} />)}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm text-center py-4">No disponible para comprar</p>
                  )
                )}

                {/* Note */}
                <p className="text-gray-700 text-[10px] mt-3">
                  {useCurated
                    ? 'Datos de disponibilidad para Uruguay · Puede variar según tu plan'
                    : 'Datos de TMDB · Región: Uruguay / Argentina · Puede variar según tu plan'}
                </p>
              </div>
            )}
          </div>

          {/* ── Trailer buttons ── */}
          <div className="flex flex-wrap gap-2">
            {trailerLoading && (
              <div className="flex items-center gap-2 text-gray-500 text-sm px-2">
                <div className="w-4 h-4 border-2 border-gray-600 border-t-gray-300 rounded-full animate-spin" />
                Buscando trailer…
              </div>
            )}
            {trailerKey && !showTrailer && (
              <>
                <button
                  onClick={() => setShowTrailer(true)}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all"
                >
                  <Youtube size={15} /> Ver Trailer
                </button>
                <a
                  href={`https://www.youtube.com/watch?v=${trailerKey}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-all"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink size={13} /> YouTube
                </a>
              </>
            )}
            {showTrailer && (
              <button
                onClick={() => setShowTrailer(false)}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-all"
              >
                <X size={13} /> Ocultar trailer
              </button>
            )}
            {!trailerKey && !trailerLoading && (
              <span className="text-gray-600 text-sm px-1 flex items-center gap-1.5">
                <Youtube size={13} className="text-gray-700" /> Trailer no disponible
              </span>
            )}
          </div>

          {/* ── Reparto ── */}
          {(castLoading || cast.length > 0) && (
            <div>
              <h3 className="text-white text-xs font-black uppercase tracking-widest mb-3 flex items-center gap-2">
                <span className="text-dv-accent">★</span> Reparto principal
              </h3>
              {castLoading ? (
                <div className="flex gap-3 overflow-x-auto pb-1">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="flex-shrink-0 w-16 animate-pulse">
                      <div className="w-14 h-14 rounded-full bg-white/10 mx-auto mb-1.5" />
                      <div className="h-2 bg-white/10 rounded w-12 mx-auto mb-1" />
                      <div className="h-2 bg-white/5 rounded w-10 mx-auto" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
                  {cast.map((member) => (
                    <Link
                      key={member.id}
                      href={`/actor/${member.id}`}
                      onClick={onClose}
                      className="flex-shrink-0 w-16 group text-center"
                    >
                      <div className="w-14 h-14 rounded-full overflow-hidden ring-2 ring-white/10 group-hover:ring-dv-accent/60 transition-all mx-auto mb-1.5 bg-[#222]">
                        {member.profilePath ? (
                          <Image
                            src={member.profilePath}
                            alt={member.name}
                            width={56}
                            height={56}
                            className="object-cover w-full h-full group-hover:scale-105 transition-transform"
                            unoptimized
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-600 text-xl">
                            👤
                          </div>
                        )}
                      </div>
                      <p className="text-white text-[10px] font-semibold leading-tight line-clamp-2 group-hover:text-dv-accent transition-colors">
                        {member.name}
                      </p>
                      {member.character && (
                        <p className="text-gray-500 text-[9px] leading-tight line-clamp-1 mt-0.5">
                          {member.character}
                        </p>
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
