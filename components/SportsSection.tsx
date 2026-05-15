'use client';

import Image from 'next/image';
import { Clock, Calendar } from 'lucide-react';
import StreamingBadge from './StreamingBadge';
import type { SportEvent } from '@/types';

const SPORT_GRADIENTS: Record<string, string> = {
  football:   'from-green-950 via-green-900 to-emerald-950',
  formula1:   'from-gray-950 via-red-950 to-gray-950',
  tennis:     'from-orange-950 via-amber-900 to-orange-950',
  basketball: 'from-orange-950 via-orange-800 to-red-950',
  rugby:      'from-green-950 via-teal-900 to-green-950',
  ufc:        'from-red-950 via-red-900 to-gray-950',
  cycling:    'from-yellow-950 via-yellow-800 to-orange-950',
  other:      'from-purple-950 via-purple-900 to-indigo-950',
};

const SPORT_EMOJI: Record<string, string> = {
  football: '⚽', formula1: '🏎️', tennis: '🎾',
  basketball: '🏀', rugby: '🏉', ufc: '🥊',
  cycling: '🚴', other: '🏆',
};

interface Props {
  events: SportEvent[];
}

export default function SportsSection({ events }: Props) {
  // Football only
  const footballEvents = events.filter((e) => e.sport === 'football');
  if (footballEvents.length === 0) return null;

  const live     = footballEvents.filter((e) => e.isLive);
  const upcoming = footballEvents.filter((e) => !e.isLive);

  return (
    <section id="futbol" className="mb-10 px-4 md:px-8">
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-5">
        <span className="text-xl leading-none">⚽</span>
        <h2 className="text-white text-lg font-bold">Fútbol</h2>
        {live.length > 0 && (
          <span className="flex items-center gap-1.5 bg-red-600/20 border border-red-500/40 text-red-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative rounded-full h-1.5 w-1.5 bg-red-500" />
            </span>
            {live.length} EN VIVO
          </span>
        )}
      </div>

      {/* Live events */}
      {live.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
          {live.map((e) => <EventCard key={e.id} event={e} />)}
        </div>
      )}

      {/* Upcoming */}
      {upcoming.length > 0 && (
        <>
          <p className="text-dv-muted text-[10px] font-bold uppercase tracking-widest mb-3">
            Próximos eventos
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {upcoming.map((e) => <EventCard key={e.id} event={e} />)}
          </div>
        </>
      )}
    </section>
  );
}

function TeamLogo({ src, name, size = 40 }: { src?: string; name: string; size?: number }) {
  if (!src) {
    return (
      <div
        className="rounded-full bg-white/10 flex items-center justify-center text-white font-black text-xs flex-shrink-0"
        style={{ width: size, height: size }}
      >
        {name.slice(0, 2).toUpperCase()}
      </div>
    );
  }
  return (
    <div className="flex-shrink-0" style={{ width: size, height: size }}>
      <Image
        src={src}
        alt={name}
        width={size}
        height={size}
        className="object-contain drop-shadow-md"
        unoptimized
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = 'none';
        }}
      />
    </div>
  );
}

function EventCard({ event }: { event: SportEvent }) {
  const gradient = SPORT_GRADIENTS[event.sport] ?? SPORT_GRADIENTS.other;
  const emoji = SPORT_EMOJI[event.sport] ?? '🏆';
  const dateLabel = formatDate(event.date);
  const hasLogos = !!(event.logoA || event.logoB);
  const leagueName = event.league.replace(/ — .*$/, ''); // strip " — Country" if present

  return (
    <div className="rounded-xl overflow-hidden bg-dv-card border border-dv-border hover:border-white/25 transition-all cursor-pointer group hover:shadow-xl hover:shadow-black/50">
      {/* ── Match header ── */}
      <div className={`relative bg-gradient-to-br ${gradient} px-4 py-3`}>
        {/* League row */}
        <div className="flex items-center gap-2 mb-3">
          {event.leagueLogo ? (
            <Image src={event.leagueLogo} alt={leagueName} width={18} height={18} className="object-contain" unoptimized />
          ) : (
            <span className="text-base leading-none">{emoji}</span>
          )}
          <span className="text-white/70 text-[11px] font-semibold truncate flex-1">{leagueName}</span>

          {event.isLive ? (
            <span className="flex items-center gap-1 bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full flex-shrink-0">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute h-full w-full rounded-full bg-white opacity-75" />
                <span className="relative rounded-full h-1.5 w-1.5 bg-white" />
              </span>
              {event.liveMinute ? `${event.liveMinute}'` : 'EN VIVO'}
            </span>
          ) : (
            event.isUruguay && (
              <span className="text-[11px] bg-black/40 px-1.5 py-0.5 rounded-full flex-shrink-0">🇺🇾</span>
            )
          )}
        </div>

        {/* Teams vs score */}
        {event.teamA && event.teamB ? (
          <div className="flex items-center justify-between gap-2">
            {/* Home team */}
            <div className="flex flex-col items-center gap-1.5 flex-1 min-w-0">
              {hasLogos && <TeamLogo src={event.logoA} name={event.teamA} size={36} />}
              <span className="text-white text-xs font-bold text-center leading-tight line-clamp-2">
                {event.teamA}
              </span>
            </div>

            {/* Score / VS */}
            <div className="flex-shrink-0 flex flex-col items-center">
              {event.score ? (
                <span className="text-white font-black text-2xl tracking-tighter leading-none">
                  {event.score}
                </span>
              ) : (
                <span className="text-dv-accent font-black text-base">VS</span>
              )}
              {event.isLive && (
                <span className="text-red-400 text-[9px] font-bold mt-0.5">EN VIVO</span>
              )}
            </div>

            {/* Away team */}
            <div className="flex flex-col items-center gap-1.5 flex-1 min-w-0">
              {hasLogos && <TeamLogo src={event.logoB} name={event.teamB} size={36} />}
              <span className="text-white text-xs font-bold text-center leading-tight line-clamp-2">
                {event.teamB}
              </span>
            </div>
          </div>
        ) : (
          <p className="text-white font-bold text-center">{event.title}</p>
        )}
      </div>

      {/* ── Footer ── */}
      <div className="px-4 py-2.5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-dv-muted text-[11px]">
            <Calendar size={10} />
            {dateLabel}
          </span>
          {!event.isLive && (
            <span className="flex items-center gap-1 text-dv-muted text-[11px]">
              <Clock size={10} />
              {event.time} UYT
            </span>
          )}
          {event.description && (
            <span className="text-dv-muted text-[10px] truncate hidden sm:block">{event.description}</span>
          )}
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          {event.platforms.slice(0, 3).map((pl) => (
            <StreamingBadge key={pl.id} platform={pl} size="sm" />
          ))}
        </div>
      </div>
    </div>
  );
}

function formatDate(dateStr: string): string {
  const today    = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  if (dateStr === today)    return '🔴 Hoy';
  if (dateStr === tomorrow) return 'Mañana';
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('es-UY', {
    weekday: 'short', day: 'numeric', month: 'short',
  });
}
