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

// ─── Static fallback (always shown if all feeds fail) ────────────────────────
const FALLBACK_NEWS: NewsItem[] = [
  {
    id: 'static-1',
    title: 'Netflix suma más de 300 títulos nuevos este mes de abril 2026',
    excerpt: 'La plataforma continúa expandiendo su catálogo con películas originales, documentales y nuevas temporadas de series populares.',
    link: 'https://www.netflix.com/browse/new-additions',
    pubDate: new Date().toISOString(),
    thumbnail: null,
    source: 'DondeVeo',
    sourceLang: 'es',
    category: 'Streaming',
  },
  {
    id: 'static-2',
    title: 'Disney+ incorpora contenido de Hulu y amplía su catálogo en Latinoamérica',
    excerpt: 'La fusión de contenidos permite a los suscriptores acceder a miles de títulos adicionales incluyendo series exclusivas de Hulu.',
    link: 'https://www.disneyplus.com',
    pubDate: new Date(Date.now() - 86400000).toISOString(),
    thumbnail: null,
    source: 'DondeVeo',
    sourceLang: 'es',
    category: 'Streaming',
  },
  {
    id: 'static-3',
    title: 'Max (HBO) estrena nuevas temporadas de sus series más premiadas',
    excerpt: 'The Last of Us, House of the Dragon y otras producciones premium regresan con nuevos episodios exclusivos en la plataforma.',
    link: 'https://www.max.com',
    pubDate: new Date(Date.now() - 2 * 86400000).toISOString(),
    thumbnail: null,
    source: 'DondeVeo',
    sourceLang: 'es',
    category: 'Streaming',
  },
  {
    id: 'static-4',
    title: 'Prime Video presenta su lineup de estrenos para el mes de mayo 2026',
    excerpt: 'Amazon anuncia nuevas películas originales y temporadas de The Boys, Reacher y otras series exclusivas para el próximo mes.',
    link: 'https://www.primevideo.com',
    pubDate: new Date(Date.now() - 3 * 86400000).toISOString(),
    thumbnail: null,
    source: 'DondeVeo',
    sourceLang: 'es',
    category: 'Streaming',
  },
  {
    id: 'static-5',
    title: 'Paramount+ refuerza su apuesta por el cine de estreno en streaming',
    excerpt: 'La plataforma seguirá ofreciendo acceso a películas de Paramount Pictures poco después de su lanzamiento en cines.',
    link: 'https://www.paramountplus.com',
    pubDate: new Date(Date.now() - 4 * 86400000).toISOString(),
    thumbnail: null,
    source: 'DondeVeo',
    sourceLang: 'es',
    category: 'Cine',
  },
  {
    id: 'static-6',
    title: 'Cines en Uruguay: récord de espectadores en el primer trimestre de 2026',
    excerpt: 'Las salas uruguayas reportan los mejores números desde la pandemia, impulsados por grandes estrenos de Hollywood y cine nacional.',
    link: 'https://cartelera.montevideo.com.uy',
    pubDate: new Date(Date.now() - 5 * 86400000).toISOString(),
    thumbnail: null,
    source: 'DondeVeo',
    sourceLang: 'es',
    category: 'Cine',
  },
];

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

  // Always append a few fallback items so section is never empty
  const extra = FALLBACK_NEWS.filter(f => !deduped.find(d => d.id === f.id));
  return [...deduped, ...extra.slice(0, 2)].slice(0, 24);
}
