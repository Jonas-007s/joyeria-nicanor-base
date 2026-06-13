/**
 * Configuraciones y constantes globales del sistema
 */

// Estados de solicitudes
const QUOTATION_STATES = {
  PENDING: 'Pendiente',
  CONTACTED: 'Contactado',
  QUOTED: 'Cotizado',
  CLOSED: 'Cerrado',
  CANCELLED: 'Cancelado'
};

// Formatos de orden
const ORDER_FORMAT = {
  PREFIX: 'NIC',
  SEPARATOR: '-',
  DIGITS: 6
};

// Colores por estado
const STATE_COLORS = {
  'Pendiente': '#FFA500',      // Naranja
  'Contactado': '#2196F3',     // Azul
  'Cotizado': '#4CAF50',       // Verde
  'Cerrado': '#9C27B0',        // Púrpura
  'Cancelado': '#F44336'       // Rojo
};

// Paleta de colores premium
const COLORS = {
  primary: {
    black: '#000000',
    white: '#FFFFFF',
    gold: '#D4AF37',
    gold_light: '#F4E4C1'
  },
  secondary: {
    gray_100: '#F9F9F9',
    gray_200: '#EEEEEE',
    gray_400: '#999999',
    gray_600: '#666666',
    gray_900: '#1A1A1A'
  },
  states: STATE_COLORS
};

// Configuración de paginación
const PAGINATION = {
  ITEMS_PER_PAGE: 20,
  MAX_ITEMS: 100
};

// Validaciones
const VALIDATION = {
  PHONE_PATTERN: /^(\+?56)?[9][\d]{8}$/,
  EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  MIN_ORDER_ITEMS: 1,
  MAX_COMMENT_LENGTH: 1000
};

// Mensajes de sistema
const MESSAGES = {
  ORDER_CREATED: 'Solicitud de cotización creada exitosamente',
  ORDER_UPDATED: 'Solicitud actualizada',
  ORDER_DELETED: 'Solicitud cancelada',
  CLIENT_REGISTERED: 'Cliente registrado',
  CLIENT_UPDATED: 'Cliente actualizado',
  EMAIL_SENT: 'Email enviado correctamente',
  WHATSAPP_READY: 'URL de WhatsApp generada'
};

// Eventos del sistema
const EVENTS = {
  ORDER_CREATED: 'Solicitud creada',
  ORDER_UPDATED: 'Solicitud actualizada',
  STATE_CHANGED: 'Estado cambiado',
  NOTE_ADDED: 'Nota agregada',
  EMAIL_SENT: 'Email enviado',
  WHATSAPP_SENT: 'Enviado por WhatsApp',
  CLIENT_CONTACTED: 'Cliente contactado'
};

module.exports = {
  QUOTATION_STATES,
  ORDER_FORMAT,
  STATE_COLORS,
  COLORS,
  PAGINATION,
  VALIDATION,
  MESSAGES,
  EVENTS
};
