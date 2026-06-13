const cloudinary = require('cloudinary').v2;

// 1. Configure Cloudinary
cloudinary.config({
  cloud_name: 'driiu49kq', // ← replace this (YOUR_CLOUD_NAME) if changed
  api_key: '123475329727642', // ← replace this (YOUR_API_KEY) if changed
  api_secret: '_y_yA_2PiwN4R9QaiqGEIJK-k7s' // ← replace this (YOUR_API_SECRET) if changed
});

async function runCloudinaryDemo() {
  try {
    console.log("Iniciando prueba de Cloudinary...");

    // 2. Upload an image
    const sampleImageUrl = 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg';
    console.log("Subiendo imagen de muestra...");
    const uploadResult = await cloudinary.uploader.upload(sampleImageUrl, {
      public_id: 'sample_uploaded_test'
    });
    
    console.log("--- RESULTADOS DE SUBIDA ---");
    console.log("Secure URL:", uploadResult.secure_url);
    console.log("Public ID:", uploadResult.public_id);

    // 3. Get image details
    console.log("\n--- DETALLES DE LA IMAGEN ---");
    console.log("Ancho (Width):", uploadResult.width);
    console.log("Alto (Height):", uploadResult.height);
    console.log("Formato (Format):", uploadResult.format);
    console.log("Tamaño (Bytes):", uploadResult.bytes);

    // 4. Transform the image
    // Generate a transformed URL.
    // f_auto: Automatically converts the image to the most efficient format for the requesting browser (e.g., WebP/AVIF).
    // q_auto: Automatically adjusts the compression quality to reduce file size without visible degradation.
    const transformedUrl = cloudinary.url(uploadResult.public_id, {
      fetch_format: 'auto',
      quality: 'auto'
    });

    console.log("\n--- IMAGEN TRANSFORMADA OPTIMIZADA ---");
    console.log("Done! Click link below to see optimized version of the image. Check the size and the format.");
    console.log(transformedUrl);

  } catch (error) {
    console.error("Error en Cloudinary:", error);
  }
}

runCloudinaryDemo();
