export interface StreamingRemoval {
  id: string;
  title: string;
  type: 'movie' | 'show';
  year: number;
  posterUrl?: string;
  backdropUrl?: string;
  imdbRating?: number;
  streamingPlatform: string;
  removeDate: string;
  daysLeft: number;
}

const PLATFORM_LABELS: Record<string, string> = {
  netflix: 'Netflix',
  prime: 'Prime Video',
  disney: 'Disney+',
  hbo: 'Max',
  apple: 'Apple TV+',
  paramount: 'Paramount+',
};

function getPlatformLabel(catalog: string): string {
  const key = catalog.toLowerCase().split('/')[0];
  return PLATFORM_LABELS[key] ?? catalog;
}

function calcDaysLeft(timestamp: number): number {
  const now = Date.now();
  const diff = timestamp * 1000 - now;
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
}

function formatRemoveDate(timestamp: number): string {
  try {
    return new Date(timestamp * 1000).toLocaleDateString('es-UY', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return '';
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseItem(item: any): StreamingRemoval | null {
  try {
    const show = item.show ?? item.movie ?? item;
    const title = show.title ?? show.name ?? '';
    if (!title) return null;

    // Buscar la primera fecha de remoción disponible
    let removeTimestamp = 0;
    let platformName = '';

    const streamingInfo = show.streamingInfo ?? {};
    for (const [_country, services] of Object.entries(streamingInfo)) {
      if (!Array.isArray(services)) continue;
      for (const svc of services) {
        if (svc.leaving && svc.leaving > 0) {
          if (removeTimestamp === 0 || svc.leaving < removeTimestamp) {
            removeTimestamp = svc.leaving;
            platformName = getPlatformLabel(svc.service ?? svc.streamingType ?? '');
          }
        }
      }
    }

    // Fallback: usar el campo leaving del propio item si existe
    if (removeTimestamp === 0 && item.leaving) {
      removeTimestamp = item.leaving;
    }
    if (!platformName && item.service) {
      platformName = getPlatformLabel(item.service);
    }

    if (removeTimestamp === 0) return null;

    const daysLeft = calcDaysLeft(removeTimestamp);
    if (daysLeft > 30) return null;

    const year =
      show.releaseYear ?? show.firstAirYear ?? show.year ??
      (show.releaseDate ? new Date(show.releaseDate).getFullYear() : 0);

    const posterUrl =
      show.imageSet?.verticalPoster?.w480 ??
      show.imageSet?.verticalPoster?.w360 ??
      show.posterPath ??
      undefined;

    const backdropUrl =
      show.imageSet?.horizontalPoster?.w1440 ??
      show.imageSet?.horizontalPoster?.w1080 ??
      show.backdropPath ??
      undefined;

    const imdbRating =
      show.rating?.imdb ? parseFloat(show.rating.imdb) : undefined;

    return {
      id: String(show.id ?? show.imdbId ?? Math.random()),
      title,
      type: (show.showType ?? show.type) === 'series' ? 'show' : 'movie',
      year: Number(year) || 0,
      posterUrl,
      backdropUrl,
      imdbRating,
      streamingPlatform: platformName || 'Streaming',
      removeDate: formatRemoveDate(removeTimestamp),
      daysLeft,
    };
  } catch {
    return null;
  }
}

export async function fetchLeavingSoon(): Promise<StreamingRemoval[]> {
  try {
    const now = Math.floor(Date.now() / 1000);
    const in30Days = now + 30 * 24 * 60 * 60;

    const params = new URLSearchParams({
      country: 'uy',
      item_type: 'movie',
      change_type: 'removed',
      output_language: 'es',
      catalogs: 'netflix,prime,disney,hbo,apple,paramount',
      from: String(now),
      to: String(in30Days),
    });

    const res = await fetch(
      `https://streaming-availability.p.rapidapi.com/changes?${params}`,
      {
        headers: {
          'X-RapidAPI-Key': '32b7242d44mshdb23d6dff38ae6p16eaeejsn2cc27c87b10d',
          'X-RapidAPI-Host': 'streaming-availability.p.rapidapi.com',
        },
        // Revalidar cada 24h para no quemar la cuota de RapidAPI
        next: { revalidate: 86400 },
        signal: AbortSignal.timeout(8000),
      }
    );

    if (!res.ok) return [];

    const data = await res.json();

    // La API puede devolver { changes: [...] } o directamente un array
    const rawItems: unknown[] = Array.isArray(data)
      ? data
      : Array.isArray(data?.changes)
      ? data.changes
      : Array.isArray(data?.results)
      ? data.results
      : [];

    const items: StreamingRemoval[] = rawItems
      .map(parseItem)
      .filter((x): x is StreamingRemoval => x !== null);

    // Deduplicar por id, ordenar por daysLeft ASC
    const seen = new Set<string>();
    const unique = items.filter((i) => {
      if (seen.has(i.id)) return false;
      seen.add(i.id);
      return true;
    });

    unique.sort((a, b) => a.daysLeft - b.daysLeft);
    return unique;
  } catch {
    // Nunca romper la home por esta API
    return [];
  }
}
