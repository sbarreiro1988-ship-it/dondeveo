'use client';

import Script from 'next/script';
import { useEffect, useRef } from 'react';

const CONTAINER_ID = 'terra-native-news';
const NATIVE_SRC   = 'https://pl29379693.profitablecpmratenetwork.com/6c5b4590e53f0f53034c3f4fffc2964c/invoke.js';

/**
 * TerraNewsAds — todos los ads de Terra para páginas de noticias.
 * Popunder + SocialBar cargan via next/script afterInteractive.
 * NativeBanner se inyecta siempre (no reutiliza el script ya cargado).
 */
export default function TerraNewsAds() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Asignar el ID oficial que espera el script de Terra
    containerRef.current.id = 'container-6c5b4590e53f0f53034c3f4fffc2964c';

    // Siempre inyectar el script — aunque ya esté en la página,
    // re-ejecutarlo hace que detecte el nuevo contenedor
    const script = document.createElement('script');
    script.src   = NATIVE_SRC;
    script.async = true;
    script.setAttribute('data-cfasync', 'false');
    containerRef.current.parentElement?.appendChild(script);

    return () => {
      // Limpiar al navegar fuera para que funcione en la siguiente visita
      try { script.parentElement?.removeChild(script); } catch { /* noop */ }
    };
  }, []);

  return (
    <>
      {/* Popunder — se abre solo una vez por sesión */}
      <Script
        src="https://pl29379690.profitablecpmratenetwork.com/47/a1/4a/47a14ae68c88186e1795f2c6459b2073.js"
        strategy="afterInteractive"
      />
      {/* SocialBar — barra flotante en el lateral */}
      <Script
        src="https://pl29379692.profitablecpmratenetwork.com/3b/ca/dc/3bcadc2c202da296c40b14ea10f47c0a.js"
        strategy="afterInteractive"
      />
      {/* NativeBanner inline — 4 imágenes en fila */}
      <div className="my-6" id={CONTAINER_ID}>
        <div ref={containerRef} />
      </div>
    </>
  );
}
