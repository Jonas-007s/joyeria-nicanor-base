import React, { useState } from 'react';
import { useQuotation } from '../context/QuotationContext';
import QuotationForm from './QuotationForm';
import QuotationSummary from './QuotationSummary';
import './QuotationCart.css';

const QuotationCart = () => {
  const { items, removeItem, updateQuantity } = useQuotation();
  const [showForm, setShowForm] = useState(false);

  if (items.length === 0 && !showForm) {
    return (
      <div className="quotation-cart empty">
        <div className="empty-state">
          <div className="empty-icon">🛍️</div>
          <h3>Tu solicitud está vacía</h3>
          <p>Agrega productos para comenzar tu solicitud de cotización</p>
        </div>
      </div>
    );
  }

  return (
    <div className="quotation-cart">
      <div className="quotation-container">
        {/* Columna izquierda: Productos */}
        <div className="quotation-products">
          <div className="section-header">
            <h2>Productos Seleccionados</h2>
            <span className="badge">{items.length}</span>
          </div>

          <div className="products-list">
            {items.map((product) => (
              <div key={product._id} className="product-card">
                <div className="product-image">
                  <img
                    src={product.imagen || '/placeholder.jpg'}
                    alt={product.nombre}
                  />
                </div>

                <div className="product-details">
                  <h4 className="product-name">{product.nombre}</h4>
                  <div className="product-meta">
                    <span className="sku">SKU: {product.sku || 'N/A'}</span>
                    {product.material && (
                      <span className="material">Material: {product.material}</span>
                    )}
                  </div>

                  <div className="product-price">
                    {product.precio && (
                      <span>${product.precio.toLocaleString('es-CL')}</span>
                    )}
                  </div>
                </div>

                <div className="product-controls">
                  <div className="quantity-selector">
                    <button
                      className="btn-qty"
                      onClick={() =>
                        updateQuantity(product._id, product.cantidad - 1)
                      }
                      disabled={product.cantidad <= 1}
                    >
                      −
                    </button>

                    <input
                      type="number"
                      value={product.cantidad || 1}
                      min="1"
                      onChange={(e) =>
                        updateQuantity(product._id, parseInt(e.target.value) || 1)
                      }
                      className="qty-input"
                    />

                    <button
                      className="btn-qty"
                      onClick={() =>
                        updateQuantity(product._id, product.cantidad + 1)
                      }
                    >
                      +
                    </button>
                  </div>

                  <button
                    className="btn-delete"
                    onClick={() => removeItem(product._id)}
                    title="Eliminar producto"
                  >
                    🗑️ Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Columna derecha: Resumen */}
        <div className="quotation-summary-section">
          <QuotationSummary onProceed={() => setShowForm(true)} />
        </div>
      </div>

      {/* Modal del formulario */}
      {showForm && (
        <QuotationForm
          onClose={() => setShowForm(false)}
          onSuccess={() => setShowForm(false)}
        />
      )}
    </div>
  );
};

export default QuotationCart;
