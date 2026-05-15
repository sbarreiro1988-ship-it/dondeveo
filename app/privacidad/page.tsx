import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Política de Privacidad',
  description: 'Política de privacidad de DondeVeo Uruguay — cómo usamos tus datos.',
  alternates: { canonical: 'https://www.uru2.com/privacidad' },
};

export default function PrivacidadPage() {
  const updated = '3 de mayo de 2026';

  return (
    <div className="min-h-screen bg-dv-bg">
      <div className="max-w-3xl mx-auto px-4 py-10">

        <Link href="/" className="inline-flex items-center gap-1.5 text-dv-muted hover:text-white text-sm mb-8 transition-colors">
          <ArrowLeft size={14} /> Inicio
        </Link>

        <h1 className="text-white text-3xl font-black mb-2">Política de Privacidad</h1>
        <p className="text-dv-muted text-sm mb-10">Última actualización: {updated}</p>

        <div className="space-y-8 text-white/80 leading-relaxed">

          <section>
            <h2 className="text-white text-lg font-bold mb-3">1. Información general</h2>
            <p>
              DondeVeo (<strong>uru2.com</strong>) es una guía de streaming para Uruguay que te ayuda a encontrar
              dónde ver películas y series en las principales plataformas. Esta política explica qué datos
              recopilamos, cómo los usamos y cómo los protegemos.
            </p>
          </section>

          <section>
            <h2 className="text-white text-lg font-bold mb-3">2. Datos que recopilamos</h2>
            <p className="mb-3">DondeVeo no requiere registro ni cuenta de usuario. No almacenamos datos personales identificables. Sin embargo, como cualquier sitio web, se recopilan automáticamente los siguientes datos de navegación:</p>
            <ul className="list-disc list-inside space-y-1 text-white/70 ml-2">
              <li>Dirección IP (anonimizada)</li>
              <li>Tipo de navegador y dispositivo</li>
              <li>Páginas visitadas y tiempo de permanencia</li>
              <li>País/región de acceso</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white text-lg font-bold mb-3">3. Cookies y tecnologías de seguimiento</h2>
            <p className="mb-3">Utilizamos las siguientes tecnologías:</p>
            <div className="space-y-3">
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="text-white font-semibold mb-1">Google Analytics</p>
                <p className="text-sm text-white/60">Mide el tráfico y comportamiento de los usuarios de forma anónima. Podés opt-out en <a href="https://tools.google.com/dlpage/gaoptout" className="text-dv-accent hover:underline" target="_blank" rel="noopener noreferrer">tools.google.com/dlpage/gaoptout</a></p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="text-white font-semibold mb-1">Google AdSense</p>
                <p className="text-sm text-white/60">Muestra publicidad personalizada basada en tu historial de navegación. Podés gestionar tus preferencias en <a href="https://adssettings.google.com" className="text-dv-accent hover:underline" target="_blank" rel="noopener noreferrer">adssettings.google.com</a></p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="text-white font-semibold mb-1">Cookies técnicas</p>
                <p className="text-sm text-white/60">Necesarias para el funcionamiento del sitio (preferencias de idioma, sesión). No contienen datos personales.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-white text-lg font-bold mb-3">4. Uso de la información</h2>
            <p className="mb-2">Los datos recopilados se usan exclusivamente para:</p>
            <ul className="list-disc list-inside space-y-1 text-white/70 ml-2">
              <li>Mejorar la experiencia y el contenido del sitio</li>
              <li>Analizar el tráfico y detectar errores técnicos</li>
              <li>Mostrar publicidad relevante a través de Google AdSense</li>
            </ul>
            <p className="mt-3">No vendemos, alquilamos ni compartimos tus datos con terceros ajenos a los servicios mencionados.</p>
          </section>

          <section>
            <h2 className="text-white text-lg font-bold mb-3">5. Publicidad de terceros</h2>
            <p>
              DondeVeo utiliza Google AdSense para mostrar anuncios. Google puede usar cookies para mostrar
              anuncios basados en tus visitas anteriores a este u otros sitios web. Para más información sobre
              cómo Google usa los datos de socios publicitarios, visitá{' '}
              <a href="https://policies.google.com/technologies/partner-sites" className="text-dv-accent hover:underline" target="_blank" rel="noopener noreferrer">
                policies.google.com/technologies/partner-sites
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-white text-lg font-bold mb-3">6. Contenido externo</h2>
            <p>
              DondeVeo muestra imágenes y datos provistos por{' '}
              <a href="https://www.themoviedb.org" className="text-dv-accent hover:underline" target="_blank" rel="noopener noreferrer">The Movie Database (TMDB)</a>.
              Al acceder a contenido externo como trailers de YouTube, aplican las políticas de privacidad
              de dichos servicios.
            </p>
          </section>

          <section>
            <h2 className="text-white text-lg font-bold mb-3">7. Tus derechos</h2>
            <p className="mb-2">Tenés derecho a:</p>
            <ul className="list-disc list-inside space-y-1 text-white/70 ml-2">
              <li>Acceder a los datos que tenemos sobre vos</li>
              <li>Solicitar la eliminación de tus datos</li>
              <li>Opt-out de cookies de publicidad y analíticas</li>
              <li>Presentar una queja ante la autoridad de protección de datos de Uruguay (URCDP)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white text-lg font-bold mb-3">8. Seguridad</h2>
            <p>
              El sitio opera bajo HTTPS con certificado SSL. No almacenamos contraseñas ni datos financieros.
              No requerimos registro de usuarios.
            </p>
          </section>

          <section>
            <h2 className="text-white text-lg font-bold mb-3">9. Cambios en esta política</h2>
            <p>
              Podemos actualizar esta política ocasionalmente. La fecha de actualización al inicio de esta
              página siempre refleja la versión más reciente. El uso continuado del sitio implica aceptación
              de los cambios.
            </p>
          </section>

          <section>
            <h2 className="text-white text-lg font-bold mb-3">10. Contacto</h2>
            <p>
              Para consultas sobre privacidad escribinos a{' '}
              <a href="mailto:privacidad@uru2.com" className="text-dv-accent hover:underline">
                privacidad@uru2.com
              </a>
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
