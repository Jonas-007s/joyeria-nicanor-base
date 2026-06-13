import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const QuotationContext = createContext();

export const useQuotation = () => {
  const context = useContext(QuotationContext);
  if (!context) {
    throw new Error('useQuotation debe usarse dentro de QuotationProvider');
  }
  return context;
};

export const QuotationProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [cliente, setCliente] = useState({
    nombre: '',
    telefono: '',
    correo: '',
    ciudad: ''
  });
  const [comentarios, setComentarios] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [ordenNumber, setOrdenNumber] = useState(null);

  // Cargar desde localStorage al montar
  useEffect(() => {
    const savedQuotation = localStorage.getItem('quotation_items');
    const savedCliente = localStorage.getItem('quotation_cliente');
    
    if (savedQuotation) {
      try {
        setItems(JSON.parse(savedQuotation));
      } catch (err) {
        console.error('Error cargando items guardados:', err);
      }
    }

    if (savedCliente) {
      try {
        setCliente(JSON.parse(savedCliente));
      } catch (err) {
        console.error('Error cargando cliente guardado:', err);
      }
    }
  }, []);

  // Guardar en localStorage cuando cambien los items
  useEffect(() => {
    localStorage.setItem('quotation_items', JSON.stringify(items));
  }, [items]);

  // Guardar cliente en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem('quotation_cliente', JSON.stringify(cliente));
  }, [cliente]);

  /**
   * Agregar producto a la solicitud
   */
  const addItem = useCallback((product) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item._id === product._id);

      if (existingItem) {
        return prevItems.map((item) =>
          item._id === product._id
            ? { ...item, cantidad: (item.cantidad || 1) + 1 }
            : item
        );
      }

      return [...prevItems, { ...product, cantidad: 1 }];
    });

    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  }, []);

  /**
   * Eliminar producto de la solicitud
   */
  const removeItem = useCallback((productId) => {
    setItems((prevItems) =>
      prevItems.filter((item) => item._id !== productId)
    );
  }, []);

  /**
   * Actualizar cantidad de un producto
   */
  const updateQuantity = useCallback((productId, cantidad) => {
    if (cantidad < 1) {
      removeItem(productId);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        item._id === productId ? { ...item, cantidad } : item
      )
    );
  }, [removeItem]);

  /**
   * Limpiar solicitud
   */
  const clearQuotation = useCallback(() => {
    setItems([]);
    setComentarios('');
    setOrdenNumber(null);
    localStorage.removeItem('quotation_items');
  }, []);

  /**
   * Actualizar datos del cliente
   */
  const updateCliente = useCallback((newCliente) => {
    setCliente((prev) => ({ ...prev, ...newCliente }));
  }, []);

  /**
   * Enviar solicitud al backend
   */
  const submitQuotation = useCallback(async () => {
    // Validación
    if (items.length === 0) {
      setError('Debes agregar al menos un producto');
      return;
    }

    if (!cliente.nombre || !cliente.telefono) {
      setError('El nombre y teléfono son obligatorios');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload = {
        cliente,
        productos: items,
        comentarios
      };

      const response = await fetch('/api/quotations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al enviar solicitud');
      }

      const data = await response.json();
      setOrdenNumber(data.numeroOrden);
      setSuccess(true);
      clearQuotation();

      return data;

    } catch (err) {
      console.error('Error al enviar solicitud:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [items, cliente, comentarios, clearQuotation]);

  /**
   * Obtener URL de WhatsApp
   */
  const getWhatsAppURL = useCallback(async (numeroOrden) => {
    if (!numeroOrden) return null;

    try {
      const response = await fetch(`/api/quotations/${numeroOrden}/whatsapp`);
      if (!response.ok) throw new Error('Error obteniendo URL de WhatsApp');

      const data = await response.json();
      return data.url;
    } catch (err) {
      console.error('Error generando URL de WhatsApp:', err);
      return null;
    }
  }, []);

  /**
   * Calcular totales
   */
  const getTotals = useCallback(() => {
    return {
      itemsCount: items.length,
      totalUnits: items.reduce((sum, item) => sum + (item.cantidad || 1), 0),
      items
    };
  }, [items]);

  const value = {
    // Estado
    items,
    cliente,
    comentarios,
    loading,
    error,
    success,
    ordenNumber,

    // Métodos
    addItem,
    removeItem,
    updateQuantity,
    clearQuotation,
    updateCliente,
    setComentarios,
    submitQuotation,
    getWhatsAppURL,
    getTotals,
    setError
  };

  return (
    <QuotationContext.Provider value={value}>
      {children}
    </QuotationContext.Provider>
  );
};

export default QuotationContext;
