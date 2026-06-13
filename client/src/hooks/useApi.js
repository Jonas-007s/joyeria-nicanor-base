import { useState, useEffect, useCallback } from 'react';
import api from '@/services/api';

// Hook para llamadas a la API
export function useApi(url, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(url, options);
      setData(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar datos');
    } finally {
      setLoading(false);
    }
  }, [url, options]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
}

// Hook para mutaciones (POST, PUT, DELETE)
export function useMutation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutate = useCallback(async (method, url, data = null) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api[method](url, data);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error en la operación';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  return { mutate, loading, error };
}

export default api;