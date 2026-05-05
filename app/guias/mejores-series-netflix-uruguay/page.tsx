import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Star } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Las mejores series de Netflix Uruguay en 2026 — DondeVeo',
  description: 'Nuestra selección editorial de las mejores series disponibles en Netflix Uruguay en 2026. Drama, thriller, comedia y ciencia ficción: lo mejor del catálogo para no perderte nada.',
  alternates: { canonical: 'https://www.uru2.com/guias/mejores-series-netflix-uruguay' },
  openGraph: { title: 'Las mejores series de Netflix Uruguay 2026', type: 'article' },
};

const SERIES = [
  {
    titulo: 'Breaking Bad',
    genero: 'Drama / Thriller',
    temporadas: 5,
    rating: 9.5,
    desc: 'La historia de Walter White, un profesor de química que se convierte en narcotraficante, es considerada por muchos críticos la mejor serie de televisión de todos los tiempos. Si no la viste, empezá ya.',
    porQueVerla: 'Porque la transformación psicológica de su protagonista es uno de los estudios de personaje más brillantes que existe en pantalla. Cada temporada sube la apuesta.',
  },
  {
    titulo: 'Stranger Things',
    genero: 'Ciencia ficción / Terror',
    temporadas: 4,
    rating: 8.7,
    desc: 'Ochenta nostálgicos, niños con poderes sobrenaturales y criaturas del Mundo del Revés. La serie que convirtió a Netflix en una potencia de contenido original.',
    porQueVerla: 'Porque mezcla la nostalgia de los 80 con el suspenso sobrenatural de manera que ninguna otra serie logra. Las actuaciones de los niños protagonistas son extraordinarias.',
  },
  {
    titulo: 'Ozark',
    genero: 'Drama / Thriller',
    temporadas: 4,
    rating: 8.4,
    desc: 'Un asesor financiero se ve obligado a lavar dinero para un cartel mexicano. Una de las series de suspenso más tensas y adictivas del catálogo de Netflix.',
    porQueVerla: 'Porque Jason Bateman y Laura Linney entregan dos de las mejores actuaciones de la última década. Y porque cada episodio termina con ganas de ver el siguiente.',
  },
  {
    titulo: 'El juego del calamar',
    genero: 'Thriller / Ciencia ficción',
    temporadas: 2,
    rating: 8.0,
    desc: 'La serie coreana que se convirtió en el fenómeno global más grande de Netflix. 456 personas participan en juegos mortales para ganar 45.600 millones de wones.',
    porQueVerla: 'Porque más allá del espectáculo violento, es una crítica social profunda al capitalismo y la desigualdad. Y porque la hiciste bien en que te haya gustado.',
  },
  {
    titulo: 'Black Mirror',
    genero: 'Ciencia ficción / Distopía',
    temporadas: 6,
    rating: 8.8,
    desc: 'Antología de episodios independientes sobre el lado oscuro de la tecnología. Cada capítulo es un universo distinto, muchos de los cuales envejecen mejor cuanto más avanza el tiempo real.',
    porQueVerla: 'Porque algunos episodios te van a hacer pensar durante días. Es ciencia ficción que no trata al espectador como idiota. Empezá por "San Junipero" o "Nosedive".',
  },
  {
    titulo: 'The Crown',
    genero: 'Drama histórico',
    temporadas: 6,
    rating: 8.6,
    desc: 'La historia de la familia real británica desde la coronación de Isabel II. Una producción de escala cinematográfica con actuaciones que se llevaron todos los premios disponibles.',
    porQueVerla: 'Porque aunque no te interese la realeza, es un estudio fascinante sobre el poder, el deber y el sacrificio personal. Y visualmente es impresionante.',
  },
];

export default function MejoresSeriesNetflixPage() {
  return (
    <div className="min-h-screen bg-dv-bg pt-20">
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-10">
        <Link href="/guias" className="inline-flex items-center gap-1.5 text-dv-muted hover:text-white text-sm mb-6 transition-colors">
          <ArrowLeft size={14} /> Todas las guías
        </Link>

        <div className="mb-8">
          <span className="text-dv-accent text-xs font-bold uppercase tracking-widest">Guía editorial</span>
          <h1 className="text-white text-3xl md:text-4xl font-black mt-2 mb-3">
            Las mejores series de Netflix Uruguay en 2026
          </h1>
          <p className="text-white/60 text-lg leading-relaxed">
            Con miles de series en el catálogo, elegir qué ver puede ser tan difícil como la serie misma. En DondeVeo seleccionamos las imprescindibles: las que generaron debate, ganaron premios y que todavía habla la gente.
          </p>
          <p className="text-white/50 text-sm mt-2">Selección editorial · Actualizado mayo 2026</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-10">
          <p className="text-white/70 text-sm leading-relaxed">
            <strong className="text-white">¿Cómo elegimos estas series?</strong> No nos guiamos solo por el algoritmo de Netflix ni por las tendencias globales. Evaluamos calidad narrativa, actuaciones, impacto cultural y relevancia para el espectador uruguayo. Algunas están en el top 10 de siempre; otras son joyas que quizás te perdiste.
          </p>
        </div>

        <div className="space-y-6">
          {SERIES.map((s, i) => (
            <div key={s.titulo} className="flex gap-5 border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-colors">
              <div className="w-10 h-10 rounded-full bg-dv-accent/20 text-dv-accent font-black text-lg flex items-center justify-center flex-shrink-0">
                {i + 1}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-3 flex-wrap mb-2">
                  <div>
                    <h2 className="text-white text-xl font-black">{s.titulo}</h2>
                    <div className="flex items-center gap-3 mt-0.5 text-sm text-white/50">
                      <span>{s.genero}</span>
                      <span>·</span>
                      <span>{s.temporadas} temp.</span>
                      <span>·</span>
                      <div className="flex items-center gap-1">
                        <Star size={11} className="text-yellow-400 fill-yellow-400" />
                        <span className="text-yellow-400 font-bold">{s.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-white/60 text-sm leading-relaxed mb-3">{s.desc}</p>
                <div className="bg-dv-accent/8 border border-dv-accent/20 rounded-xl p-3">
                  <p className="text-dv-accent text-xs font-bold mb-1">¿Por qué verla?</p>
                  <p className="text-white/70 text-sm">{s.porQueVerla}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-white text-xl font-bold mb-3">Consejo de DondeVeo</h2>
          <p className="text-white/70 leading-relaxed">
            Si sos nuevo en Netflix Uruguay y no sabés por dónde empezar, nuestra recomendación es clara: <strong className="text-white">Breaking Bad primero</strong>. No importa si ya escuchaste demasiado sobre ella, igual te va a sorprender. Después seguí con Ozark o Stranger Things según si preferís adulto o un poco más familiar.
          </p>
          <p className="text-white/70 leading-relaxed mt-3">
            Y recordá: podés buscar cualquier título en DondeVeo para saber si también está en otras plataformas más económicas antes de suscribirte.
          </p>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/genero/drama" className="text-sm bg-white/8 hover:bg-white/15 text-white px-4 py-2 rounded-lg transition-colors">Más dramas →</Link>
          <Link href="/genero/thriller" className="text-sm bg-white/8 hover:bg-white/15 text-white px-4 py-2 rounded-lg transition-colors">Más thrillers →</Link>
          <Link href="/novedades/netflix" className="text-sm bg-white/8 hover:bg-white/15 text-white px-4 py-2 rounded-lg transition-colors">Novedades Netflix →</Link>
        </div>
      </div>
    </div>
  );
}
