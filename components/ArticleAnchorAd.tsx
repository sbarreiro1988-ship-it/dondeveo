'use client';
/**
 * ArticleAnchorAd — Sticky banner inferior en artículos de noticias.
 * El usuario puede cerrarlo con la X.
 * SLOT: crear en AdSense › Anuncios › Por unidad › "Artículo - Anchor"
 */
import { useState, useEffect, useRef } from 'react';

const PUB  = 'ca-pub-4971004283595233';
const SLOT = '7273361680'; // Articulo - Anchor Sticky

export default function ArticleAnchorAd() {
  const [visible, setVisible] = useState(false);
  const pushed = useRef(false);

  useEffect(() => {
    // Mostrar el banner 2 segundos después de cargar
    const t = setTimeout(() => setVisible(true), 2000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!visible || pushed.current) return;
    pushed.current = true;
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch { /* ignore */ }
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 flex justify-center items-end border-t border-white/10"
         style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(4px)' }}>
      <button
        onClick={() => setVisible(false)}
        aria-label="Cerrar anuncio"
        className="absolute top-1.5 right-3 text-white/40 hover:text-white/80 text-sm leading-none z-50 bg-black/40 rounded-full w-5 h-5 flex items-center justify-center"
      >
        ✕
      </button>
      <ins
        className="adsbygoogle"
        style={{ display: 'inline-block', width: '100%', maxWidth: '728px', height: '90px' }}
        data-ad-client={PUB}
        data-ad-slot={SLOT}
        data-ad-format="horizontal"
        data-full-width-responsive="true"
      />
    </div>
  );
}
