const express = require('express');
const router = express.Router();
const Cliente = require('../models/Cliente');
const Solicitud = require('../models/Solicitud');
const { verifyToken, requireAdmin } = require('../middleware/auth');

// ─── GET / — Listar todos los clientes (admin) ────────────────────────────────
router.get('/', verifyToken, requireAdmin, async (req, res) => {
  try {
    const clientes = await Cliente.find().sort({ ultimaSolicitud: -1 });
    res.json(clientes);
  } catch (err) {
    res.status(500).json({ message: 'Error obteniendo clientes', error: err.message });
  }
});

// ─── GET /:id — Detalle con historial de solicitudes ─────────────────────────
router.get('/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    const cliente = await Cliente.findById(req.params.id);
    if (!cliente) return res.status(404).json({ message: 'Cliente no encontrado' });

    const solicitudes = await Solicitud.find(
      { 'cliente.telefono': cliente.telefono },
      { numeroOrden: 1, estado: 1, fecha: 1, productos: 1, createdAt: 1 }
    ).sort({ createdAt: -1 });

    res.json({ ...cliente.toObject(), solicitudes });
  } catch (err) {
    res.status(500).json({ message: 'Error obteniendo cliente', error: err.message });
  }
});

module.exports = router;
