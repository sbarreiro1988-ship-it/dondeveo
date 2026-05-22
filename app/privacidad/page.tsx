import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Política de Privacidad — DondeVeo Uruguay',
  description: 'Política de privacidad de DondeVeo Uruguay. Cómo recopilamos, usamos y protegemos tus datos. Cumplimiento GDPR, CCPA y normativa uruguaya.',
  alternates: { canonical: 'https://www.uru2.com/privacidad' },
  robots: { index: true, follow: true },
};

export default function PrivacidadPage() {
  const updated = '22 de mayo de 2026';

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
              DondeVeo (<strong>uru2.com</strong>, en adelante "el Sitio") es una guía de streaming para Uruguay
              operada por Santiago Barreiro. Esta política de privacidad explica qué datos recopilamos cuando
              visitás el Sitio, cómo los usamos, con quién los compartimos y cuáles son tus derechos.
            </p>
            <p className="mt-3">
              Al usar el Sitio aceptás las prácticas descritas en esta política. Si no estás de acuerdo,
              te pedimos que no uses el Sitio.
            </p>
          </section>

          <section>
            <h2 className="text-white text-lg font-bold mb-3">2. Datos que recopilamos</h2>
            <p className="mb-3">
              DondeVeo <strong>no requiere registro ni cuenta de usuario</strong> y no almacena datos
              personales identificables de forma directa. Sin embargo, como cualquier sitio web, se recopilan
              automáticamente los siguientes datos técnicos de navegación:
            </p>
            <ul className="list-disc list-inside space-y-1 text-white/70 ml-2">
              <li>Dirección IP (anonimizada antes de ser procesada)</li>
              <li>Tipo de navegador, versión y sistema operativo</li>
              <li>Páginas visitadas, tiempo de permanencia y rutas de navegación</li>
              <li>País y región de acceso</li>
              <li>Fuente de tráfico (buscador, enlace directo, red social)</li>
              <li>Resolución de pantalla y tipo de dispositivo</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white text-lg font-bold mb-3">3. Cookies y tecnologías de seguimiento</h2>
            <p className="mb-4">
              El Sitio utiliza cookies y tecnologías similares (píxeles, almacenamiento local) para diversas
              finalidades. A continuación detallamos cada una:
            </p>

            <div className="space-y-4">
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="text-white font-semibold mb-1">Google Analytics</p>
                <p className="text-sm text-white/60 mb-1">
                  Usamos Google Analytics para medir el tráfico y el comportamiento de los usuarios de forma
                  agregada y anónima. Google Analytics establece cookies propias (como <code className="text-dv-accent">_ga</code>,{' '}
                  <code className="text-dv-accent">_gid</code>) que expiran en 2 años y 24 horas respectivamente.
                </p>
                <p className="text-sm text-white/60">
                  Podés opt-out instalando el complemento del navegador:{' '}
                  <a href="https://tools.google.com/dlpage/gaoptout" className="text-dv-accent hover:underline" target="_blank" rel="noopener noreferrer">
                    tools.google.com/dlpage/gaoptout
                  </a>
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="text-white font-semibold mb-1">Publicidad de terceros</p>
                <p className="text-sm text-white/60 mb-2">
                  El Sitio puede mostrar anuncios servidos por redes publicitarias de terceros. Estos terceros
                  pueden usar cookies, web beacons y tecnologías similares para recopilar información sobre
                  tus visitas a este y otros sitios con el fin de proporcionar publicidad relevante para vos.
                </p>
                <p className="text-sm text-white/60 mb-2">
                  La información recopilada por esos terceros (que puede incluir tu dirección IP, el ID de tu
                  dispositivo, el navegador, el sistema operativo y el contenido que consultás) está sujeta a
                  sus propias políticas de privacidad y no está controlada por DondeVeo.
                </p>
                <p className="text-sm text-white/60">
                  Para gestionar las preferencias de publicidad personalizada podés usar:
                </p>
                <ul className="text-sm text-white/60 list-disc list-inside ml-2 mt-1 space-y-1">
                  <li>
                    <a href="https://optout.networkadvertising.org/" className="text-dv-accent hover:underline" target="_blank" rel="noopener noreferrer">
                      Network Advertising Initiative (NAI) opt-out
                    </a>
                  </li>
                  <li>
                    <a href="https://optout.aboutads.info/" className="text-dv-accent hover:underline" target="_blank" rel="noopener noreferrer">
                      Digital Advertising Alliance (DAA) opt-out
                    </a>
                  </li>
                  <li>
                    <a href="https://www.youronlinechoices.eu/" className="text-dv-accent hover:underline" target="_blank" rel="noopener noreferrer">
                      Your Online Choices (usuarios europeos)
                    </a>
                  </li>
                </ul>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="text-white font-semibold mb-1">Cookies técnicas / esenciales</p>
                <p className="text-sm text-white/60">
                  Son cookies estrictamente necesarias para el funcionamiento del Sitio (preferencias de
                  interfaz, caché de la aplicación Next.js). No contienen datos personales identificables
                  y no pueden desactivarse sin afectar la funcionalidad del Sitio.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-white text-lg font-bold mb-3">4. Uso de la información</h2>
            <p className="mb-2">Los datos recopilados se usan exclusivamente para:</p>
            <ul className="list-disc list-inside space-y-1 text-white/70 ml-2">
              <li>Mejorar la experiencia del usuario y el contenido del Sitio</li>
              <li>Analizar el tráfico y detectar errores técnicos</li>
              <li>Personalizar el contenido según la región del usuario</li>
              <li>Mostrar publicidad a través de redes publicitarias de terceros</li>
              <li>Cumplir con obligaciones legales</li>
            </ul>
            <p className="mt-3">
              <strong className="text-white">No vendemos, alquilamos ni compartimos</strong> tus datos
              personales con terceros ajenos a los servicios de analítica y publicidad mencionados en
              esta política.
            </p>
          </section>

          <section>
            <h2 className="text-white text-lg font-bold mb-3">5. Datos de terceros que usamos</h2>
            <div className="space-y-3">
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="text-white font-semibold mb-1">The Movie Database (TMDB)</p>
                <p className="text-sm text-white/60">
                  Mostramos imágenes, descripciones y datos de películas y series provistos por TMDB.
                  No transmitimos datos de usuarios a TMDB. Más info:{' '}
                  <a href="https://www.themoviedb.org/privacy-policy" className="text-dv-accent hover:underline" target="_blank" rel="noopener noreferrer">
                    themoviedb.org/privacy-policy
                  </a>
                </p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="text-white font-semibold mb-1">Imágenes externas</p>
                <p className="text-sm text-white/60">
                  Algunos recursos visuales (logos de plataformas, pósters) se cargan desde CDNs de
                  terceros. Al cargar esas imágenes, tu navegador puede enviar tu dirección IP a esos
                  servidores.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-white text-lg font-bold mb-3">6. Tus derechos (GDPR / LGPD / URCDP)</h2>
            <p className="mb-3">
              Si sos residente de la Unión Europea, Brasil, Uruguay u otras jurisdicciones con leyes de
              protección de datos, tenés los siguientes derechos respecto de tus datos personales:
            </p>
            <ul className="list-disc list-inside space-y-1 text-white/70 ml-2">
              <li><strong className="text-white/80">Acceso:</strong> solicitar qué datos tenemos sobre vos</li>
              <li><strong className="text-white/80">Rectificación:</strong> corregir datos inexactos</li>
              <li><strong className="text-white/80">Supresión:</strong> solicitar la eliminación de tus datos</li>
              <li><strong className="text-white/80">Portabilidad:</strong> recibir tus datos en formato estructurado</li>
              <li><strong className="text-white/80">Oposición:</strong> oponerte al procesamiento de tus datos</li>
              <li><strong className="text-white/80">Limitación:</strong> restringir el procesamiento en ciertos casos</li>
              <li><strong className="text-white/80">Opt-out de publicidad personalizada:</strong> ver sección 3</li>
              <li>Presentar una queja ante la <strong className="text-white/80">URCDP</strong> (Uruguay: <a href="https://www.urcdp.gub.uy" className="text-dv-accent hover:underline" target="_blank" rel="noopener noreferrer">urcdp.gub.uy</a>) o la autoridad competente de tu país</li>
            </ul>
            <p className="mt-3">Para ejercer estos derechos escribinos a <a href="mailto:privacidad@uru2.com" className="text-dv-accent hover:underline">privacidad@uru2.com</a>.</p>
          </section>

          <section>
            <h2 className="text-white text-lg font-bold mb-3">7. Derechos de usuarios de California (CCPA)</h2>
            <p className="mb-3">
              Si sos residente de California (EE.UU.), la ley CCPA te otorga derechos adicionales:
            </p>
            <ul className="list-disc list-inside space-y-1 text-white/70 ml-2">
              <li>Saber qué información personal recopilamos, usamos o divulgamos</li>
              <li>Solicitar la eliminación de tu información personal</li>
              <li>Opt-out de la "venta" de tu información personal (DondeVeo no vende datos personales)</li>
              <li>No ser discriminado por ejercer tus derechos CCPA</li>
            </ul>
            <p className="mt-3">Para solicitudes CCPA contactanos en <a href="mailto:privacidad@uru2.com" className="text-dv-accent hover:underline">privacidad@uru2.com</a>.</p>
          </section>

          <section>
            <h2 className="text-white text-lg font-bold mb-3">8. Retención de datos</h2>
            <p>
              Los datos de analítica (Google Analytics) se retienen por 14 meses y luego son eliminados
              automáticamente por Google. No conservamos datos de navegación en nuestros propios servidores
              más allá de los logs técnicos de Apache, que se rotan y eliminan tras 30 días.
            </p>
          </section>

          <section>
            <h2 className="text-white text-lg font-bold mb-3">9. Seguridad</h2>
            <p>
              El Sitio opera bajo HTTPS con certificado SSL/TLS. No almacenamos contraseñas, datos
              financieros ni documentos de identidad. No requerimos registro de usuarios. Aplicamos
              cabeceras de seguridad HTTP (HSTS, CSP, X-Frame-Options) para proteger a los visitantes.
            </p>
          </section>

          <section>
            <h2 className="text-white text-lg font-bold mb-3">10. Menores de edad</h2>
            <p>
              DondeVeo no recopila datos de menores de 16 años de forma consciente. Si sos padre o tutor
              y creés que tu hijo nos ha proporcionado información personal, contactanos en{' '}
              <a href="mailto:privacidad@uru2.com" className="text-dv-accent hover:underline">privacidad@uru2.com</a>{' '}
              para solicitar su eliminación.
            </p>
          </section>

          <section>
            <h2 className="text-white text-lg font-bold mb-3">11. Cambios en esta política</h2>
            <p>
              Podemos actualizar esta política ocasionalmente para reflejar cambios en nuestras prácticas
              o en la legislación aplicable. La fecha de actualización al inicio de esta página siempre
              refleja la versión más reciente. El uso continuado del Sitio tras la publicación de cambios
              implica aceptación de los mismos.
            </p>
          </section>

          <section>
            <h2 className="text-white text-lg font-bold mb-3">12. Contacto</h2>
            <p>Para consultas sobre privacidad, solicitudes de derechos o cualquier duda:</p>
            <div className="mt-3 bg-white/5 border border-white/10 rounded-xl p-4 space-y-1 text-sm text-white/70">
              <p><strong className="text-white/90">DondeVeo Uruguay</strong></p>
              <p>Sitio web: <a href="https://www.uru2.com" className="text-dv-accent hover:underline">www.uru2.com</a></p>
              <p>Email: <a href="mailto:privacidad@uru2.com" className="text-dv-accent hover:underline">privacidad@uru2.com</a></p>
              <p>Responderemos tu solicitud dentro de los 30 días hábiles.</p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
