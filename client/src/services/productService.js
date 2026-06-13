// Crear archivo nuevo
import { api } from './api';

export const productService = {
  // Reemplaza todas las funciones fetchProductos duplicadas
  getAll: async (options = {}) => {
    const { section, cache = true } = options;
    const cacheKey = `products_${section || 'all'}_v1`;
    
    if (cache) {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < 5 * 60 * 1000) { // 5 min cache
          return data;
        }
      }
    }
    
    const url = section ? `/api/products/seccion/${section}` : '/api/products';
    const response = await api.get(url);
    
    if (cache) {
      localStorage.setItem(cacheKey, JSON.stringify({
        data: response.data,
        timestamp: Date.now()
      }));
    }
    
    return response.data;
  },
  
  getById: async (id) => {
    const res = await api.get(`/api/products/${id}`);
    return res.data;
  },
  create: (data) => api.post('/api/products', data),
  update: (id, data) => api.put(`/api/products/${id}`, data),
  delete: (id) => api.delete(`/api/products/${id}`)
};