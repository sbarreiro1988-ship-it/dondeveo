'use client';

import Script from 'next/script';
import { useEffect } from 'react';

const NATIVE_CONTAINER = 'container-6c5b4590e53f0f53034c3f4fffc2964c';
const NATIVE_SCRIPT     = 'https://pl29379693.profitablecpmratenetwork.com/6c5b4590e53f0f53034c3f4fffc2964c/invoke.js';

/**
 * TerraNewsAds — todos los ads de Terra para páginas de noticias.
 * Incluye: Popunder, SocialBar y NativeBanner.
 * NO usar en la home ni en páginas de contenido — solo en artículos de noticias.
 */
export default function TerraNewsAds() {
  // NativeBanner: necesita el div en el DOM antes de que corra el script
  useEffect(() => {
    if (document.querySelector(`script[src="${NATIVE_SCRIPT}"]`)) return;
    const s = document.createElement('script');
    s.src   = NATIVE_SCRIPT;
    s.async = true;
    s.setAttribute('data-cfasync', 'false');
    document.body.appendChild(s);
  }, []);

  return (
    <>
      {/* Popunder */}
      <Script
        src="https://pl29379690.profitablecpmratenetwork.com/47/a1/4a/47a14ae68c88186e1795f2c6459b2073.js"
        strategy="afterInteractive"
      />
      {/* SocialBar */}
      <Script
        src="https://pl29379692.profitablecpmratenetwork.com/3b/ca/dc/3bcadc2c202da296c40b14ea10f47c0a.js"
        strategy="afterInteractive"
      />
      {/* NativeBanner — aparece inline en el artículo */}
      <div className="my-6 rounded-xl overflow-hidden">
        <div id={NATIVE_CONTAINER} />
      </div>
    </>
  );
}
