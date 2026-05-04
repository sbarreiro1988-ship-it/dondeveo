import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowLeft, Star } from 'lucide-react';
import { searchByTitle, fetchAllWatchProviders, IMAGE_BASE } from '@/lib/tmdb';

const TMDB_BASE  = 'https://api.themoviedb.org/3';
const TMDB_TOKEN = process.env.TMDB_ACCESS_TOKEN;

async function fetchPageCast(id: number, type: string) {
  try {
    const res = await fetch(
      `${TMDB_BASE}/${type}/${id}/credits?language=es-419`,
      { headers: { Authorization: `Bearer ${TMDB_TOKEN}` }, next: { revalidate: 86400 } }
    );
    if (!res.ok) return [];
    const data = await res.json() as {
      cast?: { id: number; name: string; character: string; profile_path: string | null; order: number }[]
    };
    return (data.cast ?? [])
      .filter((a) => a.profile_path)
      .slice(0, 12)
      .map((a) => ({
        id: a.id, name: a.name, character: a.character,
        profilePath: `${IMAGE_BASE}/w185${a.profile_path}`,
      }));
  } catch { return []; }
}

async function fetchPageSimilar(id: number, type: string) {
  try {
    const res = await fetch(
      `${TMDB_BASE}/${type}/${id}/similar?language=es-419`,
      { headers: { Authorization: `Bearer ${TMDB_TOKEN}` }, next: { revalidate: 86400 } }
    );
    if (!res.ok) return [];
    const data = await res.json() as {
      results?: { id: number; title?: string; name?: string; poster_path: string | null; vote_average: number }[]
    };
    return (data.results ?? [])
      .filter((m) => m.poster_path)
      .slice(0, 12)
      .map((m) => ({
        id: m.id,
        title: m.title ?? m.name ?? '',
        posterPath: `${IMAGE_BASE}/w342${m.poster_path}`,
        voteAverage: Math.round(m.vote_average * 10) / 10,
        slug: (m.title ?? m.name ?? '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
      }));
  } catch { return []; }
}

export const dynamic    = 'force-dynamic';
export const dynamicParams = true;

interface Props { params: { slug: string } }

function slugToTitle(slug: string) {
  return decodeURIComponent(slug).replace(/-/g, ' ');
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const title = slugToTitle(params.slug);
  const cap   = title.split(' ').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  return {
    title: `¿Dónde ver ${cap} en Uruguay? — DondeVeo`,
    description: `Encontrá en qué plataforma de streaming podés ver ${cap} en Uruguay. Netflix, Disney+, Max, Prime Video y más.`,
    alternates: { canonical: `https://www.uru2.com/donde-ver/${params.slug}` },
  };
}

export default async function DondeVerPage({ params }: Props) {
  const query   = slugToTitle(params.slug);
  const results = await searchByTitle(query);
  if (!results.length) notFound();

  const main = results[0];
  const type = main.type === 'series' ? 'tv' : 'movie';
  const tmdbId = main.tmdbId ?? main.id;

  const [providers, cast, similar] = await Promise.all([
    fetchAllWatchProviders(tmdbId, type),
    fetchPageCast(tmdbId, type),
    fetchPageSimilar(tmdbId, type),
  ]);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': main.type === 'series' ? 'TVSeries' : 'Movie',
    name: main.title,
    description: main.overview,
    image: main.posterPath,
    datePublished: main.releaseDate,
    aggregateRating: main.voteAverage > 0 ? {
      '@type': 'AggregateRating',
      ratingValue: main.voteAverage,
      bestRating: 10,
    } : undefined,
  };

  return (
    <div className="min-h-screen bg-dv-bg">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero con backdrop */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <Image src={main.backdropPath} alt={main.title} fill className="object-cover" unoptimized priority />
        <div className="absolute inset-0 bg-gradient-to-t from-dv-bg via-dv-bg/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 px-4 md:px-8 pb-6">
          <Link href="/" className="inline-flex items-center gap-1.5 text-white/60 hover:text-white text-sm mb-4 transition-colors">
            <ArrowLeft size={14} /> Inicio
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-8 -mt-16 relative z-10">
        <div className="flex gap-6">
          {/* Poster */}
          <div className="flex-shrink-0 w-28 md:w-40">
            <Image src={main.posterPath} alt={main.title} width={160} height={240}
              className="rounded-xl shadow-2xl object-cover w-full" unoptimized />
          </div>

          {/* Info */}
          <div className="flex-1 pt-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-dv-accent/20 text-dv-accent text-[10px] font-black uppercase px-2 py-0.5 rounded">
                {main.type === 'series' ? 'Serie' : 'Película'}
              </span>
              {main.releaseDate && (
                <span className="text-dv-muted text-sm">{main.releaseDate.slice(0, 4)}</span>
              )}
            </div>
            <h1 className="text-white text-2xl md:text-4xl font-black mb-2">{main.title}</h1>
            {main.voteAverage > 0 && (
              <div className="flex items-center gap-1.5 mb-3">
                <Star size={14} className="text-yellow-400 fill-yellow-400" />
                <span className="text-yellow-400 font-bold">{main.voteAverage.toFixed(1)}</span>
                <span className="text-dv-muted text-sm">/ 10</span>
              </div>
            )}
            {main.genres.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-4">
                {main.genres.map((g) => (
                  <Link key={g} href={`/genero/${g.toLowerCase()}`}
                    className="text-xs bg-white/8 text-white/60 hover:text-dv-accent px-2.5 py-1 rounded-full transition-colors">
                    {g}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ¿Dónde ver? */}
        <div className="mt-8 mb-6">
          <h2 className="text-white text-xl font-black mb-4">
            ¿Dónde ver <span className="text-dv-accent">{main.title}</span> en Uruguay?
          </h2>

          {providers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {providers.map(({ platform, logoPath }) => (
                <div key={platform.id}
                  className="flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-white/5"
                  style={{ borderColor: platform.bgColor + '40' }}>
                  <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-black flex items-center justify-center"
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
              <p className="text-dv-muted text-sm mt-1">Puede estar disponible para alquilar o comprar.</p>
            </div>
          )}
        </div>

        {/* Sinopsis */}
        {main.overview && (
          <div className="mb-8">
            <h2 className="text-white text-lg font-bold mb-3">Sinopsis</h2>
            <p className="text-white/70 leading-relaxed">{main.overview}</p>
          </div>
        )}

        {/* Reparto principal */}
        {cast.length > 0 && (
          <div className="mb-10">
            <h2 className="text-white text-lg font-bold mb-4">⭐ Reparto principal</h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
              {cast.map((actor) => (
                <Link key={actor.id} href={`/actor/${actor.id}`} className="group text-center">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden mx-auto mb-2 bg-white/10
                    ring-2 ring-white/10 group-hover:ring-dv-accent/60 transition-all">
                    <Image src={actor.profilePath} alt={actor.name} width={80} height={80}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform" unoptimized />
                  </div>
                  <p className="text-white text-xs font-semibold line-clamp-2 group-hover:text-dv-accent transition-colors">
                    {actor.name}
                  </p>
                  {actor.character && (
                    <p className="text-white/40 text-[10px] line-clamp-1 mt-0.5">{actor.character}</p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Similares */}
        {similar.length > 0 && (
          <div className="mb-10">
            <h2 className="text-white text-lg font-bold mb-4">🎬 También te puede gustar</h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {similar.map((m) => (
                <Link key={m.id} href={`/donde-ver/${m.slug}`} className="group">
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
                  <p className="text-white/70 text-xs line-clamp-2 group-hover:text-dv-accent transition-colors">
                    {m.title}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
