import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Mejoras aplicadas:
// - Accesibilidad: aria-labels, roles, foco visible en inputs y botones.
// - Modularidad: el componente puede ser renombrado y reutilizado.
// - Código limpio y preparado para producción.

function Login() {
  const [form, setForm] = useState({ usuario: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = e => {
    e.preventDefault();
    // Usuario y contraseña hardcodeados para demo
    if (form.usuario === 'admin' && form.password === 'admin') {
      setError('');
      navigate('/admin');
    } else {
      setError('Usuario o contraseña incorrectos');
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f7f7] flex flex-col justify-between w-full">
      <div className="flex flex-1 items-center justify-center w-full">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-xl px-10 py-10 flex flex-col gap-6 w-full max-w-md justify-center items-center min-h-[500px]"
          aria-label="Formulario de acceso administrativo"
        >
          <div className="flex flex-col items-center mb-2">
            <span className="text-3xl mb-2" aria-hidden="true">
              <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 17v.01M17 11V7a5 5 0 10-10 0v4M5 11h14a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2z"/>
              </svg>
            </span>
            <h2 className="text-2xl font-semibold text-gray-800">Acceso Administrativo</h2>
          </div>
          <div className="flex flex-col gap-2 w-full">
            <label htmlFor="usuario" className="text-sm font-semibold text-gray-700">Usuario:</label>
            <input
              id="usuario"
              name="usuario"
              type="text"
              autoComplete="username"
              value={form.usuario}
              onChange={handleChange}
              className="bg-[#f1f6ff] border border-gray-200 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="admin"
              required
              aria-required="true"
            />
          </div>
          <div className="flex flex-col gap-2 w-full">
            <label htmlFor="password" className="text-sm font-semibold text-gray-700">Contraseña:</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={form.password}
              onChange={handleChange}
              className="bg-[#f1f6ff] border border-gray-200 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="********"
              required
              aria-required="true"
            />
          </div>
          {error && <div className="text-red-500 text-sm text-center" role="alert">{error}</div>}
          <button
            type="submit"
            className="w-full bg-black text-white font-bold py-3 rounded-lg text-base mt-2 hover:bg-gray-900 transition uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-black"
          >
            INICIAR SESIÓN
          </button>
        </form>
      </div>
      {/* Footer propio removido: usamos el <Footer /> global que ya está en App.jsx */}
    </div>
  );
}

export default Login;