'use client';

import { useEffect, useRef } from 'react';

interface Props {
  slot:   string;          // ID del slot de AdSense (ej: "1234567890")
  format?: 'auto' | 'rectangle' | 'horizontal';
  className?: string;
}

/**
 * AdSlot — Inserta un bloque de Google AdSense.
 * Reemplazá PUB_ID con tu publisher ID: pub-4971004283595233
 * Reemplazá slot con el Slot ID que te da Google por cada bloque de anuncio.
 */
export default function AdSlot({ slot, format = 'auto', className = '' }: Props) {
  const ref      = useRef<HTMLDivElement>(null);
  const loaded   = useRef(false);

  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;
    try {
      // @ts-expect-error – adsbygoogle is injected by Google's script
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch { /* silenciar en dev */ }
  }, []);

  return (
    <div ref={ref} className={`my-6 flex justify-center overflow-hidden ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-4971004283595233"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
