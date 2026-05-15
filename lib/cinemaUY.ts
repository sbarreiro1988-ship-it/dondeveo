/**
 * fetchCinemaUY — Scrapes cartelera.montevideo.com.uy and enriches each title
 * via TMDB search so we get real poster/backdrop/trailer data.
 *
 * Falls back to TMDB /movie/now_playing (AR region) if scraping fails.
 */

import type { Movie } from '@/types';
import { img, backdrop } from './tmdb';

const TMDB_TOKEN = process.env.TMDB_ACCESS_TOKEN;
const TMDB_BASE  = 'https://api.themoviedb.org/3';

// ─── TMDB search ─────────────────────────────────────────────────────────────
interface TMDBSearchResult {
  id: number;
  title?: string;
  original_title?: string;
  overview?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  vote_average?: number;
  vote_count?: number;
  release_date?: string;
  genre_ids?: number[];
  runtime?: number;
}

async function searchTMDB(title: string): Promise<TMDBSearchResult | null> {
  if (!TMDB_TOKEN) return null;
  try {
    const url = new URL(`${TMDB_BASE}/search/movie`);
    url.searchParams.set('query', title);
    url.searchParams.set('language', 'es-419');
    url.searchParams.set('include_adult', 'false');

    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${TMDB_TOKEN}` },
      next: { revalidate: 7200 },
    });
    if (!res.ok) return null;
    const data = await res.json();

    // First result with a poster — prefer it
    const withPoster = (data.results as TMDBSearchResult[]).find((r) => r.poster_path);
    return withPoster ?? data.results?.[0] ?? null;
  } catch { return null; }
}

function toMovie(r: TMDBSearchResult, cinemaTitle: string): Movie | null {
  if (!r.poster_path) return null;
  return {
    id: r.id,
    title:         r.title         ?? cinemaTitle,
    originalTitle: r.original_title ?? cinemaTitle,
    overview:      r.overview       ?? '',
    posterPath:    img(r.poster_path ?? null),
    backdropPath:  backdrop(r.backdrop_path ?? null),
    voteAverage:   Math.round((r.vote_average ?? 0) * 10) / 10,
    voteCount:     r.vote_count  ?? 0,
    releaseDate:   r.release_date ?? '',
    genres:        [],           // we don't need genre IDs here
    type:          'movie',
    platforms:     [],           // cinema — no streaming platform
    tmdbId:        r.id,
    runtime:       r.runtime,
  };
}

// ─── HTML title extractor ─────────────────────────────────────────────────────
// Navigation / UI strings that are NOT movie titles
const NAV_BLACKLIST = /^(navegaci|nuestros|más\s+secci|seguinos|publicidad|ordenar|canales|secciones|inicio|contacto|buscar|inicio\s+de|cerrar|abrir|menu|home|login|registr|suscri|newsletter|cookies|términos|privacy|facebook|instagram|twitter|youtube|whatsapp|tel:|mail:|info@)/i;

function cleanTitle(raw: string): string {
  return raw
    .replace(/&amp;/g, '&')
    .replace(/&oacute;/g, 'ó')
    .replace(/&aacute;/g, 'á')
    .replace(/&eacute;/g, 'é')
    .replace(/&iacute;/g, 'í')
    .replace(/&uacute;/g, 'ú')
    .replace(/&ntilde;/g, 'ñ')
    .replace(/&#\d+;/g, '')
    .replace(/&[a-z]+;/g, '')  // remove any remaining entities
    .trim();
}

function isMovieTitle(t: string): boolean {
  if (t.length < 3 || t.length > 100) return false;
  if (NAV_BLACKLIST.test(t)) return false;
  if (t.includes('&') && t.includes(';')) return false; // raw HTML entity
  if (/^\d+$/.test(t)) return false; // pure numbers
  if (/^[A-Z\s]+$/.test(t) && t.length < 6) return false; // short all-caps (nav)
  return true;
}

function extractTitles(html: string): string[] {
  const titles = new Set<string>();
  let m: RegExpExecArray | null;

  // Pattern 1: links matching /pelicula/ path
  const peliculaRe = /href="[^"]*\/pelicula\/[^"]*">([^<]{2,100})<\/a>/gi;
  while ((m = peliculaRe.exec(html)) !== null) {
    const t = cleanTitle(m[1]);
    if (isMovieTitle(t)) titles.add(t);
  }

  // Pattern 2: title="" attribute on movie links
  const titleAttrRe = /href="[^"]*\/pelicula\/[^"]*"[^>]*title="([^"]{2,100})"/gi;
  while ((m = titleAttrRe.exec(html)) !== null) {
    const t = cleanTitle(m[1]);
    if (isMovieTitle(t)) titles.add(t);
  }

  // Pattern 3: h2/h3 tags — strict filter
  const headRe = /<(?:h2|h3)[^>]*>([^<]{3,80})<\/(?:h2|h3)>/gi;
  while ((m = headRe.exec(html)) !== null) {
    const t = cleanTitle(m[1]);
    if (isMovieTitle(t) && !/^(cine|teatro|cartelera|estrenos|hoy|mañana|semana|próx|notic|critic|festiv)/i.test(t)) {
      titles.add(t);
    }
  }

  // Pattern 4: data-title or alt attributes near movie images
  const altRe = /(?:data-title|alt)="([^"]{3,80})"/gi;
  while ((m = altRe.exec(html)) !== null) {
    const t = cleanTitle(m[1]);
    if (isMovieTitle(t)) titles.add(t);
  }

  const result = Array.from(titles).filter(isMovieTitle);
  return result.slice(0, 40);
}

// ─── Fallback: TMDB theatrical releases for AR/UY ────────────────────────────
async function nowPlayingFallback(): Promise<Movie[]> {
  // Use /discover with release type 3 (theatrical) and recent date window
  const today  = new Date();
  const from   = new Date(today.getTime() - 60 * 86400000).toISOString().split('T')[0]; // 60 days ago
  const to     = today.toISOString().split('T')[0];

  try {
    const fetchPage = (region: string, page: number) =>
      fetch(`${TMDB_BASE}/movie/now_playing?region=${region}&page=${page}&language=es-419&primary_release_date.gte=${from}&primary_release_date.lte=${to}`, {
        headers: { Authorization: `Bearer ${TMDB_TOKEN}` },
        next: { revalidate: 3600 },
      }).then((r) => r.ok ? r.json() : { results: [] });

    const [uy1, ar1, ar2, mx1] = await Promise.all([
      fetchPage('UY', 1), fetchPage('AR', 1), fetchPage('AR', 2), fetchPage('MX', 1),
    ]);

    const seen = new Set<number>();
    const movies: Movie[] = [];

    for (const item of [...uy1.results, ...ar1.results, ...ar2.results, ...mx1.results]) {
      if (item.poster_path && item.backdrop_path && !seen.has(item.id)) {
        seen.add(item.id);
        const m = toMovie(item, item.title);
        if (m) movies.push(m);
      }
    }

    // Sort newest first
    movies.sort((a, b) => {
      if (!a.releaseDate) return 1;
      if (!b.releaseDate) return -1;
      return b.releaseDate.localeCompare(a.releaseDate);
    });

    return movies.slice(0, 28);
  } catch { return []; }
}

// ─── Main export ─────────────────────────────────────────────────────────────
export async function fetchCinemaUY(): Promise<Movie[]> {
  try {
    const res = await fetch('https://cartelera.montevideo.com.uy/cine', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'es-UY,es;q=0.9',
      },
      next: { revalidate: 7200 }, // 2-hour cache — cartelera changes weekly
    });

    if (!res.ok) throw new Error(`cartelera.montevideo.com.uy ${res.status}`);

    const html  = await res.text();
    const titles = extractTitles(html);

    console.log(`[cinemaUY] found ${titles.length} titles:`, titles);

    if (titles.length < 3) {
      console.warn('[cinemaUY] too few titles parsed — using TMDB fallback');
      return nowPlayingFallback();
    }

    // Search TMDB for each title in parallel batches of 6
    const movies: Movie[] = [];
    const seen  = new Set<number>();

    for (let i = 0; i < titles.length; i += 6) {
      const batch   = titles.slice(i, i + 6);
      const results = await Promise.all(batch.map(searchTMDB));

      results.forEach((r, idx) => {
        if (!r) return;
        if (seen.has(r.id)) return;
        seen.add(r.id);
        const m = toMovie(r, batch[idx]);
        if (m) movies.push(m);
      });
    }

    // If scraping gave us very little (TMDB couldn't match), supplement with now_playing
    if (movies.length < 6) {
      const fallback = await nowPlayingFallback();
      for (const m of fallback) {
        if (!seen.has(m.id)) { seen.add(m.id); movies.push(m); }
      }
    }

    return filterRecentOnly(movies);

  } catch (err) {
    console.warn('[cinemaUY] error, using TMDB fallback:', err);
    return filterRecentOnly(await nowPlayingFallback());
  }
}

// Only keep movies released in the last 120 days (nothing older can be "now playing")
function filterRecentOnly(movies: Movie[]): Movie[] {
  const cutoff = new Date(Date.now() - 120 * 86400000).toISOString().split('T')[0];
  return movies.filter((m) => !m.releaseDate || m.releaseDate >= cutoff);
}
