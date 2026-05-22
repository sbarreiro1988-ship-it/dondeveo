'use client';
/**
 * AdSlot — Placeholder de anuncios.
 *
 * AdSense: rechazado. Ezoic: rechazado.
 * Red actual: ninguna — componente desactivado hasta nueva aprobación.
 *
 * Para activar Media.net cuando sea aprobado:
 *   1. Crear cuenta en media.net con el dominio uru2.com
 *   2. Copiar el script de header en layout.tsx (similar al de AdSense)
 *   3. Reemplazar el contenido de este componente con las unidades de Media.net
 *
 * Para activar Amazon Native Ads:
 *   https://affiliate-program.amazon.com/home/ads/native
 */

interface Props {
  slot?: string;
  format?: string;
  layout?: string;
  className?: string;
  fullWidth?: boolean;
  style?: React.CSSProperties;
}

// Renderiza vacío hasta que se apruebe una red de anuncios
export default function AdSlot({ className = '' }: Props) {
  return <div className={className} aria-hidden="true" />;
}

interface AnchorProps {
  slot?: string;
  onClose?: () => void;
}
export function AdAnchor(_: AnchorProps) {
  return null;
}
