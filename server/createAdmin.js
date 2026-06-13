const mongoose = require('mongoose');
const User = require('./models/User');
const crypto = require('crypto');
require('dotenv').config();

// Función para generar contraseña segura
function generateSecurePassword(length = 16) {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
}

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@joyeria-nicanor.com';
    const existingAdmin = await User.findOne({ email: adminEmail });
    
    if (existingAdmin) {
      console.log('❌ Usuario admin ya existe');
      console.log('📧 Email:', adminEmail);
      console.log('🔑 Usa la contraseña configurada en las variables de entorno');
      return;
    }
    
    // Usar contraseña de variable de entorno o generar una segura
    const adminPassword = process.env.ADMIN_DEFAULT_PASSWORD || generateSecurePassword(20);
    
    const admin = new User({
      email: adminEmail,
      password: adminPassword,
      name: 'Administrador',
      role: 'admin'
    });
    
    await admin.save();
    console.log('✅ Usuario admin creado exitosamente');
    console.log('📧 Email:', adminEmail);
    
    // Solo mostrar contraseña si fue generada automáticamente
    if (!process.env.ADMIN_DEFAULT_PASSWORD) {
      console.log('🔑 Contraseña generada:', adminPassword);
      console.log('⚠️  IMPORTANTE: Guarda esta contraseña en un lugar seguro');
      console.log('💡 Recomendación: Añade ADMIN_DEFAULT_PASSWORD a tu archivo .env');
    } else {
      console.log('🔑 Usando contraseña de variables de entorno');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    mongoose.disconnect();
  }
}

createAdmin();