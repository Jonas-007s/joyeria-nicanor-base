const { body, param, query, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const DOMPurify = require('isomorphic-dompurify');

// Middleware para manejar errores de validación
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Datos de entrada inválidos',
      details: errors.array().map(err => ({
        field: err.path,
        message: err.msg,
        value: err.value
      }))
    });
  }
  next();
};

// Sanitización de strings
const sanitizeString = (value) => {
  if (typeof value !== 'string') return value;
  return DOMPurify.sanitize(value.trim());
};

// Middleware de sanitización
const sanitizeInput = (req, res, next) => {
  const sanitizeObject = (obj) => {
    for (let key in obj) {
      if (obj[key] && typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
        sanitizeObject(obj[key]);
      } else if (typeof obj[key] === 'string') {
        obj[key] = sanitizeString(obj[key]);
      } else if (Array.isArray(obj[key])) {
        obj[key] = obj[key].map(item => 
          typeof item === 'string' ? sanitizeString(item) : item
        );
      }
    }
  };

  if (req.body) sanitizeObject(req.body);
  if (req.query) sanitizeObject(req.query);
  if (req.params) sanitizeObject(req.params);
  
  next();
};

// Validaciones para productos
const validateProduct = [
  body('nombre')
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre debe tener entre 2 y 100 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s\-\.]+$/)
    .withMessage('El nombre contiene caracteres no válidos'),
  
  body('precio')
    .isFloat({ min: 0.01, max: 999999999 })
    .withMessage('El precio debe ser un número positivo válido'),
  
  body('descripcion')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('La descripción no puede exceder 1000 caracteres'),
  
  body('categoria')
    .isIn(['anillos', 'collares', 'aretes', 'pulseras', 'relojes', 'otros'])
    .withMessage('Categoría no válida'),
  
  body('stock')
    .isInt({ min: 0, max: 10000 })
    .withMessage('El stock debe ser un número entero entre 0 y 10000'),
  
  body('seccion')
    .optional()
    .isIn(['productos', 'mas-lanzamientos', 'nuevo-lanzamiento', 'artesanias'])
    .withMessage('Sección no válida'),
  
  body('especificaciones.material')
    .optional()
    .isLength({ max: 200 })
    .withMessage('Material no puede exceder 200 caracteres'),
  
  body('especificaciones.peso')
    .optional()
    .matches(/^[0-9]+(\.[0-9]+)?\s*(g|kg|oz)$/)
    .withMessage('Formato de peso inválido (ej: 10.5g)'),
  
  sanitizeInput,
  handleValidationErrors
];

// Validaciones para autenticación
const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email inválido'),
  
  body('password')
    .isLength({ min: 8, max: 128 })
    .withMessage('La contraseña debe tener entre 8 y 128 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('La contraseña debe contener al menos: 1 minúscula, 1 mayúscula, 1 número y 1 carácter especial'),
  
  sanitizeInput,
  handleValidationErrors
];

// Validación de ObjectId de MongoDB
const validateObjectId = (paramName = 'id') => [
  param(paramName)
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error('ID inválido');
      }
      return true;
    }),
  handleValidationErrors
];

// Validaciones para contacto
const validateContact = [
  body('nombre')
    .isLength({ min: 2, max: 50 })
    .withMessage('El nombre debe tener entre 2 y 50 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .withMessage('El nombre solo puede contener letras y espacios'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email inválido'),
  
  body('telefono')
    .optional()
    .matches(/^[+]?[0-9\s\-\(\)]{7,15}$/)
    .withMessage('Formato de teléfono inválido'),
  
  body('mensaje')
    .isLength({ min: 10, max: 1000 })
    .withMessage('El mensaje debe tener entre 10 y 1000 caracteres'),
  
  sanitizeInput,
  handleValidationErrors
];

// Rate limiting específico por endpoint
const createRateLimit = (windowMs, max, message) => {
  const rateLimit = require('express-rate-limit');
  return rateLimit({
    windowMs,
    max,
    message: { error: message },
    standardHeaders: true,
    legacyHeaders: false
  });
};

module.exports = {
  validateProduct,
  validateLogin,
  validateObjectId,
  validateContact,
  sanitizeInput,
  handleValidationErrors,
  createRateLimit
};