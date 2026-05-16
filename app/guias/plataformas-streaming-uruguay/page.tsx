import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Check, X } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Guía completa de plataformas de streaming en Uruguay 2026 — DondeVeo',
  description: 'Comparación completa de Netflix, Disney+, Max, Prime Video, Paramount+, Apple TV+, Pluto TV y más plataformas de streaming disponibles en Uruguay. Precios, catálogo y qué plataforma conviene más.',
  alternates: { canonical: 'https://www.uru2.com/guias/plataformas-streaming-uruguay' },
  openGraph: { title: 'Guía de plataformas de streaming en Uruguay 2026', type: 'article' },
};

const PLATAFORMAS = [
  {
    nombre: 'Netflix',
    precio: '$699 UYU/mes',
    prueba: 'No',
    calidad: '4K HDR',
    contenido: 'Series y películas originales, gran catálogo de Hollywood',
    pros: ['El catálogo más grande del mercado', 'Originales exclusivos de altísima calidad', 'Interfaz muy intuitiva', 'Disponible en todos los dispositivos'],
    contras: ['Sin período de prueba gratuita', 'Precio más alto del mercado', 'Compartir cuenta tiene costo extra'],
    paraQuien: 'Para quien quiere la mayor variedad posible y prioriza series originales como Stranger Things, La Casa de Papel, Ozark.',
    slug: 'netflix',
  },
  {
    nombre: 'Disney+',
    precio: '$519 UYU/mes',
    prueba: 'No',
    calidad: '4K HDR',
    contenido: 'Disney, Pixar, Marvel, Star Wars, National Geographic',
    pros: ['Todo el universo Marvel y Star Wars', 'Pixar y clásicos Disney', 'Documentales National Geographic', 'Ideal para toda la familia'],
    contras: ['Sin período de prueba', 'Catálogo más limitado en géneros adultos'],
    paraQuien: 'Para familias con niños, fanáticos de Marvel o Star Wars. Si te perdiste las películas del cine, acá llegan primero.',
    slug: 'disneyplus',
  },
  {
    nombre: 'Max',
    precio: '$599 UYU/mes',
    prueba: '7 días',
    calidad: '4K HDR',
    contenido: 'HBO, Warner Bros, DC Comics, series de culto',
    pros: ['Todo el catálogo HBO (Los Sopranos, The Wire, Game of Thrones)', 'Series de culto y de autor', 'Películas de estreno Warner Bros', '7 días de prueba gratis'],
    contras: ['Precio medio-alto', 'Interfaz mejorable'],
    paraQuien: 'Para los más exigentes. Si valorás la calidad por encima de la cantidad, Max tiene las mejores series dramáticas de la historia.',
    slug: 'max',
  },
  {
    nombre: 'Prime Video',
    precio: '$299 UYU/mes',
    prueba: '30 días',
    calidad: '4K HDR',
    contenido: 'Originales Amazon, películas y series internacionales',
    pros: ['La opción más económica con buen catálogo', '30 días de prueba gratuita', 'Originales como The Boys, Reacher, Rings of Power', 'Contenido internacional variado'],
    contras: ['Interfaz con mucho contenido de pago adicional', 'Catálogo original más inconsistente'],
    paraQuien: 'La mejor relación precio-calidad. Ideal para quienes buscan una segunda plataforma o recién empiezan con el streaming.',
    slug: 'prime',
  },
  {
    nombre: 'Paramount+',
    precio: '$399 UYU/mes',
    prueba: '7 días',
    calidad: 'Full HD',
    contenido: 'CBS, MTV, Nickelodeon, películas Paramount',
    pros: ['Películas Paramount recientes', 'Series CBS y Nickelodeon', 'Contenido deportivo', 'Precio accesible'],
    contras: ['Catálogo más chico que los líderes', 'Sin 4K en Uruguay'],
    paraQuien: 'Para quienes quieren ver las películas de Misión Imposible, Transformers, o series como Yellowstone y Star Trek.',
    slug: 'paramountplus',
  },
  {
    nombre: 'Pluto TV',
    precio: 'GRATIS',
    prueba: 'N/A',
    calidad: 'HD',
    contenido: 'Canales en vivo y películas clásicas gratuitas',
    pros: ['Completamente gratuito', 'No requiere tarjeta de crédito', 'Canales temáticos 24/7', 'Ideal como complemento'],
    contras: ['Con publicidad', 'Calidad HD solamente', 'Sin contenido exclusivo de estreno'],
    paraQuien: 'Para cualquiera. Es el complemento perfecto de cualquier suscripción paga. Tiene canales de terror, comedias, documentales y más, sin costo.',
    slug: 'plutotv',
  },
];

export default function GuiaPlataformasPage() {
  return (
    <div className="min-h-screen bg-dv-bg pt-20">
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-10">
        <Link href="/guias" className="inline-flex items-center gap-1.5 text-dv-muted hover:text-white text-sm mb-6 transition-colors">
          <ArrowLeft size={14} /> Todas las guías
        </Link>

        <div className="mb-8">
          <span className="text-dv-accent text-xs font-bold uppercase tracking-widest">Guía editorial</span>
          <h1 className="text-white text-3xl md:text-4xl font-black mt-2 mb-3">
            Guía completa de plataformas de streaming en Uruguay (2026)
          </h1>
          <p className="text-white/60 text-lg leading-relaxed">
            Con tantas plataformas disponibles en Uruguay, elegir cuál contratar puede ser abrumador. En DondeVeo analizamos cada una para ayudarte a decidir cuál (o cuáles) vale la pena según tu presupuesto y gustos.
          </p>
          <p className="text-white/50 text-sm mt-2">Actualizado: mayo 2026 · Precios en pesos uruguayos (UYU)</p>
        </div>

        {/* Intro editorial */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-10">
          <h2 className="text-white text-xl font-bold mb-3">¿Cuántas plataformas necesitás realmente?</h2>
          <p className="text-white/70 leading-relaxed mb-3">
            La trampa del streaming es suscribirte a todo y terminar pagando más que un cable viejo. La realidad es que la mayoría de las personas se contentaría con 2-3 plataformas bien elegidas. La clave está en entender qué tipo de contenido consumís más.
          </p>
          <p className="text-white/70 leading-relaxed mb-3">
            Si sos de ver series de autor y cine de calidad: <strong className="text-white">Max</strong> es tu plataforma. Si tenés familia con niños: <strong className="text-white">Disney+</strong> es imprescindible. Si querés cantidad y variedad: <strong className="text-white">Netflix</strong> sigue siendo el rey. Y si querés gastar menos: <strong className="text-white">Prime Video</strong> a $299 es la mejor relación calidad-precio.
          </p>
          <p className="text-white/70 leading-relaxed">
            Y siempre, siempre, <strong className="text-white">Pluto TV gratis</strong> como complemento. Sin tarjeta, sin compromiso.
          </p>
        </div>

        {/* Plataformas */}
        <h2 className="text-white text-2xl font-black mb-6">Análisis por plataforma</h2>
        <div className="space-y-8">
          {PLATAFORMAS.map((p) => (
            <div key={p.nombre} className="border border-white/10 rounded-2xl overflow-hidden">
              <div className="bg-white/5 px-6 py-4 flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h3 className="text-white text-xl font-black">{p.nombre}</h3>
                  <div className="flex items-center gap-4 mt-1 text-sm">
                    <span className="text-dv-accent font-bold">{p.precio}</span>
                    <span className="text-white/40">·</span>
                    <span className="text-white/50">Prueba: {p.prueba}</span>
                    <span className="text-white/40">·</span>
                    <span className="text-white/50">{p.calidad}</span>
                  </div>
                </div>
                <Link href={`/novedades/${p.slug}`}
                  className="text-xs bg-dv-accent/20 text-dv-accent border border-dv-accent/30 px-3 py-1.5 rounded-lg font-semibold hover:bg-dv-accent/30 transition-colors">
                  Ver novedades →
                </Link>
              </div>
              <div className="p-6">
                <p className="text-white/60 text-sm mb-4">{p.contenido}</p>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-white text-xs font-bold uppercase tracking-wide mb-2">✅ A favor</p>
                    <ul className="space-y-1">
                      {p.pros.map((pro) => (
                        <li key={pro} className="flex items-start gap-2 text-sm text-white/60">
                          <Check size={12} className="text-green-400 mt-0.5 flex-shrink-0" />
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-white text-xs font-bold uppercase tracking-wide mb-2">❌ En contra</p>
                    <ul className="space-y-1">
                      {p.contras.map((con) => (
                        <li key={con} className="flex items-start gap-2 text-sm text-white/60">
                          <X size={12} className="text-red-400 mt-0.5 flex-shrink-0" />
                          {con}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="bg-dv-accent/8 border border-dv-accent/20 rounded-xl p-3">
                  <p className="text-dv-accent text-xs font-bold mb-1">¿Para quién es?</p>
                  <p className="text-white/70 text-sm">{p.paraQuien}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Conclusión */}
        <div className="mt-10 bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-white text-xl font-bold mb-3">Nuestra recomendación para Uruguay</h2>
          <p className="text-white/70 leading-relaxed mb-3">
            Si tenés que elegir una sola plataforma: <strong className="text-white">Netflix o Prime Video</strong>, dependiendo de tu presupuesto. Netflix tiene más variedad, Prime es más económico pero también muy completo.
          </p>
          <p className="text-white/70 leading-relaxed mb-3">
            Si podés pagar dos: <strong className="text-white">Netflix + Disney+</strong> (la combinación más popular en Uruguay) o <strong className="text-white">Max + Prime</strong> para un perfil más cinéfilo.
          </p>
          <p className="text-white/70 leading-relaxed">
            Y siempre sumá <strong className="text-white">Pluto TV gratis</strong>. Tiene canales 24/7 de terror, comedias, documentales, crímenes reales y más, sin gastar un peso extra.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/comparar/netflix-vs-disney" className="text-sm bg-white/8 hover:bg-white/15 text-white px-4 py-2 rounded-lg transition-colors">Netflix vs Disney+ →</Link>
          <Link href="/comparar/netflix-vs-max" className="text-sm bg-white/8 hover:bg-white/15 text-white px-4 py-2 rounded-lg transition-colors">Netflix vs Max →</Link>
          <Link href="/comparar/prime-vs-paramount" className="text-sm bg-white/8 hover:bg-white/15 text-white px-4 py-2 rounded-lg transition-colors">Prime vs Paramount+ →</Link>
        </div>
      </div>
    </div>
  );
}
