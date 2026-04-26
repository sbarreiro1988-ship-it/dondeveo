import { NextRequest, NextResponse } from 'next/server';

const TMDB_BASE  = 'https://api.themoviedb.org/3';
const TMDB_TOKEN = process.env.TMDB_ACCESS_TOKEN;

export async function GET(req: NextRequest) {
  const id   = req.nextUrl.searchParams.get('id');
  const type = req.nextUrl.searchParams.get('type') ?? 'movie';
  if (!id) return NextResponse.json({});

  try {
    const res = await fetch(`${TMDB_BASE}/${type}/${id}/watch/providers`, {
      headers: { Authorization: `Bearer ${TMDB_TOKEN}` },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return NextResponse.json({});
    const data = await res.json();
    // Return results for UY and AR (fallback)
    return NextResponse.json(data.results ?? {});
  } catch {
    return NextResponse.json({});
  }
}
