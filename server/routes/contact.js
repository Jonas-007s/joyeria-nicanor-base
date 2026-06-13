const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { verifyToken, requireAdmin } = require('../middleware/auth');
const { enviarNotificacionContacto } = require('../utils/emailService');

// Modelo para contactos
const Contact = require('../models/Contact');

// ─── POST / — Enviar mensaje de contacto (público) ───────────────────────────
router.post('/', [
  body('nombre').notEmpty().withMessage('Nombre es requerido'),
  body('email').isEmail().withMessage('Email válido es requerido'),
  body('mensaje').notEmpty().withMessage('Mensaje es requerido')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { nombre, email, telefono, mensaje } = req.body;

    const nuevoContacto = new Contact({
      nombre,
      email,
      telefono,
      mensaje,
      fecha: new Date()
    });

    await nuevoContacto.save();

    // Enviar email de notificación (no bloquea la respuesta)
    enviarNotificacionContacto(nuevoContacto).catch(emailError => {
      console.error('❌ Error enviando email de contacto:', emailError);
    });

    res.status(201).json({ message: 'Mensaje enviado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al enviar mensaje' });
  }
});

// ─── GET / — Obtener todos los mensajes (solo admin) ─────────────────────────
router.get('/', verifyToken, requireAdmin, async (req, res) => {
  try {
    const contactos = await Contact.find().sort({ fecha: -1 });
    res.json(contactos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener contactos' });
  }
});

// ─── PUT /:id/read — Marcar como leído (solo admin) ──────────────────────────
router.put('/:id/read', verifyToken, requireAdmin, async (req, res) => {
  try {
    const contacto = await Contact.findByIdAndUpdate(
      req.params.id,
      { leido: true },
      { new: true }
    );
    if (!contacto) return res.status(404).json({ error: 'Mensaje no encontrado' });
    res.json(contacto);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar contacto' });
  }
});

// ─── DELETE /:id — Eliminar mensaje (solo admin) ─────────────────────────────
router.delete('/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    const contacto = await Contact.findByIdAndDelete(req.params.id);
    if (!contacto) return res.status(404).json({ error: 'Mensaje no encontrado' });
    res.json({ message: 'Mensaje eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar mensaje' });
  }
});

module.exports = router;