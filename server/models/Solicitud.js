const mongoose = require('mongoose');

const solicitudSchema = new mongoose.Schema({
  numeroOrden: {
    type: String,
    unique: true,
    required: true
  },
  fecha: {
    type: Date,
    default: Date.now
  },
  cliente: {
    nombre: { type: String, required: true, trim: true },
    telefono: { type: String, required: true, trim: true },
    correo: { type: String, trim: true, lowercase: true },
    ciudad: { type: String, trim: true }
  },
  productos: [
    {
      productoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      nombre: { type: String, required: true },
      sku: { type: String },
      material: { type: String },
      imagen: { type: String },
      cantidad: { type: Number, required: true, min: 1 }
    }
  ],
  comentarios: { type: String, trim: true },
  estado: {
    type: String,
    enum: ['Pendiente', 'Contactado', 'Cotizado', 'Cerrado', 'Cancelado'],
    default: 'Pendiente'
  }
}, { timestamps: true });

module.exports = mongoose.model('Solicitud', solicitudSchema);
