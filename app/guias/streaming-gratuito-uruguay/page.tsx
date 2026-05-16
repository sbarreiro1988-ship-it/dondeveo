import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Check } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Streaming gratuito en Uruguay: cómo ver películas gratis legalmente — DondeVeo',
  description: 'Guía completa sobre plataformas de streaming gratuitas en Uruguay. Pluto TV, Plex, Mercado Play, Tubi y más opciones para ver películas y series gratis y legalmente en Uruguay.',
  alternates: { canonical: 'https://www.uru2.com/guias/streaming-gratuito-uruguay' },
  openGraph: { title: 'Streaming gratuito en Uruguay: ver películas gratis legalmente', type: 'article' },
};

const PLATAFORMAS_GRATIS = [
  {
    nombre: 'Pluto TV',
    tipo: 'Canales en vivo + biblioteca de películas',
    requiere: 'Registro opcional',
    dispositivos: 'Smart TV, celular, PC, tablet',
    descripcion: 'La mejor plataforma gratuita disponible en Uruguay sin discusión. Pluto TV ofrece más de 100 canales en vivo temáticos (terror, comedias, documentales, crímenes reales, deportes) más una biblioteca de películas y series. Todo sin pagar un peso.',
    contenidoDestacado: ['Canal de terror 24/7', 'Comedias clásicas', 'Documentales de naturaleza', 'Películas de acción de los 90s y 2000s', 'Series de crímenes reales'],
    consejo: 'Instalala en tu Smart TV como complemento de tu suscripción paga. Los canales temáticos son perfectos para "zapear" cuando no sabés qué ver.',
  },
  {
    nombre: 'Mercado Play',
    tipo: 'Biblioteca de películas gratuitas',
    requiere: 'Cuenta de Mercado Libre',
    dispositivos: 'App Mercado Libre',
    descripcion: 'Si tenés cuenta de Mercado Libre (¿y quién no tiene?), ya tenés acceso a Mercado Play. Tiene una biblioteca respetable de películas y series latinoamericanas y algunas de Hollywood, todo gratis con publicidad.',
    contenidoDestacado: ['Películas latinoamericanas', 'Series de habla hispana', 'Documentales', 'Cine de autor internacional'],
    consejo: 'Ideal para descubrir cine latinoamericano que no encontrás en otras plataformas. La app de Mercado Libre tiene la sección Play integrada.',
  },
  {
    nombre: 'Plex',
    tipo: 'Biblioteca + servidor de medios personal',
    requiere: 'Registro gratuito',
    dispositivos: 'Todos los dispositivos',
    descripcion: 'Plex tiene dos funciones: como servidor de tu propia biblioteca de películas, y como plataforma de streaming gratuita con miles de títulos. La parte gratuita incluye películas y series con publicidad.',
    contenidoDestacado: ['Cine clásico de Hollywood', 'Documentales', 'Series internacionales', 'Películas independientes'],
    consejo: 'Si tenés muchas películas descargadas en tu PC, Plex te permite verlas desde cualquier dispositivo de tu casa. Esa función también es gratis.',
  },
];

const TIPS = [
  {
    titulo: 'Rotá las pruebas gratuitas',
    desc: 'Netflix, Max, Prime Video y Paramount+ ofrecen períodos de prueba. Si los manejás bien, podés tener semanas de contenido premium sin gastar nada. Eso sí, cancelá antes de que termine el período.',
  },
  {
    titulo: 'Combiná plataformas gratuitas con una sola paga',
    desc: 'La estrategia más inteligente: una suscripción paga (Netflix o Prime) más Pluto TV y Mercado Play gratis. Con eso cubrís casi todo el contenido que vas a querer ver.',
  },
  {
    titulo: 'Aprovechá el contenido de las plataformas de tu proveedor',
    desc: 'Algunos proveedores de internet o telefonía en Uruguay ofrecen acceso a streaming incluido en el plan. Verificá si tu plan incluye algún servicio que no estés usando.',
  },
  {
    titulo: 'Buscá en DondeVeo antes de suscribirte',
    desc: 'Antes de pagar una suscripción solo para ver una película, buscala en DondeVeo. Muchas veces el mismo título está disponible gratis en Pluto TV o Mercado Play.',
  },
];

export default function StreamingGratuitoPage() {
  return (
    <div className="min-h-screen bg-dv-bg pt-20">
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-10">
        <Link href="/guias" className="inline-flex items-center gap-1.5 text-dv-muted hover:text-white text-sm mb-6 transition-colors">
          <ArrowLeft size={14} /> Todas las guías
        </Link>

        <div className="mb-8">
          <span className="text-dv-accent text-xs font-bold uppercase tracking-widest">Guía editorial</span>
          <h1 className="text-white text-3xl md:text-4xl font-black mt-2 mb-3">
            Streaming gratuito en Uruguay: ver películas gratis y legalmente
          </h1>
          <p className="text-white/60 text-lg leading-relaxed">
            No hace falta pagar tres suscripciones para tener buena oferta de entretenimiento. En Uruguay hay plataformas de streaming completamente gratuitas y legales que muchos no conocen. Acá te contamos todo sobre ellas.
          </p>
          <p className="text-white/50 text-sm mt-2">Guía editorial · DondeVeo Uruguay · Mayo 2026</p>
        </div>

        <div className="bg-dv-accent/10 border border-dv-accent/30 rounded-2xl p-5 mb-10">
          <p className="text-white font-bold mb-2">⚠️ Importante: solo plataformas legales</p>
          <p className="text-white/70 text-sm leading-relaxed">
            Esta guía habla exclusivamente de plataformas <strong className="text-white">legales y gratuitas</strong>. La piratería, además de ser ilegal, expone tu dispositivo a malware y no apoya a los creadores de contenido. Con las opciones que te damos acá, no necesitás arriesgarte.
          </p>
        </div>

        <h2 className="text-white text-2xl font-black mb-6">Las mejores plataformas gratuitas en Uruguay</h2>

        <div className="space-y-8 mb-12">
          {PLATAFORMAS_GRATIS.map((p) => (
            <div key={p.nombre} className="border border-white/10 rounded-2xl overflow-hidden">
              <div className="bg-white/5 px-6 py-4">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <h3 className="text-white text-xl font-black">{p.nombre}</h3>
                    <div className="flex flex-wrap gap-3 mt-1 text-xs text-white/50">
                      <span>{p.tipo}</span>
                      <span>·</span>
                      <span>{p.requiere}</span>
                    </div>
                  </div>
                  <span className="bg-green-500/20 text-green-400 text-xs font-bold px-3 py-1 rounded-full border border-green-500/30">
                    100% GRATIS
                  </span>
                </div>
              </div>
              <div className="p-6">
                <p className="text-white/65 text-sm leading-relaxed mb-4">{p.descripcion}</p>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-white text-xs font-bold uppercase tracking-wide mb-2">Contenido destacado</p>
                    <ul className="space-y-1">
                      {p.contenidoDestacado.map((c) => (
                        <li key={c} className="flex items-center gap-2 text-sm text-white/60">
                          <Check size={12} className="text-green-400 flex-shrink-0" /> {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-white text-xs font-bold uppercase tracking-wide mb-2">Disponible en</p>
                    <p className="text-white/60 text-sm">{p.dispositivos}</p>
                  </div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                  <p className="text-white/40 text-xs font-bold mb-1">💡 Consejo DondeVeo</p>
                  <p className="text-white/65 text-sm">{p.consejo}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <h2 className="text-white text-2xl font-black mb-6">Tips para ver más por menos</h2>
        <div className="grid md:grid-cols-2 gap-4 mb-10">
          {TIPS.map((tip) => (
            <div key={tip.titulo} className="bg-white/5 border border-white/10 rounded-xl p-4">
              <h3 className="text-white font-bold text-sm mb-2">{tip.titulo}</h3>
              <p className="text-white/55 text-xs leading-relaxed">{tip.desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-white text-xl font-bold mb-3">Conclusión: el streaming gratuito en Uruguay es mejor de lo que creés</h2>
          <p className="text-white/70 leading-relaxed mb-3">
            La combinación de Pluto TV + Mercado Play ya te da acceso a cientos de horas de contenido sin pagar nada. Si le sumás una sola suscripción de pago (recomendamos Prime Video por precio-calidad), tenés una oferta de entretenimiento enorme por menos de lo que costaba un cable básico.
          </p>
          <p className="text-white/70 leading-relaxed">
            Y recordá: antes de suscribirte a algo, siempre buscá el título en DondeVeo. Quizás lo que querés ver ya está disponible gratis.
          </p>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/guias/plataformas-streaming-uruguay" className="text-sm bg-white/8 hover:bg-white/15 text-white px-4 py-2 rounded-lg transition-colors">Comparar plataformas →</Link>
          <Link href="/novedades/plutotv" className="text-sm bg-white/8 hover:bg-white/15 text-white px-4 py-2 rounded-lg transition-colors">Novedades Pluto TV →</Link>
        </div>
      </div>
    </div>
  );
}
