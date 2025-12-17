import React, { useState } from 'react';
import { Search, Package, Truck, CheckCircle, MapPin, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const TrackOrder = () => {
  const [orderId, setOrderId] = useState('');
  const [searchStatus, setSearchStatus] = useState('idle'); // idle, searching, found, error
  const [orderData, setOrderData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Configura tu URL base (idealmente desde variables de entorno)
  const BASE_URL = import.meta.VITE_API_URL;

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!orderId) return;
    
    setSearchStatus('searching');
    setErrorMessage('');
    setOrderData(null);

    try {
      // Hacemos la petición al nuevo endpoint
      const response = await fetch(`${BASE_URL}/track/${orderId}/`);
      const data = await response.json();

      if (response.ok) {
        setOrderData(data);
        setSearchStatus('found');
      } else {
        setSearchStatus('error');
        setErrorMessage(data.error || 'No pudimos encontrar tu pedido.');
      }
    } catch (error) {
      setSearchStatus('error');
      setErrorMessage('Error de conexión. Intenta nuevamente.');
    }
  };

  // Ayudante para determinar qué paso está activo basado en el status de Django
  const getStepStatus = (currentStatus) => {
    const steps = {
      'PENDING': 1,   // Confirmado
      'PAID': 1,      // Confirmado (Preparando)
      'SHIPPED': 2,   // En Camino
      'DELIVERED': 4, // Entregado (Saltamos reparto por simplicidad o lo mapeamos)
      'CANCELED': -1
    };
    return steps[currentStatus] || 1;
  };

  // Renderizar la línea de tiempo dinámica
  const renderTimeline = (status, date, trackingNumber, company) => {
    const currentStep = getStepStatus(status);
    
    if (status === 'CANCELED') {
      return (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-3">
          <AlertCircle />
          <p className="font-medium">Este pedido ha sido cancelado.</p>
        </div>
      );
    }

    return (
      <div className="relative">
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-100"></div>
        <div className="space-y-8 relative">
          
          {/* Step 1: Confirmado (Siempre activo si existe la orden) */}
          <TimelineStep 
            active={currentStep >= 1}
            icon={CheckCircle}
            title="Pedido Confirmado"
            date={date} // Fecha de creación
            desc="Hemos recibido tu orden y estamos preparándola."
            color="green"
          />

          {/* Step 2: En Camino */}
          <TimelineStep 
            active={currentStep >= 2}
            icon={Truck}
            title="Enviado"
            date={currentStep >= 2 ? "Despachado" : "Pendiente"}
            desc={currentStep >= 2 
              ? `Tu pedido ha sido entregado a la transportadora ${company || ''}. Guía: ${trackingNumber || 'Por generar'}`
              : "Estamos empacando tu pedido."}
            color="blue"
          />

          {/* Step 3: Entregado */}
          <TimelineStep 
            active={currentStep >= 4}
            icon={Package}
            title="Entregado"
            date={currentStep >= 4 ? "Finalizado" : "Pendiente"}
            desc="El paquete ha llegado a su destino."
            color="purple"
            isLast={true}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-10 pb-20">
      <div className="container mx-auto px-6">
        
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h1 className="font-serif text-3xl md:text-4xl text-vinilo-black mb-4">Rastrear Pedido</h1>
          <p className="text-gray-500 text-sm">
            Ingresa el ID (UUID) que recibiste en tu correo para ver el estado.
          </p>
        </div>

        {/* Formulario */}
        <div className="max-w-xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-12">
          <form onSubmit={handleSearch} className="relative">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  type="text" 
                  placeholder="Ej: 550e8400-e29b-41d4..."
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value.trim())} // Trim para evitar espacios accidentales
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-vinilo-black transition-colors"
                />
              </div>
              <button 
                type="submit"
                disabled={searchStatus === 'searching'}
                className="bg-vinilo-black text-white px-8 py-3 rounded-lg font-medium hover:bg-vinilo-red transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {searchStatus === 'searching' ? 'Buscando...' : 'Rastrear'}
                <Search size={18} />
              </button>
            </div>
          </form>
          {/* Mensaje de Error */}
          {searchStatus === 'error' && (
            <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
              <AlertCircle size={16} />
              {errorMessage}
            </div>
          )}
        </div>

        {/* Resultado */}
        {searchStatus === 'found' && orderData && (
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-50/50 gap-4">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Pedido Ref</p>
                  <p className="text-xs font-mono text-gray-500 mt-1 break-all">{orderData.id}</p>
                  <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold ${
                    orderData.status === 'CANCELED' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {orderData.status_display}
                  </span>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-xs text-gray-400">Destino</p>
                  <p className="text-sm text-vinilo-black font-medium">{orderData.city}</p>
                </div>
              </div>
              
              <div className="p-8">
                {renderTimeline(
                  orderData.status, 
                  orderData.created_at_formatted, 
                  orderData.tracking_number,
                  orderData.shipping_company
                )}
              </div>
            </div>
            
            <div className="mt-8 text-center">
               <Link to="/contact" className="text-sm text-vinilo-red font-medium hover:underline">
                 ¿Tienes problemas con tu envío? Contáctanos
               </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Subcomponente para cada paso de la línea de tiempo (para limpiar el código)
const TimelineStep = ({ active, icon: Icon, title, date, desc, color }) => {
  const activeColorClass = active 
    ? (color === 'green' ? 'bg-green-100 text-green-600 ring-green-50' : 
       color === 'blue' ? 'bg-blue-100 text-blue-600 ring-blue-50' : 
       'bg-purple-100 text-purple-600 ring-purple-50')
    : 'bg-gray-100 text-gray-400 border-gray-100';

  const textColorClass = active 
    ? (color === 'green' ? 'text-green-700' : 
       color === 'blue' ? 'text-blue-700' : 
       'text-purple-700')
    : 'text-gray-500';

  return (
    <div className={`flex gap-4 ${!active && 'opacity-60 grayscale'}`}>
      <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center border-2 border-white shadow-sm ring-4 ${active ? '' : 'ring-transparent'} ${activeColorClass}`}>
        <Icon size={14} />
      </div>
      <div>
        <p className={`text-sm font-bold ${textColorClass}`}>{title}</p>
        <p className="text-xs text-gray-400 mt-1">{date}</p>
        {desc && <p className="text-xs text-gray-500 mt-2 max-w-xs">{desc}</p>}
      </div>
    </div>
  );
};

export default TrackOrder;