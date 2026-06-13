const mongoose = require('mongoose');

const configSchema = new mongoose.Schema({
  nombreJoyeria: { type: String, default: 'Joyería Nicanor' },
  logo: { type: String, default: '' },
  whatsappNumber: { type: String, default: '+56912345678' },
  emailReceptor: { type: String, default: '' },
  redes: {
    instagram: { type: String, default: '' },
    facebook: { type: String, default: '' },
    tiktok: { type: String, default: '' }
  },
  textos: {
    slogan: { type: String, default: 'Joyería artesanal de alta calidad' },
    bannerTop: { type: String, default: '✨ Solicita tu cotización sin compromiso ✨' }
  }
}, { timestamps: true });

module.exports = mongoose.model('Config', configSchema);
