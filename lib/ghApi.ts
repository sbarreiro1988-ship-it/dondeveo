/**
 * ghApi.ts — Gran Hermano Argentina 2026
 * Usa Google News RSS para noticias y chismes en tiempo real
 */

export interface GHItem {
  id:        string;
  title:     string;
  link:      string;
  source:    string;
  pubDate:   string;
  thumbnail: string | null;
  excerpt:   string;
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

export async function fetchGHNews(): Promise<GHItem[]> {
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
        const block = m[1];
        const rawTitle = stripHtml(extractTag(block, 'title'));
        const title    = cleanTitle(rawTitle);
        const link     = extractTag(block, 'link') || extractTag(block, 'guid');
        const pubDate  = extractTag(block, 'pubDate');
        const desc     = extractTag(block, 'description');
        const source   = extractTag(block, 'source') || 'GH 2026';
        const excerpt  = stripHtml(desc).slice(0, 200);
        const thumbnail = findImageInDesc(desc);

        if (!title || title.length < 5 || !link) continue;
        const key = title.toLowerCase().slice(0, 40);
        if (seen.has(key)) continue;
        seen.add(key);

        results.push({
          id: `gh-${link}`,
          title,
          link,
          source: stripHtml(source).slice(0, 30),
          pubDate,
          thumbnail,
          excerpt,
        });
      }
    } catch { /* never break the home */ }
  }

  return results.slice(0, 12);
}
