import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowLeft, Star } from 'lucide-react';
import { fetchByGenreName } from '@/lib/tmdb';

export const revalidate   = 3600;
export const dynamicParams = true;

// Géneros soportados con sus nombres en español
const GENEROS: Record<string, { tmdb: string; label: string; emoji: string }> = {
  accion:       { tmdb: 'Acción',      label: 'Acción',        emoji: '💥' },
  comedia:      { tmdb: 'Comedia',     label: 'Comedia',       emoji: '😂' },
  drama:        { tmdb: 'Drama',       label: 'Drama',         emoji: '🎭' },
  terror:       { tmdb: 'Terror',      label: 'Terror',        emoji: '👻' },
  ciencia:      { tmdb: 'Ciencia ficción', label: 'Ciencia ficción', emoji: '🚀' },
  thriller:     { tmdb: 'Suspense',    label: 'Thriller',      emoji: '🔪' },
  animacion:    { tmdb: 'Animación',   label: 'Animación',     emoji: '🎨' },
  documental:   { tmdb: 'Documental',  label: 'Documental',    emoji: '📽️' },
  romance:      { tmdb: 'Romance',     label: 'Romance',       emoji: '❤️' },
  aventura:     { tmdb: 'Aventura',    label: 'Aventura',      emoji: '🗺️' },
  fantasia:     { tmdb: 'Fantasía',    label: 'Fantasía',      emoji: '🧙' },
  crimen:       { tmdb: 'Crimen',      label: 'Crimen',        emoji: '🔫' },
  historia:     { tmdb: 'Historia',    label: 'Historia',      emoji: '📜' },
  musica:       { tmdb: 'Música',      label: 'Música',        emoji: '🎵' },
  familia:      { tmdb: 'Familia',     label: 'Familia',       emoji: '👨‍👩‍👧' },
};

interface Props { params: { genero: string } }

export async function generateStaticParams() {
  return Object.keys(GENEROS).map((genero) => ({ genero }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const g = GENEROS[params.genero];
  if (!g) return { title: 'Género — DondeVeo' };
  return {
    title: `Películas de ${g.label} en streaming Uruguay — DondeVeo`,
    description: `Las mejores películas y series de ${g.label} disponibles en Netflix, Disney+, Max, Prime Video y más plataformas en Uruguay.`,
    alternates: { canonical: `https://www.uru2.com/genero/${params.genero}` },
  };
}

export default async function GeneroPage({ params }: Props) {
  const g = GENEROS[params.genero];
  if (!g) notFound();

  const [movies, series] = await Promise.all([
    fetchByGenreName(g.tmdb, 'movie', 40),
    fetchByGenreName(g.tmdb, 'tv', 20),
  ]);

  const all = [...movies, ...series];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `Películas de ${g.label} en streaming Uruguay`,
    description: `Las mejores películas y series de ${g.label} en plataformas de streaming en Uruguay.`,
    url: `https://www.uru2.com/genero/${params.genero}`,
  };

  return (
    <div className="min-h-screen bg-dv-bg">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Header */}
      <div className="border-b border-white/8 px-4 md:px-8 py-8">
        <Link href="/" className="inline-flex items-center gap-1.5 text-dv-muted hover:text-white text-sm mb-5 transition-colors">
          <ArrowLeft size={14} /> Inicio
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-4xl">{g.emoji}</span>
          <div>
            <h1 className="text-white text-3xl font-black">{g.label}</h1>
            <p className="text-dv-muted text-sm mt-0.5">
              {all.length} títulos disponibles en streaming Uruguay
            </p>
          </div>
        </div>
      </div>

      {/* Géneros navegación */}
      <div className="px-4 md:px-8 py-4 flex flex-wrap gap-2 border-b border-white/5">
        {Object.entries(GENEROS).map(([key, val]) => (
          <Link key={key} href={`/genero/${key}`}
            className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-all ${
              key === params.genero
                ? 'bg-dv-accent text-[#111]'
                : 'bg-white/8 text-white/60 hover:text-white hover:bg-white/15'
            }`}>
            {val.emoji} {val.label}
          </Link>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* Películas */}
        {movies.length > 0 && (
          <section className="mb-10">
            <h2 className="text-white text-xl font-bold mb-5">
              🎬 Películas de {g.label}
            </h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
              {movies.map((movie) => (
                <Link key={movie.id}
                  href={`/donde-ver/${encodeURIComponent(movie.title.toLowerCase().replace(/\s+/g, '-'))}`}
                  className="group">
                  <div className="relative aspect-[2/3] rounded-lg overflow-hidden mb-1.5 bg-white/5">
                    <Image src={movie.posterPath} alt={movie.title} fill
                      className="object-cover group-hover:scale-105 transition-transform" unoptimized />
                    {movie.platforms[0] && (
                      <div className="absolute top-1 right-1 text-[8px] font-black px-1.5 py-0.5 rounded"
                        style={{ backgroundColor: movie.platforms[0].bgColor, color: movie.platforms[0].textColor }}>
                        {movie.platforms[0].shortName}
                      </div>
                    )}
                    {movie.voteAverage > 0 && (
                      <div className="absolute bottom-1 left-1 flex items-center gap-0.5 bg-black/70 px-1 py-0.5 rounded">
                        <Star size={8} className="text-yellow-400 fill-yellow-400" />
                        <span className="text-yellow-400 text-[9px] font-bold">{movie.voteAverage.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                  <p className="text-white/70 text-[11px] line-clamp-2 group-hover:text-dv-accent transition-colors">
                    {movie.title}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Series */}
        {series.length > 0 && (
          <section>
            <h2 className="text-white text-xl font-bold mb-5">
              📺 Series de {g.label}
            </h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
              {series.map((movie) => (
                <Link key={movie.id}
                  href={`/donde-ver/${encodeURIComponent(movie.title.toLowerCase().replace(/\s+/g, '-'))}`}
                  className="group">
                  <div className="relative aspect-[2/3] rounded-lg overflow-hidden mb-1.5 bg-white/5">
                    <Image src={movie.posterPath} alt={movie.title} fill
                      className="object-cover group-hover:scale-105 transition-transform" unoptimized />
                    {movie.platforms[0] && (
                      <div className="absolute top-1 right-1 text-[8px] font-black px-1.5 py-0.5 rounded"
                        style={{ backgroundColor: movie.platforms[0].bgColor, color: movie.platforms[0].textColor }}>
                        {movie.platforms[0].shortName}
                      </div>
                    )}
                  </div>
                  <p className="text-white/70 text-[11px] line-clamp-2 group-hover:text-dv-accent transition-colors">
                    {movie.title}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
