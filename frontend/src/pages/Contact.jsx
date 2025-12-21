import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, Loader2, CheckCircle } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    subject: 'GENERAL',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

  const companyInfo = {
    email: import.meta.env.VITE_STORE_EMAIL,
    phone: import.meta.env.VITE_STORE_PHONE,
    address: import.meta.env.VITE_STORE_ADDRESS,
    whatsappNumber: import.meta.env.VITE_STORE_WHATSAPP
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/store/contact/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.errors ? 'Por favor revisa los campos.' : 'Error al enviar.');
      }

      setSuccess(true);
      setFormData({ first_name: '', last_name: '', email: '', subject: 'GENERAL', message: '' });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-6 py-12">
        
        <div className="text-center mb-16">
          <h1 className="font-serif text-3xl md:text-4xl text-vinilo-black mb-4">Contáctanos</h1>
          <p className="text-gray-500 text-sm max-w-lg mx-auto">
            Estamos aquí para ayudarte. Si tienes preguntas sobre productos, pedidos o devoluciones, no dudes en escribirnos.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          
          {/* Columna Izquierda: Información */}
          <div className="space-y-8">
            <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100">
              <h3 className="font-serif text-xl text-vinilo-black mb-6">Información de Contacto</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-vinilo-red shadow-sm">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase text-gray-400 mb-1">Email</p>
                    <p className="text-sm text-gray-700">{companyInfo.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-vinilo-red shadow-sm">
                    <Phone size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase text-gray-400 mb-1">Teléfono</p>
                    <p className="text-sm text-gray-700">{companyInfo.phone}</p>
                    <p className="text-xs text-gray-400 mt-1">Lunes a Viernes, 6am - 6pm</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-vinilo-red shadow-sm">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase text-gray-400 mb-1">Ubicación</p>
                    <p className="text-sm text-gray-700">{companyInfo.address}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bloque de Whatsapp */}
            <div className="bg-[#25D366]/10 p-6 rounded-xl border border-[#25D366]/20 flex items-center gap-4">
               <div className="w-12 h-12 bg-[#25D366] rounded-full flex items-center justify-center text-white">
                 <MessageSquare size={24} />
               </div>
               <div>
                 <p className="font-bold text-gray-800">Chat en WhatsApp</p>
                 <p className="text-xs text-gray-600">Respuesta inmediata</p>
               </div>
               <button 
                 onClick={() => window.open(`https://wa.me/${companyInfo.whatsappNumber}`, '_blank')}
                 className="ml-auto bg-white text-[#25D366] px-4 py-2 rounded-lg text-xs font-bold hover:bg-[#25D366] hover:text-white transition-colors"
               >
                 CHATEAR
               </button>
            </div>
          </div>

          {/* Columna Derecha: Formulario */}
          <div className="bg-white">
            <h3 className="font-serif text-xl text-vinilo-black mb-6">Envíanos un mensaje</h3>
            
            {success ? (
              <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h4 className="font-bold text-green-800 mb-2">¡Mensaje enviado!</h4>
                <p className="text-sm text-green-600">Te responderemos lo antes posible.</p>
                <button 
                  onClick={() => setSuccess(false)}
                  className="mt-4 text-sm text-green-700 underline"
                >
                  Enviar otro mensaje
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase text-gray-500">Nombre</label>
                    <input 
                      type="text" 
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                      required
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-vinilo-black" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase text-gray-500">Apellido</label>
                    <input 
                      type="text" 
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                      required
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-vinilo-black" 
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-gray-500">Email</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-vinilo-black" 
                  />
                </div>

                <div className="space-y-1">
                   <label className="text-xs font-bold uppercase text-gray-500">Asunto</label>
                   <select 
                     name="subject"
                     value={formData.subject}
                     onChange={handleChange}
                     className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-vinilo-black"
                   >
                     <option value="GENERAL">Consulta general</option>
                     <option value="ORDER_STATUS">Estado de mi pedido</option>
                     <option value="RETURNS">Cambios y Devoluciones</option>
                     <option value="WARRANTY">Garantías</option>
                   </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-gray-500">Mensaje</label>
                  <textarea 
                    rows="4" 
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    minLength={10}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-vinilo-black"
                  ></textarea>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-lg">
                    {error}
                  </div>
                )}

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full bg-vinilo-black text-white py-3 rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-vinilo-red transition-colors flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      Enviar Mensaje <Send size={16} />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;