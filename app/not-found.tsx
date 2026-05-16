import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Página no encontrada — DondeVeo Uruguay',
  robots: { index: false },
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-dv-bg flex flex-col items-center justify-center px-4 text-center">
      {/* Icon */}
      <div className="text-6xl mb-6">🎬</div>

      {/* Heading */}
      <h1 className="text-white text-4xl md:text-5xl font-black mb-3">
        404
      </h1>
      <p className="text-white/70 text-lg mb-2">
        Esta página no existe o fue movida.
      </p>
      <p className="text-dv-muted text-sm mb-10 max-w-md">
        Puede que la URL sea incorrecta o que el contenido haya sido actualizado.
      </p>

      {/* Primary CTA */}
      <Link
        href="/"
        className="bg-dv-accent text-[#0a0a0f] font-black px-8 py-3 rounded-xl text-base hover:opacity-90 transition-opacity mb-10"
      >
        ← Volver al inicio
      </Link>

      {/* Quick links */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full max-w-lg">
        {[
          { href: '/novedades/netflix',    label: '🔴 Netflix',     },
          { href: '/novedades/disneyplus', label: '✨ Disney+',     },
          { href: '/novedades/max',        label: '🔵 Max',         },
          { href: '/noticias',             label: '📰 Noticias',    },
          { href: '/guias',                label: '📖 Guías',       },
          { href: '/genero/accion',        label: '💥 Acción',      },
        ].map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white/70 text-sm font-semibold hover:bg-white/10 hover:text-white transition-all"
          >
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}
