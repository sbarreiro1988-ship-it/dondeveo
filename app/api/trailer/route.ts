export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';

const TMDB_TOKEN = process.env.TMDB_ACCESS_TOKEN;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const type = searchParams.get('type') || 'movie';

  if (!id || !TMDB_TOKEN) return NextResponse.json({ key: null });

  try {
    // Try Spanish first, fall back to English
    const [resEs, resEn] = await Promise.all([
      fetch(`https://api.themoviedb.org/3/${type}/${id}/videos?language=es-419`, {
        headers: { Authorization: `Bearer ${TMDB_TOKEN}` },
        next: { revalidate: 3600 },
      }),
      fetch(`https://api.themoviedb.org/3/${type}/${id}/videos?language=en-US`, {
        headers: { Authorization: `Bearer ${TMDB_TOKEN}` },
        next: { revalidate: 3600 },
      }),
    ]);

    const [dataEs, dataEn] = await Promise.all([
      resEs.ok ? resEs.json() : { results: [] },
      resEn.ok ? resEn.json() : { results: [] },
    ]);

    const videos: Array<{ key: string; site: string; type: string; official?: boolean }> = [
      ...(dataEs.results || []),
      ...(dataEn.results || []),
    ];

    const pick =
      videos.find((v) => v.site === 'YouTube' && v.type === 'Trailer' && v.official) ||
      videos.find((v) => v.site === 'YouTube' && v.type === 'Trailer') ||
      videos.find((v) => v.site === 'YouTube' && v.type === 'Teaser') ||
      videos.find((v) => v.site === 'YouTube');

    return NextResponse.json({ key: pick?.key ?? null });
  } catch {
    return NextResponse.json({ key: null });
  }
}
