'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import HeroSection from './HeroSection';
import ContentCarousel from './ContentCarousel';
import FeaturedSpotlight from './FeaturedSpotlight';
import NewSeriesCards from './NewSeriesCards';
import NoticiasSection from './NoticiasSection';
import FilterBar from './FilterBar';
import MovieCard from './MovieCard';
import MovieModal from './MovieModal';
import { PLATFORMS } from '@/lib/mockData';
import { getManualOverridesMap } from '@/lib/manualOverrides';
import type { Movie, FilterState, Platform } from '@/types';

// Detecta títulos en caracteres no-latinos (chino, japonés, coreano, árabe, etc.)
function hasNonLatinTitle(title: string): boolean {
  return /[぀-鿿가-퟿؀-ۿݐ-ݿ]/.test(title);
}

// Enriquece cards con plataforma y filtra contenido sin plataforma con título no-latino
function enrichAndFilter(movies: Movie[], lookup: Map<number, Platform[]>): Movie[] {
  return movies
    .map((m) => { const f = lookup.get(m.id); return f?.length ? { ...m, platforms: f } : m; })
    .filter((m) => m.platforms.length > 0 || !hasNonLatinTitle(m.title));
}
import type { NewsItem } from '@/lib/newsApi';

interface Props {
  heroMovies: Movie[];
  trending: Movie[];
  top10Movies: Movie[];    // exactly 10 from /trending/movie/day
  top10Series: Movie[];    // exactly 10 from /trending/tv/day
  netflix: Movie[]; disneyplus: Movie[]; max: Movie[]; prime: Movie[];
  paramountplus: Movie[]; appleTv: Movie[];
  netflixSeries: Movie[]; maxSeries: Movie[]; primeSeries: Movie[];
  disneySeries: Movie[]; paramountSeries: Movie[]; appleTvSeries: Movie[];
  crunchyrollSeries: Movie[];
  topRatedMovies: Movie[];
  upcoming: Movie[]; nowPlaying: Movie[];
  pluto: Movie[]; directvgo: Movie[]; mubi: Movie[];
  mercadoplay: Movie[]; curiositystream: Movie[]; plex: Movie[]; googleplay: Movie[];
  universalplus: Movie[]; viki: Movie[];
  top10Accion: Movie[]; top10Comedia: Movie[]; top10Drama: Movie[];
  top10Terror: Movie[]; top10Scifi: Movie[];
  top10AccionSeries: Movie[]; top10DramaSeries: Movie[];
  news: NewsItem[];
}

const DEFAULT_FILTERS: FilterState = { platformIds: [], genres: [], contentType: 'all', query: '' };

export default function HomeClient({
  heroMovies, trending,
  top10Movies, top10Series,
  netflix, disneyplus, max, prime, paramountplus, appleTv,
  netflixSeries, maxSeries, primeSeries, disneySeries,
  paramountSeries, appleTvSeries, crunchyrollSeries,
  topRatedMovies, upcoming, nowPlaying,
  pluto, directvgo, mubi, mercadoplay, curiositystream, plex, googleplay,
  universalplus, viki,
  top10Accion, top10Comedia, top10Drama, top10Terror, top10Scifi,
  top10AccionSeries, top10DramaSeries,
  news,
}: Props) {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const searchParams = useSearchParams();

  useEffect(() => {
    const tipo     = searchParams.get('tipo');
    const platform = searchParams.get('platform');
    const search   = searchParams.get('search') ?? '';
    setFilters({
      contentType: tipo === 'peliculas' ? 'movie' : tipo === 'series' ? 'series' : 'all',
      platformIds: platform ? [platform] : [],
      genres: [],
      query: search,
    });
  }, [searchParams]);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      // Give the page time to render all sections before scrolling
      setTimeout(() => {
        const el = document.querySelector(hash);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 600);
    }
  }, [searchParams]);

  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) { setSearchResults([]); return; }
    setSearchLoading(true);
    try {
      const res  = await fetch(`/api/search?q=${encodeURIComponent(q.trim())}`);
      const data = await res.json();
      setSearchResults(data);
    } catch { setSearchResults([]); }
    finally   { setSearchLoading(false); }
  }, []);

  useEffect(() => {
    if (!filters.query.trim()) { setSearchResults([]); return; }
    const timer = setTimeout(() => doSearch(filters.query), 400);
    return () => clearTimeout(timer);
  }, [filters.query, doSearch]);

  // Platform lookup for enriching Trending / Top 10
  const platformLookup = useMemo(() => {
    const map = new Map<number, Platform[]>();
    const assign = (movies: Movie[], pl: Platform) => {
      for (const m of movies) {
        const prev = map.get(m.id) ?? [];
        if (!prev.find((p) => p.id === pl.id)) map.set(m.id, [...prev, pl]);
      }
    };
    assign(netflix,        PLATFORMS.netflix);
    assign(disneyplus,     PLATFORMS.disneyplus);
    assign(max,            PLATFORMS.max);
    assign(prime,          PLATFORMS.prime);
    assign(paramountplus,  PLATFORMS.paramountplus);
    assign(appleTv,        PLATFORMS.appletv);
    assign(pluto,           PLATFORMS.plutotv);
    assign(directvgo,       PLATFORMS.directvgo);
    assign(mercadoplay,     PLATFORMS.mercadoplay);
    assign(curiositystream, PLATFORMS.curiositystream);
    assign(plex,            PLATFORMS.plex);
    assign(googleplay,      PLATFORMS.googleplay);
    assign(mubi,            PLATFORMS.mubi);
    assign(universalplus,   PLATFORMS.universalplus);
    assign(viki,            PLATFORMS.viki);
    assign(netflixSeries,   PLATFORMS.netflix);
    assign(maxSeries,       PLATFORMS.max);
    assign(primeSeries,     PLATFORMS.prime);
    assign(disneySeries,    PLATFORMS.disneyplus);
    assign(paramountSeries, PLATFORMS.paramountplus);
    assign(appleTvSeries,   PLATFORMS.appletv);
    assign(crunchyrollSeries, PLATFORMS.crunchyroll);

    // Manual overrides — plataformas asignadas a mano (ej: Universal+)
    const manualMap = getManualOverridesMap();
    manualMap.forEach((platforms, tmdbId) => {
      const prev = map.get(tmdbId) ?? [];
      const merged = [...prev];
      for (const pl of platforms) {
        if (!merged.find(p => p.id === pl.id)) merged.push(pl);
      }
      map.set(tmdbId, merged);
    });

    return map;
  }, [netflix, disneyplus, max, prime, paramountplus, appleTv, pluto, directvgo, mubi,
      mercadoplay, curiositystream, plex, googleplay, universalplus, viki,
      netflixSeries, maxSeries, primeSeries, disneySeries,
      paramountSeries, appleTvSeries, crunchyrollSeries]);

  const enrichedTrending = useMemo(
    () => trending.map((m) => { const f = platformLookup.get(m.id); return f?.length ? { ...m, platforms: f } : m; }),
    [trending, platformLookup],
  );

  // top10Movies and top10Series come from props (always exactly 10)
  // Enrich with platform info from lookup
  const enrichedTop10Movies = useMemo(
    () => top10Movies.map((m) => { const f = platformLookup.get(m.id); return f?.length ? { ...m, platforms: f } : m; }),
    [top10Movies, platformLookup],
  );
  const enrichedTop10Series = useMemo(
    () => top10Series.map((m) => { const f = platformLookup.get(m.id); return f?.length ? { ...m, platforms: f } : m; }),
    [top10Series, platformLookup],
  );

  const allMovies = useMemo(
    () => [...netflix, ...disneyplus, ...max, ...prime, ...paramountplus,
            ...appleTv, ...pluto, ...directvgo, ...mubi,
            ...mercadoplay, ...curiositystream, ...plex, ...googleplay,
            ...universalplus.filter(m => m.type === 'movie'),
            ...nowPlaying, ...topRatedMovies]
           .filter((m, i, arr) => arr.findIndex((x) => x.id === m.id) === i),
    [netflix, disneyplus, max, prime, paramountplus, appleTv, pluto, directvgo, mubi,
     mercadoplay, curiositystream, plex, googleplay, universalplus, nowPlaying, topRatedMovies],
  );

  const allSeries = useMemo(
    () => [...netflixSeries, ...maxSeries, ...primeSeries, ...disneySeries,
            ...paramountSeries, ...appleTvSeries, ...crunchyrollSeries,
            ...universalplus.filter(m => m.type === 'series'),
            ...viki]
           .filter((m, i, arr) => arr.findIndex((x) => x.id === m.id) === i),
    [netflixSeries, maxSeries, primeSeries, disneySeries, paramountSeries, appleTvSeries,
     crunchyrollSeries, universalplus, viki],
  );

  const filtered = useMemo(() => {
    if (filters.query.trim() && searchResults.length > 0) return searchResults;
    let pool =
      filters.contentType === 'movie'  ? allMovies :
      filters.contentType === 'series' ? allSeries :
      [...allMovies, ...allSeries];
    if (filters.platformIds.length > 0)
      pool = pool.filter((m) => m.platforms.some((p) => filters.platformIds.includes(p.id)));
    if (filters.genres.length > 0)
      pool = pool.filter((m) => m.genres.some((g) => filters.genres.includes(g)));
    return pool.filter((m, i, arr) => arr.findIndex((x) => x.id === m.id) === i);
  }, [filters, allMovies, allSeries, searchResults]);

  const isFiltering =
    filters.platformIds.length > 0 || filters.genres.length > 0 ||
    filters.contentType !== 'all'   || filters.query.trim() !== '';

  const handleMovieClick = (movie: Movie) => setSelectedMovie(movie);

  // FeaturedSpotlight pool: pick from trending with backdrops, enriched with platform info
  const spotlightMovies = useMemo(
    () => enrichedTrending.filter((m) => m.backdropPath && !m.backdropPath.includes('placeholder')).slice(0, 8),
    [enrichedTrending],
  );

  return (
    <div className="min-h-screen bg-dv-bg">
      <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />

      {/* ── Hero ── */}
      <HeroSection
        movies={heroMovies.length ? heroMovies : trending.slice(0, 5)}
        onMovieClick={handleMovieClick}
      />

      {/* ── Filter bar ── */}
      <div className="pt-4">
        <div className="px-4 md:px-8">
          <FilterBar filters={filters} onChange={setFilters} />
        </div>

        {filters.query && (
          <div className="px-4 md:px-8 mt-3 flex items-center gap-2">
            {searchLoading ? (
              <span className="text-dv-muted text-sm flex items-center gap-2">
                <span className="w-3 h-3 border-2 border-dv-muted border-t-white rounded-full animate-spin" />
                Buscando…
              </span>
            ) : (
              <span className="text-dv-muted text-sm">
                Resultados para: <span className="text-white font-semibold">"{filters.query}"</span>
                {searchResults.length > 0 && <span className="text-dv-muted ml-2">({searchResults.length})</span>}
              </span>
            )}
            <button onClick={() => setFilters((f) => ({ ...f, query: '' }))} className="text-xs text-dv-accent hover:underline ml-1">
              × Limpiar
            </button>
          </div>
        )}

        <div className="mt-6">
          {isFiltering ? (
            <FilteredResults filtered={filtered} filters={filters} isSearchLoading={searchLoading}
              onClear={() => setFilters(DEFAULT_FILTERS)} onMovieClick={handleMovieClick} />
          ) : (
            <>
              {/* ── Ahora en cines ── */}
              {nowPlaying.length > 0 && (
                <ContentCarousel title="🍿 Ahora en cines" movies={nowPlaying} cinemaOnly
                  layout="sidebar"
                  description="Películas actualmente en cartelera en Uruguay. Datos de cartelera.montevideo.com.uy"
                  onMovieClick={handleMovieClick} />
              )}

              {/* 🏆 Top 10 Películas — exactly 10 */}
              {enrichedTop10Movies.length > 0 && (
                <ContentCarousel
                  title="🏆 Top 10 películas esta semana"
                  description="Las películas más populares disponibles en streaming ahora."
                  movies={enrichedTop10Movies} showRanks layout="sidebar"
                  onMovieClick={handleMovieClick} />
              )}

              {/* 🏆 Top 10 Series — exactly 10 */}
              {enrichedTop10Series.length > 0 && (
                <ContentCarousel
                  title="🏆 Top 10 series esta semana"
                  description="Las series más populares esta semana y dónde verlas."
                  movies={enrichedTop10Series} showRanks layout="sidebar"
                  onMovieClick={handleMovieClick} />
              )}

              {/* ── Featured Spotlight ── */}
              {spotlightMovies.length > 0 && (
                <FeaturedSpotlight movies={spotlightMovies} onMovieClick={handleMovieClick} />
              )}

              {/* ── Netflix ── */}
              {netflix.length > 0 && (
                <ContentCarousel title="Películas en Netflix" movies={netflix}
                  platformBadge={PLATFORMS.netflix} platformId="netflix"
                  layout="sidebar" description="Las películas más populares disponibles en Netflix Uruguay."
                  onMovieClick={handleMovieClick} />
              )}
              {netflixSeries.length > 0 && (
                <ContentCarousel title="Series en Netflix" movies={netflixSeries}
                  platformBadge={PLATFORMS.netflix} platformId="netflix"
                  layout="sidebar" description="Series originales y licenciadas disponibles en Netflix."
                  onMovieClick={handleMovieClick} />
              )}

              {/* ── Genre Top 10: Acción ── */}
              {top10Accion.length > 0 && (
                <ContentCarousel title="Top 10 Acción"
                  movies={enrichAndFilter(top10Accion, platformLookup).map((m,i)=>({...m,rank:i+1}))}
                  showRanks layout="sidebar"
                  description="Los filmes de acción más populares en streaming ahora."
                  onMovieClick={handleMovieClick} />
              )}
              {top10AccionSeries.length > 0 && (
                <ContentCarousel title="Series de Acción"
                  movies={enrichAndFilter(top10AccionSeries, platformLookup).map((m,i)=>({...m,rank:i+1}))}
                  showRanks layout="sidebar"
                  description="Las mejores series de acción disponibles en streaming."
                  onMovieClick={handleMovieClick} />
              )}

              {/* ── Disney+ ── */}
              {disneyplus.length > 0 && (
                <ContentCarousel title="Películas en Disney+" movies={disneyplus}
                  platformBadge={PLATFORMS.disneyplus} platformId="disneyplus"
                  layout="sidebar" description="Películas de Disney, Marvel, Star Wars y National Geographic."
                  onMovieClick={handleMovieClick} />
              )}
              {disneySeries.length > 0 && (
                <ContentCarousel title="Series en Disney+" movies={disneySeries}
                  platformBadge={PLATFORMS.disneyplus} platformId="disneyplus"
                  layout="sidebar" onMovieClick={handleMovieClick} />
              )}

              {/* ── Genre Top 10: Comedia ── */}
              {top10Comedia.length > 0 && (
                <ContentCarousel title="Top 10 Comedia"
                  movies={enrichAndFilter(top10Comedia, platformLookup).map((m,i)=>({...m,rank:i+1}))}
                  showRanks layout="sidebar"
                  description="Las comedias más populares en streaming esta semana."
                  onMovieClick={handleMovieClick} />
              )}

              {/* ── Max ── */}
              {max.length > 0 && (
                <ContentCarousel title="Películas en Max" movies={max}
                  platformBadge={PLATFORMS.max} platformId="max"
                  layout="sidebar" description="Películas originales de HBO y Max disponibles en Uruguay."
                  onMovieClick={handleMovieClick} />
              )}
              {maxSeries.length > 0 && (
                <ContentCarousel title="Series en Max" movies={maxSeries}
                  platformBadge={PLATFORMS.max} platformId="max"
                  layout="sidebar" description="Series premium de HBO, DC y Max Originals."
                  onMovieClick={handleMovieClick} />
              )}

              {/* ── Genre Top 10: Drama ── */}
              {top10Drama.length > 0 && (
                <ContentCarousel title="Top 10 Drama"
                  movies={enrichAndFilter(top10Drama, platformLookup).map((m,i)=>({...m,rank:i+1}))}
                  showRanks layout="sidebar"
                  description="Las películas de drama más aclamadas disponibles ahora."
                  onMovieClick={handleMovieClick} />
              )}
              {top10DramaSeries.length > 0 && (
                <ContentCarousel title="Series de Drama"
                  movies={enrichAndFilter(top10DramaSeries, platformLookup).map((m,i)=>({...m,rank:i+1}))}
                  showRanks layout="sidebar"
                  description="Las series de drama más populares en streaming."
                  onMovieClick={handleMovieClick} />
              )}

              {/* ── Prime Video ── */}
              {prime.length > 0 && (
                <ContentCarousel title="Películas en Prime Video" movies={prime}
                  platformBadge={PLATFORMS.prime} platformId="prime"
                  layout="sidebar" onMovieClick={handleMovieClick} />
              )}
              {primeSeries.length > 0 && (
                <ContentCarousel title="Series en Prime Video" movies={primeSeries}
                  platformBadge={PLATFORMS.prime} platformId="prime"
                  layout="sidebar" onMovieClick={handleMovieClick} />
              )}

              {/* ── Genre Top 10: Terror ── */}
              {top10Terror.length > 0 && (
                <ContentCarousel title="Top 10 Terror"
                  movies={enrichAndFilter(top10Terror, platformLookup).map((m,i)=>({...m,rank:i+1}))}
                  showRanks layout="sidebar"
                  description="Las películas de terror más populares en streaming ahora."
                  onMovieClick={handleMovieClick} />
              )}

              {/* ── Paramount+ ── */}
              {paramountplus.length > 0 && (
                <ContentCarousel title="Películas en Paramount+" movies={paramountplus}
                  platformBadge={PLATFORMS.paramountplus} platformId="paramountplus"
                  layout="sidebar" onMovieClick={handleMovieClick} />
              )}
              {paramountSeries.length > 0 && (
                <ContentCarousel title="Series en Paramount+" movies={paramountSeries}
                  platformBadge={PLATFORMS.paramountplus} platformId="paramountplus"
                  layout="sidebar" onMovieClick={handleMovieClick} />
              )}

              {/* ── Apple TV+ ── */}
              {appleTv.length > 0 && (
                <ContentCarousel title="Películas en Apple TV+" movies={appleTv}
                  platformBadge={PLATFORMS.appletv} platformId="appletv"
                  layout="sidebar" onMovieClick={handleMovieClick} />
              )}
              {appleTvSeries.length > 0 && (
                <ContentCarousel title="Series en Apple TV+" movies={appleTvSeries}
                  platformBadge={PLATFORMS.appletv} platformId="appletv"
                  layout="sidebar" onMovieClick={handleMovieClick} />
              )}

              {/* ── Universal+ ── */}
              {universalplus.length > 0 && (
                <ContentCarousel title="Universal+" movies={universalplus}
                  platformBadge={PLATFORMS.universalplus} platformId="universalplus"
                  layout="sidebar"
                  description="Series y películas exclusivas de Universal: FROM, Ted, The Rookie, House, Chicago PD, Interstellar y más."
                  onMovieClick={handleMovieClick} />
              )}

              {/* ── Ciencia Ficción ── */}
              {top10Scifi.length > 0 && (
                <ContentCarousel title="Top 10 Ciencia Ficción"
                  movies={enrichAndFilter(top10Scifi, platformLookup).map((m,i)=>({...m,rank:i+1}))}
                  showRanks layout="sidebar"
                  description="Las mejores películas de ciencia ficción disponibles en streaming."
                  onMovieClick={handleMovieClick} />
              )}

              {/* ── Crunchyroll ── */}
              {crunchyrollSeries.length > 0 && (
                <ContentCarousel title="🍥 Anime en Crunchyroll" movies={crunchyrollSeries}
                  platformBadge={PLATFORMS.crunchyroll} platformId="crunchyroll"
                  layout="sidebar"
                  description="El mejor anime disponible en Crunchyroll para Uruguay y la región."
                  onMovieClick={handleMovieClick} />
              )}

              {/* ── Rakuten Viki ── (solo si hay contenido disponible) */}
              {viki.length > 0 && (
                <ContentCarousel title="🎭 K-dramas en Rakuten Viki" movies={viki}
                  platformBadge={PLATFORMS.viki} platformId="viki"
                  layout="sidebar"
                  description="Los mejores K-dramas y series asiáticas disponibles en Rakuten Viki."
                  onMovieClick={handleMovieClick} />
              )}

              {/* ── Nuevas series destacadas (JustWatch style 2-up) ── */}
              {netflixSeries.filter(m => m.backdropPath && !m.backdropPath.includes('placeholder')).length >= 1 && (
                <NewSeriesCards
                  title="📺 Nuevas series"
                  movies={[
                    ...netflixSeries.slice(0, 2),
                    ...maxSeries.slice(0, 1),
                    ...disneySeries.slice(0, 1),
                  ].filter((m, i, arr) => arr.findIndex(x => x.id === m.id) === i).slice(0, 2)}
                  onMovieClick={handleMovieClick}
                />
              )}

              {/* ── Pluto TV (gratis) ── */}
              {pluto.length > 0 && (
                <ContentCarousel title="Gratis en Pluto TV" movies={pluto}
                  platformBadge={PLATFORMS.plutotv} platformId="plutotv"
                  layout="sidebar"
                  description="Películas y series que podés ver gratis ahora mismo en Pluto TV."
                  onMovieClick={handleMovieClick} />
              )}

              {/* ── DIRECTV GO ── */}
              {directvgo.length > 0 && (
                <ContentCarousel title="DIRECTV GO" movies={directvgo}
                  platformBadge={PLATFORMS.directvgo} platformId="directvgo"
                  layout="sidebar"
                  description="Películas y series disponibles en DIRECTV GO en Uruguay."
                  onMovieClick={handleMovieClick} />
              )}

              {/* ── MUBI ── */}
              {mubi.length > 0 && (
                <ContentCarousel title="MUBI — Cine de autor" movies={mubi}
                  platformBadge={PLATFORMS.mubi} platformId="mubi"
                  layout="sidebar"
                  description="Las mejores películas de cine independiente y de autor del mundo."
                  onMovieClick={handleMovieClick} />
              )}

              {/* ── Mercado Play (gratis) ── */}
              {mercadoplay.length > 0 && (
                <ContentCarousel title="Mercado Play — Gratis" movies={mercadoplay}
                  platformBadge={PLATFORMS.mercadoplay} platformId="mercadoplay"
                  layout="sidebar"
                  description="Películas y series gratis de Mercado Libre, disponibles sin suscripción."
                  onMovieClick={handleMovieClick} />
              )}

              {/* ── Curiosity Stream ── */}
              {curiositystream.length > 0 && (
                <ContentCarousel title="Curiosity Stream — Documentales" movies={curiositystream}
                  platformBadge={PLATFORMS.curiositystream} platformId="curiositystream"
                  layout="sidebar"
                  description="Los mejores documentales de ciencia, historia, naturaleza y tecnología."
                  onMovieClick={handleMovieClick} />
              )}

              {/* ── Plex (gratis) ── */}
              {plex.length > 0 && (
                <ContentCarousel title="Plex — Gratis" movies={plex}
                  platformBadge={PLATFORMS.plex} platformId="plex"
                  layout="sidebar"
                  description="Películas y series disponibles gratis en Plex, sin necesidad de suscripción."
                  onMovieClick={handleMovieClick} />
              )}

              {/* ── Google Play Movies ── */}
              {googleplay.length > 0 && (
                <ContentCarousel title="Google Play Movies" movies={googleplay}
                  platformBadge={PLATFORMS.googleplay} platformId="googleplay"
                  layout="sidebar"
                  description="Películas disponibles para alquilar o comprar en Google Play."
                  onMovieClick={handleMovieClick} />
              )}

              {/* ── Mejor valoradas ── */}
              {topRatedMovies.length > 0 && (
                <ContentCarousel title="⭐ Las mejor valoradas" movies={topRatedMovies}
                  layout="sidebar"
                  description="Las películas con mejor puntuación de todos los tiempos disponibles en streaming."
                  onMovieClick={handleMovieClick} />
              )}

              {/* ── Próximos estrenos ── */}
              {upcoming.length > 0 && (
                <ContentCarousel title="🎬 Próximos estrenos" movies={upcoming}
                  layout="sidebar"
                  description="Películas y series que se estrenan próximamente en cines y plataformas."
                  onMovieClick={handleMovieClick} />
              )}

              {/* ── Noticias de streaming y cine ── anchor always in DOM ── */}
              <div id="noticias">
                <NoticiasSection news={news} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Filtered / Search results grid ───────────────────────────────────────────
function FilteredResults({ filtered, filters, isSearchLoading, onClear, onMovieClick }: {
  filtered: Movie[];
  filters: FilterState;
  isSearchLoading: boolean;
  onClear: () => void;
  onMovieClick: (m: Movie) => void;
}) {
  const label =
    filters.query            ? `"${filters.query}"` :
    filters.contentType === 'movie'  ? 'Películas' :
    filters.contentType === 'series' ? 'Series' : 'Contenido';

  return (
    <section className="mb-8 px-4 md:px-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white text-lg font-bold">
          {label}{' '}
          {!isSearchLoading && <span className="text-dv-muted text-sm font-normal">({filtered.length} resultados)</span>}
        </h2>
        <button onClick={onClear} className="text-dv-accent text-sm hover:underline">Limpiar filtros</button>
      </div>

      {isSearchLoading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-dv-accent/30 border-t-dv-accent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">🔍</p>
          <p className="text-white font-semibold mb-1">Sin resultados</p>
          <p className="text-dv-muted text-sm">Probá con otro término o cambiá los filtros.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-3">
          {filtered.map((m) => <MovieCard key={m.id} movie={m} onClick={onMovieClick} />)}
        </div>
      )}
    </section>
  );
}
