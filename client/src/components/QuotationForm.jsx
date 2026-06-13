import React, { useState, useEffect } from 'react';
import { useQuotation } from '../context/QuotationContext';
import './QuotationForm.css';

const QuotationForm = ({ onClose, onSuccess }) => {
  const {
    cliente,
    comentarios,
    updateCliente,
    setComentarios,
    submitQuotation,
    loading,
    error,
    success
  } = useQuotation();

  const [formData, setFormData] = useState(cliente);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    setFormData(cliente);
  }, [cliente]);

  const validateForm = () => {
    const errors = {};

    if (!formData.nombre.trim()) {
      errors.nombre = 'El nombre es obligatorio';
    }

    if (!formData.telefono.trim()) {
      errors.telefono = 'El teléfono es obligatorio';
    } else if (!/^(\+?56)?[9]\d{8}$/.test(formData.telefono.replace(/[^0-9+]/g, ''))) {
      errors.telefono = 'Formato de teléfono inválido';
    }

    if (formData.correo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) {
      errors.correo = 'Email inválido';
    }

    return errors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setValidationErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    updateCliente(formData);

    try {
      await submitQuotation();
      if (onSuccess) {
        setTimeout(() => onSuccess(), 1500);
      }
    } catch (err) {
      console.error('Error enviando solicitud:', err);
    }
  };

  return (
    <div className="quotation-form-overlay" onClick={onClose}>
      <div className="quotation-form-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>✕</button>

        <div className="form-header">
          <h2>Completar Solicitud</h2>
          <p>Comparte tus datos para que nos pongamos en contacto</p>
        </div>

        {error && (
          <div className="alert alert-error">
            <span>⚠️ {error}</span>
          </div>
        )}

        {success && (
          <div className="alert alert-success">
            <span>✓ Solicitud enviada exitosamente</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="quotation-form">
          <div className="form-group">
            <label htmlFor="nombre">Nombre Completo *</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              placeholder="Tu nombre completo"
              required
              className={validationErrors.nombre ? 'error' : ''}
            />
            {validationErrors.nombre && (
              <span className="error-message">{validationErrors.nombre}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="telefono">Teléfono *</label>
            <input
              type="tel"
              id="telefono"
              name="telefono"
              value={formData.telefono}
              onChange={handleInputChange}
              placeholder="+56 9 12345678"
              required
              className={validationErrors.telefono ? 'error' : ''}
            />
            {validationErrors.telefono && (
              <span className="error-message">{validationErrors.telefono}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="correo">Correo Electrónico</label>
            <input
              type="email"
              id="correo"
              name="correo"
              value={formData.correo}
              onChange={handleInputChange}
              placeholder="tu@email.com"
              className={validationErrors.correo ? 'error' : ''}
            />
            {validationErrors.correo && (
              <span className="error-message">{validationErrors.correo}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="ciudad">Ciudad</label>
            <input
              type="text"
              id="ciudad"
              name="ciudad"
              value={formData.ciudad}
              onChange={handleInputChange}
              placeholder="Tu ciudad"
            />
          </div>

          <div className="form-group">
            <label htmlFor="comentarios">Comentarios Adicionales</label>
            <textarea
              id="comentarios"
              value={comentarios}
              onChange={(e) => setComentarios(e.target.value)}
              placeholder="Cuéntanos más sobre lo que buscas..."
              rows="4"
              maxLength="500"
            />
            <span className="char-count">{comentarios.length}/500</span>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Enviando...
                </>
              ) : (
                '✓ Enviar Solicitud'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuotationForm;
