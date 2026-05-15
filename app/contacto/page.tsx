import type { Metadata } from 'next';
import Link from 'next/link';
import { Mail, MessageSquare, Bug, Lightbulb } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contacto — DondeVeo Uruguay',
  description: 'Contactate con el equipo de DondeVeo Uruguay. Reportá errores, sugerí contenido o hacé consultas sobre nuestra guía de streaming.',
  alternates: { canonical: 'https://www.uru2.com/contacto' },
};

export default function ContactoPage() {
  return (
    <div className="min-h-screen bg-dv-bg pt-20">
      <div className="max-w-3xl mx-auto px-4 md:px-8 py-12">

        <h1 className="text-white text-3xl md:text-4xl font-black mb-3">Contacto</h1>
        <p className="text-dv-muted text-lg mb-10">
          ¿Encontraste un error? ¿Tenés una sugerencia? Nos importa tu opinión.
        </p>

        {/* Email principal */}
        <div className="bg-dv-accent/10 border border-dv-accent/30 rounded-2xl p-6 mb-8 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-dv-accent/20 flex items-center justify-center flex-shrink-0">
            <Mail size={24} className="text-dv-accent" />
          </div>
          <div>
            <p className="text-white font-bold mb-0.5">Correo electrónico</p>
            <a href="mailto:hola@uru2.com"
              className="text-dv-accent text-lg font-semibold hover:underline">
              hola@uru2.com
            </a>
            <p className="text-white/40 text-xs mt-0.5">Respondemos en menos de 48 horas hábiles</p>
          </div>
        </div>

        {/* Tipos de consulta */}
        <h2 className="text-white text-xl font-bold mb-4">¿En qué te podemos ayudar?</h2>
        <div className="grid md:grid-cols-2 gap-4 mb-10">
          {[
            {
              icon: Bug,
              titulo: 'Reportar un error',
              desc: 'Si una plataforma está mal indicada para un título, o encontrás información incorrecta, avisanos para corregirlo.',
              asunto: 'Error en plataforma',
            },
            {
              icon: Lightbulb,
              titulo: 'Sugerir contenido',
              desc: '¿Hay una película o serie que no está en nuestra base de datos? ¿Sabés que un título llegó a una plataforma y no lo actualizamos?',
              asunto: 'Sugerencia de contenido',
            },
            {
              icon: MessageSquare,
              titulo: 'Consultas generales',
              desc: 'Preguntas sobre el funcionamiento del sitio, cómo buscamos la información o cualquier duda sobre DondeVeo.',
              asunto: 'Consulta general',
            },
            {
              icon: Mail,
              titulo: 'Publicidad',
              desc: 'Si querés anunciarte en DondeVeo o explorar oportunidades de colaboración, escribinos a nuestro correo.',
              asunto: 'Publicidad y colaboraciones',
            },
          ].map((item) => (
            <a key={item.titulo}
              href={`mailto:hola@uru2.com?subject=${encodeURIComponent(item.asunto)}`}
              className="flex gap-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-dv-accent/30 rounded-xl p-4 transition-all group">
              <div className="w-10 h-10 rounded-lg bg-white/8 flex items-center justify-center flex-shrink-0 group-hover:bg-dv-accent/10 transition-colors">
                <item.icon size={18} className="text-white/60 group-hover:text-dv-accent transition-colors" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm group-hover:text-dv-accent transition-colors">{item.titulo}</p>
                <p className="text-white/50 text-xs leading-relaxed mt-0.5">{item.desc}</p>
              </div>
            </a>
          ))}
        </div>

        {/* Info adicional */}
        <div className="border-t border-white/10 pt-8">
          <h2 className="text-white text-lg font-bold mb-4">Información importante</h2>
          <div className="space-y-3 text-white/60 text-sm leading-relaxed">
            <p>
              <strong className="text-white">Sobre la disponibilidad del contenido:</strong> Los datos de disponibilidad provienen de TMDB y se actualizan diariamente. Las plataformas pueden cambiar su catálogo sin previo aviso. Si notás una discrepancia, reportala y la corregimos.
            </p>
            <p>
              <strong className="text-white">No somos afiliados de las plataformas:</strong> DondeVeo es un servicio de información independiente. No vendemos suscripciones ni tenemos acuerdos comerciales con Netflix, Disney+, Max ni ninguna otra plataforma.
            </p>
            <p>
              <strong className="text-white">Datos personales:</strong> Para conocer cómo manejamos tu información, consultá nuestra{' '}
              <Link href="/privacidad" className="text-dv-accent hover:underline">Política de Privacidad</Link>.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
