/**
 * Google News Sitemap — /news-sitemap.xml
 *
 * Google News solo indexa artículos publicados en las últimas 48 horas.
 * Este sitemap sigue el formato de Google News Sitemap Protocol.
 * Registralo en Google Publisher Center para habilitar la indexación en Google News.
 */

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

const BASE = 'https://www.uru2.com';

async function fetchRecentArticles(): Promise<Array<{
  slug: string; title: string; publishedAt: string; tags?: string[];
}>> {
  // 1. Leer desde filesystem (cPanel)
  const filePath = process.env.NEWS_FILE_PATH;
  if (filePath) {
    try {
      const fs = await import('fs');
      const raw = fs.readFileSync(`${filePath}/index.json`, 'utf8');
      const data = JSON.parse(raw) as { articles: Array<{ slug: string; title: string; publishedAt: string; tags?: string[] }> };
      return data.articles ?? [];
    } catch { /* fallback */ }
  }

  // 2. Leer via HTTP
  const baseUrl = process.env.NEWS_DATA_URL;
  if (baseUrl) {
    try {
      const res = await fetch(`${baseUrl}/index.json`, { next: { revalidate: 0 }, signal: AbortSignal.timeout(5000) });
      if (res.ok) {
        const data = await res.json() as { articles: Array<{ slug: string; title: string; publishedAt: string; tags?: string[] }> };
        return data.articles ?? [];
      }
    } catch { /* fallback */ }
  }
  return [];
}

export async function GET() {
  // News sitemap deshabilitado — sección de noticias en revisión de calidad
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'no-cache, no-store',
    },
  });
}
