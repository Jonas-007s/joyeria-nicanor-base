const Quotation = require('../models/Quotation');

/**
 * Servicio para generar números de orden únicos
 * Formato: NIC-YYYY-XXXXXX
 * Ejemplo: NIC-2026-000001
 */
class OrderGenerator {
  /**
   * Generar el próximo número de orden
   * @returns {Promise<string>} Número de orden generado
   */
  static async generateNextOrderNumber() {
    try {
      const currentYear = new Date().getFullYear();
      const prefix = `NIC-${currentYear}`;

      // Buscar el último número de orden del año actual
      const lastQuotation = await Quotation.findOne({
        numeroOrden: new RegExp(`^${prefix}-`)
      }).sort({ createdAt: -1 }).exec();

      let nextSequence = 1;

      if (lastQuotation) {
        // Extraer el número secuencial del último
        const lastNumber = lastQuotation.numeroOrden.split('-')[2];
        nextSequence = parseInt(lastNumber) + 1;
      }

      // Formatear con ceros a la izquierda (6 dígitos)
      const sequenceFormatted = String(nextSequence).padStart(6, '0');
      const newOrderNumber = `${prefix}-${sequenceFormatted}`;

      // Validar que el número no exista (redundancia)
      const exists = await Quotation.findOne({ numeroOrden: newOrderNumber });
      if (exists) {
        throw new Error(`Número de orden duplicado: ${newOrderNumber}`);
      }

      return newOrderNumber;
    } catch (error) {
      console.error('Error al generar número de orden:', error);
      throw new Error('No se pudo generar el número de orden');
    }
  }

  /**
   * Obtener número de orden formateado
   * @param {string} numeroOrden Número de orden
   * @returns {string} Formateado con guiones
   */
  static formatOrderNumber(numeroOrden) {
    if (!numeroOrden || typeof numeroOrden !== 'string') {
      return '';
    }
    // Ya viene formateado: NIC-YYYY-XXXXXX
    return numeroOrden;
  }

  /**
   * Validar formato de número de orden
   * @param {string} numeroOrden Número a validar
   * @returns {boolean} Es válido
   */
  static isValidOrderNumber(numeroOrden) {
    const pattern = /^NIC-\d{4}-\d{6}$/;
    return pattern.test(numeroOrden);
  }

  /**
   * Obtener año del número de orden
   * @param {string} numeroOrden Número de orden
   * @returns {number} Año
   */
  static getYearFromOrderNumber(numeroOrden) {
    const parts = numeroOrden.split('-');
    return parseInt(parts[1]);
  }

  /**
   * Obtener correlativo del número de orden
   * @param {string} numeroOrden Número de orden
   * @returns {number} Correlativo
   */
  static getSequenceFromOrderNumber(numeroOrden) {
    const parts = numeroOrden.split('-');
    return parseInt(parts[2]);
  }

  /**
   * Obtener estadísticas de órdenes
   * @returns {Promise<Object>} Estadísticas
   */
  static async getOrderStatistics() {
    try {
      const currentYear = new Date().getFullYear();
      const prefix = `NIC-${currentYear}`;

      const stats = await Quotation.aggregate([
        {
          $match: {
            numeroOrden: new RegExp(`^${prefix}-`)
          }
        },
        {
          $group: {
            _id: '$estado',
            cantidad: { $sum: 1 }
          }
        }
      ]);

      // Contar total de órdenes este año
      const totalOrdenes = await Quotation.countDocuments({
        numeroOrden: new RegExp(`^${prefix}-`)
      });

      return {
        año: currentYear,
        totalOrdenes,
        porEstado: stats
      };
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      return null;
    }
  }
}

module.exports = OrderGenerator;
