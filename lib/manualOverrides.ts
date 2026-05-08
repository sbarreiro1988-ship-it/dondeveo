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
const N = PLATFORMS.netflix;
const P = PLATFORMS.paramountplus;
const A = PLATFORMS.appletv;

export const MANUAL_OVERRIDES: ManualOverride[] = [
  // ── Confirmados por usuario — TMDB no tiene datos para LatAm ─────────────
  { tmdbId: 262388,  title: 'M.I.A.',                  type: 'series', platforms: [P] },
  { tmdbId: 1330021, title: 'Criaturas luminosas',      type: 'movie',  platforms: [N] },
  { tmdbId: 314916,  title: 'Incondicional',            type: 'series', platforms: [A] },

  // ── SERIES en Universal+ ─────────────────────────────────────────────────
  // IDs verificados en themoviedb.org (buscar en inglés, tomar el número de la URL)
  { tmdbId: 124364, title: 'FROM',                    type: 'series', platforms: [U] },
  { tmdbId: 201834, title: 'Ted',                     type: 'series', platforms: [U] },
  { tmdbId: 79744,  title: 'The Rookie (El Novato)',  type: 'series', platforms: [U] },
  { tmdbId: 2316,   title: 'La Oficina (The Office)', type: 'series', platforms: [U] },
  { tmdbId: 8592,   title: 'Parks and Recreation',    type: 'series', platforms: [U] },
  { tmdbId: 1408,   title: 'House',                   type: 'series', platforms: [U] },
  { tmdbId: 58841,  title: 'Chicago PD',              type: 'series', platforms: [U] },
  { tmdbId: 62650,  title: 'Chicago Med',             type: 'series', platforms: [U] },
  { tmdbId: 126027, title: 'Fantasmas (Ghosts)',      type: 'series', platforms: [U] },
  { tmdbId: 62649,  title: 'Superstore',              type: 'series', platforms: [U] },

  // ── PELÍCULAS en Universal+ ───────────────────────────────────────────────
  { tmdbId: 157336, title: 'Interstellar',            type: 'movie',  platforms: [U] },
  { tmdbId: 27205,  title: 'Origen (Inception)',      type: 'movie',  platforms: [U] },
  { tmdbId: 1124,   title: 'El truco final (The Prestige)', type: 'movie', platforms: [U] },
  { tmdbId: 101,    title: 'El profesional (Léon)',   type: 'movie',  platforms: [U] },
  { tmdbId: 744,    title: 'Top Gun',                 type: 'movie',  platforms: [U] },
  { tmdbId: 634649, title: 'Spider-Man: No Way Home', type: 'movie',  platforms: [U] },
  { tmdbId: 569094, title: 'Spider-Man: Across the Spider-Verse', type: 'movie', platforms: [U] },
  { tmdbId: 769,    title: 'Goodfellas',              type: 'movie',  platforms: [U] },
  { tmdbId: 1422,   title: 'Infiltrados (The Departed)', type: 'movie', platforms: [U] },
  { tmdbId: 36557,  title: 'Casino Royale',           type: 'movie',  platforms: [U] },
  { tmdbId: 68718,  title: 'Django Unchained',        type: 'movie',  platforms: [U] },
  { tmdbId: 497,    title: 'La milla verde',          type: 'movie',  platforms: [U] },
  { tmdbId: 77,     title: 'Memento',                 type: 'movie',  platforms: [U] },
  { tmdbId: 245891, title: 'John Wick',               type: 'movie',  platforms: [U] },
  { tmdbId: 24,     title: 'Kill Bill Vol. 1',        type: 'movie',  platforms: [U] },
  { tmdbId: 278,    title: 'Cadena perpetua (The Shawshank Redemption)', type: 'movie', platforms: [U] },
  { tmdbId: 619778, title: 'Maligno (Malignant)',     type: 'movie',  platforms: [U] },
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

/**
 * Devuelve las plataformas manuales para un tmdbId específico (para páginas SSR)
 */
export function getManualPlatforms(tmdbId: number): Platform[] {
  return MANUAL_OVERRIDES.find((o) => o.tmdbId === tmdbId)?.platforms ?? [];
}
