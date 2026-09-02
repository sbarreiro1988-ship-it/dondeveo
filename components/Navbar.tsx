'use client';

import Link from 'next/link';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { useState, useCallback, useRef, useEffect } from 'react';
import { Search, X, Menu, ChevronDown } from 'lucide-react';

const GENEROS = [
  { label: 'Acción',        slug: 'accion' },
  { label: 'Comedia',       slug: 'comedia' },
  { label: 'Drama',         slug: 'drama' },
  { label: 'Terror',        slug: 'terror' },
  { label: 'Ciencia ficción', slug: 'ciencia' },
  { label: 'Thriller',      slug: 'thriller' },
  { label: 'Animación',     slug: 'animacion' },
  { label: 'Documental',    slug: 'documental' },
  { label: 'Romance',       slug: 'romance' },
  { label: 'Aventura',      slug: 'aventura' },
  { label: 'Fantasía',      slug: 'fantasia' },
  { label: 'Crimen',        slug: 'crimen' },
] as const;

const COMPARACIONES = [
  { label: 'Netflix vs Disney+',    slug: 'netflix-vs-disney' },
  { label: 'Netflix vs Max',        slug: 'netflix-vs-max' },
  { label: 'Netflix vs Prime',      slug: 'netflix-vs-prime' },
  { label: 'Disney+ vs Max',        slug: 'disney-vs-max' },
  { label: 'Disney+ vs Prime',      slug: 'disney-vs-prime' },
  { label: 'Max vs Prime',          slug: 'max-vs-prime' },
  { label: 'Netflix vs Paramount+', slug: 'netflix-vs-paramount' },
  { label: 'Netflix vs Apple TV+',  slug: 'netflix-vs-appletv' },
] as const;

// Regular links (Next.js Link) vs hash-scroll links (button)
const NAV_LINKS = [
  { label: 'Inicio',    href: '/',                    hash: null },
  { label: 'Lo nuevo',  href: '/novedades/netflix',   hash: null },
  { label: 'Películas', href: '/?tipo=peliculas',      hash: null, tipo: 'peliculas' },
  { label: 'Series',    href: '/?tipo=series',         hash: null, tipo: 'series' },
  { label: 'Guías',     href: '/guias',               hash: null },
] as const;

const linkClass = (active: boolean) =>
  `text-sm px-3 py-1.5 rounded-lg transition-all font-medium whitespace-nowrap cursor-pointer ${
    active ? 'text-dv-accent bg-dv-accent/10' : 'text-gray-400 hover:text-white hover:bg-white/5'
  }`;

export default function Navbar() {
  const [query, setQuery]           = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [explorarOpen, setExplorarOpen]   = useState(false);
  const [mobileExplorar, setMobileExplorar] = useState(false);
  const explorarRef = useRef<HTMLDivElement>(null);

  const pathname    = usePathname();
  const searchParams = useSearchParams();
  const router      = useRouter();
  const currentTipo = (searchParams.get('tipo') as string | null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (explorarRef.current && !explorarRef.current.contains(e.target as Node)) {
        setExplorarOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
    if (!link.href) return false;
    const tipo = (link as { tipo?: string }).tipo;

    // Películas / Series — activo solo cuando el param tipo coincide
    if (tipo) return currentTipo === tipo;

    // Inicio — activo solo en / sin tipo
    if (link.href === '/') return pathname === '/' && !currentTipo;

    // Lo nuevo — activo en cualquier /novedades/*
    if (link.href.startsWith('/novedades/')) return pathname.startsWith('/novedades/');

    // Resto — coincidencia exacta de pathname
    return pathname === link.href;
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

          {/* ── Explorar dropdown ── */}
          <div className="relative" ref={explorarRef}>
            <button
              onClick={() => setExplorarOpen(!explorarOpen)}
              className={linkClass(explorarOpen || pathname.startsWith('/genero') || pathname.startsWith('/comparar'))}
            >
              <span className="flex items-center gap-1">
                Explorar
                <ChevronDown size={12} className={`transition-transform ${explorarOpen ? 'rotate-180' : ''}`} />
              </span>
            </button>

            {explorarOpen && (
              <div className="absolute top-full left-0 mt-1 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden w-[480px]">
                <div className="grid grid-cols-2 divide-x divide-white/10">
                  {/* Géneros */}
                  <div className="p-3">
                    <p className="text-[10px] uppercase tracking-widest text-dv-muted font-bold px-2 mb-2">Géneros</p>
                    <div className="grid grid-cols-2 gap-0.5">
                      {GENEROS.map((g) => (
                        <Link
                          key={g.slug}
                          href={`/genero/${g.slug}`}
                          onClick={() => setExplorarOpen(false)}
                          className="px-2 py-1.5 text-xs text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                        >
                          {g.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                  {/* Comparar */}
                  <div className="p-3">
                    <p className="text-[10px] uppercase tracking-widest text-dv-muted font-bold px-2 mb-2">Comparar plataformas</p>
                    <div className="space-y-0.5">
                      {COMPARACIONES.map((c) => (
                        <Link
                          key={c.slug}
                          href={`/comparar/${c.slug}`}
                          onClick={() => setExplorarOpen(false)}
                          className="block px-2 py-1.5 text-xs text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                        >
                          {c.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
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
        <div className="md:hidden bg-[#111]/98 border-t border-white/5 animate-slide-up max-h-[80vh] overflow-y-auto">
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

          {/* Explorar — acordeón mobile */}
          <button
            onClick={() => setMobileExplorar(!mobileExplorar)}
            className="w-full flex items-center justify-between px-5 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
          >
            <span>Explorar</span>
            <ChevronDown size={14} className={`transition-transform ${mobileExplorar ? 'rotate-180' : ''}`} />
          </button>

          {mobileExplorar && (
            <div className="bg-black/20 border-t border-white/5">
              <p className="text-[10px] uppercase tracking-widest text-dv-muted font-bold px-5 pt-3 pb-1">Géneros</p>
              <div className="grid grid-cols-3 gap-0.5 px-3 pb-2">
                {GENEROS.map((g) => (
                  <Link
                    key={g.slug}
                    href={`/genero/${g.slug}`}
                    onClick={() => { setMobileOpen(false); setMobileExplorar(false); }}
                    className="px-2 py-2 text-xs text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors text-center"
                  >
                    {g.label}
                  </Link>
                ))}
              </div>
              <p className="text-[10px] uppercase tracking-widest text-dv-muted font-bold px-5 pt-2 pb-1 border-t border-white/5">Comparar</p>
              <div className="px-3 pb-3 space-y-0.5">
                {COMPARACIONES.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/comparar/${c.slug}`}
                    onClick={() => { setMobileOpen(false); setMobileExplorar(false); }}
                    className="block px-2 py-1.5 text-xs text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                  >
                    {c.label}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
