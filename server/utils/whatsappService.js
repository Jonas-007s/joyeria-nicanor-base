/**
 * Servicio de WhatsApp para generar enlaces de compartición
 * Genera URLs para abrir WhatsApp Web con mensaje precargado
 */
class WhatsAppService {
  /**
   * Generar URL de WhatsApp con mensaje precargado para solicitud
   * @param {Object} solicitud - Objeto de solicitud
   * @param {string} numeroWhatsApp - Número de teléfono del negocio (ej: 56979572356)
   * @returns {string} URL de WhatsApp Web
   */
  static generarURLSolicitud(solicitud, numeroWhatsApp) {
    if (!numeroWhatsApp) {
      console.warn('⚠️ Número de WhatsApp no configurado');
      return null;
    }

    const mensaje = this.generarMensajeSolicitud(solicitud);
    const mensajeEncodificado = encodeURIComponent(mensaje);
    
    // Formato internacional sin + ni espacios
    const numeroFormateado = numeroWhatsApp.replace(/[^0-9]/g, '');
    
    return `https://wa.me/${numeroFormateado}?text=${mensajeEncodificado}`;
  }

  /**
   * Generar mensaje estructurado para solicitud
   * @param {Object} solicitud - Objeto de solicitud
   * @returns {string} Mensaje formateado
   */
  static generarMensajeSolicitud(solicitud) {
    const { numeroOrden, cliente, productos, comentarios } = solicitud;

    let mensaje = `*✨ SOLICITUD DE COTIZACIÓN - ${numeroOrden}*\n\n`;

    mensaje += `*👤 Cliente: ${cliente.nombre}*\n`;
    mensaje += `📱 Teléfono: ${cliente.telefono}\n`;
    
    if (cliente.correo) {
      mensaje += `📧 Correo: ${cliente.correo}\n`;
    }
    
    if (cliente.ciudad) {
      mensaje += `📍 Ciudad: ${cliente.ciudad}\n`;
    }

    mensaje += `\n*🛍️ Productos Solicitados:*\n`;

    productos.forEach((p, index) => {
      mensaje += `\n${index + 1}. ${p.nombre}\n`;
      mensaje += `   • SKU: ${p.sku || 'N/A'}\n`;
      mensaje += `   • Cantidad: ${p.cantidad}\n`;
      
      if (p.material) {
        mensaje += `   • Material: ${p.material}\n`;
      }
    });

    if (comentarios) {
      mensaje += `\n*💬 Comentarios:*\n${comentarios}\n`;
    }

    mensaje += `\n---\n`;
    mensaje += `📊 Total de productos: ${productos.length}\n`;
    mensaje += `📦 Total de unidades: ${productos.reduce((sum, p) => sum + (p.cantidad || 0), 0)}\n`;

    return mensaje;
  }

  /**
   * Generar mensaje para compartir en el cliente
   * (Similar pero un poco diferente para uso del cliente)
   * @param {Object} solicitud - Objeto de solicitud
   * @returns {string} Mensaje para compartir
   */
  static generarMensajeCliente(solicitud) {
    const { numeroOrden, productos } = solicitud;

    let mensaje = `Hola, tengo interés en los siguientes productos:\n\n`;
    mensaje += `*Orden: ${numeroOrden}*\n\n`;

    mensaje += `*Productos:*\n`;
    productos.forEach((p) => {
      mensaje += `• ${p.nombre} (x${p.cantidad})\n`;
    });

    mensaje += `\nPor favor, envíame una cotización.\n`;
    mensaje += `\nGracias.`;

    return mensaje;
  }

  /**
   * Validar número de teléfono
   * @param {string} numero - Número a validar
   * @returns {boolean} Es válido
   */
  static esNumeroValido(numero) {
    // Formato: 56979572356 o +56979572356
    const patron = /^(\+?56)?[9][\d]{8}$/;
    return patron.test(numero.replace(/[^0-9+]/g, ''));
  }

  /**
   * Formatear número a formato internacional
   * @param {string} numero - Número a formatear
   * @returns {string} Número formateado
   */
  static formatearNumero(numero) {
    let limpio = numero.replace(/[^0-9]/g, '');
    
    // Si no tiene prefijo país, agregar 56 (Chile)
    if (!limpio.startsWith('56')) {
      limpio = '56' + limpio;
    }

    return limpio;
  }

  /**
   * Generar botón HTML para WhatsApp
   * @param {Object} solicitud - Objeto de solicitud
   * @param {string} numeroWhatsApp - Número del negocio
   * @returns {string} HTML del botón
   */
  static generarBotónHTML(solicitud, numeroWhatsApp) {
    const url = this.generarURLSolicitud(solicitud, numeroWhatsApp);
    
    if (!url) {
      return '';
    }

    return `
      <a href="${url}" 
         target="_blank"
         rel="noopener noreferrer"
         class="whatsapp-button"
         style="display: inline-flex;
                align-items: center;
                gap: 8px;
                background: #25D366;
                color: white;
                padding: 12px 24px;
                border-radius: 50px;
                text-decoration: none;
                font-weight: 600;
                font-size: 14px;
                cursor: pointer;
                transition: background 0.3s ease;">
        📱 Enviar por WhatsApp
      </a>
    `;
  }

  /**
   * Estadísticas de formato para logs
   * @param {string} numeroWhatsApp - Número a validar
   * @returns {Object} Info del número
   */
  static validarConfiguracion(numeroWhatsApp) {
    const esValido = this.esNumeroValido(numeroWhatsApp);
    const formateado = this.formatearNumero(numeroWhatsApp);

    return {
      original: numeroWhatsApp,
      formateado,
      esValido,
      url: `https://wa.me/${formateado}`
    };
  }
}

module.exports = WhatsAppService;
