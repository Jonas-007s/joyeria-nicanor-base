const express = require('express');
const router = express.Router();
const Config = require('../models/Config');
const { verifyToken, requireAdmin } = require('../middleware/auth');

// Helper para obtener o crear la config singleton
async function getOrCreateConfig() {
  let config = await Config.findOne();
  if (!config) {
    config = await Config.create({});
  }
  return config;
}

// ─── GET / — Obtener configuración (público — para frontend) ─────────────────
router.get('/', async (req, res) => {
  try {
    const config = await getOrCreateConfig();
    res.json(config);
  } catch (err) {
    res.status(500).json({ message: 'Error obteniendo configuración', error: err.message });
  }
});

// ─── PUT / — Actualizar configuración (admin) ─────────────────────────────────
router.put('/', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { nombreJoyeria, whatsappNumber, emailReceptor, redes, textos } = req.body;

    let config = await Config.findOne();
    if (!config) {
      config = new Config({});
    }

    if (nombreJoyeria !== undefined) config.nombreJoyeria = nombreJoyeria;
    if (whatsappNumber !== undefined) config.whatsappNumber = whatsappNumber;
    if (emailReceptor !== undefined) config.emailReceptor = emailReceptor;
    if (redes !== undefined) config.redes = { ...config.redes, ...redes };
    if (textos !== undefined) config.textos = { ...config.textos, ...textos };

    await config.save();
    res.json(config);
  } catch (err) {
    res.status(500).json({ message: 'Error actualizando configuración', error: err.message });
  }
});

module.exports = router;
