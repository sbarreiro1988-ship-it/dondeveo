import { notFound } from 'next/navigation';
import { PLATFORMS } from '@/lib/mockData';
import { fetchNewOnPlatform, PLATFORM_PROVIDER_ID, fetchUniversalPlusContent } from '@/lib/tmdb';
import TimelineClient from './TimelineClient';

export const revalidate = 1800;

interface Props {
  params: { platformId: string };
}

export async function generateStaticParams() {
  const fromProvider = Object.keys(PLATFORM_PROVIDER_ID).map((id) => ({ platformId: id }));
  // Universal+ no tiene provider ID en TMDB — se genera con overrides manuales
  return [...fromProvider, { platformId: 'universalplus' }];
}

export default async function NovedadesPage({ params }: Props) {
  const { platformId } = params;
  const platform = PLATFORMS[platformId];
  if (!platform) notFound();

  // Universal+ usa overrides manuales (no tiene provider ID en TMDB para UY/AR)
  if (platformId === 'universalplus') {
    const all = await fetchUniversalPlusContent();
    const movies = all.filter((m) => m.type === 'movie');
    const series = all.filter((m) => m.type === 'series');
    return (
      <TimelineClient
        platform={platform}
        movies={movies}
        series={series}
        platformId={platformId}
      />
    );
  }

  const providerId = PLATFORM_PROVIDER_ID[platformId];
  if (!providerId) notFound();

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
