const express = require('express');
const router = express.Router();
const Solicitud = require('../models/Solicitud');
const Cliente = require('../models/Cliente');
const { generarNumeroOrden } = require('../utils/ordenGenerator');
const { enviarEmailSolicitud } = require('../utils/emailService');
const { verifyToken, requireAdmin } = require('../middleware/auth');

// ─── POST / — Crear nueva solicitud (público) ───────────────────────────────
router.post('/', async (req, res) => {
  try {
    const { cliente, productos, comentarios } = req.body;

    // Validación básica
    if (!cliente || !cliente.nombre || !cliente.telefono) {
      return res.status(400).json({ message: 'Nombre y teléfono del cliente son obligatorios.' });
    }
    if (!productos || productos.length === 0) {
      return res.status(400).json({ message: 'Debes incluir al menos un producto.' });
    }

    // Generar número de orden único
    const numeroOrden = await generarNumeroOrden();

    // Crear solicitud
    const solicitud = new Solicitud({
      numeroOrden,
      cliente,
      productos,
      comentarios: comentarios || ''
    });

    const savedSolicitud = await solicitud.save();

    // Registrar/actualizar cliente automáticamente
    try {
      await Cliente.findOneAndUpdate(
        { telefono: cliente.telefono },
        {
          $set: {
            nombre: cliente.nombre,
            correo: cliente.correo || '',
            ciudad: cliente.ciudad || '',
            ultimaSolicitud: new Date()
          },
          $inc: { cantidadSolicitudes: 1 }
        },
        { upsert: true, new: true }
      );
    } catch (clienteErr) {
      console.warn('⚠️ No se pudo registrar cliente:', clienteErr.message);
    }

    // Enviar email (async, no bloquea la respuesta)
    enviarEmailSolicitud(savedSolicitud).catch(err =>
      console.error('Error en email:', err.message)
    );

    res.status(201).json(savedSolicitud);
  } catch (err) {
    console.error('Error creando solicitud:', err);
    res.status(500).json({ message: 'Error al procesar la solicitud', error: err.message });
  }
});

// ─── GET / — Listar todas las solicitudes (admin) ────────────────────────────
router.get('/', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { estado, limit = 100, page = 1 } = req.query;
    const filter = {};
    if (estado) filter.estado = estado;

    const solicitudes = await Solicitud.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Solicitud.countDocuments(filter);

    res.json({ solicitudes, total, page: parseInt(page), limit: parseInt(limit) });
  } catch (err) {
    res.status(500).json({ message: 'Error obteniendo solicitudes', error: err.message });
  }
});

// ─── GET /stats — Estadísticas para dashboard (admin) ────────────────────────
router.get('/stats', verifyToken, requireAdmin, async (req, res) => {
  try {
    const total = await Solicitud.countDocuments();
    const pendientes = await Solicitud.countDocuments({ estado: 'Pendiente' });
    const contactados = await Solicitud.countDocuments({ estado: 'Contactado' });
    const cotizados = await Solicitud.countDocuments({ estado: 'Cotizado' });
    const cerrados = await Solicitud.countDocuments({ estado: 'Cerrado' });
    const cancelados = await Solicitud.countDocuments({ estado: 'Cancelado' });

    // Solicitudes por mes (últimos 6 meses)
    const seisAtras = new Date();
    seisAtras.setMonth(seisAtras.getMonth() - 5);

    const porMes = await Solicitud.aggregate([
      { $match: { createdAt: { $gte: seisAtras } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          total: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Productos más solicitados
    const topProductos = await Solicitud.aggregate([
      { $unwind: '$productos' },
      {
        $group: {
          _id: '$productos.nombre',
          totalSolicitado: { $sum: '$productos.cantidad' }
        }
      },
      { $sort: { totalSolicitado: -1 } },
      { $limit: 5 }
    ]);

    res.json({
      total, pendientes, contactados, cotizados, cerrados, cancelados,
      porMes, topProductos
    });
  } catch (err) {
    res.status(500).json({ message: 'Error obteniendo estadísticas', error: err.message });
  }
});

// ─── GET /:id — Detalle de una solicitud (admin) ──────────────────────────────
router.get('/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    const solicitud = await Solicitud.findById(req.params.id);
    if (!solicitud) return res.status(404).json({ message: 'Solicitud no encontrada' });
    res.json(solicitud);
  } catch (err) {
    res.status(500).json({ message: 'Error obteniendo solicitud', error: err.message });
  }
});

// ─── PUT /:id/estado — Actualizar estado (admin) ─────────────────────────────
router.put('/:id/estado', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { estado } = req.body;
    const validEstados = ['Pendiente', 'Contactado', 'Cotizado', 'Cerrado', 'Cancelado'];
    if (!validEstados.includes(estado)) {
      return res.status(400).json({ message: 'Estado inválido' });
    }

    const solicitud = await Solicitud.findByIdAndUpdate(
      req.params.id,
      { estado },
      { new: true }
    );
    if (!solicitud) return res.status(404).json({ message: 'Solicitud no encontrada' });
    res.json(solicitud);
  } catch (err) {
    res.status(500).json({ message: 'Error actualizando estado', error: err.message });
  }
});

// ─── DELETE /:id — Eliminar solicitud (admin) ─────────────────────────────────
router.delete('/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    const solicitud = await Solicitud.findByIdAndDelete(req.params.id);
    if (!solicitud) return res.status(404).json({ message: 'Solicitud no encontrada' });
    res.json({ message: 'Solicitud eliminada correctamente' });
  } catch (err) {
    res.status(500).json({ message: 'Error eliminando solicitud', error: err.message });
  }
});

module.exports = router;
