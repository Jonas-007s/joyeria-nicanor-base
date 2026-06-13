import React from 'react';
import { Link } from 'react-router-dom';
import { useConfig } from '../hooks/useConfig';
import { Instagram, Facebook, Share2 } from 'lucide-react'; // Using Share2 as generic if tiktok icon isn't standard, but lucide doesn't have tiktok natively without custom SVG sometimes. Wait, let's use default lucide icons or simple text/SVGs.

// We will use standard SVG icons to ensure they render beautifully without relying strictly on Lucide for TikTok
const TiktokIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

function Footer() {
  const { config } = useConfig();
  const year = new Date().getFullYear();
  const nombre = config?.nombreJoyeria || 'Joyería Nicanor';

  return (
    <footer style={{ background: '#0A0A0A', borderTop: '1px solid rgba(255,255,255,0.08)', padding: '60px 24px 40px', width: '100%' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        {/* Logo / Nombre */}
        <Link to="/" style={{ textDecoration: 'none', marginBottom: 24 }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 28, fontWeight: 300, color: '#FFFFFF', letterSpacing: '0.1em', margin: 0, textTransform: 'uppercase' }}>
            {nombre}
          </h2>
        </Link>
        
        {/* Slogan */}
        {config?.textos?.slogan && (
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: '#9A9080', letterSpacing: '0.05em', marginBottom: 40, textAlign: 'center', maxWidth: 400, lineHeight: 1.6 }}>
            {config.textos.slogan}
          </p>
        )}

        {/* Redes Sociales */}
        {config?.redes && (config.redes.instagram || config.redes.facebook || config.redes.tiktok) && (
          <div style={{ display: 'flex', gap: 24, marginBottom: 40 }}>
            {config.redes.instagram && (
              <a href={config.redes.instagram} target="_blank" rel="noopener noreferrer" style={{ color: '#C9A84C', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#FFFFFF'} onMouseLeave={e => e.currentTarget.style.color = '#C9A84C'} aria-label="Instagram">
                <Instagram size={20} strokeWidth={1.5} />
              </a>
            )}
            {config.redes.facebook && (
              <a href={config.redes.facebook} target="_blank" rel="noopener noreferrer" style={{ color: '#C9A84C', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#FFFFFF'} onMouseLeave={e => e.currentTarget.style.color = '#C9A84C'} aria-label="Facebook">
                <Facebook size={20} strokeWidth={1.5} />
              </a>
            )}
            {config.redes.tiktok && (
              <a href={config.redes.tiktok} target="_blank" rel="noopener noreferrer" style={{ color: '#C9A84C', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#FFFFFF'} onMouseLeave={e => e.currentTarget.style.color = '#C9A84C'} aria-label="TikTok">
                <TiktokIcon />
              </a>
            )}
          </div>
        )}

        <div style={{ width: '100%', height: 1, background: 'rgba(255,255,255,0.08)', marginBottom: 32 }} />

        {/* Copyright */}
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.4)', margin: 0, letterSpacing: '0.05em' }}>
          © {year} {nombre}. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
