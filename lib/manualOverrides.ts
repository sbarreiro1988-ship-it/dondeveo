/**
 * manualOverrides.ts
 * Plataformas asignadas manualmente cuando TMDB no tiene datos para UY/AR.
 *
 * Fuente Universal+: justwatch.com/co/proveedor/universal-plus-amazon-channel
 * Para encontrar el TMDB ID: themoviedb.org → buscar el título → número en la URL
 */

import { PLATFORMS } from './mockData';
import type { Platform } from '@/types';

interface ManualOverride {
  tmdbId:    number;
  title:     string;
  platforms: Platform[];
}

const U = PLATFORMS.universalplus;

export const MANUAL_OVERRIDES: ManualOverride[] = [
  // ── SERIES en Universal+ ──────────────────────────────────────────────────
  { tmdbId: 113988, title: 'FROM',                platforms: [U] },
  { tmdbId: 200461, title: 'Ted',                 platforms: [U] },
  { tmdbId: 79744,  title: 'The Rookie (El Novato)', platforms: [U] },
  { tmdbId: 2316,   title: 'La Oficina (The Office)', platforms: [U] },
  { tmdbId: 8592,   title: 'Parks and Recreation', platforms: [U] },
  { tmdbId: 1408,   title: 'House',               platforms: [U] },
  { tmdbId: 62616,  title: 'Chicago PD',          platforms: [U] },
  { tmdbId: 63770,  title: 'Chicago Med',         platforms: [U] },
  { tmdbId: 91239,  title: 'Fantasmas (Ghosts)',  platforms: [U] },
  { tmdbId: 62648,  title: 'Superstore',          platforms: [U] },

  // ── PELÍCULAS en Universal+ ───────────────────────────────────────────────
  { tmdbId: 157336, title: 'Interstellar',        platforms: [U] },
  { tmdbId: 27205,  title: 'Origen (Inception)',  platforms: [U] },
  { tmdbId: 1124,   title: 'El truco final (The Prestige)', platforms: [U] },
  { tmdbId: 101,    title: 'El profesional (Léon)', platforms: [U] },
  { tmdbId: 744,    title: 'Top Gun',             platforms: [U] },
  { tmdbId: 634649, title: 'Spider-Man: No Way Home', platforms: [U] },
  { tmdbId: 569094, title: 'Spider-Man: Across the Spider-Verse', platforms: [U] },
  { tmdbId: 769,    title: 'Goodfellas',          platforms: [U] },
  { tmdbId: 1422,   title: 'Infiltrados (The Departed)', platforms: [U] },
  { tmdbId: 36557,  title: 'Casino Royale',       platforms: [U] },
  { tmdbId: 398818, title: 'Django Unchained',    platforms: [U] },
  { tmdbId: 497,    title: 'La milla verde',      platforms: [U] },
  { tmdbId: 77,     title: 'Memento',             platforms: [U] },
  { tmdbId: 245891, title: 'John Wick',           platforms: [U] },
  { tmdbId: 24,     title: 'Kill Bill Vol. 1',    platforms: [U] },
  { tmdbId: 278,    title: 'Cadena perpetua (The Shawshank Redemption)', platforms: [U] },
  { tmdbId: 560144, title: 'Maligno (Malignant)', platforms: [U] },
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
