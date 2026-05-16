import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Star } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Las mejores películas en streaming Uruguay 2026 — DondeVeo',
  description: 'Selección editorial de las mejores películas disponibles en streaming en Uruguay en 2026. Netflix, Disney+, Max, Prime Video y Mubi: lo imprescindible que no podés perderte.',
  keywords: ['mejores peliculas netflix uruguay 2026', 'que peliculas ver streaming uruguay', 'peliculas recomendadas streaming uruguay', 'mejores peliculas prime video uruguay'],
  alternates: { canonical: 'https://www.uru2.com/guias/mejores-peliculas-streaming-uruguay' },
  openGraph: { title: 'Las mejores películas en streaming Uruguay 2026', type: 'article', locale: 'es_UY' },
};

const CATEGORIAS = [
  {
    titulo: 'Imprescindibles de todos los tiempos',
    descripcion: 'Las películas que definieron generaciones y que no tienen excusa para no haber visto. Están disponibles en streaming en Uruguay ahora mismo.',
    peliculas: [
      {
        titulo: 'El padrino',
        anio: 1972,
        plataforma: 'Prime Video',
        rating: 9.2,
        director: 'Francis Ford Coppola',
        desc: 'La película más influyente de la historia del cine moderno. La saga Corleone sentó las bases de cómo contar una historia criminal con profundidad dramática. El tiempo no la envejece.',
        paraQuien: 'Para cualquier persona que ame el cine. No hace falta ser fan del género policial; es simplemente la mejor actuación de Marlon Brando y una de las escrituras más perfectas del cine.',
      },
      {
        titulo: 'Pulp Fiction',
        anio: 1994,
        plataforma: 'Pluto TV / Alquiler',
        rating: 8.9,
        director: 'Quentin Tarantino',
        desc: 'La película que popularizó la narrativa no lineal y los diálogos como forma de entretenimiento. Tarantino en su mejor versión, antes de que la autoconciencia lo consumiera.',
        paraQuien: 'Para quienes disfrutan del cine que toma riesgos con la forma. Tiene violencia estilizada; no es para todos, pero si te funciona, te va a quedar grabada.',
      },
      {
        titulo: 'Forrest Gump',
        anio: 1994,
        plataforma: 'Prime Video',
        rating: 8.8,
        director: 'Robert Zemeckis',
        desc: 'Una de las pocas películas que logra mezclar comedia, drama, historia y nostalgia sin perder coherencia. Tom Hanks entrega una de las actuaciones más queridas del cine popular.',
        paraQuien: 'Para cualquier momento y cualquier estado de ánimo. Es la película que le podés mostrar a tu abuela y a tu hermano adolescente con el mismo resultado.',
      },
    ],
  },
  {
    titulo: 'Lo mejor de los últimos cinco años',
    descripcion: 'Películas recientes que ya se ganaron un lugar permanente en la conversación cinematográfica. Algunas las viste en el cine; otras quizás te las perdiste.',
    peliculas: [
      {
        titulo: 'Oppenheimer',
        anio: 2023,
        plataforma: 'Max',
        rating: 8.9,
        director: 'Christopher Nolan',
        desc: 'Tres horas que pasan en un suspiro. Nolan logró hacer emocionante el debate ético sobre la bomba atómica. Cillian Murphy construyó el personaje de la década. La escena de la prueba Trinity es uno de los momentos cinematográficos más impactantes en años.',
        paraQuien: 'Para quienes aprecian el cine de ideas que también es espectáculo. Requiere atención pero recompensa generosamente.',
      },
      {
        titulo: 'Everything Everywhere All at Once',
        anio: 2022,
        plataforma: 'Prime Video',
        rating: 8.2,
        director: 'The Daniels',
        desc: 'La película que ganó todo en los Oscar 2023 con razón. Una madre china-americana descubre que puede acceder a universos paralelos. Suena absurda; es una de las historias más emocionantes sobre familia e identidad que se han filmado.',
        paraQuien: 'Para quienes están dispuestos a dejarse llevar por algo completamente original. Las primeras escenas son caóticas; vale la pena aguantar.',
      },
      {
        titulo: 'Anatomía de una caída',
        anio: 2023,
        plataforma: 'Mubi',
        rating: 8.1,
        director: 'Justine Triet',
        desc: 'Ganadora de la Palma de Oro en Cannes. Un escritor aparece muerto en la nieve; su esposa es la principal sospechosa. El juicio que sigue es una disección del matrimonio, la memoria y la culpa que no tiene respuestas fáciles.',
        paraQuien: 'Para quienes disfrutan del cine europeo de autor y los dramas legales que van más allá del género.',
      },
      {
        titulo: 'La sociedad de la nieve',
        anio: 2023,
        plataforma: 'Netflix',
        rating: 8.0,
        director: 'J.A. Bayona',
        desc: 'La historia del accidente aéreo de los Andes de 1972, contada con rigor y respeto. La producción es extraordinaria y el relato de supervivencia es uno de los más honestos del cine. Se siente uruguaya y latinoamericana de una manera que pocas producciones logran.',
        paraQuien: 'Para todos, pero especialmente para el público rioplatense que conoce la historia y quiere verla contada con la dignidad que merece.',
      },
    ],
  },
  {
    titulo: 'Cine latinoamericano en streaming',
    descripcion: 'El cine de nuestra región que está disponible en las plataformas y que merece más atención de la que recibe.',
    peliculas: [
      {
        titulo: 'Roma',
        anio: 2018,
        plataforma: 'Netflix',
        rating: 7.7,
        director: 'Alfonso Cuarón',
        desc: 'Alfonso Cuarón filmó sus propios recuerdos de infancia en Ciudad de México. En blanco y negro, con planos largos y sin prisas, cuenta la historia de una trabajadora doméstica de una manera que pocos directores han logrado. Ganó el León de Oro en Venecia.',
        paraQuien: 'Para quienes aprecian el cine pausado y visual. No tiene grandes giros; su poder está en la observación.',
      },
      {
        titulo: 'El agente topo',
        anio: 2020,
        plataforma: 'Mubi',
        rating: 7.3,
        director: 'Maite Alberdi',
        desc: 'Un documental chileno sobre un hombre de 83 años que se infiltra en un hogar de ancianos para investigar si maltratan a los residentes. Suena triste; es entrañable, divertido y finalmente muy emocionante.',
        paraQuien: 'Para cualquiera que quiera un documental diferente. Es una de las películas más originales del cine latinoamericano reciente.',
      },
      {
        titulo: 'La quietud',
        anio: 2018,
        plataforma: 'Prime Video',
        rating: 6.8,
        director: 'Pablo Trapero',
        desc: 'Drama familiar argentino con Martina Gusmán y Bérénice Bejo. Una familia de campo bonaerense enfrenta secretos del pasado durante la dictadura. Trapero en su veta más personal y oscura.',
        paraQuien: 'Para quienes disfrutan del drama familiar con contexto histórico y actuaciones de nivel internacional.',
      },
    ],
  },
  {
    titulo: 'Documentales imprescindibles',
    descripcion: 'El documental se convirtió en uno de los géneros más consumidos en streaming. Estos son los que vale la pena ver.',
    peliculas: [
      {
        titulo: 'Making a Murderer',
        anio: 2015,
        plataforma: 'Netflix',
        rating: 8.6,
        director: 'Laura Ricciardi / Moira Demos',
        desc: 'La docuserie que popularizó el true crime en streaming. La historia de Steven Avery, condenado por asesinato en circunstancias profundamente cuestionables. Te va a hacer cuestionar el sistema judicial.',
        paraQuien: 'Para quienes no vieron el boom del true crime y quieren empezar por lo mejor. Son 10 episodios que enganchan desde el primero.',
      },
      {
        titulo: 'My Octopus Teacher',
        anio: 2020,
        plataforma: 'Netflix',
        rating: 8.1,
        director: 'Pippa Ehrlich / James Reed',
        desc: 'Ganadora del Oscar al Mejor Documental. Un documentalista sudafricano construye una amistad con un pulpo durante un año de buceo diario. Suena simple; es profundamente emocionante.',
        paraQuien: 'Para cualquier persona, en cualquier estado de ánimo. Es uno de esos documentales que te recuerdan por qué el mundo natural es extraordinario.',
      },
    ],
  },
];

export default function MejoresPeliculasPage() {
  return (
    <div className="min-h-screen bg-dv-bg pt-20">
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-10">
        <Link href="/guias" className="inline-flex items-center gap-1.5 text-dv-muted hover:text-white text-sm mb-6 transition-colors">
          <ArrowLeft size={14} /> Todas las guías
        </Link>

        <div className="mb-8">
          <span className="text-dv-accent text-xs font-bold uppercase tracking-widest">Guía editorial</span>
          <h1 className="text-white text-3xl md:text-4xl font-black mt-2 mb-3">
            Las mejores películas en streaming Uruguay (2026)
          </h1>
          <p className="text-white/60 text-lg leading-relaxed">
            De miles de películas disponibles en streaming en Uruguay, estas son las que consideramos imprescindibles. No organizadas por algoritmo ni por popularidad, sino por criterio editorial: calidad narrativa, impacto cultural y valor como experiencia cinematográfica.
          </p>
          <p className="text-white/50 text-sm mt-2">Selección editorial · DondeVeo Uruguay · Mayo 2026</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-10">
          <p className="text-white/70 text-sm leading-relaxed">
            <strong className="text-white">Cómo elegimos estas películas:</strong> Nuestro equipo editorial las seleccionó basándose en calidad cinematográfica objetiva (guión, dirección, actuaciones), impacto cultural duradero y disponibilidad real en las plataformas de Uruguay al momento de publicación. No recibimos compensación de ninguna plataforma por estas menciones.
          </p>
        </div>

        {CATEGORIAS.map((cat) => (
          <section key={cat.titulo} className="mb-14">
            <h2 className="text-white text-2xl font-black mb-2">{cat.titulo}</h2>
            <p className="text-white/50 text-sm mb-6">{cat.descripcion}</p>
            <div className="space-y-6">
              {cat.peliculas.map((p) => (
                <div key={p.titulo} className="border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-colors">
                  <div className="flex items-start justify-between gap-4 flex-wrap mb-3">
                    <div>
                      <h3 className="text-white text-xl font-black">{p.titulo}</h3>
                      <div className="flex items-center gap-3 mt-1 text-sm text-white/40">
                        <span>{p.anio}</span>
                        <span>·</span>
                        <span>{p.director}</span>
                        <span>·</span>
                        <div className="flex items-center gap-1">
                          <Star size={11} className="text-yellow-400 fill-yellow-400" />
                          <span className="text-yellow-400 font-bold">{p.rating}</span>
                        </div>
                      </div>
                    </div>
                    <span className="text-xs bg-dv-accent/15 text-dv-accent border border-dv-accent/25 px-3 py-1 rounded-full font-semibold flex-shrink-0">
                      {p.plataforma}
                    </span>
                  </div>
                  <p className="text-white/65 text-sm leading-relaxed mb-3">{p.desc}</p>
                  <div className="bg-dv-accent/8 border border-dv-accent/20 rounded-xl p-3">
                    <p className="text-dv-accent text-xs font-bold mb-1">¿Para quién es?</p>
                    <p className="text-white/65 text-sm">{p.paraQuien}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
          <h2 className="text-white text-xl font-bold mb-3">Un consejo sobre listas de "mejores películas"</h2>
          <p className="text-white/70 leading-relaxed mb-3">
            Las listas son inevitablemente subjetivas. Hay películas extraordinarias que no están acá porque no están disponibles en streaming en Uruguay en este momento, o porque el espacio es limitado. Esta guía no pretende ser definitiva.
          </p>
          <p className="text-white/70 leading-relaxed mb-3">
            Lo que sí te garantizamos: ninguna de estas películas te va a hacer perder el tiempo. Todas tienen algo genuino para ofrecer, ya sea técnicamente, emocionalmente o como experiencia narrativa. En eso sí somos firmes.
          </p>
          <p className="text-white/70 leading-relaxed">
            Si querés buscar una película específica y saber en qué plataforma está disponible en Uruguay, usá el buscador de DondeVeo. Te decimos exactamente dónde verla hoy.
          </p>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/guias/mejores-series-netflix-uruguay" className="text-sm bg-white/8 hover:bg-white/15 text-white px-4 py-2 rounded-lg transition-colors">Mejores series →</Link>
          <Link href="/genero/drama" className="text-sm bg-white/8 hover:bg-white/15 text-white px-4 py-2 rounded-lg transition-colors">Drama →</Link>
          <Link href="/genero/comedia" className="text-sm bg-white/8 hover:bg-white/15 text-white px-4 py-2 rounded-lg transition-colors">Comedia →</Link>
          <Link href="/guias" className="text-sm bg-white/8 hover:bg-white/15 text-white px-4 py-2 rounded-lg transition-colors">Todas las guías →</Link>
        </div>
      </div>
    </div>
  );
}
