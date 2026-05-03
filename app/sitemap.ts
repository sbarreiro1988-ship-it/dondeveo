import type { MetadataRoute } from 'next';
import { PLATFORM_PROVIDER_ID } from '@/lib/tmdb';

const BASE = 'https://www.uru2.com';

async function fetchNewsArticleSlugs(): Promise<string[]> {
  const baseUrl = process.env.NEWS_DATA_URL;
  if (!baseUrl) return [];
  try {
    const res = await fetch(`${baseUrl}/index.json`, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return [];
    const data = await res.json() as { articles: { slug: string; publishedAt: string }[] };
    return (data.articles ?? []).map((a) => a.slug);
  } catch { return []; }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date().toISOString();
  const slugs = await fetchNewsArticleSlugs();

  // Páginas estáticas principales
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE,              lastModified: now, changeFrequency: 'hourly',  priority: 1.0 },
    { url: `${BASE}/noticias`, lastModified: now, changeFrequency: 'hourly',  priority: 0.9 },
  ];

  // Páginas de novedades por plataforma
  const novedadesPages: MetadataRoute.Sitemap = Object.keys(PLATFORM_PROVIDER_ID).map((id) => ({
    url: `${BASE}/novedades/${id}`,
    lastModified: now,
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));

  // Artículos de noticias
  const newsPages: MetadataRoute.Sitemap = slugs.map((slug) => ({
    url: `${BASE}/noticias/${slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...novedadesPages, ...newsPages];
}
