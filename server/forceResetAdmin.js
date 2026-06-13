const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function forceReset() {
    try {
        console.log('🔌 Conectando a MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);

        const email = 'admin@joyeria-nicanor.com';
        const newPassword = 'JoyeriaNicanor2025!Admin#Secure';

        // 1. Buscar usuario
        let user = await User.findOne({ email });

        if (!user) {
            console.log('👤 Usuario no encontrado. Creando uno nuevo...');
            user = new User({
                email,
                name: 'Administrador',
                role: 'admin',
                password: newPassword
            });
        } else {
            console.log('👤 Usuario encontrado. Actualizando contraseña...');
            user.password = newPassword; // El hook pre-save hasheará esto
        }

        // 2. Guardar (dispara el hook de hash)
        await user.save();
        console.log('💾 Usuario guardado.');

        // 3. Verificar login
        console.log('🕵️ Verificando login...');
        const savedUser = await User.findOne({ email });
        const isMatch = await bcrypt.compare(newPassword, savedUser.password);

        if (isMatch) {
            console.log('✅ LOGIN EXITOSO: La contraseña funciona correctamente en la base de datos.');
            console.log('📧 Email:', email);
            console.log('🔑 Password:', newPassword);
        } else {
            console.error('❌ LOGIN FALLIDO: Algo salió mal con el hasheo.');
        }

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

forceReset();
