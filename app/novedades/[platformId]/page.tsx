import { notFound } from 'next/navigation';
import { PLATFORMS } from '@/lib/mockData';
import { fetchNewOnPlatform, fetchUniversalPlusContent, PLATFORM_PROVIDER_ID } from '@/lib/tmdb';
import TimelineClient from './TimelineClient';

// force-dynamic: la página se renderiza en el servidor en cada visita.
// Esto garantiza que la fecha de hoy y los datos de TMDB sean siempre frescos.
// Sin esto, el ISR puede quedar congelado con la fecha del último deploy.
export const dynamic = 'force-dynamic';

interface Props {
  params: { platformId: string };
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
