const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🚀 Iniciando Joyería Nicanor - Desarrollo');
console.log('=' .repeat(50));

// Verificar archivos .env
const serverEnv = path.join(__dirname, 'server', '.env');
const clientEnv = path.join(__dirname, 'client', '.env');

if (!fs.existsSync(serverEnv)) {
  console.error('❌ Archivo server/.env no encontrado');
  console.log('📝 Copia server/.env.example a server/.env y configura las variables');
  process.exit(1);
}

if (!fs.existsSync(clientEnv)) {
  console.error('❌ Archivo client/.env no encontrado');
  console.log('📝 Crea client/.env con: VITE_API_URL=http://localhost:5000');
  process.exit(1);
}

// Función para ejecutar comandos
const runCommand = (command, args, cwd, name) => {
  return new Promise((resolve, reject) => {
    const process = spawn(command, args, {
      cwd,
      stdio: 'pipe',
      shell: true
    });

    process.stdout.on('data', (data) => {
      console.log(`[${name}] ${data.toString().trim()}`);
    });

    process.stderr.on('data', (data) => {
      console.error(`[${name}] ${data.toString().trim()}`);
    });

    process.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`${name} falló con código ${code}`));
      }
    });
  });
};

// Función principal
const start = async () => {
  try {
    console.log('📦 Instalando dependencias del servidor...');
    await runCommand('npm', ['install'], path.join(__dirname, 'server'), 'SERVER-INSTALL');
    
    console.log('📦 Instalando dependencias del cliente...');
    await runCommand('npm', ['install'], path.join(__dirname, 'client'), 'CLIENT-INSTALL');
    
    console.log('🌱 Poblando base de datos...');
    await runCommand('npm', ['run', 'seed'], path.join(__dirname, 'server'), 'SEED');
    
    console.log('\n✅ Configuración completada!');
    console.log('\n🚀 Iniciando servidores...');
    console.log('   Backend: http://localhost:5000');
    console.log('   Frontend: http://localhost:3000');
    console.log('\n📊 Para monitorear:');
    console.log('   Health Check: http://localhost:5000/api/health');
    console.log('\n⏹️  Presiona Ctrl+C para detener\n');
    
    // Iniciar backend
    const backendProcess = spawn('npm', ['run', 'dev'], {
      cwd: path.join(__dirname, 'server'),
      stdio: 'pipe',
      shell: true
    });
    
    // Iniciar frontend después de 3 segundos
    setTimeout(() => {
      const frontendProcess = spawn('npm', ['run', 'dev'], {
        cwd: path.join(__dirname, 'client'),
        stdio: 'pipe',
        shell: true
      });
      
      frontendProcess.stdout.on('data', (data) => {
        console.log(`[FRONTEND] ${data.toString().trim()}`);
      });
      
      frontendProcess.stderr.on('data', (data) => {
        console.error(`[FRONTEND] ${data.toString().trim()}`);
      });
    }, 3000);
    
    backendProcess.stdout.on('data', (data) => {
      console.log(`[BACKEND] ${data.toString().trim()}`);
    });
    
    backendProcess.stderr.on('data', (data) => {
      console.error(`[BACKEND] ${data.toString().trim()}`);
    });
    
    // Manejo de cierre
    process.on('SIGINT', () => {
      console.log('\n🛑 Cerrando servidores...');
      backendProcess.kill();
      process.exit(0);
    });
    
  } catch (error) {
    console.error('❌ Error durante la inicialización:', error.message);
    process.exit(1);
  }
};

start();