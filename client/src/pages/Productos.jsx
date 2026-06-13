import React, { useEffect, useState, useMemo, useCallback } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { TIPOS_JOYA } from '../hooks/useProducts';

const G = '#C9A84C';
const BLACK = '#0A0A0A';
const SERIF = "'Cormorant Garamond', Georgia, serif";
const SANS  = "'Inter', sans-serif";
const BG    = '#F7F5F0';
const BORDER = '#E8E3D8';
const MUTED  = '#9A9080';

export default function Productos() {
  const [todos, setTodos]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [busqueda, setBusqueda]     = useState('');
  const [filtroTipo, setFiltroTipo] = useState('todos');

  const fetchProductos = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/products');
      // Catálogo = todo lo que NO sea lanzamiento activo
      setTodos(res.data.filter(p =>
        p.seccion !== 'nuevo-lanzamiento' && !p.esLanzamiento
      ));
      setError(null);
    } catch (err) {
      setError('No se pudo cargar el catálogo.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProductos(); }, [fetchProductos]);

  // Conteos por tipo
  const conteos = useMemo(() => {
    const map = {};
    todos.forEach(p => {
      const cat = p.categoria?.toLowerCase().trim() || 'otro';
      map[cat] = (map[cat] || 0) + 1;
    });
    return map;
  }, [todos]);

  // Filtrado + búsqueda + ordenamiento
  const productosFiltrados = useMemo(() => {
    let list = [...todos];

    // Filtro por tipo
    if (filtroTipo !== 'todos') {
      list = list.filter(p => p.categoria?.toLowerCase().trim() === filtroTipo);
    }

    // Búsqueda por nombre, material o SKU
    if (busqueda.trim()) {
      const q = busqueda.toLowerCase();
      list = list.filter(p =>
        p.nombre?.toLowerCase().includes(q) ||
        p.material?.toLowerCase().includes(q) ||
        p.sku?.toLowerCase().includes(q) ||
        p.descripcion?.toLowerCase().includes(q)
      );
    }

    // Ordenamiento por defecto: más recientes primero
    list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return list;
  }, [todos, filtroTipo, busqueda]);

  const inputStyle = {
    border: `1px solid ${BORDER}`, borderRadius: 3, padding: '10px 14px',
    fontFamily: SANS, fontSize: 13, color: BLACK, background: 'white',
    outline: 'none', transition: 'border-color 0.15s',
  };

  return (
    <div style={{ minHeight: '100vh', background: BG, fontFamily: SANS }}>

      {/* Banner */}
      <div style={{ background: BLACK, padding: '12px 16px', textAlign: 'center' }}>
        <p style={{ fontFamily: SANS, fontSize: 11, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: G, margin: 0 }}>
          ✦ &nbsp; Descubre nuestra colección completa de joyería artesanal &nbsp; ✦
        </p>
      </div>

      {/* Encabezado */}
      <section style={{ padding: '72px 24px 48px', textAlign: 'center', borderBottom: `1px solid ${BORDER}` }}>
        <p style={{ fontFamily: SANS, fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: G, marginBottom: 12, fontWeight: 600 }}>
          Joyería Artesanal
        </p>
        <h1 style={{ fontFamily: SERIF, fontSize: 'clamp(36px, 6vw, 56px)', fontWeight: 300, color: BLACK, margin: '0 0 20px', letterSpacing: '0.04em' }}>
          Catálogo
        </h1>
        <div style={{ width: 48, height: 1, background: `linear-gradient(to right, transparent, ${G}, transparent)`, margin: '0 auto 20px' }} />
        <p style={{ fontFamily: SANS, fontSize: 14, color: MUTED, maxWidth: 520, margin: '0 auto', lineHeight: 1.8 }}>
          Cada pieza es elaborada a mano con los más finos materiales. Encuentra la joya que hable de ti.
        </p>
      </section>

      {/* Controles de filtro */}
      <div style={{ background: 'white', borderBottom: `1px solid ${BORDER}`, padding: '24px', position: 'sticky', top: 0, zIndex: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
        
        {/* Búsqueda */}
        <div style={{ position: 'relative', width: '100%', maxWidth: 400 }}>
          <input
            type="text"
            placeholder="Buscar por nombre, material o SKU..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            style={{ ...inputStyle, paddingLeft: 38, width: '100%', boxSizing: 'border-box', borderRadius: 20 }}
            onFocus={e => e.target.style.borderColor = G}
            onBlur={e => e.target.style.borderColor = BORDER}
          />
          <svg style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={MUTED} strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          {busqueda && (
            <button onClick={() => setBusqueda('')} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: MUTED, fontSize: 16, lineHeight: 1 }}>×</button>
          )}
        </div>

        {/* Filtros por tipo */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center', maxWidth: 1000 }}>
          <button
            onClick={() => setFiltroTipo('todos')}
            style={{
              padding: '8px 20px', borderRadius: 30, fontFamily: SANS, fontSize: 10, fontWeight: filtroTipo === 'todos' ? 700 : 400,
              letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.15s',
              background: filtroTipo === 'todos' ? BLACK : 'transparent',
              color: filtroTipo === 'todos' ? 'white' : MUTED,
              border: filtroTipo === 'todos' ? `1px solid ${BLACK}` : `1px solid ${BORDER}`,
            }}>
            Todos ({todos.length})
          </button>
          {TIPOS_JOYA.map(t => {
            const count = conteos[t.value] || 0;
            if (count === 0) return null;
            const active = filtroTipo === t.value;
            return (
              <button key={t.value} onClick={() => setFiltroTipo(t.value)}
                style={{
                  padding: '8px 20px', borderRadius: 30, fontFamily: SANS, fontSize: 10, fontWeight: active ? 700 : 400,
                  letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.15s',
                  background: active ? BLACK : 'transparent',
                  color: active ? 'white' : MUTED,
                  border: active ? `1px solid ${BLACK}` : `1px solid ${BORDER}`,
                }}>
                {t.label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Resultados */}
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '48px 24px 80px' }}>

        {/* Info de resultados */}
        {!loading && !error && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
            <p style={{ fontFamily: SANS, fontSize: 12, color: MUTED, letterSpacing: '0.05em' }}>
              {productosFiltrados.length === 0 ? 'Sin resultados' :
               productosFiltrados.length === 1 ? '1 pieza encontrada' :
               `${productosFiltrados.length} piezas encontradas`}
              {filtroTipo !== 'todos' && (
                <span> — <button onClick={() => setFiltroTipo('todos')} style={{ background: 'none', border: 'none', color: G, cursor: 'pointer', fontFamily: SANS, fontSize: 12, textDecoration: 'underline' }}>Limpiar filtro</button></span>
              )}
            </p>
            {busqueda && (
              <p style={{ fontFamily: SANS, fontSize: 12, color: MUTED }}>Buscando: <strong style={{ color: BLACK }}>"{busqueda}"</strong></p>
            )}
          </div>
        )}

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
            <div style={{ width: 24, height: 24, border: `1.5px solid ${BORDER}`, borderTopColor: G, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '80px 0', fontFamily: SERIF, fontSize: 20, fontWeight: 300, color: MUTED }}>
            {error}
          </div>
        ) : productosFiltrados.length > 0 ? (
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
        ) : (
          <div style={{ textAlign: 'center', padding: '100px 24px' }}>
            <p style={{ fontFamily: SERIF, fontSize: 24, fontWeight: 300, color: MUTED, marginBottom: 24 }}>
              No encontramos piezas con esa búsqueda
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              {busqueda && <button onClick={() => setBusqueda('')} style={{ padding: '10px 24px', border: `1px solid ${BORDER}`, background: 'white', color: BLACK, fontFamily: SANS, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', borderRadius: 2 }}>Borrar búsqueda</button>}
              {filtroTipo !== 'todos' && <button onClick={() => setFiltroTipo('todos')} style={{ padding: '10px 24px', border: `1px solid ${BLACK}`, background: BLACK, color: 'white', fontFamily: SANS, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', borderRadius: 2 }}>Ver toda la colección</button>}
            </div>
          </div>
        )}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}