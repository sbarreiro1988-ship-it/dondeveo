import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { PLATFORMS } from '@/lib/mockData';
import { fetchAllByProvider, PLATFORM_PROVIDER_ID } from '@/lib/tmdb';
import PlatformClient from './PlatformClient';

export const revalidate = 3600; // 1 hour cache — full catalog fetch

const BASE = 'https://www.uru2.com';

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const platform = PLATFORMS[params.id];
  if (!platform) return {};
  const title = `Catálogo de ${platform.name} en Uruguay — DondeVeo`;
  const description = `Explorá todo el catálogo de ${platform.name} disponible en Uruguay. Películas y series organizadas por género, calificación y fecha de estreno.`;
  const url = `${BASE}/plataforma/${params.id}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: 'website', locale: 'es_UY', siteName: 'DondeVeo Uruguay' },
  };
}

export async function generateStaticParams() {
  return Object.keys(PLATFORM_PROVIDER_ID).map((id) => ({ id }));
}

export default async function PlatformPage({ params }: Props) {
  const { id } = params;
  const platform = PLATFORMS[id];
  const providerId = PLATFORM_PROVIDER_ID[id];

  if (!platform || !providerId) notFound();

  // Fetch all pages for movies + series in parallel (up to 10 pages × 3 regions = ~600 results)
  const [movies, series] = await Promise.all([
    fetchAllByProvider(providerId, 'movie', 10),
    fetchAllByProvider(providerId, 'tv',    10),
  ]);

  return (
    <PlatformClient
      platform={platform}
      movies={movies}
      series={series}
    />
  );
}
