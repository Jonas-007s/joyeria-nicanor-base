import React from 'react';

function Carrito() {
  // Simulación de productos en el carrito
  const productos = [
    { nombre: 'Anillo de Plata', precio: 12000, cantidad: 1 },
    { nombre: 'Collar Artesanal', precio: 18000, cantidad: 2 },
  ];

  const total = productos.reduce((acc, p) => acc + p.precio * p.cantidad, 0);

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-yellow-900 mb-8">Carrito de Compras</h1>
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        {productos.map((prod, idx) => (
          <div key={idx} className="flex justify-between items-center border-b last:border-none py-3">
            <span>{prod.nombre} x{prod.cantidad}</span>
            <span className="font-bold text-yellow-700">${prod.precio * prod.cantidad}</span>
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center mb-6">
        <span className="font-bold text-lg">Total:</span>
        <span className="font-bold text-2xl text-yellow-900">${total}</span>
      </div>
      <button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 rounded transition-colors">
        Finalizar Compra
      </button>
    </div>
  );
}

export default Carrito;
