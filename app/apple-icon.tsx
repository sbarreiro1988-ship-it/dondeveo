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
          background: '#00d4aa',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Play triangle */}
        <div
          style={{
            width: 0,
            height: 0,
            borderTop: '40px solid transparent',
            borderBottom: '40px solid transparent',
            borderLeft: '65px solid #0a0a0a',
            marginLeft: 12,
            display: 'flex',
          }}
        />
      </div>
    ),
    { ...size }
  );
}
