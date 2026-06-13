import React from 'react';
import { useNotification } from '../context/NotificationContext';

const NotificationContainer = () => {
  const { notifications, removeNotification } = useNotification();

  const getIcon = (type) => {
    switch (type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return '📢';
    }
  };

  const getStyles = (type) => {
    const baseStyles = 'border-l-4 shadow-lg backdrop-blur-sm';
    switch (type) {
      case 'success': return `${baseStyles} bg-green-50/90 border-green-500 text-green-800`;
      case 'error': return `${baseStyles} bg-red-50/90 border-red-500 text-red-800`;
      case 'warning': return `${baseStyles} bg-yellow-50/90 border-yellow-500 text-yellow-800`;
      case 'info': return `${baseStyles} bg-blue-50/90 border-blue-500 text-blue-800`;
      default: return `${baseStyles} bg-gray-50/90 border-gray-500 text-gray-800`;
    }
  };

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`${getStyles(notification.type)} p-4 rounded-lg transform transition-all duration-300 ease-in-out animate-slide-in-right`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <span className="text-lg flex-shrink-0">
                {getIcon(notification.type)}
              </span>
              <div className="flex-1">
                {notification.title && (
                  <h4 className="font-semibold text-sm mb-1">
                    {notification.title}
                  </h4>
                )}
                <p className="text-sm leading-relaxed">
                  {notification.message}
                </p>
              </div>
            </div>
            <button
              onClick={() => removeNotification(notification.id)}
              className="ml-2 text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationContainer;