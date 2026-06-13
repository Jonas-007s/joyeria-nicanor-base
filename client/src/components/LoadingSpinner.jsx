import React from 'react';

function LoadingSpinner({ size = 'md', color = 'black' }) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  const colorClasses = {
    black: 'border-black',
    white: 'border-white',
    gray: 'border-gray-500'
  };

  return (
    <div className="flex items-center justify-center">
      <div 
        className={`animate-spin rounded-full border-2 border-t-transparent ${sizeClasses[size]} ${colorClasses[color]}`}
        role="status"
        aria-label="Cargando"
      >
        <span className="sr-only">Cargando...</span>
      </div>
    </div>
  );
}

export default LoadingSpinner;