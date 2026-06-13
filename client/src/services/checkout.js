const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const createOrder = async (orderData) => {
    try {
        const response = await fetch(`${API_URL}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al procesar la orden');
        }

        return await response.json();
    } catch (error) {
        console.error('Checkout error:', error);
        throw error;
    }
};
