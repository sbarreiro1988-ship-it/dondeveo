import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { fetchGHNews, ghTimeAgo, ghSlug } from '@/lib/ghApi';

export const revalidate    = 900;  // 15 min
export const dynamicParams = true;

const BASE = 'https://www.uru2.com';

async function getItem(slug: string) {
  const items = await fetchGHNews().catch(() => []);
  return items.find(i => i.slug === slug || ghSlug(i.title) === slug) ?? null;
}

export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const item = await getItem(params.slug);
  if (!item) return {
    title: 'Nota no encontrada | DondeVeo',
    robots: { index: false, follow: false },
  };

  const url   = `${BASE}/gran-hermano/${item.slug}`;
  const image = item.thumbnail ?? `${BASE}/favicon.svg`;
  const desc  = (item.excerpt || item.title).slice(0, 160);

  return {
    title: `${item.title} | Gran Hermano 2026 | DondeVeo`,
    description: desc,
    keywords: ['Gran Hermano 2026', 'GH Argentina', item.source, 'eliminados', 'chismes'],
    alternates: { canonical: url },
    openGraph: {
      title:       item.title,
      description: desc,
      url,
      type:        'article',
      locale:      'es_UY',
      siteName:    'DondeVeo Uruguay',
      images:      [{ url: image, width: 1200, height: 630, alt: item.title }],
    },
    twitter: {
      card:        'summary_large_image',
      title:       item.title,
      description: desc,
      images:      [image],
    },
    robots: { index: true, follow: true },
  };
}

export async function generateStaticParams() {
  const items = await fetchGHNews().catch(() => []);
  return items.map(i => ({ slug: i.slug }));
}

export default async function GHArticlePage({ params }: { params: { slug: string } }) {
  const item = await getItem(params.slug);
  if (!item) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: item.title,
    description: item.excerpt || item.title,
    image: item.thumbnail
      ? [{ '@type': 'ImageObject', url: item.thumbnail, width: 1200, height: 630 }]
      : [],
    datePublished: item.pubDate,
    dateModified: item.pubDate,
    author: [{ '@type': 'Organization', name: item.isInternal ? 'DondeVeo Uruguay' : item.source }],
    publisher: {
      '@type': 'Organization',
      name: 'DondeVeo Uruguay',
      url: BASE,
      logo: { '@type': 'ImageObject', url: `${BASE}/favicon.svg` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${BASE}/gran-hermano/${item.slug}` },
    keywords: 'Gran Hermano 2026, GH Argentina, eliminados, chismes',
    articleSection: 'Reality Show',
    inLanguage: 'es-AR',
  };

  return (
    <div className="min-h-screen bg-[#0d0618]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Back nav */}
      <div className="max-w-3xl mx-auto px-4 pt-6 pb-2">
        <Link
          href="/gran-hermano"
          className="inline-flex items-center gap-1.5 text-purple-400 hover:text-white text-sm transition-colors"
        >
          ← Gran Hermano 2026
        </Link>
      </div>

      {/* Hero thumbnail */}
      {item.thumbnail && (
        <div className="max-w-3xl mx-auto px-4 mb-4">
          <div className="relative w-full rounded-xl overflow-hidden" style={{ aspectRatio: '16/9' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.thumbnail}
              alt={item.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d0618] via-transparent to-transparent" />
          </div>
        </div>
      )}

      {/* Article */}
      <article className="max-w-3xl mx-auto px-4 py-4 pb-20">
        {/* Category badge */}
        <span className="inline-block bg-purple-700/30 text-purple-300 text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-4 border border-purple-700/40">
          🏠 Gran Hermano Argentina 2026
        </span>

        {/* Title */}
        <h1 className="text-white text-2xl md:text-3xl font-black leading-tight mb-4">
          {item.title}
        </h1>

        {/* Meta */}
        <div className="flex items-center gap-4 mb-5 flex-wrap text-sm">
          {item.pubDate && (
            <span className="text-purple-400/80">
              🕐 {ghTimeAgo(item.pubDate)}
            </span>
          )}
          <span className="text-purple-400/80">
            {item.isInternal
              ? <span className="text-purple-300 font-semibold">DondeVeo Uruguay</span>
              : <>Fuente: <span className="text-purple-300 font-semibold">{item.source}</span></>
            }
          </span>
        </div>

        <div className="h-px bg-purple-900/40 mb-6" />

        {/* Intro / excerpt */}
        <p className="text-white/90 text-lg leading-relaxed mb-6 font-medium">
          {item.excerpt}
        </p>

        {/* Full body — only for internal Groq articles */}
        {item.body && (
          <div className="prose prose-invert prose-purple max-w-none mb-6">
            {item.body.split(/\n{2,}/).map((paragraph, idx) => (
              <p key={idx} className="text-white/80 text-base leading-relaxed mb-4">
                {paragraph.trim()}
              </p>
            ))}
          </div>
        )}

        {/* Conclusion — only for internal Groq articles */}
        {item.conclusion && (
          <div className="bg-purple-950/40 border-l-4 border-purple-500 rounded-r-lg p-4 mb-8">
            <p className="text-purple-200 text-base leading-relaxed italic">
              {item.conclusion}
            </p>
          </div>
        )}

        {/* CTA — only for RSS (external) articles */}
        {!item.isInternal && (
          <div className="bg-purple-950/50 border border-purple-700/40 rounded-xl p-5 mb-8 text-center">
            <p className="text-purple-300 text-sm mb-3">
              Para leer la nota completa, visitá la fuente original:
            </p>
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-bold px-6 py-3 rounded-lg transition-colors text-sm"
            >
              Leer en {item.source} →
            </a>
          </div>
        )}

        <div className="h-px bg-purple-900/40 mb-6" />

        {/* Footer */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <p className="text-purple-400/60 text-xs">
            {item.isInternal
              ? 'Artículo de elaboración propia — DondeVeo Uruguay.'
              : 'Contenido de Gran Hermano Argentina 2026 en DondeVeo Uruguay.'
            }
          </p>
          <Link href="/gran-hermano" className="text-purple-400 text-sm font-bold hover:text-purple-300 transition-colors">
            ← Más noticias GH
          </Link>
        </div>
      </article>
    </div>
  );
}
