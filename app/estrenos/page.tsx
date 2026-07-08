import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const BASE = 'https://www.uru2.com';

export const metadata: Metadata = {
  title: 'Estrenos y novedades de streaming en Uruguay — DondeVeo',
  description: 'Todo lo nuevo que llega a Netflix, Disney+, Max, Prime Video, Paramount+, Apple TV+ y los cines de Uruguay. Actualizamos automáticamente todos los días.',
  alternates: { canonical: `${BASE}/estrenos` },
  openGraph: {
    title: 'Estrenos y novedades en Uruguay — DondeVeo',
    description: 'Cartelera de cine y novedades de streaming actualizadas diariamente para Uruguay.',
    url: `${BASE}/estrenos`,
    type: 'website',
    locale: 'es_UY',
    siteName: 'DondeVeo Uruguay',
  },
};

const PLATAFORMAS = [
  { id: 'netflix',        nombre: 'Netflix',          emoji: '🔴', color: 'from-red-600/20',     desc: 'Series y películas originales de Netflix disponibles en Uruguay' },
  { id: 'prime',          nombre: 'Prime Video',       emoji: '🔵', color: 'from-sky-500/20',     desc: 'Amazon Originals y catálogo de Prime Video en Uruguay' },
  { id: 'disneyplus',     nombre: 'Disney+',           emoji: '⚡', color: 'from-blue-600/20',    desc: 'Disney, Pixar, Marvel, Star Wars y Star en Uruguay' },
  { id: 'max',            nombre: 'Max',               emoji: '🟣', color: 'from-indigo-600/20',  desc: 'Series HBO y Warner Bros. disponibles en Uruguay' },
  { id: 'paramountplus',  nombre: 'Paramount+',        emoji: '⭐', color: 'from-blue-500/20',    desc: 'Series originales y catálogo de Paramount en Uruguay' },
  { id: 'appletv',        nombre: 'Apple TV+',         emoji: '🍎', color: 'from-gray-500/20',    desc: 'Producciones originales de Apple disponibles en Uruguay' },
  { id: 'mubi',           nombre: 'MUBI',              emoji: '🎞️', color: 'from-red-800/20',     desc: 'Cine de autor y festivales internacionales en Uruguay' },
  { id: 'crunchyroll',    nombre: 'Crunchyroll',       emoji: '🎌', color: 'from-orange-500/20',  desc: 'Anime y series japonesas disponibles en Uruguay' },
  { id: 'plutotv',        nombre: 'Pluto TV',          emoji: '🆓', color: 'from-yellow-500/20',  desc: 'Streaming gratuito con canales temáticos en Uruguay' },
  { id: 'directvgo',      nombre: 'DIRECTV GO',        emoji: '📡', color: 'from-blue-700/20',    desc: 'Canales en vivo y contenido on demand en Uruguay' },
  { id: 'mercadoplay',    nombre: 'Mercado Play',      emoji: '🛒', color: 'from-yellow-400/20',  desc: 'Películas y series gratuitas con Mercado Libre en Uruguay' },
  { id: 'universalplus',  nombre: 'Universal+',        emoji: '🌍', color: 'from-gray-600/20',    desc: 'Series NBCUniversal y contenido internacional en Uruguay' },
];

export default function EstrenosPage() {
  return (
    <div className="min-h-screen bg-dv-bg pt-20">
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-10">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-white text-3xl md:text-4xl font-black mb-3">
            Estrenos y novedades en Uruguay
          </h1>
          <p className="text-white/60 text-lg leading-relaxed max-w-2xl">
            Todo lo nuevo en streaming y cine disponible en Uruguay.
            Actualizado automáticamente cada día con datos oficiales.
          </p>
        </div>

        {/* Card destacada — Cine */}
        <Link
          href="/estrenos/cine"
          className="group flex items-center gap-5 bg-gradient-to-r from-yellow-500/15 to-transparent
                     border border-yellow-400/25 hover:border-yellow-400/50 rounded-2xl p-6 mb-10 transition-all"
        >
          <div className="w-16 h-16 bg-yellow-400/15 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0">
            🎬
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-yellow-200 font-black text-xl">Cine en Uruguay</span>
              <span className="text-[10px] bg-yellow-400/20 text-yellow-300 px-2 py-0.5 rounded-full font-bold tracking-wide">
                EN CARTELERA
              </span>
            </div>
            <p className="text-white/50 text-sm">
              Películas en cartelera hoy y próximos estrenos en los cines de Uruguay
            </p>
          </div>
          <ArrowRight size={20} className="text-yellow-300 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
        </Link>

        {/* Streaming */}
        <h2 className="text-white/50 text-xs font-bold uppercase tracking-widest mb-5">
          Novedades por plataforma de streaming
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PLATAFORMAS.map((p) => (
            <Link
              key={p.id}
              href={`/novedades/${p.id}`}
              className={`group flex items-center gap-4 bg-gradient-to-r ${p.color} to-transparent
                          border border-white/10 hover:border-white/25 rounded-2xl p-4 transition-all`}
            >
              <span className="text-2xl flex-shrink-0">{p.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold text-sm mb-0.5">{p.nombre}</p>
                <p className="text-white/40 text-xs leading-tight line-clamp-1">{p.desc}</p>
              </div>
              <ArrowRight size={14} className="text-white/30 flex-shrink-0 group-hover:text-white/70 group-hover:translate-x-0.5 transition-all" />
            </Link>
          ))}
        </div>

        {/* Info */}
        <div className="mt-10 bg-white/3 border border-white/8 rounded-2xl p-6">
          <h2 className="text-white font-bold text-sm mb-2">¿Con qué frecuencia se actualizan?</h2>
          <p className="text-white/40 text-sm leading-relaxed">
            Las novedades de streaming se actualizan automáticamente cada 12 horas usando datos
            oficiales de cada plataforma disponibles para Uruguay. La cartelera de cine se actualiza
            con información de Argentina y México que incluye los estrenos de la región.
          </p>
        </div>

      </div>
    </div>
  );
}
