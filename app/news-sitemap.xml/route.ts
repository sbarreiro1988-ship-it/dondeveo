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
const PUBLICATION_NAME = 'DondeVeo Uruguay';
const PUBLICATION_LANG = 'es';

interface ArticleEntry {
  slug: string;
  title: string;
  publishedAt: string;
  tags?: string[];
}

async function fetchRecentArticles(): Promise<ArticleEntry[]> {
  // 1. Leer desde filesystem (cPanel)
  const filePath = process.env.NEWS_FILE_PATH;
  if (filePath) {
    try {
      const fs = await import('fs');
      const raw = fs.readFileSync(`${filePath}/index.json`, 'utf8');
      const data = JSON.parse(raw) as { articles: ArticleEntry[] };
      return data.articles ?? [];
    } catch { /* fallback */ }
  }

  // 2. Leer via HTTP
  const baseUrl = process.env.NEWS_DATA_URL;
  if (baseUrl) {
    try {
      const res = await fetch(`${baseUrl}/index.json`, { next: { revalidate: 0 }, signal: AbortSignal.timeout(5000) });
      if (res.ok) {
        const data = await res.json() as { articles: ArticleEntry[] };
        return data.articles ?? [];
      }
    } catch { /* fallback */ }
  }
  return [];
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function toW3CDate(dateStr: string): string {
  try {
    return new Date(dateStr).toISOString();
  } catch {
    return new Date().toISOString();
  }
}

export async function GET() {
  const allArticles = await fetchRecentArticles();

  // Google News solo indexa artículos de las últimas 48 horas
  const cutoff = Date.now() - 48 * 60 * 60 * 1000;
  const recent = allArticles.filter((a) => {
    try { return new Date(a.publishedAt).getTime() >= cutoff; } catch { return false; }
  });

  const urlEntries = recent.map((article) => {
    const keywords = (article.tags ?? []).join(', ');
    return `  <url>
    <loc>${BASE}/noticias/${escapeXml(article.slug)}</loc>
    <news:news>
      <news:publication>
        <news:name>${PUBLICATION_NAME}</news:name>
        <news:language>${PUBLICATION_LANG}</news:language>
      </news:publication>
      <news:publication_date>${toW3CDate(article.publishedAt)}</news:publication_date>
      <news:title>${escapeXml(article.title)}</news:title>
      ${keywords ? `<news:keywords>${escapeXml(keywords)}</news:keywords>` : ''}
    </news:news>
  </url>`;
  }).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${urlEntries}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'no-cache, no-store',
    },
  });
}
