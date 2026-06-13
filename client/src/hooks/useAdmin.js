import { useState, useCallback, useEffect } from 'react';

/**
 * Hook para manejar datos del dashboard admin
 */
export const useAdminData = () => {
  const [dashboard, setDashboard] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Cargar datos del dashboard
   */
  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/dashboard', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Error cargando dashboard');
      }

      const data = await response.json();
      setDashboard(data);
    } catch (err) {
      console.error('Error en loadDashboard:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Cargar datos analíticos
   */
  const loadAnalytics = useCallback(async (mes, año) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (mes) params.append('mes', mes);
      if (año) params.append('año', año);

      const url = `/api/admin/analytics${params.toString() ? '?' + params.toString() : ''}`;

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Error cargando analytics');
      }

      const data = await response.json();
      setAnalytics(data);
    } catch (err) {
      console.error('Error en loadAnalytics:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Obtener KPIs formateados
   */
  const getKPIs = useCallback(() => {
    if (!dashboard?.kpis) return null;

    return {
      totalProductos: dashboard.kpis.totalProductos,
      solicitudesPendientes: dashboard.kpis.solicitudesPendientes,
      totalSolicitudes: dashboard.kpis.totalSolicitudes,
      clientesRegistrados: dashboard.kpis.totalClientes,
      nuevosHoy: dashboard.kpis.nuevosHoy
    };
  }, [dashboard]);

  /**
   * Obtener datos para gráficos
   */
  const getChartData = useCallback(() => {
    if (!dashboard) return null;

    return {
      solicitudesPorEstado: dashboard.solicitudes?.porEstado || [],
      solicitudesPorMes: dashboard.solicitudes?.porMes || [],
      productosMasSolicitados: dashboard.productos?.masSolicitados || [],
      clientesMasActivos: dashboard.clientes?.masActivos || []
    };
  }, [dashboard]);

  return {
    dashboard,
    analytics,
    loading,
    error,
    loadDashboard,
    loadAnalytics,
    getKPIs,
    getChartData
  };
};

/**
 * Hook para manejar listado de solicitudes
 */
export const useQuotations = () => {
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);

  const loadQuotations = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      
      if (filters.estado) params.append('estado', filters.estado);
      if (filters.mes && filters.año) {
        params.append('mes', filters.mes);
        params.append('año', filters.año);
      }
      if (filters.cliente) params.append('cliente', filters.cliente);

      const url = `/api/quotations${params.toString() ? '?' + params.toString() : ''}`;

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Error cargando solicitudes');
      }

      const data = await response.json();
      setQuotations(data.solicitudes || []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error('Error en loadQuotations:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateState = useCallback(async (quotationId, newState) => {
    try {
      const response = await fetch(`/api/quotations/${quotationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ estado: newState })
      });

      if (!response.ok) throw new Error('Error actualizando estado');

      const data = await response.json();
      
      // Actualizar la lista local
      setQuotations((prev) =>
        prev.map((q) => (q._id === quotationId ? data.solicitud : q))
      );

      return data.solicitud;
    } catch (err) {
      console.error('Error en updateState:', err);
      throw err;
    }
  }, []);

  return {
    quotations,
    total,
    loading,
    error,
    loadQuotations,
    updateState
  };
};

/**
 * Hook para manejar listado de clientes
 */
export const useClients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadClients = useCallback(async (buscar = '', ordenar = 'reciente') => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (buscar) params.append('buscar', buscar);
      params.append('ordenar', ordenar);

      const url = `/api/clients${params.toString() ? '?' + params.toString() : ''}`;

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Error cargando clientes');
      }

      const data = await response.json();
      setClients(data.clientes || []);
    } catch (err) {
      console.error('Error en loadClients:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    clients,
    loading,
    error,
    loadClients
  };
};

/**
 * Hook para generar URL de WhatsApp
 */
export const useWhatsApp = () => {
  const [loading, setLoading] = useState(false);

  const generateURL = useCallback(async (quotationId) => {
    setLoading(true);

    try {
      const response = await fetch(`/api/quotations/${quotationId}/whatsapp`);

      if (!response.ok) {
        throw new Error('Error generando URL de WhatsApp');
      }

      const data = await response.json();
      return data.url;
    } catch (err) {
      console.error('Error en generateURL:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    generateURL,
    loading
  };
};
