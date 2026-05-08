'use client';

import { useEffect } from 'react';

const CONTAINER_ID  = 'container-6c5b4590e53f0f53034c3f4fffc2964c';
const SCRIPT_SRC    = 'https://pl29379693.profitablecpmratenetwork.com/6c5b4590e53f0f53034c3f4fffc2964c/invoke.js';

/**
 * TerraNativeBanner — Ad nativo de Terra (profitablecpmratenetwork.com)
 * Carga el script una sola vez por page load.
 * Úsalo en cualquier sección del sitio donde quieras mostrar el banner nativo.
 */
export default function TerraNativeBanner({ className = '' }: { className?: string }) {
  useEffect(() => {
    // Evitar duplicados si el componente se monta varias veces
    if (document.querySelector(`script[src="${SCRIPT_SRC}"]`)) return;

    const script = document.createElement('script');
    script.src       = SCRIPT_SRC;
    script.async     = true;
    script.setAttribute('data-cfasync', 'false');
    document.body.appendChild(script);
  }, []);

  return (
    <div className={className}>
      <div id={CONTAINER_ID} />
    </div>
  );
}
