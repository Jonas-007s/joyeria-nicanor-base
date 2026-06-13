import React from 'react';

function ErrorMessage({ message, onRetry, className = "" }) {
  return (
    <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`} role="alert">
      <div className="flex items-center">
        <svg className="w-5 h-5 text-red-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
        <p className="text-red-800 font-medium">{message}</p>
      </div>
      {onRetry && (
        <button 
          onClick={onRetry}
          className="mt-3 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors text-sm font-medium"
        >
          Reintentar
        </button>
      )}
    </div>
  );
}

export default ErrorMessage;