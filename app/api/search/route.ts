import { NextRequest, NextResponse } from 'next/server';
import { searchContent } from '@/lib/tmdb';

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q') ?? '';
  if (!q.trim()) return NextResponse.json([]);

  try {
    const results = await searchContent(q.trim());
    return NextResponse.json(results, {
      headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' },
    });
  } catch {
    return NextResponse.json([]);
  }
}
