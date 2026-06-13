import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

export default function DetalleProducto() {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const { addItem } = useCart(); // ✅ Corregido: usar addItem en lugar de addToCart

  useEffect(() => {
    setLoading(true);
    axios.get(`/api/products/${id}`)
      .then(res => {
        setProducto(res.data);
        setError(null);
      })
      .catch(() => setError('No se pudo cargar el producto'))
      .finally(() => setLoading(false));
  }, [id]);

  // ✅ Función corregida con notificación
  const handleAddToCart = () => {
    if (!producto) return;
    setIsAddingToCart(true);
    try {
      addItem(producto); // ✅ Usar addItem (método correcto del contexto)
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    } catch (error) {
      console.error('Error al agregar al carrito:', error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <ErrorMessage message={error} />
          <Link 
            to="/productos" 
            className="mt-6 inline-block bg-black text-white px-6 py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors"
          >
            Volver al Catálogo
          </Link>
        </div>
      </div>
    );
  }

  if (!producto) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-black mb-4">Producto no encontrado</h2>
          <Link 
            to="/productos" 
            className="bg-black text-white px-6 py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors"
          >
            Volver al Catálogo
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white w-full">
      {/* ✅ Notificación de éxito */}
      {showNotification && (
        <div className="fixed top-4 right-4 bg-black text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in">
          ✅ Producto agregado a la solicitud
        </div>
      )}

      {/* Banner superior */}
      <div className="bg-black text-white py-3 px-0 w-full">
        <div className="w-full text-center">
          <p className="text-sm font-semibold uppercase tracking-wide">
            ✨ Joyería artesanal de la más alta calidad ✨
          </p>
        </div>
      </div>
      {/* Breadcrumb */}
      <div className="bg-gray-50 py-4 px-4">
        <div className="max-w-7xl mx-auto">
          <nav className="flex items-center space-x-2 text-sm">
            <Link to="/" className="text-gray-600 hover:text-black transition-colors">Inicio</Link>
            <span className="text-gray-400">/</span>
            <Link to="/productos" className="text-gray-600 hover:text-black transition-colors">Productos</Link>
            <span className="text-gray-400">/</span>
            <span className="text-black font-medium">{producto.nombre}</span>
          </nav>
        </div>
      </div>

      {/* Contenido principal */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start">
            {/* Galería de imágenes */}
            <div className="space-y-6 w-full max-w-xl mx-auto lg:mx-0">
              <div className="aspect-square overflow-hidden rounded-2xl bg-gray-100">
                <img
                  src={producto.imagenes?.[selectedImage] || '/placeholder.jpg'}
                  alt={producto.nombre}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              
              {producto.imagenes && producto.imagenes.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {producto.imagenes.map((imagen, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                        selectedImage === index ? 'border-black' : 'border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      <img
                        src={imagen}
                        alt={`${producto.nombre} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Información del producto */}
            <div className="space-y-8">
              <div>
                <h1 className="text-3xl md:text-4xl font-display font-bold text-black mb-2">{producto.nombre}</h1>
                <div className="w-24 h-1 bg-gradient-to-r from-transparent via-brand-gold to-transparent mb-6"></div>
                {producto.categoria && (
                  <span className="chip bg-gray-100 text-black mb-6 uppercase tracking-wide">{producto.categoria}</span>
                )}
              </div>
              <div className="text-4xl font-bold text-black">
                ${producto.precio?.toLocaleString()}
              </div>
              {producto.descripcion && (
                <div>
                  <h3 className="text-xl font-bold text-black mb-4">Descripción</h3>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    {producto.descripcion}
                  </p>
                </div>
              )}
              {/* Características */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-black">Características</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white border border-gray-200 p-4 rounded-xl">
                    <span className="text-sm text-gray-600 uppercase tracking-wide">Material</span>
                    <p className="text-black font-medium">{producto?.especificaciones?.material || '—'}</p>
                  </div>
                  <div className="bg-white border border-gray-200 p-4 rounded-xl">
                    <span className="text-sm text-gray-600 uppercase tracking-wide">Peso</span>
                    <p className="text-black font-medium">{producto?.especificaciones?.peso || '—'}</p>
                  </div>
                  <div className="bg-white border border-gray-200 p-4 rounded-xl">
                    <span className="text-sm text-gray-600 uppercase tracking-wide">Dimensiones</span>
                    <p className="text-black font-medium">{producto?.especificaciones?.dimensiones || '—'}</p>
                  </div>
                  <div className="bg-white border border-gray-200 p-4 rounded-xl">
                    <span className="text-sm text-gray-600 uppercase tracking-wide">Tallas</span>
                    <p className="text-black font-medium">{producto?.especificaciones?.tallas || '—'}</p>
                  </div>
                </div>
              </div>
              {/* CTA */}
              <div className="pt-2">
                <button onClick={handleAddToCart} className="btn-primary px-6 py-3 text-base">
                  Agregar a solicitud
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}