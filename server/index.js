const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const productsRouter = require('./routes/products');
app.use('/api/products', productsRouter);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(PORT, () => console.log('Servidor backend corriendo y conectado a MongoDB'));
  })
  .catch(err => {
    console.log('Error conectando a MongoDB:', err.message);
    app.listen(PORT, () => console.log('Servidor backend corriendo SIN conexión a MongoDB'));
  });
