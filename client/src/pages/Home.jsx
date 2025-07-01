import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

function Countdown() {
  const [time, setTime] = useState({days: 0, hours: 0, minutes: 0, seconds: 0});

  useEffect(() => {
    // Fecha objetivo: cambia esto por la fecha real de lanzamiento
    const target = new Date();
    target.setDate(target.getDate() + 5); // 5 días desde ahora

    const interval = setInterval(() => {
      const now = new Date();
      const diff = target - now;
      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        setTime({days, hours, minutes, seconds});
      } else {
        setTime({days: 0, hours: 0, minutes: 0, seconds: 0});
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className="font-bold tracking-widest">
      {String(time.days).padStart(2, '0')}:
      {String(time.hours).padStart(2, '0')}:
      {String(time.minutes).padStart(2, '0')}:
      {String(time.seconds).padStart(2, '0')}
    </span>
  );
}

function Home() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/products')
      .then(res => setProductos(res.data));
  }, []);

  return (
    <div className="w-full min-h-screen bg-white font-sans">
      {/* Banner superior */}
      <header>
        <div className="w-full bg-[#f5f6f7] py-4 text-center text-gray-800 text-lg font-bold tracking-widest uppercase border-b border-gray-200">
          Nuevos Productos pronto !!!!!!
        </div>
        {/* Menú de navegación fijo */}
        <nav className="w-full bg-white shadow sticky top-0 z-50">
          <div className="max-w-7xl mx-auto flex justify-center gap-12 py-4 text-base font-semibold uppercase tracking-widest">
            <a href="#productos" className="hover:text-yellow-600 transition">PRODUCTOS</a>
            <a href="#artesanias" className="hover:text-yellow-600 transition">ARTESANÍAS</a>
            <a href="#contacto" className="hover:text-yellow-600 transition">CONTACTO</a>
          </div>
        </nav>
      </header>

      <main>
        {/* Sección Productos */}
        <section id="productos" className="py-16 bg-white">
          <h2 className="text-2xl md:text-3xl font-semibold text-center tracking-widest mb-2 uppercase">PRODUCTOS</h2>
          <div className="flex justify-center mb-8">
            <span className="block w-16 h-1 bg-black rounded"></span>
          </div>
          {/* Aquí puedes mapear tus productos si lo deseas */}
        </section>

        {/* Sección Más Lanzamientos */}
        <section className="py-16 bg-white">
          <h2 className="text-2xl md:text-3xl font-semibold text-center tracking-widest mb-2 uppercase">MÁS LANZAMIENTOS</h2>
          <div className="flex justify-center mb-8">
            <span className="block w-16 h-1 bg-black rounded"></span>
          </div>
        </section>

        {/* Sección Nuevo Lanzamiento */}
        <section className="py-16 bg-black text-white text-center">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-widest mb-2 uppercase">NUEVO LANZAMIENTO</h2>
          <div className="flex justify-center mb-8">
            <span className="block w-16 h-1 bg-white rounded"></span>
          </div>
          <p className="mb-6 max-w-xl mx-auto text-base md:text-lg font-medium">
            Obtén un anillo <span className="font-bold text-yellow-400">GRATIS</span> al comprar un brazalete y un collar. Solo agrega un anillo a tu carrito
          </p>
          <div className="mb-2 text-base md:text-lg">
            Nuevo Lanzamiento en <Countdown />
          </div>
        </section>

        {/* Sección Artesanías */}
        <section id="artesanias" className="py-16 bg-white">
          <h2 className="text-2xl md:text-3xl font-semibold text-center tracking-widest mb-2 uppercase">ARTESANÍAS</h2>
          <div className="flex justify-center mb-8">
            <span className="block w-16 h-1 bg-black rounded"></span>
          </div>
          <div className="text-center text-base md:text-lg">
            Nuevo Lanzamiento en <Countdown />
          </div>
        </section>
      </main>

      {/* Footer con formulario de contacto */}
      <footer id="contacto" className="py-16 bg-black text-white text-center">
        <h2 className="text-3xl font-semibold mb-4 uppercase tracking-widest">Contacto</h2>
        <h3 className="text-xl font-normal mb-4">¿Cómo puedo ayudar?</h3>
        <p className="mb-4 max-w-xl mx-auto text-base md:text-lg">
          Para consultas sobre una pieza personalizada, déjeme saber su presupuesto y cualquier idea de diseño específica.<br />
          (color, estilo, piedras preciosas, metales, etc.)<br />
          Para obtener ayuda con un pedido, incluya su número de pedido.
        </p>
        <form className="max-w-2xl mx-auto mt-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Name"
              className="flex-1 bg-black border border-white text-white px-4 py-2 rounded focus:outline-none"
              required
            />
            <input
              type="email"
              placeholder="Email *"
              className="flex-1 bg-black border border-white text-white px-4 py-2 rounded focus:outline-none"
              required
            />
          </div>
          <input
            type="text"
            placeholder="Phone number"
            className="w-full bg-black border border-white text-white px-4 py-2 rounded focus:outline-none"
          />
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="NICANOR"
              className="flex-1 bg-black border border-white text-white px-4 py-2 rounded focus:outline-none"
            />
            <div className="flex items-center gap-2">
              <span>ES | EN | FR</span>
            </div>
          </div>
          <textarea
            placeholder=""
            className="w-full bg-black border border-white text-white px-4 py-2 rounded focus:outline-none"
            rows={3}
          />
          <button
            type="submit"
            className="w-full bg-white text-black font-bold py-2 rounded hover:bg-gray-200 transition uppercase"
          >
            ENVIAR
          </button>
        </form>
      </footer>
    </div>
  );
}

export default Home;
