'use client';

import type { Platform } from '@/types';

interface Props {
  platform: Platform;
  size?: 'sm' | 'md' | 'lg';
  showName?: boolean;
}

export default function StreamingBadge({ platform, size = 'sm', showName = false }: Props) {
  const sizeClasses = {
    sm: 'text-[9px] px-1.5 py-0.5 rounded font-bold',
    md: 'text-xs px-2 py-1 rounded-md font-bold',
    lg: 'text-sm px-3 py-1.5 rounded-lg font-bold',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 ${sizeClasses[size]} whitespace-nowrap tracking-wide`}
      style={{ backgroundColor: platform.bgColor, color: platform.textColor }}
      title={platform.name}
    >
      <span>{platform.shortName || platform.name}</span>
      {showName && size !== 'sm' && platform.shortName && (
        <span className="font-normal opacity-80">{platform.name}</span>
      )}
    </span>
  );
}
