const mongoose = require('mongoose');
require('dotenv').config();

async function testConnection() {
  try {
    console.log('🔍 Probando conexión a MongoDB...');
    console.log('URI:', process.env.MONGODB_URI?.replace(/\/\/.*:.*@/, '//***:***@'));
    
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      family: 4
    });
    
    console.log('✅ Conexión exitosa a MongoDB');
    console.log('📊 Estado:', mongoose.connection.readyState);
    console.log('🗄️ Base de datos:', mongoose.connection.db.databaseName);
    
    // Probar operación básica
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📁 Colecciones:', collections.map(c => c.name));
    
  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
    if (error.code === 'ETIMEDOUT') {
      console.log('🔧 Posibles soluciones:');
      console.log('1. Verificar IP whitelist en MongoDB Atlas');
      console.log('2. Verificar firewall local');
      console.log('3. Verificar credenciales');
    }
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

testConnection();