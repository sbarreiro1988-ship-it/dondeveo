export const runtime = 'edge';
/**
 * /donde-ver/[slug] — Redirect page (legacy URL format)
 *
 * This format used title slugs like /donde-ver/el-padrino which were unreliable
 * (same slug could match different movies) and bad for SEO.
 *
 * Now redirects permanently to the canonical /pelicula/[type]/[tmdbId] URL.
 * Google and other search engines will follow the redirect and update their index.
 */
import { redirect, notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { searchByTitle } from '@/lib/tmdb';

interface Props { params: { slug: string } }

function slugToTitle(slug: string) {
  return decodeURIComponent(slug).replace(/-/g, ' ');
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const title = slugToTitle(params.slug);
  const cap   = title.split(' ').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  // Try to resolve the canonical URL for the meta
  try {
    const results = await searchByTitle(title);
    if (results.length) {
      const main   = results[0];
      const type   = main.type === 'series' ? 'tv' : 'movie';
      const tmdbId = main.tmdbId ?? main.id;
      return {
        title: `¿Dónde ver ${cap} en Uruguay? — DondeVeo`,
        description: `Encontrá en qué plataforma de streaming podés ver ${cap} en Uruguay. Netflix, Disney+, Max, Prime Video y más.`,
        alternates: { canonical: `https://www.uru2.com/pelicula/${type}/${tmdbId}` },
      };
    }
  } catch { /* fallback below */ }

  return {
    title: `¿Dónde ver ${cap} en Uruguay? — DondeVeo`,
    description: `Encontrá en qué plataforma de streaming podés ver ${cap} en Uruguay.`,
    robots: { index: false }, // don't index if we can't resolve
  };
}

export default async function DondeVerRedirect({ params }: Props) {
  const query   = slugToTitle(params.slug);
  const results = await searchByTitle(query);
  if (!results.length) notFound();

  const main   = results[0];
  const type   = main.type === 'series' ? 'tv' : 'movie';
  const tmdbId = main.tmdbId ?? main.id;

  // 308 = permanent redirect (preserves method, best for SEO)
  redirect(`/pelicula/${type}/${tmdbId}`);
}
