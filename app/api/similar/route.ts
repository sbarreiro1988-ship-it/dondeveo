export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';

const TMDB_BASE  = 'https://api.themoviedb.org/3';
const TMDB_TOKEN = process.env.TMDB_ACCESS_TOKEN;
const IMG_BASE   = 'https://image.tmdb.org/t/p';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const id   = searchParams.get('id');
  const type = searchParams.get('type') ?? 'movie';

  if (!id) return NextResponse.json({ similar: [] });

  try {
    const res = await fetch(
      `${TMDB_BASE}/${type}/${id}/recommendations?language=es-419`,
      {
        headers: { Authorization: `Bearer ${TMDB_TOKEN}` },
        next: { revalidate: 86400 },
      }
    );
    if (!res.ok) return NextResponse.json({ similar: [] });

    const data = await res.json() as {
      results: {
        id: number;
        title?: string;
        name?: string;
        poster_path: string | null;
        vote_average: number;
        release_date?: string;
        first_air_date?: string;
        overview: string;
        genre_ids: number[];
        backdrop_path: string | null;
      }[];
    };

    const similar = (data.results ?? [])
      .filter((m) => m.poster_path)
      .slice(0, 12)
      .map((m) => ({
        id:           m.id,
        title:        m.title ?? m.name ?? 'Sin título',
        originalTitle: m.title ?? m.name ?? '',
        overview:     m.overview || '',
        posterPath:   `${IMG_BASE}/w342${m.poster_path}`,
        backdropPath: m.backdrop_path ? `${IMG_BASE}/w1280${m.backdrop_path}` : '/placeholder-backdrop.jpg',
        voteAverage:  Math.round(m.vote_average * 10) / 10,
        voteCount:    0,
        releaseDate:  m.release_date ?? m.first_air_date ?? '',
        genres:       [],
        type:         type === 'tv' ? 'series' : 'movie',
        platforms:    [],
        tmdbId:       m.id,
      }));

    return NextResponse.json({ similar });
  } catch {
    return NextResponse.json({ similar: [] });
  }
}
