'use client';

import Link from 'next/link';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { useState, useCallback } from 'react';
import { Search, X, Menu } from 'lucide-react';

// Regular links (Next.js Link) vs hash-scroll links (button)
const NAV_LINKS = [
  { label: 'Inicio',    href: '/',                    hash: null },
  { label: 'Lo nuevo',  href: '/novedades/netflix',   hash: null },
  { label: 'Películas', href: '/?tipo=peliculas',      hash: null, tipo: 'peliculas' },
  { label: 'Series',    href: '/?tipo=series',         hash: null, tipo: 'series' },
  { label: 'Noticias',  href: null,                   hash: 'noticias' },
] as const;

const linkClass = (active: boolean) =>
  `text-sm px-3 py-1.5 rounded-lg transition-all font-medium whitespace-nowrap cursor-pointer ${
    active ? 'text-dv-accent bg-dv-accent/10' : 'text-gray-400 hover:text-white hover:bg-white/5'
  }`;

export default function Navbar() {
  const [query, setQuery]           = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const pathname    = usePathname();
  const searchParams = useSearchParams();
  const router      = useRouter();
  const currentTipo = (searchParams.get('tipo') as string | null);

  const submitSearch = useCallback(() => {
    const q = query.trim();
    if (!q) return;
    router.push(`/?search=${encodeURIComponent(q)}`);
    setQuery('');
  }, [query, router]);

  // Scroll to a section id — navigate to home first if needed
  const scrollTo = useCallback(
    (sectionId: string) => {
      setMobileOpen(false);
      const doScroll = () => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      };

      if (pathname === '/') {
        doScroll();
      } else {
        // Navigate to home, then scroll after mount
        router.push('/');
        // HomeClient useEffect will handle the scroll via window.location.hash
        // So push with the hash directly
        setTimeout(() => {
          window.location.hash = `#${sectionId}`;
        }, 100);
      }
    },
    [pathname, router],
  );

  const isLinkActive = (link: (typeof NAV_LINKS)[number]): boolean => {
    if (link.hash) return false;
    if (!link.href) return false;
    const tipo = (link as { tipo?: string }).tipo;
    if (!tipo && !currentTipo && pathname === '/') return true;
    if (tipo && currentTipo === tipo) return true;
    if (link.href === pathname && !tipo && !currentTipo) return true;
    return false;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#111]/95 backdrop-blur-md border-b border-white/5">
      <div className="flex items-center justify-between h-14 px-4 md:px-8 gap-4">

        {/* ── Logo ── */}
        <Link href="/" className="flex items-center gap-1.5 flex-shrink-0">
          <span className="text-dv-accent text-lg font-black">▶</span>
          <span className="text-lg font-black text-white tracking-tight">
            Donde<span className="text-dv-accent">Veo</span>
          </span>
          <span className="text-sm">🇺🇾</span>
        </Link>

        {/* ── Nav links desktop ── */}
        <div className="hidden md:flex items-center gap-0.5 flex-shrink-0">
          {NAV_LINKS.map((l) =>
            l.hash ? (
              <button
                key={l.hash}
                onClick={() => scrollTo(l.hash!)}
                className={linkClass(false)}
              >
                {l.label}
              </button>
            ) : (
              <Link
                key={l.href!}
                href={l.href!}
                className={linkClass(isLinkActive(l))}
              >
                {l.label}
              </Link>
            ),
          )}
        </div>

        {/* ── Search bar (always visible on desktop) ── */}
        <div className="flex-1 max-w-md hidden md:block">
          <div className={`relative transition-all ${searchFocused ? 'scale-[1.01]' : ''}`}>
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-dv-muted pointer-events-none" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') submitSearch(); }}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              placeholder="Buscar por filmes ou séries…"
              className="w-full bg-white/8 border border-white/12 hover:border-white/20 focus:border-dv-accent text-white text-sm rounded-lg pl-9 pr-9 py-2 outline-none placeholder:text-dv-muted transition-colors"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-dv-muted hover:text-white"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* ── Right: mobile search + hamburger ── */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="md:hidden relative">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-dv-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') submitSearch(); }}
              placeholder="Buscar…"
              className="bg-white/8 border border-white/12 text-white text-xs rounded-lg pl-7 pr-3 py-1.5 w-32 outline-none focus:border-dv-accent placeholder:text-dv-muted"
            />
          </div>
          {query && (
            <button
              onClick={submitSearch}
              className="bg-dv-accent hover:bg-dv-accent-dark text-[#111] text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
            >
              Buscar
            </button>
          )}
          <button
            className="md:hidden text-gray-400 hover:text-white p-1.5"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* ── Mobile menu ── */}
      {mobileOpen && (
        <div className="md:hidden bg-[#111]/98 border-t border-white/5 animate-slide-up">
          {NAV_LINKS.map((l) =>
            l.hash ? (
              <button
                key={l.hash}
                onClick={() => scrollTo(l.hash!)}
                className="w-full text-left flex items-center px-5 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
              >
                {l.label}
              </button>
            ) : (
              <Link
                key={l.href!}
                href={l.href!}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center px-5 py-3 text-sm transition-colors ${
                  isLinkActive(l) ? 'text-dv-accent bg-dv-accent/10' : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {l.label}
              </Link>
            ),
          )}
        </div>
      )}
    </nav>
  );
}
