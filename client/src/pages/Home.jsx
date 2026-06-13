import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { Link } from 'react-router-dom';
import LaunchCarousel from '../components/LaunchCarousel';
import { useProducts, TIPOS_JOYA } from '../hooks/useProducts';
import { useConfig } from '../hooks/useConfig';

/* ─── Filtro tipo pill ──────────────────────────────────────────────────── */
function FilterPill({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '8px 20px',
        borderRadius: 2,
        border: active ? '1px solid #0A0A0A' : '1px solid #D8D3C8',
        background: active ? '#0A0A0A' : 'transparent',
        color: active ? '#FFFFFF' : '#6B6560',
        fontFamily: "'Inter', sans-serif",
        fontSize: 11,
        fontWeight: active ? 700 : 400,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        cursor: 'pointer',
        transition: 'all 0.18s ease',
        whiteSpace: 'nowrap',
      }}
      onMouseEnter={e => {
        if (!active) {
          e.currentTarget.style.borderColor = '#0A0A0A';
          e.currentTarget.style.color = '#0A0A0A';
        }
      }}
      onMouseLeave={e => {
        if (!active) {
          e.currentTarget.style.borderColor = '#D8D3C8';
          e.currentTarget.style.color = '#6B6560';
        }
      }}
    >
      {label}
    </button>
  );
}

/* ─── Home ───────────────────────────────────────────────────────────────── */
function Home() {
  const { coleccion, nuevosLanzamientos, loading: productsLoading, error } = useProducts();
  const { config, loading: configLoading } = useConfig();
  const [filtroActivo, setFiltroActivo] = useState('todos');

  const loading = productsLoading || configLoading;

  // Filtrar colección según tipo activo
  const productosFiltrados = useMemo(() => {
    if (filtroActivo === 'todos') return coleccion;
    return coleccion.filter(p =>
      p.categoria?.toLowerCase().trim() === filtroActivo
    );
  }, [coleccion, filtroActivo]);

  // Contar productos por tipo para mostrar badge
  const conteos = useMemo(() => {
    const map = {};
    coleccion.forEach(p => {
      const cat = p.categoria?.toLowerCase().trim() || 'otro';
      map[cat] = (map[cat] || 0) + 1;
    });
    return map;
  }, [coleccion]);

  return (
    <div className="w-full min-h-screen" style={{ background: '#F7F5F0' }}>

      {/* Banner superior */}
      {config?.textos?.bannerTop && (
        <div style={{ background: '#0A0A0A', padding: '12px 16px', textAlign: 'center' }}>
          <p style={{ color: '#C9A84C', fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', margin: 0 }}>
            {config.textos.bannerTop}
          </p>
        </div>
      )}

      {/* ── Sección Lanzamiento ────────────────────────────────────────── */}
      {nuevosLanzamientos && nuevosLanzamientos.length > 0 && (
        <section style={{ background: '#0A0A0A', padding: '80px 0', position: 'relative', overflow: 'hidden', minHeight: 680, display: 'flex', alignItems: 'center', width: '100%' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, #1a1a1a 0%, #0a0a0a 70%)', opacity: 0.9 }} />
          <div style={{ position: 'relative', width: '100%', zIndex: 1 }}>
            <LaunchCarousel launches={nuevosLanzamientos} />
          </div>
        </section>
      )}

      {/* ── Colección Principal ─────────────────────────────────────────── */}
      <section style={{ padding: '80px 24px 100px', maxWidth: 1400, margin: '0 auto' }}>

        {/* Encabezado de sección */}
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: 12, fontWeight: 600 }}>
            Joyería Artesanal
          </p>
          <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 300, color: '#0A0A0A', margin: '0 0 20px', letterSpacing: '0.04em' }}>
            Nuestra Colección
          </h2>
          <div style={{ width: 48, height: 1, background: 'linear-gradient(to right, transparent, #C9A84C, transparent)', margin: '0 auto 16px' }} />
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: '#9A9080', maxWidth: 480, margin: '0 auto', lineHeight: 1.7 }}>
            Cada pieza, una historia. Descubre nuestra selección de joyas de autor, elaboradas con los más finos materiales.
          </p>
        </div>

        {/* Filtros de categoría */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginBottom: 52 }}>
          <FilterPill
            label={`Todas las Piezas${!loading ? ` (${coleccion.length})` : ''}`}
            active={filtroActivo === 'todos'}
            onClick={() => setFiltroActivo('todos')}
          />
          {TIPOS_JOYA.map(t => {
            const count = conteos[t.value] || 0;
            if (count === 0) return null; // No mostrar filtros vacíos
            return (
              <FilterPill
                key={t.value}
                label={`${t.label} (${count})`}
                active={filtroActivo === t.value}
                onClick={() => setFiltroActivo(t.value)}
              />
            );
          })}
        </div>

        {/* Grid de productos */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '64px 0' }}>
            <div style={{ width: 24, height: 24, border: '1.5px solid #E8E3D8', borderTopColor: '#C9A84C', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '64px 0', color: '#9A9080', fontFamily: "'Inter', sans-serif" }}>
            {error}
          </div>
        ) : productosFiltrados.length > 0 ? (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 28 }}>
              {productosFiltrados.map((producto, idx) => (
                <div
                  key={producto?._id || idx}
                  style={{ transition: 'transform 0.25s ease, box-shadow 0.25s ease' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 20px 48px rgba(0,0,0,0.10)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <ProductCard prod={producto} />
                </div>
              ))}
            </div>

            {/* CTA ver catálogo completo */}
            <div style={{ textAlign: 'center', marginTop: 64 }}>
              <Link
                to="/productos"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 10,
                  padding: '14px 36px',
                  border: '1px solid #0A0A0A',
                  color: '#0A0A0A',
                  textDecoration: 'none',
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase',
                  transition: 'all 0.2s ease',
                  borderRadius: 2,
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#0A0A0A'; e.currentTarget.style.color = '#FFFFFF'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#0A0A0A'; }}
              >
                Explorar Catálogo Completo
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 22, fontWeight: 300, color: '#9A9080' }}>
              No hay piezas en esta categoría aún
            </p>
            <button
              onClick={() => setFiltroActivo('todos')}
              style={{ marginTop: 20, padding: '10px 24px', border: '1px solid #C9A84C', background: 'transparent', color: '#C9A84C', fontFamily: "'Inter', sans-serif", fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer', borderRadius: 2 }}
            >
              Ver toda la colección
            </button>
          </div>
        )}
      </section>

      {/* ── Contacto ─────────────────────────────────────────────────────── */}
      <section style={{ background: '#0A0A0A', padding: '80px 24px', width: '100%' }}>
        <div style={{ maxWidth: 920, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: 12, fontWeight: 600 }}>Atención Personalizada</p>
            <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 300, color: '#FFFFFF', margin: '0 0 16px', letterSpacing: '0.04em' }}>
              ¿Cómo puedo ayudarte?
            </h2>
            <div style={{ width: 48, height: 1, background: 'linear-gradient(to right, transparent, #C9A84C, transparent)', margin: '0 auto' }} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.4fr] gap-12 items-start">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {[
                { title: 'Piezas Personalizadas', text: 'Para consultas sobre una pieza personalizada, cuéntame tu visión: presupuesto, estilo, piedras preciosas, materiales.' },
                { title: 'Soporte de Pedidos', text: 'Para obtener ayuda con un pedido existente, incluye tu número de pedido en el mensaje.' },
              ].map(item => (
                <div key={item.title} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 4, padding: '20px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    <div style={{ width: 1, height: 18, background: '#C9A84C' }} />
                    <h4 style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#FFFFFF', margin: 0 }}>{item.title}</h4>
                  </div>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, margin: 0 }}>{item.text}</p>
                </div>
              ))}
            </div>
            <ContactForm />
          </div>
        </div>
      </section>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

/* ─── ContactForm ────────────────────────────────────────────────────────── */
function ContactForm() {
  const [formData, setFormData] = useState({ nombre: '', email: '', telefono: '', mensaje: '' });
  const { config } = useConfig();

  const handleSubmit = (e) => {
    e.preventDefault();
    const whatsappNumber = config?.whatsappNumber || '56912345678';
    const text = `Hola, soy ${formData.nombre}.\n\n*Mis Datos:*\n📧 Email: ${formData.email}\n📞 Teléfono: ${formData.telefono}\n\n*Mensaje:*\n${formData.mensaje}`;
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    setFormData({ nombre: '', email: '', telefono: '', mensaje: '' });
  };

  const inputStyle = {
    width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.12)', borderRadius: 3, color: '#FFFFFF',
    fontFamily: "'Inter', sans-serif", fontSize: 13, outline: 'none', boxSizing: 'border-box',
    transition: 'border-color 0.15s',
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input type="text" placeholder="Nombre" required value={formData.nombre} onChange={e => setFormData({ ...formData, nombre: e.target.value })} style={inputStyle} onFocus={e => e.target.style.borderColor = '#C9A84C'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'} />
        <input type="email" placeholder="Email *" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} style={inputStyle} onFocus={e => e.target.style.borderColor = '#C9A84C'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'} />
      </div>
      <input type="tel" placeholder="Teléfono" value={formData.telefono} onChange={e => setFormData({ ...formData, telefono: e.target.value })} style={inputStyle} onFocus={e => e.target.style.borderColor = '#C9A84C'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'} />
      <textarea placeholder="Tu mensaje..." rows={5} required value={formData.mensaje} onChange={e => setFormData({ ...formData, mensaje: e.target.value })} style={{ ...inputStyle, resize: 'vertical' }} onFocus={e => e.target.style.borderColor = '#C9A84C'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'} />

      <button type="submit" style={{ padding: '14px', background: '#C9A84C', color: '#0A0A0A', border: 'none', borderRadius: 3, fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.2s' }}
        onMouseEnter={e => { e.currentTarget.style.background = '#E2C97E'; }}
        onMouseLeave={e => { e.currentTarget.style.background = '#C9A84C'; }}>
        Enviar por WhatsApp
      </button>
    </form>
  );
}

export default Home;
