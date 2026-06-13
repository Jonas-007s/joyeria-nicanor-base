const jwt = require('jsonwebtoken');

/**
 * Middleware: Verifica el token JWT en el header Authorization
 */
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token de acceso requerido' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token inválido o expirado' });
    }
    req.user = user;
    next();
  });
};

/**
 * Middleware: Requiere rol de administrador
 */
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Acceso restringido a administradores' });
  }
  next();
};

// Alias para compatibilidad con código anterior
const authenticateToken = verifyToken;

module.exports = { verifyToken, requireAdmin, authenticateToken };
