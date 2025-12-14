import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ChevronLeft, MapPin, CreditCard, Truck, Lock, ShieldCheck } from 'lucide-react';

// 1. Importar el nuevo componente
import ProgressBar from '../components/ui/ProgressBar';

// Assets
import visa from '../assets/visa.png';
import mastercard from '../assets/mastercard.png';
import nequi from '../assets/nequi.png';
import pse from '../assets/pse.png';
import bancolombia from '../assets/bancolombia.png';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, cartTotal } = useCart();
  const [paymentMethod, setPaymentMethod] = useState('cod'); 

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const shippingCost = 15000;
  const totalToPay = cartTotal + shippingCost;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (paymentMethod === 'wompi') return;

    console.log("Procesando orden...", {
        customer: formData,
        items: cartItems,
        total: totalToPay,
        paymentMethod
    });
    alert("¡Orden recibida! (Lógica pendiente de conexión con Backend)");
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6">
        <h2 className="font-serif text-3xl mb-4 text-vinilo-black">Tu bolsa está vacía</h2>
        <Link 
          to="/catalog" 
          className="text-xs font-bold uppercase tracking-widest text-vinilo-red border-b border-vinilo-red pb-1 hover:text-vinilo-black hover:border-vinilo-black transition-colors"
        >
          Volver al catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pb-24">
      
      {/* 2. Top Bar Reestructurado */}
      <div className="border-b border-gray-100 sticky top-0 bg-white/95 backdrop-blur z-20 shadow-sm">
        <div className="container mx-auto px-6 py-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                
                {/* Izquierda: Volver */}
                <div className="w-full md:w-auto flex justify-start">
                    <Link to="/catalog" className="text-gray-400 hover:text-vinilo-black transition-colors flex items-center gap-1 group text-xs uppercase font-bold tracking-widest">
                        <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="hidden sm:inline">Volver</span>
                    </Link>
                </div>

                {/* Centro: Barra de Progreso (Paso 2: Envío & Pago) */}
                <div className="flex-1 flex justify-center">
                    <ProgressBar currentStep={2} />
                </div>

                {/* Derecha: Badge Seguridad */}
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
            
            {/* 1. Información de Envío */}
            <section>
                <h2 className="font-serif text-xl mb-6 flex items-center gap-2 text-vinilo-black">
                    <MapPin size={18} className="text-vinilo-red" /> 
                    Información de Envío
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Nombre y Apellido */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold uppercase text-gray-500">Nombre *</label>
                        <input required type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} className="w-full border border-gray-200 p-3 text-sm focus:outline-none focus:border-vinilo-black transition-colors bg-vinilo-gray/20 rounded-sm" placeholder="Ej. Ana" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold uppercase text-gray-500">Apellido *</label>
                        <input required type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} className="w-full border border-gray-200 p-3 text-sm focus:outline-none focus:border-vinilo-black transition-colors bg-vinilo-gray/20 rounded-sm" placeholder="Ej. Pérez" />
                    </div>

                    {/* Cédula y Teléfono */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold uppercase text-gray-500">Cédula / CC *</label>
                        <input required type="text" name="cedula" value={formData.cedula} onChange={handleInputChange} className="w-full border border-gray-200 p-3 text-sm focus:outline-none focus:border-vinilo-black transition-colors bg-vinilo-gray/20 rounded-sm" placeholder="1234567890" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold uppercase text-gray-500">Teléfono *</label>
                        <input required type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full border border-gray-200 p-3 text-sm focus:outline-none focus:border-vinilo-black transition-colors bg-vinilo-gray/20 rounded-sm" placeholder="300 123 4567" />
                    </div>

                    {/* Correo */}
                    <div className="md:col-span-2 space-y-1">
                        <label className="text-xs font-bold uppercase text-gray-500">Correo Electrónico *</label>
                        <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full border border-gray-200 p-3 text-sm focus:outline-none focus:border-vinilo-black transition-colors bg-vinilo-gray/20 rounded-sm" placeholder="correo@ejemplo.com" />
                    </div>

                    {/* Dirección */}
                    <div className="md:col-span-2 space-y-1">
                        <label className="text-xs font-bold uppercase text-gray-500">Dirección Completa *</label>
                        <input required type="text" name="address" value={formData.address} onChange={handleInputChange} className="w-full border border-gray-200 p-3 text-sm focus:outline-none focus:border-vinilo-black transition-colors bg-vinilo-gray/20 rounded-sm" placeholder="Calle 123 # 45 - 67, Apto 201" />
                    </div>

                    {/* Ubicación */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold uppercase text-gray-500">Departamento *</label>
                        <input required type="text" name="department" value={formData.department} onChange={handleInputChange} className="w-full border border-gray-200 p-3 text-sm focus:outline-none focus:border-vinilo-black transition-colors bg-vinilo-gray/20 rounded-sm" placeholder="Antioquia" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold uppercase text-gray-500">Ciudad *</label>
                        <input required type="text" name="city" value={formData.city} onChange={handleInputChange} className="w-full border border-gray-200 p-3 text-sm focus:outline-none focus:border-vinilo-black transition-colors bg-vinilo-gray/20 rounded-sm" placeholder="Medellín" />
                    </div>
                    
                    {/* Zip y Notas */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold uppercase text-gray-500">Código Postal</label>
                        <input type="text" name="zipCode" value={formData.zipCode} onChange={handleInputChange} className="w-full border border-gray-200 p-3 text-sm focus:outline-none focus:border-vinilo-black transition-colors bg-vinilo-gray/20 rounded-sm" />
                    </div>
                    <div className="md:col-span-2 space-y-1 mt-2">
                        <label className="text-xs font-bold uppercase text-gray-500">Notas Adicionales (Opcional)</label>
                        <textarea name="notes" rows="2" value={formData.notes} onChange={handleInputChange} className="w-full border border-gray-200 p-3 text-sm focus:outline-none focus:border-vinilo-black transition-colors bg-vinilo-gray/20 rounded-sm" placeholder="Dejar en portería, edificio blanco..." />
                    </div>
                </div>
            </section>

            {/* 2. Método de Pago */}
            <section className="animate-fade-in delay-100">
                <h2 className="font-serif text-xl mb-6 flex items-center gap-2 text-vinilo-black">
                    <CreditCard size={18} className="text-vinilo-red" /> 
                    Método de Pago
                </h2>

                <div className="space-y-4">
                    {/* Contraentrega */}
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

                    {/* Wompi */}
                    <div 
                        onClick={() => setPaymentMethod('wompi')}
                        className={`border rounded-lg p-5 cursor-pointer transition-all flex items-start gap-4 ${paymentMethod === 'wompi' ? 'border-vinilo-black bg-gray-50 ring-1 ring-vinilo-black' : 'border-gray-200 hover:border-gray-300'}`}
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
                                <span className="block text-vinilo-red font-bold mt-1">(Próximamente disponible)</span>
                            </p>
                        </div>
                    </div>
                </div>
            </section>
          </div>

          {/* COLUMNA DERECHA: RESUMEN ORDEN */}
          <div className="w-full lg:w-[400px] flex-shrink-0 animate-fade-in-up">
            <div className="bg-gray-50 p-6 md:p-8 sticky top-24 border border-gray-100 rounded-sm shadow-sm">
                <h3 className="font-serif text-lg italic mb-6 pb-4 border-b border-gray-200">Resumen del Pedido</h3>
                
                <div className="space-y-4 max-h-[300px] overflow-y-auto mb-6 pr-2 custom-scrollbar">
                    {cartItems.map((item, index) => (
                        <div key={`${item.id}-${index}`} className="flex gap-4 items-start">
                            <div className="w-16 h-20 bg-gray-200 flex-shrink-0 relative overflow-hidden rounded-sm">
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                <span className="absolute bottom-0 right-0 bg-vinilo-black text-white text-[9px] w-5 h-5 flex items-center justify-center">
                                    {item.quantity}
                                </span>
                            </div>
                            <div className="flex-1">
                                <p className="text-xs font-bold text-vinilo-black uppercase leading-tight">{item.name}</p>
                                <p className="text-[10px] text-gray-500 mt-1">Talla: {item.selectedSize}</p>
                                <p className="text-xs text-gray-600 mt-1 font-medium">${(item.price * item.quantity).toLocaleString()}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="space-y-3 pt-4 border-t border-gray-200 text-sm font-sans">
                    <div className="flex justify-between text-gray-600">
                        <span>Subtotal</span>
                        <span>${cartTotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                        <span>Envío (Nacional)</span>
                        <span>${shippingCost.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-vinilo-black font-bold text-lg pt-4 border-t border-gray-200">
                        <span>Total</span>
                        <span>${totalToPay.toLocaleString()}</span>
                    </div>
                </div>

                <div className="mt-8">
                    <button
                        type="submit"
                        disabled={paymentMethod === 'wompi'}
                        onClick={handleSubmit} 
                        className={`w-full py-4 text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 group
                            ${paymentMethod === 'cod' 
                                ? 'bg-vinilo-black text-white hover:bg-vinilo-red hover:shadow-lg' 
                                : 'bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300'}
                        `}
                    >
                        {paymentMethod === 'cod' ? (
                            <>Confirmar Pedido <Truck size={16} className="group-hover:translate-x-1 transition-transform"/></>
                        ) : (
                            <>Pagar Ya <Lock size={14} /></>
                        )}
                    </button>
                    
                    {paymentMethod === 'wompi' && (
                        <p className="text-[10px] text-center text-red-500 mt-3 font-medium bg-red-50 p-2 rounded">
                            La pasarela Wompi está temporalmente deshabilitada. Por favor selecciona Contraentrega.
                        </p>
                    )}

                    <p className="text-[10px] text-gray-400 text-center mt-4 leading-normal px-2">
                        Al completar tu compra, aceptas nuestros términos y condiciones.
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