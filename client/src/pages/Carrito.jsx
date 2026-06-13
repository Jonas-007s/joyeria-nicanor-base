import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext.jsx';
import { crearSolicitud, generateWhatsAppUrl, getConfig } from '../services/solicitudService';
import {
  ShoppingBag, Trash2, Plus, Minus, X, Send, ChevronRight,
  User, Phone, Mail, MapPin, MessageSquare, CheckCircle, Package
} from 'lucide-react';

const MESES = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];

function Carrito() {
  const { cartItems, removeItem, incrementQty, decrementQty, clearCart } = useCart();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ nombre: '', telefono: '', correo: '', ciudad: '', comentarios: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('56912345678');
  const [solicitudCreada, setSolicitudCreada] = useState(null);

  // Obtener número WhatsApp desde configuración
  useEffect(() => {
    getConfig()
      .then(cfg => { if (cfg?.whatsappNumber) setWhatsappNumber(cfg.whatsappNumber.replace(/\D/g, '')); })
      .catch(() => {});
  }, []);

  const carritoVacio = cartItems.length === 0;
  const totalProductos = cartItems.length;
  const totalUnidades = cartItems.reduce((acc, item) => acc + (item.cantidad || 1), 0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitSolicitud = async (e) => {
    e.preventDefault();
    if (!formData.nombre.trim() || !formData.telefono.trim()) {
      setError('Nombre y teléfono son obligatorios.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const solicitudData = {
        cliente: {
          nombre: formData.nombre.trim(),
          telefono: formData.telefono.trim(),
          correo: formData.correo.trim(),
          ciudad: formData.ciudad.trim()
        },
        productos: cartItems.map(item => ({
          productoId: item.id,
          nombre: item.nombre,
          sku: item.sku || '',
          material: item.material || '',
          imagen: item.imagen || '',
          cantidad: item.cantidad || 1
        })),
        comentarios: formData.comentarios.trim()
      };

      const result = await crearSolicitud(solicitudData);
      setSolicitudCreada(result);
      setIsModalOpen(false);
      clearCart();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al enviar la solicitud. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsApp = () => {
    if (!solicitudCreada) return;
    const url = generateWhatsAppUrl(solicitudCreada, whatsappNumber);
    window.open(url, '_blank');
  };

  // ── Pantalla de confirmación exitosa ────────────────────────────────────────
  if (solicitudCreada) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-16"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
          className="max-w-lg w-full text-center"
        >
          {/* Icono de éxito */}
          <div className="w-20 h-20 rounded-full bg-[var(--gold-subtle)] border border-[var(--gold-border)] flex items-center justify-center mx-auto mb-8">
            <CheckCircle size={36} className="text-[var(--gold)]" />
          </div>

          <p className="text-xs tracking-[0.25em] uppercase text-[var(--gray-400)] mb-3">Solicitud Enviada</p>
          <h1 className="text-3xl font-light mb-2" style={{ fontFamily: 'var(--font-serif)' }}>
            ¡Gracias, {solicitudCreada.cliente?.nombre?.split(' ')[0]}!
          </h1>
          <div className="divider-gold my-4" />

          {/* Número de orden */}
          <div className="bg-[var(--gray-50)] border border-[var(--gray-200)] rounded-2xl p-6 mb-8">
            <p className="text-xs tracking-[0.2em] uppercase text-[var(--gray-400)] mb-2">Número de Orden</p>
            <p className="text-2xl font-bold tracking-widest text-[var(--black)]">{solicitudCreada.numeroOrden}</p>
            <p className="text-sm text-[var(--gray-500)] mt-3">
              ¡Gracias por elegirnos! Hemos recibido tu solicitud de compra. Nos contactaremos contigo muy pronto para coordinar el pago y el envío.
            </p>
          </div>

          {/* Acciones */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleWhatsApp}
              className="btn btn-whatsapp btn-lg flex items-center gap-2"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Enviar por WhatsApp
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/productos')}
              className="btn btn-outline btn-lg"
            >
              Seguir navegando
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  // ── Carrito vacío ────────────────────────────────────────────────────────────
  const CarritoVacio = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-24 px-4 text-center"
    >
      <div className="w-24 h-24 rounded-full bg-[var(--gray-100)] flex items-center justify-center mb-6">
        <ShoppingBag size={40} className="text-[var(--gray-400)]" />
      </div>
      <h2 className="text-2xl font-light mb-3" style={{ fontFamily: 'var(--font-serif)' }}>
        Tu solicitud está vacía
      </h2>
      <p className="text-[var(--gray-500)] mb-8 max-w-xs">
        Agrega productos desde nuestro catálogo para comenzar tu solicitud de compra.
      </p>
      <Link to="/productos">
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          className="btn btn-primary btn-lg">
          Ver Catálogo
        </motion.button>
      </Link>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-[var(--gray-50)]">
      {/* Header de sección */}
      <div className="bg-white border-b border-[var(--gray-200)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <p className="text-xs tracking-[0.25em] uppercase text-[var(--gray-400)] mb-2">Joyería Nicanor</p>
          <h1 className="text-3xl md:text-4xl font-light" style={{ fontFamily: 'var(--font-serif)' }}>
            Solicitud de Compra
          </h1>
          <div className="divider-gold mt-4" style={{ marginLeft: 0, marginRight: 'auto' }} />
        </div>
      </div>

      {carritoVacio ? (
        <CarritoVacio />
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <div className="flex flex-col lg:flex-row gap-8">

            {/* ── Columna Izquierda: Productos ──────────────────────────────── */}
            <div className="flex-1 space-y-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-sm font-semibold tracking-[0.15em] uppercase text-[var(--gray-500)]">
                  {totalProductos} {totalProductos === 1 ? 'Producto' : 'Productos'} seleccionados
                </h2>
                <button
                  onClick={clearCart}
                  className="btn btn-ghost btn-sm text-[var(--estado-cancelado)] border-none flex items-center gap-1.5"
                >
                  <Trash2 size={13} />
                  Vaciar
                </button>
              </div>

              <AnimatePresence>
                {cartItems.map((item, idx) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20, height: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-white rounded-2xl border border-[var(--gray-200)] p-5 flex gap-4 sm:gap-6 hover:border-[var(--gold-border)] hover:shadow-[var(--shadow-md)] transition-all duration-300"
                  >
                    {/* Imagen */}
                    <div className="flex-shrink-0">
                      {item.imagen ? (
                        <img
                          src={item.imagen}
                          alt={item.nombre}
                          className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl border border-[var(--gray-100)]"
                        />
                      ) : (
                        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-[var(--gray-100)] rounded-xl border border-[var(--gray-200)] flex items-center justify-center">
                          <Package size={28} className="text-[var(--gray-400)]" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <Link to={`/producto/${item.id}`}>
                        <h3 className="font-semibold text-[var(--black)] hover:text-[var(--gold)] transition-colors truncate">
                          {item.nombre}
                        </h3>
                      </Link>
                      {item.sku && (
                        <p className="text-xs text-[var(--gray-400)] mt-0.5">SKU: {item.sku}</p>
                      )}
                      {item.material && (
                        <p className="text-xs text-[var(--gray-500)] mt-0.5">{item.material}</p>
                      )}

                      {/* Controles cantidad */}
                      <div className="flex items-center gap-3 mt-4">
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => decrementQty(item.id)}
                          className="btn-icon"
                          aria-label="Disminuir cantidad"
                          style={{ width: 32, height: 32, minWidth: 32, minHeight: 32, fontSize: '1rem' }}
                        >
                          <Minus size={13} />
                        </motion.button>
                        <span className="w-8 text-center font-bold text-[var(--black)]">
                          {item.cantidad || 1}
                        </span>
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => incrementQty(item.id)}
                          className="btn-icon"
                          aria-label="Aumentar cantidad"
                          style={{ width: 32, height: 32, minWidth: 32, minHeight: 32, fontSize: '1rem' }}
                        >
                          <Plus size={13} />
                        </motion.button>
                      </div>
                    </div>

                    {/* Eliminar */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => removeItem(item.id)}
                      className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full text-[var(--gray-400)] hover:text-[var(--estado-cancelado)] hover:bg-red-50 transition-colors"
                      aria-label={`Eliminar ${item.nombre}`}
                    >
                      <X size={15} />
                    </motion.button>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Botón continuar */}
              <div className="pt-2">
                <Link to="/productos" className="inline-flex items-center gap-2 text-sm text-[var(--gray-500)] hover:text-[var(--gold)] transition-colors">
                  <ChevronRight size={15} className="rotate-180" />
                  Seguir navegando
                </Link>
              </div>
            </div>

            {/* ── Columna Derecha: Resumen ──────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:w-80 xl:w-96"
            >
              <div className="bg-white rounded-2xl border border-[var(--gray-200)] p-7 sticky top-24">
                {/* Encabezado */}
                <p className="text-xs tracking-[0.2em] uppercase text-[var(--gray-400)] mb-1">Resumen</p>
                <h2 className="text-xl font-semibold text-[var(--black)] mb-5">Tu Solicitud</h2>
                <div className="divider-gold mb-6" style={{ marginLeft: 0, marginRight: 'auto' }} />

                {/* Stats */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--gray-500)]">Productos distintos</span>
                    <span className="font-semibold">{totalProductos}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--gray-500)]">Unidades totales</span>
                    <span className="font-semibold">{totalUnidades}</span>
                  </div>
                </div>

                <div className="bg-[var(--gold-subtle)] border border-[var(--gold-border)] rounded-xl p-4 mb-6">
                  <p className="text-sm text-[var(--black)] leading-relaxed" style={{ fontFamily: 'var(--font-serif)', fontSize: '1rem' }}>
                    "¡Excelente elección! Hemos recibido tu solicitud. Nos contactaremos contigo a la brevedad para coordinar los detalles de pago y envío de tus joyas."
                  </p>
                </div>

                {/* CTA Principal */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsModalOpen(true)}
                  disabled={carritoVacio}
                  className="btn btn-gold btn-lg w-full mb-3 flex items-center justify-center gap-2 animate-gold-pulse"
                >
                  <Send size={16} />
                  Enviar Solicitud
                </motion.button>

                <p className="text-xs text-center text-[var(--gray-400)]">
                  Asesoría personalizada · Coordinación directa
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          MODAL: Formulario de Solicitud
          ══════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => { if (e.target === e.currentTarget) setIsModalOpen(false); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl"
            >
              {/* Header del modal */}
              <div className="bg-[var(--black)] px-7 py-6 flex items-center justify-between">
                <div>
                  <p className="text-xs tracking-[0.2em] uppercase text-[var(--gold)] mb-1">Joyería Nicanor</p>
                  <h2 className="text-white text-xl font-light" style={{ fontFamily: 'var(--font-serif)' }}>
                    Datos de Contacto
                  </h2>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Formulario */}
              <form onSubmit={handleSubmitSolicitud} className="p-7 space-y-4 overflow-y-auto max-h-[70vh]">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700"
                  >
                    {error}
                  </motion.div>
                )}

                {/* Nombre */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--gray-600)] mb-1.5">
                    Nombre Completo <span className="text-[var(--gold)]">*</span>
                  </label>
                  <div className="relative">
                    <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--gray-400)]" />
                    <input
                      type="text"
                      name="nombre"
                      required
                      value={formData.nombre}
                      onChange={handleInputChange}
                      placeholder="Ej: Juan Pérez"
                      className="pl-9"
                    />
                  </div>
                </div>

                {/* Teléfono */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--gray-600)] mb-1.5">
                    Teléfono <span className="text-[var(--gold)]">*</span>
                  </label>
                  <div className="relative">
                    <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--gray-400)]" />
                    <input
                      type="tel"
                      name="telefono"
                      required
                      value={formData.telefono}
                      onChange={handleInputChange}
                      placeholder="+56 9 1234 5678"
                      className="pl-9"
                    />
                  </div>
                </div>

                {/* Correo */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--gray-600)] mb-1.5">
                    Correo Electrónico
                  </label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--gray-400)]" />
                    <input
                      type="email"
                      name="correo"
                      value={formData.correo}
                      onChange={handleInputChange}
                      placeholder="juan@email.com"
                      className="pl-9"
                    />
                  </div>
                </div>

                {/* Ciudad */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--gray-600)] mb-1.5">
                    Ciudad
                  </label>
                  <div className="relative">
                    <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--gray-400)]" />
                    <input
                      type="text"
                      name="ciudad"
                      value={formData.ciudad}
                      onChange={handleInputChange}
                      placeholder="Santiago, Valparaíso..."
                      className="pl-9"
                    />
                  </div>
                </div>

                {/* Comentarios */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--gray-600)] mb-1.5">
                    Comentarios Adicionales
                  </label>
                  <div className="relative">
                    <MessageSquare size={15} className="absolute left-3 top-3.5 text-[var(--gray-400)]" />
                    <textarea
                      name="comentarios"
                      rows={3}
                      value={formData.comentarios}
                      onChange={handleInputChange}
                      placeholder="Disponibilidad, tallas, consultas especiales..."
                      className="pl-9 resize-none"
                    />
                  </div>
                </div>

                {/* Resumen de productos */}
                <div className="bg-[var(--gray-50)] rounded-xl p-4 border border-[var(--gray-200)]">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[var(--gray-400)] mb-3">
                    Productos en tu pedido
                  </p>
                  <div className="space-y-1.5">
                    {cartItems.map(item => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-[var(--gray-700)] truncate flex-1">{item.nombre}</span>
                        <span className="font-semibold text-[var(--black)] ml-3">×{item.cantidad}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Botones */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    disabled={loading}
                    className="btn btn-ghost flex-1"
                  >
                    Cancelar
                  </button>
                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={!loading ? { scale: 1.02 } : {}}
                    whileTap={!loading ? { scale: 0.98 } : {}}
                    className="btn btn-gold flex-1 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <><div className="loading-spinner w-4 h-4" /> Enviando...</>
                    ) : (
                      <><Send size={15} /> Enviar Solicitud</>
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Carrito;
