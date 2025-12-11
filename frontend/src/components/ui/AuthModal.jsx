import React, { useState } from 'react';
import { X } from 'lucide-react';
import Button from './Button';

const AuthModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('login'); // 'login' or 'register'

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      
      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-md shadow-2xl overflow-hidden flex flex-col z-10 animate-fade-in-up">
        
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-vinilo-black z-20">
          <X size={24} />
        </button>

        {/* Tabs */}
        <div className="flex border-b border-gray-100">
          <button 
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-6 text-xs font-bold uppercase tracking-widest transition-colors ${activeTab === 'login' ? 'bg-white text-vinilo-red border-b-2 border-vinilo-red' : 'bg-gray-50 text-gray-400 hover:text-vinilo-black'}`}
          >
            Iniciar Sesión
          </button>
          <button 
            onClick={() => setActiveTab('register')}
            className={`flex-1 py-6 text-xs font-bold uppercase tracking-widest transition-colors ${activeTab === 'register' ? 'bg-white text-vinilo-red border-b-2 border-vinilo-red' : 'bg-gray-50 text-gray-400 hover:text-vinilo-black'}`}
          >
            Crear Cuenta
          </button>
        </div>

        <div className="p-8 md:p-10">
            {activeTab === 'login' ? (
                <div className="space-y-6">
                    <h3 className="font-serif text-2xl text-center">Bienvenido de nuevo</h3>
                    <div className="space-y-4">
                        <input type="email" placeholder="Correo electrónico" className="w-full border border-gray-200 p-3 text-sm focus:border-vinilo-black outline-none" />
                        <input type="password" placeholder="Contraseña" className="w-full border border-gray-200 p-3 text-sm focus:border-vinilo-black outline-none" />
                    </div>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" /> Recordarme
                        </label>
                        <a href="#" className="underline hover:text-vinilo-red">¿Olvidaste tu contraseña?</a>
                    </div>
                    <Button variant="primary" size="full">Ingresar</Button>
                </div>
            ) : (
                <div className="space-y-6">
                    <h3 className="font-serif text-2xl text-center">Únete a Vinilo</h3>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <input type="text" placeholder="Nombre" className="w-full border border-gray-200 p-3 text-sm focus:border-vinilo-black outline-none" />
                            <input type="text" placeholder="Apellido" className="w-full border border-gray-200 p-3 text-sm focus:border-vinilo-black outline-none" />
                        </div>
                        <input type="email" placeholder="Correo electrónico" className="w-full border border-gray-200 p-3 text-sm focus:border-vinilo-black outline-none" />
                        <input type="password" placeholder="Contraseña" className="w-full border border-gray-200 p-3 text-sm focus:border-vinilo-black outline-none" />
                    </div>
                    <Button variant="primary" size="full">Registrarse</Button>
                    <p className="text-center text-[10px] text-gray-400 px-4">
                        Al registrarte aceptas nuestros Términos y Condiciones y Política de Privacidad.
                    </p>
                </div>
            )}
        </div>

      </div>
    </div>
  );
};

export default AuthModal;