import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowLeft, Star, MapPin, Calendar } from 'lucide-react';
import { fetchPerson, fetchPersonMovies, IMAGE_BASE } from '@/lib/tmdb';

export const dynamic    = 'force-dynamic';
export const dynamicParams = true;

interface Props { params: { id: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const person = await fetchPerson(params.id);
  if (!person) return { title: 'Actor — DondeVeo' };
  return {
    title: `${person.name} — Películas y series en streaming Uruguay`,
    description: `Todas las películas y series de ${person.name} disponibles en streaming en Uruguay. Netflix, Disney+, Max y más.`,
    alternates: { canonical: `https://www.uru2.com/actor/${params.id}` },
    openGraph: {
      title: `${person.name} en streaming Uruguay`,
      description: `Filmografía completa de ${person.name} en plataformas de streaming.`,
      images: person.profile_path ? [`${IMAGE_BASE}/w500${person.profile_path}`] : [],
    },
  };
}

export default async function ActorPage({ params }: Props) {
  const [person, movies] = await Promise.all([
    fetchPerson(params.id),
    fetchPersonMovies(params.id),
  ]);
  if (!person) notFound();

  const profileUrl = person.profile_path ? `${IMAGE_BASE}/w300${person.profile_path}` : null;
  const dept = person.known_for_department === 'Acting' ? 'Actor/Actriz' : person.known_for_department;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: person.name,
    description: person.biography?.slice(0, 200),
    image: profileUrl,
    birthDate: person.birthday,
    birthPlace: person.place_of_birth,
    jobTitle: dept,
  };

  return (
    <div className="min-h-screen bg-dv-bg">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="max-w-5xl mx-auto px-4 md:px-8 py-8">
        <Link href="/" className="inline-flex items-center gap-1.5 text-dv-muted hover:text-white text-sm mb-6 transition-colors">
          <ArrowLeft size={14} /> Inicio
        </Link>

        {/* Header del actor */}
        <div className="flex gap-6 mb-10">
          {profileUrl ? (
            <div className="flex-shrink-0">
              <Image src={profileUrl} alt={person.name} width={160} height={240}
                className="rounded-2xl shadow-2xl object-cover" unoptimized />
            </div>
          ) : (
            <div className="flex-shrink-0 w-40 h-60 bg-white/5 rounded-2xl flex items-center justify-center">
              <span className="text-5xl">🎬</span>
            </div>
          )}

          <div className="flex-1">
            <p className="text-dv-accent text-sm font-bold uppercase tracking-wider mb-1">{dept}</p>
            <h1 className="text-white text-3xl md:text-4xl font-black mb-3">{person.name}</h1>

            <div className="flex flex-wrap gap-4 mb-4 text-sm text-dv-muted">
              {person.birthday && (
                <span className="flex items-center gap-1.5">
                  <Calendar size={13} />
                  {new Date(person.birthday).toLocaleDateString('es-UY', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              )}
              {person.place_of_birth && (
                <span className="flex items-center gap-1.5">
                  <MapPin size={13} /> {person.place_of_birth}
                </span>
              )}
            </div>

            {person.biography && (
              <p className="text-white/60 text-sm leading-relaxed line-clamp-4">
                {person.biography}
              </p>
            )}
          </div>
        </div>

        {/* Filmografía */}
        <h2 className="text-white text-xl font-black mb-5">
          Películas y series de <span className="text-dv-accent">{person.name}</span> en streaming
        </h2>

        {movies.length > 0 ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
            {movies.map((movie) => (
              <Link key={movie.id}
                href={`/donde-ver/${encodeURIComponent(movie.title.toLowerCase().replace(/\s+/g, '-'))}`}
                className="group">
                <div className="relative aspect-[2/3] rounded-lg overflow-hidden mb-1.5 bg-white/5">
                  <Image src={movie.posterPath} alt={movie.title} fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300" unoptimized />
                  {/* Platform badge */}
                  {movie.platforms[0] && (
                    <div className="absolute top-1 right-1 text-[8px] font-black px-1.5 py-0.5 rounded"
                      style={{ backgroundColor: movie.platforms[0].bgColor, color: movie.platforms[0].textColor }}>
                      {movie.platforms[0].shortName}
                    </div>
                  )}
                  {/* Rating */}
                  {movie.voteAverage > 0 && (
                    <div className="absolute bottom-1 left-1 flex items-center gap-0.5 bg-black/70 px-1 py-0.5 rounded">
                      <Star size={8} className="text-yellow-400 fill-yellow-400" />
                      <span className="text-yellow-400 text-[9px] font-bold">{movie.voteAverage.toFixed(1)}</span>
                    </div>
                  )}
                </div>
                <p className="text-white/70 text-[11px] line-clamp-2 group-hover:text-dv-accent transition-colors leading-tight">
                  {movie.title}
                </p>
                {movie.releaseDate && (
                  <p className="text-white/30 text-[10px]">{movie.releaseDate.slice(0, 4)}</p>
                )}
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-5xl mb-4">🎬</p>
            <p className="text-white/60">No encontramos contenido disponible en streaming Uruguay.</p>
          </div>
        )}
      </div>
    </div>
  );
}
