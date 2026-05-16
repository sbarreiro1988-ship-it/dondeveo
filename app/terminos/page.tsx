import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Términos de Uso — DondeVeo Uruguay',
  description: 'Términos y condiciones de uso del sitio web DondeVeo Uruguay. Conocé las reglas que rigen el uso de nuestra plataforma de información de streaming.',
  alternates: { canonical: 'https://www.uru2.com/terminos' },
};

export default function TerminosPage() {
  return (
    <div className="min-h-screen bg-dv-bg pt-20">
      <div className="max-w-3xl mx-auto px-4 md:px-8 py-12">
        <h1 className="text-white text-3xl md:text-4xl font-black mb-3">Términos de Uso</h1>
        <p className="text-dv-muted text-sm mb-10">Última actualización: mayo de 2026</p>

        <div className="prose prose-invert max-w-none space-y-8 text-white/70 leading-relaxed">

          <section>
            <h2 className="text-white text-xl font-bold mb-3">1. Aceptación de los términos</h2>
            <p>Al acceder y usar DondeVeo (uru2.com), aceptás estos Términos de Uso. Si no estás de acuerdo con alguna parte de estos términos, por favor no uses el sitio.</p>
          </section>

          <section>
            <h2 className="text-white text-xl font-bold mb-3">2. Descripción del servicio</h2>
            <p>DondeVeo es un servicio de información que indica en qué plataformas de streaming están disponibles películas y series en Uruguay. También publicamos noticias y artículos sobre el mundo del cine y el entretenimiento.</p>
            <p className="mt-3">DondeVeo <strong className="text-white">no</strong> ofrece contenido audiovisual propio, no vende suscripciones a ninguna plataforma y no almacena películas ni series.</p>
          </section>

          <section>
            <h2 className="text-white text-xl font-bold mb-3">3. Exactitud de la información</h2>
            <p>Los datos de disponibilidad de contenido son orientativos y se obtienen de fuentes externas (TMDB). Las plataformas de streaming pueden modificar su catálogo en cualquier momento sin previo aviso.</p>
            <p className="mt-3">DondeVeo no garantiza la exactitud absoluta de la información y no se responsabiliza por decisiones tomadas en base a los datos mostrados. Siempre verificá en la plataforma correspondiente antes de suscribirte.</p>
          </section>

          <section>
            <h2 className="text-white text-xl font-bold mb-3">4. Propiedad intelectual</h2>
            <p>Los posters, imágenes de películas y series, logos de plataformas y demás material audiovisual son propiedad de sus respectivos titulares. Su uso en DondeVeo es informativo y sin fines comerciales directos.</p>
            <p className="mt-3">Los textos editoriales, diseño y código del sitio son propiedad de DondeVeo. No podés reproducirlos sin autorización expresa.</p>
          </section>

          <section>
            <h2 className="text-white text-xl font-bold mb-3">5. Uso permitido</h2>
            <p>Podés usar DondeVeo para:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Buscar dónde ver contenido en Uruguay</li>
              <li>Leer noticias de entretenimiento</li>
              <li>Explorar el catálogo por géneros y plataformas</li>
            </ul>
            <p className="mt-3">Está prohibido:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Usar el sitio para actividades ilegales</li>
              <li>Hacer scraping masivo automatizado sin autorización</li>
              <li>Intentar vulnerar la seguridad del sitio</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white text-xl font-bold mb-3">6. Publicidad</h2>
            <p>DondeVeo puede mostrar publicidad de terceros (incluyendo Google AdSense) para financiar el servicio gratuito. La publicidad se rige por las políticas del anunciante correspondiente.</p>
          </section>

          <section>
            <h2 className="text-white text-xl font-bold mb-3">7. Privacidad</h2>
            <p>El tratamiento de datos personales está detallado en nuestra <Link href="/privacidad" className="text-dv-accent hover:underline">Política de Privacidad</Link>.</p>
          </section>

          <section>
            <h2 className="text-white text-xl font-bold mb-3">8. Modificaciones</h2>
            <p>Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios entran en vigor desde su publicación en este sitio.</p>
          </section>

          <section>
            <h2 className="text-white text-xl font-bold mb-3">9. Contacto</h2>
            <p>Para consultas sobre estos términos, escribinos a <a href="mailto:hola@uru2.com" className="text-dv-accent hover:underline">hola@uru2.com</a> o visitá nuestra página de <Link href="/contacto" className="text-dv-accent hover:underline">Contacto</Link>.</p>
          </section>

        </div>
      </div>
    </div>
  );
}
