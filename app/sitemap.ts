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
    { url: BASE,                 lastModified: now, changeFrequency: 'hourly',  priority: 1.0 },
    { url: `${BASE}/noticias`,   lastModified: now, changeFrequency: 'hourly',  priority: 0.9 },
    { url: `${BASE}/acerca`,     lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/contacto`,   lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/privacidad`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/terminos`,   lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/guias`,                                             lastModified: now, changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE}/guias/plataformas-streaming-uruguay`,             lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${BASE}/guias/precio-streaming-uruguay`,                  lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${BASE}/guias/mejores-series-netflix-uruguay`,            lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/guias/mejores-peliculas-streaming-uruguay`,       lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/guias/streaming-para-ninos-uruguay`,              lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/guias/que-ver-este-finde`,                        lastModified: now, changeFrequency: 'weekly',  priority: 0.75 },
    { url: `${BASE}/guias/streaming-gratuito-uruguay`,                lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
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

  const GENEROS = ['accion','comedia','drama','terror','ciencia','thriller','animacion','documental','romance','aventura','fantasia','crimen'];
  const PLATAFORMAS = ['netflix','disneyplus','max','prime','paramountplus','appletv','crunchyroll','mubi','plutotv'];
  const COMPARACIONES = ['netflix-vs-disney','netflix-vs-max','netflix-vs-prime','disney-vs-max','disney-vs-prime','max-vs-prime','netflix-vs-paramount','netflix-vs-appletv'];

  // /genero/[genero]
  const generoPages: MetadataRoute.Sitemap = GENEROS.map((g) => ({
    url: `${BASE}/genero/${g}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // /mejores/[genero]/[plataforma]
  const mejoresPages: MetadataRoute.Sitemap = GENEROS.flatMap((g) =>
    PLATAFORMAS.map((p) => ({
      url: `${BASE}/mejores/${g}/${p}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.75,
    }))
  );

  // /comparar/[slug]
  const compararPages: MetadataRoute.Sitemap = COMPARACIONES.map((slug) => ({
    url: `${BASE}/comparar/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...novedadesPages, ...generoPages, ...mejoresPages, ...compararPages, ...newsPages];
}
