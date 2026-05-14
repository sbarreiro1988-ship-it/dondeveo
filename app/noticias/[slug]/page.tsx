import { notFound, permanentRedirect } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Clock, Tag } from 'lucide-react';
import type { Metadata } from 'next';
import { getStaticArticleBySlug } from '@/lib/staticArticles';

export const revalidate    = 300; // 5 min — artículos se regeneran frecuente
export const dynamicParams = true;

interface ArticleData {
  uid:         string;
  slug:        string;
  title:       string;
  intro:       string;
  body:        string;
  conclusion:  string;
  tags:        string[];
  category:    string;
  thumbnail:   string | null;
  source:      string;
  originalUrl: string;
  publishedAt: string;
}

async function fetchArticle(slug: string): Promise<ArticleData | null> {
  // 1️⃣ Primero: artículos del script Gemini (cPanel via NEWS_DATA_URL)
  const baseUrl = process.env.NEWS_DATA_URL;
  if (baseUrl) {
    try {
      const res = await fetch(`${baseUrl}/articles/${slug}.json`, {
        next: { revalidate: 3600 },
        signal: AbortSignal.timeout(5000),
      });
      if (res.ok) return res.json() as Promise<ArticleData>;
    } catch { /* seguir al fallback */ }
  }

  // 2️⃣ Fallback: artículos estáticos propios de DondeVeo
  const staticArt = getStaticArticleBySlug(slug);
  if (staticArt) return staticArt as ArticleData;

  return null;
}

export async function generateStaticParams() {
  // Pre-generar los artículos estáticos conocidos
  const { STATIC_ARTICLES } = await import('@/lib/staticArticles');
  return STATIC_ARTICLES.map((a) => ({ slug: a.slug }));
}

const BASE = 'https://www.uru2.com';

export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const article = await fetchArticle(params.slug);
  if (!article) return { title: 'Artículo no encontrado' };

  const url    = `${BASE}/noticias/${article.slug}`;
  const image  = article.thumbnail ?? `${BASE}/favicon.svg`;
  const desc   = article.intro.slice(0, 160);

  return {
    title:       article.title,
    description: desc,
    keywords:    [...(article.tags ?? []), 'streaming Uruguay', 'cine Uruguay', 'DondeVeo'],
    alternates:  { canonical: url },
    openGraph: {
      title:           article.title,
      description:     desc,
      url,
      type:            'article',
      locale:          'es_UY',
      siteName:        'DondeVeo Uruguay',
      images:          [{ url: image, width: 1200, height: 630, alt: article.title }],
      publishedTime:   article.publishedAt,
      authors:         ['DondeVeo Uruguay'],
      tags:            article.tags ?? [],
    },
    twitter: {
      card:        'summary_large_image',
      title:       article.title,
      description: desc,
      images:      [image],
    },
  };
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString('es-UY', {
      day: 'numeric', month: 'long', year: 'numeric',
    });
  } catch { return ''; }
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const article = await fetchArticle(params.slug);
  // Artículo no encontrado → redirect 308 permanente a /noticias
  // Evita que Google acumule 404s de artículos viejos rotados del servidor
  if (!article) permanentRedirect('/noticias');

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.intro,
    image: article.thumbnail ? [article.thumbnail] : [],
    datePublished: article.publishedAt,
    dateModified: article.publishedAt,
    author: [{ '@type': 'Organization', name: 'DondeVeo Uruguay', url: BASE }],
    publisher: {
      '@type': 'Organization',
      name: 'DondeVeo Uruguay',
      url: BASE,
      logo: { '@type': 'ImageObject', url: `${BASE}/favicon.svg` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${BASE}/noticias/${article.slug}` },
    keywords: (article.tags ?? []).join(', '),
    articleSection: article.category,
    inLanguage: 'es-UY',
  };

  const paragraphs = article.body
    .split(/\n{2,}/)
    .map(p => p.trim())
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-dv-bg">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      {/* ── Back nav ── */}
      <div className="max-w-3xl mx-auto px-4 pt-6 pb-2">
        <Link
          href="/noticias"
          className="inline-flex items-center gap-1.5 text-dv-muted hover:text-white text-sm transition-colors"
        >
          <ArrowLeft size={14} /> Volver a noticias
        </Link>
      </div>

      {/* ── Hero thumbnail o placeholder DondeVeo ── */}
      <div className="max-w-3xl mx-auto px-4 mb-2">
        {article.thumbnail ? (
          <div className="relative w-full h-56 md:h-80 rounded-xl overflow-hidden">
            <Image
              src={article.thumbnail}
              alt={article.title}
              fill
              className="object-cover"
              unoptimized
              priority
              sizes="(max-width: 768px) 100vw, 768px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dv-bg via-transparent to-transparent" />
          </div>
        ) : (
          /* Placeholder con branding DondeVeo cuando no hay imagen */
          <div className="relative w-full h-44 md:h-64 rounded-xl overflow-hidden bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] flex flex-col items-center justify-center gap-3 border border-white/8">
            <div className="flex items-center gap-2">
              <span className="text-dv-accent text-4xl font-black">▶</span>
              <span className="text-4xl font-black text-white tracking-tight">
                Donde<span className="text-dv-accent">Veo</span>
              </span>
              <span className="text-2xl">🇺🇾</span>
            </div>
            <span className="text-dv-muted text-sm font-medium">Tu guía de streaming en Uruguay</span>
          </div>
        )}
      </div>

      {/* ── Article ── */}
      <article className="max-w-3xl mx-auto px-4 py-6">

        {/* Category */}
        <span className="inline-block bg-dv-accent/15 text-dv-accent text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-4 border border-dv-accent/30">
          {article.category}
        </span>

        {/* Title */}
        <h1 className="text-white text-2xl md:text-4xl font-black leading-tight mb-4">
          {article.title}
        </h1>

        {/* Meta */}
        <div className="flex items-center gap-4 mb-5 flex-wrap">
          <span className="flex items-center gap-1.5 text-dv-muted text-sm">
            <Clock size={13} /> {formatDate(article.publishedAt)}
          </span>
          <span className="text-dv-muted text-sm">
            Por <span className="text-white/70 font-semibold">{article.source}</span>
          </span>
        </div>

        <div className="h-px bg-white/10 mb-6" />

        {/* Intro */}
        <p className="text-white/90 text-lg leading-relaxed mb-6 font-medium">
          {article.intro}
        </p>

        {/* Body paragraphs */}
        <div className="space-y-5 mb-6">
          {paragraphs.map((p, i) => (
            <div key={i}>
              <p className="text-gray-300 text-base leading-relaxed">{p}</p>
            </div>
          ))}
        </div>

        {/* Conclusion */}
        <div className="border-l-4 border-dv-accent pl-4 py-1 mb-6">
          <p className="text-white/80 text-base leading-relaxed italic">
            {article.conclusion}
          </p>
        </div>

        {/* Tags */}
        {article.tags?.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap mb-8">
            <Tag size={13} className="text-dv-muted" />
            {article.tags.map(tag => (
              <span key={tag} className="text-[11px] text-dv-muted border border-white/10 px-2.5 py-0.5 rounded-full hover:border-white/25 transition-colors">
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="h-px bg-white/10 mb-6" />

        {/* Footer */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <p className="text-dv-muted text-xs">
            Contenido editorial de DondeVeo para Uruguay.
          </p>
          <Link href="/noticias" className="text-dv-accent text-sm font-bold hover:underline">
            ← Más noticias
          </Link>
        </div>

      </article>
    </div>
  );
}
