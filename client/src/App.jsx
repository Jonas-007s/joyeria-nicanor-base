import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSpinner from './components/LoadingSpinner';
import { authService } from './utils/authService';

// Lazy loading de componentes pesados
const Admin = lazy(() => import('./pages/Admin'));
const Productos = lazy(() => import('./pages/Productos'));
const DetalleProducto = lazy(() => import('./pages/DetalleProducto'));

// Componentes que se cargan inmediatamente
import Home from './pages/Home';
import Login from './pages/Login';
import Carrito from './pages/Carrito';
import OrderSuccess from './pages/OrderSuccess';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Componente para rutas protegidas
const PrivateRoute = ({ children }) => {
  const isAuthenticated = authService.isAuthenticated();
  const isAdmin = authService.isAdmin();

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Layout wrapper: oculta Navbar y Footer en rutas admin/login
const AppLayout = ({ children }) => {
  const location = useLocation();
  const hideChrome = ['/admin', '/login'].some(p => location.pathname.startsWith(p));

  return (
    <div className="min-h-screen bg-gray-50">
      {!hideChrome && <Navbar />}
      <main>{children}</main>
      {!hideChrome && <Footer />}
    </div>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <CartProvider>
        <Router>
          <AppLayout>
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/productos" element={<Productos />} />
                <Route path="/producto/:id" element={<DetalleProducto />} />
                <Route path="/carrito" element={<Carrito />} />
                <Route path="/pedido-exitoso" element={<OrderSuccess />} />
                <Route path="/login" element={<Login />} />
                <Route
                  path="/admin"
                  element={
                    <PrivateRoute>
                      <Admin />
                    </PrivateRoute>
                  }
                />
              </Routes>
            </Suspense>
          </AppLayout>
        </Router>
      </CartProvider>
    </ErrorBoundary>
  );
}

export default App;
