import React from 'react';

function Footer() {
  return (
    <footer className="bg-black text-yellow-400 py-6 mt-16">
      <div className="max-w-7xl mx-auto px-4 text-center text-sm">
        © {new Date().getFullYear()} Joyería Nicanor. Todos los derechos reservados.
      </div>
    </footer>
  );
}

export default Footer;
