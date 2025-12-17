import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ChevronLeft, MapPin, CreditCard, Truck, Lock, ShieldCheck, CheckCircle, Package, Gift, User } from 'lucide-react';

import ProgressBar from '../components/ui/ProgressBar';

// Assets
import visa from '../assets/visa.png';
import mastercard from '../assets/mastercard.png';
import nequi from '../assets/nequi.png';
import pse from '../assets/pse.png';
import bancolombia from '../assets/bancolombia.png';

const BASE_URL = import.meta.env.VITE_API_URL;

// Helper para formatear moneda colombiana
const formatCOP = (value) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);

  // Configuración de envío desde el backend
  const [storeConfig, setStoreConfig] = useState({
    shipping_cost_cod: 15000,
    free_shipping_threshold: null,
    is_cod_enabled: true,
    is_wompi_enabled: false
  });

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    cedula: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    department: '',
    zipCode: '',
    notes: ''
  });

  // Autocompletar datos si el usuario está logueado
  useEffect(() => {
    if (isAuthenticated && user) {
      setFormData(prev => ({
        ...prev,
        firstName: user.first_name || '',
        lastName: user.last_name || '',
        email: user.email || '',
      }));
    }
  }, [isAuthenticated, user]);

  // Cargar configuración de tienda
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch(`${BASE_URL}/store/config/`);
        if (response.ok) {
          const data = await response.json();
          setStoreConfig(data);
        }
      } catch (error) {
        console.error('Error cargando configuración:', error);
      }
    };
    fetchConfig();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Calcular costo de envío
  const calculateShipping = () => {
    if (storeConfig.free_shipping_threshold && cartTotal >= storeConfig.free_shipping_threshold) {
      return 0;
    }
    return Number(storeConfig.shipping_cost_cod) || 0;
  };

  const shippingCost = calculateShipping();
  const totalToPay = cartTotal + shippingCost;

  // Calcular cuánto falta para envío gratis
  const amountForFreeShipping = storeConfig.free_shipping_threshold 
    ? Math.max(0, storeConfig.free_shipping_threshold - cartTotal) 
    : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (paymentMethod === 'wompi' || loading) return;

    setLoading(true);

    const orderData = {
      customer_name: `${formData.firstName} ${formData.lastName}`,
      customer_id_number: formData.cedula,
      customer_email: formData.email,
      customer_phone: formData.phone,
      shipping_address: formData.address,
      city: formData.city,
      shipping_department: formData.department,
      zip_code: formData.zipCode,
      notes: formData.notes,
      payment_method: 'COD',
      items: cartItems.map(item => ({
        product_id: item.id,
        product_name: item.name,
        size: item.selectedSize,
        quantity: item.quantity,
        price: item.price
      }))
    };

    try {
      const response = await fetch(`${BASE_URL}/store/orders/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      });

      const data = await response.json();

      if (response.ok) {
        setOrderSuccess(data.order);
        clearCart();
      } else {
        alert('Error al procesar el pedido. Por favor intenta de nuevo.');
        console.error('Error:', data);
      }
    } catch (error) {
      alert('Error de conexión. Por favor intenta de nuevo.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Pantalla de éxito
  if (orderSuccess) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6 py-12">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <CheckCircle size={40} className="text-green-600" />
          </div>
          
          <h1 className="font-serif text-3xl text-vinilo-black mb-3">¡Pedido Confirmado!</h1>
          <p className="text-gray-500 mb-6">
            Tu pedido ha sido recibido y está siendo procesado.
          </p>
          
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl mb-6 text-left border border-gray-200">
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200">
              <Package className="text-vinilo-red" size={24} />
              <div>
                <p className="text-[10px] font-bold uppercase text-gray-400">Número de Pedido</p>
                <p className="font-mono text-lg text-vinilo-black font-bold">
                  #{String(orderSuccess.id).slice(0, 8).toUpperCase()}
                </p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span>{formatCOP(orderSuccess.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Envío</span>
                {Number(orderSuccess.shipping_cost) === 0 ? (
                  <span className="text-green-600 font-bold">GRATIS</span>
                ) : (
                  <span>{formatCOP(orderSuccess.shipping_cost)}</span>
                )}
              </div>
              <div className="flex justify-between pt-3 mt-3 border-t border-gray-200">
                <span className="font-bold text-vinilo-black">Total a Pagar</span>
                <span className="text-xl font-bold text-vinilo-red">
                  {formatCOP(orderSuccess.total_amount)}
                </span>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-dashed border-gray-300">
              <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">Método de Pago</p>
              <p className="text-sm text-vinilo-black flex items-center gap-2">
                <Truck size={14} /> Pago Contraentrega
              </p>
            </div>
          </div>

          <p className="text-sm text-gray-500 mb-6">
            Recibirás un correo de confirmación en <strong>{orderSuccess.customer_email}</strong>
          </p>
          
          <Link 
            to="/catalogo" 
            className="inline-block bg-vinilo-black text-white px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-vinilo-red transition-colors"
          >
            Seguir Comprando
          </Link>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6">
        <h2 className="font-serif text-3xl mb-4 text-vinilo-black">Tu bolsa está vacía</h2>
        <Link 
          to="/catalogo" 
          className="text-xs font-bold uppercase tracking-widest text-vinilo-red border-b border-vinilo-red pb-1 hover:text-vinilo-black hover:border-vinilo-black transition-colors"
        >
          Volver al catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pb-24">
      
      {/* Top Bar */}
      <div className="border-b border-gray-100 sticky top-0 bg-white/95 backdrop-blur z-20 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="w-full md:w-auto flex justify-start">
              <Link to="/catalogo" className="text-gray-400 hover:text-vinilo-black transition-colors flex items-center gap-1 group text-xs uppercase font-bold tracking-widest">
                <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                <span className="hidden sm:inline">Volver</span>
              </Link>
            </div>
            <div className="flex-1 flex justify-center">
              <ProgressBar currentStep={2} />
            </div>
            <div className="w-full md:w-auto flex justify-end">
              <div className="flex items-center gap-1 text-green-600 text-[10px] font-bold uppercase tracking-widest bg-green-50 px-2 py-1 rounded-full border border-green-100">
                <ShieldCheck size={12} /> 
                <span>Checkout Seguro</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-12 lg:gap-20">
            
          {/* COLUMNA IZQUIERDA: FORMULARIO */}
          <div className="flex-1 space-y-10 animate-fade-in-up">
            
            {isAuthenticated && user && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <User size={20} className="text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-green-800">
                    ¡Hola, {user.first_name || 'Usuario'}!
                  </p>
                  <p className="text-xs text-green-600">
                    Hemos autocompletado algunos datos para agilizar tu compra.
                  </p>
                </div>
                <CheckCircle size={20} className="text-green-500" />
              </div>
            )}

            {/* Información de Envío */}
            <section>
              <h2 className="font-serif text-xl mb-6 flex items-center gap-2 text-vinilo-black">
                <MapPin size={18} className="text-vinilo-red" /> 
                Información de Envío
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1">
                  <label htmlFor="firstName" className="text-xs font-bold uppercase text-gray-500">Nombre *</label>
                  <input 
                    id="firstName"
                    required 
                    type="text" 
                    name="firstName" 
                    autoComplete="given-name" 
                    value={formData.firstName} 
                    onChange={handleInputChange} 
                    className={`w-full border p-3 text-sm focus:outline-none focus:border-vinilo-black transition-colors rounded-sm ${
                      formData.firstName && isAuthenticated ? 'border-green-300 bg-green-50/50' : 'border-gray-200 bg-vinilo-gray/20'
                    }`}
                    placeholder="Ej. Ana" 
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="lastName" className="text-xs font-bold uppercase text-gray-500">Apellido *</label>
                  <input 
                    id="lastName"
                    required 
                    type="text" 
                    name="lastName" 
                    autoComplete="family-name"
                    value={formData.lastName} 
                    onChange={handleInputChange} 
                    className={`w-full border p-3 text-sm focus:outline-none focus:border-vinilo-black transition-colors rounded-sm ${
                      formData.lastName && isAuthenticated ? 'border-green-300 bg-green-50/50' : 'border-gray-200 bg-vinilo-gray/20'
                    }`}
                    placeholder="Ej. Pérez" 
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="cedula" className="text-xs font-bold uppercase text-gray-500">Cédula / CC *</label>
                  <input 
                    id="cedula"
                    required 
                    type="text" 
                    name="cedula"
                    autoComplete="off" 
                    value={formData.cedula} 
                    onChange={handleInputChange} 
                    className="w-full border border-gray-200 p-3 text-sm focus:outline-none focus:border-vinilo-black transition-colors bg-vinilo-gray/20 rounded-sm" 
                    placeholder="1234567890" 
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="phone" className="text-xs font-bold uppercase text-gray-500">Teléfono *</label>
                  <input 
                    id="phone"
                    required 
                    type="tel" 
                    name="phone"
                    autoComplete="tel" 
                    value={formData.phone} 
                    onChange={handleInputChange} 
                    className="w-full border border-gray-200 p-3 text-sm focus:outline-none focus:border-vinilo-black transition-colors bg-vinilo-gray/20 rounded-sm" 
                    placeholder="300 123 4567" 
                  />
                </div>
                <div className="md:col-span-2 space-y-1">
                  <label htmlFor="email" className="text-xs font-bold uppercase text-gray-500">Correo Electrónico *</label>
                  <input 
                    id="email"
                    required 
                    type="email" 
                    name="email"
                    autoComplete="email" 
                    value={formData.email} 
                    onChange={handleInputChange} 
                    className={`w-full border p-3 text-sm focus:outline-none focus:border-vinilo-black transition-colors rounded-sm ${
                      formData.email && isAuthenticated ? 'border-green-300 bg-green-50/50' : 'border-gray-200 bg-vinilo-gray/20'
                    }`}
                    placeholder="correo@ejemplo.com" 
                  />
                </div>
                <div className="md:col-span-2 space-y-1">
                  <label htmlFor="address" className="text-xs font-bold uppercase text-gray-500">Dirección Completa *</label>
                  <input 
                    id="address"
                    required 
                    type="text" 
                    name="address"
                    autoComplete="street-address" 
                    value={formData.address} 
                    onChange={handleInputChange} 
                    className="w-full border border-gray-200 p-3 text-sm focus:outline-none focus:border-vinilo-black transition-colors bg-vinilo-gray/20 rounded-sm" 
                    placeholder="Calle 123 # 45 - 67, Apto 201" 
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="department" className="text-xs font-bold uppercase text-gray-500">Departamento *</label>
                  <input 
                    id="department"
                    required 
                    type="text" 
                    name="department"
                    autoComplete="address-level1" 
                    value={formData.department} 
                    onChange={handleInputChange} 
                    className="w-full border border-gray-200 p-3 text-sm focus:outline-none focus:border-vinilo-black transition-colors bg-vinilo-gray/20 rounded-sm" 
                    placeholder="Antioquia" 
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="city" className="text-xs font-bold uppercase text-gray-500">Ciudad *</label>
                  <input 
                    id="city"
                    required 
                    type="text" 
                    name="city"
                    autoComplete="address-level2" 
                    value={formData.city} 
                    onChange={handleInputChange} 
                    className="w-full border border-gray-200 p-3 text-sm focus:outline-none focus:border-vinilo-black transition-colors bg-vinilo-gray/20 rounded-sm" 
                    placeholder="Medellín" 
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="zipCode" className="text-xs font-bold uppercase text-gray-500">Código Postal</label>
                  <input 
                    id="zipCode"
                    type="text" 
                    name="zipCode"
                    autoComplete="postal-code" 
                    value={formData.zipCode} 
                    onChange={handleInputChange} 
                    className="w-full border border-gray-200 p-3 text-sm focus:outline-none focus:border-vinilo-black transition-colors bg-vinilo-gray/20 rounded-sm" 
                  />
                </div>
                <div className="md:col-span-2 space-y-1 mt-2">
                  <label htmlFor="notes" className="text-xs font-bold uppercase text-gray-500">Notas Adicionales (Opcional)</label>
                  <textarea 
                    id="notes"
                    name="notes" 
                    rows="2" 
                    value={formData.notes} 
                    onChange={handleInputChange} 
                    className="w-full border border-gray-200 p-3 text-sm focus:outline-none focus:border-vinilo-black transition-colors bg-vinilo-gray/20 rounded-sm" 
                    placeholder="Dejar en portería, edificio blanco..." 
                  />
                </div>
              </div>
            </section>

            {/* Método de Pago */}
            <section className="animate-fade-in delay-100">
              <h2 className="font-serif text-xl mb-6 flex items-center gap-2 text-vinilo-black">
                <CreditCard size={18} className="text-vinilo-red" /> 
                Método de Pago
              </h2>

              <div className="space-y-4">
                {/* Contraentrega */}
                {storeConfig.is_cod_enabled && (
                  <div 
                    onClick={() => setPaymentMethod('cod')}
                    className={`border rounded-lg p-5 cursor-pointer transition-all flex items-start gap-4 ${paymentMethod === 'cod' ? 'border-vinilo-black bg-gray-50 ring-1 ring-vinilo-black' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <div className={`mt-1 w-4 h-4 rounded-full border border-gray-400 flex items-center justify-center ${paymentMethod === 'cod' ? 'border-vinilo-red' : ''}`}>
                      {paymentMethod === 'cod' && <div className="w-2 h-2 rounded-full bg-vinilo-red" />}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-sm text-vinilo-black flex items-center gap-2">
                        Pago Contraentrega <Truck size={14} />
                      </h3>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                        Pagas en efectivo cuando recibas el pedido en la puerta de tu casa.
                      </p>
                    </div>
                  </div>
                )}

                {/* Wompi */}
                <div 
                  onClick={() => storeConfig.is_wompi_enabled && setPaymentMethod('wompi')}
                  className={`border rounded-lg p-5 transition-all flex items-start gap-4 ${
                    !storeConfig.is_wompi_enabled 
                      ? 'opacity-50 cursor-not-allowed border-gray-200' 
                      : paymentMethod === 'wompi' 
                        ? 'border-vinilo-black bg-gray-50 ring-1 ring-vinilo-black cursor-pointer' 
                        : 'border-gray-200 hover:border-gray-300 cursor-pointer'
                  }`}
                >
                  <div className={`mt-1 w-4 h-4 rounded-full border border-gray-400 flex items-center justify-center ${paymentMethod === 'wompi' ? 'border-vinilo-red' : ''}`}>
                    {paymentMethod === 'wompi' && <div className="w-2 h-2 rounded-full bg-vinilo-red" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-bold text-sm text-vinilo-black">Pagar con Wompi</h3>
                      <div className="flex -space-x-2 grayscale opacity-70">
                        <img src={visa} alt="Visa" className="h-5 object-contain bg-white rounded-full border border-gray-100" />
                        <img src={mastercard} alt="MC" className="h-5 object-contain bg-white rounded-full border border-gray-100" />
                        <img src={nequi} alt="Nequi" className="h-5 object-contain bg-white rounded-full border border-gray-100" />
                        <img src={pse} alt="PSE" className="h-5 object-contain bg-white rounded-full border border-gray-100" />
                        <img src={bancolombia} alt="Bancolombia" className="h-5 object-contain bg-white rounded-full border border-gray-100" />
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Tarjetas de Crédito, Débito, PSE, Nequi y Bancolombia.
                      {!storeConfig.is_wompi_enabled && (
                        <span className="block text-vinilo-red font-bold mt-1">(Próximamente disponible)</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* COLUMNA DERECHA: RESUMEN */}
          <div className="w-full lg:w-[420px] flex-shrink-0 animate-fade-in-up">
            <div className="bg-gradient-to-br from-gray-50 to-white p-6 md:p-8 sticky top-24 border border-gray-200 rounded-xl shadow-lg">
              
              {/* Header del resumen */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                <h3 className="font-serif text-xl text-vinilo-black">Resumen</h3>
                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                  {cartItems.reduce((sum, item) => sum + item.quantity, 0)} productos
                </span>
              </div>
              
              {/* Lista de productos */}
              <div className="space-y-4 max-h-[250px] overflow-y-auto mb-6 pr-2 custom-scrollbar">
                {cartItems.map((item, index) => (
                  <div key={`${item.id}-${index}`} className="flex gap-4 items-start bg-white p-3 rounded-lg border border-gray-100">
                    <div className="w-14 h-16 bg-gray-100 flex-shrink-0 relative overflow-hidden rounded-md">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      <span className="absolute -top-1 -right-1 bg-vinilo-black text-white text-[9px] w-5 h-5 flex items-center justify-center rounded-full font-bold">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-vinilo-black uppercase leading-tight truncate">{item.name}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">Talla: {item.selectedSize}</p>
                      <p className="text-sm text-vinilo-black mt-1 font-bold">{formatCOP(item.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desglose de precios */}
              <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
                
                {/* Subtotal */}
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="text-vinilo-black font-medium">{formatCOP(cartTotal)}</span>
                </div>
                
                {/* Envío */}
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 flex items-center gap-1">
                    <Truck size={14} /> Envío Nacional
                  </span>
                  {shippingCost === 0 ? (
                    <span className="text-green-600 font-bold flex items-center gap-1">
                      <Gift size={14} /> ¡GRATIS!
                    </span>
                  ) : (
                    <span className="text-vinilo-black font-medium">+ {formatCOP(shippingCost)}</span>
                  )}
                </div>

                {/* Barra de progreso para envío gratis */}
                {storeConfig.free_shipping_threshold && shippingCost > 0 && (
                  <div className="pt-2">
                    <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                      <span>Progreso envío gratis</span>
                      <span>{Math.round((cartTotal / storeConfig.free_shipping_threshold) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, (cartTotal / storeConfig.free_shipping_threshold) * 100)}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-green-600 mt-2 flex items-center gap-1">
                      <Gift size={12} />
                      ¡Te faltan <strong>{formatCOP(amountForFreeShipping)}</strong> para envío gratis!
                    </p>
                  </div>
                )}

                {/* Línea divisoria */}
                <div className="border-t border-dashed border-gray-300 my-2"></div>

                {/* TOTAL */}
                <div className="pt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-bold uppercase text-sm">Total a Pagar</span>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-vinilo-black">{formatCOP(totalToPay)}</p>
                      <p className="text-[10px] text-gray-400">COP (Pesos Colombianos)</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Botón de confirmar */}
              <div className="mt-6">
                <button
                  type="submit"
                  disabled={paymentMethod === 'wompi' || loading}
                  className={`w-full py-4 text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 group rounded-lg
                    ${paymentMethod === 'cod' && !loading
                      ? 'bg-vinilo-black text-white hover:bg-vinilo-red hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]' 
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'}
                  `}
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Procesando...
                    </>
                  ) : paymentMethod === 'cod' ? (
                    <>Confirmar Pedido por {formatCOP(totalToPay)} <Truck size={16} className="group-hover:translate-x-1 transition-transform"/></>
                  ) : (
                    <>Pagar Ya <Lock size={14} /></>
                  )}
                </button>
                
                {paymentMethod === 'wompi' && !storeConfig.is_wompi_enabled && (
                  <p className="text-[10px] text-center text-red-500 mt-3 font-medium bg-red-50 p-2 rounded-lg">
                    La pasarela Wompi está temporalmente deshabilitada. Por favor selecciona Contraentrega.
                  </p>
                )}

                {/* Garantías */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-center gap-4 text-[10px] text-gray-400">
                    <span className="flex items-center gap-1"><ShieldCheck size={12} /> Pago Seguro</span>
                    <span className="flex items-center gap-1"><Truck size={12} /> Envío a Todo Colombia</span>
                  </div>
                </div>

                <p className="text-[10px] text-gray-400 text-center mt-3 leading-normal">
                  Al completar tu compra, aceptas nuestros <Link to="/terminos" className="underline hover:text-vinilo-black">términos y condiciones</Link>.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;