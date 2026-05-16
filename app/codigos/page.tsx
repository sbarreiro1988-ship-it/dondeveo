import type { Metadata } from 'next';
import Link from 'next/link';
import AdSlot from '@/components/AdSlot';

export const metadata: Metadata = {
  title: 'Panel de Códigos — Jupiter2000',
  description: 'Accedé a tus códigos de streaming. Netflix, Disney+, HBO Max y más.',
  robots: { index: false, follow: false },
};

const PORTAL_URL = 'https://codigos.jp2000.xyz/jp-panel/';

const PLATFORMS = [
  { name: 'Netflix',     color: '#E50914' },
  { name: 'Disney+',     color: '#113CCF' },
  { name: 'HBO Max',     color: '#002BE7' },
  { name: 'Paramount+',  color: '#0064FF' },
  { name: 'Spotify',     color: '#1DB954' },
  { name: 'Apple TV+',   color: '#888888' },
  { name: 'Prime Video', color: '#00A8E1' },
  { name: 'Universal+',  color: '#F37D00' },
];

export default function CodigosPage() {
  return (
    <>
      <style>{`
        .role-card { transition: border-color .2s, background .2s, transform .15s; }
        .role-card:hover { transform: translateY(-3px); }
        .role-card-teal:hover  { border-color: #00d4aa88; background: #00d4aa08; }
        .role-card-purple:hover{ border-color: #a78bfa88; background: #a78bfa08; }
        .role-card-amber:hover { border-color: #f59e0b88; background: #f59e0b08; }
        .cta-arrow { transition: transform .2s; }
        .role-card:hover .cta-arrow { transform: translateX(4px); }
        .icon-wrap { transition: transform .2s; }
        .role-card:hover .icon-wrap { transform: scale(1.1); }
        @media (max-width: 520px) { .cards-grid { grid-template-columns: 1fr !important; } }
      `}</style>

      <main className="min-h-screen flex flex-col items-center justify-center px-4 py-16 relative overflow-hidden"
            style={{ background: '#0a0a0a' }}>

        {/* Fondos decorativos */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full"
               style={{ background: 'radial-gradient(circle, #00d4aa18, transparent 70%)' }} />
          <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full"
               style={{ background: 'radial-gradient(circle, #a78bfa18, transparent 70%)' }} />
        </div>

        <div className="relative w-full max-w-4xl">

          {/* ── HEADER ── */}
          <div className="text-center mb-14">
            {/* Logo */}
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6 mx-auto shadow-2xl"
                 style={{ background: 'linear-gradient(135deg, #00d4aa15, #00d4aa30)', border: '1px solid #00d4aa44' }}>
              <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="#00d4aa" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"/>
              </svg>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3 tracking-tight">
              Panel de Códigos
            </h1>
            <p className="text-zinc-400 text-base sm:text-lg max-w-md mx-auto leading-relaxed">
              Consultá en segundos tus códigos de acceso para{' '}
              <span style={{ color: '#00d4aa' }}>Netflix, Disney+, HBO Max</span>{' '}
              y más servicios de streaming.
            </p>

            {/* Chips de plataformas */}
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              {PLATFORMS.map(p => (
                <span key={p.name} className="px-3 py-1 rounded-full text-xs font-medium"
                      style={{ background: p.color + '20', color: p.color, border: `1px solid ${p.color}44` }}>
                  {p.name}
                </span>
              ))}
            </div>
          </div>

          {/* ── CARDS ── */}
          <div className="cards-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', maxWidth: '680px', margin: '0 auto' }}>

            {/* Cliente */}
            <a href={PORTAL_URL} target="_blank" rel="noopener noreferrer"
               className="role-card role-card-teal flex flex-col gap-5 p-7 rounded-2xl no-underline"
               style={{ background: '#141414', border: '1px solid #2a2a2a' }}>
              <div className="icon-wrap w-14 h-14 rounded-xl flex items-center justify-center"
                   style={{ background: '#00d4aa18', color: '#00d4aa' }}>
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/>
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-white mb-2">Cliente</h2>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Consultá el código de acceso de tu cuenta de streaming en segundos.
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: '#00d4aa' }}>
                Consultar mi código
                <svg className="cta-arrow w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"/>
                </svg>
              </div>
            </a>

            {/* Revendedor */}
            <a href={PORTAL_URL} target="_blank" rel="noopener noreferrer"
               className="role-card role-card-purple flex flex-col gap-5 p-7 rounded-2xl no-underline"
               style={{ background: '#141414', border: '1px solid #2a2a2a' }}>
              <div className="icon-wrap w-14 h-14 rounded-xl flex items-center justify-center"
                   style={{ background: '#a78bfa18', color: '#a78bfa' }}>
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 2.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z"/>
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-white mb-2">Revendedor</h2>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Gestioná los códigos de tus clientes desde un solo lugar, rápido y seguro.
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: '#a78bfa' }}>
                Ingresar al portal
                <svg className="cta-arrow w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"/>
                </svg>
              </div>
            </a>


          </div>

          {/* ── FOOTER ── */}
          {/* Banner no invasivo — solo abre si lo tocás */}
          {/* SLOT: crear en AdSense › Anuncios › Por unidad › "Codigos Footer" */}
          <AdSlot
            slot="4890740929"
            format="auto"
            className="mt-10 max-w-xl mx-auto"
          />
          <div className="text-center mt-6">
            <Link href="/" className="text-sm text-zinc-600 hover:text-zinc-400 transition-colors">
              ← Volver a DondeVeo Uruguay
            </Link>
          </div>

        </div>
      </main>
    </>
  );
}
