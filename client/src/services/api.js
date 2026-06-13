import axios from 'axios';

// Configuración base de axios
export const api = axios.create({
  // Antes: baseURL: import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api',
  baseURL: import.meta.env.VITE_API_URL || '',
  timeout: 10000,
  // IMPORTANTE: no fijar Content-Type aquí; axios lo detecta (JSON o multipart)
  // headers: { 'Content-Type': 'application/json' }
});

// Interceptor para agregar token de autenticación
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('authToken') || localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken'); localStorage.removeItem('authUser');
      sessionStorage.removeItem('authToken'); sessionStorage.removeItem('authUser');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;