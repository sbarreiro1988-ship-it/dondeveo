import { NextRequest, NextResponse } from 'next/server';
import { fetchAllWatchProviders } from '@/lib/tmdb';

/**
 * GET /api/watch-providers?id=TMDB_ID&type=movie|tv
 *
 * Usa fetchAllWatchProviders (misma fuente que la página de detalle):
 * - Busca en 9 regiones LatAm (UY, AR, MX, CL, CO, PE, BR, EC, BO)
 * - Incluye overrides manuales (Universal+, títulos sin datos en TMDB)
 * - Filtra por STREAMING_PROVIDERS_UY whitelist
 */
export async function GET(req: NextRequest) {
  const id   = req.nextUrl.searchParams.get('id');
  const type = (req.nextUrl.searchParams.get('type') ?? 'movie') as 'movie' | 'tv';
  if (!id) return NextResponse.json({ platforms: [] });

  try {
    const providers = await fetchAllWatchProviders(Number(id), type);
    return NextResponse.json({
      platforms: providers.map((p) => ({
        id:       p.platform.id,
        name:     p.platform.name,
        bgColor:  p.platform.bgColor,
        textColor: p.platform.textColor,
        logoUrl:  p.logoPath ?? p.platform.logoUrl ?? null,
      })),
    }, { headers: { 'Cache-Control': 'public, s-maxage=3600' } });
  } catch {
    return NextResponse.json({ platforms: [] });
  }
}
