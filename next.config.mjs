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
        // Headers de seguridad en todas las rutas
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options',           value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options',    value: 'nosniff' },
          { key: 'Referrer-Policy',           value: 'strict-origin-when-cross-origin' },
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
          { key: 'Permissions-Policy',        value: 'camera=(), microphone=(), geolocation=(), payment=()' },
          { key: 'X-DNS-Prefetch-Control',    value: 'on' },
          // Bloquea plugins (Flash, etc.) y limita base-uri — no rompe Next.js
          { key: 'Content-Security-Policy',   value: "object-src 'none'; base-uri 'self';" },
        ],
      },
      {
        // CORS restringido a origen propio en todas las rutas /api/
        source: '/api/(.*)',
        headers: [
          { key: 'Access-Control-Allow-Origin',  value: 'https://www.uru2.com' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type' },
          { key: 'X-Robots-Tag',                value: 'noindex, nofollow' },
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
      // Redirige sección Gran Hermano y Noticias eliminadas → home
      {
        source: '/gran-hermano',
        destination: '/',
        permanent: true,
      },
      {
        source: '/gran-hermano/:slug*',
        destination: '/',
        permanent: true,
      },
      {
        source: '/noticias',
        destination: '/',
        permanent: true,
      },
      {
        source: '/noticias/:slug*',
        destination: '/',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
