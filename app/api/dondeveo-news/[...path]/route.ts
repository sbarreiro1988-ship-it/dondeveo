/**
 * /api/dondeveo-news/[...path]
 *
 * Sirve los JSON de noticias generadas por el cron desde el filesystem.
 * Permite que uru2.com (Vercel) consuma los artículos de preview.uru2.com
 * sin depender de surastreaming.com (dominio que no resuelve externamente).
 *
 * Ejemplos:
 *   GET /api/dondeveo-news/index.json        → index de artículos
 *   GET /api/dondeveo-news/articles/slug.json → artículo individual
 */

import { NextRequest, NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(
  _req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const newsDir = process.env.NEWS_FILE_PATH;
  if (!newsDir) {
    return NextResponse.json({ error: 'NEWS_FILE_PATH not configured' }, { status: 503 });
  }

  // Sanitize path to prevent directory traversal
  const reqPath = (params.path ?? []).join('/').replace(/\.\./g, '');
  const fullPath = path.join(newsDir, reqPath);

  // Make sure the resolved path stays inside newsDir
  if (!fullPath.startsWith(path.resolve(newsDir))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const content = fs.readFileSync(fullPath, 'utf8');
    return new NextResponse(content, {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'public, max-age=300, stale-while-revalidate=60',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
}
