import { notFound } from 'next/navigation';
import { PLATFORMS } from '@/lib/mockData';
import { fetchNewOnPlatform, fetchUniversalPlusContent, PLATFORM_PROVIDER_ID } from '@/lib/tmdb';
import { fetchNewOnPlatformRealtime } from '@/lib/streamingApi';
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

  // Intentar con Streaming Availability API (tiempo real, sin lag)
  // Si no tiene API key o falla, cae a TMDB como fallback
  const [moviesRT, seriesRT] = await Promise.all([
    fetchNewOnPlatformRealtime(platformId, 'movie'),
    fetchNewOnPlatformRealtime(platformId, 'tv'),
  ]);

  if (moviesRT.length > 0 || seriesRT.length > 0) {
    return (
      <TimelineClient
        platform={platform}
        movies={moviesRT}
        series={seriesRT}
        platformId={platformId}
      />
    );
  }

  // Fallback: TMDB
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
