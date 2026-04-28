import { Suspense } from 'react';
import {
  fetchByProvider, fetchTrending, fetchTopRated,
  fetchUpcoming, fetchHeroContent, fetchTopByGenre, GENRE_IDS,
  fetchTrendingMovies, fetchTrendingSeries, fetchUniversalPlusContent,
} from '@/lib/tmdb';
import { fetchCinemaUY } from '@/lib/cinemaUY';
import { fetchStreamingNews, fetchInternalNews } from '@/lib/newsApi';
import HomeClient from '@/components/HomeClient';

export const revalidate = 3600; // 1 hora — sincronizado con el cron de revalidación

export default async function HomePage() {
  const [
    heroMovies, trending,
    top10Movies, top10Series,
    netflix, disneyplus, max, prime, paramountplus, appleTv,
    netflixSeries, maxSeries, primeSeries, disneySeries,
    paramountSeries, appleTvSeries, crunchyrollSeries,
    topRatedMovies, upcoming, nowPlaying,
    pluto, directvgo, mubi, mercadoplay, curiositystream, plex, googleplay,
    universalplus,
    viki,
    top10Accion, top10Comedia, top10Drama, top10Terror, top10Scifi,
    top10AccionSeries, top10DramaSeries,
    news,
  ] = await Promise.all([
    fetchHeroContent(),
    fetchTrending(),
    fetchTrendingMovies(),
    fetchTrendingSeries(),
    fetchByProvider(8,    'movie', 40),
    fetchByProvider(337,  'movie', 40),
    fetchByProvider(1899, 'movie', 40),
    fetchByProvider(119,  'movie', 40),
    fetchByProvider(531,  'movie', 20),
    fetchByProvider(350,  'movie', 24),
    fetchByProvider(8,    'tv', 40),
    fetchByProvider(1899, 'tv', 40),
    fetchByProvider(119,  'tv', 24),
    fetchByProvider(337,  'tv', 24),
    fetchByProvider(531,  'tv', 20),
    fetchByProvider(350,  'tv', 20),
    fetchByProvider(283,  'tv', 24),   // Crunchyroll anime
    fetchTopRated('movie'),
    fetchUpcoming(),
    fetchCinemaUY(),
    fetchByProvider(300,  'movie', 20),  // Pluto TV
    fetchByProvider(467,  'movie', 20),  // DIRECTV GO
    fetchByProvider(11,   'movie', 16),  // MUBI
    fetchByProvider(2302, 'movie', 20),  // Mercado Play
    fetchByProvider(190,  'movie', 16),  // Curiosity Stream (docs)
    fetchByProvider(538,  'movie', 20),  // Plex (gratis)
    fetchByProvider(3,    'movie', 20),  // Google Play Movies
    fetchUniversalPlusContent(),          // Universal+ (manual overrides)
    fetchByProvider(344,  'tv',   20, ['US', 'AR']), // Rakuten Viki (K-dramas)
    fetchTopByGenre(GENRE_IDS.accion,  'movie', 10),
    fetchTopByGenre(GENRE_IDS.comedia, 'movie', 10),
    fetchTopByGenre(GENRE_IDS.drama,   'movie', 10),
    fetchTopByGenre(GENRE_IDS.terror,  'movie', 10),
    fetchTopByGenre(GENRE_IDS.scifi,   'movie', 10),
    fetchTopByGenre(GENRE_IDS.accion,  'tv',    10),
    fetchTopByGenre(GENRE_IDS.drama,   'tv',    10),
    // Noticias: internas Gemini primero → RSS externo (solo noticias reales, sin inventadas)
    fetchInternalNews().then((gemini) => gemini.length > 0 ? gemini : fetchStreamingNews()),
  ]);

  return (
    <Suspense fallback={null}>
      <HomeClient
        heroMovies={heroMovies} trending={trending}
        top10Movies={top10Movies} top10Series={top10Series}
        netflix={netflix} disneyplus={disneyplus} max={max} prime={prime}
        paramountplus={paramountplus} appleTv={appleTv}
        netflixSeries={netflixSeries} maxSeries={maxSeries}
        primeSeries={primeSeries} disneySeries={disneySeries}
        paramountSeries={paramountSeries} appleTvSeries={appleTvSeries}
        crunchyrollSeries={crunchyrollSeries}
        topRatedMovies={topRatedMovies}
        upcoming={upcoming} nowPlaying={nowPlaying}
        pluto={pluto} directvgo={directvgo} mubi={mubi}
        mercadoplay={mercadoplay} curiositystream={curiositystream}
        plex={plex} googleplay={googleplay}
        universalplus={universalplus} viki={viki}
        top10Accion={top10Accion} top10Comedia={top10Comedia}
        top10Drama={top10Drama} top10Terror={top10Terror} top10Scifi={top10Scifi}
        top10AccionSeries={top10AccionSeries} top10DramaSeries={top10DramaSeries}
        news={news}
      />
    </Suspense>
  );
}
