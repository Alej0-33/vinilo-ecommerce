import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext'; 
import { X, Mail, Lock, User, CheckCircle, ArrowLeft, Send, Eye, EyeOff, LogOut, UserCircle, Package, Settings, Save, AlertCircle, Heart } from 'lucide-react';
import Button from './Button';

// ----------------------------------------------------------------------
// 1. SUB-COMPONENTES (Inputs)
// ----------------------------------------------------------------------

const InputField = ({ type = "text", placeholder, icon: Icon, value, onChange, required = false, disabled = false }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const isPasswordType = type === "password";
  const inputType = isPasswordType ? (showPassword ? "text" : "password") : type;

  return (
    <div className={`relative group transition-all duration-300 ${isFocused ? 'scale-[1.01]' : ''}`}>
      <div className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-300 ${isFocused ? 'text-vinilo-red' : 'text-gray-400'}`}>
        <Icon size={18} strokeWidth={1.5} />
      </div>
      <input
        type={inputType}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        placeholder={placeholder}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`w-full bg-gray-50 border border-gray-200 py-3.5 pl-10 pr-10 text-sm outline-none transition-all duration-300 placeholder-gray-400 text-vinilo-black rounded-none 
        focus:bg-white focus:border-vinilo-red focus:ring-1 focus:ring-vinilo-red/20
        disabled:opacity-60 disabled:cursor-not-allowed`}
      />
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

// ----------------------------------------------------------------------
// 2. VISTAS INTERNAS
// ----------------------------------------------------------------------

const ProfileView = ({ user, onChangeView, onLogout }) => (
  <div className="p-8">
    <div className="text-center mb-8">
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-200">
        <UserCircle size={48} className="text-gray-400" strokeWidth={1} />
      </div>
      <h3 className="font-serif text-2xl text-vinilo-black italic mb-1">
        Hola, {user?.first_name || user?.name || 'Usuario'}
      </h3>
      <p className="text-xs text-gray-400 font-sans tracking-wide">{user?.email}</p>
    </div>

    <div className="space-y-3">
      {/* Botón Mis Datos */}
      <button 
        onClick={() => onChangeView('edit-profile')}
        className="w-full flex items-center justify-between p-4 border border-gray-100 hover:border-gray-300 hover:bg-gray-50 transition-all group text-left"
      >
        <div className="flex items-center gap-3">
          <Settings size={18} className="text-vinilo-black" />
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-vinilo-black">Mis Datos</p>
            <p className="text-[10px] text-gray-400">Actualizar nombre y correo</p>
          </div>
        </div>
        <ArrowLeft size={16} className="text-gray-300 rotate-180 group-hover:text-vinilo-red transition-colors" />
      </button>

      {/* Botón Mis Pedidos */}
      <button className="w-full flex items-center justify-between p-4 border border-gray-100 hover:border-gray-300 hover:bg-gray-50 transition-all group text-left">
        <div className="flex items-center gap-3">
          <Package size={18} className="text-vinilo-black" />
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-vinilo-black">Mis Pedidos</p>
            <p className="text-[10px] text-gray-400">Ver historial de compras</p>
          </div>
        </div>
        <ArrowLeft size={16} className="text-gray-300 rotate-180 group-hover:text-vinilo-red transition-colors" />
      </button>

      {/* --- NUEVO BOTÓN: WISHLIST --- */}
      <button 
        onClick={() => {
            // Aquí puedes usar navigate('/account/wishlist') si usas React Router
            window.location.href = '/account/wishlist'; 
        }}
        className="w-full flex items-center justify-between p-4 border border-gray-100 hover:border-gray-300 hover:bg-gray-50 transition-all group text-left"
      >
        <div className="flex items-center gap-3">
          <Heart size={18} className="text-vinilo-black group-hover:text-vinilo-red transition-colors" />
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-vinilo-black group-hover:text-vinilo-red transition-colors">Wishlist</p>
            <p className="text-[10px] text-gray-400">Mis favoritos guardados</p>
          </div>
        </div>
        <ArrowLeft size={16} className="text-gray-300 rotate-180 group-hover:text-vinilo-red transition-colors" />
      </button>
    </div>

    <div className="mt-8 pt-6 border-t border-gray-100">
      <button onClick={onLogout} className="w-full flex items-center justify-center gap-2 py-3 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-vinilo-red hover:bg-red-50 transition-all border border-transparent hover:border-red-100">
        <LogOut size={16} /> Cerrar Sesión
      </button>
    </div>
  </div>
);

const EditProfileView = ({ formData, setFormData, onSubmit, loading, error, success, onBack }) => (
  <div className="p-8">
    <div className="mb-6 relative text-center">
      <button onClick={onBack} className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-vinilo-black transition-colors flex items-center gap-1 text-[10px] uppercase font-bold tracking-widest">
        <ArrowLeft size={14} /> Volver
      </button>
      <h3 className="font-serif text-2xl text-vinilo-black italic">Editar Datos</h3>
    </div>

    {success && <div className="mb-4 p-3 bg-green-50 text-green-700 text-xs text-center font-bold flex items-center justify-center gap-2"><CheckCircle size={14} /> {success}</div>}
    {error && <div className="mb-4 p-3 bg-red-50 text-red-500 text-xs text-center font-bold">{error}</div>}

    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <InputField icon={User} placeholder="Nombre" value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} required />
        <InputField icon={User} placeholder="Apellido" value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} required />
      </div>
      <InputField icon={Mail} type="email" placeholder="Correo electrónico" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
      <div className="pt-2">
        <Button variant="primary" size="full" type="submit" disabled={loading}>
          {loading ? 'Guardando...' : <span className="flex items-center gap-2 justify-center"><Save size={14}/> Guardar Cambios</span>}
        </Button>
      </div>
    </form>
  </div>
);

// ----------------------------------------------------------------------
// 3. COMPONENTE PRINCIPAL (Contenedor Lógico)
// ----------------------------------------------------------------------

const AuthModal = ({ isOpen, onClose }) => {
  const { login, register, recoverPassword, updateProfile, logout, user, isAuthenticated, error: authError } = useAuth();
  
  const [activeView, setActiveView] = useState('login'); 
  const [internalLoading, setInternalLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  // Agregado confirmPassword al estado inicial
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' });

  useEffect(() => {
    if (isOpen) {
        setInternalLoading(false);
        setErrorMsg('');
        
        if (isAuthenticated) {
            setActiveView('profile');
            setFormData({
                firstName: user?.first_name || '',
                lastName: user?.last_name || '',
                email: user?.email || '',
                password: '',
                confirmPassword: ''
            });
        } else {
            if (activeView !== 'login' || !successMsg) {
                setActiveView('login');
                setFormData({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' });
                setSuccessMsg('');
            }
        }
    }
  }, [isOpen, isAuthenticated, user]);

  // Manejo de cambio de pestaña (cancela proceso si hay carga activa)
  const handleTabChange = (targetView) => {
    if (activeView === targetView) return;

    if (internalLoading) {
        setInternalLoading(false); 
        const action = activeView === 'login' ? 'el inicio de sesión' : 'el registro';
        setErrorMsg(`Proceso interrumpido. Se canceló ${action}.`);
        setSuccessMsg('');
        return; 
    }

    setActiveView(targetView);
    setSuccessMsg('');
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setInternalLoading(true);
    setErrorMsg('');
    
    if (activeView !== 'edit-profile') setSuccessMsg('');

    // --- NUEVA VALIDACIÓN: Contraseñas coinciden ---
    if (activeView === 'register') {
      if (formData.password !== formData.confirmPassword) {
        setErrorMsg('Las contraseñas no coinciden.');
        setInternalLoading(false);
        return;
      }
    }

    // Pequeña referencia local para saber si el usuario canceló durante el await
    let cancelled = false;
    const cancelCheck = setInterval(() => {
        if (!internalLoading) cancelled = true;
    }, 100);

    let result;

    try {
        if (activeView === 'login') {
            result = await login(formData.email, formData.password);
            if (!cancelled && result && result.success) onClose();
        } 
        else if (activeView === 'register') {
            result = await register(formData);
            if (!cancelled && result && result.success) {
                setSuccessMsg('Cuenta creada exitosamente. Por favor inicia sesión.');
                setActiveView('login');
                // Limpiamos pass y confirmPass
                setFormData(prev => ({...prev, password: '', confirmPassword: ''})); 
            }
        } 
        else if (activeView === 'recovery') {
            result = await recoverPassword(formData.email);
            if (!cancelled && result?.success) {
                setSuccessMsg('Te hemos enviado un enlace de recuperación a tu correo.');
            }
        }
        else if (activeView === 'edit-profile') {
            result = await updateProfile(formData);
            if (!cancelled && result?.success) {
                setSuccessMsg('Información actualizada correctamente.');
                setTimeout(() => { if(!cancelled) setActiveView('profile'); setSuccessMsg(''); }, 1500);
            }
        }

        if (!cancelled && internalLoading) {
            if (result && !result.success) {
                setErrorMsg(result.message || authError || "Ocurrió un error inesperado.");
            }
        }

    } catch (err) {
        if (!cancelled) setErrorMsg("Error de conexión. Intenta nuevamente.");
    } finally {
        clearInterval(cancelCheck);
        setInternalLoading(false); 
    }
  };

  const handleLogout = () => {
      logout();
      onClose();
  };

  if (!isOpen) return null;

  if (isAuthenticated && activeView === 'profile') {
      return (
        <ModalWrapper onClose={onClose}>
            <ProfileView user={user} onChangeView={setActiveView} onLogout={handleLogout} />
        </ModalWrapper>
      );
  }

  if (isAuthenticated && activeView === 'edit-profile') {
      return (
        <ModalWrapper onClose={onClose}>
            <EditProfileView 
                formData={formData} 
                setFormData={setFormData} 
                onSubmit={handleSubmit} 
                loading={internalLoading} 
                error={errorMsg} 
                success={successMsg}
                onBack={() => setActiveView('profile')} 
            />
        </ModalWrapper>
      );
  }

  // Renderizar Vistas Guest (Login/Registro)
  return (
    <ModalWrapper onClose={onClose}>
        {/* Navegación Tabs */}
        {activeView !== 'recovery' && (
          <div className="flex border-b border-gray-100">
            <button 
                onClick={() => handleTabChange('login')} 
                className={`flex-1 py-5 text-xs font-bold uppercase tracking-widest transition-all relative ${activeView === 'login' ? 'text-vinilo-red bg-white' : 'text-gray-400 bg-gray-50 hover:text-vinilo-black'}`}
            >
              Ingresar
              {activeView === 'login' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-vinilo-red animate-scale-in" />}
            </button>
            <button 
                onClick={() => handleTabChange('register')} 
                className={`flex-1 py-5 text-xs font-bold uppercase tracking-widest transition-all relative ${activeView === 'register' ? 'text-vinilo-red bg-white' : 'text-gray-400 bg-gray-50 hover:text-vinilo-black'}`}
            >
              Registrarse
              {activeView === 'register' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-vinilo-red animate-scale-in" />}
            </button>
          </div>
        )}

        <div className="p-8 md:p-10">
            <div className="text-center mb-6 relative">
                {activeView === 'recovery' && (
                    <button onClick={() => { setActiveView('login'); setSuccessMsg(''); setErrorMsg(''); }} className="absolute -top-2 left-0 text-gray-400 hover:text-vinilo-black transition-colors flex items-center gap-1 text-[10px] uppercase font-bold tracking-widest">
                        <ArrowLeft size={14} /> Volver
                    </button>
                )}
                <h3 className="font-serif text-2xl md:text-3xl text-vinilo-black italic mb-2 mt-4 md:mt-0">
                    {activeView === 'login' ? 'Bienvenido de nuevo' : activeView === 'register' ? 'Únete al Club Vinilo' : 'Recuperar Contraseña'}
                </h3>
                <p className="text-xs text-gray-400 font-sans tracking-wide px-4 leading-relaxed">
                    {activeView === 'login' ? 'Ingresa tus credenciales para acceder.' : activeView === 'register' ? 'Crea una cuenta y obtén beneficios.' : 'Ingresa tu email para recuperarla.'}
                </p>
            </div>

            {/* Alertas */}
            {errorMsg && (
                <div className={`mb-4 p-3 border text-xs text-center font-bold animate-fade-in flex items-center justify-center gap-2 ${errorMsg.includes('interrumpido') ? 'bg-orange-50 border-orange-100 text-orange-600' : 'bg-red-50 border-red-100 text-red-500'}`}>
                    {errorMsg.includes('interrumpido') && <AlertCircle size={16} />}
                    {errorMsg}
                </div>
            )}
            
            {successMsg && (
                <div className="mb-4 p-3 bg-green-50 border border-green-100 text-green-700 text-xs text-center font-bold flex flex-col items-center justify-center gap-2 animate-fade-in">
                    <span className="flex items-center gap-2"><CheckCircle size={16} /> {successMsg}</span>
                    {activeView === 'recovery' && (
                        <button onClick={onClose} className="mt-2 underline text-[10px] hover:text-black">Cerrar</button>
                    )}
                </div>
            )}

            {/* Formulario Guest */}
            {!(activeView === 'recovery' && successMsg) && (
                <form onSubmit={handleSubmit} className="space-y-4">
                    
                    {activeView === 'register' && (
                        <div className="grid grid-cols-2 gap-4 animate-fade-in">
                            <InputField icon={User} placeholder="Nombre" value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} required />
                            <InputField icon={User} placeholder="Apellido" value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} required />
                        </div>
                    )}

                    <InputField icon={Mail} type="email" placeholder="Correo electrónico" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />

                    {activeView !== 'recovery' && (
                        <>
                          <InputField 
                            icon={Lock} 
                            type="password" 
                            placeholder="Contraseña" 
                            value={formData.password} 
                            onChange={(e) => setFormData({...formData, password: e.target.value})} 
                            required 
                          />

                          {/* CAMPO DE CONFIRMACIÓN DE CONTRASEÑA (SOLO REGISTRO) */}
                          {activeView === 'register' && (
                            <div className="animate-fade-in">
                              <InputField 
                                icon={Lock} 
                                type="password" 
                                placeholder="Confirmar contraseña" 
                                value={formData.confirmPassword} 
                                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} 
                                required 
                              />
                            </div>
                          )}
                        </>
                    )}

                    {activeView === 'login' && (
                        <div className="flex justify-end text-xs pt-1">
                            <button type="button" onClick={() => setActiveView('recovery')} className="text-gray-400 hover:text-vinilo-red transition-colors underline decoration-1 underline-offset-2">¿Olvidaste tu contraseña?</button>
                        </div>
                    )}

                    <div className="pt-2">
                        <Button variant="primary" size="full" type="submit" disabled={internalLoading} className={`relative ${internalLoading ? 'opacity-90 cursor-not-allowed' : ''}`}>
                            {internalLoading ? (
                                <div className="flex items-center gap-2 justify-center"><div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Procesando...</div>
                            ) : (
                                activeView === 'login' ? 'Iniciar Sesión' : activeView === 'register' ? 'Crear Cuenta' : 'Enviar Correo'
                            )}
                        </Button>
                    </div>
                </form>
            )}

            {/* Social Buttons */}
            {activeView !== 'recovery' && !successMsg && (
                <div className="animate-fade-in mt-6">
                    <div className="relative flex items-center gap-3 mb-6">
                        <div className="h-px bg-gray-100 flex-1"></div>
                        <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">O continúa con</span>
                        <div className="h-px bg-gray-100 flex-1"></div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <button type="button" onClick={() => alert('Próximamente')} className="flex items-center justify-center gap-2 py-2.5 border border-gray-200 hover:border-gray-400 hover:bg-gray-50 transition-all text-xs font-bold text-gray-600 rounded-none group">
                            <span className="font-serif italic font-bold text-lg group-hover:scale-110 transition-transform">G</span> <span className="hidden sm:inline">Google</span>
                        </button>
                        <button type="button" onClick={() => alert('Próximamente')} className="flex items-center justify-center gap-2 py-2.5 border border-gray-200 hover:border-[#1877F2] hover:bg-[#1877F2]/5 hover:text-[#1877F2] transition-all text-xs font-bold text-gray-600 rounded-none group">
                            <span className="font-serif italic font-bold text-lg group-hover:scale-110 transition-transform">F</span> <span className="hidden sm:inline">Facebook</span>
                        </button>
                    </div>
                    {activeView === 'register' && (
                        <p className="mt-6 text-center text-[10px] text-gray-400 px-4 leading-tight">
                            Al registrarte aceptas nuestros <a href="#" className="underline hover:text-vinilo-black">Términos</a> y <a href="#" className="underline hover:text-vinilo-black">Política de Privacidad</a>.
                        </p>
                    )}
                </div>
            )}
        </div>
    </ModalWrapper>
  );
};

// Wrapper auxiliar
const ModalWrapper = ({ children, onClose }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-vinilo-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
        <div className="relative bg-white w-full max-w-md shadow-2xl overflow-hidden flex flex-col z-10 animate-fade-in-up">
            <button onClick={onClose} className="absolute top-4 right-4 z-20 p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-vinilo-black transition-colors"><X size={20} /></button>
            {children}
        </div>
    </div>
);

export default AuthModal;