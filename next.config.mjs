/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'image.tmdb.org' },
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: 'media.api-sports.io' },
      { protocol: 'https', hostname: 'media-3.api-sports.io' },
      { protocol: 'https', hostname: 'media-2.api-sports.io' },
      { protocol: 'https', hostname: 'media-1.api-sports.io' },
    ],
    unoptimized: true,
  },
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
