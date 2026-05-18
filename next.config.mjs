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
    unoptimized: true,
  },
  // Asegurar compatibilidad con Passenger / Node.js standalone
  output: 'standalone',
  async redirects() {
    return [
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
