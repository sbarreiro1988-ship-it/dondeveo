import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Check, X, Shield } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Streaming para niños en Uruguay: guía para padres 2026 — DondeVeo',
  description: 'Guía completa de plataformas de streaming para niños en Uruguay. Disney+, Netflix Kids, Pluto TV y más. Controles parentales, contenido apropiado por edad y recomendaciones editoriales.',
  keywords: ['streaming niños uruguay', 'disney plus niños uruguay', 'netflix kids uruguay', 'plataformas infantiles uruguay 2026', 'control parental streaming'],
  alternates: { canonical: 'https://www.uru2.com/guias/streaming-para-ninos-uruguay' },
  openGraph: { title: 'Streaming para niños en Uruguay: guía para padres 2026', type: 'article', locale: 'es_UY' },
};

const PLATAFORMAS = [
  {
    nombre: 'Disney+',
    slug: 'disneyplus',
    rating: 5,
    precio: '$519 UYU/mes',
    descripcion: 'La opción número uno sin discusión para familias con niños. Disney+ tiene el catálogo infantil más completo y cuidado del mercado: toda la colección Disney desde los clásicos de los 90 hasta las últimas producciones de Pixar, Star Wars en versiones apropiadas para niños y National Geographic para despertar la curiosidad científica.',
    contenidoDestacado: [
      'Toda la filmografía Disney clásica (El rey León, La Sirenita, Frozen, Moana)',
      'Pixar completo (Toy Story, Finding Nemo, Coco, Soul, Elemental)',
      'Disney Channel originals y series animadas',
      'National Geographic Kids con documentales de naturaleza',
      'Star Wars para niños (Lego Star Wars, The Mandalorian con supervisión)',
    ],
    controlParental: 'Excelente. Permite crear perfiles específicos para niños con límites de contenido por edad. El perfil Kids restringe automáticamente el acceso a contenido adulto.',
    desventajas: ['No tiene opción de prueba gratuita', 'El contenido de Star Wars avanzado puede no ser apropiado para menores de 7 años'],
    edadRecomendada: '3 a 12 años',
    veredicto: 'Imprescindible si hay niños en el hogar. La relación precio-valor es excelente considerando la profundidad del catálogo infantil.',
  },
  {
    nombre: 'Netflix',
    slug: 'netflix',
    rating: 4,
    precio: '$699 UYU/mes (Estándar)',
    descripcion: 'Netflix tiene una sección Kids muy desarrollada con series originales propias como Peppa Pig, Puffin Rock y una enorme variedad de series animadas de calidad. No tiene el legado de Disney, pero su producción infantil original ha crecido enormemente en los últimos años y tiene cosas que no encontrás en ningún otro lado.',
    contenidoDestacado: [
      'Series animadas originales (Spirit: Caballo salvaje, Kipo)',
      'Contenido educativo para primaria (Brainchild, Ada Twist)',
      'Shows internacionales doblados al español',
      'Especiales de navidad y temporada familiar',
      'Perfil Kids con interfaz simplificada para niños',
    ],
    controlParental: 'Muy bueno. El perfil Kids tiene una interfaz diseñada específicamente para niños y bloquea todo el contenido adulto automáticamente.',
    desventajas: ['Precio más alto que las alternativas', 'Sin período de prueba gratuita', 'No tiene los clásicos de Disney'],
    edadRecomendada: '4 a 14 años',
    veredicto: 'Buen complemento si ya tenés Disney+, pero solo como plataforma infantil es más caro de lo que ofrece. Tiene más valor si también lo usan adultos en la casa.',
  },
  {
    nombre: 'Pluto TV',
    slug: 'plutotv',
    rating: 3,
    precio: 'Gratis',
    descripcion: 'Pluto TV es completamente gratuita y tiene canales temáticos de contenido infantil disponibles 24/7: canales de dibujos animados, contenido educativo y shows clásicos. Es perfecta como complemento de una plataforma de pago cuando el presupuesto es limitado.',
    contenidoDestacado: [
      'Canales de dibujos animados 24/7',
      'Shows clásicos de Nickelodeon',
      'Contenido educativo en español',
      'Documentales de naturaleza para niños',
    ],
    controlParental: 'Básico. No tiene perfiles separados para niños. Se recomienda supervisión parental.',
    desventajas: ['Tiene publicidad', 'Control parental limitado', 'Catálogo menos premium que las plataformas pagas', 'Requiere supervisión al uso libre'],
    edadRecomendada: '4 a 10 años (con supervisión)',
    veredicto: 'La opción gratuita que funciona bien como complemento de otra plataforma. No reemplaza a Disney+ para familias con niños, pero suma sin costo.',
  },
  {
    nombre: 'Paramount+',
    slug: 'paramountplus',
    rating: 3,
    precio: '$299 UYU/mes',
    descripcion: 'Paramount+ tiene el catálogo de Nickelodeon, que es muy potente para niños: Dora la exploradora, Blue\'s Clues, PAW Patrol, SpongeBob y muchos más. Si tu hijo/a es fanático/a de alguno de estos personajes, Paramount+ tiene de lejos el mejor catálogo.',
    contenidoDestacado: [
      'PAW Patrol (completo, incluido The Mighty Movie)',
      'SpongeBob SquarePants',
      'Dora la exploradora',
      'Blue\'s Clues & You!',
      'Las Tortugas Ninja',
    ],
    controlParental: 'Bueno. Permite configurar límites de contenido y crear perfiles separados.',
    desventajas: ['Sin resolución 4K en Uruguay', 'Catálogo adulto menos desarrollado (menor valor si los adultos también lo usan)'],
    edadRecomendada: '2 a 10 años',
    veredicto: 'Muy recomendable si tus hijos son fans de Nickelodeon. A $299 es la opción más económica de las pagas para contenido infantil de calidad.',
  },
];

const TIPS_SEGURIDAD = [
  {
    titulo: 'Configurá perfiles infantiles desde el principio',
    desc: 'Todas las plataformas principales permiten crear perfiles específicos para niños. Estos perfiles tienen acceso restringido automáticamente y una interfaz simplificada. Hacé esto antes de darles el dispositivo: es más fácil que tratar de corregirlo después.',
  },
  {
    titulo: 'No compartas tu contraseña principal con los niños',
    desc: 'Si los niños conocen la contraseña del perfil adulto, pueden acceder a todo el contenido sin restricciones. Configura un PIN parental que sea diferente y que solo los adultos conozcan.',
  },
  {
    titulo: 'Revisá el historial de visualización regularmente',
    desc: 'Todas las plataformas muestran qué vio cada perfil y por cuánto tiempo. Revisar esto cada semana te da información valiosa sobre los hábitos de consumo de tus hijos y si hay algo que te preocupe.',
  },
  {
    titulo: 'Acordá tiempos de pantalla antes de que sea un problema',
    desc: 'El streaming no tiene la presión del horario de TV lineal, lo cual es una ventaja para pausar cuando querés, pero también puede llevar a maratones largas. Establecer reglas claras desde el principio (ej: máximo 1 hora antes de cenar) es más fácil que ponerlas cuando ya es un hábito.',
  },
  {
    titulo: 'Ver juntos es diferente a ver solo',
    desc: 'El contenido infantil de calidad —Pixar, los documentales de National Geographic, ciertos shows de Disney— está diseñado para ser disfrutado en familia. Cuando podés, ver con tus hijos convierte el streaming en tiempo compartido en lugar de tiempo separado.',
  },
];

const RECOMENDACIONES_EDAD = [
  { rango: '2 a 4 años', plataforma: 'Paramount+ o Disney+', contenido: 'PAW Patrol, Bluey, Peppa Pig, Disney Babies. Contenido corto, colores brillantes, sin violencia, mensajes simples de amistad y familia.' },
  { rango: '5 a 7 años', plataforma: 'Disney+ principalmente', contenido: 'Clásicos Disney, Pixar, Dibujos animados de acción suave. Historias con moraleja clara, algo de tensión dramática, sin violencia real.' },
  { rango: '8 a 11 años', plataforma: 'Disney+ + Netflix', contenido: 'Aventura, ciencia ficción suave, animación más compleja. Series como Avatar: The Last Airbender, The Bad Guys, Spy Kids.' },
  { rango: '12 a 14 años', plataforma: 'Cualquier plataforma con supervisión', contenido: 'Pueden manejar más complejidad narrativa. Buen momento para introducir cine de calidad: Pixar avanzado, películas ganadoras de Oscar, animación japonesa adecuada.' },
];

export default function StreamingNinosPage() {
  return (
    <div className="min-h-screen bg-dv-bg pt-20">
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-10">
        <Link href="/guias" className="inline-flex items-center gap-1.5 text-dv-muted hover:text-white text-sm mb-6 transition-colors">
          <ArrowLeft size={14} /> Todas las guías
        </Link>

        <div className="mb-8">
          <span className="text-dv-accent text-xs font-bold uppercase tracking-widest">Guía para familias</span>
          <h1 className="text-white text-3xl md:text-4xl font-black mt-2 mb-3">
            Streaming para niños en Uruguay: guía para padres (2026)
          </h1>
          <p className="text-white/60 text-lg leading-relaxed">
            Elegir qué plataforma poner en el tablet de tus hijos no es una decisión trivial. En DondeVeo analizamos las opciones disponibles en Uruguay desde la perspectiva de los padres: calidad del contenido infantil, controles parentales y relación precio-valor.
          </p>
          <p className="text-white/50 text-sm mt-2">Guía editorial · DondeVeo Uruguay · Mayo 2026</p>
        </div>

        {/* Intro editorial */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-10">
          <div className="flex items-start gap-3">
            <Shield size={20} className="text-dv-accent flex-shrink-0 mt-0.5" />
            <div>
              <h2 className="text-white font-bold mb-2">Lo que importa cuando hay niños en casa</h2>
              <p className="text-white/70 text-sm leading-relaxed mb-2">
                Hay tres preguntas que los padres nos hacen constantemente: ¿Qué plataforma tiene el mejor contenido para niños? ¿Cómo me aseguro de que no accedan a contenido inadecuado? ¿Vale la pena pagar dos plataformas o con una alcanza?
              </p>
              <p className="text-white/70 text-sm leading-relaxed">
                La respuesta corta: <strong className="text-white">Disney+ es imprescindible si tenés niños de 3 a 12 años</strong>. Para complementar, depende del presupuesto. Acá te explicamos todo en detalle.
              </p>
            </div>
          </div>
        </div>

        {/* Recomendaciones por edad */}
        <h2 className="text-white text-2xl font-black mb-4">¿Qué ver según la edad?</h2>
        <p className="text-white/55 text-sm mb-6">El contenido adecuado cambia mucho según la etapa de desarrollo. Esta es nuestra guía general:</p>
        <div className="grid sm:grid-cols-2 gap-4 mb-12">
          {RECOMENDACIONES_EDAD.map((item) => (
            <div key={item.rango} className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-bold text-sm">{item.rango}</span>
                <span className="text-dv-accent text-xs font-semibold">{item.plataforma}</span>
              </div>
              <p className="text-white/55 text-xs leading-relaxed">{item.contenido}</p>
            </div>
          ))}
        </div>

        {/* Plataformas */}
        <h2 className="text-white text-2xl font-black mb-6">Plataformas analizadas para familias</h2>
        <div className="space-y-8 mb-12">
          {PLATAFORMAS.map((p) => (
            <div key={p.nombre} className="border border-white/10 rounded-2xl overflow-hidden">
              <div className="bg-white/5 px-6 py-4 flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h3 className="text-white text-xl font-black">{p.nombre}</h3>
                  <div className="flex items-center gap-3 mt-1 text-sm">
                    <span className="text-dv-accent font-bold">{p.precio}</span>
                    <span className="text-white/40">·</span>
                    <span className="text-white/50">Edad recomendada: {p.edadRecomendada}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className={`text-lg ${i < p.rating ? 'text-yellow-400' : 'text-white/15'}`}>★</span>
                  ))}
                </div>
              </div>
              <div className="p-6">
                <p className="text-white/65 text-sm leading-relaxed mb-4">{p.descripcion}</p>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-white text-xs font-bold uppercase tracking-wide mb-2">Contenido destacado para niños</p>
                    <ul className="space-y-1.5">
                      {p.contenidoDestacado.map((c) => (
                        <li key={c} className="flex items-start gap-2 text-xs text-white/60">
                          <Check size={11} className="text-green-400 flex-shrink-0 mt-0.5" /> {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="mb-4">
                      <p className="text-white text-xs font-bold uppercase tracking-wide mb-2">Control parental</p>
                      <p className="text-white/60 text-xs leading-relaxed">{p.controlParental}</p>
                    </div>
                    <div>
                      <p className="text-white text-xs font-bold uppercase tracking-wide mb-2">Desventajas</p>
                      <ul className="space-y-1">
                        {p.desventajas.map((d) => (
                          <li key={d} className="flex items-start gap-2 text-xs text-white/55">
                            <X size={11} className="text-red-400 flex-shrink-0 mt-0.5" /> {d}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-dv-accent/8 border border-dv-accent/20 rounded-xl p-3">
                  <p className="text-dv-accent text-xs font-bold mb-1">Veredicto DondeVeo</p>
                  <p className="text-white/70 text-sm">{p.veredicto}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tips de seguridad */}
        <h2 className="text-white text-2xl font-black mb-2">Tips de seguridad y uso responsable</h2>
        <p className="text-white/55 text-sm mb-6">Más allá de elegir la plataforma, estos son los hábitos que marcan la diferencia:</p>
        <div className="space-y-4 mb-10">
          {TIPS_SEGURIDAD.map((tip) => (
            <div key={tip.titulo} className="flex gap-4 border border-white/10 rounded-xl p-4">
              <Shield size={16} className="text-dv-accent flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-white font-bold text-sm mb-1">{tip.titulo}</p>
                <p className="text-white/60 text-sm leading-relaxed">{tip.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Conclusión */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
          <h2 className="text-white text-xl font-bold mb-3">Nuestra recomendación final para familias uruguayas</h2>
          <div className="space-y-3 text-white/70 text-sm leading-relaxed">
            <p>
              Si tenés un solo presupuesto para streaming y hay niños en casa: <strong className="text-white">Disney+ es la elección</strong>. Tiene el mejor catálogo infantil del mercado, controles parentales muy bien implementados y un precio razonable para lo que ofrece.
            </p>
            <p>
              Si podés pagar dos plataformas y los adultos también consumen contenido: <strong className="text-white">Disney+ + Prime Video</strong> (o Disney+ + Max). Los niños en Disney+, los adultos en la segunda opción según sus gustos.
            </p>
            <p>
              Si el presupuesto es ajustado: <strong className="text-white">Paramount+ a $299</strong> para el contenido de Nickelodeon (PAW Patrol, SpongeBob) más <strong className="text-white">Pluto TV gratis</strong> como complemento.
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/guias/plataformas-streaming-uruguay" className="text-sm bg-white/8 hover:bg-white/15 text-white px-4 py-2 rounded-lg transition-colors">Comparar todas las plataformas →</Link>
          <Link href="/guias/precio-streaming-uruguay" className="text-sm bg-white/8 hover:bg-white/15 text-white px-4 py-2 rounded-lg transition-colors">Precios en detalle →</Link>
          <Link href="/plataforma/disneyplus" className="text-sm bg-white/8 hover:bg-white/15 text-white px-4 py-2 rounded-lg transition-colors">Ver catálogo Disney+ →</Link>
        </div>
      </div>
    </div>
  );
}
