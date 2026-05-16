import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Guías de streaming en Uruguay — DondeVeo',
  description: 'Guías editoriales sobre streaming en Uruguay: comparación de plataformas, mejores series y películas, streaming gratuito, recomendaciones del fin de semana y más.',
  alternates: { canonical: 'https://www.uru2.com/guias' },
};

const GUIAS = [
  {
    slug: 'plataformas-streaming-uruguay',
    titulo: 'Guía completa de plataformas de streaming en Uruguay 2026',
    desc: 'Netflix, Disney+, Max, Prime Video, Paramount+, Apple TV+, Pluto TV y más. Comparamos precios, catálogos y te ayudamos a elegir cuál contratar.',
    emoji: '📺',
    categoria: 'Comparación',
    tiempo: '10 min de lectura',
  },
  {
    slug: 'precio-streaming-uruguay',
    titulo: 'Precios de streaming en Uruguay 2026: cuánto cuesta cada plataforma',
    desc: 'Todos los precios actualizados de Netflix, Disney+, Max, Prime Video y Paramount+ en Uruguay en pesos. Qué incluye cada plan y cuál conviene más.',
    emoji: '💰',
    categoria: 'Comparación',
    tiempo: '8 min de lectura',
  },
  {
    slug: 'mejores-peliculas-streaming-uruguay',
    titulo: 'Las mejores películas en streaming Uruguay 2026',
    desc: 'Selección editorial de las películas imprescindibles disponibles en Netflix, Disney+, Max, Prime y Mubi en Uruguay. Clásicos, estrenos y cine latinoamericano.',
    emoji: '🎬',
    categoria: 'Recomendaciones',
    tiempo: '12 min de lectura',
  },
  {
    slug: 'mejores-series-netflix-uruguay',
    titulo: 'Las mejores series de Netflix Uruguay en 2026',
    desc: 'Nuestra selección editorial de las series imprescindibles del catálogo de Netflix en Uruguay. Breaking Bad, Stranger Things, Ozark y más.',
    emoji: '🏆',
    categoria: 'Recomendaciones',
    tiempo: '8 min de lectura',
  },
  {
    slug: 'streaming-para-ninos-uruguay',
    titulo: 'Streaming para niños en Uruguay: guía para padres 2026',
    desc: 'Disney+, Netflix Kids, Paramount+ y Pluto TV analizados desde la perspectiva de los padres. Controles parentales, contenido por edad y cuál plataforma conviene.',
    emoji: '👶',
    categoria: 'Familias',
    tiempo: '10 min de lectura',
  },
  {
    slug: 'que-ver-este-finde',
    titulo: '¿Qué ver este fin de semana en streaming?',
    desc: 'Recomendaciones según el tipo de noche: solo, en familia, con amigos o domingo de película de autor. Para cada plan, las mejores opciones disponibles en Uruguay.',
    emoji: '🍿',
    categoria: 'Recomendaciones',
    tiempo: '6 min de lectura',
  },
  {
    slug: 'streaming-gratuito-uruguay',
    titulo: 'Streaming gratuito en Uruguay: ver películas gratis legalmente',
    desc: 'Pluto TV, Mercado Play, Plex y más plataformas gratuitas disponibles en Uruguay. Cómo ver películas y series gratis y legalmente sin suscripción.',
    emoji: '🆓',
    categoria: 'Ahorro',
    tiempo: '7 min de lectura',
  },
];

const CATEGORIAS = ['Todas', 'Comparación', 'Recomendaciones', 'Familias', 'Ahorro'];

export default function GuiasPage() {
  return (
    <div className="min-h-screen bg-dv-bg pt-20">
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-10">
        <Link href="/" className="inline-flex items-center gap-1.5 text-dv-muted hover:text-white text-sm mb-6 transition-colors">
          <ArrowLeft size={14} /> Inicio
        </Link>

        <div className="mb-8">
          <h1 className="text-white text-3xl md:text-4xl font-black mb-3">
            Guías de streaming en Uruguay
          </h1>
          <p className="text-white/60 text-lg leading-relaxed">
            Análisis editoriales, comparaciones y recomendaciones para sacar el máximo provecho de tu suscripción de streaming en Uruguay. Todo escrito por el equipo de DondeVeo.
          </p>
        </div>

        {/* Grid de guías */}
        <div className="grid md:grid-cols-2 gap-5">
          {GUIAS.map((g) => (
            <Link key={g.slug} href={`/guias/${g.slug}`}
              className="group flex flex-col bg-white/5 hover:bg-white/8 border border-white/10 hover:border-dv-accent/30 rounded-2xl p-5 transition-all">
              <div className="flex items-start justify-between mb-3">
                <span className="text-3xl">{g.emoji}</span>
                <span className="text-[10px] bg-dv-accent/15 text-dv-accent px-2 py-0.5 rounded font-bold">
                  {g.categoria}
                </span>
              </div>
              <h2 className="text-white font-black text-lg leading-tight mb-2 group-hover:text-dv-accent transition-colors">
                {g.titulo}
              </h2>
              <p className="text-white/50 text-sm leading-relaxed flex-1 mb-3">{g.desc}</p>
              <div className="flex items-center justify-between">
                <span className="text-white/30 text-xs">{g.tiempo}</span>
                <span className="text-dv-accent text-xs font-semibold group-hover:translate-x-1 transition-transform">
                  Leer →
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA editorial */}
        <div className="mt-10 bg-dv-accent/8 border border-dv-accent/20 rounded-2xl p-6 text-center">
          <h2 className="text-white text-xl font-bold mb-2">¿Buscás un título específico?</h2>
          <p className="text-white/60 text-sm mb-4">
            Usá el buscador de DondeVeo para encontrar en qué plataforma está disponible cualquier película o serie en Uruguay.
          </p>
          <Link href="/" className="inline-block bg-dv-accent text-[#111] font-bold px-6 py-2.5 rounded-xl hover:opacity-90 transition-opacity">
            Ir al buscador →
          </Link>
        </div>
      </div>
    </div>
  );
}
