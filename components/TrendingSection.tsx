'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { NewsItem } from '@/lib/newsApi';

interface Props {
  news: NewsItem[];
}

function timeAgo(dateStr: string): string {
  if (!dateStr) return '';
  const diff  = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (hours < 1)  return 'Ahora';
  if (hours < 24) return `Hace ${hours}h`;
  if (days < 7)   return `Hace ${days}d`;
  return new Date(dateStr).toLocaleDateString('es-UY', { day: 'numeric', month: 'short' });
}

/* ─── Hero card — ocupa todo el ancho ─────────────────────────── */
function HeroTrendCard({ item }: { item: NewsItem }) {
  return (
    <Link href={item.link}
      className="group relative block rounded-2xl overflow-hidden h-[340px] md:h-[440px] lg:h-[500px] bg-[#111] border border-white/8 hover:border-dv-accent/40 transition-all shadow-2xl shadow-black/60">
      {item.thumbnail && (
        <Image
          src={item.thumbnail}
          alt={item.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700"
          unoptimized
          priority
          sizes="100vw"
        />
      )}
      {/* Gradient overlay — strong bottom to top */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/10" />

      {/* Badge */}
      <div className="absolute top-4 left-4 flex items-center gap-2">
        <span className="flex items-center gap-1.5 bg-dv-accent text-[#111] text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full">
          ⚡ Tendencia
        </span>
        <span className="bg-black/60 backdrop-blur text-white/70 text-[10px] font-semibold px-2 py-0.5 rounded-full">
          {item.category}
        </span>
      </div>

      {/* Content at bottom */}
      <div className="absolute bottom-0 inset-x-0 p-5 md:p-7">
        <p className="text-dv-accent text-xs font-bold uppercase tracking-widest mb-2">
          {item.source} · {timeAgo(item.pubDate)}
        </p>
        <h2 className="text-white text-2xl md:text-3xl lg:text-4xl font-black leading-tight mb-3 group-hover:text-dv-accent transition-colors line-clamp-3 drop-shadow-lg">
          {item.title}
        </h2>
        {item.excerpt && (
          <p className="text-white/65 text-sm leading-relaxed line-clamp-2 mb-4 max-w-2xl">
            {item.excerpt}
          </p>
        )}
        <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur hover:bg-dv-accent hover:text-[#111] text-white text-sm font-bold px-4 py-2 rounded-xl transition-all border border-white/15 hover:border-dv-accent">
          Leer artículo completo →
        </span>
      </div>
    </Link>
  );
}

/* ─── Card secundaria ─────────────────────────────────────────── */
function TrendCard({ item, rank }: { item: NewsItem; rank?: number }) {
  return (
    <Link href={item.link}
      className="group relative flex flex-col rounded-xl overflow-hidden bg-dv-card border border-white/6 hover:border-dv-accent/30 transition-all hover:shadow-xl hover:shadow-black/50 hover:-translate-y-0.5 h-full">

      {/* Image */}
      <div className="relative h-44 flex-shrink-0 bg-[#111] overflow-hidden">
        {item.thumbnail ? (
          <Image
            src={item.thumbnail}
            alt={item.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            unoptimized
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="h-full bg-gradient-to-br from-[#1a1a2e] to-[#0f3460] flex items-center justify-center">
            <span className="text-dv-accent/30 text-4xl font-black">▶</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-dv-card/90 via-transparent to-transparent" />

        {/* Category */}
        <span className="absolute top-2 left-2 text-[9px] font-black uppercase tracking-wider bg-dv-accent/90 text-[#111] px-2 py-0.5 rounded">
          {item.category}
        </span>

        {/* Rank number */}
        {rank !== undefined && (
          <span className="absolute bottom-2 right-2 text-white/15 text-5xl font-black leading-none select-none">
            {rank}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-3.5 flex flex-col flex-1">
        <h3 className="text-white text-sm font-bold leading-snug mb-2 line-clamp-3 group-hover:text-dv-accent transition-colors flex-1">
          {item.title}
        </h3>
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-white/6">
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] font-bold uppercase tracking-wider text-dv-muted bg-white/6 px-1.5 py-0.5 rounded">
              {item.source.split(/[-–|:]/)[0].trim().slice(0, 15)}
            </span>
            {item.pubDate && (
              <span className="text-[10px] text-dv-muted">{timeAgo(item.pubDate)}</span>
            )}
          </div>
          <span className="text-dv-accent text-[10px] font-bold">Leer →</span>
        </div>
      </div>
    </Link>
  );
}

/* ─── Main export ─────────────────────────────────────────────── */
export default function TrendingSection({ news }: Props) {
  // Solo artículos marcados como isTrending (editoriales/clickbait generados por IA)
  const internal = (news || []).filter(n => n.isTrending && !!n.slug && n.thumbnail?.startsWith('http'));

  if (internal.length < 1) return null;

  const [hero, ...rest] = internal;
  const cards = rest.slice(0, 6); // hasta 6 cards secundarias

  return (
    <section className="mb-12 px-4 md:px-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <h2 className="text-white text-xl font-black leading-tight flex items-center gap-2">
              <span className="text-dv-accent">⚡</span>
              Lo que no te podés perder
            </h2>
            <p className="text-dv-muted text-xs mt-0.5">
              Estrenos, finales, cancelaciones y tendencias del momento
            </p>
          </div>
        </div>
        <Link href="/noticias"
          className="hidden sm:inline-flex text-dv-accent text-xs font-bold border border-dv-accent/30 px-3 py-1.5 rounded-lg hover:bg-dv-accent/10 transition-colors">
          Ver todo →
        </Link>
      </div>

      {/* Hero */}
      <div className="mb-4">
        <HeroTrendCard item={hero} />
      </div>

      {/* Secondary grid — hasta 6 cards para más contenido indexable */}
      {cards.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {cards.map((item, i) => (
            <TrendCard key={item.id} item={item} rank={i + 2} />
          ))}
        </div>
      )}

      {/* Mobile CTA */}
      <div className="mt-4 text-center sm:hidden">
        <Link href="/noticias"
          className="inline-flex items-center gap-2 text-dv-accent text-sm font-bold border border-dv-accent/30 px-4 py-2 rounded-xl hover:bg-dv-accent/10 transition-colors">
          Ver todas las tendencias →
        </Link>
      </div>
    </section>
  );
}
