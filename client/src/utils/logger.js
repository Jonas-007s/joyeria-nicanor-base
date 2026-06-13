const isDevelopment = import.meta.env.DEV;

class Logger {
  info(message, data = null) {
    if (isDevelopment) {
      console.log('ℹ️', message, data);
    }
  }

  error(message, error = null) {
    if (isDevelopment) {
      console.error('❌', message, error);
    }
    // En producción, aquí enviarías a un servicio de logging
    // como Sentry, LogRocket, etc.
  }

  warn(message, data = null) {
    if (isDevelopment) {
      console.warn('⚠️', message, data);
    }
  }

  debug(message, data = null) {
    if (isDevelopment) {
      console.debug('🐛', message, data);
    }
  }

  success(message, data = null) {
    if (isDevelopment) {
      console.log('✅', message, data);
    }
  }
}

export const logger = new Logger();
export default logger;