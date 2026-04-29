/**
 * streamingApi.ts — Streaming Availability API (movieofthenight.com via RapidAPI)
 * Reemplaza fetchNewOnPlatform con datos en tiempo real (sin lag de TMDB).
 * Docs: https://docs.movieofthenight.com/
 */

import type { Movie, Platform } from '@/types';
import { PLATFORMS } from './mockData';

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY ?? '';
const API_HOST     = 'streaming-availability.p.rapidapi.com';
const API_BASE     = `https://${API_HOST}`;

// Mapeo de nuestro platformId → catalog ID del Streaming Availability API
const CATALOG_ID: Record<string, string> = {
  netflix:       'netflix',
  disneyplus:    'disney',
  max:           'hbo',
  prime:         'prime',
  paramountplus: 'paramount',
  appletv:       'apple',
  plutotv:       'pluto',
  mubi:          'mubi',
  crunchyroll:   'crunchyroll',
  directvgo:     'directv',
  googleplay:    'google',
  plex:          'plex',
};

interface SAShow {
  itemType:   string;
  showType:   'movie' | 'series';
  id:         string;
  title:      string;
  overview?:  string;
  releaseYear?: number;
  rating?:    number;
  genres?:    { id: string; name: string }[];
  imageSet?:  {
    verticalPoster?:   { w240?: string; w360?: string; w480?: string; w600?: string };
    horizontalPoster?: { w360?: string; w480?: string; w720?: string; w1080?: string };
  };
  streamingOptions?: Record<string, {
    service:        { id: string; name: string };
    type:           string;
    link:           string;
    availableSince?: number;
  }[]>;
  runtime?: number;
  seasonCount?: number;
}

interface SAResponse {
  shows:     SAShow[];
  hasMore:   boolean;
  nextCursor?: string;
}

function mapShow(show: SAShow, platform: Platform, country: string): Movie | null {
  const poster   = show.imageSet?.verticalPoster?.w480
                ?? show.imageSet?.verticalPoster?.w360
                ?? show.imageSet?.verticalPoster?.w240
                ?? '/placeholder-poster.jpg';
  const backdrop = show.imageSet?.horizontalPoster?.w1080
                ?? show.imageSet?.horizontalPoster?.w720
                ?? show.imageSet?.horizontalPoster?.w480
                ?? '/placeholder-backdrop.jpg';

  // Fecha de cuando fue agregado a la plataforma (no fecha de estreno)
  const options = show.streamingOptions?.[country] ?? [];
  const addedTs = options[0]?.availableSince;
  const addedDate = addedTs
    ? new Date(addedTs * 1000).toISOString().split('T')[0]
    : (show.releaseYear ? `${show.releaseYear}-01-01` : '');

  // ID numérico — hash simple del string ID
  const numId = Math.abs(show.id.split('').reduce((acc, c) => acc * 31 + c.charCodeAt(0), 0)) % 2147483647;

  return {
    id:           numId,
    title:        show.title,
    originalTitle:show.title,
    overview:     show.overview ?? '',
    posterPath:   poster,
    backdropPath: backdrop,
    voteAverage:  show.rating ? Math.round(show.rating / 10) / 1 : 0,
    voteCount:    0,
    releaseDate:  addedDate,
    genres:       (show.genres ?? []).map((g) => g.name).filter(Boolean),
    type:         show.showType === 'series' ? 'series' : 'movie',
    platforms:    [platform],
    tmdbId:       numId,
    runtime:      show.runtime,
    seasons:      show.seasonCount,
  };
}

async function fetchByType(
  catalogId: string,
  showType: 'movie' | 'series',
  platform: Platform,
  country: string,
  cursor?: string,
): Promise<{ shows: Movie[]; nextCursor?: string }> {
  const params = new URLSearchParams({
    catalogs:  `${catalogId}/${country}`,
    show_type: showType,
    order_by:  'recently_added',
    order_direction: 'desc',
    output_language: 'es',
  });
  if (cursor) params.set('cursor', cursor);

  const res = await fetch(`${API_BASE}/shows/search/filters?${params}`, {
    headers: {
      'x-rapidapi-key':  RAPIDAPI_KEY,
      'x-rapidapi-host': API_HOST,
    },
    cache: 'no-store',
    signal: AbortSignal.timeout(10000),
  });

  if (!res.ok) {
    console.error(`StreamingAPI ${res.status}: ${catalogId}/${country} ${showType}`);
    return { shows: [] };
  }

  const data = await res.json() as SAResponse;
  const shows = (data.shows ?? [])
    .map((s) => mapShow(s, platform, country))
    .filter((s): s is Movie => s !== null);

  return { shows, nextCursor: data.hasMore ? data.nextCursor : undefined };
}

/**
 * Obtiene lo nuevo en una plataforma — datos en tiempo real vía Streaming Availability API.
 * Reemplaza fetchNewOnPlatform (TMDB) que tiene 2-4 días de lag.
 */
export async function fetchNewOnPlatformRealtime(
  platformId: string,
  type: 'movie' | 'tv',
): Promise<Movie[]> {
  if (!RAPIDAPI_KEY) return [];

  const catalogId = CATALOG_ID[platformId];
  if (!catalogId) return [];

  const platform = PLATFORMS[platformId] ?? null;
  if (!platform) return [];

  const showType  = type === 'tv' ? 'series' : 'movie';
  const country   = 'ar'; // Argentina — mejor cobertura para UY/AR

  const seen    = new Set<number>();
  const results: Movie[] = [];

  // Fetch 2 páginas (40 resultados aprox.)
  let cursor: string | undefined;
  for (let page = 0; page < 2; page++) {
    const { shows, nextCursor } = await fetchByType(catalogId, showType, platform, country, cursor);
    for (const s of shows) {
      if (!seen.has(s.id)) {
        seen.add(s.id);
        results.push(s);
      }
    }
    if (!nextCursor) break;
    cursor = nextCursor;
  }

  // Ordenar por fecha de agregado desc
  results.sort((a, b) => {
    const da = a.releaseDate ? new Date(a.releaseDate).getTime() : 0;
    const db = b.releaseDate ? new Date(b.releaseDate).getTime() : 0;
    return db - da;
  });

  return results;
}
