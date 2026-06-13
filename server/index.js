const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Configuración de seguridad
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: false
}));

// Rate limiting solo a rutas API
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3000,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiadas peticiones, intenta más tarde' }
});
app.use('/api', limiter);

// CORS
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:4173',
    process.env.CLIENT_URL || 'http://localhost:3000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cache-Control']
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Archivos estáticos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Monitoreo de DB
mongoose.connection.on('disconnected', () => {
  console.log('⚠️ MongoDB desconectado! Intentando reconectar...');
});
mongoose.connection.on('reconnected', () => {
  console.log('✅ MongoDB reconectado!');
});

async function startServer() {
  try {
    if (!process.env.MONGODB_URI) {
      console.error('Falta MONGODB_URI en el .env');
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('✅ MongoDB conectado');

    // ── Rutas existentes ──────────────────────────────────────────────────────
    const { router: authRouter } = require('./routes/auth');
    const productsRouter = require('./routes/products');
    const contactRouter = require('./routes/contact');

    app.use('/api/auth', authRouter);
    app.use('/api/products', productsRouter);
    app.use('/api/contact', contactRouter);

    // ── Nuevas rutas — Sistema de Solicitudes de Cotización ───────────────────
    const solicitudesRouter = require('./routes/solicitudes');
    const clientesRouter = require('./routes/clientes');
    const configRouter = require('./routes/config');

    app.use('/api/solicitudes', solicitudesRouter);
    app.use('/api/clientes', clientesRouter);
    app.use('/api/config', configRouter);

    // 404
    app.use((req, res, next) => {
      if (!req.route)
        return res.status(404).json({ error: 'Ruta no encontrada' });
      next();
    });

    // Error handler global
    app.use((err, req, res, next) => {
      console.error('SERVER ERROR:', err);
      res.status(500).json({ error: 'Error interno del servidor', details: err.message });
    });

    const server = app.listen(PORT, () => {
      console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
    });

    server.on('error', (e) => {
      if (e.code === 'EADDRINUSE') {
        console.error(`ERROR CRÍTICO: El puerto ${PORT} está ocupado.`);
        process.exit(1);
      }
    });

  } catch (err) {
    console.error('Error al iniciar el servidor:', err);
    process.exit(1);
  }
}

startServer();
