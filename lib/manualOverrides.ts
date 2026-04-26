/**
 * manualOverrides.ts
 * Plataformas asignadas manualmente cuando TMDB no tiene datos para UY/AR.
 * Agregar aquí cualquier serie/película con plataforma conocida.
 *
 * Para encontrar el TMDB ID de una serie/película:
 * https://www.themoviedb.org/search → hacé clic en el título → el número en la URL es el ID
 */

import { PLATFORMS } from './mockData';
import type { Platform } from '@/types';

interface ManualOverride {
  tmdbId: number;
  title:  string;   // solo para referencia
  platforms: Platform[];
}

export const MANUAL_OVERRIDES: ManualOverride[] = [
  // ── Universal+ ────────────────────────────────────────────────────────────
  {
    tmdbId:    113988,
    title:    'FROM',
    platforms: [PLATFORMS.universalplus],
  },
  {
    tmdbId:    1399,
    title:    'Game of Thrones',
    platforms: [PLATFORMS.universalplus],
  },
  {
    tmdbId:    46648,
    title:    'Yellowjackets',
    platforms: [PLATFORMS.universalplus],
  },
  {
    tmdbId:    60735,
    title:    'The Flash',
    platforms: [PLATFORMS.universalplus],
  },
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
