import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import DetalleProducto from './pages/Página de DetalledeProducto';
import ProductoForm from './pages/ProductoForm';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Carrito from './pages/Carrito';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/producto/:id" element={<DetalleProducto />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/agregar-producto" element={<ProductoForm />} />
        <Route path="/login" element={<Login />} />
        <Route path="/carrito" element={<Carrito />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
