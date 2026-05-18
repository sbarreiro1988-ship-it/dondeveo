'use client';

interface Props {
  category?: string;
  className?: string;
}

export default function ArticleHeroFallback({ category, className = '' }: Props) {
  return (
    <div
      className={`relative w-full h-44 md:h-64 rounded-xl overflow-hidden flex flex-col items-center justify-center gap-3 border border-white/8 ${className}`}
      style={{
        background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a2e 40%, #0f3460 100%)',
      }}
    >
      {/* Film grain lines — efecto película */}
      <div
        className="pointer-events-none absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
        }}
      />

      {/* Vignette */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)',
        }}
      />

      {/* Center content */}
      <div className="relative flex flex-col items-center gap-2 z-10">
        <div className="flex items-center gap-2">
          <span className="text-dv-accent text-3xl md:text-4xl font-black">▶</span>
          <span className="text-3xl md:text-4xl font-black text-white tracking-tight">
            Donde<span className="text-dv-accent">Veo</span>
          </span>
          <span className="text-xl md:text-2xl">🇺🇾</span>
        </div>
        {category ? (
          <span className="text-dv-accent text-xs font-black uppercase tracking-widest bg-dv-accent/10 px-3 py-1 rounded-full border border-dv-accent/30">
            {category}
          </span>
        ) : (
          <span className="text-white/40 text-sm font-medium">
            Tu guía de streaming en Uruguay
          </span>
        )}
      </div>
    </div>
  );
}
