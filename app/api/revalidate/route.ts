export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/revalidate?secret=TU_SECRETO
 * En Cloudflare Workers/Edge no existe revalidatePath — el caché se invalida
 * automáticamente con cada nuevo deploy desde GitHub.
 */
export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret');

  if (!secret || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json(
      { error: 'Unauthorized — secret incorrecto o ausente' },
      { status: 401 },
    );
  }

  return NextResponse.json({
    revalidated: true,
    timestamp:   new Date().toISOString(),
    message:     'En Cloudflare el caché se invalida con cada deploy automático desde GitHub.',
  });
}
