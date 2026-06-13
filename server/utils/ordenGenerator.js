const Solicitud = require('../models/Solicitud');

/**
 * Genera número de orden incremental en formato NIC-YYYY-NNNNNN
 * Ej: NIC-2026-000001, NIC-2026-000002
 */
async function generarNumeroOrden() {
  const year = new Date().getFullYear();
  const prefix = `NIC-${year}-`;

  // Buscar la última orden del año actual
  const ultima = await Solicitud.findOne(
    { numeroOrden: { $regex: `^${prefix}` } },
    { numeroOrden: 1 },
    { sort: { numeroOrden: -1 } }
  );

  let siguiente = 1;
  if (ultima && ultima.numeroOrden) {
    const partes = ultima.numeroOrden.split('-');
    const correlativo = parseInt(partes[2], 10);
    if (!isNaN(correlativo)) {
      siguiente = correlativo + 1;
    }
  }

  const correlativoStr = String(siguiente).padStart(6, '0');
  return `${prefix}${correlativoStr}`;
}

module.exports = { generarNumeroOrden };
