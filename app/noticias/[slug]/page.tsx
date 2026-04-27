import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Clock, Tag } from 'lucide-react';
import type { Metadata } from 'next';

export const revalidate = 3600; // Revalida cada hora (igual que el cron)
export const dynamicParams = true; // Permite slugs nuevos sin redeploy

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
  createdAt:   string;
}

async function fetchArticle(slug: string): Promise<ArticleData | null> {
  const baseUrl = process.env.NEWS_DATA_URL;
  if (!baseUrl) return null;
  try {
    const res = await fetch(`${baseUrl}/articles/${slug}.json`, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return null;
    return res.json() as Promise<ArticleData>;
  } catch {
    return null;
  }
}

export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const article = await fetchArticle(params.slug);
  if (!article) return { title: 'Artículo no encontrado — DondeVeo' };
  return {
    title:       `${article.title} — DondeVeo`,
    description: article.intro,
    openGraph: {
      title:       article.title,
      description: article.intro,
      images:      article.thumbnail ? [article.thumbnail] : [],
      type:        'article',
    },
    twitter: {
      card:        'summary_large_image',
      title:       article.title,
      description: article.intro,
      images:      article.thumbnail ? [article.thumbnail] : [],
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
  if (!article) notFound();

  // Separar body en párrafos
  const paragraphs = article.body
    .split(/\n{2,}/)
    .map(p => p.trim())
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-dv-bg">
      {/* ── Back nav ── */}
      <div className="max-w-3xl mx-auto px-4 pt-6 pb-2">
        <Link
          href="/#noticias"
          className="inline-flex items-center gap-1.5 text-dv-muted hover:text-white text-sm transition-colors"
        >
          <ArrowLeft size={14} /> Volver a noticias
        </Link>
      </div>

      {/* ── Hero / Thumbnail ── */}
      {article.thumbnail && (
        <div className="relative w-full max-w-3xl mx-auto h-56 md:h-80 overflow-hidden rounded-xl mt-2 mb-0 px-4">
          <div className="relative w-full h-full rounded-xl overflow-hidden">
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
        </div>
      )}

      {/* ── Article content ── */}
      <article className="max-w-3xl mx-auto px-4 py-8">
        {/* Category pill */}
        <span className="inline-block bg-dv-accent/15 text-dv-accent text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-4 border border-dv-accent/30">
          {article.category}
        </span>

        {/* Title */}
        <h1 className="text-white text-2xl md:text-4xl font-black leading-tight mb-4">
          {article.title}
        </h1>

        {/* Meta */}
        <div className="flex items-center gap-4 mb-6 flex-wrap">
          <span className="flex items-center gap-1.5 text-dv-muted text-sm">
            <Clock size={13} />
            {formatDate(article.publishedAt)}
          </span>
          <span className="text-dv-muted text-sm">
            Basado en <span className="text-white/70">{article.source}</span>
          </span>
        </div>

        {/* Divider */}
        <div className="h-px bg-white/10 mb-6" />

        {/* Intro */}
        <p className="text-white/90 text-lg leading-relaxed mb-6 font-medium">
          {article.intro}
        </p>

        {/* Body paragraphs */}
        <div className="space-y-5 mb-6">
          {paragraphs.map((p, i) => (
            <p key={i} className="text-gray-300 text-base leading-relaxed">
              {p}
            </p>
          ))}
        </div>

        {/* Conclusion */}
        <div className="border-l-4 border-dv-accent pl-4 py-1 mb-8">
          <p className="text-white/80 text-base leading-relaxed italic">
            {article.conclusion}
          </p>
        </div>

        {/* Tags */}
        {article.tags?.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap mb-8">
            <Tag size={13} className="text-dv-muted" />
            {article.tags.map(tag => (
              <span
                key={tag}
                className="text-[11px] text-dv-muted border border-white/10 px-2.5 py-0.5 rounded-full hover:border-white/25 transition-colors"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Divider */}
        <div className="h-px bg-white/10 mb-6" />

        {/* Footer */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <p className="text-dv-muted text-xs">
            Contenido original de DondeVeo, basado en información pública de {article.source}.
          </p>
          <Link
            href="/#noticias"
            className="text-dv-accent text-sm font-bold hover:underline"
          >
            ← Más noticias
          </Link>
        </div>
      </article>
    </div>
  );
}
