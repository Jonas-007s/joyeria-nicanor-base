const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

// Importar canvas si está disponible, si no, crear placeholder
try {
  const canvas = createCanvas(400, 500);
  const ctx = canvas.getContext('2d');
  
  const products = [
    { name: 'anillo-oro-1.jpg', title: 'Anillo de Oro', color: '#FFD700' },
    { name: 'anillo-oro-2.jpg', title: 'Anillo de Oro 2', color: '#DAA520' },
    { name: 'collar-perlas-1.jpg', title: 'Collar de Perlas', color: '#F0E68C' },
    { name: 'aretes-esmeralda-1.jpg', title: 'Aretes Esmeralda', color: '#50C878' },
    { name: 'pulsera-artesanal-1.jpg', title: 'Pulsera Artesanal', color: '#C0C0C0' },
    { name: 'reloj-lujo-1.jpg', title: 'Reloj de Lujo', color: '#4A4A4A' }
  ];
  
  const uploadsDir = path.join(__dirname, 'uploads');
  
  products.forEach(product => {
    // Dibujar fondo
    ctx.fillStyle = product.color;
    ctx.fillRect(0, 0, 400, 500);
    
    // Dibujar texto
    ctx.fillStyle = '#000';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(product.title, 200, 250);
    
    // Guardar imagen
    const buffer = canvas.toBuffer('image/jpeg');
    const filePath = path.join(uploadsDir, product.name);
    fs.writeFileSync(filePath, buffer);
    console.log('? Creado:', product.name);
  });
} catch (e) {
  console.log('Canvas no disponible, usando imágenes placeholder');
}
