require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

(async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error('MONGODB_URI no está definido en .env');

    await mongoose.connect(uri);
    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail) throw new Error('ADMIN_EMAIL no está definido en .env');

    const admins = await User.find({ role: 'admin' });
    console.log(`Admins encontrados: ${admins.map(a => a.email).join(', ') || '(ninguno)'}`);

    let changed = 0;
    for (const admin of admins) {
      if (admin.email !== adminEmail) {
        admin.role = 'user';
        await admin.save();
        changed++;
        console.log(`Degradado a user: ${admin.email}`);
      }
    }

    console.log(`Listo. Admin principal: ${adminEmail}. Degradados: ${changed}`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
})();