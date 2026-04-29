import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          background: 'linear-gradient(135deg, #0d0d0d 0%, #1a1a2e 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        {/* Outer glow ring */}
        <div
          style={{
            position: 'absolute',
            width: 22,
            height: 22,
            borderRadius: '50%',
            border: '1.5px solid #00d4aa',
            opacity: 0.4,
            display: 'flex',
          }}
        />
        {/* Play triangle */}
        <div
          style={{
            width: 0,
            height: 0,
            borderTop: '6px solid transparent',
            borderBottom: '6px solid transparent',
            borderLeft: '10px solid #00d4aa',
            marginLeft: 2,
            display: 'flex',
            filter: 'drop-shadow(0 0 4px #00d4aa)',
          }}
        />
      </div>
    ),
    { ...size }
  );
}
