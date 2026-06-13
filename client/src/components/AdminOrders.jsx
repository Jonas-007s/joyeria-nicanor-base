import React, { useState, useEffect } from 'react';
import { Package, Clock, CheckCircle, Truck, XCircle, Search } from 'lucide-react';

function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('all');

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await fetch(`${API_URL}/orders`);
            if (!response.ok) throw new Error('Error al cargar órdenes');
            const data = await response.json();
            setOrders(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            const response = await fetch(`${API_URL}/orders/${orderId}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });

            if (!response.ok) throw new Error('Error al actualizar estado');

            const updatedOrder = await response.json();
            setOrders(prev => prev.map(o => o._id === updatedOrder._id ? updatedOrder : o));
        } catch (err) {
            alert('Error updating status: ' + err.message);
        }
    };

    const getStatusConfig = (status) => {
        switch (status) {
            case 'pending': return { color: 'text-yellow-600 bg-yellow-50', icon: <Clock size={14} /> };
            case 'confirmed': return { color: 'text-blue-600 bg-blue-50', icon: <CheckCircle size={14} /> };
            case 'shipped': return { color: 'text-purple-600 bg-purple-50', icon: <Truck size={14} /> };
            case 'completed': return { color: 'text-green-600 bg-green-50', icon: <CheckCircle size={14} /> };
            case 'cancelled': return { color: 'text-red-600 bg-red-50', icon: <XCircle size={14} /> };
            default: return { color: 'text-gray-600 bg-gray-50', icon: <Package size={14} /> };
        }
    };

    const filteredOrders = filter === 'all'
        ? orders
        : orders.filter(o => o.status === filter);

    if (loading) return <div className="p-12 text-center text-gray-400 text-sm tracking-wider uppercase">Cargando pedidos...</div>;
    if (error) return <div className="p-12 text-center text-red-500">{error}</div>;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div className="flex items-center gap-3">
                    <Package size={24} className="text-black" />
                    <h2 className="text-xl font-bold text-gray-900 tracking-wide">GESTIÓN DE PEDIDOS</h2>
                </div>

                <div className="relative">
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="appearance-none bg-gray-50 border border-gray-200 rounded-lg pl-4 pr-10 py-2 text-sm font-medium text-gray-700 focus:outline-none focus:ring-1 focus:ring-black cursor-pointer hover:bg-gray-100 transition-colors"
                    >
                        <option value="all">Todos los Estados</option>
                        <option value="pending">Pendientes</option>
                        <option value="confirmed">Confirmados</option>
                        <option value="shipped">Enviados</option>
                        <option value="completed">Completados</option>
                        <option value="cancelled">Cancelados</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-gray-100">
                            <th className="px-4 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">ID / Fecha</th>
                            <th className="px-4 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Cliente</th>
                            <th className="px-4 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Items</th>
                            <th className="px-4 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Total</th>
                            <th className="px-4 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Estado</th>
                            <th className="px-4 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Acción</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {filteredOrders.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="px-4 py-16 text-center text-gray-400">
                                    <Package size={32} className="mx-auto mb-2 opacity-20" />
                                    No hay pedidos que coincidan con el filtro.
                                </td>
                            </tr>
                        ) : (
                            filteredOrders.map(order => {
                                const statusConfig = getStatusConfig(order.status);
                                return (
                                    <tr key={order._id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-4 py-4 align-top">
                                            <span className="block font-mono text-xs text-gray-900 mb-1">#{order._id.slice(-6).toUpperCase()}</span>
                                            <div className="text-xs text-gray-400">
                                                {new Date(order.createdAt).toLocaleDateString()}
                                                <br />
                                                {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 align-top">
                                            <div className="font-bold text-sm text-gray-900">{order.customer.name}</div>
                                            <div className="text-xs text-gray-500 font-mono mt-0.5">{order.customer.email}</div>
                                            <div className="text-xs text-gray-400 mt-0.5">{order.customer.phone}</div>
                                            {order.notes && (
                                                <div className="mt-2 text-xs bg-yellow-50 text-yellow-800 p-2 rounded border border-yellow-100 inline-block max-w-[200px]">
                                                    "{order.notes}"
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-4 py-4 align-top">
                                            <div className="space-y-1">
                                                {order.items.map((item, idx) => (
                                                    <div key={idx} className="text-sm text-gray-600 flex items-center gap-2">
                                                        <span className="font-bold text-gray-900">{item.cantidad}×</span>
                                                        <span className="truncate max-w-[150px]">{item.nombre}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 align-top">
                                            <span className="font-mono font-medium text-gray-900">
                                                ${order.total.toLocaleString()}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 align-top">
                                            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border border-transparent ${statusConfig.color.replace('text-', 'border-').replace('bg-', 'bg-opacity-10 ')}`}>
                                                {statusConfig.icon}
                                                <span className="uppercase">{order.status}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 align-top text-right">
                                            <select
                                                value={order.status}
                                                onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                                className="text-xs border border-gray-200 rounded px-2 py-1.5 bg-white text-gray-700 focus:ring-1 focus:ring-black focus:border-black outline-none cursor-pointer"
                                            >
                                                <option value="pending">Pendiente</option>
                                                <option value="confirmed">Confirmado</option>
                                                <option value="shipped">Enviado</option>
                                                <option value="completed">Completado</option>
                                                <option value="cancelled">Cancelado</option>
                                            </select>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AdminOrders;
