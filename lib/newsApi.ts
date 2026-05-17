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
  isTrending?: boolean;     // artículos editoriales para la sección ⚡ Trending
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

function isGoodImage(url: string): boolean {
  if (!url.startsWith('http')) return false;
  if (url.includes('.svg')) return false;
  // Excluir iconos pequeños, avatares, logos genéricos
  if (/\/(icon|logo|avatar|badge|button|sprite|pixel|1x1|blank)\./i.test(url)) return false;
  if (/[?&](w|width)=[1-9][0-9]{0,1}(&|$)/i.test(url)) return false; // ancho < 100px
  return true;
}

function findImage(itemXml: string): string | null {
  // 1. media:thumbnail (SensaCine, algunos feeds)
  const thumb1 = extractAttr(itemXml, 'media:thumbnail', 'url');
  if (thumb1 && isGoodImage(thumb1)) return thumb1;

  // 2. media:content con url de imagen (20minutos, etc.)
  const mediaRe = /<media:content[^>]+url="([^"]+)"[^>]*>/gi;
  let mm: RegExpExecArray | null;
  while ((mm = mediaRe.exec(itemXml)) !== null) {
    const u = mm[1];
    if (isGoodImage(u)) return u;
  }

  // 3. enclosure con tipo imagen o URL de imagen (Clarín, etc.)
  const encRe = /<enclosure[^>]+url="([^"]+)"[^>]*>/gi;
  let em: RegExpExecArray | null;
  while ((em = encRe.exec(itemXml)) !== null) {
    const u = em[1];
    const isImg = /type="image/i.test(em[0]) || /\.(jpg|jpeg|png|webp|gif)/i.test(u);
    if (isImg && isGoodImage(u)) return u;
  }

  // 4. Buscar en content:encoded y description — tomar la primera imagen "grande"
  const content = extractTag(itemXml, 'content:encoded') || extractTag(itemXml, 'description') || '';
  const imgRe = /<img[^>]+src="([^"]+)"/gi;
  let imgM: RegExpExecArray | null;
  while ((imgM = imgRe.exec(content)) !== null) {
    const u = imgM[1];
    if (isGoodImage(u)) return u;
  }

  // 5. Buscar en el bloque crudo (para feeds que escapan los atributos)
  const rawImg = /https?:\/\/[^\s"'<>]+\.(?:jpg|jpeg|png|webp)(?:\?[^\s"'<>]*)?/i.exec(itemXml);
  if (rawImg && isGoodImage(rawImg[0])) return rawImg[0];

  return null;
}

// Extrae og:image del HTML de un artículo (para feeds sin imagen en RSS)
async function fetchOgImage(articleUrl: string): Promise<string | null> {
  try {
    const res = await fetch(articleUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      signal: AbortSignal.timeout(4000),
      next: { revalidate: 7200 },
    });
    if (!res.ok) return null;
    const html = await res.text();
    // og:image
    const og = /property="og:image"\s+content="([^"]+)"/i.exec(html)
            || /content="([^"]+)"\s+property="og:image"/i.exec(html);
    if (og?.[1] && isGoodImage(og[1])) return og[1];
    // twitter:image
    const tw = /name="twitter:image"\s+content="([^"]+)"/i.exec(html)
            || /content="([^"]+)"\s+name="twitter:image"/i.exec(html);
    if (tw?.[1] && isGoodImage(tw[1])) return tw[1];
    return null;
  } catch { return null; }
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
    const rawItems: Array<{ title: string; link: string; excerpt: string; pubDate: string; thumb: string | null }> = [];
    let m: RegExpExecArray | null;

    while ((m = itemRe.exec(xml)) !== null && rawItems.length < 6) {
      const block = m[1];
      const title   = stripHtml(extractTag(block, 'title'));
      const link    = extractTag(block, 'link') || extractAttr(block, 'guid', 'isPermaLink') || '';
      const rawDesc = extractTag(block, 'content:encoded') || extractTag(block, 'description') || '';
      const excerpt = stripHtml(rawDesc).slice(0, 240);
      const pubDate = extractTag(block, 'pubDate');
      const thumb   = findImage(block);
      if (!title || title.length < 4 || !link.startsWith('http')) continue;
      rawItems.push({ title, link, excerpt, pubDate, thumb });
    }

    // Para artículos sin imagen, intentar extraer og:image en paralelo
    const itemsWithImages = await Promise.all(
      rawItems.map(async (item) => {
        let thumbnail = item.thumb;
        if (!thumbnail) {
          thumbnail = await fetchOgImage(item.link);
        }
        return {
          id:         `${feed.source}-${item.link}`,
          title:      item.title,
          excerpt:    item.excerpt || item.title,
          link:       item.link,
          pubDate:    item.pubDate,
          thumbnail,
          source:     feed.source,
          sourceLang: feed.lang,
          category:   feed.category,
        } satisfies NewsItem;
      })
    );

    return itemsWithImages;
  } catch { return []; }
}

// Nota: los artículos estáticos de DondeVeo (lib/staticArticles.ts) solo se usan
// en /noticias/[slug] como fallback. NO aparecen en el feed de noticias de la home
// porque son genéricos y sin imagen — eso se ve poco profesional.
// En la home solo aparecen noticias reales (RSS) o artículos Gemini (NEWS_DATA_URL).

// ─── Detecta si un título es "editorial/clickbait" (apto para TrendingSection) ──
// Marcamos como isTrending los artículos tipo: finales explicados, joyas ocultas,
// listicles ("10 series..."), cancelaciones, drama/gossip, recomendaciones del finde.
function detectTrending(title: string, serverFlag?: boolean): boolean {
  if (serverFlag) return true; // el servidor ya lo marcó explícitamente
  const t = title.toLowerCase();
  return (
    /^\d+\s+(series|películas|razones|cosas|motivos|títulos|estrenos|animes?)/.test(t) || // listicle
    /explicad[ao]|el giro|el final|por qué|la razón|la verdad detrás/.test(t) ||          // explainer
    /oculta[s]?|escondida[s]?|joya|joyas|secreta[s]?|no sabías|ignorando/.test(t) ||     // hidden gem
    /este finde|fin de semana|no te pod[eé]s perder|te dejará|te har[aá]/.test(t) ||     // recomendación
    /olvidar a|reemplaza[rá]|mejor que|supera a|te engancha/.test(t) ||                  // comparación
    /separación|polémica|drama|pelea|conflicto|escándalo|cancelaron|cancelada/.test(t)    // gossip/cancel
  );
}

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

    // Solo los últimos 20 para la home — el resto vive en /noticias y sitemap
    return (data.articles ?? []).slice(0, 40).map((a: {
      uid: string; slug: string; title: string; intro: string;
      category: string; thumbnail?: string | null; source: string;
      publishedAt: string; isTrending?: boolean;
    }) => ({
      id:         a.uid,
      title:      a.title,
      excerpt:    a.intro,
      link:       `/noticias/${a.slug}`,
      slug:       a.slug,
      pubDate:    a.publishedAt,
      thumbnail:  a.thumbnail ?? null,
      source:     a.source,
      sourceLang: 'es' as const,
      category:   a.category ?? 'Streaming',
      // Trending: lo marca el servidor O lo detectamos por el título
      isTrending: detectTrending(a.title, a.isTrending),
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

  // Sin RSS: devolver array vacío (la home usará fetchInternalNews como fallback)
  if (all.length === 0) return [];

  // Ordenar por fecha desc, deduplicar por título
  all.sort((a, b) => {
    const da = a.pubDate ? new Date(a.pubDate).getTime() : 0;
    const db = b.pubDate ? new Date(b.pubDate).getTime() : 0;
    return db - da;
  });

  const seen    = new Set<string>();
  const deduped: NewsItem[] = [];
  for (const item of all) {
    const key = item.title.toLowerCase().slice(0, 50);
    if (!seen.has(key)) { seen.add(key); deduped.push(item); }
  }

  return deduped.slice(0, 24);
}
