/**
 * newsApi.ts — Fetch streaming & cinema news directly from RSS feeds
 * Parses XML on the server without any third-party middleware.
 */

export interface NewsItem {
  id:         string;
  title:      string;
  excerpt:    string;
  link:       string;       // si hay slug → '/noticias/slug', si no → URL externa
  slug?:      string;       // presente cuando el artículo fue reescrito por Gemini
  pubDate:    string;
  thumbnail:  string | null;
  source:     string;
  sourceLang: 'es' | 'en';
  category:   string;
}

// ─── RSS sources — Spanish only ──────────────────────────────────────────────
const FEEDS = [
  // Argentina (same culture as Uruguay, great streaming/cinema coverage)
  { url: 'https://www.infobae.com/feeds/rss/entretenimiento/',      source: 'Infobae',      lang: 'es' as const, category: 'Entretenimiento' },
  { url: 'https://www.clarin.com/rss/espectaculos/',                source: 'Clarín',       lang: 'es' as const, category: 'Streaming' },
  { url: 'https://www.lanacion.com.ar/rss/secciones/espectaculos.xml', source: 'La Nación AR', lang: 'es' as const, category: 'Cine' },
  // Spain — best Spanish-language cinema journalism
  { url: 'https://www.espinof.com/rss',                            source: 'Espinof',      lang: 'es' as const, category: 'Cine' },
  { url: 'https://www.fotogramas.es/feed/',                        source: 'Fotogramas',   lang: 'es' as const, category: 'Cine' },
  { url: 'https://www.sensacine.com/rss/noticias-cine.xml',        source: 'SensaCine',    lang: 'es' as const, category: 'Cine' },
  { url: 'https://www.20minutos.es/rss/cine/',                     source: '20minutos',    lang: 'es' as const, category: 'Cine' },
  // Uruguay
  { url: 'https://www.elobservador.com.uy/rss/cultura',            source: 'El Observador',lang: 'es' as const, category: 'Cultura' },
];

// ─── XML helpers ──────────────────────────────────────────────────────────────
function extractTag(xml: string, tag: string): string {
  // Handles CDATA and plain text
  const re = new RegExp(`<${tag}[^>]*>(?:<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>|([^<]*))<\\/${tag}>`, 'i');
  const m  = re.exec(xml);
  return (m?.[1] ?? m?.[2] ?? '').trim();
}

function extractAttr(xml: string, tag: string, attr: string): string {
  const re = new RegExp(`<${tag}[^>]*\\s${attr}="([^"]+)"`, 'i');
  return re.exec(xml)?.[1]?.trim() ?? '';
}

function stripHtml(s: string): string {
  return s
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ').trim();
}

function findImage(itemXml: string): string | null {
  // media:content, enclosure, or first img in description/content
  const media = extractAttr(itemXml, 'media:content', 'url');
  if (media && media.match(/\.(jpg|jpeg|png|webp)/i)) return media;

  const enc = extractAttr(itemXml, 'enclosure', 'url');
  if (enc && enc.match(/\.(jpg|jpeg|png|webp)/i)) return enc;

  const imgRe = /<img[^>]+src="([^"]+)"/i;
  const content = extractTag(itemXml, 'content:encoded') || extractTag(itemXml, 'description');
  const imgM = imgRe.exec(content);
  if (imgM?.[1]?.startsWith('http')) return imgM[1];

  return null;
}

async function parseFeed(feed: typeof FEEDS[number]): Promise<NewsItem[]> {
  try {
    const res = await fetch(feed.url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; DondeVeo/1.0; +https://dondeveo.uy)',
        'Accept': 'application/rss+xml, application/xml, text/xml, */*',
      },
      next: { revalidate: 1800 },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return [];
    const xml = await res.text();

    // Extract <item> blocks
    const itemRe = /<item>([\s\S]*?)<\/item>/gi;
    const items: NewsItem[] = [];
    let m: RegExpExecArray | null;

    while ((m = itemRe.exec(xml)) !== null && items.length < 8) {
      const block = m[1];
      const title   = stripHtml(extractTag(block, 'title'));
      const link    = extractTag(block, 'link') || extractAttr(block, 'guid', 'isPermaLink') || '';
      const rawDesc = extractTag(block, 'content:encoded') || extractTag(block, 'description') || '';
      const excerpt = stripHtml(rawDesc).slice(0, 240);
      const pubDate = extractTag(block, 'pubDate');
      const thumb   = findImage(block);

      if (!title || title.length < 4) continue;
      if (!link.startsWith('http')) continue;

      items.push({
        id:         `${feed.source}-${link}`,
        title,
        excerpt:    excerpt || title,
        link,
        pubDate,
        thumbnail:  thumb,
        source:     feed.source,
        sourceLang: feed.lang,
        category:   feed.category,
      });
    }
    return items;
  } catch { return []; }
}

// ─── Static DondeVeo articles (always internal pages, always shown first) ─────
import { STATIC_ARTICLES } from './staticArticles';

const FALLBACK_NEWS: NewsItem[] = STATIC_ARTICLES.map((a) => ({
  id:         a.uid,
  title:      a.title,
  excerpt:    a.intro,
  link:       `/noticias/${a.slug}`,  // ← siempre página interna
  slug:       a.slug,
  pubDate:    a.publishedAt,
  thumbnail:  null,
  source:     'DondeVeo',
  sourceLang: 'es' as const,
  category:   a.category,
}));

// ─── Noticias internas (generadas por Gemini + script Python) ─────────────────
// Lee el index.json guardado por el script en el servidor cPanel.
// NEWS_DATA_URL debe apuntar a la carpeta pública, ej:
//   https://midominio.com/dondeveo-news
export async function fetchInternalNews(): Promise<NewsItem[]> {
  const baseUrl = process.env.NEWS_DATA_URL;
  if (!baseUrl) return [];

  try {
    const res = await fetch(`${baseUrl}/index.json`, {
      next: { revalidate: 1800 },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return [];
    const data = await res.json() as { articles: Array<{
      uid: string; slug: string; title: string; intro: string;
      category: string; thumbnail?: string | null; source: string; publishedAt: string;
    }> };

    return (data.articles ?? []).map((a) => ({
      id:         a.uid,
      title:      a.title,
      excerpt:    a.intro,
      link:       `/noticias/${a.slug}`,   // URL interna ← clave para AdSense
      slug:       a.slug,
      pubDate:    a.publishedAt,
      thumbnail:  a.thumbnail ?? null,
      source:     a.source,
      sourceLang: 'es' as const,
      category:   a.category ?? 'Streaming',
    }));
  } catch {
    return [];
  }
}

// ─── Main export ──────────────────────────────────────────────────────────────
export async function fetchStreamingNews(): Promise<NewsItem[]> {
  const results = await Promise.allSettled(FEEDS.map(parseFeed));

  const all: NewsItem[] = [];
  for (const r of results) {
    if (r.status === 'fulfilled') all.push(...r.value);
  }

  if (all.length === 0) {
    console.warn('[newsApi] all RSS feeds failed — using fallback');
    return FALLBACK_NEWS;
  }

  // Sort by date desc, dedup by title
  all.sort((a, b) => {
    const da = a.pubDate ? new Date(a.pubDate).getTime() : 0;
    const db = b.pubDate ? new Date(b.pubDate).getTime() : 0;
    return db - da;
  });

  const seen = new Set<string>();
  const deduped: NewsItem[] = [];
  for (const item of all) {
    const key = item.title.toLowerCase().slice(0, 50);
    if (!seen.has(key)) { seen.add(key); deduped.push(item); }
  }

  // DondeVeo siempre primero, luego el resto de fuentes
  const dondeveo  = FALLBACK_NEWS.filter(f => !deduped.find(d => d.id === f.id));
  const combined  = [...dondeveo.slice(0, 3), ...deduped];
  return combined.filter((m, i, arr) => arr.findIndex(x => x.id === m.id) === i).slice(0, 24);
}
