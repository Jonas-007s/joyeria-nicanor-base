const mongoose = require('mongoose');
const Product = require('./models/Product');
const User = require('./models/User');
require('dotenv').config();

const sampleProducts = [
  {
    nombre: "Anillo de Oro 18k",
    precio: 1250000,
    descripcion: "Elegante anillo de oro 18 quilates con diseño clásico",
    categoria: "anillos",
    stock: 15,
    imagenes: ["/uploads/anillo-oro-1.jpg", "/uploads/anillo-oro-2.jpg"],
    especificaciones: {
      material: "Oro 18k",
      peso: "3.5g",
      dimensiones: "2cm x 1.5cm",
      tallas: "6, 7, 8, 9, 10"
    },
    infoAdicional: {
      instrucciones: "Limpiar con paño suave",
      garantia: "1 año",
      origen: "Colombia",
      tiempoEntrega: "3-5 días hábiles"
    },
    seccion: "productos"
  },
  {
    nombre: "Collar de Perlas Naturales",
    precio: 850000,
    descripcion: "Hermoso collar de perlas naturales cultivadas",
    categoria: "collares",
    stock: 8,
    imagenes: ["/uploads/collar-perlas-1.jpg"],
    especificaciones: {
      material: "Perlas naturales, oro 14k",
      peso: "25g",
      dimensiones: "45cm de largo",
      tallas: "Único"
    },
    infoAdicional: {
      instrucciones: "Evitar contacto con perfumes",
      garantia: "6 meses",
      origen: "Colombia",
      tiempoEntrega: "2-4 días hábiles"
    },
    seccion: "productos"
  },
  {
    nombre: "Aretes de Esmeralda",
    precio: 2100000,
    descripcion: "Exclusivos aretes con esmeraldas colombianas",
    categoria: "aretes",
    stock: 5,
    imagenes: ["/uploads/aretes-esmeralda-1.jpg"],
    especificaciones: {
      material: "Esmeralda, oro 18k",
      peso: "4.2g",
      dimensiones: "1.5cm x 1cm",
      tallas: "Único"
    },
    infoAdicional: {
      instrucciones: "Guardar en estuche",
      garantia: "2 años",
      origen: "Colombia",
      tiempoEntrega: "5-7 días hábiles"
    },
    lanzamiento: {
      esLanzamiento: true,
      fecha: new Date(),
      descripcion: "Nueva colección de esmeraldas",
      preview: 95
    },
    seccion: "nuevo-lanzamiento"
  },
  {
    nombre: "Pulsera Artesanal",
    precio: 320000,
    descripcion: "Pulsera tejida a mano con técnicas tradicionales",
    categoria: "pulseras",
    stock: 12,
    imagenes: ["/uploads/pulsera-artesanal-1.jpg"],
    especificaciones: {
      material: "Plata 925, hilo artesanal",
      peso: "15g",
      dimensiones: "18cm ajustable",
      tallas: "Ajustable"
    },
    infoAdicional: {
      instrucciones: "Evitar humedad excesiva",
      garantia: "6 meses",
      origen: "Colombia",
      tiempoEntrega: "1-3 días hábiles"
    },
    seccion: "artesanias"
  },
  {
    nombre: "Reloj de Lujo",
    precio: 3500000,
    descripcion: "Reloj suizo de alta gama con caja de oro",
    categoria: "relojes",
    stock: 3,
    imagenes: ["/uploads/reloj-lujo-1.jpg"],
    especificaciones: {
      material: "Oro 18k, cristal de zafiro",
      peso: "120g",
      dimensiones: "42mm diámetro",
      tallas: "Ajustable"
    },
    infoAdicional: {
      instrucciones: "Servicio técnico especializado",
      garantia: "3 años",
      origen: "Suiza",
      tiempoEntrega: "7-10 días hábiles"
    },
    seccion: "mas-lanzamientos"
  }
];

const seedDatabase = async () => {
  try {
    console.log('🌱 Iniciando población de base de datos...');
    
    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('✅ Conectado a MongoDB');
    
    // Limpiar datos existentes
    await Product.deleteMany({});
    console.log('🗑️ Productos existentes eliminados');
    
    // Insertar productos de muestra
    const insertedProducts = await Product.insertMany(sampleProducts);
    console.log(`✅ ${insertedProducts.length} productos insertados`);
    
    // Verificar usuario admin
    const adminExists = await User.findOne({ email: process.env.ADMIN_EMAIL });
    if (!adminExists) {
      const adminUser = new User({
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_DEFAULT_PASSWORD,
        name: 'Administrador',
        role: 'admin'
      });
      await adminUser.save();
      console.log('✅ Usuario administrador creado');
    } else {
      console.log('ℹ️ Usuario administrador ya existe');
    }
    
    console.log('🎉 Base de datos poblada exitosamente');
    
    // Mostrar resumen
    const productCount = await Product.countDocuments();
    const userCount = await User.countDocuments();
    
    console.log('\n📊 RESUMEN:');
    console.log(`   Productos: ${productCount}`);
    console.log(`   Usuarios: ${userCount}`);
    console.log('\n🚀 Listo para usar!');
    
  } catch (error) {
    console.error('❌ Error al poblar base de datos:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Conexión cerrada');
    process.exit(0);
  }
};

// Ejecutar si se llama directamente
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;