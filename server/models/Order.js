const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    customer: {
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        address: { type: String, required: false } // Opcional, si deciden agregar delivery
    },
    items: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
            nombre: { type: String, required: true }, // Guardamos snapshot del nombre
            precio: { type: Number, required: true },   // Guardamos snapshot del precio
            cantidad: { type: Number, required: true }
        }
    ],
    total: { type: Number, required: true },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'shipped', 'completed', 'cancelled'],
        default: 'pending'
    },
    notes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
