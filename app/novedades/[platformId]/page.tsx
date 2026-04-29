import { notFound } from 'next/navigation';
import { PLATFORMS } from '@/lib/mockData';
import { fetchNewOnPlatform, fetchUniversalPlusContent, PLATFORM_PROVIDER_ID } from '@/lib/tmdb';
import TimelineClient from './TimelineClient';

export const dynamic = 'force-dynamic';

interface Props {
  params: { platformId: string };
}

export default async function NovedadesPage({ params }: Props) {
  const { platformId } = params;
  const platform = PLATFORMS[platformId];
  if (!platform) notFound();

  // Universal+ usa overrides manuales
  if (platformId === 'universalplus') {
    const all = await fetchUniversalPlusContent();
    const movies = all.filter((m) => m.type === 'movie');
    const series = all.filter((m) => m.type === 'series');
    return (
      <TimelineClient platform={platform} movies={movies} series={series} platformId={platformId} />
    );
  }

  const providerId = PLATFORM_PROVIDER_ID[platformId];
  if (!providerId) notFound();

  const [movies, series] = await Promise.all([
    fetchNewOnPlatform(providerId, 'movie'),
    fetchNewOnPlatform(providerId, 'tv'),
  ]);

  return (
    <TimelineClient platform={platform} movies={movies} series={series} platformId={platformId} />
  );
}
