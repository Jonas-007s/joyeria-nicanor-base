import { useState, useEffect } from 'react';
import axios from 'axios';

// Tipos de joya predefinidos — fuente única de verdad compartida con el admin
export const TIPOS_JOYA = [
  { value: 'anillo',    label: 'Anillos' },
  { value: 'aro',       label: 'Aros' },
  { value: 'collar',    label: 'Collares' },
  { value: 'pulsera',   label: 'Pulseras' },
  { value: 'cadena',    label: 'Cadenas' },
  { value: 'colgante',  label: 'Colgantes' },
  { value: 'artesania', label: 'Artesanía' },
  { value: 'otro',      label: 'Otro' },
];

export const useProducts = () => {
  const [coleccion, setColeccion]           = useState([]);  // todos menos lanzamientos
  const [nuevosLanzamientos, setNuevosLanzamientos] = useState([]);
  const [loading, setLoading]               = useState(true);
  const [error, setError]                   = useState('');

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        setLoading(true);
        setError('');

        // Caché 60 s
        const cacheKey = 'products_cache_v3';
        const cacheTTL = 60 * 1000;
        const cached = sessionStorage.getItem(cacheKey);

        let data;
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Date.now() - parsed.timestamp < cacheTTL) data = parsed.data;
        }

        if (!data) {
          const res = await axios.get('/api/products');
          data = res.data;
          sessionStorage.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), data }));
        }

        // Lanzamientos: seccion === 'nuevo-lanzamiento' (compatibilidad con esLanzamiento futuro)
        const lanzamientos = data.filter(p =>
          p.seccion === 'nuevo-lanzamiento' || p.esLanzamiento === true
        ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        // Colección: todo lo que NO sea lanzamiento
        const col = data.filter(p =>
          p.seccion !== 'nuevo-lanzamiento' && !p.esLanzamiento
        );

        setNuevosLanzamientos(lanzamientos);
        setColeccion(col);

      } catch (err) {
        console.error('Error al cargar productos:', err);
        setError('Error al cargar los productos. Por favor, intenta de nuevo.');
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

  return { coleccion, nuevosLanzamientos, loading, error };
};