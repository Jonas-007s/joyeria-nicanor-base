const mongoose = require('mongoose');

const clienteSchema = new mongoose.Schema({
  nombre: { type: String, required: true, trim: true },
  telefono: { type: String, required: true, trim: true },
  correo: { type: String, trim: true, lowercase: true },
  ciudad: { type: String, trim: true },
  cantidadSolicitudes: { type: Number, default: 1 },
  ultimaSolicitud: { type: Date, default: Date.now }
}, { timestamps: true });

// Índice compuesto para evitar duplicados por teléfono
clienteSchema.index({ telefono: 1 }, { unique: true });

module.exports = mongoose.model('Cliente', clienteSchema);
