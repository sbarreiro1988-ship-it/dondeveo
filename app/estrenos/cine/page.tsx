import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Film, Star } from 'lucide-react';
import { fetchNowPlaying, fetchUpcoming } from '../../../lib/tmdb';
import type { Movie } from '../../../types';

export const dynamic = 'force-dynamic'; // siempre server-side con el .env.local del servidor

const BASE = 'https://www.uru2.com';

export const metadata: Metadata = {
  title: 'Cine en Uruguay — Cartelera y Próximos Estrenos | DondeVeo',
  description: 'Películas en cartelera en los cines de Uruguay hoy y próximos estrenos. Actualizamos diariamente con la cartelera de la región.',
  alternates: { canonical: `${BASE}/estrenos/cine` },
  openGraph: {
    title: 'Cine en Uruguay — Cartelera y Próximos Estrenos',
    description: 'Cartelera actual y próximos estrenos en los cines de Uruguay.',
    url: `${BASE}/estrenos/cine`,
    type: 'website',
    locale: 'es_UY',
    siteName: 'DondeVeo Uruguay',
  },
};

function MovieCard({ movie }: { movie: Movie }) {
  const type = movie.type === 'series' ? 'tv' : 'movie';
  const id   = movie.tmdbId ?? movie.id;
  const date = movie.releaseDate
    ? new Date(movie.releaseDate + 'T12:00:00').toLocaleDateString('es-UY', {
        day: 'numeric', month: 'short', year: 'numeric',
      })
    : null;

  return (
    <Link href={`/pelicula/${type}/${id}`} className="group flex flex-col">
      <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-white/5 mb-2">
        {movie.posterPath ? (
          <Image
            src={movie.posterPath}
            alt={movie.title}
            fill
            sizes="(max-width:640px) 33vw, (max-width:768px) 25vw, 14vw"
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
      </div>
      <p className="text-white/90 text-xs font-semibold leading-tight line-clamp-2 group-hover:text-dv-accent transition-colors">
        {movie.title}
      </p>
      {date && (
        <p className="text-white/35 text-[11px] mt-0.5">{date}</p>
      )}
    </Link>
  );
}

export default async function CinePage() {
  const [nowPlaying, upcoming] = await Promise.all([
    fetchNowPlaying(),
    fetchUpcoming(),
  ]);

  const upcomingMovies = upcoming.filter((m) => m.type !== 'series');

  return (
    <div className="min-h-screen bg-dv-bg pt-20">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-10">

        <Link
          href="/estrenos"
          className="inline-flex items-center gap-1.5 text-white/40 hover:text-white text-sm mb-8 transition-colors"
        >
          <ArrowLeft size={14} /> Estrenos
        </Link>

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-4xl">🎬</span>
            <h1 className="text-white text-3xl md:text-4xl font-black">
              Cine en Uruguay
            </h1>
          </div>
          <p className="text-white/55 text-lg">
            Cartelera actual y próximos estrenos en los cines de Uruguay.
            Se actualiza automáticamente cada 12 horas.
          </p>
        </div>

        {/* En cartelera */}
        {nowPlaying.length > 0 && (
          <section className="mb-14">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-6 bg-green-400 rounded-full" />
              <h2 className="text-white text-xl font-black">En cartelera ahora</h2>
              <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full font-bold tracking-wide">
                DISPONIBLES HOY
              </span>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-3 md:gap-4">
              {nowPlaying.map((m) => (
                <MovieCard key={m.id} movie={m} />
              ))}
            </div>
          </section>
        )}

        {/* Próximos estrenos */}
        {upcomingMovies.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-6 bg-purple-400 rounded-full" />
              <h2 className="text-white text-xl font-black">Próximos estrenos</h2>
              <span className="text-[10px] bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full font-bold tracking-wide">
                MUY PRONTO
              </span>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-3 md:gap-4">
              {upcomingMovies.map((m) => (
                <MovieCard key={m.id} movie={m} />
              ))}
            </div>
          </section>
        )}

        {nowPlaying.length === 0 && upcomingMovies.length === 0 && (
          <div className="text-center py-20 text-white/30">
            <Film size={48} className="mx-auto mb-4 opacity-30" />
            <p>No se pudo cargar la cartelera. Intentá más tarde.</p>
          </div>
        )}

      </div>
    </div>
  );
}
