import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowLeft, Star, Clock, Tv } from 'lucide-react';
import { fetchAllWatchProviders, IMAGE_BASE } from '@/lib/tmdb';

const TMDB_BASE  = 'https://api.themoviedb.org/3';
const TMDB_TOKEN = process.env.TMDB_ACCESS_TOKEN;

export const dynamic       = 'force-dynamic';
export const dynamicParams = true;

interface Props { params: { type: string; tmdbId: string } }

// type param is 'movie' | 'tv' — always explicit, no guessing
function resolveType(t: string): 'movie' | 'tv' {
  return t === 'tv' ? 'tv' : 'movie';
}

async function fetchDetail(id: string, type: 'movie' | 'tv') {
  try {
    const res = await fetch(
      `${TMDB_BASE}/${type}/${id}?language=es-419`,
      { headers: { Authorization: `Bearer ${TMDB_TOKEN}` }, next: { revalidate: 3600 } }
    );
    if (!res.ok) return null;
    const d = await res.json() as {
      id: number; title?: string; name?: string; overview: string;
      poster_path: string | null; backdrop_path: string | null;
      vote_average: number; release_date?: string; first_air_date?: string;
      runtime?: number; number_of_seasons?: number;
      genres?: { name: string }[];
      tagline?: string; status?: string;
    };
    return d.id ? d : null;
  } catch { return null; }
}

async function fetchCast(id: string, type: 'movie' | 'tv') {
  try {
    const res = await fetch(
      `${TMDB_BASE}/${type}/${id}/credits?language=es-419`,
      { headers: { Authorization: `Bearer ${TMDB_TOKEN}` }, next: { revalidate: 86400 } }
    );
    if (!res.ok) return [];
    const data = await res.json() as {
      cast?: { id: number; name: string; character: string; profile_path: string | null }[]
    };
    return (data.cast ?? []).filter((a) => a.profile_path).slice(0, 12).map((a) => ({
      id: a.id, name: a.name, character: a.character,
      profilePath: `${IMAGE_BASE}/w185${a.profile_path}`,
    }));
  } catch { return []; }
}

async function fetchRecs(id: string, type: 'movie' | 'tv') {
  try {
    const res = await fetch(
      `${TMDB_BASE}/${type}/${id}/recommendations?language=es-419`,
      { headers: { Authorization: `Bearer ${TMDB_TOKEN}` }, next: { revalidate: 86400 } }
    );
    if (!res.ok) return [];
    const data = await res.json() as {
      results?: { id: number; title?: string; name?: string; poster_path: string | null; vote_average: number; media_type?: string }[]
    };
    return (data.results ?? []).filter((m) => m.poster_path).slice(0, 12).map((m) => ({
      id: m.id,
      title: m.title ?? m.name ?? '',
      posterPath: `${IMAGE_BASE}/w342${m.poster_path}`,
      voteAverage: Math.round(m.vote_average * 10) / 10,
      // recommendations include media_type for mixed results
      recType: (m.media_type === 'tv' || (!m.title && !!m.name)) ? 'tv' : 'movie',
    }));
  } catch { return []; }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const type   = resolveType(params.type);
  const detail = await fetchDetail(params.tmdbId, type);
  if (!detail) return { title: 'DondeVeo' };
  const title = detail.title ?? detail.name ?? '';
  const year  = (detail.release_date ?? detail.first_air_date ?? '').slice(0, 4);
  return {
    title: `¿Dónde ver ${title} (${year}) en Uruguay? — DondeVeo`,
    description: `Encontrá en qué plataforma ver ${title} en Uruguay. ${detail.overview?.slice(0, 120) ?? ''}`,
    alternates: { canonical: `https://www.uru2.com/pelicula/${params.type}/${params.tmdbId}` },
    openGraph: {
      title,
      description: detail.overview ?? '',
      images: detail.poster_path ? [`${IMAGE_BASE}/w500${detail.poster_path}`] : [],
    },
  };
}

const STATUS_MAP: Record<string, string> = {
  Released: 'Estrenada', 'In Production': 'En producción',
  'Post Production': 'Pos-producción', 'Returning Series': 'En emisión',
  Ended: 'Finalizada', Canceled: 'Cancelada',
};

export default async function PeliculaPage({ params }: Props) {
  const type   = resolveType(params.type);
  const detail = await fetchDetail(params.tmdbId, type);
  if (!detail) notFound();

  const title      = detail.title ?? detail.name ?? '';
  const year       = (detail.release_date ?? detail.first_air_date ?? '').slice(0, 4);
  const backdropUrl = detail.backdrop_path ? `${IMAGE_BASE}/w1280${detail.backdrop_path}` : '/placeholder-backdrop.jpg';
  const posterUrl   = detail.poster_path   ? `${IMAGE_BASE}/w500${detail.poster_path}`   : '/placeholder-poster.jpg';

  // fetchAllWatchProviders ya incluye TMDB + manual overrides internamente
  const [providers, cast, recs] = await Promise.all([
    fetchAllWatchProviders(Number(params.tmdbId), type),
    fetchCast(params.tmdbId, type),
    fetchRecs(params.tmdbId, type),
  ]);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': type === 'tv' ? 'TVSeries' : 'Movie',
    name: title,
    description: detail.overview,
    image: posterUrl,
    datePublished: detail.release_date ?? detail.first_air_date,
    aggregateRating: detail.vote_average > 0 ? {
      '@type': 'AggregateRating', ratingValue: detail.vote_average, bestRating: 10,
    } : undefined,
  };

  return (
    <div className="min-h-screen bg-dv-bg">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <Image src={backdropUrl} alt={title} fill className="object-cover" unoptimized priority />
        <div className="absolute inset-0 bg-gradient-to-t from-dv-bg via-dv-bg/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 px-4 md:px-8 pb-6">
          <Link href="/" className="inline-flex items-center gap-1.5 text-white/60 hover:text-white text-sm mb-4 transition-colors">
            <ArrowLeft size={14} /> Inicio
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-8 -mt-16 relative z-10 pb-16">
        {/* Header */}
        <div className="flex gap-6 mb-8">
          <div className="flex-shrink-0 w-28 md:w-40">
            <Image src={posterUrl} alt={title} width={160} height={240}
              className="rounded-xl shadow-2xl object-cover w-full" unoptimized />
          </div>
          <div className="flex-1 pt-4">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="bg-dv-accent/20 text-dv-accent text-[10px] font-black uppercase px-2 py-0.5 rounded">
                {type === 'tv' ? 'Serie' : 'Película'}
              </span>
              {year && <span className="text-dv-muted text-sm">{year}</span>}
              {detail.status && STATUS_MAP[detail.status] && (
                <span className="bg-white/10 text-white/60 text-[10px] font-semibold px-2 py-0.5 rounded">
                  {STATUS_MAP[detail.status]}
                </span>
              )}
            </div>
            <h1 className="text-white text-2xl md:text-4xl font-black mb-2 leading-tight">{title}</h1>
            {detail.tagline && (
              <p className="text-dv-accent italic text-sm mb-2">"{detail.tagline}"</p>
            )}
            <div className="flex items-center gap-4 flex-wrap">
              {detail.vote_average > 0 && (
                <div className="flex items-center gap-1.5">
                  <Star size={14} className="text-yellow-400 fill-yellow-400" />
                  <span className="text-yellow-400 font-bold">{detail.vote_average.toFixed(1)}</span>
                  <span className="text-dv-muted text-sm">/ 10</span>
                </div>
              )}
              {detail.runtime && (
                <div className="flex items-center gap-1 text-dv-muted text-sm">
                  <Clock size={13} /> {detail.runtime} min
                </div>
              )}
              {detail.number_of_seasons && (
                <div className="flex items-center gap-1 text-dv-muted text-sm">
                  <Tv size={13} /> {detail.number_of_seasons} temp.
                </div>
              )}
            </div>
            {detail.genres && detail.genres.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {detail.genres.map((g) => {
                  const slug = g.name.toLowerCase()
                    .normalize('NFD').replace(/[̀-ͯ]/g, '')
                    .replace('ciencia ficcion', 'ciencia')
                    .replace(/\s+/g, '-');
                  return (
                    <Link key={g.name} href={`/genero/${slug}`}
                      className="text-xs bg-white/8 text-white/60 hover:text-dv-accent px-2.5 py-1 rounded-full transition-colors">
                      {g.name}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Dónde ver */}
        <div className="mb-8">
          <h2 className="text-white text-xl font-black mb-4">
            ¿Dónde ver <span className="text-dv-accent">{title}</span> en Uruguay?
          </h2>
          {providers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {providers.map(({ platform, logoPath }) => (
                <div key={platform.id}
                  className="flex items-center gap-4 p-4 rounded-xl border bg-white/5"
                  style={{ borderColor: platform.bgColor + '40' }}>
                  <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center"
                    style={{ backgroundColor: platform.bgColor }}>
                    {logoPath ? (
                      <Image src={logoPath} alt={platform.name} width={56} height={56}
                        className="object-cover w-full h-full" unoptimized />
                    ) : (
                      <span className="font-black text-sm" style={{ color: platform.textColor }}>
                        {platform.shortName || platform.name.slice(0, 4)}
                      </span>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-bold">{platform.name}</p>
                    <p className="text-dv-muted text-xs">Disponible con suscripción</p>
                  </div>
                  <span className="text-xs bg-dv-accent/20 text-dv-accent px-2 py-1 rounded-full font-semibold">
                    Streaming
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
              <p className="text-white/60">No disponible en streaming en Uruguay actualmente.</p>
              <p className="text-dv-muted text-sm mt-1">Puede estar disponible en cines o próximamente.</p>
            </div>
          )}
        </div>

        {/* Sinopsis */}
        {detail.overview && (
          <div className="mb-8">
            <h2 className="text-white text-lg font-bold mb-3">Sinopsis</h2>
            <p className="text-white/70 leading-relaxed">{detail.overview}</p>
          </div>
        )}

        {/* ¿Por qué verla? — contexto editorial */}
        {detail.genres && detail.genres.length > 0 && (
          <div className="mb-10 bg-white/5 border border-white/10 rounded-xl p-5">
            <h2 className="text-white text-lg font-bold mb-2">
              ¿Por qué ver {title}?
            </h2>
            <p className="text-white/65 text-sm leading-relaxed">
              {type === 'tv'
                ? `${title} es una serie de ${detail.genres.map(g => g.name).join(', ').toLowerCase()} que podés ver en Uruguay en las plataformas indicadas arriba.`
                : `${title} es una película de ${detail.genres.map(g => g.name).join(', ').toLowerCase()} del año ${year}.`
              }
              {detail.vote_average >= 7.5
                ? ` Con una calificación de ${detail.vote_average.toFixed(1)}/10, es una de las producciones mejor valoradas por el público en su género.`
                : detail.vote_average >= 6
                ? ` Su calificación de ${detail.vote_average.toFixed(1)}/10 la posiciona como una opción sólida dentro de su género.`
                : ''
              }
              {providers.length > 0
                ? ` Actualmente disponible en ${providers.map(p => p.platform.name).join(' y ')} en Uruguay.`
                : ' Verificá la disponibilidad en las plataformas de streaming en Uruguay.'
              }
            </p>
            {detail.genres.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="text-white/40 text-xs">Explorar géneros similares:</span>
                {detail.genres.slice(0, 3).map((g) => {
                  const slug = g.name.toLowerCase()
                    .normalize('NFD').replace(/[̀-ͯ]/g, '')
                    .replace('ciencia ficcion', 'ciencia')
                    .replace(/\s+/g, '-');
                  return (
                    <a key={g.name} href={`/genero/${slug}`}
                      className="text-xs text-dv-accent hover:underline">
                      {g.name} →
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Reparto */}
        {cast.length > 0 && (
          <div className="mb-10">
            <h2 className="text-white text-lg font-bold mb-4">⭐ Reparto principal</h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
              {cast.map((actor) => (
                <Link key={actor.id} href={`/actor/${actor.id}`} className="group text-center">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden mx-auto mb-2 bg-white/10 ring-2 ring-white/10 group-hover:ring-dv-accent/60 transition-all">
                    <Image src={actor.profilePath} alt={actor.name} width={80} height={80}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform" unoptimized />
                  </div>
                  <p className="text-white text-xs font-semibold line-clamp-2 group-hover:text-dv-accent transition-colors">{actor.name}</p>
                  {actor.character && (
                    <p className="text-white/40 text-[10px] line-clamp-1 mt-0.5">{actor.character}</p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Recomendaciones */}
        {recs.length > 0 && (
          <div className="mb-10">
            <h2 className="text-white text-lg font-bold mb-4">🎬 También te puede gustar</h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {recs.map((m) => (
                <Link key={m.id} href={`/pelicula/${m.recType}/${m.id}`} className="group">
                  <div className="relative aspect-[2/3] rounded-lg overflow-hidden mb-1.5 bg-white/5">
                    <Image src={m.posterPath} alt={m.title} fill
                      className="object-cover group-hover:scale-105 transition-transform" unoptimized />
                    {m.voteAverage > 0 && (
                      <div className="absolute bottom-1 left-1 flex items-center gap-0.5 bg-black/70 px-1.5 py-0.5 rounded">
                        <Star size={8} className="text-yellow-400 fill-yellow-400" />
                        <span className="text-yellow-400 text-[9px] font-bold">{m.voteAverage.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                  <p className="text-white/70 text-xs line-clamp-2 group-hover:text-dv-accent transition-colors">{m.title}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
