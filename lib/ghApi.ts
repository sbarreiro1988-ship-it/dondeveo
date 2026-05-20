/**
 * ghApi.ts — Gran Hermano Argentina 2026
 * Usa artículos internos generados por Groq (gh-index.json) con fallback a Google News RSS
 */

export interface GHItem {
  id:          string;
  slug:        string;      // ruta interna: /gran-hermano/[slug]
  title:       string;
  link:        string;      // URL original (para "leer más" en la nota)
  source:      string;
  pubDate:     string;
  thumbnail:   string | null;
  excerpt:     string;
  body?:       string;      // Cuerpo completo (solo artículos internos Groq)
  conclusion?: string;      // Conclusión (solo artículos internos Groq)
  isInternal?: boolean;     // true = artículo generado por Groq
}

// Shape del gh-index.json generado por generate_gh_news.py
interface GHInternalArticle {
  uid:         string;
  slug:        string;
  title:       string;
  intro:       string;
  body:        string;
  conclusion:  string;
  tags:        string[];
  category:    string;
  thumbnail:   string | null;
  source:      string;
  originalUrl: string;
  publishedAt: string;
  isTrending:  boolean;
}

/** Genera slug URL-safe a partir del título */
export function ghSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80);
}

function stripHtml(s: string): string {
  return s.replace(/<[^>]+>/g,' ').replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&nbsp;/g,' ').replace(/\s+/g,' ').trim();
}

function extractTag(xml: string, tag: string): string {
  const re = new RegExp(`<${tag}[^>]*>(?:<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>|([^<]*))<\\/${tag}>`,'i');
  const m = re.exec(xml);
  return (m?.[1] ?? m?.[2] ?? '').trim();
}

function findImageInDesc(desc: string): string | null {
  const m = /<img[^>]+src="([^"]+)"/i.exec(desc);
  if (m?.[1] && m[1].startsWith('http') && !m[1].includes('.svg')) return m[1];
  return null;
}

// Limpia el título de Google News que a veces viene "Título - Fuente"
function cleanTitle(raw: string): string {
  return raw.replace(/\s*-\s*[^-]+$/, '').trim() || raw;
}

function timeAgo(dateStr: string): string {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  if (mins < 60)  return `Hace ${mins}m`;
  if (hours < 24) return `Hace ${hours}h`;
  return `Hace ${Math.floor(diff / 86400000)}d`;
}
export { timeAgo as ghTimeAgo };

/** Lee artículos internos generados por Groq desde gh-index.json */
async function fetchInternalGHNews(): Promise<GHItem[]> {
  const baseUrl = process.env.NEWS_DATA_URL;
  if (!baseUrl) return [];
  try {
    const res = await fetch(`${baseUrl}/gh-index.json`, {
      next: { revalidate: 900 },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return [];
    const data = await res.json() as { articles: GHInternalArticle[] };
    return (data.articles ?? []).slice(0, 20).map((a: GHInternalArticle) => ({
      id:         a.uid,
      slug:       a.slug,
      title:      a.title,
      link:       a.originalUrl ?? '',
      source:     'DondeVeo Uruguay',
      pubDate:    a.publishedAt,
      thumbnail:  a.thumbnail ?? null,
      excerpt:    a.intro,
      body:       a.body,
      conclusion: a.conclusion,
      isInternal: true,
    }));
  } catch { return []; }
}

/** Lee noticias de GH desde Google News RSS (fallback) */
async function fetchGHRSS(): Promise<GHItem[]> {
  const QUERIES = [
    'Gran+Hermano+Argentina+2026',
    'GH+2026+Argentina+participantes',
  ];

  const results: GHItem[] = [];
  const seen = new Set<string>();

  for (const q of QUERIES) {
    try {
      const res = await fetch(
        `https://news.google.com/rss/search?q=${q}&hl=es-419&gl=AR&ceid=AR:es-419`,
        { next: { revalidate: 900 }, signal: AbortSignal.timeout(8000) }
      );
      if (!res.ok) continue;
      const xml = await res.text();

      const itemRe = /<item>([\s\S]*?)<\/item>/gi;
      let m: RegExpExecArray | null;

      while ((m = itemRe.exec(xml)) !== null && results.length < 20) {
        const block     = m[1];
        const rawTitle  = stripHtml(extractTag(block, 'title'));
        const title     = cleanTitle(rawTitle);
        const link      = extractTag(block, 'link') || extractTag(block, 'guid');
        const pubDate   = extractTag(block, 'pubDate');
        const desc      = extractTag(block, 'description');
        const source    = extractTag(block, 'source') || 'GH 2026';
        const excerpt   = stripHtml(desc).slice(0, 200);
        const thumbnail = findImageInDesc(desc);

        if (!title || title.length < 5 || !link) continue;
        const key = title.toLowerCase().slice(0, 40);
        if (seen.has(key)) continue;
        seen.add(key);

        const slug = ghSlug(title);
        results.push({
          id:        `gh-${link}`,
          slug,
          title,
          link,
          source:    stripHtml(source).slice(0, 30),
          pubDate,
          thumbnail,
          excerpt,
          isInternal: false,
        });
      }
    } catch { /* never break the home */ }
  }

  return results.slice(0, 12);
}

/**
 * fetchGHNews — punto de entrada principal.
 * Intenta artículos internos (Groq) primero; si hay ≥3, los usa.
 * Siempre complementa con RSS para tener artículos recientes.
 */
export async function fetchGHNews(): Promise<GHItem[]> {
  const [internal, rss] = await Promise.allSettled([
    fetchInternalGHNews(),
    fetchGHRSS(),
  ]);

  const internalItems = internal.status === 'fulfilled' ? internal.value : [];
  const rssItems      = rss.status === 'fulfilled'      ? rss.value      : [];

  if (internalItems.length >= 3) {
    // Mezclar: internos primero, luego RSS fresco que no esté duplicado
    const internalIds = new Set(internalItems.map(i => i.id));
    const freshRss    = rssItems.filter(r => !internalIds.has(r.id));
    return [...internalItems, ...freshRss].slice(0, 12);
  }

  // Fallback: solo RSS
  return rssItems;
}
