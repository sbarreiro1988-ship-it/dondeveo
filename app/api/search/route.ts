export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';
import { searchWithPersons } from '@/lib/tmdb';

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q') ?? '';
  if (!q.trim()) return NextResponse.json({ movies: [], persons: [] });

  try {
    const results = await searchWithPersons(q.trim());
    return NextResponse.json(results, {
      headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' },
    });
  } catch {
    return NextResponse.json({ movies: [], persons: [] });
  }
}
