const nodemailer = require('nodemailer');
const Config = require('../models/Config');

/**
 * Crea transporter de Nodemailer usando credenciales del .env
 */
function crearTransporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
}

/**
 * Envía email al dueño de la joyería con los detalles de la solicitud
 * @param {Object} solicitud - Objeto Mongoose de la solicitud guardada
 */
async function enviarEmailSolicitud(solicitud) {
  let emailReceptor = process.env.EMAIL_RECEPTOR;
  try {
    const config = await Config.findOne();
    if (config && config.emailReceptor) {
      emailReceptor = config.emailReceptor;
    }
  } catch (err) {
    console.error('Error al obtener config en emailService:', err.message);
  }

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || !emailReceptor) {
    console.warn('⚠️  EMAIL no configurado. Saltando envío de correo.');
    return;
  }

  const transporter = crearTransporter();
  const { numeroOrden, cliente, productos, comentarios, fecha } = solicitud;

  const fechaFormateada = new Date(fecha).toLocaleDateString('es-CL', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });

  const productosHTML = productos.map(p => `
    <tr>
      <td style="padding:12px 16px;border-bottom:1px solid #f0f0f0;">
        ${p.imagen ? `<img src="${p.imagen}" style="width:50px;height:50px;object-fit:cover;border-radius:6px;" />` : ''}
      </td>
      <td style="padding:12px 16px;border-bottom:1px solid #f0f0f0;font-weight:600;color:#1a1a1a;">${p.nombre}</td>
      <td style="padding:12px 16px;border-bottom:1px solid #f0f0f0;color:#666;">${p.sku || '—'}</td>
      <td style="padding:12px 16px;border-bottom:1px solid #f0f0f0;color:#666;">${p.material || '—'}</td>
      <td style="padding:12px 16px;border-bottom:1px solid #f0f0f0;text-align:center;font-weight:700;color:#C9A84C;">${p.cantidad}</td>
    </tr>
  `).join('');

  const html = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nueva Solicitud de Compra</title>
</head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:'Segoe UI',Arial,sans-serif;">
  <div style="max-width:640px;margin:40px auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
    
    <!-- Header -->
    <div style="background:#0a0a0a;padding:36px 40px;text-align:center;">
      <h1 style="color:#ffffff;font-size:24px;font-weight:300;letter-spacing:4px;margin:0;text-transform:uppercase;">JOYERÍA NICANOR</h1>
      <div style="width:60px;height:1px;background:#C9A84C;margin:16px auto 0;"></div>
      <p style="color:#C9A84C;font-size:12px;letter-spacing:3px;text-transform:uppercase;margin:12px 0 0;">Nueva Solicitud de Compra</p>
    </div>

    <!-- Orden Badge -->
    <div style="background:#fafafa;border-bottom:1px solid #f0f0f0;padding:20px 40px;text-align:center;">
      <span style="font-size:13px;color:#888;letter-spacing:2px;text-transform:uppercase;">Número de Orden</span>
      <h2 style="font-size:28px;font-weight:700;color:#0a0a0a;margin:8px 0;letter-spacing:2px;">${numeroOrden}</h2>
      <span style="font-size:12px;color:#888;">${fechaFormateada}</span>
    </div>

    <!-- Datos Cliente -->
    <div style="padding:32px 40px;border-bottom:1px solid #f0f0f0;">
      <h3 style="font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#C9A84C;margin:0 0 20px;">Datos del Cliente</h3>
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:8px 0;color:#888;font-size:13px;width:140px;">Nombre</td>
          <td style="padding:8px 0;color:#1a1a1a;font-weight:600;font-size:13px;">${cliente.nombre}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;color:#888;font-size:13px;">Teléfono</td>
          <td style="padding:8px 0;color:#1a1a1a;font-weight:600;font-size:13px;">${cliente.telefono}</td>
        </tr>
        ${cliente.correo ? `<tr><td style="padding:8px 0;color:#888;font-size:13px;">Correo</td><td style="padding:8px 0;color:#1a1a1a;font-weight:600;font-size:13px;">${cliente.correo}</td></tr>` : ''}
        ${cliente.ciudad ? `<tr><td style="padding:8px 0;color:#888;font-size:13px;">Ciudad</td><td style="padding:8px 0;color:#1a1a1a;font-weight:600;font-size:13px;">${cliente.ciudad}</td></tr>` : ''}
      </table>
    </div>

    <!-- Productos -->
    <div style="padding:32px 40px;border-bottom:1px solid #f0f0f0;">
      <h3 style="font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#C9A84C;margin:0 0 20px;">Productos Solicitados</h3>
      <table style="width:100%;border-collapse:collapse;">
        <thead>
          <tr style="background:#fafafa;">
            <th style="padding:10px 16px;text-align:left;font-size:11px;letter-spacing:1px;color:#888;text-transform:uppercase;border-bottom:2px solid #f0f0f0;"></th>
            <th style="padding:10px 16px;text-align:left;font-size:11px;letter-spacing:1px;color:#888;text-transform:uppercase;border-bottom:2px solid #f0f0f0;">Producto</th>
            <th style="padding:10px 16px;text-align:left;font-size:11px;letter-spacing:1px;color:#888;text-transform:uppercase;border-bottom:2px solid #f0f0f0;">SKU</th>
            <th style="padding:10px 16px;text-align:left;font-size:11px;letter-spacing:1px;color:#888;text-transform:uppercase;border-bottom:2px solid #f0f0f0;">Material</th>
            <th style="padding:10px 16px;text-align:center;font-size:11px;letter-spacing:1px;color:#888;text-transform:uppercase;border-bottom:2px solid #f0f0f0;">Cant.</th>
          </tr>
        </thead>
        <tbody>${productosHTML}</tbody>
      </table>
    </div>

    ${comentarios ? `
    <!-- Comentarios -->
    <div style="padding:32px 40px;border-bottom:1px solid #f0f0f0;">
      <h3 style="font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#C9A84C;margin:0 0 12px;">Comentarios del Cliente</h3>
      <p style="color:#444;font-size:14px;line-height:1.7;margin:0;background:#fafafa;padding:16px;border-radius:8px;border-left:3px solid #C9A84C;">${comentarios}</p>
    </div>
    ` : ''}

    <!-- CTA -->
    <div style="padding:32px 40px;text-align:center;">
      <p style="color:#888;font-size:13px;margin:0 0 20px;">Responde esta solicitud a la brevedad para no perder la oportunidad de venta.</p>
      <a href="https://wa.me/${config ? config.whatsappNumber : (process.env.WHATSAPP_NUMBER || '')}?text=Hola+${encodeURIComponent(cliente.nombre)}%2C+te+contactamos+por+tu+solicitud+${encodeURIComponent(numeroOrden)}"
         style="display:inline-block;background:#25D366;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:50px;font-weight:700;font-size:13px;letter-spacing:1px;">
        📱 Responder por WhatsApp
      </a>
    </div>

    <!-- Footer -->
    <div style="background:#0a0a0a;padding:20px 40px;text-align:center;">
      <p style="color:#666;font-size:11px;margin:0;letter-spacing:1px;">© ${new Date().getFullYear()} Joyería Nicanor · Sistema de Pedidos</p>
    </div>
  </div>
</body>
</html>
  `;

  const mailOptions = {
    from: `"Joyería Nicanor" <${process.env.EMAIL_USER}>`,
    to: emailReceptor,
    subject: `Nueva Solicitud de Compra — ${numeroOrden}`,
    html
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email enviado para solicitud ${numeroOrden}`);
  } catch (err) {
    console.error('❌ Error al enviar email:', err.message);
    // No lanzar error — la solicitud ya fue guardada, el email es secundario
  }
}

/**
 * Envía email cuando alguien completa el formulario de contacto
 * @param {Object} contacto - Objeto Mongoose del contacto guardado
 */
async function enviarNotificacionContacto(contacto) {
  let emailReceptor = process.env.EMAIL_RECEPTOR;
  try {
    const config = await Config.findOne();
    if (config && config.emailReceptor) {
      emailReceptor = config.emailReceptor;
    }
  } catch (err) {
    console.error('Error al obtener config en emailService:', err.message);
  }

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || !emailReceptor) {
    console.warn('⚠️  EMAIL no configurado. Saltando envío de correo de contacto.');
    return;
  }

  const transporter = crearTransporter();
  const { nombre, email, telefono, mensaje, fecha } = contacto;

  const fechaFormateada = new Date(fecha).toLocaleDateString('es-CL', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });

  const html = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nuevo Mensaje de Contacto</title>
</head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:'Segoe UI',Arial,sans-serif;">
  <div style="max-width:640px;margin:40px auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
    
    <!-- Header -->
    <div style="background:#0a0a0a;padding:36px 40px;text-align:center;">
      <h1 style="color:#ffffff;font-size:24px;font-weight:300;letter-spacing:4px;margin:0;text-transform:uppercase;">JOYERÍA NICANOR</h1>
      <div style="width:60px;height:1px;background:#C9A84C;margin:16px auto 0;"></div>
      <p style="color:#C9A84C;font-size:12px;letter-spacing:3px;text-transform:uppercase;margin:12px 0 0;">Nuevo Mensaje de Contacto</p>
    </div>

    <!-- Datos Contacto -->
    <div style="padding:32px 40px;border-bottom:1px solid #f0f0f0;">
      <h3 style="font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#C9A84C;margin:0 0 20px;">Datos del Contacto</h3>
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:8px 0;color:#888;font-size:13px;width:140px;">Nombre</td>
          <td style="padding:8px 0;color:#1a1a1a;font-weight:600;font-size:13px;">${nombre}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;color:#888;font-size:13px;">Email</td>
          <td style="padding:8px 0;color:#1a1a1a;font-weight:600;font-size:13px;">${email}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;color:#888;font-size:13px;">Teléfono</td>
          <td style="padding:8px 0;color:#1a1a1a;font-weight:600;font-size:13px;">${telefono}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;color:#888;font-size:13px;">Fecha</td>
          <td style="padding:8px 0;color:#1a1a1a;font-weight:600;font-size:13px;">${fechaFormateada}</td>
        </tr>
      </table>
    </div>

    <!-- Mensaje -->
    <div style="padding:32px 40px;">
      <h3 style="font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#C9A84C;margin:0 0 12px;">Mensaje</h3>
      <p style="color:#444;font-size:14px;line-height:1.7;margin:0;background:#fafafa;padding:16px;border-radius:8px;border-left:3px solid #C9A84C;">${mensaje}</p>
    </div>

    <!-- Footer -->
    <div style="background:#0a0a0a;padding:20px 40px;text-align:center;">
      <p style="color:#666;font-size:11px;margin:0;letter-spacing:1px;">© ${new Date().getFullYear()} Joyería Nicanor</p>
    </div>
  </div>
</body>
</html>
  `;

  const mailOptions = {
    from: `"Joyería Nicanor Web" <${process.env.EMAIL_USER}>`,
    to: emailReceptor,
    subject: `Nuevo Mensaje de Contacto — ${nombre}`,
    html
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email de contacto enviado de ${nombre}`);
  } catch (err) {
    console.error('❌ Error al enviar email de contacto:', err.message);
  }
}

module.exports = { enviarEmailSolicitud, enviarNotificacionContacto };