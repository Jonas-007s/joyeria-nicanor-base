import React, { useState } from 'react';

// Mejora: accesibilidad, validación, modularidad y seguridad básica
function ProductoForm() {
  const [form, setForm] = useState({
    nombre: '',
    precio: '',
    descripcion: '',
    categoria: '',
    stock: 1,
    material: '',
    peso: '',
    dimensiones: '',
    tallas: '',
    instrucciones: '',
    garantia: '',
    origen: '',
    tiempoEntrega: '',
    imagenes: [],
    esLanzamiento: false,
    fechaLanzamiento: '',
    descripcionLanzamiento: '',
    preview: 3,
  });
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');

  // Sanitización básica para evitar inyecciones simples
  const sanitize = value =>
    typeof value === 'string' ? value.replace(/[<>]/g, '') : value;

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({
      ...f,
      [name]: type === 'checkbox' ? checked : sanitize(value)
    }));
  };

  const handleFileChange = e => {
    setForm(f => ({
      ...f,
      imagenes: Array.from(e.target.files)
    }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    setError('');
    setMensaje('');
    // Validación básica
    if (!form.nombre || !form.precio || !form.descripcion || !form.categoria) {
      setError('Por favor, completa todos los campos obligatorios.');
      return;
    }
    // Aquí va la lógica para enviar el producto al backend
    setMensaje('Producto guardado correctamente (simulado)');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-lg shadow p-8 max-w-4xl mx-auto mt-8"
      aria-label="Formulario para agregar producto"
    >
      <h2 className="text-2xl font-bold mb-6">Agregar Nuevo Producto</h2>
      <div className="flex gap-4 mb-6" role="tablist" aria-label="Tipo de producto">
        <button
          type="button"
          className={`flex-1 py-2 rounded ${!form.esLanzamiento ? 'bg-black text-white' : 'bg-gray-100'}`}
          onClick={() => setForm(f => ({ ...f, esLanzamiento: false }))}
          aria-selected={!form.esLanzamiento}
          aria-label="Producto Normal"
        >
          Producto Normal
        </button>
        <button
          type="button"
          className={`flex-1 py-2 rounded ${form.esLanzamiento ? 'bg-black text-white' : 'bg-gray-100'}`}
          onClick={() => setForm(f => ({ ...f, esLanzamiento: true }))}
          aria-selected={form.esLanzamiento}
          aria-label="Producto de Lanzamiento"
        >
          Producto de Lanzamiento
        </button>
      </div>
      {form.esLanzamiento && (
        <div className="bg-yellow-100 p-4 rounded mb-6">
          <label className="block mb-2 font-semibold" htmlFor="fechaLanzamiento">Fecha de Lanzamiento</label>
          <input
            type="date"
            name="fechaLanzamiento"
            id="fechaLanzamiento"
            value={form.fechaLanzamiento}
            onChange={handleChange}
            className="mb-2 w-full border rounded p-2"
            required={form.esLanzamiento}
          />
          <label className="block mb-2 font-semibold" htmlFor="preview">Productos a Mostrar en Preview</label>
          <input
            type="number"
            name="preview"
            id="preview"
            value={form.preview}
            onChange={handleChange}
            className="mb-2 w-full border rounded p-2"
            min={1}
            max={10}
            required={form.esLanzamiento}
          />
          <label className="block mb-2 font-semibold" htmlFor="descripcionLanzamiento">Descripción del Lanzamiento</label>
          <textarea
            name="descripcionLanzamiento"
            id="descripcionLanzamiento"
            value={form.descripcionLanzamiento}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required={form.esLanzamiento}
          />
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block font-semibold" htmlFor="nombre">Nombre del Producto *</label>
          <input name="nombre" id="nombre" value={form.nombre} onChange={handleChange} className="w-full border rounded p-2" required aria-required="true" />
        </div>
        <div>
          <label className="block font-semibold" htmlFor="precio">Precio (CLP) *</label>
          <input name="precio" id="precio" type="number" value={form.precio} onChange={handleChange} className="w-full border rounded p-2" required aria-required="true" min={0} />
        </div>
        <div className="md:col-span-2">
          <label className="block font-semibold" htmlFor="descripcion">Descripción Completa *</label>
          <textarea name="descripcion" id="descripcion" value={form.descripcion} onChange={handleChange} className="w-full border rounded p-2" required aria-required="true" />
        </div>
        <div>
          <label className="block font-semibold" htmlFor="categoria">Categoría *</label>
          <select name="categoria" id="categoria" value={form.categoria} onChange={handleChange} className="w-full border rounded p-2" required aria-required="true">
            <option value="">Seleccionar categoría</option>
            <option value="anillos">Anillos</option>
            <option value="collares">Collares</option>
            <option value="pulseras">Pulseras</option>
            {/* Agrega más categorías si es necesario */}
          </select>
        </div>
        <div>
          <label className="block font-semibold" htmlFor="stock">Stock Inicial *</label>
          <input name="stock" id="stock" type="number" value={form.stock} onChange={handleChange} className="w-full border rounded p-2" required aria-required="true" min={1} />
        </div>
      </div>
      <div className="mb-6">
        <h3 className="font-bold mb-2">Especificaciones Técnicas</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input name="material" placeholder="Material" value={form.material} onChange={handleChange} className="border rounded p-2" aria-label="Material" />
          <input name="peso" placeholder="Peso" value={form.peso} onChange={handleChange} className="border rounded p-2" aria-label="Peso" />
          <input name="dimensiones" placeholder="Dimensiones" value={form.dimensiones} onChange={handleChange} className="border rounded p-2" aria-label="Dimensiones" />
          <input name="tallas" placeholder="Tallas/Medidas Disponibles" value={form.tallas} onChange={handleChange} className="border rounded p-2" aria-label="Tallas/Medidas Disponibles" />
        </div>
      </div>
      <div className="mb-6">
        <h3 className="font-bold mb-2">Información Adicional</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input name="instrucciones" placeholder="Instrucciones de Cuidado" value={form.instrucciones} onChange={handleChange} className="border rounded p-2" aria-label="Instrucciones de Cuidado" />
          <input name="garantia" placeholder="Garantía" value={form.garantia} onChange={handleChange} className="border rounded p-2" aria-label="Garantía" />
          <input name="origen" placeholder="Origen/Fabricación" value={form.origen} onChange={handleChange} className="border rounded p-2" aria-label="Origen/Fabricación" />
          <input name="tiempoEntrega" placeholder="Tiempo de Entrega" value={form.tiempoEntrega} onChange={handleChange} className="border rounded p-2" aria-label="Tiempo de Entrega" />
        </div>
      </div>
      <div className="mb-6">
        <h3 className="font-bold mb-2">Imágenes del Producto</h3>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          className="w-full border rounded p-2"
          aria-label="Imágenes del producto"
        />
        <div className="text-gray-500 text-sm mt-2">Formatos: JPG, PNG, WEBP (máx. 5MB cada una)</div>
      </div>
      {error && <div className="text-red-600 font-semibold text-center mb-4" role="alert">{error}</div>}
      {mensaje && <div className="text-green-600 font-semibold text-center mb-4" role="status">{mensaje}</div>}
      <button type="submit" className="w-full bg-black text-white py-3 rounded font-bold mt-4">
        GUARDAR PRODUCTO
      </button>
    </form>
  );
}

export default ProductoForm;
