import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          borderRadius: 40,
          background: 'linear-gradient(135deg, #0d0d0d 0%, #1a1a2e 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 6,
        }}
      >
        {/* Play circle */}
        <div
          style={{
            width: 90,
            height: 90,
            borderRadius: '50%',
            border: '3px solid #00d4aa',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              width: 0,
              height: 0,
              borderTop: '22px solid transparent',
              borderBottom: '22px solid transparent',
              borderLeft: '36px solid #00d4aa',
              marginLeft: 8,
              display: 'flex',
            }}
          />
        </div>
        {/* Text */}
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: 0,
          }}
        >
          <span style={{ color: '#ffffff', fontSize: 22, fontWeight: 900, letterSpacing: -1 }}>
            Donde
          </span>
          <span style={{ color: '#00d4aa', fontSize: 22, fontWeight: 900, letterSpacing: -1 }}>
            Veo
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
