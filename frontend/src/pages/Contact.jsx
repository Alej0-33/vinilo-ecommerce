import React from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';

const Contact = () => {
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
                    <p className="text-sm text-gray-700">contacto@vinilostore.com</p>
                    <p className="text-sm text-gray-700">soporte@vinilostore.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-vinilo-red shadow-sm">
                    <Phone size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase text-gray-400 mb-1">Teléfono</p>
                    <p className="text-sm text-gray-700">+57 300 123 4567</p>
                    <p className="text-xs text-gray-400 mt-1">Lunes a Viernes, 9am - 6pm</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-vinilo-red shadow-sm">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase text-gray-400 mb-1">Ubicación</p>
                    <p className="text-sm text-gray-700">Calle 123 # 45-67</p>
                    <p className="text-sm text-gray-700">Medellín, Colombia</p>
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
               <button className="ml-auto bg-white text-[#25D366] px-4 py-2 rounded-lg text-xs font-bold hover:bg-[#25D366] hover:text-white transition-colors">
                 CHATEAR
               </button>
            </div>
          </div>

          {/* Columna Derecha: Formulario */}
          <div className="bg-white">
            <h3 className="font-serif text-xl text-vinilo-black mb-6">Envíanos un mensaje</h3>
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-gray-500">Nombre</label>
                  <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-vinilo-black" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-gray-500">Apellido</label>
                  <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-vinilo-black" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-gray-500">Email</label>
                <input type="email" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-vinilo-black" />
              </div>

              <div className="space-y-1">
                 <label className="text-xs font-bold uppercase text-gray-500">Asunto</label>
                 <select className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-vinilo-black">
                   <option>Consulta general</option>
                   <option>Estado de mi pedido</option>
                   <option>Cambios y Devoluciones</option>
                   <option>Garantías</option>
                 </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-gray-500">Mensaje</label>
                <textarea rows="4" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-vinilo-black"></textarea>
              </div>

              <button className="w-full bg-vinilo-black text-white py-3 rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-vinilo-red transition-colors flex items-center justify-center gap-2 mt-4">
                Enviar Mensaje <Send size={16} />
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;