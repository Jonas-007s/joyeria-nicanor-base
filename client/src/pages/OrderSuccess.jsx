import React from 'react';
import { Link } from 'react-router-dom';

function OrderSuccess() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
            <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-4">¡Pedido Recibido!</h1>
                <p className="text-gray-600 mb-8">
                    Gracias por tu compra. Nos pondremos en contacto contigo pronto para coordinar el envío y el pago.
                </p>
                <div className="space-y-3">
                    <Link to="/" className="btn-primary w-full block text-center py-3">
                        VOLVER AL INICIO
                    </Link>
                    <Link to="/productos" className="btn-outline w-full block text-center py-3">
                        SEGUIR COMPRANDO
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default OrderSuccess;
