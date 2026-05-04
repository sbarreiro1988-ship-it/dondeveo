import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowLeft, Check, X, Star } from 'lucide-react';
import { fetchPlatformStats, PLATFORM_PROVIDER_ID } from '@/lib/tmdb';
import { PLATFORMS } from '@/lib/mockData';

export const revalidate    = 86400; // 24h
export const dynamicParams = true;

// Precios y datos estáticos de plataformas en Uruguay
const PLATFORM_INFO: Record<string, {
  price: string; trial: string; quality: string;
  downloads: boolean; screens: number; originals: boolean;
}> = {
  netflix:       { price: '$699 UYU/mes',  trial: 'No',       quality: '4K HDR',  downloads: true,  screens: 4, originals: true  },
  disneyplus:    { price: '$519 UYU/mes',  trial: 'No',       quality: '4K HDR',  downloads: true,  screens: 4, originals: true  },
  max:           { price: '$599 UYU/mes',  trial: '7 días',   quality: '4K HDR',  downloads: true,  screens: 3, originals: true  },
  prime:         { price: '$299 UYU/mes',  trial: '30 días',  quality: '4K HDR',  downloads: true,  screens: 3, originals: true  },
  paramountplus: { price: '$399 UYU/mes',  trial: '7 días',   quality: 'Full HD', downloads: true,  screens: 3, originals: true  },
  appletv:       { price: 'USD 9.99/mes',  trial: '7 días',   quality: '4K HDR',  downloads: true,  screens: 6, originals: true  },
  mubi:          { price: '$299 UYU/mes',  trial: '30 días',  quality: 'Full HD', downloads: false, screens: 2, originals: false },
  crunchyroll:   { price: 'USD 7.99/mes',  trial: '14 días',  quality: 'Full HD', downloads: true,  screens: 4, originals: false },
  plutotv:       { price: 'Gratis',        trial: 'N/A',      quality: 'HD',      downloads: false, screens: 1, originals: false },
  plex:          { price: 'Gratis',        trial: 'N/A',      quality: 'HD',      downloads: false, screens: 1, originals: false },
};

const SLUG_PAIRS: Record<string, [string, string]> = {
  'netflix-vs-disney':    ['netflix', 'disneyplus'],
  'netflix-vs-max':       ['netflix', 'max'],
  'netflix-vs-prime':     ['netflix', 'prime'],
  'disney-vs-max':        ['disneyplus', 'max'],
  'disney-vs-prime':      ['disneyplus', 'prime'],
  'max-vs-prime':         ['max', 'prime'],
  'netflix-vs-paramount': ['netflix', 'paramountplus'],
  'netflix-vs-appletv':   ['netflix', 'appletv'],
  'prime-vs-paramount':   ['prime', 'paramountplus'],
  'disney-vs-paramount':  ['disneyplus', 'paramountplus'],
};

interface Props { params: { slug: string } }

export async function generateStaticParams() {
  return Object.keys(SLUG_PAIRS).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const pair = SLUG_PAIRS[params.slug];
  if (!pair) return { title: 'Comparar plataformas — DondeVeo' };
  const [p1, p2] = pair.map((id) => PLATFORMS[id]);
  const title = `${p1?.name} vs ${p2?.name} en Uruguay — ¿Cuál vale más?`;
  return {
    title: `${title} | DondeVeo`,
    description: `Comparamos ${p1?.name} y ${p2?.name} en Uruguay: precio, contenido, calidad de imagen y más. ¿Cuál es mejor para vos?`,
    alternates: { canonical: `https://www.uru2.com/comparar/${params.slug}` },
    openGraph: { title, type: 'article' },
  };
}

function Winner({ val1, val2, higherIsBetter = true }: { val1: number; val2: number; higherIsBetter?: boolean }) {
  const w1 = higherIsBetter ? val1 > val2 : val1 < val2;
  const w2 = higherIsBetter ? val2 > val1 : val2 < val1;
  return (
    <div className="flex justify-around">
      <span className={`text-lg font-black ${w1 ? 'text-dv-accent' : 'text-white/40'}`}>
        {w1 ? '🏆' : ''} {val1.toLocaleString()}
      </span>
      <span className={`text-lg font-black ${w2 ? 'text-dv-accent' : 'text-white/40'}`}>
        {w2 ? '🏆' : ''} {val2.toLocaleString()}
      </span>
    </div>
  );
}

export default async function CompararPage({ params }: Props) {
  const pair = SLUG_PAIRS[params.slug];
  if (!pair) notFound();

  const [id1, id2]  = pair;
  const [p1, p2]    = pair.map((id) => PLATFORMS[id]);
  const [pid1, pid2] = pair.map((id) => PLATFORM_PROVIDER_ID[id]);
  if (!p1 || !p2 || !pid1 || !pid2) notFound();

  const [stats1, stats2] = await Promise.all([
    fetchPlatformStats(pid1),
    fetchPlatformStats(pid2),
  ]);

  const info1 = PLATFORM_INFO[id1];
  const info2 = PLATFORM_INFO[id2];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type':    'Article',
    headline:   `${p1.name} vs ${p2.name} en Uruguay`,
    description: `Comparación completa de ${p1.name} y ${p2.name} en Uruguay.`,
    url:        `https://www.uru2.com/comparar/${params.slug}`,
  };

  return (
    <div className="min-h-screen bg-dv-bg">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="max-w-4xl mx-auto px-4 md:px-8 py-8">
        <Link href="/" className="inline-flex items-center gap-1.5 text-dv-muted hover:text-white text-sm mb-6 transition-colors">
          <ArrowLeft size={14} /> Inicio
        </Link>

        <h1 className="text-white text-2xl md:text-4xl font-black mb-2 text-center">
          <span style={{ color: p1.color }}>{p1.name}</span>
          <span className="text-white/30 mx-3">vs</span>
          <span style={{ color: p2.color }}>{p2.name}</span>
        </h1>
        <p className="text-dv-muted text-center mb-10">¿Cuál vale más en Uruguay? La comparación definitiva.</p>

        {/* Encabezados de plataformas */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div />
          {[{ p: p1, id: id1 }, { p: p2, id: id2 }].map(({ p, id }) => (
            <div key={id} className="text-center p-4 rounded-xl border border-white/10"
              style={{ backgroundColor: p.bgColor + '15' }}>
              <div className="w-12 h-12 rounded-xl mx-auto mb-2 flex items-center justify-center font-black text-xl"
                style={{ backgroundColor: p.bgColor, color: p.textColor }}>
                {p.shortName}
              </div>
              <p className="text-white font-black">{p.name}</p>
              <Link href={`/novedades/${id}`} className="text-dv-accent text-xs hover:underline">
                Ver lo nuevo →
              </Link>
            </div>
          ))}
        </div>

        {/* Tabla comparativa */}
        <div className="space-y-2 mb-10">
          {/* Precio */}
          <div className="grid grid-cols-3 gap-4 bg-white/5 rounded-xl p-4 items-center">
            <p className="text-white/60 text-sm font-semibold">💰 Precio</p>
            {[info1, info2].map((info, i) => (
              <p key={i} className="text-white font-bold text-center">{info?.price ?? '—'}</p>
            ))}
          </div>

          {/* Prueba gratis */}
          <div className="grid grid-cols-3 gap-4 bg-white/5 rounded-xl p-4 items-center">
            <p className="text-white/60 text-sm font-semibold">🆓 Prueba gratis</p>
            {[info1, info2].map((info, i) => (
              <p key={i} className="text-white font-bold text-center">{info?.trial ?? '—'}</p>
            ))}
          </div>

          {/* Calidad */}
          <div className="grid grid-cols-3 gap-4 bg-white/5 rounded-xl p-4 items-center">
            <p className="text-white/60 text-sm font-semibold">📺 Calidad máx.</p>
            {[info1, info2].map((info, i) => (
              <p key={i} className="text-white font-bold text-center">{info?.quality ?? '—'}</p>
            ))}
          </div>

          {/* Pantallas simultáneas */}
          <div className="grid grid-cols-3 gap-4 bg-white/5 rounded-xl p-4 items-center">
            <p className="text-white/60 text-sm font-semibold">👥 Pantallas</p>
            {[info1, info2].map((info, i) => (
              <p key={i} className="text-white font-bold text-center">{info?.screens ?? '—'}</p>
            ))}
          </div>

          {/* Descargas */}
          <div className="grid grid-cols-3 gap-4 bg-white/5 rounded-xl p-4 items-center">
            <p className="text-white/60 text-sm font-semibold">📥 Descargas</p>
            {[info1, info2].map((info, i) => (
              <div key={i} className="flex justify-center">
                {info?.downloads
                  ? <Check size={20} className="text-green-400" />
                  : <X size={20} className="text-red-400" />}
              </div>
            ))}
          </div>

          {/* Originales */}
          <div className="grid grid-cols-3 gap-4 bg-white/5 rounded-xl p-4 items-center">
            <p className="text-white/60 text-sm font-semibold">🎬 Contenido original</p>
            {[info1, info2].map((info, i) => (
              <div key={i} className="flex justify-center">
                {info?.originals
                  ? <Check size={20} className="text-green-400" />
                  : <X size={20} className="text-red-400" />}
              </div>
            ))}
          </div>

          {/* Películas disponibles */}
          <div className="grid grid-cols-3 gap-4 bg-white/5 rounded-xl p-4 items-center">
            <p className="text-white/60 text-sm font-semibold">🎬 Películas</p>
            <Winner val1={stats1.movies} val2={stats2.movies} />
          </div>

          {/* Series disponibles */}
          <div className="grid grid-cols-3 gap-4 bg-white/5 rounded-xl p-4 items-center">
            <p className="text-white/60 text-sm font-semibold">📺 Series</p>
            <Winner val1={stats1.series} val2={stats2.series} />
          </div>
        </div>

        {/* Top contenido de cada plataforma */}
        <div className="grid md:grid-cols-2 gap-8 mb-10">
          {[
            { p: p1, stats: stats1, id: id1 },
            { p: p2, stats: stats2, id: id2 },
          ].map(({ p, stats, id }) => (
            <div key={id}>
              <h2 className="text-white font-bold text-lg mb-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded text-xs font-black flex items-center justify-center"
                  style={{ backgroundColor: p.bgColor, color: p.textColor }}>
                  {p.shortName}
                </span>
                Lo más popular en {p.name}
              </h2>
              <div className="grid grid-cols-3 gap-2">
                {stats.topMovies.map((m) => (
                  <Link key={m.id}
                    href={`/donde-ver/${encodeURIComponent(m.title.toLowerCase().replace(/\s+/g, '-'))}`}
                    className="group">
                    <div className="relative aspect-[2/3] rounded-lg overflow-hidden mb-1 bg-white/5">
                      <Image src={m.posterPath} alt={m.title} fill
                        className="object-cover group-hover:scale-105 transition-transform" unoptimized />
                      {m.voteAverage > 0 && (
                        <div className="absolute bottom-1 left-1 flex items-center gap-0.5 bg-black/70 px-1 py-0.5 rounded">
                          <Star size={7} className="text-yellow-400 fill-yellow-400" />
                          <span className="text-yellow-400 text-[8px] font-bold">{m.voteAverage.toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                    <p className="text-white/60 text-[10px] line-clamp-1 group-hover:text-dv-accent">{m.title}</p>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Otras comparaciones */}
        <div>
          <h2 className="text-white font-bold mb-4">Otras comparaciones</h2>
          <div className="flex flex-wrap gap-2">
            {Object.entries(SLUG_PAIRS)
              .filter(([slug]) => slug !== params.slug)
              .map(([slug, [a, b]]) => {
                const pa = PLATFORMS[a]; const pb = PLATFORMS[b];
                return (
                  <Link key={slug} href={`/comparar/${slug}`}
                    className="text-sm bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white px-3 py-1.5 rounded-full transition-all">
                    {pa?.name} vs {pb?.name}
                  </Link>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}
