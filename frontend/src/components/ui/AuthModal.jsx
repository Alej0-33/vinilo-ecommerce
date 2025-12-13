import React, { useState, useEffect } from 'react';
import { X, Eye, EyeOff, Mail, Lock, User, CheckCircle } from 'lucide-react';
import Button from './Button';

// --- Sub-componente para Inputs Reutilizables ---
const InputField = ({ 
  type = "text", 
  placeholder, 
  icon: Icon, 
  id,
  required = false 
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const isPasswordType = type === "password";

  // Determinar el tipo real del input (texto o password según el toggle)
  const inputType = isPasswordType ? (showPassword ? "text" : "password") : type;

  return (
    <div className={`relative group transition-all duration-300 ${isFocused ? 'scale-[1.01]' : ''}`}>
      {/* Icono Izquierdo */}
      <div className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-300 ${isFocused ? 'text-vinilo-red' : 'text-gray-400'}`}>
        <Icon size={18} strokeWidth={1.5} />
      </div>

      <input
        id={id}
        type={inputType}
        required={required}
        placeholder={placeholder}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`w-full bg-gray-50 border border-gray-200 py-3.5 pl-10 pr-10 text-sm outline-none transition-all duration-300 placeholder-gray-400
          text-vinilo-black rounded-none
          focus:bg-white focus:border-vinilo-red focus:ring-1 focus:ring-vinilo-red/20`}
      />

      {/* Toggle Password (Icono Derecho) */}
      {isPasswordType && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-vinilo-black transition-colors focus:outline-none"
          tabIndex="-1"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      )}
    </div>
  );
};

// --- Componente Principal ---
const AuthModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('login');
  const [isLoading, setIsLoading] = useState(false);

  // Resetear estados al cerrar
  useEffect(() => {
    if (!isOpen) {
      setIsLoading(false);
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulación de petición al backend
    setTimeout(() => {
      setIsLoading(false);
      // Aquí iría la lógica de éxito
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop con Blur */}
      <div 
        className="absolute inset-0 bg-vinilo-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white w-full max-w-md shadow-2xl overflow-hidden flex flex-col z-10 animate-fade-in-up">
        
        {/* Botón Cerrar Flotante */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 z-20 p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-vinilo-black transition-all duration-300"
        >
          <X size={20} />
        </button>

        {/* Encabezado Tabs */}
        <div className="flex border-b border-gray-100">
          <button 
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-5 text-xs font-bold uppercase tracking-widest transition-all duration-300 relative
              ${activeTab === 'login' ? 'text-vinilo-red bg-white' : 'text-gray-400 bg-gray-50 hover:text-vinilo-black'}`}
          >
            Ingresar
            {activeTab === 'login' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-vinilo-red animate-scale-in" />}
          </button>
          <button 
            onClick={() => setActiveTab('register')}
            className={`flex-1 py-5 text-xs font-bold uppercase tracking-widest transition-all duration-300 relative
              ${activeTab === 'register' ? 'text-vinilo-red bg-white' : 'text-gray-400 bg-gray-50 hover:text-vinilo-black'}`}
          >
            Registrarse
            {activeTab === 'register' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-vinilo-red animate-scale-in" />}
          </button>
        </div>

        {/* Contenido */}
        <div className="p-8 md:p-10">
          <div className="text-center mb-8">
            <h3 className="font-serif text-2xl md:text-3xl text-vinilo-black italic mb-2">
              {activeTab === 'login' ? 'Bienvenido de nuevo' : 'Únete al Club Vinilo'}
            </h3>
            <p className="text-xs text-gray-400 font-sans tracking-wide">
              {activeTab === 'login' 
                ? 'Ingresa tus credenciales para acceder a tu cuenta.' 
                : 'Crea una cuenta y obtén 10% OFF en tu primera compra.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {activeTab === 'register' && (
              <div className="grid grid-cols-2 gap-4 animate-fade-in">
                 <InputField icon={User} placeholder="Nombre" required />
                 <InputField icon={User} placeholder="Apellido" required />
              </div>
            )}

            <InputField type="email" icon={Mail} placeholder="Correo electrónico" required />
            <InputField type="password" icon={Lock} placeholder="Contraseña" required />

            {/* Opciones Adicionales Login */}
            {activeTab === 'login' && (
              <div className="flex justify-between items-center text-xs pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-gray-500 hover:text-vinilo-black transition-colors group">
                      <div className="relative flex items-center">
                        <input type="checkbox" className="peer appearance-none w-4 h-4 border border-gray-300 rounded-sm checked:bg-vinilo-red checked:border-vinilo-red transition-all cursor-pointer" />
                        <CheckCircle size={10} className="absolute text-white opacity-0 peer-checked:opacity-100 pointer-events-none top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                      </div>
                      <span className="group-hover:underline decoration-gray-300 underline-offset-4">Recordarme</span>
                  </label>
                  <a href="#" className="text-gray-400 hover:text-vinilo-red transition-colors underline decoration-1 underline-offset-2">
                    ¿Olvidaste tu contraseña?
                  </a>
              </div>
            )}

            {/* Botón Principal con Loading */}
            <div className="pt-2">
                <Button 
                  variant="primary" 
                  size="full" 
                  type="submit" 
                  disabled={isLoading}
                  className={`relative ${isLoading ? 'opacity-90 cursor-not-allowed' : ''}`}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                       <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                       <span>Procesando...</span>
                    </div>
                  ) : (
                    activeTab === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'
                  )}
                </Button>
            </div>
          </form>

          {/* Separador */}
          <div className="relative flex items-center gap-3 my-8">
            <div className="h-px bg-gray-100 flex-1"></div>
            <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">O continúa con</span>
            <div className="h-px bg-gray-100 flex-1"></div>
          </div>

          {/* Botones Sociales */}
          <div className="grid grid-cols-2 gap-3">
             <button className="flex items-center justify-center gap-2 py-2.5 border border-gray-200 hover:border-gray-400 hover:bg-gray-50 transition-all text-xs font-bold text-gray-600 rounded-none group">
                <svg className="w-4 h-4 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M23.766 12.2764C23.766 11.4607 23.6999 10.6406 23.5588 9.83807H12.24V14.4591H18.7217C18.4528 15.9494 17.5885 17.2678 16.323 18.1056V21.1039H20.19C22.4608 19.0139 23.766 15.9274 23.766 12.2764Z" fill="#4285F4"/><path d="M12.2401 24.0008C15.4766 24.0008 18.2059 22.9382 20.1945 21.1039L16.3275 18.1055C15.2517 18.8375 13.8627 19.252 12.2445 19.252C9.11388 19.252 6.45946 17.1399 5.50705 14.3003H1.5166V17.3912C3.55371 21.4434 7.7029 24.0008 12.2401 24.0008Z" fill="#34A853"/><path d="M5.50253 14.3003C5.00236 12.8199 5.00236 11.1799 5.50253 9.69951V6.60864H1.5166C-0.18551 10.0056 -0.18551 14.0004 1.5166 17.3912L5.50253 14.3003Z" fill="#FBBC05"/><path d="M12.2401 4.74966C13.9509 4.7232 15.6044 5.36697 16.8434 6.54867L20.2695 3.12262C18.1001 1.0855 15.2208 -0.034466 12.2401 0.000808666C7.7029 0.000808666 3.55371 2.55822 1.5166 6.60864L5.50253 9.69951C6.45064 6.86154 9.10947 4.74966 12.2401 4.74966Z" fill="#EA4335"/></svg>
                Google
             </button>
             <button className="flex items-center justify-center gap-2 py-2.5 border border-gray-200 hover:border-[#1877F2] hover:text-[#1877F2] hover:bg-[#1877F2]/5 transition-all text-xs font-bold text-gray-600 rounded-none group">
                <svg className="w-4 h-4 text-[#1877F2] group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
                Facebook
             </button>
          </div>

          {activeTab === 'register' && (
             <p className="mt-6 text-center text-[10px] text-gray-400 px-4 leading-tight">
                Al registrarte aceptas nuestros <a href="#" className="underline hover:text-vinilo-black">Términos y Condiciones</a> y <a href="#" className="underline hover:text-vinilo-black">Política de Privacidad</a>.
             </p>
          )}

        </div>
      </div>
    </div>
  );
};

export default AuthModal;