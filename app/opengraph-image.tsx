import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt     = 'DondeVeo Uruguay — Tu guía de streaming';
export const size    = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0a0a0f 0%, #111827 50%, #0a0a0f 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Fondo decorativo — círculos de luz */}
        <div style={{
          position: 'absolute', top: '-120px', left: '-120px',
          width: '500px', height: '500px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,212,170,0.12) 0%, transparent 70%)',
          display: 'flex',
        }} />
        <div style={{
          position: 'absolute', bottom: '-150px', right: '-100px',
          width: '600px', height: '600px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,212,170,0.08) 0%, transparent 70%)',
          display: 'flex',
        }} />

        {/* Línea superior decorativa */}
        <div style={{
          position: 'absolute', top: '0', left: '0', right: '0',
          height: '4px',
          background: 'linear-gradient(90deg, transparent, #00d4aa, #00d4aa, transparent)',
          display: 'flex',
        }} />

        {/* Plataformas — pills en la parte superior */}
        <div style={{
          position: 'absolute', top: '48px',
          display: 'flex', gap: '12px', alignItems: 'center',
        }}>
          {['NETFLIX', 'DISNEY+', 'MAX', 'PRIME', 'PARAMOUNT+'].map((p) => (
            <div key={p} style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '20px',
              padding: '6px 16px',
              color: 'rgba(255,255,255,0.5)',
              fontSize: '13px',
              fontWeight: 700,
              letterSpacing: '1px',
              display: 'flex',
            }}>
              {p}
            </div>
          ))}
        </div>

        {/* Logo principal */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px' }}>
          {/* Ícono play */}
          <div style={{
            width: '80px', height: '80px', borderRadius: '20px',
            background: '#00d4aa',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 40px rgba(0,212,170,0.5)',
          }}>
            <div style={{
              width: 0, height: 0,
              borderTop: '20px solid transparent',
              borderBottom: '20px solid transparent',
              borderLeft: '34px solid #0a0a0f',
              marginLeft: '6px',
              display: 'flex',
            }} />
          </div>

          {/* Texto DondeVeo */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px' }}>
              <span style={{
                fontSize: '72px', fontWeight: 900, color: '#ffffff',
                letterSpacing: '-3px', lineHeight: 1,
              }}>
                Donde
              </span>
              <span style={{
                fontSize: '72px', fontWeight: 900, color: '#00d4aa',
                letterSpacing: '-3px', lineHeight: 1,
              }}>
                Veo
              </span>
              <span style={{ fontSize: '48px', marginLeft: '8px' }}>🇺🇾</span>
            </div>
          </div>
        </div>

        {/* Tagline */}
        <div style={{
          fontSize: '28px', color: 'rgba(255,255,255,0.65)',
          fontWeight: 400, letterSpacing: '0.5px', marginBottom: '40px',
          display: 'flex',
        }}>
          Tu guía de streaming en Uruguay
        </div>

        {/* Stats / Features row */}
        <div style={{
          display: 'flex', gap: '32px', alignItems: 'center',
        }}>
          {[
            { icon: '🎬', label: 'Miles de títulos' },
            { icon: '📺', label: '15+ plataformas' },
            { icon: '🇺🇾', label: 'Hecho en Uruguay' },
            { icon: '🔔', label: 'Actualizado diario' },
          ].map((f) => (
            <div key={f.label} style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(0,212,170,0.2)',
              borderRadius: '12px',
              padding: '12px 20px',
            }}>
              <span style={{ fontSize: '22px' }}>{f.icon}</span>
              <span style={{ fontSize: '16px', color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>
                {f.label}
              </span>
            </div>
          ))}
        </div>

        {/* URL */}
        <div style={{
          position: 'absolute', bottom: '32px',
          color: 'rgba(0,212,170,0.6)', fontSize: '18px', fontWeight: 700,
          letterSpacing: '2px',
          display: 'flex',
        }}>
          URU2.COM
        </div>

        {/* Línea inferior */}
        <div style={{
          position: 'absolute', bottom: '0', left: '0', right: '0',
          height: '3px',
          background: 'linear-gradient(90deg, transparent, #00d4aa40, transparent)',
          display: 'flex',
        }} />
      </div>
    ),
    { ...size }
  );
}
