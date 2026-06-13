import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function Navbar() {
  const [open, setOpen] = useState(false);
  const mobileMenuRef = useRef(null);
  const location = useLocation();
  const { cartItems } = useCart();
  const cartCount = cartItems.reduce((sum, item) => sum + (item.cantidad || 1), 0);

  // Cerrar menú móvil al cambiar de ruta
  useEffect(() => {
    setOpen(false);
  }, [location]);

  // Gestión de accesibilidad del menú móvil
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      mobileMenuRef.current?.focus();
    } else {
      document.body.style.overflow = '';
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };

    if (open) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [open]);

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: '/', label: 'Inicio' },
    { path: '/productos', label: 'Catálogo' },
    { path: '/carrito', label: 'Solicitud' }
  ];

  return (
    <>
      <nav
        className="bg-white/80 backdrop-blur text-black w-full sticky top-0 z-50 border-b border-gray-200"
        role="navigation"
        aria-label="Navegación principal"
      >
        <div className="w-full px-4 py-4 flex justify-between items-center">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-bold tracking-wider text-black hover:text-brand-gold transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 rounded"
            aria-label="Joyería Nicanor - Ir al inicio"
          >
            NICANOR
          </Link>
          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-8 items-center">
            {navLinks.map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                className={`hover:text-brand-gold transition-colors text-sm uppercase tracking-wide font-medium focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 rounded px-2 py-1 ${isActive(path) ? 'text-black border-b-2 border-brand-gold' : 'text-gray-700'
                  }`}
              >
                <span className="inline-flex items-center gap-2">
                  {label}
                  {path === '/carrito' && cartCount > 0 && (
                    <span className="ml-1 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-brand-gold text-black text-[10px] leading-none">
                      {cartCount}
                    </span>
                  )}
                </span>
              </Link>
            ))}
          </div>
          {/* Mobile menu button */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 rounded"
            onClick={() => setOpen(!open)}
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            <span className={`w-6 h-0.5 bg-black rounded transition-transform duration-300 ${open ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`w-6 h-0.5 bg-black rounded transition-opacity duration-300 ${open ? 'opacity-0' : ''}`}></span>
            <span className={`w-6 h-0.5 bg-black rounded transition-transform duration-300 ${open ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </button>
        </div>
      </nav>

      {/* Mobile Sidebar Drawer */}
      <div
        className={`fixed inset-0 z-[60] md:hidden ${open ? 'pointer-events-auto' : 'pointer-events-none'}`}
        aria-hidden={!open}
      >
        {/* Overlay */}
        <div
          className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />

        {/* Drawer Panel (Right Side) */}
        <div
          id="mobile-menu"
          ref={mobileMenuRef}
          tabIndex={-1}
          className={`absolute top-0 right-0 bottom-0 w-[280px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${open ? 'translate-x-0' : 'translate-x-full'}`}
        >
          {/* Drawer Header */}
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <span className="font-bold text-lg tracking-widest text-black">MENÚ</span>
            <button
              onClick={() => setOpen(false)}
              className="p-2 -mr-2 text-gray-500 hover:text-black hover:bg-gray-50 rounded-full transition-colors"
              aria-label="Cerrar menú"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Drawer Links */}
          <div className="flex-1 overflow-y-auto py-6 px-4">
            <nav className="flex flex-col space-y-2">
              {navLinks.map(({ path, label }) => (
                <Link
                  key={path}
                  to={path}
                  className={`block px-4 py-3 rounded-lg text-sm font-medium uppercase tracking-wide transition-all ${isActive(path)
                    ? 'bg-black text-white shadow-md transform scale-[1.02]'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-black'
                    }`}
                  onClick={() => setOpen(false)}
                >
                  <div className="flex items-center justify-between">
                    <span>{label}</span>
                    {path === '/carrito' && cartCount > 0 && (
                      <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ml-2 ${isActive(path) ? 'bg-white text-black' : 'bg-black text-white'
                        }`}>
                        {cartCount}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </nav>
          </div>

          {/* Drawer Footer (Optional) */}
          <div className="p-5 border-t border-gray-100 bg-gray-50">
            <p className="text-xs text-center text-gray-400">
              © {new Date().getFullYear()} Joyería Nicanor
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;
