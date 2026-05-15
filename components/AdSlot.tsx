'use client';
/**
 * AdSlot — Componente de Google AdSense.
 *
 * SLOTS disponibles (crear en AdSense > Anuncios > Por unidad de anuncio):
 *   HOME_BANNER      → banner entre secciones de la home
 *   CODIGOS_FOOTER   → footer de /codigos
 *   NEWS_TOP         → tope del listado de noticias
 *   NEWS_GRID        → entre artículos del grid
 *   ARTICLE_TOP      → sobre el artículo (debajo del intro)
 *   ARTICLE_MID      → dentro del cuerpo del artículo (in-article)
 *   ARTICLE_BOT      → debajo del artículo
 *   ARTICLE_ANCHOR   → sticky inferior del artículo
 *
 * Una vez aprobado AdSense:
 *   1. Ir a AdSense → Anuncios → Por unidad de anuncio → Crear
 *   2. Crear una unidad por cada slot
 *   3. Reemplazar los IDs de slot ("slot" prop) con los IDs reales
 */

import { useEffect, useRef } from 'react';

const PUB = 'ca-pub-4971004283595233';

interface Props {
  slot: string;
  format?: string;
  layout?: string;
  className?: string;
  fullWidth?: boolean;
  style?: React.CSSProperties;
}

export default function AdSlot({
  slot,
  format = 'auto',
  layout,
  className = '',
  fullWidth = true,
  style,
}: Props) {
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current) return;
    pushed.current = true;
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch { /* ignore — AdSense no disponible */ }
  }, []);

  return (
    <div className={className} style={style} aria-hidden="true">
      <ins
        className="adsbygoogle"
        style={{ display: 'block', ...style }}
        data-ad-client={PUB}
        data-ad-slot={slot}
        data-ad-format={format}
        {...(layout ? { 'data-ad-layout': layout } : {})}
        {...(fullWidth ? { 'data-full-width-responsive': 'true' } : {})}
      />
    </div>
  );
}

/* ─── Variante anchor / sticky ───────────────────────────────────────────── */
interface AnchorProps {
  slot: string;
  onClose?: () => void;
}
export function AdAnchor({ slot, onClose }: AnchorProps) {
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current) return;
    pushed.current = true;
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch { /* ignore */ }
  }, []);

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 flex justify-center items-end bg-black/60 backdrop-blur-sm border-t border-white/10"
      style={{ minHeight: '60px' }}
    >
      {onClose && (
        <button
          onClick={onClose}
          aria-label="Cerrar anuncio"
          className="absolute top-1 right-2 text-white/40 hover:text-white/80 text-xs leading-none z-50"
        >
          ✕
        </button>
      )}
      <ins
        className="adsbygoogle"
        style={{ display: 'inline-block', width: '100%', maxWidth: '728px', height: '90px' }}
        data-ad-client={PUB}
        data-ad-slot={slot}
        data-ad-format="horizontal"
        data-full-width-responsive="true"
      />
    </div>
  );
}
