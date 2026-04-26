/**
 * manualOverrides.ts
 * Plataformas asignadas manualmente cuando TMDB no tiene datos para UY/AR.
 *
 * Fuente Universal+: justwatch.com/co/proveedor/universal-plus-amazon-channel
 * Para encontrar el TMDB ID: themoviedb.org → buscar el título → número en la URL
 */

import { PLATFORMS } from './mockData';
import type { Platform } from '@/types';

export interface ManualOverride {
  tmdbId:    number;
  title:     string;
  type:      'movie' | 'series';   // necesario para elegir el endpoint correcto
  platforms: Platform[];
}

const U = PLATFORMS.universalplus;

export const MANUAL_OVERRIDES: ManualOverride[] = [
  // ── SERIES en Universal+ ──────────────────────────────────────────────────
  { tmdbId: 113988, title: 'FROM',                    type: 'series', platforms: [U] },
  { tmdbId: 200461, title: 'Ted',                     type: 'series', platforms: [U] },
  { tmdbId: 79744,  title: 'The Rookie (El Novato)',  type: 'series', platforms: [U] },
  { tmdbId: 2316,   title: 'La Oficina (The Office)', type: 'series', platforms: [U] },
  { tmdbId: 8592,   title: 'Parks and Recreation',    type: 'series', platforms: [U] },
  { tmdbId: 1408,   title: 'House',                   type: 'series', platforms: [U] },
  { tmdbId: 62616,  title: 'Chicago PD',              type: 'series', platforms: [U] },
  { tmdbId: 63770,  title: 'Chicago Med',             type: 'series', platforms: [U] },
  { tmdbId: 91239,  title: 'Fantasmas (Ghosts)',      type: 'series', platforms: [U] },
  { tmdbId: 62648,  title: 'Superstore',              type: 'series', platforms: [U] },

  // ── PELÍCULAS en Universal+ ───────────────────────────────────────────────
  { tmdbId: 157336, title: 'Interstellar',            type: 'movie',  platforms: [U] },
  { tmdbId: 27205,  title: 'Origen (Inception)',      type: 'movie',  platforms: [U] },
  { tmdbId: 1124,   title: 'El truco final (The Prestige)', type: 'movie', platforms: [U] },
  { tmdbId: 101,    title: 'El profesional (Léon)',   type: 'movie',  platforms: [U] },
  { tmdbId: 744,    title: 'Top Gun',                 type: 'movie',  platforms: [U] },
  { tmdbId: 634649, title: 'Spider-Man: No Way Home', type: 'movie', platforms: [U] },
  { tmdbId: 569094, title: 'Spider-Man: Across the Spider-Verse', type: 'movie', platforms: [U] },
  { tmdbId: 769,    title: 'Goodfellas',              type: 'movie',  platforms: [U] },
  { tmdbId: 1422,   title: 'Infiltrados (The Departed)', type: 'movie', platforms: [U] },
  { tmdbId: 36557,  title: 'Casino Royale',           type: 'movie',  platforms: [U] },
  { tmdbId: 398818, title: 'Django Unchained',        type: 'movie',  platforms: [U] },
  { tmdbId: 497,    title: 'La milla verde',          type: 'movie',  platforms: [U] },
  { tmdbId: 77,     title: 'Memento',                 type: 'movie',  platforms: [U] },
  { tmdbId: 245891, title: 'John Wick',               type: 'movie',  platforms: [U] },
  { tmdbId: 24,     title: 'Kill Bill Vol. 1',        type: 'movie',  platforms: [U] },
  { tmdbId: 278,    title: 'Cadena perpetua (The Shawshank Redemption)', type: 'movie', platforms: [U] },
  { tmdbId: 560144, title: 'Maligno (Malignant)',     type: 'movie',  platforms: [U] },
];

/**
 * Devuelve un Map de tmdbId → plataformas para uso rápido en HomeClient
 */
export function getManualOverridesMap(): Map<number, Platform[]> {
  const map = new Map<number, Platform[]>();
  for (const o of MANUAL_OVERRIDES) {
    map.set(o.tmdbId, o.platforms);
  }
  return map;
}
