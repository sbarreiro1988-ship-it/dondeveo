import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

/**
 * GET /api/revalidate?secret=TU_SECRETO
 *
 * Fuerza la regeneración de todas las páginas con contenido dinámico.
 * Llamar desde cPanel con cron cada hora:
 *   0 * * * * curl -s "https://uru2.com/api/revalidate?secret=TU_SECRETO" >> /home/user/logs/revalidate.log 2>&1
 *
 * Variable de entorno requerida en Vercel:
 *   REVALIDATE_SECRET = una cadena aleatoria larga (ej: generada en https://1password.com/password-generator/)
 */
export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret');

  if (!secret || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json(
      { error: 'Unauthorized — secret incorrecto o ausente' },
      { status: 401 },
    );
  }

  try {
    // Página principal
    revalidatePath('/');

    // Páginas de novedades (todas las plataformas)
    const platforms = [
      'netflix', 'disneyplus', 'max', 'prime', 'paramountplus',
      'appletv', 'plutotv', 'directvgo', 'crunchyroll', 'mubi',
      'mercadoplay', 'curiositystream', 'plex', 'googleplay',
      'universalplus', 'viki',
    ];
    for (const p of platforms) {
      revalidatePath(`/novedades/${p}`);
    }

    // Páginas de noticias
    revalidatePath('/noticias');
    revalidatePath('/noticias/[slug]', 'page');

    const ts = new Date().toISOString();
    console.log(`[revalidate] OK at ${ts}`);

    return NextResponse.json({
      revalidated: true,
      timestamp:   ts,
      paths:       ['/', ...platforms.map(p => `/novedades/${p}`), '/noticias'],
    });
  } catch (err) {
    return NextResponse.json(
      { error: 'Revalidation failed', detail: String(err) },
      { status: 500 },
    );
  }
}
