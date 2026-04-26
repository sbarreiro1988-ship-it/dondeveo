import type { Movie, Platform } from '@/types';
import { PLATFORMS } from './mockData';

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

interface TMDBItem {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  vote_count: number;
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

// Provider ID → Platform (verified via TMDB /watch/providers/movie?watch_region=AR)
const PROVIDER: Record<number, Platform> = {
  8:    PLATFORMS.netflix,
  337:  PLATFORMS.disneyplus,
  1899: PLATFORMS.max,
  384:  PLATFORMS.max,
  119:  PLATFORMS.prime,
  9:    PLATFORMS.prime,
  531:  PLATFORMS.paramountplus,
  67:   PLATFORMS.paramountplus,
  350:  PLATFORMS.appletv,
  300:  PLATFORMS.plutotv,
  467:  PLATFORMS.directvgo,    // DIRECTV GO (verified, available in UY)
  11:   PLATFORMS.mubi,         // MUBI
  339:  PLATFORMS.movistar,     // MovistarTV
  283:  PLATFORMS.crunchyroll,    // Crunchyroll (anime)
  3:    PLATFORMS.googleplay,     // Google Play Movies
  2302: PLATFORMS.mercadoplay,   // Mercado Play (Mercado Libre)
  190:  PLATFORMS.curiositystream,// Curiosity Stream
  538:  PLATFORMS.plex,          // Plex (gratis)
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
    const data = await get<TMDBListResponse>('/trending/all/day', { watch_region: WATCH_REGION });
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
    const data = await get<TMDBListResponse>('/trending/movie/day', { watch_region: WATCH_REGION });
    return data.results
      .filter((i) => i.poster_path)
      .slice(0, 10)
      .map((i, idx) => ({ ...mapItem(i, genres, null, 'movie'), rank: idx + 1 }));
  } catch { return []; }
}

export async function fetchTrendingSeries(): Promise<Movie[]> {
  const genres = await getGenres('tv');
  try {
    const data = await get<TMDBListResponse>('/trending/tv/day', { watch_region: WATCH_REGION });
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
  const genres   = await getGenres(type);
  const mediaType = type === 'tv' ? 'series' : 'movie';

  try {
    const [arData, mxData] = await Promise.all([
      get<TMDBListResponse>(`/discover/${type}`, {
        with_genres:      String(genreId),
        sort_by:          'popularity.desc',
        watch_region:     'AR',
        'vote_count.gte': '20',
        page:             '1',
      }).catch(() => ({ results: [] })),
      get<TMDBListResponse>(`/discover/${type}`, {
        with_genres:      String(genreId),
        sort_by:          'popularity.desc',
        watch_region:     'MX',
        'vote_count.gte': '20',
        page:             '1',
      }).catch(() => ({ results: [] })),
    ]);

    const seen = new Set<number>();
    const result: Movie[] = [];

    for (const item of [...arData.results, ...mxData.results]) {
      if (item.poster_path && !seen.has(item.id)) {
        seen.add(item.id);
        result.push(mapItem(item, genres, null, mediaType));
      }
    }
    return result.slice(0, limit);
  } catch { return []; }
}

// ─── New on platform (timeline page) ─────────────────────────────────────────
export async function fetchNewOnPlatform(
  providerId: number,
  type: 'movie' | 'tv',
  daysBack = 60,
): Promise<Movie[]> {
  const genres    = await getGenres(type);
  const mediaType = type === 'tv' ? 'series' : 'movie';
  const platform  = PROVIDER[providerId] ?? null;

  const today    = new Date();
  const fromDate = new Date(today.getTime() - daysBack * 86400000).toISOString().split('T')[0];
  const toDate   = today.toISOString().split('T')[0];
  const dateKey  = type === 'tv' ? 'first_air_date' : 'primary_release_date';

  const seen    = new Set<number>();
  const results: Movie[] = [];

  // Fetch up to 5 pages sorted by release date desc (AR region has best data)
  for (let page = 1; page <= 5; page++) {
    try {
      const data = await get<TMDBListResponse>(`/discover/${type}`, {
        with_watch_providers: String(providerId),
        watch_region:         'AR',
        sort_by:              `${dateKey}.desc`,
        [`${dateKey}.gte`]:   fromDate,
        [`${dateKey}.lte`]:   toDate,
        page:                 String(page),
      });
      for (const item of data.results) {
        if (item.poster_path && !seen.has(item.id)) {
          seen.add(item.id);
          results.push(mapItem(item, genres, platform, mediaType));
        }
      }
      if (!data.total_pages || page >= (data.total_pages ?? 1)) break;
    } catch { break; }
  }

  return results;
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
