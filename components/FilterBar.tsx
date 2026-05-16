'use client';

import { PLATFORMS, GENRES } from '@/lib/mockData';
import type { FilterState } from '@/types';

interface Props {
  filters: FilterState;
  onChange: (f: FilterState) => void;
}

// Only platforms with verified content in the app
const STREAMING_PLATFORMS = [
  'netflix', 'disneyplus', 'max', 'prime',
  'paramountplus', 'appletv', 'plutotv',
  'universalplus', 'directvgo', 'crunchyroll', 'mubi',
  'mercadoplay', 'curiositystream', 'plex', 'googleplay', 'viki',
];

export default function FilterBar({ filters, onChange }: Props) {
  const platforms = STREAMING_PLATFORMS.map((id) => PLATFORMS[id]).filter(Boolean);

  function togglePlatform(id: string) {
    const ids = filters.platformIds.includes(id)
      ? filters.platformIds.filter((x) => x !== id)
      : [...filters.platformIds, id];
    onChange({ ...filters, platformIds: ids });
  }

  function toggleGenre(g: string) {
    const genres = filters.genres.includes(g)
      ? filters.genres.filter((x) => x !== g)
      : [...filters.genres, g];
    onChange({ ...filters, genres });
  }

  return (
    <div className="py-3 border-b border-dv-border">
      {/* Row 1: Content type + Platforms */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-2">
        {/* Content type pills */}
        {(['all', 'movie', 'series'] as const).map((t) => (
          <button
            key={t}
            onClick={() => onChange({ ...filters, contentType: t })}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              filters.contentType === t
                ? 'bg-dv-accent text-dv-bg'
                : 'bg-white/8 text-dv-muted hover:bg-white/15 hover:text-white'
            }`}
          >
            {t === 'all' ? 'Todo' : t === 'movie' ? '🎬 Películas' : '📺 Series'}
          </button>
        ))}

        <div className="w-px h-5 bg-white/15 flex-shrink-0 mx-1" />

        {/* Platform pills */}
        {platforms.map((pl) => {
          const active = filters.platformIds.includes(pl.id);
          return (
            <button
              key={pl.id}
              onClick={() => togglePlatform(pl.id)}
              className={`flex-shrink-0 px-3 py-1 rounded-full text-[11px] font-bold transition-all border ${
                active
                  ? 'border-transparent shadow-md'
                  : 'border-white/15 text-dv-muted hover:border-white/30 hover:text-white'
              }`}
              style={
                active
                  ? { backgroundColor: pl.bgColor, color: pl.textColor }
                  : {}
              }
            >
              {pl.shortName || pl.name}
            </button>
          );
        })}
      </div>

      {/* Row 2: Genres */}
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide pt-1">
        <span className="flex-shrink-0 text-[10px] text-dv-muted font-bold uppercase tracking-wider pr-1">
          Género:
        </span>
        {GENRES.map((g) => {
          const active = filters.genres.includes(g);
          return (
            <button
              key={g}
              onClick={() => toggleGenre(g)}
              className={`flex-shrink-0 px-2.5 py-0.5 rounded-full text-[11px] transition-all ${
                active
                  ? 'bg-dv-accent/20 text-dv-accent border border-dv-accent/50'
                  : 'text-dv-muted hover:text-white border border-transparent hover:border-white/20'
              }`}
            >
              {g}
            </button>
          );
        })}
      </div>
    </div>
  );
}
