import React, { useState } from 'react';

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = e => {
    e.preventDefault();
    // Aquí va la lógica de login
    alert('Login simulado');
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh] bg-gradient-to-br from-yellow-50 to-yellow-100">
      <form onSubmit={handleSubmit} className="bg-white shadow-xl rounded-xl p-8 w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-yellow-900 text-center">Iniciar Sesión</h2>
        <input
          name="email"
          type="email"
          placeholder="Correo electrónico"
          value={form.email}
          onChange={handleChange}
          className="w-full mb-4 p-3 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={handleChange}
          className="w-full mb-6 p-3 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
          required
        />
        <button
          type="submit"
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 rounded transition-colors"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}

export default Login;
