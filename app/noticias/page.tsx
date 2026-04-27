import { ArrowLeft, Newspaper } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { fetchInternalNews, fetchStreamingNews } from '@/lib/newsApi';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Noticias de cine y streaming — DondeVeo',
  description: 'Las últimas noticias de cine, series y plataformas de streaming para Uruguay. Actualizado automáticamente.',
};

function timeAgo(dateStr: string): string {
  if (!dateStr) return '';
  const diff  = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (hours < 1)  return 'Hace menos de 1h';
  if (hours < 24) return `Hace ${hours}h`;
  if (days < 7)   return `Hace ${days}d`;
  return new Date(dateStr).toLocaleDateString('es-UY', { day: 'numeric', month: 'short' });
}

export default async function NoticiasPage() {
  const internal = await fetchInternalNews();
  const news     = internal.length > 0 ? internal : await fetchStreamingNews();

  return (
    <div className="min-h-screen bg-dv-bg">
      {/* ── Header ── */}
      <div className="border-b border-white/8 px-4 md:px-8 py-5">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-dv-muted hover:text-white text-sm mb-4 transition-colors"
        >
          <ArrowLeft size={14} /> Inicio
        </Link>
        <div className="flex items-center gap-3">
          <Newspaper size={22} className="text-dv-accent" />
          <div>
            <h1 className="text-white text-2xl font-black">Noticias de cine y streaming</h1>
            <p className="text-dv-muted text-sm">Actualizado cada hora · Contenido original para Uruguay</p>
          </div>
        </div>
      </div>

      {/* ── Grid ── */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
        {news.length === 0 ? (
          <div className="text-center py-24">
            <Newspaper size={48} className="text-white/10 mx-auto mb-4" />
            <p className="text-white font-semibold mb-1">Sin noticias disponibles</p>
            <p className="text-dv-muted text-sm">Volvé en unos minutos.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {news.map((item) => {
              const hasThumbnail = item.thumbnail && item.thumbnail.startsWith('http');
              const isInternal   = !!item.slug;

              const cardContent = (
                <div className="group flex flex-col rounded-xl overflow-hidden bg-dv-card border border-white/5 hover:border-white/15 transition-all hover:shadow-xl hover:shadow-black/40 hover:-translate-y-0.5 h-full">
                  {/* Thumbnail */}
                  {hasThumbnail ? (
                    <div className="relative h-44 overflow-hidden flex-shrink-0">
                      <Image
                        src={item.thumbnail!}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        unoptimized
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-dv-card/80 to-transparent" />
                      <span className="absolute top-2 left-2 text-[9px] font-black uppercase tracking-wider bg-dv-accent/90 text-[#111] px-2 py-0.5 rounded">
                        {item.category}
                      </span>
                    </div>
                  ) : (
                    <div className="h-24 flex-shrink-0 bg-gradient-to-br from-white/5 to-black flex items-center justify-center">
                      <Newspaper size={28} className="text-white/10" />
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-4 flex flex-col flex-1">
                    <h2 className="text-white text-sm font-bold leading-snug mb-2 line-clamp-3 group-hover:text-dv-accent transition-colors">
                      {item.title}
                    </h2>
                    <p className="text-dv-muted text-[12px] leading-relaxed line-clamp-2 mb-3 flex-1">
                      {item.excerpt}
                    </p>
                    <div className="flex items-center justify-between mt-auto pt-2 border-t border-white/5">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-white/8 text-dv-muted">
                          {item.source}
                        </span>
                        {item.pubDate && (
                          <span className="text-[10px] text-dv-muted">{timeAgo(item.pubDate)}</span>
                        )}
                      </div>
                      {isInternal
                        ? <span className="text-[11px] text-dv-accent font-bold">Leer →</span>
                        : <span className="text-[10px] text-dv-muted">↗</span>}
                    </div>
                  </div>
                </div>
              );

              return isInternal
                ? <Link key={item.id} href={item.link} className="flex flex-col">{cardContent}</Link>
                : <a key={item.id} href={item.link} target="_blank" rel="noopener noreferrer" className="flex flex-col">{cardContent}</a>;
            })}
          </div>
        )}
      </div>
    </div>
  );
}
