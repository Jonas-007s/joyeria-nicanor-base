import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Admin() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/products')
      .then(res => setProductos(res.data));
  }, []);

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-yellow-900">Panel de Administración</h1>
        <Link
          to="/admin/agregar-producto"
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded transition-colors"
        >
          + Agregar Producto
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-xl shadow">
          <thead>
            <tr className="bg-yellow-100 text-yellow-900">
              <th className="py-3 px-4 text-left">Nombre</th>
              <th className="py-3 px-4 text-left">Precio</th>
              <th className="py-3 px-4 text-left">Categoría</th>
              <th className="py-3 px-4 text-left">Stock</th>
              <th className="py-3 px-4 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map(prod => (
              <tr key={prod._id} className="border-b last:border-none">
                <td className="py-2 px-4">{prod.nombre}</td>
                <td className="py-2 px-4">${prod.precio}</td>
                <td className="py-2 px-4">{prod.categoria}</td>
                <td className="py-2 px-4">{prod.stock}</td>
                <td className="py-2 px-4">
                  <Link to={`/producto/${prod._id}`} className="text-blue-600 hover:underline mr-2">Ver</Link>
                  {/* Aquí puedes agregar botones de editar/eliminar */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Admin;
