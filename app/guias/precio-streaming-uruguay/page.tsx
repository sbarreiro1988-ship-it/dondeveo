import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, TrendingDown, AlertCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Precios de streaming en Uruguay 2026: cuánto cuesta cada plataforma — DondeVeo',
  description: 'Precios actualizados de Netflix, Disney+, Max, Prime Video, Paramount+ y Apple TV+ en Uruguay. Cuánto sale cada plan, qué incluye y cómo pagar en pesos uruguayos.',
  keywords: ['precio netflix uruguay 2026', 'cuanto cuesta disney plus uruguay', 'precio streaming uruguay pesos', 'max hbo precio uruguay'],
  alternates: { canonical: 'https://www.uru2.com/guias/precio-streaming-uruguay' },
  openGraph: { title: 'Precios de streaming en Uruguay 2026 — DondeVeo', type: 'article', locale: 'es_UY' },
};

const PLANES = [
  {
    plataforma: 'Netflix',
    slug: 'netflix',
    color: '#E50914',
    planes: [
      { nombre: 'Estándar con anuncios', precio: 469, pantallas: 2, calidad: 'Full HD', descargas: false },
      { nombre: 'Estándar', precio: 699, pantallas: 2, calidad: 'Full HD', descargas: true },
      { nombre: 'Premium', precio: 949, pantallas: 4, calidad: '4K HDR', descargas: true },
    ],
    nota: 'El plan con anuncios tiene interrupciones publicitarias durante la reproducción. Netflix cobra extra por agregar una persona fuera del hogar principal.',
    recomendacion: 'El plan Estándar es el punto dulce para la mayoría: Full HD, 2 pantallas simultáneas y sin publicidad a un precio razonable.',
  },
  {
    plataforma: 'Disney+',
    slug: 'disneyplus',
    color: '#113CCF',
    planes: [
      { nombre: 'Estándar', precio: 519, pantallas: 4, calidad: '4K HDR', descargas: true },
    ],
    nota: 'Disney+ tiene un único plan en Uruguay sin opciones de cuentas compartidas extra. 4 pantallas simultáneas incluidas en el precio base.',
    recomendacion: 'Buen precio para lo que ofrece: todo el contenido Disney, Pixar, Marvel y Star Wars en 4K con hasta 4 pantallas.',
  },
  {
    plataforma: 'Max (HBO)',
    slug: 'max',
    color: '#002BE7',
    planes: [
      { nombre: 'Básico con anuncios', precio: 399, pantallas: 2, calidad: 'Full HD', descargas: false },
      { nombre: 'Estándar', precio: 599, pantallas: 2, calidad: '4K HDR', descargas: true },
      { nombre: 'Ultimate', precio: 799, pantallas: 4, calidad: '4K HDR + Dolby Atmos', descargas: true },
    ],
    nota: 'Max incluye 7 días de prueba gratuita. Es la única plataforma de las grandes que aún ofrece período de prueba en Uruguay.',
    recomendacion: 'El plan Estándar a $599 es el más popular. El Ultimate conviene si tenés buen equipo de sonido y querés Dolby Atmos.',
  },
  {
    plataforma: 'Prime Video',
    slug: 'prime',
    color: '#00A8E1',
    planes: [
      { nombre: 'Prime Video', precio: 299, pantallas: 3, calidad: '4K HDR', descargas: true },
    ],
    nota: 'Prime Video es el más económico de las plataformas premium. Incluye 30 días de prueba gratuita y permite 3 pantallas simultáneas.',
    recomendacion: 'Mejor relación precio-calidad del mercado. A $299 con 4K, 3 pantallas y 30 días de prueba, es la puerta de entrada ideal al streaming.',
  },
  {
    plataforma: 'Paramount+',
    slug: 'paramountplus',
    color: '#0064FF',
    planes: [
      { nombre: 'Esencial', precio: 299, pantallas: 3, calidad: 'Full HD', descargas: false },
      { nombre: 'Premium', precio: 399, pantallas: 3, calidad: 'Full HD', descargas: true },
    ],
    nota: 'Paramount+ tiene 7 días de prueba gratuita. Aún no ofrece resolución 4K en Uruguay.',
    recomendacion: 'Si querés Yellowstone, Star Trek o los estrenos de Paramount, el plan Esencial alcanza. No justifica el Premium a menos que necesitás descargas.',
  },
  {
    plataforma: 'Apple TV+',
    slug: 'appletv',
    color: '#555555',
    planes: [
      { nombre: 'Apple TV+', precio: 499, pantallas: 6, calidad: '4K HDR', descargas: true },
    ],
    nota: 'Apple TV+ permite hasta 6 personas de la misma familia con Compartir en Familia. Si comprás un Apple nuevo, incluís 3 meses gratis.',
    recomendacion: 'Catálogo más chico pero muy cuidado en calidad. Si tenés iPhone o Mac y ya usás el ecosistema Apple, vale completamente la pena.',
  },
];

const PREGUNTAS = [
  {
    q: '¿En qué moneda cobran las plataformas en Uruguay?',
    a: 'La mayoría cobra en pesos uruguayos (UYU) a través de tarjeta de crédito o débito uruguaya. Si tu tarjeta es internacional, el cobro puede hacerse en dólares al tipo de cambio del día. Siempre conviene pagar con tarjeta uruguaya para evitar recargos de conversión.',
  },
  {
    q: '¿Los precios incluyen IVA?',
    a: 'Sí. Todos los precios que mostramos incluyen el IVA correspondiente. Las plataformas de streaming están sujetas al IVA en Uruguay como servicios digitales, tal como lo establece la DGI.',
  },
  {
    q: '¿Qué pasa si pago con tarjeta extranjera?',
    a: 'Si pagás con una tarjeta de banco extranjero, la plataforma puede mostrarte los precios en otra moneda (generalmente dólares o euros) y no en pesos uruguayos. El precio final dependerá del tipo de cambio y las comisiones de tu banco.',
  },
  {
    q: '¿Puedo compartir mi cuenta con alguien fuera de mi casa?',
    a: 'Cada plataforma tiene sus propias reglas. Netflix eliminó el uso compartido en cuentas domésticas: ahora cobra extra por agregar una persona que no viva en el mismo hogar. Disney+ y Max permiten compartir con personas del mismo domicilio. Prime Video permite hasta 3 pantallas simultáneas sin restricciones de ubicación.',
  },
  {
    q: '¿Cuándo suelen actualizarse los precios?',
    a: 'Los precios del streaming cambian con cierta frecuencia. Netflix ajusta sus tarifas cada 12-18 meses aproximadamente. Te recomendamos revisar directamente en la plataforma antes de suscribirte. DondeVeo actualiza esta guía cada vez que hay cambios en las tarifas.',
  },
];

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: PREGUNTAS.map(({ q, a }) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
};

export default function PrecioStreamingPage() {
  const totalMinimo = PLANES.reduce((acc, p) => acc + Math.min(...p.planes.map(pl => pl.precio)), 0);

  return (
    <div className="min-h-screen bg-dv-bg pt-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-10">
        <Link href="/guias" className="inline-flex items-center gap-1.5 text-dv-muted hover:text-white text-sm mb-6 transition-colors">
          <ArrowLeft size={14} /> Todas las guías
        </Link>

        <div className="mb-8">
          <span className="text-dv-accent text-xs font-bold uppercase tracking-widest">Guía de precios</span>
          <h1 className="text-white text-3xl md:text-4xl font-black mt-2 mb-3">
            Precios de streaming en Uruguay (2026)
          </h1>
          <p className="text-white/60 text-lg leading-relaxed">
            Todos los precios actualizados de las principales plataformas de streaming disponibles en Uruguay. Cuánto cuesta cada plan, qué incluye y cuál conviene más para tu bolsillo.
          </p>
          <p className="text-white/50 text-sm mt-2">Actualizado: mayo 2026 · Precios en pesos uruguayos (UYU) con IVA incluido</p>
        </div>

        {/* Resumen rápido */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-10">
          <h2 className="text-white text-lg font-bold mb-4 flex items-center gap-2">
            <TrendingDown size={18} className="text-dv-accent" />
            Resumen de precios — de más barato a más caro
          </h2>
          <div className="space-y-2">
            {[
              { nombre: 'Pluto TV', precio: 0, nota: 'Gratuito con publicidad' },
              { nombre: 'Prime Video', precio: 299, nota: '30 días de prueba' },
              { nombre: 'Paramount+ Esencial', precio: 299, nota: '7 días de prueba' },
              { nombre: 'Max con anuncios', precio: 399, nota: '7 días de prueba' },
              { nombre: 'Paramount+ Premium', precio: 399, nota: '7 días de prueba' },
              { nombre: 'Netflix con anuncios', precio: 469, nota: 'Sin período de prueba' },
              { nombre: 'Apple TV+', precio: 499, nota: '3 meses gratis con equipo Apple' },
              { nombre: 'Disney+', precio: 519, nota: 'Sin período de prueba' },
              { nombre: 'Max Estándar', precio: 599, nota: '7 días de prueba' },
              { nombre: 'Netflix Estándar', precio: 699, nota: 'Sin período de prueba' },
              { nombre: 'Max Ultimate', precio: 799, nota: '7 días de prueba' },
              { nombre: 'Netflix Premium', precio: 949, nota: 'Sin período de prueba' },
            ].map((item) => (
              <div key={item.nombre} className="flex items-center justify-between py-1.5 border-b border-white/5 last:border-0">
                <div className="flex items-center gap-3">
                  <span className="text-white/80 text-sm">{item.nombre}</span>
                  <span className="text-white/30 text-xs hidden sm:inline">{item.nota}</span>
                </div>
                <span className={`font-black text-sm ${item.precio === 0 ? 'text-green-400' : 'text-dv-accent'}`}>
                  {item.precio === 0 ? 'GRATIS' : `$${item.precio} UYU`}
                </span>
              </div>
            ))}
          </div>
          <p className="text-white/40 text-xs mt-4">
            Para tener <strong className="text-white/60">todas</strong> las plataformas premium pagarías ~$3.800 UYU/mes. Para tener dos bien elegidas: ~$900-$1.200.
          </p>
        </div>

        {/* Planes detallados */}
        <h2 className="text-white text-2xl font-black mb-6">Planes y precios en detalle</h2>
        <div className="space-y-8 mb-12">
          {PLANES.map((p) => (
            <div key={p.plataforma} className="border border-white/10 rounded-2xl overflow-hidden">
              <div className="bg-white/5 px-6 py-4 flex items-center justify-between">
                <h3 className="text-white text-xl font-black">{p.plataforma}</h3>
                <Link href={`/plataforma/${p.slug}`}
                  className="text-xs text-dv-accent border border-dv-accent/30 px-3 py-1 rounded-lg hover:bg-dv-accent/10 transition-colors">
                  Ver catálogo →
                </Link>
              </div>
              <div className="p-6">
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-5">
                  {p.planes.map((plan) => (
                    <div key={plan.nombre} className="bg-white/5 border border-white/10 rounded-xl p-4">
                      <p className="text-white font-bold text-sm mb-1">{plan.nombre}</p>
                      <p className="text-dv-accent text-2xl font-black mb-3">
                        {plan.precio === 0 ? 'Gratis' : `$${plan.precio}`}
                        <span className="text-white/30 text-xs font-normal ml-1">UYU/mes</span>
                      </p>
                      <ul className="space-y-1 text-xs text-white/55">
                        <li>📺 {plan.pantallas} pantallas simultáneas</li>
                        <li>🎬 {plan.calidad}</li>
                        <li>{plan.descargas ? '✅ Descargas offline' : '❌ Sin descargas offline'}</li>
                      </ul>
                    </div>
                  ))}
                </div>
                <div className="flex items-start gap-2 bg-white/5 border border-white/10 rounded-xl p-3 mb-3">
                  <AlertCircle size={14} className="text-dv-accent flex-shrink-0 mt-0.5" />
                  <p className="text-white/55 text-xs leading-relaxed">{p.nota}</p>
                </div>
                <p className="text-white/70 text-sm">
                  <strong className="text-dv-accent">Nuestra recomendación:</strong> {p.recomendacion}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Editorial */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-10">
          <h2 className="text-white text-xl font-bold mb-4">¿Cuánto debería gastar en streaming en Uruguay?</h2>
          <div className="space-y-3 text-white/70 text-sm leading-relaxed">
            <p>
              Esta es probablemente la pregunta más frecuente que nos llega. La respuesta honesta es: <strong className="text-white">depende de cuánto tiempo libre tenés y con quién vivís</strong>.
            </p>
            <p>
              Si vivís solo/a y ves contenido en solitario, con <strong className="text-white">una plataforma bien elegida</strong> tenés de sobra. Prime Video a $299 o Max Estándar a $599 te dan contenido para años. Agregar una segunda plataforma solo tiene sentido si ya agotaste el catálogo de la primera, lo cual lleva meses.
            </p>
            <p>
              Si sos una familia con chicos, la combinación <strong className="text-white">Disney+ + Prime Video</strong> (o Disney+ + Netflix) cubre prácticamente todo: contenido familiar de altísima calidad más el catálogo más amplio del mercado. Eso sale entre $818 y $1.218 UYU por mes, mucho menos que un abono de cable.
            </p>
            <p>
              El error más común es suscribirse a demasiadas plataformas a la vez. El streaming tiene un problema que el cable no tenía: es fácil olvidarse de que pagás algo que no estás usando. <strong className="text-white">La regla de DondeVeo</strong>: no tengas más plataformas de las que podés consumir activamente en un mes.
            </p>
            <p>
              Y siempre, siempre, sumá <strong className="text-white">Pluto TV gratis</strong>. Sin tarjeta, sin compromiso, con más de 100 canales temáticos en vivo y una biblioteca de películas respetable. Es la mejor relación precio-valor del mercado porque el precio es cero.
            </p>
          </div>
        </div>

        {/* FAQ */}
        <h2 className="text-white text-2xl font-black mb-6">Preguntas frecuentes sobre precios</h2>
        <div className="space-y-4 mb-10">
          {PREGUNTAS.map((item) => (
            <div key={item.q} className="border border-white/10 rounded-xl p-5">
              <h3 className="text-white font-bold text-sm mb-2">{item.q}</h3>
              <p className="text-white/60 text-sm leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/guias/plataformas-streaming-uruguay" className="text-sm bg-white/8 hover:bg-white/15 text-white px-4 py-2 rounded-lg transition-colors">Comparar plataformas →</Link>
          <Link href="/guias/streaming-gratuito-uruguay" className="text-sm bg-white/8 hover:bg-white/15 text-white px-4 py-2 rounded-lg transition-colors">Ver opciones gratuitas →</Link>
          <Link href="/guias" className="text-sm bg-white/8 hover:bg-white/15 text-white px-4 py-2 rounded-lg transition-colors">Más guías →</Link>
        </div>
      </div>
    </div>
  );
}
