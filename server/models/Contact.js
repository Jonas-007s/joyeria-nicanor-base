const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  email: { type: String, required: true },
  telefono: { type: String },
  mensaje: { type: String, required: true },
  fecha: { type: Date, default: Date.now },
  leido: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Contact', contactSchema);