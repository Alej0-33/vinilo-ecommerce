import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Package, 
  Calendar, 
  MapPin, 
  CreditCard, 
  Truck, 
  AlertCircle,
  Loader2,
  ShoppingBag
} from 'lucide-react';

const MyOrders = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
        navigate('/');
        return;
    }

    if (isAuthenticated) {
        fetchOrders();
    }
  }, [isAuthenticated, authLoading, navigate]);

  const fetchOrders = async () => {
    try {
        const token = localStorage.getItem('access_token');
        const response = await fetch(`${BASE_URL}/store/orders/`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            setOrders(data);
        } else {
            setError('No pudimos cargar tus pedidos.');
        }
    } catch (err) {
        setError('Error de conexión.');
    } finally {
        setLoading(false);
    }
  };

  const formatCOP = (value) => {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(value);
  };

  const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('es-CO', {
          year: 'numeric', month: 'long', day: 'numeric'
      });
  };

  const getStatusColor = (status) => {
      switch(status) {
          case 'PENDING': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
          case 'PAID': return 'bg-blue-50 text-blue-700 border-blue-100';
          case 'SHIPPED': return 'bg-purple-50 text-purple-700 border-purple-100';
          case 'DELIVERED': return 'bg-green-50 text-green-700 border-green-100';
          case 'CANCELED': return 'bg-red-50 text-red-700 border-red-100';
          default: return 'bg-gray-100 text-gray-600';
      }
  };

  const getStatusLabel = (status) => {
      const labels = {
          'PENDING': 'Pendiente',
          'PAID': 'Aprobado',
          'SHIPPED': 'Enviado',
          'DELIVERED': 'Entregado',
          'CANCELED': 'Cancelado'
      };
      return labels[status] || status;
  };

  if (authLoading || loading) {
      return (
          <div className="min-h-screen flex flex-col items-center justify-center bg-white py-20">
              <Loader2 className="animate-spin text-vinilo-black" size={32} />
              <p className="text-xs uppercase tracking-widest text-gray-400 mt-2">Cargando tus pedidos...</p>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      
      {/* ENCABEZADO DE PÁGINA */}
      <div className="max-w-6xl mx-auto mb-8">
          <div className="text-center">
              <h1 className="font-serif text-3xl md:text-4xl italic text-vinilo-black mb-2">
                  Mis Pedidos
              </h1>
              <p className="text-sm text-gray-500">
                  Hola <span className="font-bold text-vinilo-black">{user?.first_name}</span>, aquí puedes consultar el historial de tus compras.
              </p>
          </div>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <div className="max-w-6xl mx-auto">
        
        {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-3 text-sm mb-6 border border-red-100">
                <AlertCircle size={18} /> {error}
            </div>
        )}

        {orders.length === 0 && !error ? (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <ShoppingBag size={40} className="text-gray-400" />
                </div>
                <h3 className="font-serif text-2xl text-vinilo-black mb-2">Aún no tienes pedidos</h3>
                <p className="text-gray-500 text-sm max-w-md mx-auto mb-6 px-4">
                    Explora nuestra colección y dale un nuevo estilo a tus pasos.
                </p>
                <Link 
                    to="/catalogo" 
                    className="bg-vinilo-black text-white px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-vinilo-red transition-colors rounded-sm"
                >
                    Ir al Catálogo
                </Link>
            </div>
        ) : (
            <div className="space-y-6">
                {orders.map((order) => (
                    <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                        
                        {/* Order Header */}
                        <div className="p-6 border-b border-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${getStatusColor(order.status)}`}>
                                        {getStatusLabel(order.status)}
                                    </span>
                                    <span className="text-xs text-gray-400 font-mono">#{String(order.id).slice(0,8).toUpperCase()}</span>
                                </div>
                                <p className="text-xs text-gray-500 flex items-center gap-1">
                                    <Calendar size={12} /> {formatDate(order.created_at)}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-bold text-vinilo-black">{formatCOP(order.total_amount)}</p>
                                <p className="text-[10px] text-gray-400">{order.items.length} producto(s)</p>
                            </div>
                        </div>

                        {/* Order Details Grid */}
                        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 bg-white">
                            
                            {/* Lista Productos CON IMAGEN */}
                            <div className="space-y-4">
                                <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Productos</h4>
                                {order.items.map((item, idx) => (
                                    <div key={idx} className="flex items-start gap-3 pb-3 border-b border-gray-50 last:border-0">
                                        
                                        {/* IMAGEN DEL PRODUCTO */}
                                        {item.product_image ? (
                                            <img 
                                                src={item.product_image} 
                                                alt={item.product_name}
                                                className="w-14 h-14 object-cover rounded-md flex-shrink-0"
                                            />
                                        ) : (
                                            <div className="w-14 h-14 bg-gray-100 rounded-md flex items-center justify-center text-gray-300 flex-shrink-0">
                                                <Package size={20} />
                                            </div>
                                        )}
                                        
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-vinilo-black line-clamp-1">{item.product_name}</p>
                                            <p className="text-xs text-gray-500">Talla: {item.size} • Cant: {item.quantity}</p>
                                            <p className="text-xs font-medium text-gray-700 mt-1">{formatCOP(item.price)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Info de Envío */}
                            <div className="bg-gray-50 rounded-lg p-5 text-sm space-y-4 border border-gray-100 h-fit">
                                <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Detalles del Envío</h4>
                                
                                <div>
                                    <p className="font-bold text-vinilo-black mb-1 flex items-center gap-2">
                                        <MapPin size={14} /> Dirección de Entrega
                                    </p>
                                    <p className="text-gray-600 ml-6 text-xs">{order.shipping_address}, {order.city}</p>
                                </div>
                                
                                <div>
                                    <p className="font-bold text-vinilo-black mb-1 flex items-center gap-2">
                                        <CreditCard size={14} /> Método de Pago
                                    </p>
                                    <p className="text-gray-600 ml-6 text-xs">
                                        {order.payment_method === 'COD' ? 'Contraentrega' : 'Wompi'}
                                    </p>
                                </div>
                                
                                {order.tracking_number && (
                                    <div className="pt-3 border-t border-gray-200">
                                        <p className="font-bold text-blue-600 mb-1 flex items-center gap-2">
                                            <Truck size={14} /> Guía de Rastreo
                                        </p>
                                        <p className="text-gray-600 ml-6 font-mono text-xs">{order.tracking_number}</p>
                                        <span className="text-[10px] text-gray-400 ml-6 block mt-1">{order.shipping_company}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        
                        
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;