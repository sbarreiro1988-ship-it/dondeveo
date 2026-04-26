import { notFound } from 'next/navigation';
import { PLATFORMS } from '@/lib/mockData';
import { fetchNewOnPlatform, PLATFORM_PROVIDER_ID } from '@/lib/tmdb';
import TimelineClient from './TimelineClient';

export const revalidate = 1800;

interface Props {
  params: { platformId: string };
}

export async function generateStaticParams() {
  return Object.keys(PLATFORM_PROVIDER_ID).map((id) => ({ platformId: id }));
}

export default async function NovedadesPage({ params }: Props) {
  const { platformId } = params;
  const platform   = PLATFORMS[platformId];
  const providerId = PLATFORM_PROVIDER_ID[platformId];

  if (!platform || !providerId) notFound();

  const [movies, series] = await Promise.all([
    fetchNewOnPlatform(providerId, 'movie', 60),
    fetchNewOnPlatform(providerId, 'tv',    60),
  ]);

  return (
    <TimelineClient
      platform={platform}
      movies={movies}
      series={series}
      platformId={platformId}
    />
  );
}
