export const runtime = 'edge';

import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowLeft, Star, Trophy } from 'lucide-react';
import { fetchBestByGenreAndPlatform, PLATFORM_PROVIDER_ID } from '@/lib/tmdb';
import { PLATFORMS } from '@/lib/mockData';

export const revalidate    = 3600;
export const dynamicParams = true;

const GENEROS: Record<string, { tmdb: string; label: string; emoji: string }> = {
  accion:     { tmdb: 'Acción',           label: 'Acción',         emoji: '💥' },
  comedia:    { tmdb: 'Comedia',          label: 'Comedia',        emoji: '😂' },
  drama:      { tmdb: 'Drama',            label: 'Drama',          emoji: '🎭' },
  terror:     { tmdb: 'Terror',           label: 'Terror',         emoji: '👻' },
  ciencia:    { tmdb: 'Ciencia ficción',  label: 'Ciencia ficción',emoji: '🚀' },
  thriller:   { tmdb: 'Suspense',         label: 'Thriller',       emoji: '🔪' },
  animacion:  { tmdb: 'Animación',        label: 'Animación',      emoji: '🎨' },
  documental: { tmdb: 'Documental',       label: 'Documental',     emoji: '📽️' },
  romance:    { tmdb: 'Romance',          label: 'Romance',        emoji: '❤️' },
  aventura:   { tmdb: 'Aventura',         label: 'Aventura',       emoji: '🗺️' },
  fantasia:   { tmdb: 'Fantasía',         label: 'Fantasía',       emoji: '🧙' },
  crimen:     { tmdb: 'Crimen',           label: 'Crimen',         emoji: '🔫' },
};

interface Props { params: { genero: string; plataforma: string } }

export async function generateStaticParams() {
  const generos    = Object.keys(GENEROS);
  const plataformas = Object.keys(PLATFORM_PROVIDER_ID);
  return generos.flatMap((genero) => plataformas.map((plataforma) => ({ genero, plataforma })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const g = GENEROS[params.genero];
  const p = PLATFORMS[params.plataforma];
  if (!g || !p) return { title: 'DondeVeo' };
  const title = `Mejores películas de ${g.label} en ${p.name} Uruguay`;
  return {
    title: `${title} — DondeVeo`,
    description: `Las ${g.emoji} mejores películas y series de ${g.label} disponibles en ${p.name} en Uruguay. Ordenadas por puntuación.`,
    alternates: { canonical: `https://www.uru2.com/mejores/${params.genero}/${params.plataforma}` },
    openGraph: { title, description: `Top películas de ${g.label} en ${p.name} · Uruguay`, type: 'website' },
  };
}

export default async function MejoresPage({ params }: Props) {
  const g          = GENEROS[params.genero];
  const platform   = PLATFORMS[params.plataforma];
  const providerId = PLATFORM_PROVIDER_ID[params.plataforma];
  if (!g || !platform || !providerId) notFound();

  const [movies, series] = await Promise.all([
    fetchBestByGenreAndPlatform(g.tmdb, providerId, 'movie', 30),
    fetchBestByGenreAndPlatform(g.tmdb, providerId, 'tv',    20),
  ]);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type':    'ItemList',
    name:       `Mejores películas de ${g.label} en ${platform.name} Uruguay`,
    url:        `https://www.uru2.com/mejores/${params.genero}/${params.plataforma}`,
    numberOfItems: movies.length + series.length,
    itemListElement: movies.slice(0, 10).map((m, i) => ({
      '@type': 'ListItem', position: i + 1,
      item: { '@type': 'Movie', name: m.title, image: m.posterPath },
    })),
  };

  return (
    <div className="min-h-screen bg-dv-bg">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Header */}
      <div className="border-b border-white/8 px-4 md:px-8 py-8">
        <Link href="/" className="inline-flex items-center gap-1.5 text-dv-muted hover:text-white text-sm mb-5 transition-colors">
          <ArrowLeft size={14} /> Inicio
        </Link>
        <div className="flex items-center gap-4 flex-wrap">
          <span className="text-5xl">{g.emoji}</span>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Trophy size={16} className="text-yellow-400" />
              <span className="text-yellow-400 text-sm font-bold uppercase tracking-wide">Top clasificación</span>
            </div>
            <h1 className="text-white text-2xl md:text-3xl font-black">
              Mejores de <span className="text-dv-accent">{g.label}</span> en{' '}
              <span style={{ color: platform.color }}>{platform.name}</span>
            </h1>
            <p className="text-dv-muted text-sm mt-1">
              {movies.length + series.length} títulos ordenados por puntuación · Uruguay
            </p>
          </div>
        </div>

        {/* Navegación rápida por género */}
        <div className="flex flex-wrap gap-2 mt-5">
          {Object.entries(GENEROS).map(([key, val]) => (
            <Link key={key} href={`/mejores/${key}/${params.plataforma}`}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                key === params.genero
                  ? 'text-[#111]'
                  : 'bg-white/8 text-white/50 hover:text-white hover:bg-white/15'
              }`}
              style={key === params.genero ? { backgroundColor: platform.color } : {}}>
              {val.emoji} {val.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* Películas */}
        {movies.length > 0 && (
          <section className="mb-10">
            <h2 className="text-white text-xl font-bold mb-5">🎬 Películas</h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
              {movies.map((movie, i) => (
                <Link key={movie.id}
                  href={`/pelicula/${movie.type === 'series' ? 'tv' : 'movie'}/${movie.id}`}
                  className="group">
                  <div className="relative aspect-[2/3] rounded-lg overflow-hidden mb-1.5 bg-white/5">
                    <Image src={movie.posterPath} alt={movie.title} fill
                      className="object-cover group-hover:scale-105 transition-transform" unoptimized />
                    {/* Rank badge */}
                    <div className="absolute top-1 left-1 w-5 h-5 rounded-full bg-black/80 flex items-center justify-center">
                      <span className="text-[9px] font-black text-white">{i + 1}</span>
                    </div>
                    {movie.voteAverage > 0 && (
                      <div className="absolute bottom-1 left-1 flex items-center gap-0.5 bg-black/70 px-1 py-0.5 rounded">
                        <Star size={8} className="text-yellow-400 fill-yellow-400" />
                        <span className="text-yellow-400 text-[9px] font-bold">{movie.voteAverage.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                  <p className="text-white/70 text-[11px] line-clamp-2 group-hover:text-dv-accent transition-colors">{movie.title}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Series */}
        {series.length > 0 && (
          <section>
            <h2 className="text-white text-xl font-bold mb-5">📺 Series</h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
              {series.map((movie, i) => (
                <Link key={movie.id}
                  href={`/pelicula/${movie.type === 'series' ? 'tv' : 'movie'}/${movie.id}`}
                  className="group">
                  <div className="relative aspect-[2/3] rounded-lg overflow-hidden mb-1.5 bg-white/5">
                    <Image src={movie.posterPath} alt={movie.title} fill
                      className="object-cover group-hover:scale-105 transition-transform" unoptimized />
                    <div className="absolute top-1 left-1 w-5 h-5 rounded-full bg-black/80 flex items-center justify-center">
                      <span className="text-[9px] font-black text-white">{i + 1}</span>
                    </div>
                    {movie.voteAverage > 0 && (
                      <div className="absolute bottom-1 left-1 flex items-center gap-0.5 bg-black/70 px-1 py-0.5 rounded">
                        <Star size={8} className="text-yellow-400 fill-yellow-400" />
                        <span className="text-yellow-400 text-[9px] font-bold">{movie.voteAverage.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                  <p className="text-white/70 text-[11px] line-clamp-2 group-hover:text-dv-accent transition-colors">{movie.title}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {movies.length === 0 && series.length === 0 && (
          <div className="text-center py-24">
            <p className="text-5xl mb-4">{g.emoji}</p>
            <p className="text-white/60">No encontramos {g.label} en {platform.name} por ahora.</p>
          </div>
        )}
      </div>
    </div>
  );
}
