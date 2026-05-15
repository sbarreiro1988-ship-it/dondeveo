export const runtime = 'edge';

import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowLeft, Star } from 'lucide-react';
import { fetchByGenreName } from '@/lib/tmdb';

export const revalidate   = 3600;
export const dynamicParams = true;

// Géneros soportados con sus nombres en español
const GENEROS: Record<string, { tmdb: string; label: string; emoji: string; desc: string }> = {
  accion:       { tmdb: 'Acción',      label: 'Acción',        emoji: '💥', desc: 'Las mejores películas y series de acción disponibles en streaming en Uruguay. Desde thrillers de espionaje hasta películas de superhéroes, encontrá adrenalina pura en Netflix, Prime Video, Disney+ y más plataformas.' },
  comedia:      { tmdb: 'Comedia',     label: 'Comedia',       emoji: '😂', desc: 'Las comedias más divertidas que podés ver hoy en streaming en Uruguay. Desde comedias románticas hasta humor negro, encontrá la carcajada perfecta en las principales plataformas.' },
  drama:        { tmdb: 'Drama',       label: 'Drama',         emoji: '🎭', desc: 'El drama es el corazón del cine y las series. Encontrá los mejores dramas disponibles en Uruguay: historias humanas profundas, personajes complejos y narrativas que te dejarán pensando días.' },
  terror:       { tmdb: 'Terror',      label: 'Terror',        emoji: '👻', desc: 'Las mejores películas de terror y suspenso disponibles en streaming en Uruguay. Desde el horror psicológico hasta el gore más intenso, todo lo que necesitás para pasar una noche de miedo.' },
  ciencia:      { tmdb: 'Ciencia ficción', label: 'Ciencia ficción', emoji: '🚀', desc: 'Viajes al espacio, inteligencia artificial, viajes en el tiempo y futuros alternativos. Las mejores películas y series de ciencia ficción disponibles en plataformas de streaming en Uruguay.' },
  thriller:     { tmdb: 'Suspense',    label: 'Thriller',      emoji: '🔪', desc: 'Tensión al máximo. Los mejores thrillers disponibles en streaming en Uruguay: conspiraciones, crímenes sin resolver, giros inesperados y finales que no verás venir.' },
  animacion:    { tmdb: 'Animación',   label: 'Animación',     emoji: '🎨', desc: 'Animación para todas las edades. Desde los clásicos de Disney hasta anime japonés, encontrá las mejores películas y series animadas disponibles en Uruguay en Netflix, Disney+ y Crunchyroll.' },
  documental:   { tmdb: 'Documental',  label: 'Documental',    emoji: '📽️', desc: 'Los mejores documentales disponibles en streaming en Uruguay. Naturaleza, crímenes reales, historia, ciencia y cultura: expande tu mente con las producciones documentales más aclamadas del mundo.' },
  romance:      { tmdb: 'Romance',     label: 'Romance',       emoji: '❤️', desc: 'Las mejores películas y series románticas en streaming Uruguay. Historias de amor, comedias románticas y dramas del corazón disponibles en Netflix, Prime Video, Disney+ y más plataformas.' },
  aventura:     { tmdb: 'Aventura',    label: 'Aventura',      emoji: '🗺️', desc: 'Exploraciones, mundos fantásticos y misiones épicas. Las mejores películas y series de aventura disponibles en streaming en Uruguay para toda la familia.' },
  fantasia:     { tmdb: 'Fantasía',    label: 'Fantasía',      emoji: '🧙', desc: 'Mundos mágicos, criaturas míticas y héroes legendarios. Las mejores películas y series de fantasía disponibles en streaming en Uruguay, desde épica medieval hasta magia contemporánea.' },
  crimen:       { tmdb: 'Crimen',      label: 'Crimen',        emoji: '🔫', desc: 'Policiales, mafias, detectives y crímenes sin resolver. Las mejores películas y series de crimen disponibles en streaming en Uruguay, desde clásicos del noir hasta series policiales modernas.' },
  historia:     { tmdb: 'Historia',    label: 'Historia',      emoji: '📜', desc: 'El pasado cobra vida en pantalla. Las mejores películas y series históricas disponibles en streaming en Uruguay: guerras, imperios, figuras legendarias y momentos que cambiaron el mundo.' },
  musica:       { tmdb: 'Música',      label: 'Música',        emoji: '🎵', desc: 'Biopics musicales, conciertos, documentales y musicales. Las mejores películas y series sobre música disponibles en streaming en Uruguay.' },
  familia:      { tmdb: 'Familia',     label: 'Familia',       emoji: '👨‍👩‍👧', desc: 'Entretenimiento para toda la familia disponible en streaming en Uruguay. Películas y series que pueden disfrutar chicos y grandes juntos en Netflix, Disney+ y más plataformas.' },
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
    fetchByGenreName(g.tmdb, 'movie', 80),
    fetchByGenreName(g.tmdb, 'tv', 40),
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
        <div className="flex items-center gap-3 mb-4">
          <span className="text-4xl">{g.emoji}</span>
          <div>
            <h1 className="text-white text-3xl font-black">{g.label} en streaming Uruguay</h1>
            <p className="text-dv-muted text-sm mt-0.5">
              {all.length} títulos disponibles en plataformas de streaming en Uruguay
            </p>
          </div>
        </div>
        <p className="text-white/60 text-sm leading-relaxed max-w-3xl">{g.desc}</p>
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
                  href={`/pelicula/${movie.type === 'series' ? 'tv' : 'movie'}/${movie.id}`}
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
                  href={`/pelicula/${movie.type === 'series' ? 'tv' : 'movie'}/${movie.id}`}
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
