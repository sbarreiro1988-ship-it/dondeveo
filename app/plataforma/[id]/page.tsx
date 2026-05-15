import { notFound } from 'next/navigation';
import { PLATFORMS } from '@/lib/mockData';
import { fetchAllByProvider, PLATFORM_PROVIDER_ID } from '@/lib/tmdb';
import PlatformClient from './PlatformClient';

export const revalidate = 3600; // 1 hour cache — full catalog fetch

interface Props {
  params: { id: string };
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
