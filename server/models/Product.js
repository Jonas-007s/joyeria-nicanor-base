const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  nombre: String,
  precio: Number,
  descripcion: String,
  categoria: String,
  stock: Number,
  sku: { type: String, trim: true },         // Código SKU visible en solicitud
  material: { type: String, trim: true },    // Material principal (Oro 18k, Plata 925, etc.)
  imagenes: [String],
  especificaciones: {
    material: String,
    peso: String,
    dimensiones: String,
    tallas: String,
  },
  infoAdicional: {
    instrucciones: String,
    garantia: String,
    origen: String,
    tiempoEntrega: String,
  },
  lanzamiento: {
    esLanzamiento: Boolean,
    fecha: Date,
    descripcion: String,
    preview: Number,
  },
  fechaLanzamiento: { type: Date },
  descripcionLanzamiento: { type: String },
  seccion: {
    type: String,
    enum: ['productos', 'mas-lanzamientos', 'nuevo-lanzamiento', 'artesanias'],
    default: 'productos'
  }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
