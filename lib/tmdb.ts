import type { Movie, Platform } from '@/types';
import { PLATFORMS } from './mockData';
import { MANUAL_OVERRIDES, getManualPlatforms } from './manualOverrides';

const TMDB_BASE = 'https://api.themoviedb.org/3';
const TMDB_TOKEN = process.env.TMDB_ACCESS_TOKEN;
export const IMAGE_BASE = 'https://image.tmdb.org/t/p';
const WATCH_REGION = 'UY';

export function img(path: string | null, size = 'w500'): string {
  if (!path) return '/placeholder-poster.jpg';
  return `${IMAGE_BASE}/${size}${path}`;
}

export function backdrop(path: string | null): string {
  if (!path) return '/placeholder-backdrop.jpg';
  return `${IMAGE_BASE}/w1280${path}`;
}

async function get<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  const url = new URL(`${TMDB_BASE}${endpoint}`);
  url.searchParams.set('language', 'es-419');
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${TMDB_TOKEN}`,
      'Content-Type': 'application/json',
    },
    next: { revalidate: 1800 },
  });

  if (!res.ok) throw new Error(`TMDB ${res.status}: ${endpoint}`);
  return res.json() as Promise<T>;
}

// Versión sin caché — para datos que deben ser siempre frescos (novedades, trending)
async function getFresh<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  const url = new URL(`${TMDB_BASE}${endpoint}`);
  url.searchParams.set('language', 'es-419');
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${TMDB_TOKEN}`,
      'Content-Type': 'application/json',
    },
    cache: 'no-store',  // ← siempre va a TMDB, sin caché de Next.js
  });

  if (!res.ok) throw new Error(`TMDB ${res.status}: ${endpoint}`);
  return res.json() as Promise<T>;
}

interface TMDBItem {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  vote_count: number;
  popularity?: number;
  release_date?: string;
  first_air_date?: string;
  genre_ids: number[];
  media_type?: string;
  runtime?: number;
  number_of_seasons?: number;
}

interface TMDBListResponse { results: TMDBItem[]; total_pages?: number; total_results?: number; }
interface TMDBGenresResponse { genres: { id: number; name: string }[] }

// Genre cache
const genreMap: Record<string, Record<number, string>> = {};

async function getGenres(type: 'movie' | 'tv'): Promise<Record<number, string>> {
  if (genreMap[type]) return genreMap[type];
  try {
    const data = await get<TMDBGenresResponse>(`/genre/${type}/list`);
    genreMap[type] = Object.fromEntries(data.genres.map((g) => [g.id, g.name]));
  } catch {
    genreMap[type] = {};
  }
  return genreMap[type];
}

function mapItem(item: TMDBItem, genres: Record<number, string>, platform: Platform | null, type: 'movie' | 'series'): Movie {
  return {
    id: item.id,
    title: item.title ?? item.name ?? 'Sin título',
    originalTitle: item.title ?? item.name ?? '',
    overview: item.overview || 'Sin descripción disponible.',
    posterPath: img(item.poster_path, 'w500'),
    backdropPath: backdrop(item.backdrop_path),
    voteAverage: Math.round(item.vote_average * 10) / 10,
    voteCount: item.vote_count,
    releaseDate: item.release_date ?? item.first_air_date ?? '',
    genres: (item.genre_ids ?? []).map((id) => genres[id]).filter(Boolean),
    type,
    platforms: platform ? [platform] : [],
    tmdbId: item.id,
    runtime: item.runtime,
    seasons: item.number_of_seasons,
  };
}

// Provider ID → Platform (verified via TMDB /watch/providers/movie?watch_region=AR,MX,CL)
const PROVIDER: Record<number, Platform> = {
  // Netflix
  8:    PLATFORMS.netflix,
  // Disney+
  337:  PLATFORMS.disneyplus,
  // Max (HBO Max / Max)
  1899: PLATFORMS.max,
  384:  PLATFORMS.max,
  // Prime Video
  119:  PLATFORMS.prime,
  9:    PLATFORMS.prime,
  // Paramount+
  531:  PLATFORMS.paramountplus,
  67:   PLATFORMS.paramountplus,
  1853: PLATFORMS.paramountplus,  // Paramount+ Amazon Channel
  // Apple TV+
  350:  PLATFORMS.appletv,
  2552: PLATFORMS.appletv,        // Apple TV+ (US/algunas regiones)
  // Pluto TV
  300:  PLATFORMS.plutotv,
  // DirectvGo
  467:  PLATFORMS.directvgo,
  // MUBI
  11:   PLATFORMS.mubi,
  // Crunchyroll
  283:  PLATFORMS.crunchyroll,
  1968: PLATFORMS.crunchyroll,    // Crunchyroll (región alternativa)
  // Mercado Play
  2302: PLATFORMS.mercadoplay,
  // Curiosity Stream
  190:  PLATFORMS.curiositystream,
  // Plex
  538:  PLATFORMS.plex,
  // Viki
  344:  PLATFORMS.viki,
};

// ─── Fetch with configurable regions ─────────────────────────────────────────
export async function fetchByProvider(
  providerId: number,
  type: 'movie' | 'tv',
  limit = 20,
  regions = ['UY', 'AR'], // override to ['MX'] for providers like VIX
): Promise<Movie[]> {
  const mediaType = type === 'tv' ? 'series' : 'movie';
  const platform  = PROVIDER[providerId] ?? null;
  const genres    = await getGenres(type);
  const pages     = limit > 20 ? [1, 2] : [1];

  async function discover(region: string): Promise<Movie[]> {
    const results: Movie[] = [];
    for (const page of pages) {
      try {
        const data = await get<TMDBListResponse>(`/discover/${type}`, {
          with_watch_providers: String(providerId),
          watch_region: region,
          sort_by: 'popularity.desc',
          'vote_count.gte': '10',
          page: String(page),
        });
        data.results.forEach((item) => {
          if (item.poster_path) results.push(mapItem(item, genres, platform, mediaType));
        });
      } catch { break; }
    }
    return results;
  }

  // Fetch all specified regions in parallel then merge (first region has priority)
  const regionResults = await Promise.all(regions.map(discover));

  const seen     = new Set<number>();
  const combined: Movie[] = [];
  for (const regionMovies of regionResults) {
    for (const m of regionMovies) {
      if (!seen.has(m.id)) { seen.add(m.id); combined.push(m); }
    }
  }

  // If still sparse, auto-supplement with MX (unless MX was already used)
  if (combined.length < 8 && !regions.includes('MX')) {
    const mxResults = await discover('MX');
    for (const m of mxResults) {
      if (!seen.has(m.id)) { seen.add(m.id); combined.push(m); }
    }
  }

  return combined.slice(0, limit);
}

// ─── Trending del día ────────────────────────────────────────────────────────
export async function fetchTrending(): Promise<Movie[]> {
  const [mg, tg] = await Promise.all([getGenres('movie'), getGenres('tv')]);
  try {
    const data = await getFresh<TMDBListResponse>('/trending/all/day', { watch_region: WATCH_REGION });
    return data.results
      .filter((i) => i.poster_path && i.media_type !== 'person')
      .slice(0, 20)
      .map((i) => {
        const type = i.media_type === 'tv' ? 'series' : 'movie';
        const genres = type === 'series' ? tg : mg;
        return mapItem(i, genres, null, type);
      });
  } catch { return []; }
}

// ─── Top 10 películas y series separados (siempre 10 exactos) ────────────────
export async function fetchTrendingMovies(): Promise<Movie[]> {
  const genres = await getGenres('movie');
  try {
    const data = await getFresh<TMDBListResponse>('/trending/movie/day', { watch_region: WATCH_REGION });
    return data.results
      .filter((i) => i.poster_path)
      .slice(0, 10)
      .map((i, idx) => ({ ...mapItem(i, genres, null, 'movie'), rank: idx + 1 }));
  } catch { return []; }
}

export async function fetchTrendingSeries(): Promise<Movie[]> {
  const genres = await getGenres('tv');
  try {
    const data = await getFresh<TMDBListResponse>('/trending/tv/day', { watch_region: WATCH_REGION });
    return data.results
      .filter((i) => i.poster_path)
      .slice(0, 10)
      .map((i, idx) => ({ ...mapItem(i, genres, null, 'series'), rank: idx + 1 }));
  } catch { return []; }
}

// ─── Top Rated ───────────────────────────────────────────────────────────────
export async function fetchTopRated(type: 'movie' | 'tv'): Promise<Movie[]> {
  const genres = await getGenres(type);
  try {
    const data = await get<TMDBListResponse>(`/${type}/top_rated`, { region: WATCH_REGION });
    return data.results
      .filter((i) => i.poster_path)
      .slice(0, 20)
      .map((i) => mapItem(i, genres, null, type === 'tv' ? 'series' : 'movie'));
  } catch { return []; }
}

// ─── Próximos estrenos (películas + series) ────────────────────────────────────
export async function fetchUpcoming(): Promise<Movie[]> {
  const [mg, tg] = await Promise.all([getGenres('movie'), getGenres('tv')]);
  try {
    // Fetch 2 pages from AR + MX (much richer data than UY-only)
    const [p1ar, p2ar, p1mx, tvOnAir] = await Promise.all([
      get<TMDBListResponse>('/movie/upcoming', { region: 'AR', page: '1' }).catch(() => ({ results: [] })),
      get<TMDBListResponse>('/movie/upcoming', { region: 'AR', page: '2' }).catch(() => ({ results: [] })),
      get<TMDBListResponse>('/movie/upcoming', { region: 'MX', page: '1' }).catch(() => ({ results: [] })),
      get<TMDBListResponse>('/tv/on_the_air', { page: '1' }).catch(() => ({ results: [] })), // Series premiering
    ]);

    const combined: Movie[] = [];
    const seen = new Set<number>();

    // Movies first
    for (const item of [...p1ar.results, ...p2ar.results, ...p1mx.results]) {
      if (item.poster_path && !seen.has(item.id)) {
        seen.add(item.id);
        combined.push(mapItem(item, mg, null, 'movie'));
      }
    }
    // Add upcoming series
    for (const item of tvOnAir.results) {
      if (item.poster_path && !seen.has(item.id)) {
        seen.add(item.id);
        combined.push(mapItem(item, tg, null, 'series'));
      }
    }

    return combined.slice(0, 40);
  } catch { return []; }
}

// ─── En cartelera ─────────────────────────────────────────────────────────────
export async function fetchNowPlaying(): Promise<Movie[]> {
  const genres = await getGenres('movie');
  try {
    const [uyP1, arP1, arP2, mxP1] = await Promise.all([
      get<TMDBListResponse>('/movie/now_playing', { region: 'UY', page: '1' }).catch(() => ({ results: [] })),
      get<TMDBListResponse>('/movie/now_playing', { region: 'AR', page: '1' }).catch(() => ({ results: [] })),
      get<TMDBListResponse>('/movie/now_playing', { region: 'AR', page: '2' }).catch(() => ({ results: [] })),
      get<TMDBListResponse>('/movie/now_playing', { region: 'MX', page: '1' }).catch(() => ({ results: [] })),
    ]);

    const combined: Movie[] = [];
    const seen = new Set<number>();

    // UY first (most relevant), then AR, then MX
    for (const item of [...uyP1.results, ...arP1.results, ...arP2.results, ...mxP1.results]) {
      if (item.poster_path && item.backdrop_path && !seen.has(item.id)) {
        seen.add(item.id);
        combined.push(mapItem(item, genres, null, 'movie'));
      }
    }

    // Sort by release date descending (newest first)
    combined.sort((a, b) => {
      if (!a.releaseDate) return 1;
      if (!b.releaseDate) return -1;
      return b.releaseDate.localeCompare(a.releaseDate);
    });

    return combined.slice(0, 28);
  } catch { return []; }
}

// ─── Hero content (needs backdrop) ───────────────────────────────────────────
export async function fetchHeroContent(): Promise<Movie[]> {
  const genres = await getGenres('movie');
  try {
    const [uyData, arData] = await Promise.all([
      get<TMDBListResponse>('/movie/now_playing', { region: 'UY' }).catch(() => ({ results: [] })),
      get<TMDBListResponse>('/movie/now_playing', { region: 'AR' }).catch(() => ({ results: [] })),
    ]);

    const combined: Movie[] = [];
    const seen = new Set<number>();
    for (const item of [...uyData.results, ...arData.results]) {
      if (item.backdrop_path && item.poster_path && !seen.has(item.id)) {
        seen.add(item.id);
        combined.push(mapItem(item, genres, null, 'movie'));
      }
    }
    return combined.slice(0, 5);
  } catch { return []; }
}

// ─── Platform ID → primary TMDB provider ID ──────────────────────────────────
export const PLATFORM_PROVIDER_ID: Record<string, number> = {
  netflix:       8,
  disneyplus:    337,
  max:           1899,
  prime:         119,
  paramountplus: 531,
  appletv:       350,
  plutotv:       300,
  vix:           457,
  directvgo:     467,
  mubi:          11,
  crunchyroll:      283,
  googleplay:       3,
  mercadoplay:      2302,
  curiositystream:  190,
  plex:             538,
  viki:             344,
};

// ─── Fetch ALL pages for a platform (used by /plataforma/[id]) ───────────────
export async function fetchAllByProvider(
  providerId: number,
  type: 'movie' | 'tv',
  maxPages = 10,
): Promise<Movie[]> {
  const mediaType = type === 'tv' ? 'series' : 'movie';
  const platform  = PROVIDER[providerId] ?? null;
  const genres    = await getGenres(type);

  async function discoverAll(region: string): Promise<Movie[]> {
    const params = {
      with_watch_providers: String(providerId),
      watch_region: region,
      sort_by: 'popularity.desc',
      'vote_count.gte': '5',
      page: '1',
    };

    // Page 1 — also gets total_pages
    let firstData: TMDBListResponse;
    try {
      firstData = await get<TMDBListResponse>(`/discover/${type}`, params);
    } catch { return []; }

    const totalPages = Math.min(firstData.total_pages ?? 1, maxPages);
    const results: Movie[] = [];

    firstData.results.forEach((item) => {
      if (item.poster_path) results.push(mapItem(item, genres, platform, mediaType));
    });

    // Remaining pages in parallel batches of 5
    const remaining = Array.from({ length: totalPages - 1 }, (_, i) => i + 2);
    for (let i = 0; i < remaining.length; i += 5) {
      const batch = remaining.slice(i, i + 5);
      const pages = await Promise.all(
        batch.map((p) =>
          get<TMDBListResponse>(`/discover/${type}`, { ...params, page: String(p) }).catch(() => ({ results: [] })),
        ),
      );
      pages.forEach((d) =>
        d.results.forEach((item) => {
          if (item.poster_path) results.push(mapItem(item, genres, platform, mediaType));
        }),
      );
    }
    return results;
  }

  // No special MX overrides needed now
  const VIX_PROVIDERS = new Set<number>();
  const primaryRegions = VIX_PROVIDERS.has(providerId)
    ? ['MX', 'AR']
    : ['UY', 'AR'];

  const regionResults = await Promise.all(primaryRegions.map(discoverAll));

  const seen = new Set<number>();
  const combined: Movie[] = [];
  for (const regionMovies of regionResults) {
    for (const m of regionMovies) {
      if (!seen.has(m.id)) { seen.add(m.id); combined.push(m); }
    }
  }

  // If still thin, supplement with MX (only if not already used)
  if (combined.length < 80 && !primaryRegions.includes('MX')) {
    const mxResults = await discoverAll('MX');
    for (const m of mxResults) {
      if (!seen.has(m.id)) { seen.add(m.id); combined.push(m); }
    }
  }

  return combined;
}

// ─── Top 10 por género ───────────────────────────────────────────────────────
export const GENRE_IDS = {
  accion:    28,
  comedia:   35,
  drama:     18,
  terror:    27,
  scifi:     878,
  animacion: 16,
  aventura:  12,
} as const;

export async function fetchTopByGenre(
  genreId: number,
  type: 'movie' | 'tv' = 'movie',
  limit = 12,
): Promise<Movie[]> {
  const genres    = await getGenres(type);
  const mediaType = type === 'tv' ? 'series' : 'movie';
  const pages     = Math.min(Math.ceil(limit / 20), 4); // máx 4 páginas = 80 items

  try {
    const fetchPage = (region: string, page: number) =>
      getFresh<TMDBListResponse>(`/discover/${type}`, {
        with_genres:      String(genreId),
        sort_by:          'popularity.desc',
        watch_region:     region,
        'vote_count.gte': '20',
        page:             String(page),
      }).catch(() => ({ results: [] as TMDBItem[] }));

    const regions = ['AR', 'MX', 'CL', 'CO'];
    const pageNums = Array.from({ length: pages }, (_, i) => i + 1);
    const allFetches = pageNums.flatMap((p) => regions.map((r) => fetchPage(r, p)));
    const allResponses = await Promise.all(allFetches);

    const seen = new Set<number>();
    const result: Movie[] = [];

    for (const resp of allResponses) {
      for (const item of resp.results) {
        if (item.poster_path && !seen.has(item.id)) {
          seen.add(item.id);
          result.push(mapItem(item, genres, null, mediaType));
        }
      }
    }
    return result.slice(0, limit);
  } catch { return []; }
}

// ─── New on platform (timeline page) ─────────────────────────────────────────
// Estrategia dual:
//  1. Ordenar por fecha desc (lo más reciente que TMDB conoce para esta región)
//  2. Ordenar por popularidad (últimos 6 meses) — captura títulos recién
//     agregados al catálogo que pegan pico de popularidad aunque TMDB tenga
//     su fecha de estreno original (no "fecha agregado"). Esto compensa el
//     lag de 2-4 días de TMDB vs JustWatch.
export async function fetchNewOnPlatform(
  providerId: number,
  type: 'movie' | 'tv',
): Promise<Movie[]> {
  const genres    = await getGenres(type);
  const mediaType = type === 'tv' ? 'series' : 'movie';
  const platform  = PROVIDER[providerId] ?? null;
  const dateKey   = type === 'tv' ? 'first_air_date' : 'primary_release_date';
  const toDate    = new Date().toISOString().split('T')[0];

  // Ventana "reciente" = últimos 12 meses para capturar más contenido
  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
  const recentFrom = twelveMonthsAgo.toISOString().split('T')[0];

  const seen    = new Set<number>();
  const results: Movie[] = [];

  // Regiones LATAM — mismo catálogo de streaming, mejor cobertura combinada
  const LATAM = ['AR', 'MX', 'CL', 'CO', 'UY'];

  async function fetchRegion(region: string, sort: string, extra: Record<string, string> = {}) {
    const data = await getFresh<TMDBListResponse>(`/discover/${type}`, {
      with_watch_providers: String(providerId),
      watch_region:         region,
      sort_by:              sort,
      'vote_count.gte':     '1',
      ...extra,
    }).catch(() => ({ results: [] } as TMDBListResponse));
    return data.results ?? [];
  }

  // ── Fase 1: más recientes por fecha — todas las regiones LATAM ────────────
  const dateResults = await Promise.all(
    LATAM.map((r) => fetchRegion(r, `${dateKey}.desc`, { [`${dateKey}.lte`]: toDate }))
  );
  for (const items of dateResults) {
    for (const item of items) {
      if (item.poster_path && !seen.has(item.id)) {
        seen.add(item.id);
        results.push(mapItem(item, genres, platform, mediaType));
      }
    }
  }

  // ── Fase 2: más populares últimos 12 meses — todas las regiones LATAM ─────
  const popResults = await Promise.all(
    LATAM.map((r) => fetchRegion(r, 'popularity.desc', {
      [`${dateKey}.gte`]: recentFrom,
      [`${dateKey}.lte`]: toDate,
      'vote_count.gte':   '3',
    }))
  );
  for (const items of popResults) {
    for (const item of items) {
      if (item.poster_path && !seen.has(item.id)) {
        seen.add(item.id);
        results.push(mapItem(item, genres, platform, mediaType));
      }
    }
  }

  // Re-ordenar el resultado combinado por fecha desc para la UI de timeline
  results.sort((a, b) => {
    const da = a.releaseDate ? new Date(a.releaseDate).getTime() : 0;
    const db = b.releaseDate ? new Date(b.releaseDate).getTime() : 0;
    return db - da;
  });

  return results;
}

// ─── Universal+ (manual overrides → TMDB detail fetch) ───────────────────────
// Universal+ no tiene provider ID válido en TMDB para UY/AR,
// así que buscamos cada título directamente por su TMDB ID.
export async function fetchUniversalPlusContent(): Promise<Movie[]> {
  const [movieGenres, tvGenres] = await Promise.all([getGenres('movie'), getGenres('tv')]);
  const uPlus = PLATFORMS.universalplus;

  const results = await Promise.allSettled(
    MANUAL_OVERRIDES.map(async (override) => {
      const isMovie  = override.type === 'movie';
      const endpoint = isMovie ? `/movie/${override.tmdbId}` : `/tv/${override.tmdbId}`;
      const genres   = isMovie ? movieGenres : tvGenres;
      const mediaType = isMovie ? 'movie' : 'series';
      try {
        const item = await get<TMDBItem>(endpoint);
        if (!item.poster_path) return null;
        return mapItem(item, genres, uPlus, mediaType);
      } catch {
        return null;
      }
    }),
  );

  return results
    .filter((r): r is PromiseFulfilledResult<Movie | null> => r.status === 'fulfilled')
    .map((r) => r.value)
    .filter((m): m is Movie => m !== null);
}

// ─── Top 3 Finde — contenido trending en streaming UY (últimos 20 días) ───────
interface WatchProviderResult {
  provider_id: number;
  provider_name: string;
  logo_path: string;
}
interface WatchProvidersResponse {
  results?: Record<string, {
    flatrate?: WatchProviderResult[];
    buy?:      WatchProviderResult[];
    rent?:     WatchProviderResult[];
    free?:     WatchProviderResult[];  // Pluto TV, Tubi, etc.
    link?:     string;
  }>;
}

async function getUYProviders(id: number, type: 'movie' | 'tv'): Promise<Platform | null> {
  try {
    const data = await getFresh<WatchProvidersResponse>(`/${type}/${id}/watch/providers`);
    const uy = data.results?.['UY'];
    const providers = [...(uy?.flatrate ?? []), ...(uy?.buy ?? []), ...(uy?.rent ?? [])];
    for (const p of providers) {
      if (PROVIDER[p.provider_id]) return PROVIDER[p.provider_id];
    }
    return null;
  } catch { return null; }
}

// IDs de plataformas de streaming disponibles en Uruguay (para filtrar discover)
const STREAM_PROVIDERS_LATAM = '8|337|1899|384|119|9|531|67|350|300|283|11|2302|190|538';

export async function fetchFindeRecommendations(): Promise<Movie[]> {
  const [movieGenres, tvGenres] = await Promise.all([getGenres('movie'), getGenres('tv')]);

  const today    = new Date();
  // Últimos 30 días — más fresco y cambia más entre semanas
  const fromDate = new Date(today.getTime() - 30 * 86400000).toISOString().split('T')[0];
  const toDate   = today.toISOString().split('T')[0];

  // with_watch_providers filtra solo contenido disponible en streaming (NO en cines)
  // Buscamos en MX + AR (mejor cobertura TMDB que UY) — mismas plataformas disponibles
  const fetchRegion = async (region: string) => Promise.all([
    getFresh<TMDBListResponse>('/discover/movie', {
      watch_region:               region,
      with_watch_providers:       STREAM_PROVIDERS_LATAM,
      'primary_release_date.gte': fromDate,
      'primary_release_date.lte': toDate,
      sort_by:                    'popularity.desc',
      'vote_count.gte':           '10',
      page:                       '1',
    }).catch((): TMDBListResponse => ({ results: [] })),
    getFresh<TMDBListResponse>('/discover/tv', {
      watch_region:         region,
      with_watch_providers: STREAM_PROVIDERS_LATAM,
      'first_air_date.gte': fromDate,
      'first_air_date.lte': toDate,
      sort_by:              'popularity.desc',
      'vote_count.gte':     '5',
      page:                 '1',
    }).catch((): TMDBListResponse => ({ results: [] })),
  ]);

  // Buscar en MX primero (más datos), luego AR como fallback
  const [[movMX, serMX], [movAR, serAR]] = await Promise.all([
    fetchRegion('MX'),
    fetchRegion('AR'),
  ]);

  // Merge sin duplicados
  const seenIds = new Set<number>();
  const mergeResults = (a: TMDBItem[], b: TMDBItem[]) => {
    const out: TMDBItem[] = [];
    for (const i of [...a, ...b]) {
      if (i.poster_path && i.backdrop_path && !seenIds.has(i.id)) {
        seenIds.add(i.id);
        out.push(i);
      }
    }
    return out;
  };

  type Candidate = { item: TMDBItem; type: 'movie' | 'tv'; score: number };

  const topMovies: Candidate[] = mergeResults(movMX.results ?? [], movAR.results ?? [])
    .slice(0, 6)
    .map((i) => ({ item: i, type: 'movie' as const, score: i.popularity ?? 0 }));

  const topSeries: Candidate[] = mergeResults(serMX.results ?? [], serAR.results ?? [])
    .slice(0, 6)
    .map((i) => ({ item: i, type: 'tv' as const, score: i.popularity ?? 0 }));

  // Asegurar al menos 1 película Y 1 serie en el top 3
  let candidates: Candidate[] = [];
  if (topMovies.length > 0 && topSeries.length > 0) {
    // Tomar los 2 más populares de cada tipo, mezclar y elegir 3
    candidates = [topMovies[0], topSeries[0], topMovies[1] ?? topSeries[1]]
      .filter(Boolean)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  } else {
    candidates = [...topMovies, ...topSeries].sort((a, b) => b.score - a.score).slice(0, 3);
  }

  // Enriquecer con fetchAllWatchProviders (incluye overrides manuales — badges correctos)
  const enriched = await Promise.all(
    candidates.map(async ({ item, type }) => {
      const genres    = type === 'movie' ? movieGenres : tvGenres;
      const providers = await fetchAllWatchProviders(item.id, type);
      const platform  = providers[0]?.platform ?? null;
      const movie     = mapItem(item, genres, platform, type === 'movie' ? 'movie' : 'series');
      movie.platforms = providers.map((p) => p.platform);
      return movie;
    })
  );

  return enriched;
}

// ─── Search ───────────────────────────────────────────────────────────────────
export async function searchContent(query: string): Promise<Movie[]> {
  const [mg, tg] = await Promise.all([getGenres('movie'), getGenres('tv')]);
  try {
    const data = await get<TMDBListResponse>('/search/multi', { query });
    return data.results
      .filter((i) => i.poster_path && i.media_type !== 'person')
      .slice(0, 20)
      .map((i) => {
        const type = i.media_type === 'tv' ? 'series' : 'movie';
        return mapItem(i, type === 'series' ? tg : mg, null, type);
      });
  } catch { return []; }
}

// ─── Search with persons (actors) ─────────────────────────────────────────────
export interface PersonResult {
  id: number;
  name: string;
  profilePath: string | null;
  knownFor: string[];
  department: string;
}

interface TMDBPersonResult {
  id: number;
  name: string;
  profile_path: string | null;
  known_for_department: string;
  known_for: { title?: string; name?: string; media_type: string }[];
  media_type: string;
  popularity: number;
}

export async function searchWithPersons(query: string): Promise<{ movies: Movie[]; persons: PersonResult[] }> {
  const [mg, tg] = await Promise.all([getGenres('movie'), getGenres('tv')]);
  try {
    const data = await get<{ results: (TMDBItem & TMDBPersonResult)[] }>('/search/multi', { query });

    const movies: Movie[] = data.results
      .filter((i) => i.poster_path && i.media_type !== 'person')
      .slice(0, 20)
      .map((i) => {
        const type = i.media_type === 'tv' ? 'series' : 'movie';
        return mapItem(i, type === 'series' ? tg : mg, null, type);
      });

    const persons: PersonResult[] = data.results
      .filter((i): i is TMDBPersonResult & TMDBItem => i.media_type === 'person' && !!i.profile_path)
      .slice(0, 5)
      .map((i) => ({
        id: i.id,
        name: i.name,
        profilePath: i.profile_path ? `${IMAGE_BASE}/w185${i.profile_path}` : null,
        knownFor: (i.known_for ?? []).map((k) => k.title ?? k.name ?? '').filter(Boolean).slice(0, 3),
        department: i.known_for_department ?? 'Acting',
      }));

    return { movies, persons };
  } catch { return { movies: [], persons: [] }; }
}

// ─── Plataformas verificadas como disponibles en Uruguay ─────────────────────
// Solo estas plataformas se muestran en el modal y páginas de detalle.
// Google Play, Plex, MovistarTV etc. de otras regiones se excluyen porque
// su catálogo para UY es diferente o no tienen streaming real en Uruguay.
const STREAMING_PROVIDERS_UY = new Set([
  'netflix', 'disneyplus', 'max', 'prime', 'paramountplus', 'appletv',
  'plutotv', 'universalplus', 'crunchyroll', 'mubi', 'directvgo',
  'mercadoplay', 'curiositystream', 'viki',
]);

// ─── Watch providers for a specific title ─────────────────────────────────────
// Solo UY + AR (mercados más precisos para Uruguay).
// Incluye manual overrides (Universal+, etc.) como fuente complementaria.
export async function fetchAllWatchProviders(
  tmdbId: number,
  type: 'movie' | 'tv',
): Promise<{ platform: Platform; link: string; logoPath: string | null }[]> {
  const result: { platform: Platform; link: string; logoPath: string | null }[] = [];
  const seen = new Set<string>();

  try {
    const data = await get<WatchProvidersResponse>(`/${type}/${tmdbId}/watch/providers`);
    // Preferir link de UY, luego AR, luego cualquier LatAm disponible
    const link = data.results?.['UY']?.link
      ?? data.results?.['AR']?.link
      ?? data.results?.['MX']?.link
      ?? '';

    // Buscar en toda LatAm: el catálogo de Netflix, Prime, Apple TV+, Paramount+, Max
    // es prácticamente idéntico en todos estos países. TMDB tiene datos incompletos
    // para UY específicamente, pero MX/BR/CL suelen estar actualizados.
    // El whitelist STREAMING_PROVIDERS_UY asegura que solo mostramos plataformas
    // disponibles en Uruguay — no importa en qué región lo encontramos.
    const LATAM_REGIONS = ['UY', 'AR', 'MX', 'CL', 'CO', 'PE', 'BR', 'EC', 'BO'];

    for (const region of LATAM_REGIONS) {
      const reg = data.results?.[region];
      if (!reg) continue;
      // Solo flatrate (suscripción) y free (gratuito) — no rent/buy
      const streamProviders = [
        ...(reg.flatrate ?? []),
        ...(reg.free     ?? []),
      ];
      for (const p of streamProviders) {
        const platform = PROVIDER[p.provider_id];
        if (platform && !seen.has(platform.id) && STREAMING_PROVIDERS_UY.has(platform.id)) {
          seen.add(platform.id);
          result.push({
            platform,
            link,
            logoPath: p.logo_path ? `${IMAGE_BASE}/original${p.logo_path}` : null,
          });
        }
      }
    }
  } catch { /* continúa con overrides manuales */ }

  // ── Manual overrides: Universal+, etc. (no están en TMDB para UY/AR) ──
  for (const pl of getManualPlatforms(tmdbId)) {
    if (!seen.has(pl.id) && STREAMING_PROVIDERS_UY.has(pl.id)) {
      seen.add(pl.id);
      result.push({ platform: pl, link: '', logoPath: null });
    }
  }

  return result;
}

// ─── Movie/Series detail by TMDB ID ───────────────────────────────────────────
export async function fetchTitleDetail(tmdbId: number, type: 'movie' | 'tv'): Promise<Movie | null> {
  const genres = await getGenres(type);
  try {
    const item = await get<TMDBItem>(`/${type}/${tmdbId}`);
    if (!item.poster_path) return null;
    const providers = await fetchAllWatchProviders(tmdbId, type);
    const platform = providers[0]?.platform ?? null;
    const movie = mapItem(item, genres, platform, type === 'movie' ? 'movie' : 'series');
    movie.platforms = providers.map((p) => p.platform);
    return movie;
  } catch { return null; }
}

// ─── Person (actor/director) ───────────────────────────────────────────────────
export interface PersonData {
  id: number;
  name: string;
  biography: string;
  birthday: string | null;
  place_of_birth: string | null;
  profile_path: string | null;
  known_for_department: string;
  popularity: number;
}

export async function fetchPerson(personId: string): Promise<PersonData | null> {
  try {
    return await get<PersonData>(`/person/${personId}`);
  } catch { return null; }
}

export async function fetchPersonMovies(personId: string): Promise<Movie[]> {
  const [mg, tg] = await Promise.all([getGenres('movie'), getGenres('tv')]);
  try {
    const data = await get<{ cast: TMDBItem[]; crew: TMDBItem[] }>(
      `/person/${personId}/combined_credits`
    );
    const all = [...(data.cast ?? []), ...(data.crew ?? [])]
      .filter((i) => i.poster_path && i.vote_count > 5)
      .sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0));
    const seen = new Set<number>();
    return all
      .filter((i) => { if (seen.has(i.id)) return false; seen.add(i.id); return true; })
      .slice(0, 40)
      .map((i) => {
        const type = i.media_type === 'tv' ? 'series' : 'movie';
        return mapItem(i, type === 'series' ? tg : mg, null, type);
      });
  } catch { return []; }
}

// ─── Content by genre name ─────────────────────────────────────────────────────
export async function fetchByGenreName(
  genreName: string,
  type: 'movie' | 'tv' = 'movie',
  limit = 40,
): Promise<Movie[]> {
  const genres = await getGenres(type);
  const genreId = Object.entries(genres).find(
    ([, name]) => name.toLowerCase() === genreName.toLowerCase()
  )?.[0];
  if (!genreId) return [];
  return fetchTopByGenre(Number(genreId), type, limit);
}

// ─── Best by genre AND platform ────────────────────────────────────────────────
export async function fetchBestByGenreAndPlatform(
  genreName: string,
  providerId: number,
  type: 'movie' | 'tv' = 'movie',
  limit = 40,
): Promise<Movie[]> {
  const genres    = await getGenres(type);
  const platform  = PROVIDER[providerId] ?? null;
  const mediaType = type === 'tv' ? 'series' : 'movie';
  const genreId   = Object.entries(genres).find(
    ([, name]) => name.toLowerCase() === genreName.toLowerCase()
  )?.[0];
  if (!genreId) return [];

  const results: Movie[] = [];
  const seen = new Set<number>();

  for (const region of ['AR', 'MX', 'UY']) {
    try {
      const data = await getFresh<TMDBListResponse>(`/discover/${type}`, {
        with_genres:          genreId,
        with_watch_providers: String(providerId),
        watch_region:         region,
        sort_by:              'vote_average.desc',
        'vote_count.gte':     '50',
        page:                 '1',
      });
      for (const item of data.results ?? []) {
        if (item.poster_path && !seen.has(item.id)) {
          seen.add(item.id);
          results.push(mapItem(item, genres, platform, mediaType));
        }
      }
    } catch { /* continuar */ }
  }
  return results.sort((a, b) => b.voteAverage - a.voteAverage).slice(0, limit);
}

// ─── Platform stats for comparison ────────────────────────────────────────────
export async function fetchPlatformStats(providerId: number): Promise<{
  movies: number; series: number; topMovies: Movie[]; topSeries: Movie[];
}> {
  const [mg, sg] = await Promise.all([getGenres('movie'), getGenres('tv')]);
  const platform = PROVIDER[providerId] ?? null;
  const [movData, tvData] = await Promise.all([
    getFresh<TMDBListResponse>(`/discover/movie`, {
      with_watch_providers: String(providerId),
      watch_region: 'AR', sort_by: 'popularity.desc', 'vote_count.gte': '10', page: '1',
    }).catch((): TMDBListResponse => ({ results: [] })),
    getFresh<TMDBListResponse>(`/discover/tv`, {
      with_watch_providers: String(providerId),
      watch_region: 'AR', sort_by: 'popularity.desc', 'vote_count.gte': '5', page: '1',
    }).catch((): TMDBListResponse => ({ results: [] })),
  ]);
  return {
    movies:    movData.total_results ?? movData.results.length,
    series:    tvData.total_results  ?? tvData.results.length,
    topMovies: (movData.results ?? []).slice(0, 6).map((i) => mapItem(i, mg, platform, 'movie')),
    topSeries: (tvData.results  ?? []).slice(0, 6).map((i) => mapItem(i, sg, platform, 'series')),
  };
}

// ─── Search movie/series by title (for donde-ver) ─────────────────────────────
export async function searchByTitle(query: string): Promise<Movie[]> {
  const [mg, tg] = await Promise.all([getGenres('movie'), getGenres('tv')]);
  try {
    const data = await get<TMDBListResponse>('/search/multi', {
      query,
      watch_region: 'UY',
    });
    return (data.results ?? [])
      .filter((i) => i.poster_path && i.media_type !== 'person')
      .slice(0, 8)
      .map((i) => {
        const type = i.media_type === 'tv' ? 'series' : 'movie';
        return mapItem(i, type === 'series' ? tg : mg, null, type);
      });
  } catch { return []; }
}
