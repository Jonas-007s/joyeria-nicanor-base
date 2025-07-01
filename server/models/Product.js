const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  nombre: String,
  precio: Number,
  descripcion: String,
  categoria: String,
  stock: Number,
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
  }
});

module.exports = mongoose.model('Product', productSchema);
