import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; 
import { X, Mail, Lock, User, CheckCircle, ArrowLeft, Send, Eye, EyeOff, LogOut, UserCircle, Package, Settings, Save, AlertCircle, Heart, KeyRound } from 'lucide-react';
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

const ProfileView = ({ user, onChangeView, onLogout, onClose }) => {
  const navigate = useNavigate();

  return (
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

        <button 
          onClick={() => {
            navigate('/account/orders');
            onClose();
          }}
          className="w-full flex items-center justify-between p-4 border border-gray-100 hover:border-gray-300 hover:bg-gray-50 transition-all group text-left"
        >
          <div className="flex items-center gap-3">
            <Package size={18} className="text-vinilo-black" />
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-vinilo-black">Mis Pedidos</p>
              <p className="text-[10px] text-gray-400">Ver historial de compras</p>
            </div>
          </div>
          <ArrowLeft size={16} className="text-gray-300 rotate-180 group-hover:text-vinilo-red transition-colors" />
        </button>

        <button 
          onClick={() => {
            navigate('/account/wishlist');
            onClose();
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
};

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
// 3. COMPONENTE PRINCIPAL
// ----------------------------------------------------------------------

const AuthModal = ({ isOpen, onClose }) => {
  const { login, register, verifyEmail, recoverPassword, updateProfile, logout, user, isAuthenticated } = useAuth();
  
  const [activeView, setActiveView] = useState('login'); 
  const [internalLoading, setInternalLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  const [isVerifying, setIsVerifying] = useState(false);
  const [otpCode, setOtpCode] = useState('');

  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' });

  // Sincronizar estado cuando abre el modal o cambia la sesión
  useEffect(() => {
    if (isOpen) {
        setInternalLoading(false);
        setErrorMsg('');
        setOtpCode('');
        
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
            // No resetear si estamos en proceso de verificación
            if (!isVerifying) {
                setActiveView('login');
                setFormData({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' });
                setSuccessMsg('');
            }
        }
    }
  }, [isOpen, isAuthenticated, user]);

  const handleTabChange = (targetView) => {
    if (activeView === targetView || internalLoading) return;
    setActiveView(targetView);
    setSuccessMsg('');
    setErrorMsg('');
    setIsVerifying(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setInternalLoading(true);
    setErrorMsg('');
    
    // Solo limpiar éxito si no estamos editando perfil (para que el feedback sea visible)
    if (activeView !== 'edit-profile') setSuccessMsg('');

    try {
        if (activeView === 'login') {
            const result = await login(formData.email, formData.password);
            if (result && result.success) {
                onClose();
            } else {
                setErrorMsg(result?.message || 'Credenciales incorrectas');
            }
        } 
        else if (activeView === 'register') {
            // FLUJO 1: Enviar datos iniciales (Crea PendingUser)
            if (!isVerifying) {
                if (formData.password !== formData.confirmPassword) {
                    setErrorMsg('Las contraseñas no coinciden.');
                    setInternalLoading(false);
                    return;
                }
                const result = await register(formData);
                if (result.success) {
                    setIsVerifying(true);
                    setSuccessMsg(`Código enviado a ${formData.email}`);
                } else {
                    setErrorMsg(result.message || 'Error en el registro');
                }
            } 
            // FLUJO 2: Enviar OTP (Crea User Real)
            else {
                const result = await verifyEmail(formData.email, otpCode);
                if (result.success) {
                    setSuccessMsg('¡Cuenta verificada! Iniciando sesión...');
                    // Login automático tras verificación
                    const logRes = await login(formData.email, formData.password);
                    if (logRes.success) onClose();
                } else {
                    setErrorMsg(result.message || 'Código incorrecto o expirado');
                }
            }
        } 
        else if (activeView === 'recovery') {
            const result = await recoverPassword(formData.email);
            if (result?.success) {
                setSuccessMsg('Enlace enviado. Revisa tu correo.');
            } else {
                setErrorMsg('No pudimos procesar la solicitud.');
            }
        }
        else if (activeView === 'edit-profile') {
            const result = await updateProfile(formData);
            if (result?.success) {
                setSuccessMsg('Datos actualizados.');
                setTimeout(() => { setActiveView('profile'); setSuccessMsg(''); }, 1500);
            } else {
                setErrorMsg(result.message || "Error al actualizar.");
            }
        }
    } catch (err) {
        setErrorMsg("Error de conexión con el servidor.");
    } finally {
        setInternalLoading(false); 
    }
  };

  if (!isOpen) return null;

  // Renderizado Condicional de Vistas para Usuarios Logueados
  if (isAuthenticated && activeView === 'profile') {
      return (
        <ModalWrapper onClose={onClose}>
            <ProfileView user={user} onChangeView={setActiveView} onLogout={logout} onClose={onClose} />
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

  // Renderizado de Login / Register / Recovery
  return (
    <ModalWrapper onClose={onClose}>
        
        {/* Tabs superiores */}
        {activeView !== 'recovery' && !isVerifying && (
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
            {/* Header del formulario */}
            <div className="text-center mb-6 relative">
                {(activeView === 'recovery' || isVerifying) && (
                    <button 
                        onClick={() => { 
                            if(isVerifying) setIsVerifying(false); 
                            else setActiveView('login'); 
                            setErrorMsg(''); setSuccessMsg('');
                        }} 
                        className="absolute -top-2 left-0 text-gray-400 hover:text-vinilo-black transition-colors flex items-center gap-1 text-[10px] uppercase font-bold tracking-widest"
                    >
                        <ArrowLeft size={14} /> Volver
                    </button>
                )}
                
                <h3 className="font-serif text-2xl md:text-3xl text-vinilo-black italic mb-2 mt-4 md:mt-0">
                    {isVerifying ? 'Verifica tu Email' : 
                     activeView === 'login' ? 'Bienvenido' : 
                     activeView === 'register' ? 'Únete al Club' : 'Recuperar'}
                </h3>
                <p className="text-xs text-gray-400 font-sans tracking-wide px-4">
                    {isVerifying ? 'Ingresa el código enviado a tu correo' : 
                     activeView === 'login' ? 'Ingresa tus credenciales para acceder' : 
                     activeView === 'register' ? 'Crea una cuenta y obtén beneficios' : 'Ingresa tu email para continuar'}
                </p>
            </div>

            {/* Mensajes de feedback */}
            {errorMsg && (
                <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-500 text-xs text-center font-bold flex items-center justify-center gap-2">
                    <AlertCircle size={16} /> {errorMsg}
                </div>
            )}
            
            {successMsg && !isVerifying && (
                <div className="mb-4 p-3 bg-green-50 border border-green-100 text-green-700 text-xs text-center font-bold flex items-center justify-center gap-2">
                    <CheckCircle size={16} /> {successMsg}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Campos de Verificación OTP */}
                {isVerifying ? (
                    <div className="animate-fade-in space-y-4">
                        <InputField 
                            icon={KeyRound} 
                            type="text"
                            placeholder="Código de 6 dígitos" 
                            value={otpCode} 
                            onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0,6))} 
                            required 
                        />
                        <div className="text-[10px] text-gray-400 text-center uppercase tracking-tighter">
                            El código expira en 15 minutos
                        </div>
                        <button 
                            type="button"
                            onClick={async () =>{
                              setErrorMsg('');
                              setInternalLoading(true);
                              const result = await register(formData);
                              setInternalLoading(false);
                              if(result.success) {
                                setSuccessMsg('Nuevo codigo enviad');
                              }else{
                                setErrorMsg(result.message || 'Error al reenviar');
                              }
                            }}
                            disabled={internalLoading}
                            className="mt-3 text-[10px] text-vinilo-red hover:underline disabled:opacity-50"
                        >
                          ¿No recibiste el código? Reenviar
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Campos de Registro (Nombres) */}
                        {activeView === 'register' && (
                            <div className="grid grid-cols-2 gap-4 animate-fade-in">
                                <InputField icon={User} placeholder="Nombre" value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} required />
                                <InputField icon={User} placeholder="Apellido" value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} required />
                            </div>
                        )}

                        {/* Email (Login / Register / Recovery) */}
                        <InputField icon={Mail} type="email" placeholder="Correo electrónico" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />

                        {/* Password (Login / Register) */}
                        {activeView !== 'recovery' && (
                            <>
                                <InputField icon={Lock} type="password" placeholder="Contraseña" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required />
                                {activeView === 'register' && (
                                    <InputField icon={Lock} type="password" placeholder="Confirmar contraseña" value={formData.confirmPassword} onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} required />
                                )}
                            </>
                        )}
                    </>
                )}

                {/* Olvidé contraseña */}
                {!isVerifying && activeView === 'login' && (
                    <div className="flex justify-end text-xs pt-1">
                        <button type="button" onClick={() => setActiveView('recovery')} className="text-gray-400 hover:text-vinilo-red transition-colors underline decoration-1 underline-offset-2">¿Olvidaste tu contraseña?</button>
                    </div>
                )}

                {/* Botón de acción */}
                <div className="pt-2">
                    <Button variant="primary" size="full" type="submit" disabled={internalLoading}>
                        {internalLoading ? 'Procesando...' : 
                         isVerifying ? 'Verificar Código' :
                         activeView === 'login' ? 'Iniciar Sesión' : 
                         activeView === 'register' ? 'Registrarse' : 'Enviar Correo'}
                    </Button>
                </div>
            </form>

            {/* Footer legal */}
            {activeView === 'register' && !isVerifying && (
                <div className="animate-fade-in mt-6">
                    <p className="text-center text-[10px] text-gray-400 px-4 leading-tight">
                        Al registrarte aceptas nuestros <a href="/terms" className="underline hover:text-vinilo-black">Términos</a> y <a href="/privacy" className="underline hover:text-vinilo-black">Privacidad</a>.
                    </p>
                </div>
            )}
        </div>
    </ModalWrapper>
  );
};

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