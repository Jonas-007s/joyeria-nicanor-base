import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-black text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-extrabold tracking-widest text-yellow-400">JOYERÍA NICANOR</Link>
        <div className="hidden md:flex gap-8 items-center">
          <Link to="/" className="hover:text-yellow-400 transition">Inicio</Link>
          <Link to="/admin" className="hover:text-yellow-400 transition">Admin</Link>
          <Link to="/carrito" className="hover:text-yellow-400 transition">Carrito</Link>
          <Link to="/login" className="hover:text-yellow-400 transition">Login</Link>
        </div>
        <button
          className="md:hidden flex flex-col gap-1"
          onClick={() => setOpen(!open)}
          aria-label="Abrir menú"
        >
          <span className="w-7 h-1 bg-yellow-400 rounded"></span>
          <span className="w-7 h-1 bg-yellow-400 rounded"></span>
          <span className="w-7 h-1 bg-yellow-400 rounded"></span>
        </button>
      </div>
      {/* Menú móvil */}
      {open && (
        <div className="md:hidden bg-black px-4 pb-4 flex flex-col gap-4">
          <Link to="/" className="hover:text-yellow-400 transition" onClick={() => setOpen(false)}>Inicio</Link>
          <Link to="/admin" className="hover:text-yellow-400 transition" onClick={() => setOpen(false)}>Admin</Link>
          <Link to="/carrito" className="hover:text-yellow-400 transition" onClick={() => setOpen(false)}>Carrito</Link>
          <Link to="/login" className="hover:text-yellow-400 transition" onClick={() => setOpen(false)}>Login</Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
