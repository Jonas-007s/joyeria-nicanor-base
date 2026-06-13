const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Modelo de usuario (crear archivo User.js en models)
const User = require('../models/User');

// Middleware de autenticación
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token de acceso requerido' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token inválido' });
    }
    req.user = user;
    next();
  });
};

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validar entrada
    if (!email || !password) {
      return res.status(400).json({ message: 'Email y contraseña son requeridos' });
    }
    
    // Buscar usuario
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }
    
    // Verificar contraseña
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }
    
    // Generar token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// Verificar token
router.get('/verify', authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

// Registro temporal (remover después de crear el admin)
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    if (!email || !password || !name) {
      return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    // Bloquear rol admin vía API y proteger correo del admin
    if (req.body.role && String(req.body.role).toLowerCase() === 'admin') {
      return res.status(403).json({ message: 'No se permite crear administradores vía API' });
    }
    if (process.env.ADMIN_EMAIL && email === process.env.ADMIN_EMAIL) {
      return res.status(403).json({ message: 'El administrador solo se crea con el script del servidor' });
    }
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Usuario ya existe' });
    }
    
    const user = new User({
      email,
      password,
      name,
      role: 'user' // Forzado a usuario
    });
    
    await user.save();
    res.status(201).json({ message: 'Usuario creado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear usuario' });
  }
});
module.exports = { router, authenticateToken };