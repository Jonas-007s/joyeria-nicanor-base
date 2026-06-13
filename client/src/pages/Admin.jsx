import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  LayoutDashboard, ShoppingBag, Package, Plus, Pencil, Trash2,
  X, Upload, LogOut, CheckCircle2, AlertCircle, Users, Settings,
  Mail, DollarSign, Clock, TrendingUp, Menu, Bell, ArrowRight,
  Gem, Eye, MessageCircle, Smartphone, MapPin, Calendar, Search,
  ChevronUp, ChevronDown
} from 'lucide-react';
import AdminSolicitudes from '../components/AdminSolicitudes';
import LazyImage from '../components/LazyImage';
import { getClientes, getConfig, updateConfig } from '../services/solicitudService';
import { TIPOS_JOYA } from '../hooks/useProducts';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080' });
api.interceptors.request.use(cfg => {
  const t = sessionStorage.getItem('authToken') || localStorage.getItem('authToken');
  if (t) cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
});

const resolveImg = img => {
  if (!img) return null;
  if (/^(https?:)?\/\//.test(img) || img.startsWith('data:')) return img;
  if (img.startsWith('/uploads')) return `${api.defaults.baseURL}${img}`;
  return `${api.defaults.baseURL}/uploads/${img}`;
};

/* ─── Design tokens ──────────────────────────────────────────────────────── */
const G = '#C9A84C';          // gold
const GL = '#E2C97E';         // gold light
const GS = 'rgba(201,168,76,0.10)'; // gold subtle
const BG = '#F7F5F0';         // warm off-white background
const CARD = '#FFFFFF';
const BLACK = '#0A0A0A';
const BORDER = '#E8E3D8';
const MUTED = '#9A9080';
const SERIF = "'Cormorant Garamond', Georgia, serif";
const SANS  = "'Inter', sans-serif";

/* ─── Reusable primitives ────────────────────────────────────────────────── */
const Divider = ({ style }) => (
  <div style={{ height: 1, background: `linear-gradient(to right, transparent, ${BORDER}, transparent)`, ...style }} />
);

const GoldLine = ({ style }) => (
  <div style={{ height: 1, background: `linear-gradient(to right, transparent, ${G}, transparent)`, ...style }} />
);

const SectionTitle = ({ label, subtitle }) => (
  <div style={{ marginBottom: 28 }}>
    <p style={{ fontFamily: SANS, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: G, marginBottom: 6, fontWeight: 600 }}>{label}</p>
    <h2 style={{ fontFamily: SERIF, fontSize: 28, fontWeight: 400, color: BLACK, letterSpacing: '0.02em', margin: 0, lineHeight: 1.2 }}>{subtitle}</h2>
    <GoldLine style={{ marginTop: 16, width: 48 }} />
  </div>
);

const Field = ({ label, required, hint, children }) => (
  <div>
    <label style={{ display: 'block', fontFamily: SANS, fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: MUTED, marginBottom: 8 }}>
      {label}{required && <span style={{ color: G, marginLeft: 4 }}>*</span>}
    </label>
    {children}
    {hint && <p style={{ fontFamily: SANS, fontSize: 11, color: MUTED, marginTop: 5 }}>{hint}</p>}
  </div>
);

const ConfigLabel = ({ children }) => <label style={{ display: 'block', fontFamily: SANS, fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: MUTED, marginBottom: 8 }}>{children}</label>;
const ConfigCard = ({ title, children }) => (
  <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 4, padding: '28px 28px', marginBottom: 16 }}>
    <p style={{ fontFamily: SANS, fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: G, marginBottom: 20 }}>{title}</p>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>{children}</div>
  </div>
);

/* ─── Main Admin ──────────────────────────────────────────────────────────── */
export default function Admin() {
  const [tab, setTab] = useState('dashboard');
  const [mobileMenu, setMobileMenu] = useState(false);
  const [productos, setProductos] = useState([]);
  const [stats, setStats] = useState(null);
  const [clientes, setClientes] = useState([]);
  const [configuracion, setConfiguracion] = useState(null);
  const [mensajes, setMensajes] = useState([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null); // { type: 'ok'|'err', msg }
  const [editingId, setEditingId] = useState(null);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [productType, setProductType] = useState('normal');
  const [formData, setFormData] = useState({
    nombre: '', descripcion: '', precio: '', stock: '', categoria: '',
    sku: '', material: '', imagenes: [], seccion: 'productos',
    fechaLanzamiento: '', descripcionLanzamiento: ''
  });

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    if (tab === 'manage' || tab === 'add') fetchProductos();
    if (tab === 'dashboard') fetchStats();
    if (tab === 'clientes') getClientes().then(setClientes).catch(console.error);
    if (tab === 'config') getConfig().then(setConfiguracion).catch(console.error);
    if (tab === 'mensajes') fetchMensajes();
  }, [tab]);

  const fetchProductos = () => api.get('/api/products').then(r => setProductos(r.data)).catch(console.error);
  const fetchStats = () => api.get('/api/solicitudes/stats').then(r => setStats(r.data)).catch(console.error);
  const fetchMensajes = () => api.get('/api/contact').then(r => {
    setMensajes(r.data || []);
    setUnread((r.data || []).filter(m => !m.leido).length);
  }).catch(console.error);

  const logout = () => {
    localStorage.removeItem('authToken'); localStorage.removeItem('authUser');
    sessionStorage.removeItem('authToken'); sessionStorage.removeItem('authUser');
    window.location.href = '/login';
  };

  const handleProductSubmit = async e => {
    e.preventDefault(); setLoading(true);
    try {
      const fd = new FormData();
      Object.keys(formData).forEach(k => {
        if (k === 'imagenes') formData.imagenes.forEach(i => fd.append('imagenes', i));
        else fd.append(k, formData[k]);
      });
      if (editingId) { await api.put(`/api/products/${editingId}`, fd); showToast('ok', 'Producto actualizado correctamente'); }
      else { await api.post('/api/products', fd); showToast('ok', 'Producto creado exitosamente'); }
      resetForm(); fetchProductos(); setTab('manage');
    } catch (err) { showToast('err', err.response?.data?.message || 'Error al guardar producto'); }
    finally { setLoading(false); }
  };

  const resetForm = () => {
    setFormData({ nombre: '', descripcion: '', precio: '', stock: '', categoria: '', sku: '', material: '', imagenes: [], seccion: 'productos', fechaLanzamiento: '', descripcionLanzamiento: '' });
    setImagePreviews([]); setEditingId(null); setProductType('normal');
  };

  const editProduct = p => {
    setEditingId(p._id);
    setFormData({ nombre: p.nombre, descripcion: p.descripcion, precio: p.precio, stock: p.stock, categoria: p.categoria, sku: p.sku||'', material: p.material||'', imagenes: [], seccion: p.seccion, fechaLanzamiento: p.fechaLanzamiento ? new Date(p.fechaLanzamiento).toISOString().slice(0,16) : '', descripcionLanzamiento: p.descripcionLanzamiento||'' });
    setProductType(p.seccion === 'nuevo-lanzamiento' ? 'lanzamiento' : 'normal');
    setImagePreviews(p.imagenes?.map(resolveImg).filter(Boolean) || []);
    setTab('add');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const NAV = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'solicitudes', label: 'Solicitudes', icon: ShoppingBag },
    { id: 'manage', label: 'Productos', icon: Package },
    { id: 'clientes', label: 'Clientes', icon: Users },
    { id: 'mensajes', label: 'Mensajes', icon: Mail, badge: unread },
    { id: 'config', label: 'Configuración', icon: Settings },
  ];

  const activeLabel = NAV.find(n => n.id === tab || (tab === 'add' && n.id === 'manage'))?.label || '';

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: BG, fontFamily: SANS }}>

      {/* ── Sidebar ──────────────────────────────────────────────────────── */}
      {mobileMenu && <div onClick={() => setMobileMenu(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 40 }} />}

      <aside className={`fixed md:relative top-0 left-0 bottom-0 z-50 flex flex-col flex-shrink-0 transition-transform duration-300 ${mobileMenu ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`} style={{ width: 248, background: BLACK }}>

        {/* Logo area */}
        <div style={{ padding: '36px 28px 28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <div style={{ width: 1, height: 28, background: G }} />
            <div>
              <div style={{ fontFamily: SERIF, fontSize: 20, fontWeight: 400, letterSpacing: '0.18em', color: '#FFFFFF', lineHeight: 1 }}>NICANOR</div>
              <div style={{ fontFamily: SANS, fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: G, marginTop: 3, opacity: 0.8 }}>Joyería · Administración</div>
            </div>
          </div>
        </div>

        <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', margin: '0 0 8px' }} />

        {/* Navigation */}
        <nav style={{ flex: 1, padding: '16px 16px', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {NAV.map(({ id, label, icon: Icon, badge }) => {
            const active = tab === id || (tab === 'add' && id === 'manage');
            return (
              <button key={id} onClick={() => { setTab(id); setMobileMenu(false); }}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                  padding: '11px 14px', borderRadius: 4, border: 'none', cursor: 'pointer',
                  background: active ? 'rgba(201,168,76,0.10)' : 'transparent',
                  color: active ? G : 'rgba(255,255,255,0.45)',
                  fontFamily: SANS, fontSize: 13, fontWeight: active ? 600 : 400,
                  letterSpacing: '0.02em', transition: 'all 0.15s', position: 'relative',
                  textAlign: 'left',
                  ...(active ? { boxShadow: `inset 2px 0 0 ${G}` } : {})
                }}
                onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'rgba(255,255,255,0.75)'; } }}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.45)'; } }}
              >
                <Icon size={16} strokeWidth={1.5} />
                <span style={{ flex: 1 }}>{label}</span>
                {badge > 0 && (
                  <span style={{ background: G, color: BLACK, borderRadius: 3, fontSize: 10, fontWeight: 700, padding: '1px 6px', minWidth: 18, textAlign: 'center' }}>{badge}</span>
                )}
              </button>
            );
          })}
        </nav>

        <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', margin: '0' }} />

        {/* Logout */}
        <div style={{ padding: 16 }}>
          <button onClick={logout}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 4, border: '1px solid rgba(255,255,255,0.07)', background: 'transparent', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', fontFamily: SANS, fontSize: 12, letterSpacing: '0.05em', transition: 'all 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; e.currentTarget.style.color = '#FDA4AF'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.2)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.3)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; }}
          >
            <LogOut size={14} strokeWidth={1.5} /> Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* ── Content ───────────────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

        {/* Top bar */}
        <header style={{ background: BG, borderBottom: `1px solid ${BORDER}`, padding: '0 36px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 30 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <button onClick={() => setMobileMenu(true)} className="block md:hidden" style={{ padding: 8, background: 'none', border: `1px solid ${BORDER}`, borderRadius: 4, cursor: 'pointer' }}>
              <Menu size={18} />
            </button>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontFamily: SANS, fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: MUTED }}>Admin</span>
                <span style={{ color: BORDER }}>·</span>
                <span style={{ fontFamily: SANS, fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: G, fontWeight: 600 }}>{activeLabel}</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {unread > 0 && (
              <button onClick={() => setTab('mensajes')}
                style={{ position: 'relative', width: 36, height: 36, borderRadius: 4, border: `1px solid ${BORDER}`, background: CARD, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bell size={15} color={MUTED} strokeWidth={1.5} />
                <span style={{ position: 'absolute', top: -4, right: -4, width: 16, height: 16, background: G, borderRadius: 2, fontSize: 9, fontWeight: 700, color: BLACK, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{unread}</span>
              </button>
            )}
            <div className="flex items-center gap-3 px-2 md:px-4 py-1.5 md:py-2 border border-[#E8E3D8] rounded-full bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-black flex items-center justify-center border border-[#C9A84C]/40 relative overflow-hidden flex-shrink-0">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                <span style={{ fontFamily: SERIF, color: G, letterSpacing: '0.05em' }} className="text-sm md:text-base font-semibold relative z-10">N</span>
              </div>
              <div className="hidden md:block pr-2">
                <div style={{ fontFamily: SANS, color: BLACK, letterSpacing: '0.03em' }} className="text-[13px] font-bold">Administración</div>
                <div style={{ fontFamily: SANS, color: MUTED, letterSpacing: '0.05em' }} className="text-[10px] uppercase mt-0.5">Nicanor Joyas</div>
              </div>
            </div>
          </div>
        </header>

        {/* Toast */}
        {toast && (
          <div style={{
            margin: '16px 36px 0',
            padding: '14px 20px', borderRadius: 4,
            background: toast.type === 'ok' ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)',
            border: `1px solid ${toast.type === 'ok' ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)'}`,
            color: toast.type === 'ok' ? '#065F46' : '#991B1B',
            fontFamily: SANS, fontSize: 13, display: 'flex', alignItems: 'center', gap: 10
          }}>
            {toast.type === 'ok' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            {toast.msg}
          </div>
        )}

        {/* Page content */}
        <main style={{ flex: 1, padding: '36px 36px', overflowX: 'hidden' }}>
          {tab === 'dashboard'   && <DashboardView stats={stats} setTab={setTab} />}
          {tab === 'solicitudes' && <AdminSolicitudes />}
          {tab === 'manage'      && <ProductsView productos={productos} setTab={setTab} editProduct={editProduct} fetchProductos={fetchProductos} />}
          {tab === 'add'         && <ProductForm formData={formData} setFormData={setFormData} loading={loading} handleSubmit={handleProductSubmit} editingId={editingId} setTab={setTab} productType={productType} setProductType={setProductType} imagePreviews={imagePreviews} setImagePreviews={setImagePreviews} resetForm={resetForm} />}
          {tab === 'clientes'    && <ClientesView clientes={clientes} />}
          {tab === 'mensajes'    && <MensajesView mensajes={mensajes} setMensajes={setMensajes} fetchMensajes={fetchMensajes} />}
          {tab === 'config'      && <ConfigView configuracion={configuracion} setConfiguracion={setConfiguracion} />}
        </main>
      </div>
    </div>
  );
}

/* ─── Dashboard ──────────────────────────────────────────────────────────── */
function DashboardView({ stats, setTab }) {
  if (!stats) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 320 }}>
      <div style={{ width: 24, height: 24, border: `1px solid ${BORDER}`, borderTopColor: G, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    </div>
  );

  const chartData = (stats.porMes || []).map(i => ({
    mes: `${String(i._id.month).padStart(2,'0')}/${i._id.year}`,
    total: i.total
  }));

  const pieData = [
    { name: 'Pendientes', value: stats.pendientes||0, color: '#B45309' },
    { name: 'Contactados', value: stats.contactados||0, color: '#1D4ED8' },
    { name: 'Cotizados', value: stats.cotizados||0, color: '#6D28D9' },
    { name: 'Cerrados', value: stats.cerrados||0, color: '#065F46' },
  ].filter(d => d.value > 0);

  const kpis = [
    { label: 'Total Solicitudes', value: stats.total, note: 'Historial completo' },
    { label: 'Pendientes', value: stats.pendientes, note: 'Requieren atención' },
    { label: 'Cerrados', value: stats.cerrados, note: 'Ventas concretadas' },
    { label: 'Cotizados', value: stats.cotizados, note: 'En seguimiento' },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div style={{ background: BLACK, border: `1px solid rgba(201,168,76,0.3)`, borderRadius: 4, padding: '10px 16px' }}>
        <p style={{ color: G, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>{label}</p>
        <p style={{ color: '#FFF', fontFamily: SERIF, fontSize: 22, fontWeight: 300 }}>{payload[0].value}</p>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10 }}>solicitudes</p>
      </div>
    );
  };

  return (
    <div style={{ maxWidth: 1200 }}>
      <SectionTitle label="Panel de control" subtitle="Resumen Ejecutivo" />

      {/* KPI row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {kpis.map((k, i) => (
          <div key={i}
            onClick={() => setTab('solicitudes')}
            style={{
              background: CARD, border: `1px solid ${BORDER}`, borderRadius: 4, padding: '28px 24px',
              cursor: 'pointer', transition: 'all 0.2s', position: 'relative', overflow: 'hidden'
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = G; e.currentTarget.style.boxShadow = `0 0 0 1px ${G}`; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.boxShadow = 'none'; }}
          >
            {/* Gold top accent bar */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: i === 0 ? G : 'transparent', transition: 'background 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.background = G}
            />
            <div style={{ fontFamily: SERIF, fontSize: 42, fontWeight: 300, color: BLACK, lineHeight: 1, marginBottom: 8 }}>{k.value ?? '—'}</div>
            <div style={{ fontFamily: SANS, fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: BLACK, marginBottom: 6 }}>{k.label}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 16, height: 1, background: G }} />
              <span style={{ fontFamily: SANS, fontSize: 11, color: MUTED }}>{k.note}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.8fr_1fr] gap-4 mb-6">

        {/* Bar chart */}
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 4, padding: '28px 28px 20px' }}>
          <div style={{ marginBottom: 24 }}>
            <p style={{ fontFamily: SANS, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: G, marginBottom: 4 }}>Actividad</p>
            <h3 style={{ fontFamily: SERIF, fontSize: 20, fontWeight: 400, color: BLACK, margin: 0 }}>Solicitudes por Mes</h3>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData} barSize={28} margin={{ left: -20, right: 0 }}>
              <CartesianGrid strokeDasharray="2 4" vertical={false} stroke={BORDER} />
              <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: MUTED, fontFamily: SANS }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: MUTED, fontFamily: SANS }} allowDecimals={false} />
              <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: GS }} />
              <Bar dataKey="total" radius={[2, 2, 0, 0]}>
                {chartData.map((_, i) => (
                  <Cell key={i} fill={i === chartData.length - 1 ? G : '#1A1A1A'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart */}
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 4, padding: '28px 24px' }}>
          <div style={{ marginBottom: 20 }}>
            <p style={{ fontFamily: SANS, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: G, marginBottom: 4 }}>Estado</p>
            <h3 style={{ fontFamily: SERIF, fontSize: 20, fontWeight: 400, color: BLACK, margin: 0 }}>Pipeline</h3>
          </div>
          {pieData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={140}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={42} outerRadius={60} paddingAngle={3} dataKey="value">
                    {pieData.map((d, i) => <Cell key={i} fill={d.color} />)}
                  </Pie>
                  <RechartsTooltip contentStyle={{ fontFamily: SANS, fontSize: 12, border: `1px solid ${BORDER}`, borderRadius: 4, boxShadow: 'none' }} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {pieData.map((d, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 6, height: 6, borderRadius: 1, background: d.color }} />
                      <span style={{ fontFamily: SANS, fontSize: 11, color: MUTED }}>{d.name}</span>
                    </div>
                    <span style={{ fontFamily: SANS, fontSize: 12, fontWeight: 600, color: BLACK }}>{d.value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div style={{ height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', color: MUTED, fontSize: 13 }}>Sin datos suficientes</div>
          )}
        </div>
      </div>

      {/* Top productos */}
      {stats.topProductos?.length > 0 && (
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 4, padding: '28px 28px' }}>
          <div style={{ marginBottom: 20 }}>
            <p style={{ fontFamily: SANS, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: G, marginBottom: 4 }}>Ranking</p>
            <h3 style={{ fontFamily: SERIF, fontSize: 20, fontWeight: 400, color: BLACK, margin: 0 }}>Productos más Cotizados</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {stats.topProductos.slice(0, 5).map((p, i) => {
              const max = stats.topProductos[0]?.totalSolicitado || 1;
              const pct = (p.totalSolicitado / max) * 100;
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <span style={{ fontFamily: SERIF, fontSize: 16, fontWeight: 400, color: i === 0 ? G : MUTED, width: 20, textAlign: 'right', flexShrink: 0 }}>{i + 1}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontFamily: SANS, fontSize: 13, color: BLACK, fontWeight: 500 }}>{p._id}</span>
                      <span style={{ fontFamily: SANS, fontSize: 11, color: MUTED }}>{p.totalSolicitado} cotizaciones</span>
                    </div>
                    <div style={{ height: 2, background: BORDER, borderRadius: 1, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: i === 0 ? G : '#1A1A1A', borderRadius: 1, transition: 'width 1s ease' }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Clientes ────────────────────────────────────────────────────────────── */
function ClientesView({ clientes }) {
  return (
    <div style={{ maxWidth: 1100 }}>
      <SectionTitle label="Directorio" subtitle={`${clientes.length} Clientes Registrados`} />
      <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 4, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
              {['Cliente', 'Contacto', 'Ciudad', 'Solicitudes', 'Última Actividad'].map(h => (
                <th key={h} style={{ padding: '14px 20px', textAlign: 'left', fontFamily: SANS, fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: MUTED, background: BG, whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {clientes.map((c, i) => (
              <tr key={c._id} style={{ borderBottom: i < clientes.length - 1 ? `1px solid ${BORDER}` : 'none', transition: 'background 0.1s' }}
                onMouseEnter={e => e.currentTarget.style.background = BG}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <td style={{ padding: '16px 20px', fontFamily: SERIF, fontSize: 16, fontWeight: 400, color: BLACK }}>{c.nombre}</td>
                <td style={{ padding: '16px 20px' }}>
                  <div style={{ fontFamily: SANS, fontSize: 13, color: BLACK }}>{c.telefono}</div>
                  <div style={{ fontFamily: SANS, fontSize: 11, color: MUTED, marginTop: 2 }}>{c.correo || '—'}</div>
                </td>
                <td style={{ padding: '16px 20px', fontFamily: SANS, fontSize: 13, color: MUTED }}>{c.ciudad || '—'}</td>
                <td style={{ padding: '16px 20px' }}>
                  <span style={{ fontFamily: SANS, fontSize: 12, fontWeight: 700, color: BLACK, background: GS, border: `1px solid rgba(201,168,76,0.25)`, borderRadius: 2, padding: '3px 10px' }}>{c.cantidadSolicitudes}</span>
                </td>
                <td style={{ padding: '16px 20px', fontFamily: SANS, fontSize: 12, color: MUTED }}>{new Date(c.ultimaSolicitud).toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
              </tr>
            ))}
            {clientes.length === 0 && (
              <tr><td colSpan={5} style={{ padding: 64, textAlign: 'center', color: MUTED, fontFamily: SERIF, fontSize: 16, fontWeight: 300 }}>No hay clientes registrados aún</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─── Productos ───────────────────────────────────────────────────────────── */
function ProductsView({ productos, setTab, editProduct, fetchProductos }) {
  const [q, setQ] = useState('');
  const filtered = productos.filter(p =>
    [p.nombre, p.categoria, p.sku].some(s => s?.toLowerCase().includes(q.toLowerCase()))
  );

  const deleteProduct = async id => {
    if (!window.confirm('¿Eliminar este producto del catálogo?')) return;
    try { await api.delete(`/api/products/${id}`); fetchProductos(); } catch {}
  };

  return (
    <div style={{ maxWidth: 1200 }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 32 }}>
        <SectionTitle label="Catálogo" subtitle={`${productos.length} Piezas en Inventario`} />
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', paddingBottom: 4 }}>
          <div style={{ position: 'relative' }}>
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Buscar pieza..."
              style={{ border: `1px solid ${BORDER}`, borderRadius: 3, padding: '9px 14px 9px 36px', fontSize: 12, fontFamily: SANS, width: 200, background: CARD, color: BLACK, outline: 'none', letterSpacing: '0.02em' }}
              onFocus={e => e.target.style.borderColor = G} onBlur={e => e.target.style.borderColor = BORDER} />
            <Search size={13} color={MUTED} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
          </div>
          <button onClick={() => setTab('add')}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', background: BLACK, color: CARD, border: 'none', borderRadius: 3, fontFamily: SANS, fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer', transition: 'background 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.background = G}
            onMouseLeave={e => e.currentTarget.style.background = BLACK}>
            <Plus size={14} /> Nueva Pieza
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 4, padding: 80, textAlign: 'center' }}>
          <Package size={32} color={MUTED} strokeWidth={1} style={{ margin: '0 auto 16px' }} />
          <p style={{ fontFamily: SERIF, fontSize: 18, fontWeight: 300, color: MUTED }}>{q ? 'Sin resultados para esa búsqueda' : 'Catálogo vacío'}</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
          {filtered.map(p => (
            <div key={p._id}
              style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 4, overflow: 'hidden', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = G; e.currentTarget.style.boxShadow = `0 8px 32px rgba(0,0,0,0.10)`; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.boxShadow = 'none'; }}>
              <div style={{ aspectRatio: '1', background: BG, position: 'relative', overflow: 'hidden' }}>
                {p.imagenes?.[0]
                  ? <LazyImage src={resolveImg(p.imagenes[0])} alt={p.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Gem size={32} color={BORDER} strokeWidth={1} /></div>
                }
                {p.seccion === 'nuevo-lanzamiento' && (
                  <div style={{ position: 'absolute', top: 10, left: 10, background: BLACK, color: G, fontSize: 9, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', padding: '4px 10px', borderRadius: 2 }}>Lanzamiento</div>
                )}
                {/* Hover controls */}
                <div className="product-overlay" style={{ position: 'absolute', inset: 0, background: 'rgba(10,10,10,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, opacity: 0, transition: 'opacity 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.opacity = 1}
                  onMouseLeave={e => e.currentTarget.style.opacity = 0}>
                  <button onClick={() => editProduct(p)} style={{ width: 38, height: 38, borderRadius: 2, background: CARD, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: BLACK }}>
                    <Pencil size={15} />
                  </button>
                  <button onClick={() => deleteProduct(p._id)} style={{ width: 38, height: 38, borderRadius: 2, background: '#DC2626', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
              <div style={{ padding: '16px 16px 14px', borderTop: `1px solid ${BORDER}` }}>
                <p style={{ fontFamily: SERIF, fontSize: 15, fontWeight: 400, color: BLACK, marginBottom: 4, lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.nombre}</p>
                <p style={{ fontFamily: SANS, fontSize: 10, color: MUTED, letterSpacing: '0.05em', marginBottom: 10 }}>{p.sku || 'Sin SKU'} {p.material ? `· ${p.material}` : ''}</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: SANS, fontSize: 10, color: MUTED }}>Stock: <strong style={{ color: BLACK }}>{p.stock}</strong></span>
                  <span style={{ fontFamily: SERIF, fontSize: 15, color: G, fontWeight: 400 }}>${p.precio?.toLocaleString('es-CL')}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`.product-overlay { opacity: 0 !important; } *:hover > .product-overlay { opacity: 1 !important; }`}</style>
    </div>
  );
}

/* ─── Product Form ────────────────────────────────────────────────────────── */
function ProductForm({ formData, setFormData, loading, handleSubmit, editingId, setTab, productType, setProductType, imagePreviews, setImagePreviews, resetForm }) {
  const upImage = e => {
    const files = Array.from(e.target.files);
    setFormData(f => ({ ...f, imagenes: [...f.imagenes, ...files] }));
    setImagePreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f))]);
  };
  const rmImage = i => {
    setFormData(f => ({ ...f, imagenes: f.imagenes.filter((_, j) => j !== i) }));
    setImagePreviews(p => p.filter((_, j) => j !== i));
  };


  const inputStyle = { width: '100%', border: `1px solid ${BORDER}`, borderRadius: 3, padding: '11px 14px', fontFamily: SANS, fontSize: 13, color: BLACK, background: CARD, outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.15s' };
  const onFocus = e => e.target.style.borderColor = G;
  const onBlur = e => e.target.style.borderColor = BORDER;

  return (
    <div style={{ maxWidth: 780 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <SectionTitle label={editingId ? 'Edición' : 'Nuevo Producto'} subtitle={editingId ? 'Actualizar Pieza' : 'Añadir al Catálogo'} />
        <button onClick={() => { resetForm(); setTab('manage'); }}
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', border: `1px solid ${BORDER}`, borderRadius: 3, background: CARD, fontFamily: SANS, fontSize: 11, color: MUTED, cursor: 'pointer', letterSpacing: '0.08em' }}>
          <X size={13} /> Cancelar
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Card 1 — datos */}
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 4, padding: '28px 28px', marginBottom: 16 }}>
          <p style={{ fontFamily: SANS, fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: G, marginBottom: 20 }}>Información de la Pieza</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div style={{ gridColumn: '1/-1' }}>
              <Field label="Nombre" required>
                <input required value={formData.nombre} onChange={e => setFormData({ ...formData, nombre: e.target.value })} style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
              </Field>
            </div>
            <Field label="Precio" required>
              <input required type="number" value={formData.precio} onChange={e => setFormData({ ...formData, precio: e.target.value })} style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
            </Field>
            <Field label="Stock" required>
              <input required type="number" value={formData.stock} onChange={e => setFormData({ ...formData, stock: e.target.value })} style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
            </Field>
            <Field label="Categoría" required>
              <select required value={formData.categoria} onChange={e => setFormData({ ...formData, categoria: e.target.value })} style={{ ...inputStyle, cursor: 'pointer', paddingRight: 32 }} onFocus={onFocus} onBlur={onBlur}>
                <option value="">Selecciona el tipo de pieza...</option>
                {TIPOS_JOYA.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </Field>
            <Field label="SKU" hint="Código interno único">
              <input value={formData.sku} onChange={e => setFormData({ ...formData, sku: e.target.value })} style={inputStyle} placeholder="NIC-AN-001" onFocus={onFocus} onBlur={onBlur} />
            </Field>
            <div style={{ gridColumn: '1/-1' }}>
              <Field label="Material">
                <input value={formData.material} onChange={e => setFormData({ ...formData, material: e.target.value })} style={inputStyle} placeholder="Oro 18k, Plata 925, etc." onFocus={onFocus} onBlur={onBlur} />
              </Field>
            </div>
            <div style={{ gridColumn: '1/-1' }}>
              <Field label="Descripción" required>
                <textarea required rows={3} value={formData.descripcion} onChange={e => setFormData({ ...formData, descripcion: e.target.value })} style={{ ...inputStyle, resize: 'vertical' }} onFocus={onFocus} onBlur={onBlur} />
              </Field>
            </div>
          </div>
        </div>

        {/* Card 2 — imágenes */}
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 4, padding: '28px 28px', marginBottom: 16 }}>
          <p style={{ fontFamily: SANS, fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: G, marginBottom: 20 }}>Imágenes</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {imagePreviews.map((src, i) => (
              <div key={i} style={{ width: 88, height: 88, borderRadius: 3, overflow: 'hidden', border: `1px solid ${BORDER}`, position: 'relative', flexShrink: 0 }}>
                <img src={src} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} alt="" />
                <button type="button" onClick={() => rmImage(i)} style={{ position: 'absolute', top: 4, right: 4, width: 18, height: 18, borderRadius: 1, background: BLACK, border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.85 }}>
                  <X size={10} />
                </button>
              </div>
            ))}
            <label style={{ width: 88, height: 88, borderRadius: 3, border: `1px dashed ${BORDER}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: BG, gap: 6, flexShrink: 0, transition: 'border-color 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = G}
              onMouseLeave={e => e.currentTarget.style.borderColor = BORDER}>
              <Upload size={16} color={MUTED} strokeWidth={1.5} />
              <span style={{ fontFamily: SANS, fontSize: 10, color: MUTED }}>Añadir</span>
              <input type="file" multiple accept="image/*" onChange={upImage} style={{ display: 'none' }} />
            </label>
          </div>
        </div>

        {/* Card 3 — lanzamiento */}
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 4, padding: '24px 28px', marginBottom: 24 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer' }}>
            <div onClick={() => { const next = productType === 'lanzamiento' ? 'normal' : 'lanzamiento'; setProductType(next); setFormData(f => ({ ...f, seccion: next === 'lanzamiento' ? 'nuevo-lanzamiento' : 'productos' })); }}
              style={{ width: 40, height: 22, borderRadius: 11, background: productType === 'lanzamiento' ? G : BORDER, position: 'relative', transition: 'background 0.2s', cursor: 'pointer', flexShrink: 0 }}>
              <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'white', position: 'absolute', top: 2, left: productType === 'lanzamiento' ? 20 : 2, transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }} />
            </div>
            <div>
              <p style={{ fontFamily: SANS, fontSize: 13, fontWeight: 600, color: BLACK, marginBottom: 2 }}>Producto de Lanzamiento</p>
              <p style={{ fontFamily: SANS, fontSize: 11, color: MUTED }}>Activa contador regresivo en la página principal</p>
            </div>
          </label>
          {productType === 'lanzamiento' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4" style={{ marginTop: 20, padding: '20px', background: GS, border: `1px solid rgba(201,168,76,0.25)`, borderRadius: 3 }}>
              <Field label="Fecha y Hora">
                <input type="datetime-local" value={formData.fechaLanzamiento} onChange={e => setFormData({ ...formData, fechaLanzamiento: e.target.value })} style={{ ...inputStyle, borderColor: 'rgba(201,168,76,0.3)' }} onFocus={onFocus} onBlur={e => e.target.style.borderColor = 'rgba(201,168,76,0.3)'} />
              </Field>
              <Field label="Descripción del Evento">
                <input value={formData.descripcionLanzamiento} onChange={e => setFormData({ ...formData, descripcionLanzamiento: e.target.value })} style={{ ...inputStyle, borderColor: 'rgba(201,168,76,0.3)' }} onFocus={onFocus} onBlur={e => e.target.style.borderColor = 'rgba(201,168,76,0.3)'} />
              </Field>
            </div>
          )}
        </div>

        <button type="submit" disabled={loading}
          style={{ width: '100%', padding: '15px', background: loading ? BORDER : BLACK, color: loading ? MUTED : 'white', border: 'none', borderRadius: 3, fontFamily: SANS, fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.2s' }}
          onMouseEnter={e => { if (!loading) e.currentTarget.style.background = G; }}
          onMouseLeave={e => { if (!loading) e.currentTarget.style.background = BLACK; }}>
          {loading ? 'Guardando...' : editingId ? 'Actualizar Pieza' : 'Añadir al Catálogo'}
        </button>
      </form>
    </div>
  );
}

/* ─── Mensajes ────────────────────────────────────────────────────────────── */
function MensajesView({ mensajes, setMensajes, fetchMensajes }) {
  const markRead = async id => {
    try { await api.put(`/api/contact/${id}/read`); setMensajes(m => m.map(x => x._id === id ? { ...x, leido: true } : x)); } catch {}
  };
  const deleteMsg = async id => {
    if (!window.confirm('¿Eliminar este mensaje?')) return;
    try { await api.delete(`/api/contact/${id}`); setMensajes(m => m.filter(x => x._id !== id)); } catch {}
  };

  return (
    <div style={{ maxWidth: 840 }}>
      <SectionTitle label="Comunicaciones" subtitle="Bandeja de Mensajes" />
      {mensajes.length === 0 ? (
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 4, padding: 80, textAlign: 'center' }}>
          <Mail size={28} color={MUTED} strokeWidth={1} style={{ margin: '0 auto 12px' }} />
          <p style={{ fontFamily: SERIF, fontSize: 18, fontWeight: 300, color: MUTED }}>Bandeja vacía</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {mensajes.map(m => (
            <div key={m._id}
              style={{ background: CARD, borderRadius: 4, overflow: 'hidden', border: !m.leido ? `1px solid rgba(201,168,76,0.4)` : `1px solid ${BORDER}`, transition: 'border-color 0.2s' }}>
              {!m.leido && <div style={{ height: 2, background: G }} />}
              <div style={{ padding: '20px 24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 2, background: !m.leido ? G : BG, border: !m.leido ? 'none' : `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: SERIF, fontSize: 18, fontWeight: 400, color: !m.leido ? BLACK : MUTED, flexShrink: 0 }}>
                      {m.nombre?.charAt(0)?.toUpperCase()}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <p style={{ fontFamily: SERIF, fontSize: 16, fontWeight: 400, color: BLACK, margin: 0 }}>{m.nombre}</p>
                        {!m.leido && <span style={{ fontFamily: SANS, fontSize: 9, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: G, background: GS, border: `1px solid rgba(201,168,76,0.3)`, borderRadius: 2, padding: '2px 8px' }}>Nuevo</span>}
                      </div>
                      <p style={{ fontFamily: SANS, fontSize: 11, color: MUTED, margin: '3px 0 0' }}>{m.email}{m.telefono ? ` · ${m.telefono}` : ''}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                    {!m.leido && (
                      <button onClick={() => markRead(m._id)}
                        style={{ padding: '7px 14px', border: `1px solid ${BORDER}`, borderRadius: 2, background: CARD, fontFamily: SANS, fontSize: 11, color: MUTED, cursor: 'pointer', letterSpacing: '0.05em', transition: 'all 0.15s' }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = G; e.currentTarget.style.color = G; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.color = MUTED; }}>
                        Marcar leído
                      </button>
                    )}
                    <button onClick={() => deleteMsg(m._id)}
                      style={{ width: 34, height: 34, borderRadius: 2, border: `1px solid rgba(220,38,38,0.2)`, background: 'rgba(220,38,38,0.05)', color: '#DC2626', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(220,38,38,0.12)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(220,38,38,0.05)'; }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <div style={{ padding: '14px 16px', background: BG, borderRadius: 2, borderLeft: `2px solid ${!m.leido ? G : BORDER}` }}>
                  <p style={{ fontFamily: SANS, fontSize: 13, color: '#3A3A3A', lineHeight: 1.7, margin: 0 }}>{m.mensaje}</p>
                </div>
                <p style={{ fontFamily: SANS, fontSize: 11, color: MUTED, textAlign: 'right', marginTop: 10, letterSpacing: '0.03em' }}>
                  {new Date(m.fecha).toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Configuración ───────────────────────────────────────────────────────── */
function ConfigView({ configuracion, setConfiguracion }) {
  const [form, setForm] = useState({ nombreJoyeria: '', whatsappNumber: '', emailReceptor: '', redes: { instagram: '', facebook: '', tiktok: '' }, textos: { slogan: '', bannerTop: '' } });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => { if (configuracion) setForm(configuracion); }, [configuracion]);

  const save = async e => {
    e.preventDefault(); setSaving(true);
    try { const r = await updateConfig(form); setConfiguracion(r); setSaved(true); setTimeout(() => setSaved(false), 3000); }
    catch (err) { alert('Error: ' + (err.response?.data?.message || err.message)); }
    finally { setSaving(false); }
  };

  const inputStyle = { width: '100%', border: `1px solid ${BORDER}`, borderRadius: 3, padding: '11px 14px', fontFamily: SANS, fontSize: 13, color: BLACK, background: CARD, outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.15s' };
  const onF = e => e.target.style.borderColor = G;
  const onB = e => e.target.style.borderColor = BORDER;

  return (
    <div style={{ maxWidth: 680 }}>
      <SectionTitle label="Ajustes" subtitle="Configuración del Negocio" />
      <form onSubmit={save}>
        <ConfigCard title="Datos Generales">
          <div><ConfigLabel>Nombre de la Joyería</ConfigLabel><input value={form.nombreJoyeria||''} onChange={e => setForm({...form,nombreJoyeria:e.target.value})} style={inputStyle} onFocus={onF} onBlur={onB} /></div>
          <div><ConfigLabel>Número WhatsApp <span style={{color:MUTED,fontWeight:400,textTransform:'none',letterSpacing:0}}>(sin +, ej: 56912345678)</span></ConfigLabel><input value={form.whatsappNumber||''} onChange={e => setForm({...form,whatsappNumber:e.target.value})} style={inputStyle} onFocus={onF} onBlur={onB} /></div>
          <div><ConfigLabel>Email Receptor de Solicitudes</ConfigLabel><input type="email" value={form.emailReceptor||''} onChange={e => setForm({...form,emailReceptor:e.target.value})} style={inputStyle} onFocus={onF} onBlur={onB} /></div>
        </ConfigCard>
        <ConfigCard title="Redes Sociales">
          {['instagram','facebook','tiktok'].map(r => (
            <div key={r}><ConfigLabel>{r.charAt(0).toUpperCase()+r.slice(1)}</ConfigLabel><input value={form.redes?.[r]||''} onChange={e => setForm({...form,redes:{...form.redes,[r]:e.target.value}})} style={inputStyle} placeholder={`URL de ${r}`} onFocus={onF} onBlur={onB} /></div>
          ))}
        </ConfigCard>
        <ConfigCard title="Textos del Sitio">
          <div><ConfigLabel>Slogan</ConfigLabel><input value={form.textos?.slogan||''} onChange={e => setForm({...form,textos:{...form.textos,slogan:e.target.value}})} style={inputStyle} onFocus={onF} onBlur={onB} /></div>
          <div><ConfigLabel>Banner Superior</ConfigLabel><input value={form.textos?.bannerTop||''} onChange={e => setForm({...form,textos:{...form.textos,bannerTop:e.target.value}})} style={inputStyle} onFocus={onF} onBlur={onB} /></div>
        </ConfigCard>
        <button type="submit" disabled={saving||saved}
          style={{ width: '100%', padding: '15px', background: saved ? '#065F46' : BLACK, color: 'white', border: 'none', borderRadius: 3, fontFamily: SANS, fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', cursor: saving ? 'not-allowed' : 'pointer', transition: 'background 0.2s' }}
          onMouseEnter={e => { if (!saving&&!saved) e.currentTarget.style.background = G; }}
          onMouseLeave={e => { if (!saving&&!saved) e.currentTarget.style.background = BLACK; }}>
          {saving ? 'Guardando...' : saved ? '✓  Configuración guardada' : 'Guardar cambios'}
        </button>
      </form>
    </div>
  );
}