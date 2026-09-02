import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Clock, Tag } from 'lucide-react';
import type { Metadata } from 'next';
import { getStaticArticleBySlug } from '@/lib/staticArticles';
import AdSlot from '@/components/AdSlot';
import ArticleAnchorAd from '@/components/ArticleAnchorAd';
import ArticleHeroFallback from '@/components/ArticleHeroFallback';

export const revalidate    = 7200; // 2h — reducir CPU en cPanel
export const dynamicParams = true;

const BASE = 'https://www.uru2.com';

interface ArticleData {
  uid:         string;
  slug:        string;
  title:       string;
  intro:       string;
  body:        string;
  content?:    string;  // campo HTML/markdown largo, tiene prioridad sobre body
  conclusion:  string;
  tags:        string[];
  category:    string;
  thumbnail:   string | null;
  source:      string;
  originalUrl: string;
  publishedAt: string;
}

async function fetchArticle(slug: string): Promise<ArticleData | null> {
  // 1. Artículos del script Gemini (cPanel via NEWS_DATA_URL)
  const baseUrl = process.env.NEWS_DATA_URL;
  if (baseUrl) {
    try {
      const res = await fetch(`${baseUrl}/articles/${slug}.json`, {
        next: { revalidate: 7200 },
        signal: AbortSignal.timeout(5000),
      });
      if (res.ok) return res.json() as Promise<ArticleData>;
    } catch { /* seguir al fallback */ }
  }

  // 2. Fallback: artículos estáticos propios de DondeVeo
  const staticArt = getStaticArticleBySlug(slug);
  if (staticArt) return staticArt as ArticleData;

  return null;
}

export async function generateStaticParams() {
  const { STATIC_ARTICLES } = await import('@/lib/staticArticles');
  return STATIC_ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const article = await fetchArticle(params.slug);
  if (!article) return {
    title: 'Artículo no encontrado | DondeVeo',
    robots: { index: false, follow: false },
  };

  const url   = `${BASE}/noticias/${article.slug}`;
  const image = article.thumbnail ?? `${BASE}/opengraph-image`;
  const desc  = article.intro.slice(0, 160);

  return {
    title:       article.title,
    description: desc,
    keywords:    [...(article.tags ?? []), 'streaming Uruguay', 'cine Uruguay', 'DondeVeo'],
    alternates:  { canonical: url },
    robots: {
      index: true,
      follow: true,
    },
    authors: [{ name: article.source, url: BASE }],
    openGraph: {
      title:         article.title,
      description:   desc,
      url,
      type:          'article',
      locale:        'es_UY',
      siteName:      'DondeVeo Uruguay',
      images:        [{ url: image, width: 1200, height: 630, alt: article.title }],
      publishedTime: article.publishedAt,
      modifiedTime:  article.publishedAt,
      authors:       ['DondeVeo Uruguay'],
      tags:          article.tags ?? [],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...(article.category ? { section: article.category } as any : {}),
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

/**
 * Parsea el campo `content` del artículo.
 * Si contiene etiquetas HTML, las deja pasar como HTML seguro (se renderiza con
 * dangerouslySetInnerHTML sólo en el servidor — no llega JS al cliente).
 * Si es markdown plano lo divide en párrafos igualmente.
 */
function isHtml(str: string): boolean {
  return /<[a-z][\s\S]*>/i.test(str);
}

function htmlToParagraphs(html: string): string[] {
  // Divide el HTML en bloques visuales separados por bloques de bloque
  return html
    .split(/<\/?(p|h[1-6]|blockquote|li|div|br\s*\/?)[^>]*>/i)
    .map(s => s.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim())
    .filter(Boolean);
}

function getParagraphs(article: ArticleData): { type: 'html' | 'text'; content: string }[] {
  const source = article.content || article.body;
  if (!source?.trim()) return [];

  if (isHtml(source)) {
    // Intentamos extraer secciones: h2/h3 + párrafos
    const blocks = source
      .split(/(<h[1-6][^>]*>.*?<\/h[1-6]>|<p[^>]*>.*?<\/p>|<blockquote[^>]*>[\s\S]*?<\/blockquote>)/i)
      .filter(Boolean);

    if (blocks.length > 1) {
      return blocks
        .map(b => b.trim())
        .filter(Boolean)
        .map(b => ({ type: 'html' as const, content: b }));
    }

    // Fallback: extraer texto limpio en párrafos
    return htmlToParagraphs(source).map(p => ({ type: 'text' as const, content: p }));
  }

  // Markdown / texto plano — dividir por doble salto
  return source
    .split(/\n{2,}/)
    .map(p => p.trim())
    .filter(Boolean)
    .map(p => ({ type: 'text' as const, content: p }));
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const article = await fetchArticle(params.slug);
  if (!article) notFound();

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.intro,
    image: article.thumbnail
      ? [{ '@type': 'ImageObject', url: article.thumbnail, width: 1200, height: 630 }]
      : [{ '@type': 'ImageObject', url: `${BASE}/favicon.svg`, width: 48, height: 48 }],
    datePublished: article.publishedAt,
    dateModified: article.publishedAt,
    author: [{
      '@type': 'Organization',
      name: article.source || 'DondeVeo Uruguay',
      url: BASE,
    }],
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
    url: `${BASE}/noticias/${article.slug}`,
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['h1', 'p:first-of-type'],
    },
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: BASE },
      { '@type': 'ListItem', position: 2, name: 'Noticias', item: `${BASE}/noticias` },
      { '@type': 'ListItem', position: 3, name: article.title, item: `${BASE}/noticias/${article.slug}` },
    ],
  };

  const paragraphs = getParagraphs(article);

  return (
    <div className="min-h-screen bg-dv-bg">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
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

      {/* ── Hero thumbnail o fallback cinematográfico ── */}
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
          <ArticleHeroFallback category={article.category} />
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

        {/* ── Ad 1: debajo del intro ── */}
        <AdSlot slot="1612024208" format="auto" className="mb-6" />

        {/* Body — ad cada 3 párrafos */}
        <div className="space-y-5 mb-6">
          {paragraphs.map((para, i) => (
            <div key={i}>
              {para.type === 'html' ? (
                <div
                  className="text-gray-200 text-lg leading-relaxed [&_h1]:text-white [&_h1]:font-bold [&_h1]:text-2xl [&_h2]:text-white [&_h2]:font-bold [&_h2]:text-xl [&_h3]:text-white [&_h3]:font-bold [&_h3]:text-lg [&_blockquote]:border-l-4 [&_blockquote]:border-dv-accent [&_blockquote]:italic [&_blockquote]:pl-4 [&_blockquote]:text-white/70 [&_a]:text-dv-accent [&_a]:hover:underline [&_strong]:text-white [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5"
                  dangerouslySetInnerHTML={{ __html: para.content }}
                />
              ) : (
                <p className="text-gray-200 text-lg leading-relaxed">{para.content}</p>
              )}
              {/* ── Ad 2: in-article cada 3 párrafos ── */}
              {(i + 1) % 3 === 0 && paragraphs.length > 3 && (
                <AdSlot
                  slot="8582573929"
                  format="fluid"
                  layout="in-article"
                  className="my-4"
                  fullWidth={false}
                />
              )}
            </div>
          ))}
        </div>

        {/* Conclusion */}
        {article.conclusion && (
          <div className="border-l-4 border-dv-accent pl-4 py-1 mb-6">
            <p className="text-white/80 text-base leading-relaxed italic">
              {article.conclusion}
            </p>
          </div>
        )}

        {/* ── Ad 3: debajo de la conclusión ── */}
        <AdSlot slot="1612024208" format="auto" className="mb-6" />

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
        <div className="flex items-center justify-between flex-wrap gap-3 pb-24">
          <p className="text-dv-muted text-xs">
            Contenido editorial de DondeVeo para Uruguay.
          </p>
          <Link href="/noticias" className="text-dv-accent text-sm font-bold hover:underline">
            ← Más noticias
          </Link>
        </div>

      </article>

      {/* ── Ad 4: Sticky anchor inferior ── */}
      <ArticleAnchorAd />

    </div>
  );
}
