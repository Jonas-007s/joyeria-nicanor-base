import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const Breadcrumbs = ({ customItems = null }) => {
  const location = useLocation();
  const { isDark } = useTheme();
  
  const generateBreadcrumbs = () => {
    if (customItems) return customItems;
    
    const pathnames = location.pathname.split('/').filter(x => x);
    const breadcrumbs = [{ name: 'Inicio', path: '/' }];
    
    let currentPath = '';
    pathnames.forEach((pathname, index) => {
      currentPath += `/${pathname}`;
      
      let name = pathname;
      // Mapear rutas a nombres legibles
      const routeNames = {
        'productos': 'Productos',
        'producto': 'Producto',
        'carrito': 'Solicitud de Cotización',
        'admin': 'Administración',
        'login': 'Iniciar Sesión'
      };
      
      name = routeNames[pathname] || pathname.charAt(0).toUpperCase() + pathname.slice(1);
      
      breadcrumbs.push({
        name,
        path: currentPath,
        isLast: index === pathnames.length - 1
      });
    });
    
    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <nav className={`py-4 px-4 border-b transition-colors ${
      isDark 
        ? 'bg-gray-900 border-gray-700' 
        : 'bg-gray-50 border-gray-200'
    }`}>
      <div className="max-w-7xl mx-auto">
        <ol className="flex items-center space-x-2 text-sm">
          {breadcrumbs.map((crumb, index) => (
            <li key={crumb.path} className="flex items-center">
              {index > 0 && (
                <svg 
                  className={`w-4 h-4 mx-2 ${
                    isDark ? 'text-gray-500' : 'text-gray-400'
                  }`} 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              )}
              
              {crumb.isLast ? (
                <span className={`font-medium ${
                  isDark ? 'text-white' : 'text-black'
                }`}>
                  {crumb.name}
                </span>
              ) : (
                <Link
                  to={crumb.path}
                  className={`hover:underline transition-colors ${
                    isDark 
                      ? 'text-gray-400 hover:text-white' 
                      : 'text-gray-600 hover:text-black'
                  }`}
                >
                  {crumb.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
};

export default Breadcrumbs;