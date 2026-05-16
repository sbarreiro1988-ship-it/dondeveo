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
  const allArticles = await fetchRecentArticles();

  // Google News solo acepta artículos de las últimas 48 horas
  const cutoff = Date.now() - 48 * 60 * 60 * 1000;
  const recent = allArticles
    .filter(a => {
      try { return new Date(a.publishedAt).getTime() > cutoff; } catch { return false; }
    })
    .slice(0, 1000); // Google News acepta máximo 1000 URLs por sitemap

  const items = recent.map(a => {
    const title = a.title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const pubDate = new Date(a.publishedAt).toISOString();
    const keywords = (a.tags ?? []).slice(0, 10).join(', ');

    return `  <url>
    <loc>${BASE}/noticias/${a.slug}</loc>
    <news:news>
      <news:publication>
        <news:name>DondeVeo Uruguay</news:name>
        <news:language>es</news:language>
      </news:publication>
      <news:publication_date>${pubDate}</news:publication_date>
      <news:title>${title}</news:title>
      ${keywords ? `<news:keywords>${keywords}</news:keywords>` : ''}
    </news:news>
  </url>`;
  }).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${items}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=1800, stale-while-revalidate=300',
    },
  });
}
