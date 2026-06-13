const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// Crear una nueva orden (Público)
router.post('/', async (req, res) => {
    try {
        const { customer, items, total, notes } = req.body;

        // Validación básica
        if (!customer || !items || items.length === 0) {
            return res.status(400).json({ message: 'Faltan datos requeridos (cliente o items).' });
        }

        const newOrder = new Order({
            customer,
            items,
            total,
            notes
        });

        const savedOrder = await newOrder.save();
        res.status(201).json(savedOrder);
    } catch (err) {
        console.error('Error creando orden:', err);
        res.status(500).json({ message: 'Error al procesar la orden', error: err.message });
    }
});

// Obtener todas las órdenes (Admin)
// TODO: Agregar middleware de autenticación si es necesario más adelante
router.get('/', async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: 'Error obteniendo órdenes', error: err.message });
    }
});

// Actualizar estado de una orden (Admin)
router.patch('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        if (!order) return res.status(404).json({ message: 'Orden no encontrada' });
        res.json(order);
    } catch (err) {
        res.status(500).json({ message: 'Error actualizando estado', error: err.message });
    }
});

module.exports = router;
