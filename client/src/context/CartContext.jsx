import React, { createContext, useContext, useReducer, useEffect, useMemo, useCallback } from 'react';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const id = action.payload._id || action.payload.id;
      const existing = state.find(item => item.id === id);
      if (existing) {
        return state.map(item => item.id === id ? { ...item, cantidad: (item.cantidad || 1) + 1 } : item);
      }
      const { nombre, precio, imagenes, sku, material } = action.payload;
      return [...state, {
        id,
        nombre,
        precio,
        imagen: imagenes?.[0] || action.payload.imagen || '',
        sku: sku || '',
        material: material || '',
        cantidad: 1
      }];
    }
    case 'INCREMENT_QTY': {
      const id = action.payload;
      return state.map(item => item.id === id ? { ...item, cantidad: (item.cantidad || 1) + 1 } : item);
    }
    case 'DECREMENT_QTY': {
      const id = action.payload;
      return state.map(item =>
        item.id === id ? { ...item, cantidad: Math.max((item.cantidad || 1) - 1, 1) } : item
      );
    }
    case 'REMOVE_ITEM': {
      const id = action.payload;
      return state.filter(item => item.id !== id);
    }
    case 'CLEAR_CART': return [];
    default: return state;
  }
};

export const CartProvider = ({ children }) => {
  const [cartItems, dispatch] = useReducer(cartReducer, [], () => {
    try {
      const saved = localStorage.getItem('cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    } catch (error) {
      console.warn('No se pudo guardar el carrito en localStorage:', error);
    }
  }, [cartItems]);

  const addItem = useCallback((item) => dispatch({ type: 'ADD_ITEM', payload: item }), []);
  const removeItem = useCallback((id) => dispatch({ type: 'REMOVE_ITEM', payload: id }), []);
  const clearCart = useCallback(() => dispatch({ type: 'CLEAR_CART' }), []);
  const incrementQty = useCallback((id) => dispatch({ type: 'INCREMENT_QTY', payload: id }), []);
  const decrementQty = useCallback((id) => dispatch({ type: 'DECREMENT_QTY', payload: id }), []);

  const contextValue = useMemo(() => ({
    cartItems,
    addItem,
    removeItem,
    clearCart,
    incrementQty,
    decrementQty
  }), [cartItems, addItem, removeItem, clearCart, incrementQty, decrementQty]);

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe usarse dentro de CartProvider');
  }
  return context;
};