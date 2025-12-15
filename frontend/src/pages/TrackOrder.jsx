import React, { useState } from 'react';
import { Search, Package, Truck, CheckCircle, MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const TrackOrder = () => {
  const [orderId, setOrderId] = useState('');
  const [searchStatus, setSearchStatus] = useState('idle'); // idle, searching, found, error

  const handleSearch = (e) => {
    e.preventDefault();
    if (!orderId) return;
    
    setSearchStatus('searching');
    
    // Simulamos una búsqueda
    setTimeout(() => {
      // Aquí conectarías con tu backend. Por ahora simulamos éxito si escribe algo.
      setSearchStatus('found');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-10 pb-20">
      <div className="container mx-auto px-6">
        
        {/* Encabezado */}
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h1 className="font-serif text-3xl md:text-4xl text-vinilo-black mb-4">Rastrear Pedido</h1>
          <p className="text-gray-500 text-sm">
            Ingresa el número de referencia de tu pedido para ver el estado actual de tu envío.
          </p>
        </div>

        {/* Formulario de Búsqueda */}
        <div className="max-w-xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-12">
          <form onSubmit={handleSearch} className="relative">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  type="text" 
                  placeholder="Ej: ORD-25930"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-vinilo-black transition-colors"
                />
              </div>
              <button 
                type="submit"
                className="bg-vinilo-black text-white px-8 py-3 rounded-lg font-medium hover:bg-vinilo-red transition-colors flex items-center justify-center gap-2"
              >
                {searchStatus === 'searching' ? 'Buscando...' : 'Rastrear'}
                <Search size={18} />
              </button>
            </div>
          </form>
        </div>

        {/* Resultado Simulado (Se muestra al dar click en buscar) */}
        {searchStatus === 'found' && (
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Pedido #{orderId}</p>
                  <p className="text-sm text-green-600 font-medium mt-1">En Tránsito</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">Fecha estimada</p>
                  <p className="text-sm text-vinilo-black font-medium">18 Dic, 2025</p>
                </div>
              </div>
              
              <div className="p-8">
                {/* Timeline */}
                <div className="relative">
                  {/* Línea conectora */}
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-100"></div>

                  <div className="space-y-8 relative">
                    {/* Step 1 */}
                    <div className="flex gap-4">
                      <div className="relative z-10 w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center border-2 border-white shadow-sm">
                        <CheckCircle size={14} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-vinilo-black">Pedido Confirmado</p>
                        <p className="text-xs text-gray-400 mt-1">14 Dic, 10:30 AM</p>
                        <p className="text-xs text-gray-500 mt-2">Hemos recibido tu orden y estamos preparándola.</p>
                      </div>
                    </div>

                    {/* Step 2 (Current) */}
                    <div className="flex gap-4">
                      <div className="relative z-10 w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center border-2 border-white shadow-sm ring-4 ring-blue-50">
                        <Truck size={14} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-blue-600">En Camino</p>
                        <p className="text-xs text-gray-400 mt-1">15 Dic, 08:45 AM</p>
                        <p className="text-xs text-gray-500 mt-2">Tu pedido ha salido de nuestro centro de distribución en Medellín.</p>
                      </div>
                    </div>

                    {/* Step 3 */}
                    <div className="flex gap-4 opacity-50">
                      <div className="relative z-10 w-8 h-8 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center border-2 border-white">
                        <MapPin size={14} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-500">En Reparto</p>
                        <p className="text-xs text-gray-400 mt-1">Pendiente</p>
                      </div>
                    </div>

                    {/* Step 4 */}
                    <div className="flex gap-4 opacity-50">
                      <div className="relative z-10 w-8 h-8 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center border-2 border-white">
                        <Package size={14} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-500">Entregado</p>
                        <p className="text-xs text-gray-400 mt-1">Pendiente</p>
                      </div>
                    </div>
                  </div>
                </div>
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

export default TrackOrder;