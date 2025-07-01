import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function DetalleProducto() {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/products/${id}`)
      .then(res => setProducto(res.data));
  }, [id]);

  if (!producto) return <div>Cargando...</div>;

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="flex flex-col md:flex-row gap-8">
        <img src={producto.imagenes[0]} alt={producto.nombre} className="w-full md:w-1/2 h-96 object-cover"/>
        <div>
          <h1 className="text-3xl font-bold">{producto.nombre}</h1>
          <p className="text-xl text-gray-700 mb-4">${producto.precio}</p>
          <p className="mb-4">{producto.descripcion}</p>
          <div className="mb-4">
            <h2 className="font-semibold">Especificaciones Técnicas</h2>
            <ul>
              <li>Material: {producto.especificaciones.material}</li>
              <li>Peso: {producto.especificaciones.peso}</li>
              <li>Dimensiones: {producto.especificaciones.dimensiones}</li>
              <li>Tallas: {producto.especificaciones.tallas}</li>
            </ul>
          </div>
          <div>
            <h2 className="font-semibold">Información Adicional</h2>
            <ul>
              <li>Instrucciones: {producto.infoAdicional.instrucciones}</li>
              <li>Garantía: {producto.infoAdicional.garantia}</li>
              <li>Origen: {producto.infoAdicional.origen}</li>
              <li>Entrega: {producto.infoAdicional.tiempoEntrega}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetalleProducto;