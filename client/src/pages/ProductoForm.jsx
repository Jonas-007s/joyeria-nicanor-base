import React, { useState } from 'react';

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

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({
      ...f,
      [name]: type === 'checkbox' ? checked : value
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
    // Aquí va la lógica para enviar el producto al backend
    alert('Producto guardado (simulado)');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-8 max-w-4xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-6">Agregar Nuevo Producto</h2>
      <div className="flex gap-4 mb-6">
        <button type="button" className={`flex-1 py-2 rounded ${!form.esLanzamiento ? 'bg-black text-white' : 'bg-gray-100'}`}
          onClick={() => setForm(f => ({ ...f, esLanzamiento: false }))}>
          Producto Normal
        </button>
        <button type="button" className={`flex-1 py-2 rounded ${form.esLanzamiento ? 'bg-black text-white' : 'bg-gray-100'}`}
          onClick={() => setForm(f => ({ ...f, esLanzamiento: true }))}>
          Producto de Lanzamiento
        </button>
      </div>
      {form.esLanzamiento && (
        <div className="bg-yellow-100 p-4 rounded mb-6">
          <label className="block mb-2 font-semibold">Fecha de Lanzamiento</label>
          <input type="date" name="fechaLanzamiento" value={form.fechaLanzamiento} onChange={handleChange} className="mb-2 w-full border rounded p-2"/>
          <label className="block mb-2 font-semibold">Productos a Mostrar en Preview</label>
          <input type="number" name="preview" value={form.preview} onChange={handleChange} className="mb-2 w-full border rounded p-2"/>
          <label className="block mb-2 font-semibold">Descripción del Lanzamiento</label>
          <textarea name="descripcionLanzamiento" value={form.descripcionLanzamiento} onChange={handleChange} className="w-full border rounded p-2"/>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block font-semibold">Nombre del Producto *</label>
          <input name="nombre" value={form.nombre} onChange={handleChange} className="w-full border rounded p-2" required />
        </div>
        <div>
          <label className="block font-semibold">Precio (CLP) *</label>
          <input name="precio" value={form.precio} onChange={handleChange} className="w-full border rounded p-2" required />
        </div>
        <div className="md:col-span-2">
          <label className="block font-semibold">Descripción Completa *</label>
          <textarea name="descripcion" value={form.descripcion} onChange={handleChange} className="w-full border rounded p-2" required />
        </div>
        <div>
          <label className="block font-semibold">Categoría *</label>
          <select name="categoria" value={form.categoria} onChange={handleChange} className="w-full border rounded p-2" required>
            <option value="">Seleccionar categoría</option>
            <option value="anillos">Anillos</option>
            <option value="collares">Collares</option>
            <option value="pulseras">Pulseras</option>
            {/* Agrega más categorías si es necesario */}
          </select>
        </div>
        <div>
          <label className="block font-semibold">Stock Inicial *</label>
          <input name="stock" type="number" value={form.stock} onChange={handleChange} className="w-full border rounded p-2" required />
        </div>
      </div>
      <div className="mb-6">
        <h3 className="font-bold mb-2">Especificaciones Técnicas</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input name="material" placeholder="Material" value={form.material} onChange={handleChange} className="border rounded p-2" />
          <input name="peso" placeholder="Peso" value={form.peso} onChange={handleChange} className="border rounded p-2" />
          <input name="dimensiones" placeholder="Dimensiones" value={form.dimensiones} onChange={handleChange} className="border rounded p-2" />
          <input name="tallas" placeholder="Tallas/Medidas Disponibles" value={form.tallas} onChange={handleChange} className="border rounded p-2" />
        </div>
      </div>
      <div className="mb-6">
        <h3 className="font-bold mb-2">Información Adicional</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input name="instrucciones" placeholder="Instrucciones de Cuidado" value={form.instrucciones} onChange={handleChange} className="border rounded p-2" />
          <input name="garantia" placeholder="Garantía" value={form.garantia} onChange={handleChange} className="border rounded p-2" />
          <input name="origen" placeholder="Origen/Fabricación" value={form.origen} onChange={handleChange} className="border rounded p-2" />
          <input name="tiempoEntrega" placeholder="Tiempo de Entrega" value={form.tiempoEntrega} onChange={handleChange} className="border rounded p-2" />
        </div>
      </div>
      <div className="mb-6">
        <h3 className="font-bold mb-2">Imágenes del Producto</h3>
        <input type="file" multiple accept="image/*" onChange={handleFileChange} className="w-full border rounded p-2" />
        <div className="text-gray-500 text-sm mt-2">Formatos: JPG, PNG, WEBP (máx. 5MB cada una)</div>
      </div>
      <button type="submit" className="w-full bg-black text-white py-3 rounded font-bold mt-4">GUARDAR PRODUCTO</button>
    </form>
  );
}

export default ProductoForm;
