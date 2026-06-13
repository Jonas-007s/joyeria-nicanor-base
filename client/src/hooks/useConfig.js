import { useState, useEffect } from 'react';
import { getConfig } from '../services/solicitudService';

export const useConfig = () => {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        setLoading(true);
        // Caché básico de sesión para no repetir llamadas
        const cacheKey = 'nicanor_config';
        const cacheTTL = 60 * 5 * 1000; // 5 mins
        const cached = sessionStorage.getItem(cacheKey);

        if (cached) {
          const parsed = JSON.parse(cached);
          if (Date.now() - parsed.timestamp < cacheTTL) {
            setConfig(parsed.data);
            setLoading(false);
            return;
          }
        }

        const data = await getConfig();
        setConfig(data);
        sessionStorage.setItem(cacheKey, JSON.stringify({
          timestamp: Date.now(),
          data
        }));
      } catch (error) {
        console.error('Error fetching config:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, []);

  return { config, loading };
};
