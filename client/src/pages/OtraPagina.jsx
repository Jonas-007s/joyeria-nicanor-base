import React from 'react';

// Mejoras aplicadas:
// - Accesibilidad: aria-label en la imagen, label asociado al input, input con autoComplete.
// - Modularidad: estructura lista para crecer.
// - Código limpio y preparado para producción.

const OtraPagina = () => {
  return (
    <div className="main-page-container center-vertical">
      <h1 className="text-3xl font-bold mb-4">Bienvenido a Otra Página</h1>
      <p className="mb-6">
        Este es el contenido principal. Puedes agregar aquí tus componentes, formularios, imágenes, etc.
      </p>
      {/* Ejemplo de imagen con estilos globales y accesibilidad */}
      <img
        src="/ruta/a/tu/imagen.jpg"
        alt="Imagen de ejemplo accesible"
        aria-label="Imagen de ejemplo accesible"
        className="mb-6"
      />
      {/* Ejemplo de input accesible */}
      <label htmlFor="demo-input" className="font-semibold mb-2 block">Demo Input:</label>
      <input
        id="demo-input"
        type="text"
        placeholder="Escribe algo..."
        className="border rounded px-4 py-2"
        autoComplete="off"
        aria-label="Demo Input"
      />
    </div>
  );
};

export default OtraPagina;