const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { authenticateToken } = require('./auth');
const multer = require('multer');
const path = require('path');
const { body, validationResult } = require('express-validator');

// Configuración de multer para guardar imágenes en /uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// Obtener todos los productos
router.get('/', async (req, res) => {
  try {
    const productos = await Product.find();
    res.json(productos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtener productos por sección
router.get('/seccion/:seccion', async (req, res) => {
  try {
    const productos = await Product.find({ seccion: req.params.seccion });
    res.json(productos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtener producto por ID
router.get('/:id', async (req, res) => {
  try {
    const producto = await Product.findById(req.params.id);
    if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(producto);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Configuración segura de multer
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB máximo por archivo (alineado con cliente)
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Solo se permiten imágenes JPG, PNG o WEBP'));
  }
});

// Crear producto (protegido, solo admin, acepta imágenes y campos anidados)
router.post(
  '/',
  authenticateToken,
  upload.array('imagenes', 5),
  [
    body('nombre').optional(), // validaremos luego tras parseo
    body('precio').optional(),
    body('categoria').optional(),
    body('stock').optional(),
  ],
  async (req, res) => {
    try {
      if (req.user.role !== 'admin') return res.status(403).json({ message: 'Acceso denegado' });

      // Soportar FormData con 'productData' o campos planos
      const parsedBody = req.body.productData ? JSON.parse(req.body.productData) : req.body;

      // Validaciones mínimas (nombre/precio/categoria)
      if (!parsedBody.nombre || !parsedBody.precio || !parsedBody.categoria) {
        return res.status(400).json({ error: 'Nombre, precio y categoría son obligatorios' });
      }

      const especificaciones = parsedBody.especificaciones || {};
      const infoAdicional = parsedBody.infoAdicional || {};
      const lanzamiento = parsedBody.lanzamiento || {};
      const imagenes = req.files ? req.files.map(f => `/uploads/${f.filename}`) : [];

      const nuevo = new Product({
        ...parsedBody,
        especificaciones,
        infoAdicional,
        lanzamiento,
        imagenes
      });

      await nuevo.save();
      return res.status(201).json(nuevo);
    } catch (err) {
      console.error(err);
      return res.status(400).json({ error: 'Error al crear el producto. Verifica los datos enviados.' });
    }
  }
);

// Actualizar producto (protegido y solo admin)
router.put('/:id', authenticateToken, upload.array('imagenes', 5), async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Acceso denegado' });

    // Soportar FormData con 'productData' o campos planos
    const parsedBody = req.body.productData ? JSON.parse(req.body.productData) : req.body;

    const existente = await Product.findById(req.params.id);
    if (!existente) return res.status(404).json({ error: 'Producto no encontrado' });

    const imagenesNuevas = req.files ? req.files.map(f => `/uploads/${f.filename}`) : [];

    const update = { ...parsedBody };

    // Normalizar campos anidados manteniendo valores previos si no llegan en la actualización
    update.especificaciones = parsedBody.especificaciones ?? existente.especificaciones ?? {};
    update.infoAdicional = parsedBody.infoAdicional ?? existente.infoAdicional ?? {};
    update.lanzamiento = parsedBody.lanzamiento ?? existente.lanzamiento ?? {};

    // Si hay nuevas imágenes, se agregan a las existentes; si no, se preservan las actuales
    if (imagenesNuevas.length > 0) {
      update.imagenes = Array.isArray(existente.imagenes)
        ? [...existente.imagenes, ...imagenesNuevas]
        : imagenesNuevas;
    }

    const actualizado = await Product.findByIdAndUpdate(req.params.id, update, { new: true });
    return res.json(actualizado);
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: 'Error al actualizar el producto' });
  }
});

// Bulk update launch date
router.put('/bulk/launch-update', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Acceso denegado' });

    const { fecha, descripcion } = req.body;
    if (!fecha) return res.status(400).json({ error: 'Se requiere una fecha válida' });

    // Update all items in 'nuevo-lanzamiento' section
    const result = await Product.updateMany(
      { seccion: 'nuevo-lanzamiento' },
      {
        $set: {
          'lanzamiento.fecha': new Date(fecha),
          'lanzamiento.esLanzamiento': true,
          // Optional: update description if provided
          ...(descripcion && { 'lanzamiento.descripcion': descripcion })
        }
      }
    );

    return res.json({ message: 'Lanzamientos actualizados correctamente', count: result.modifiedCount });
  } catch (err) {
    console.error('Error in bulk update:', err);
    return res.status(500).json({ error: 'Error al actualizar lanzamientos masivos' });
  }
});

// Eliminar producto (protegido y solo admin)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Acceso denegado' });
    const producto = await Product.findByIdAndDelete(req.params.id);
    if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json({ message: 'Producto eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
