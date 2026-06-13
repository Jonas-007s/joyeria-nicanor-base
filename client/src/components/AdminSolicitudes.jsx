import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Eye, MessageCircle, CheckCircle, Clock, Search, X, Mail,
  Smartphone, MapPin, Package, Calendar, ChevronRight, Trash2
} from 'lucide-react';
import { getSolicitudes, updateEstado, deleteSolicitud, generateWhatsAppUrl, getConfig } from '../services/solicitudService';

const ESTADOS = ['Pendiente', 'Contactado', 'Cotizado', 'Cerrado', 'Cancelado'];

function AdminSolicitudes() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  const [selectedSolicitud, setSelectedSolicitud] = useState(null);
  const [whatsappNumber, setWhatsappNumber] = useState('56912345678');

  // Cargar número de WhatsApp desde la configuración del negocio
  useEffect(() => {
    getConfig()
      .then(config => {
        if (config?.whatsappNumber) {
          // Normalizar: quitar el símbolo '+' si existe
          setWhatsappNumber(config.whatsappNumber.replace(/^\+/, ''));
        }
      })
      .catch(() => {}); // Mantener el fallback si falla
  }, []);

  useEffect(() => {
    fetchSolicitudes();
  }, [filtroEstado]);


  const fetchSolicitudes = async () => {
    try {
      setLoading(true);
      const data = await getSolicitudes({ estado: filtroEstado });
      setSolicitudes(data.solicitudes);
    } catch (err) {
      setError('Error al cargar solicitudes');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateEstado = async (id, estado) => {
    try {
      await updateEstado(id, estado);
      setSolicitudes(prev => prev.map(s => s._id === id ? { ...s, estado } : s));
      if (selectedSolicitud?._id === id) {
        setSelectedSolicitud(prev => ({ ...prev, estado }));
      }
    } catch (err) {
      alert('Error al actualizar estado');
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Eliminar esta solicitud permanentemente?')) return;
    try {
      await deleteSolicitud(id);
      setSolicitudes(prev => prev.filter(s => s._id !== id));
      if (selectedSolicitud?._id === id) setSelectedSolicitud(null);
    } catch (err) {
      alert('Error al eliminar solicitud');
    }
  };

  const getEstadoBadge = (estado) => {
    const classes = `badge-estado badge-${estado}`;
    return <span className={classes}>{estado}</span>;
  };

  return (
    <div className="space-y-6">
      {/* Header & Filtros */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-xl border border-[var(--gray-200)] shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-[var(--black)]">Solicitudes de Cotización</h2>
          <p className="text-sm text-[var(--gray-500)] mt-1">Gestiona las consultas de tus clientes</p>
        </div>
        <div className="flex items-center gap-3">
          <select 
            value={filtroEstado} 
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="w-40 border-[var(--gray-200)] text-sm rounded-lg"
          >
            <option value="">Todos los estados</option>
            {ESTADOS.map(est => <option key={est} value={est}>{est}</option>)}
          </select>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-xl border border-[var(--gray-200)] shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center"><div className="loading-spinner"></div></div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">{error}</div>
        ) : solicitudes.length === 0 ? (
          <div className="p-12 text-center text-[var(--gray-400)]">
            <Package size={40} className="mx-auto mb-3 opacity-50" />
            <p>No hay solicitudes encontradas.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table-luxury">
              <thead>
                <tr>
                  <th>Orden</th>
                  <th>Fecha</th>
                  <th>Cliente</th>
                  <th>Productos</th>
                  <th>Estado</th>
                  <th className="text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {solicitudes.map(sol => (
                  <tr key={sol._id}>
                    <td className="font-mono text-xs font-semibold">{sol.numeroOrden}</td>
                    <td>{new Date(sol.fecha).toLocaleDateString()}</td>
                    <td>
                      <div className="font-semibold text-[var(--black)]">{sol.cliente?.nombre}</div>
                      <div className="text-xs text-[var(--gray-500)]">{sol.cliente?.telefono}</div>
                    </td>
                    <td>{sol.productos?.length || 0} items</td>
                    <td>{getEstadoBadge(sol.estado)}</td>
                    <td className="text-right">
                      <button 
                        onClick={() => setSelectedSolicitud(sol)}
                        className="btn btn-ghost btn-sm mr-2"
                      >
                        <Eye size={16} /> Ver
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Drawer Lateral - Detalle */}
      <AnimatePresence>
        {selectedSolicitud && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
              onClick={() => setSelectedSolicitud(null)}
            />
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col border-l border-[var(--gray-200)]"
            >
              {/* Header Drawer */}
              <div className="p-6 border-b border-[var(--gray-200)] bg-[var(--gray-50)] flex items-start justify-between">
                <div>
                  <p className="text-xs tracking-[0.15em] uppercase text-[var(--gray-500)] mb-1">Detalle de Solicitud</p>
                  <h3 className="text-xl font-bold font-mono">{selectedSolicitud.numeroOrden}</h3>
                  <p className="text-sm text-[var(--gray-500)] mt-1 flex items-center gap-1">
                    <Calendar size={14}/> {new Date(selectedSolicitud.fecha).toLocaleString()}
                  </p>
                </div>
                <button onClick={() => setSelectedSolicitud(null)} className="btn-icon bg-transparent text-[var(--gray-400)] hover:text-black hover:bg-[var(--gray-200)] shadow-none">
                  <X size={20} />
                </button>
              </div>

              {/* Contenido Drawer */}
              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                
                {/* Acciones Rápidas */}
                <div className="flex gap-3">
                  <select 
                    value={selectedSolicitud.estado}
                    onChange={(e) => handleUpdateEstado(selectedSolicitud._id, e.target.value)}
                    className="flex-1 text-sm font-semibold"
                  >
                    {ESTADOS.map(est => <option key={est} value={est}>{est}</option>)}
                  </select>
                  <a 
                    href={generateWhatsAppUrl(selectedSolicitud, whatsappNumber)}
                    target="_blank" rel="noreferrer"
                    className="btn btn-whatsapp btn-sm flex items-center justify-center gap-2"
                  >
                    <MessageCircle size={16} /> WhatsApp
                  </a>
                </div>

                {/* Cliente Info */}
                <div>
                  <h4 className="text-xs tracking-[0.1em] uppercase text-[var(--gray-400)] font-bold mb-3 border-b border-[var(--gray-100)] pb-2">Datos del Cliente</h4>
                  <div className="bg-[var(--gray-50)] rounded-xl p-4 space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-8 h-8 rounded-full bg-[var(--gray-200)] flex items-center justify-center text-[var(--gray-500)]"><Search size={14}/></div>
                      <span className="font-semibold">{selectedSolicitud.cliente?.nombre}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-8 h-8 rounded-full bg-[var(--gray-200)] flex items-center justify-center text-[var(--gray-500)]"><Smartphone size={14}/></div>
                      <span>{selectedSolicitud.cliente?.telefono}</span>
                    </div>
                    {selectedSolicitud.cliente?.correo && (
                      <div className="flex items-center gap-3 text-sm">
                        <div className="w-8 h-8 rounded-full bg-[var(--gray-200)] flex items-center justify-center text-[var(--gray-500)]"><Mail size={14}/></div>
                        <span>{selectedSolicitud.cliente?.correo}</span>
                      </div>
                    )}
                    {selectedSolicitud.cliente?.ciudad && (
                      <div className="flex items-center gap-3 text-sm">
                        <div className="w-8 h-8 rounded-full bg-[var(--gray-200)] flex items-center justify-center text-[var(--gray-500)]"><MapPin size={14}/></div>
                        <span>{selectedSolicitud.cliente?.ciudad}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Productos */}
                <div>
                  <h4 className="text-xs tracking-[0.1em] uppercase text-[var(--gray-400)] font-bold mb-3 border-b border-[var(--gray-100)] pb-2">Productos ({selectedSolicitud.productos?.length})</h4>
                  <div className="space-y-3">
                    {selectedSolicitud.productos?.map((prod, idx) => (
                      <div key={idx} className="flex gap-3 items-center border border-[var(--gray-100)] rounded-lg p-2">
                        {prod.imagen ? (
                          <img src={prod.imagen} alt={prod.nombre} className="w-12 h-12 object-cover rounded bg-[var(--gray-50)]" />
                        ) : (
                          <div className="w-12 h-12 bg-[var(--gray-100)] rounded flex items-center justify-center"><Package size={16} className="text-[var(--gray-400)]"/></div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold truncate text-[var(--black)]">{prod.nombre}</p>
                          <p className="text-xs text-[var(--gray-500)]">{prod.sku || '-'} | {prod.material || '-'}</p>
                        </div>
                        <div className="font-bold text-[var(--gold)] px-3">x{prod.cantidad}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Comentarios */}
                {selectedSolicitud.comentarios && (
                  <div>
                    <h4 className="text-xs tracking-[0.1em] uppercase text-[var(--gray-400)] font-bold mb-3 border-b border-[var(--gray-100)] pb-2">Comentarios</h4>
                    <p className="text-sm text-[var(--gray-600)] bg-yellow-50 p-4 rounded-lg border border-yellow-100 italic">
                      "{selectedSolicitud.comentarios}"
                    </p>
                  </div>
                )}
              </div>

              {/* Footer Drawer */}
              <div className="p-4 border-t border-[var(--gray-200)] bg-[var(--gray-50)]">
                <button 
                  onClick={() => handleEliminar(selectedSolicitud._id)}
                  className="btn btn-danger w-full btn-sm"
                >
                  <Trash2 size={16} /> Eliminar Solicitud
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default AdminSolicitudes;
