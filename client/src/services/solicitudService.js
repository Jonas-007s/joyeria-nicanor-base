import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({ baseURL: API_BASE });

// Agregar token automáticamente
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('authToken') || localStorage.getItem('authToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/**
 * Crear nueva solicitud de cotización (público)
 * @param {Object} data - { cliente, productos, comentarios }
 */
export const crearSolicitud = async (data) => {
  const response = await api.post('/api/solicitudes', data);
  return response.data;
};

/**
 * Obtener todas las solicitudes (admin)
 * @param {Object} params - { estado, limit, page }
 */
export const getSolicitudes = async (params = {}) => {
  const response = await api.get('/api/solicitudes', { params });
  return response.data;
};

/**
 * Obtener estadísticas para dashboard (admin)
 */
export const getStatsSolicitudes = async () => {
  const response = await api.get('/api/solicitudes/stats');
  return response.data;
};

/**
 * Obtener detalle de una solicitud (admin)
 */
export const getSolicitud = async (id) => {
  const response = await api.get(`/api/solicitudes/${id}`);
  return response.data;
};

/**
 * Actualizar estado de una solicitud (admin)
 */
export const updateEstado = async (id, estado) => {
  const response = await api.put(`/api/solicitudes/${id}/estado`, { estado });
  return response.data;
};

/**
 * Eliminar solicitud (admin)
 */
export const deleteSolicitud = async (id) => {
  const response = await api.delete(`/api/solicitudes/${id}`);
  return response.data;
};

/**
 * Obtener clientes registrados (admin)
 */
export const getClientes = async () => {
  const response = await api.get('/api/clientes');
  return response.data;
};

/**
 * Obtener configuración del negocio (público)
 */
export const getConfig = async () => {
  const response = await api.get('/api/config');
  return response.data;
};

/**
 * Actualizar configuración (admin)
 */
export const updateConfig = async (data) => {
  const response = await api.put('/api/config', data);
  return response.data;
};

/**
 * Genera URL de WhatsApp con mensaje pre-cargado
 * @param {Object} solicitud - objeto completo de la solicitud
 * @param {string} whatsappNumber - número sin + (ej: 56912345678)
 */
export const generateWhatsAppUrl = (solicitud, whatsappNumber = '56912345678') => {
  const { numeroOrden, cliente, productos, comentarios } = solicitud;

  const productosTexto = productos
    .map(p => `▸ ${p.nombre}${p.sku ? ` (${p.sku})` : ''}\n  Cantidad: ${p.cantidad}`)
    .join('\n');

  const mensaje = `Hola, tengo interés en los siguientes productos:

📋 Orden: ${numeroOrden}

👤 Cliente: ${cliente.nombre}
📞 Teléfono: ${cliente.telefono}${cliente.correo ? `\n📧 Correo: ${cliente.correo}` : ''}${cliente.ciudad ? `\n🏙️ Ciudad: ${cliente.ciudad}` : ''}

🛍️ Productos solicitados:
${productosTexto}${comentarios ? `\n\n💬 Comentarios:\n${comentarios}` : ''}

Gracias.`;

  const encoded = encodeURIComponent(mensaje);
  return `https://wa.me/${whatsappNumber}?text=${encoded}`;
};

export default api;
