import React from 'react';
import { useQuotation } from '../context/QuotationContext';
import './QuotationSummary.css';

const QuotationSummary = ({ onProceed }) => {
  const { items, getTotals } = useQuotation();
  const { itemsCount, totalUnits } = getTotals();

  if (itemsCount === 0) {
    return null;
  }

  return (
    <div className="quotation-summary">
      <div className="summary-header">
        <h3>Resumen de Solicitud</h3>
      </div>

      <div className="summary-stats">
        <div className="stat">
          <span className="stat-label">Productos Distintos</span>
          <span className="stat-value">{itemsCount}</span>
        </div>
        <div className="stat divider">
          <span className="stat-label">Total de Unidades</span>
          <span className="stat-value">{totalUnits}</span>
        </div>
      </div>

      <div className="summary-separator"></div>

      <div className="summary-message">
        <p>
          💬 Revisaremos los detalles de tu orden y te contactaremos muy pronto con tu cotización personalizada.
        </p>
      </div>

      <button
        className="btn btn-primary btn-primary-gold"
        onClick={onProceed}
      >
        ✨ Enviar Solicitud
      </button>

      <div className="summary-benefits">
        <div className="benefit">
          <span className="benefit-icon">📱</span>
          <span className="benefit-text">Contacto directo</span>
        </div>
        <div className="benefit">
          <span className="benefit-icon">⚡</span>
          <span className="benefit-text">Respuesta rápida</span>
        </div>
        <div className="benefit">
          <span className="benefit-icon">💎</span>
          <span className="benefit-text">Asesoría premium</span>
        </div>
      </div>
    </div>
  );
};

export default QuotationSummary;
