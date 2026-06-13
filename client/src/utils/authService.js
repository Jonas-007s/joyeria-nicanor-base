import axios from 'axios';
import api from '../services/api';

class AuthService {
  constructor() {
    this.TOKEN_KEY = 'authToken';
    this.USER_KEY = 'authUser';
    this.setupAxiosInterceptors();
  }

  setupAxiosInterceptors() {
    // Interceptor para añadir token automáticamente
    axios.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Interceptor para manejar respuestas de error
    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.logout();
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  async login(email, password) {
    try {
      // Usa la instancia 'api' que tiene VITE_API_URL como baseURL correctamente
      const response = await api.post('/api/auth/login', {
        email,
        password
      });

      const { token, user } = response.data;
      
      this.setToken(token);
      this.setUser(user);
      
      return { success: true, user };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error de autenticación'
      };
    }
  }

  logout() {
    sessionStorage.removeItem(this.TOKEN_KEY);
    sessionStorage.removeItem(this.USER_KEY);
    delete axios.defaults.headers.common.Authorization;
  }

  setToken(token) {
    sessionStorage.setItem(this.TOKEN_KEY, token);
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  }

  getToken() {
    return sessionStorage.getItem(this.TOKEN_KEY) || localStorage.getItem(this.TOKEN_KEY); // Fallback if they had old localStorage
  }

  setUser(user) {
    sessionStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  getUser() {
    const user = sessionStorage.getItem(this.USER_KEY) || localStorage.getItem(this.USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  isAuthenticated() {
    const token = this.getToken();
    const user = this.getUser();
    if (!token || !user) return false;
    if (this.isTokenExpired()) {
      this.logout();
      return false;
    }
    return true;
  }

  isAdmin() {
    const user = this.getUser();
    return user?.role === 'admin';
  }

  // Verificar si el token está expirado
  isTokenExpired() {
    const token = this.getToken();
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }
}

export const authService = new AuthService();
export default authService;