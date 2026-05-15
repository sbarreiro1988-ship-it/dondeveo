import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: '¿Qué ver este finde en streaming Uruguay? — Guía DondeVeo',
  description: 'Recomendaciones editoriales de DondeVeo para el fin de semana. Películas y series para ver el sábado y domingo en Netflix, Disney+, Max, Prime Video y más plataformas en Uruguay.',
  alternates: { canonical: 'https://www.uru2.com/guias/que-ver-este-finde' },
  openGraph: { title: '¿Qué ver este finde en streaming Uruguay?', type: 'article' },
};

const PLANES = [
  {
    plan: '🧘 Noche tranquila solo/a',
    descripcion: 'Querés algo que no te exija demasiado pero que esté bueno. Nada de gore ni thrillers intensos.',
    recomendaciones: [
      { titulo: 'The Bear', plataforma: 'Disney+', tipo: 'Serie', desc: 'Un chef de alta cocina vuelve a Chicago para salvar el restaurant familiar. Caótica, intensa y sorprendentemente emotiva.' },
      { titulo: 'Everything Everywhere All at Once', plataforma: 'Prime Video', tipo: 'Película', desc: 'La ganadora del Oscar que mezcla multiversos, filosofía existencial y humor absurdo. Una de las mejores películas de la última década.' },
      { titulo: 'Fleabag', plataforma: 'Prime Video', tipo: 'Serie', desc: '2 temporadas cortas, brillante guión, actuación magistral. Empieza como comedia y termina siendo una de las mejores historias sobre el dolor y la soledad.' },
    ],
  },
  {
    plan: '👨‍👩‍👧 Noche en familia',
    descripcion: 'Con chicos en casa o querés algo que puedan ver todos juntos sin filtros.',
    recomendaciones: [
      { titulo: 'El libro de la selva', plataforma: 'Disney+', tipo: 'Película', desc: 'La versión de acción real de 2016 es visualmente impresionante y la disfrutan tanto chicos como grandes.' },
      { titulo: 'Moana 2', plataforma: 'Disney+', tipo: 'Película', desc: 'La secuela de una de las animaciones más queridas de Disney. Canciones nuevas y la misma energía de aventura.' },
      { titulo: 'Avatar: The Last Airbender', plataforma: 'Netflix', tipo: 'Serie', desc: 'La adaptación live-action de la querida serie animada. Mundos fantásticos, acción y valores humanos que trascienden la edad.' },
    ],
  },
  {
    plan: '🍿 Maratón con amigos',
    descripcion: 'Son varios, quieren algo que genere conversación, risas o suspenso compartido.',
    recomendaciones: [
      { titulo: 'Juego del Calamar', plataforma: 'Netflix', tipo: 'Serie', desc: 'Si alguno del grupo no la vio, esta es la excusa perfecta. El suspenso y el impacto emocional funcionan igual de bien en grupo.' },
      { titulo: 'The Gentleman', plataforma: 'Netflix', tipo: 'Serie', desc: 'Guy Ritchie en su salsa: gangsters ingleses, diálogos brillantes y giros inesperados. Perfecta para ver con alguien que aprecie el estilo.' },
      { titulo: 'Glass Onion', plataforma: 'Netflix', tipo: 'Película', desc: 'El thriller de misterio que podés ver sin haber visto Knives Out. Divertida, con giros y muy entretenida en grupo.' },
    ],
  },
  {
    plan: '🎬 Película de autor para el domingo',
    descripcion: 'Te quedó el domingo libre y querés ver algo que valga la pena, que te deje pensando.',
    recomendaciones: [
      { titulo: 'Oppenheimer', plataforma: 'Max', tipo: 'Película', desc: '3 horas que pasan en un suspiro. Nolan en su mejor versión, con Cillian Murphy dando la actuación de su vida.' },
      { titulo: 'Anatomía de una caída', plataforma: 'Mubi', tipo: 'Película', desc: 'La ganadora de Cannes y nominada al Oscar. Un juicio que deconstruye el matrimonio, la memoria y la culpa. Te va a quedar dando vueltas.' },
      { titulo: 'Past Lives', plataforma: 'Mubi', tipo: 'Película', desc: 'Una historia de amor callada, melancólica y profundamente humana. Una de las mejores películas del año que probablemente te perdiste.' },
    ],
  },
];

export default function QueVerEsteFindesPage() {
  return (
    <div className="min-h-screen bg-dv-bg pt-20">
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-10">
        <Link href="/guias" className="inline-flex items-center gap-1.5 text-dv-muted hover:text-white text-sm mb-6 transition-colors">
          <ArrowLeft size={14} /> Todas las guías
        </Link>

        <div className="mb-8">
          <span className="text-dv-accent text-xs font-bold uppercase tracking-widest">Guía editorial</span>
          <h1 className="text-white text-3xl md:text-4xl font-black mt-2 mb-3">
            ¿Qué ver este fin de semana en streaming?
          </h1>
          <p className="text-white/60 text-lg leading-relaxed">
            No todas las noches del finde son iguales. A veces querés algo liviano, otras algo que te impacte. Acá organizamos las mejores recomendaciones por tipo de noche para que no pierdas el tiempo buscando.
          </p>
          <p className="text-white/50 text-sm mt-2">Guía editorial · DondeVeo Uruguay</p>
        </div>

        <div className="space-y-10">
          {PLANES.map((plan) => (
            <div key={plan.plan}>
              <div className="mb-4">
                <h2 className="text-white text-2xl font-black">{plan.plan}</h2>
                <p className="text-white/50 text-sm mt-1">{plan.descripcion}</p>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                {plan.recomendaciones.map((rec) => (
                  <div key={rec.titulo} className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-white/20 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] bg-dv-accent/20 text-dv-accent px-2 py-0.5 rounded font-bold">{rec.tipo}</span>
                      <span className="text-[10px] text-white/40">{rec.plataforma}</span>
                    </div>
                    <h3 className="text-white font-bold mb-2">{rec.titulo}</h3>
                    <p className="text-white/55 text-xs leading-relaxed">{rec.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-white text-xl font-bold mb-3">El truco de DondeVeo para elegir rápido</h2>
          <p className="text-white/70 leading-relaxed mb-3">
            Si llegás al viernes sin idea de qué ver, acá va nuestra estrategia: buscá el título que tenés pendiente desde hace meses pero nunca te animaste. Ese que todos te recomendaron y vos siempre dijiste "sí, la tengo que ver". El fin de semana es el momento.
          </p>
          <p className="text-white/70 leading-relaxed">
            Y si querés algo nuevo, revisá nuestro <Link href="/" className="text-dv-accent hover:underline">Top 10 semanal</Link> que se actualiza todos los días con lo más popular de cada plataforma en Uruguay.
          </p>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/genero/comedia" className="text-sm bg-white/8 hover:bg-white/15 text-white px-4 py-2 rounded-lg transition-colors">Comedias →</Link>
          <Link href="/genero/drama" className="text-sm bg-white/8 hover:bg-white/15 text-white px-4 py-2 rounded-lg transition-colors">Dramas →</Link>
          <Link href="/genero/accion" className="text-sm bg-white/8 hover:bg-white/15 text-white px-4 py-2 rounded-lg transition-colors">Acción →</Link>
        </div>
      </div>
    </div>
  );
}
