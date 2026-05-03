import type { Metadata } from 'next';
import { PLATFORMS } from '@/lib/mockData';

const BASE = 'https://www.uru2.com';

export function generateNovedadesMetadata(platformId: string): Metadata {
  const platform = PLATFORMS[platformId];
  if (!platform) return {};

  const title       = `Lo nuevo en ${platform.name} Uruguay — Estrenos y novedades`;
  const description = `Descubrí los últimos estrenos y novedades de ${platform.name} en Uruguay. Películas y series agregadas recientemente, actualizadas día a día.`;
  const url         = `${BASE}/novedades/${platformId}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: 'website',
      locale: 'es_UY',
      siteName: 'DondeVeo Uruguay',
    },
    twitter: { card: 'summary', title, description },
  };
}
