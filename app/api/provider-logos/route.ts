import { NextResponse } from 'next/server';

const TMDB_BASE  = 'https://api.themoviedb.org/3';
const TMDB_TOKEN = process.env.TMDB_ACCESS_TOKEN;
const IMG_BASE   = 'https://image.tmdb.org/t/p/original';

// TMDB provider ID → our platform ID
const PROVIDER_MAP: Record<number, string> = {
  8:    'netflix',
  337:  'disneyplus',
  1899: 'max',
  384:  'max',
  119:  'prime',
  9:    'prime',
  531:  'paramountplus',
  67:   'paramountplus',
  350:  'appletv',
  300:  'plutotv',
  467:  'directvgo',
  11:   'mubi',
  283:  'crunchyroll',
  3:    'googleplay',
  2302: 'mercadoplay',
  190:  'curiositystream',
  538:  'plex',
  344:  'viki',
  339:  'movistar',
};

export const revalidate = 86400; // 24 horas

export async function GET() {
  try {
    const res = await fetch(
      `${TMDB_BASE}/watch/providers/movie?watch_region=AR&language=es-419`,
      {
        headers: { Authorization: `Bearer ${TMDB_TOKEN}` },
        next: { revalidate: 86400 },
      }
    );
    if (!res.ok) return NextResponse.json({});

    const data = await res.json() as {
      results: { provider_id: number; logo_path: string; provider_name: string }[];
    };

    // Mapa: platformId → logoUrl
    const logos: Record<string, string> = {};
    for (const p of data.results) {
      const platformId = PROVIDER_MAP[p.provider_id];
      if (platformId && p.logo_path && !logos[platformId]) {
        logos[platformId] = `${IMG_BASE}${p.logo_path}`;
      }
    }

    return NextResponse.json(logos, {
      headers: { 'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=3600' },
    });
  } catch {
    return NextResponse.json({});
  }
}
