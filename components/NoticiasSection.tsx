'use client';

import Image from 'next/image';
import { ExternalLink, Clock, Newspaper } from 'lucide-react';
import type { NewsItem } from '@/lib/newsApi';

interface Props {
  news: NewsItem[];
}

function timeAgo(dateStr: string): string {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins < 60)  return `Hace ${mins}m`;
  if (hours < 24) return `Hace ${hours}h`;
  if (days < 7)   return `Hace ${days}d`;
  return new Date(dateStr).toLocaleDateString('es-UY', { day: 'numeric', month: 'short' });
}

function SourceBadge({ source }: { source: string }) {
  return (
    <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-white/8 text-dv-muted">
      {source}
    </span>
  );
}

function NewsCard({ item }: { item: NewsItem }) {
  const hasThumbnail = item.thumbnail && item.thumbnail.startsWith('http');

  return (
    <a
      href={item.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col rounded-xl overflow-hidden bg-dv-card border border-white/5 hover:border-white/15 transition-all hover:shadow-xl hover:shadow-black/50 hover:-translate-y-0.5"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Thumbnail */}
      {hasThumbnail ? (
        <div className="relative h-40 overflow-hidden bg-black flex-shrink-0">
          <Image
            src={item.thumbnail!}
            alt={item.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            unoptimized
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dv-card/80 to-transparent" />
          {/* Category pill */}
          <span className="absolute top-2 left-2 text-[9px] font-black uppercase tracking-wider bg-dv-accent/90 text-[#111] px-2 py-0.5 rounded">
            {item.category}
          </span>
        </div>
      ) : (
        <div className="h-28 flex-shrink-0 bg-gradient-to-br from-dv-card to-black flex items-center justify-center">
          <Newspaper size={32} className="text-white/10" />
          <span className="absolute text-[9px] font-black uppercase tracking-wider bg-dv-accent/90 text-[#111] px-2 py-0.5 rounded top-2 left-2">
            {item.category}
          </span>
        </div>
      )}

      {/* Content */}
      <div className="p-3 flex flex-col flex-1">
        <h3 className="text-white text-sm font-bold leading-snug mb-2 line-clamp-3 group-hover:text-dv-accent transition-colors">
          {item.title}
        </h3>

        {item.excerpt && item.excerpt !== item.title && (
          <p className="text-dv-muted text-[11px] leading-relaxed line-clamp-2 mb-3 flex-1">
            {item.excerpt}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-white/5">
          <div className="flex items-center gap-2">
            <SourceBadge source={item.source} />
            {item.pubDate && (
              <span className="flex items-center gap-1 text-[10px] text-dv-muted">
                <Clock size={9} />
                {timeAgo(item.pubDate)}
              </span>
            )}
          </div>
          <ExternalLink size={12} className="text-dv-muted group-hover:text-dv-accent transition-colors flex-shrink-0" />
        </div>
      </div>
    </a>
  );
}

function FeaturedCard({ item }: { item: NewsItem }) {
  const hasThumbnail = item.thumbnail && item.thumbnail.startsWith('http');

  return (
    <a
      href={item.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative rounded-xl overflow-hidden bg-dv-card border border-white/5 hover:border-white/20 transition-all col-span-2 hover:shadow-2xl hover:shadow-black/60"
    >
      {hasThumbnail ? (
        <div className="relative h-56 md:h-64">
          <Image
            src={item.thumbnail!}
            alt={item.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            unoptimized
            sizes="(max-width: 1024px) 100vw, 66vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />

          {/* Category */}
          <span className="absolute top-3 left-3 text-[9px] font-black uppercase tracking-wider bg-dv-accent text-[#111] px-2 py-1 rounded">
            {item.category}
          </span>

          {/* Content at bottom */}
          <div className="absolute bottom-0 inset-x-0 p-4">
            <div className="flex items-center gap-2 mb-2">
              <SourceBadge source={item.source} />
              {item.pubDate && (
                <span className="flex items-center gap-1 text-[10px] text-white/50">
                  <Clock size={9} />
                  {timeAgo(item.pubDate)}
                </span>
              )}
            </div>
            <h3 className="text-white text-lg font-black leading-tight line-clamp-2 group-hover:text-dv-accent transition-colors mb-1">
              {item.title}
            </h3>
            {item.excerpt && item.excerpt !== item.title && (
              <p className="text-white/60 text-xs line-clamp-2">{item.excerpt}</p>
            )}
          </div>
        </div>
      ) : (
        <div className="p-5">
          <span className="text-[9px] font-black uppercase tracking-wider bg-dv-accent text-[#111] px-2 py-0.5 rounded mb-3 inline-block">
            {item.category}
          </span>
          <h3 className="text-white text-xl font-black leading-tight mb-2 group-hover:text-dv-accent transition-colors">
            {item.title}
          </h3>
          <p className="text-dv-muted text-sm line-clamp-3">{item.excerpt}</p>
        </div>
      )}
    </a>
  );
}

export default function NoticiasSection({ news }: Props) {
  if (!news || news.length === 0) return null;

  const [featured, ...rest] = news;
  const secondary = rest.slice(0, 5);

  return (
    <section id="noticias" className="mb-10 px-4 md:px-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <Newspaper size={18} className="text-dv-accent" />
          <h2 className="text-white text-lg font-bold">Noticias de streaming y cine</h2>
        </div>
        <span className="text-dv-muted text-xs">Actualizado cada 30 min</span>
      </div>

      {/* Main grid: 1 featured (2 cols) + small cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
        {/* Featured — spans 2 columns */}
        {featured && <FeaturedCard item={featured} />}

        {/* First small card alongside featured */}
        {secondary[0] && <NewsCard item={secondary[0]} />}
      </div>

      {/* Row of smaller cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {secondary.slice(1).map((item) => (
          <NewsCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
