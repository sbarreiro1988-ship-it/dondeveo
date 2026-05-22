/** @type {import('next').NextConfig} */
const nextConfig = {
  // Compatible con Node.js Passenger (cPanel) — sin edge runtime
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'image.tmdb.org' },
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: 'media.api-sports.io' },
      { protocol: 'https', hostname: 'media-3.api-sports.io' },
      { protocol: 'https', hostname: 'media-2.api-sports.io' },
      { protocol: 'https', hostname: 'media-1.api-sports.io' },
      // Thumbnails de noticias de fuentes externas
      { protocol: 'https', hostname: '**' },
    ],
    // Nota: unoptimized:true necesario porque sharp no está instalado en el server cPanel.
    // Para activar optimización: npm install sharp y eliminar esta línea.
    unoptimized: true,
  },
  // Asegurar compatibilidad con Passenger / Node.js standalone
  output: 'standalone',

  async headers() {
    return [
      {
        // Headers de seguridad y SEO en todas las rutas
        source: '/(.*)',
        headers: [
          // Evita clickjacking — permite iframes solo del mismo origen
          { key: 'X-Frame-Options',           value: 'SAMEORIGIN' },
          // Impide sniffing de content-type
          { key: 'X-Content-Type-Options',    value: 'nosniff' },
          // Controla info de referencia enviada a otros sitios
          { key: 'Referrer-Policy',           value: 'strict-origin-when-cross-origin' },
          // HSTS — fuerza HTTPS por 1 año
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
          // Permisos de APIs del navegador
          { key: 'Permissions-Policy',        value: 'camera=(), microphone=(), geolocation=()' },
          // DNS prefetch para acelerar cargas externas
          { key: 'X-DNS-Prefetch-Control',    value: 'on' },
        ],
      },
      {
        // Cache agresivo para assets estáticos (JS, CSS, fuentes, imágenes)
        source: '/_next/static/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        // Cache moderado para imágenes públicas
        source: '/(.*)\\.(png|jpg|jpeg|gif|svg|ico|webp)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=3600' },
        ],
      },
    ];
  },

  async redirects() {
    return [
      // Redirige non-www a www — evita contenido duplicado para SEO
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'uru2.com' }],
        destination: 'https://www.uru2.com/:path*',
        permanent: true,
      },
      // Redirige URLs viejas sin /type/ al nuevo formato
      // Google las tenía indexadas — redirect 301 permanente
      {
        source: '/pelicula/:id(\\d+)',
        destination: '/pelicula/movie/:id',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
