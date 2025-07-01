import React from 'react';
import { Link } from 'react-router-dom';

function ProductCard({ prod }) {
  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden flex flex-col">
      <div className="relative">
        <img
          src={prod.imagenes && prod.imagenes[0] ? prod.imagenes[0] : '/placeholder.jpg'}
          alt={prod.nombre}
          className="w-full h-56 object-cover"
        />
        {prod.lanzamiento?.esLanzamiento && (
          <span className="absolute top-2 left-2 bg-yellow-400 text-xs font-bold px-3 py-1 rounded-full shadow">
            Nuevo Lanzamiento
          </span>
        )}
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <h2 className="text-lg font-bold text-gray-900 mb-1 truncate">{prod.nombre}</h2>
        <p className="text-yellow-700 font-semibold mb-2">${prod.precio}</p>
        <p className="text-gray-600 text-sm flex-1 mb-3 line-clamp-2">{prod.descripcion}</p>
        <Link
          to={`/producto/${prod._id}`}
          className="mt-auto inline-block bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded transition-colors text-center"
        >
          Ver detalles
        </Link>
      </div>
    </div>
  );
}

export default ProductCard;
