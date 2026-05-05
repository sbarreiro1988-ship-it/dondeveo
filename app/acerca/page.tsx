import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Acerca de DondeVeo Uruguay — Tu guía de streaming',
  description: 'Conocé el equipo detrás de DondeVeo, la guía de streaming más completa de Uruguay. Nuestra misión, cómo trabajamos y por qué lo hacemos.',
  alternates: { canonical: 'https://www.uru2.com/acerca' },
};

export default function AcercaPage() {
  return (
    <div className="min-h-screen bg-dv-bg pt-20">
      <div className="max-w-3xl mx-auto px-4 md:px-8 py-12">

        <h1 className="text-white text-3xl md:text-4xl font-black mb-3">
          Acerca de <span className="text-dv-accent">DondeVeo</span>
        </h1>
        <p className="text-dv-muted text-lg mb-10">Tu guía de streaming hecha en Uruguay, para uruguayos.</p>

        {/* Misión */}
        <section className="mb-10">
          <h2 className="text-white text-xl font-bold mb-4">Nuestra misión</h2>
          <p className="text-white/70 leading-relaxed mb-4">
            DondeVeo nació de una frustración muy simple: pasar más tiempo buscando dónde está una película que en verla. En Uruguay, el catálogo de streaming es enorme pero está fragmentado en docenas de plataformas. ¿Está esa serie en Netflix? ¿O en Max? ¿O en Prime? ¿O quizás en Universal+ que nadie sabe que existe?
          </p>
          <p className="text-white/70 leading-relaxed mb-4">
            Nuestra misión es simple: <strong className="text-white">darte la respuesta en segundos</strong>. Ingresás el nombre de una película o serie, y te decimos exactamente dónde la podés ver en Uruguay hoy mismo, con qué suscripción y en qué plataforma.
          </p>
          <p className="text-white/70 leading-relaxed">
            Porque el tiempo libre es valioso. Y merece ser disfrutado, no desperdiciado buscando.
          </p>
        </section>

        {/* Qué somos */}
        <section className="mb-10">
          <h2 className="text-white text-xl font-bold mb-4">¿Qué es DondeVeo?</h2>
          <p className="text-white/70 leading-relaxed mb-4">
            DondeVeo es una guía de streaming independiente orientada al mercado uruguayo. Actualizamos nuestra base de datos diariamente para reflejar los cambios en los catálogos de Netflix, Disney+, Max, Prime Video, Paramount+, Apple TV+, Pluto TV, Universal+, Crunchyroll y muchas más plataformas disponibles en Uruguay.
          </p>
          <p className="text-white/70 leading-relaxed mb-4">
            Además de ayudarte a encontrar contenido, publicamos noticias del mundo del cine y el streaming: estrenos, tráilers, novedades de plataformas, noticias de actores y directores. Todo en español rioplatense, con la mirada puesta en lo que le interesa al público uruguayo.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {[
              { num: '15+', label: 'Plataformas monitoreadas' },
              { num: '10.000+', label: 'Títulos indexados' },
              { num: 'Diario', label: 'Frecuencia de actualización' },
              { num: '100%', label: 'Gratis para vos' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                <p className="text-dv-accent text-2xl font-black">{stat.num}</p>
                <p className="text-white/50 text-xs mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Cómo funciona */}
        <section className="mb-10">
          <h2 className="text-white text-xl font-bold mb-4">¿Cómo funciona?</h2>
          <div className="space-y-4">
            {[
              {
                paso: '1',
                titulo: 'Datos de TMDB',
                desc: 'Usamos The Movie Database (TMDB), la base de datos de entretenimiento más grande del mundo, para obtener información sobre películas y series: sinopsis, reparto, géneros, calificaciones y disponibilidad en plataformas por región.'
              },
              {
                paso: '2',
                titulo: 'Curación para Uruguay',
                desc: 'Filtramos y verificamos manualmente qué plataformas están disponibles en Uruguay. No mostramos servicios que no existan en el país, aunque TMDB los liste para otras regiones.'
              },
              {
                paso: '3',
                titulo: 'Actualización diaria',
                desc: 'Nuestro sistema revisa los catálogos todos los días para detectar novedades, estrenos y contenido que sale de las plataformas. Los datos siempre están frescos.'
              },
              {
                paso: '4',
                titulo: 'Noticias originales',
                desc: 'Nuestro equipo editorial publica noticias del mundo del cine y streaming en español rioplatense, con información verificada y relevante para el público uruguayo.'
              },
            ].map((item) => (
              <div key={item.paso} className="flex gap-4 bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="w-8 h-8 rounded-full bg-dv-accent text-[#111] font-black flex items-center justify-center flex-shrink-0 text-sm">
                  {item.paso}
                </div>
                <div>
                  <p className="text-white font-bold mb-1">{item.titulo}</p>
                  <p className="text-white/60 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Independencia */}
        <section className="mb-10">
          <h2 className="text-white text-xl font-bold mb-4">Independencia y transparencia</h2>
          <p className="text-white/70 leading-relaxed mb-4">
            DondeVeo es un proyecto independiente. No somos empleados ni afiliados de ninguna plataforma de streaming. Nuestras recomendaciones y listados se basan exclusivamente en los datos de disponibilidad real del contenido, sin influencia comercial de ningún proveedor.
          </p>
          <p className="text-white/70 leading-relaxed mb-4">
            La disponibilidad del contenido puede cambiar sin previo aviso por decisiones de las plataformas. Siempre recomendamos verificar en la plataforma correspondiente antes de suscribirte.
          </p>
          <p className="text-white/70 leading-relaxed">
            Utilizamos datos de <a href="https://www.themoviedb.org" target="_blank" rel="noopener noreferrer" className="text-dv-accent hover:underline">TMDB</a> bajo su licencia de uso no comercial. Los logos e imágenes de películas y series son propiedad de sus respectivos titulares.
          </p>
        </section>

        {/* CTA */}
        <div className="bg-dv-accent/10 border border-dv-accent/30 rounded-2xl p-6 text-center">
          <h2 className="text-white text-xl font-bold mb-2">¿Tenés alguna pregunta o sugerencia?</h2>
          <p className="text-white/60 text-sm mb-4">
            Nos encanta escuchar a nuestra comunidad. Escribinos para sugerencias, reportar errores o cualquier consulta.
          </p>
          <Link href="/contacto"
            className="inline-block bg-dv-accent text-[#111] font-bold px-6 py-2.5 rounded-xl hover:opacity-90 transition-opacity">
            Contactanos
          </Link>
        </div>

      </div>
    </div>
  );
}
