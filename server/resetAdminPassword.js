const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

async function run() {
  try {
    if (!process.env.MONGODB_URI) {
      console.error('Falta MONGODB_URI en el .env');
      process.exit(1);
    }
    await mongoose.connect(process.env.MONGODB_URI);

    const email = process.env.ADMIN_EMAIL || 'admin@joyeria-nicanor.com';
    const newPassword = process.env.ADMIN_DEFAULT_PASSWORD;
    if (!newPassword) {
      console.error('Define ADMIN_DEFAULT_PASSWORD en server/.env para continuar');
      process.exit(1);
    }

    const admin = await User.findOne({ email });
    if (!admin) {
      console.error(`No existe usuario con email ${email}`);
      process.exit(1);
    }

    admin.password = newPassword; // el pre('save') hará el hash
    await admin.save();

    console.log('✅ Contraseña de admin actualizada');
    console.log('📧 Email:', email);
  } catch (err) {
    console.error('❌ Error:', err);
  } finally {
    await mongoose.disconnect();
  }
}

run();