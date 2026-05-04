import { NextRequest, NextResponse } from 'next/server';

const TMDB_BASE  = 'https://api.themoviedb.org/3';
const TMDB_TOKEN = process.env.TMDB_ACCESS_TOKEN;
const IMG_BASE   = 'https://image.tmdb.org/t/p/w185';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const id   = searchParams.get('id');
  const type = searchParams.get('type') ?? 'movie';

  if (!id) return NextResponse.json({ cast: [] });

  try {
    const res = await fetch(
      `${TMDB_BASE}/${type}/${id}/credits?language=es-419`,
      {
        headers: { Authorization: `Bearer ${TMDB_TOKEN}` },
        next: { revalidate: 86400 },
      }
    );
    if (!res.ok) return NextResponse.json({ cast: [] });

    const data = await res.json() as {
      cast?: { id: number; name: string; character: string; profile_path: string | null; order: number }[];
    };

    const cast = (data.cast ?? [])
      .filter((a) => a.profile_path)
      .slice(0, 10)
      .map((a) => ({
        id:          a.id,
        name:        a.name,
        character:   a.character,
        profilePath: a.profile_path ? `${IMG_BASE}${a.profile_path}` : null,
      }));

    return NextResponse.json({ cast });
  } catch {
    return NextResponse.json({ cast: [] });
  }
}
