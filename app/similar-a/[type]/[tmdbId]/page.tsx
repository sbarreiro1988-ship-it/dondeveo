import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowLeft, Film, Star } from 'lucide-react';
import { fetchTitleDetail, fetchSimilar } from '../../../../lib/tmdb';
import type { Movie } from '../../../../types';

export const revalidate = 86400; // 24 horas

const BASE = 'https://www.uru2.com';

interface Props {
  params: { type: string; tmdbId: string };
}

function validateType(type: string): 'movie' | 'tv' {
  return type === 'tv' ? 'tv' : 'movie';
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const type = validateType(params.type);
  const id   = parseInt(params.tmdbId, 10);
  if (isNaN(id)) return { robots: { index: false } };

  const title = await fetchTitleDetail(id, type);
  if (!title) return { robots: { index: false } };

  const typeLabel = type === 'tv' ? 'serie' : 'película';
  const t = `Si te gustó ${title.title} — ${typeLabel === 'serie' ? 'Series' : 'Películas'} similares en Uruguay | DondeVeo`;
  const d = `Recomendaciones similares a ${title.title}: las mejores ${typeLabel === 'serie' ? 'series' : 'películas'} del mismo estilo disponibles en streaming en Uruguay.`;
  const url = `${BASE}/similar-a/${type}/${id}`;

  return {
    title: t,
    description: d,
    alternates: { canonical: url },
    openGraph: {
      title: t, description: d, url, type: 'website', locale: 'es_UY', siteName: 'DondeVeo Uruguay',
      ...(title.posterPath ? { images: [{ url: title.posterPath, width: 500, height: 750 }] } : {}),
    },
  };
}

function SimilarCard({ movie }: { movie: Movie }) {
  const mtype = movie.type === 'series' ? 'tv' : 'movie';
  const id    = movie.tmdbId ?? movie.id;

  return (
    <Link href={`/pelicula/${mtype}/${id}`} className="group flex flex-col">
      <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-white/5 mb-2">
        {movie.posterPath ? (
          <Image
            src={movie.posterPath}
            alt={movie.title}
            fill
            sizes="(max-width:640px) 33vw, (max-width:768px) 25vw, 16vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Film size={28} className="text-white/20" />
          </div>
        )}
        {movie.voteAverage > 0 && (
          <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/70 text-yellow-400 text-xs px-1.5 py-0.5 rounded-full">
            <Star size={9} fill="currentColor" />
            {movie.voteAverage.toFixed(1)}
          </div>
        )}
        {movie.platforms.length > 0 && (
          <div className="absolute top-2 right-2 bg-black/70 text-white text-[9px] px-1.5 py-0.5 rounded font-bold">
            {movie.platforms[0]?.name}
          </div>
        )}
      </div>
      <p className="text-white/90 text-xs font-semibold leading-tight line-clamp-2 group-hover:text-dv-accent transition-colors">
        {movie.title}
      </p>
      {movie.genres.length > 0 && (
        <p className="text-white/35 text-[11px] mt-0.5 line-clamp-1">{movie.genres[0]}</p>
      )}
    </Link>
  );
}

export default async function SimilarPage({ params }: Props) {
  const type = validateType(params.type);
  const id   = parseInt(params.tmdbId, 10);
  if (isNaN(id)) notFound();

  const [original, similares] = await Promise.all([
    fetchTitleDetail(id, type),
    fetchSimilar(id, type),
  ]);

  if (!original) notFound();

  const typePlural = type === 'tv' ? 'series' : 'películas';

  return (
    <div className="min-h-screen bg-dv-bg pt-20">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-10">

        <Link
          href={`/pelicula/${type}/${id}`}
          className="inline-flex items-center gap-1.5 text-white/40 hover:text-white text-sm mb-8 transition-colors"
        >
          <ArrowLeft size={14} /> Volver a {original.title}
        </Link>

        {/* Header con poster de la original */}
        <div className="flex gap-5 mb-10">
          {original.posterPath && (
            <div className="relative w-24 h-36 flex-shrink-0 rounded-xl overflow-hidden shadow-lg">
              <Image src={original.posterPath} alt={original.title} fill className="object-cover" />
            </div>
          )}
          <div className="flex-1 min-w-0 py-1">
            <p className="text-white/40 text-sm mb-1">Si te gustó esta {type === 'tv' ? 'serie' : 'película'}…</p>
            <h1 className="text-white text-2xl md:text-3xl font-black mb-2 leading-tight">
              {typePlural.charAt(0).toUpperCase() + typePlural.slice(1)} similares a{' '}
              <span className="text-dv-accent">{original.title}</span>
            </h1>
            {original.genres.length > 0 && (
              <p className="text-white/40 text-sm">{original.genres.join(' · ')}</p>
            )}
            {original.overview && (
              <p className="text-white/45 text-sm mt-2 line-clamp-2 leading-relaxed">{original.overview}</p>
            )}
          </div>
        </div>

        {/* Grid de recomendaciones */}
        {similares.length > 0 ? (
          <>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-6 bg-dv-accent rounded-full" />
              <h2 className="text-white text-lg font-black">
                {similares.length} {typePlural} recomendadas
              </h2>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 md:gap-4">
              {similares.map((m) => (
                <SimilarCard key={m.id} movie={m} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20 text-white/30">
            <Film size={48} className="mx-auto mb-4 opacity-30" />
            <p>No encontramos recomendaciones similares por ahora.</p>
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 bg-dv-accent/8 border border-dv-accent/20 rounded-2xl p-6 text-center">
          <h2 className="text-white text-lg font-bold mb-2">¿Buscás algo específico?</h2>
          <p className="text-white/50 text-sm mb-4">
            Usá el buscador de DondeVeo para encontrar cualquier película o serie en Uruguay.
          </p>
          <Link href="/" className="inline-block bg-dv-accent text-[#111] font-bold px-6 py-2.5 rounded-xl hover:opacity-90 transition-opacity">
            Ir al buscador →
          </Link>
        </div>

      </div>
    </div>
  );
}
