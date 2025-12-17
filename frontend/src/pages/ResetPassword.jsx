import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle, ShieldCheck } from 'lucide-react';
import Button from '../components/ui/Button';

const ResetPassword = () => {
  const { uid, token } = useParams();
  const navigate = useNavigate();
  const { confirmPasswordReset } = useAuth();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Estados independientes para la visibilidad
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [message, setMessage] = useState('');

  // --- VALIDACIÓN DE SEGURIDAD (REGEX) ---
  // Mínimo 8 caracteres, al menos 1 letra y 1 número.
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;

  const validateInput = () => {
    if (!passwordRegex.test(password)) {
        setStatus('error');
        setMessage("La contraseña debe tener mínimo 8 caracteres, incluir letras y números.");
        return false;
    }
    if (password !== confirmPassword) {
        setStatus('error');
        setMessage("Las contraseñas no coinciden.");
        return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar antes de enviar (ahorra peticiones al backend y mejora UX)
    if (!validateInput()) return;

    setStatus('loading');
    
    const result = await confirmPasswordReset(uid, token, password);
    
    if (result.success) {
        setStatus('success');
        setMessage("¡Contraseña actualizada con éxito!");
        // Redirigir al usuario al Home después de 3 segundos
        setTimeout(() => navigate('/'), 3000);
    } else {
        setStatus('error');
        setMessage(result.message || "El enlace ha expirado o es inválido.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white max-w-md w-full p-8 rounded-xl shadow-sm border border-gray-100 animate-fade-in-up">
        
        {/* Encabezado Visual */}
        <div className="text-center mb-8">
            <div className="mx-auto w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4 border border-blue-100">
                <ShieldCheck size={24}/>
            </div>
            <h2 className="font-serif text-3xl text-vinilo-black mb-2">Cambia tu Contraseña</h2>
            <p className="text-sm text-gray-500">Crea una contraseña segura para recuperar el acceso a tu cuenta.</p>
        </div>

        {status === 'success' ? (
           <div className="bg-green-50 border border-green-100 text-green-700 p-6 rounded-lg flex flex-col items-center justify-center gap-3 mb-4 animate-fade-in text-center">
             <CheckCircle size={32} />
             <div>
               <p className="font-bold text-lg">¡Listo!</p>
               <p className="text-sm">{message}</p>
               <p className="text-xs text-green-600 mt-2">Redirigiendo...</p>
             </div>
           </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
             {status === 'error' && (
                <div className="bg-red-50 border border-red-100 text-red-600 p-3 rounded-lg text-xs flex items-center gap-2 mb-4 font-bold animate-pulse">
                  <AlertCircle size={16}/> {message}
                </div>
             )}

             {/* CAMPO 1: CONTRASEÑA NUEVA */}
             <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-vinilo-red transition-colors" size={18} />
                <input 
                  type={showPassword ? "text" : "password"}
                  placeholder="Nueva contraseña"
                  className="w-full bg-gray-50 border border-gray-200 py-3.5 pl-10 pr-10 text-sm outline-none focus:bg-white focus:border-vinilo-red focus:ring-1 focus:ring-vinilo-red/20 transition-all rounded-lg"
                  value={password}
                  onChange={(e) => {
                      setPassword(e.target.value);
                      if(status === 'error') setStatus('idle'); // Limpiar error al escribir
                  }}
                  required
                />
                 <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)} 
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-vinilo-black transition-colors"
                 >
                    {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                 </button>
             </div>

             {/* CAMPO 2: CONFIRMAR CONTRASEÑA */}
             <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-vinilo-red transition-colors" size={18} />
                <input 
                  type={showConfirmPassword ? "text" : "password"} 
                  placeholder="Confirmar nueva contraseña"
                  className="w-full bg-gray-50 border border-gray-200 py-3.5 pl-10 pr-10 text-sm outline-none focus:bg-white focus:border-vinilo-red focus:ring-1 focus:ring-vinilo-red/20 transition-all rounded-lg"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button 
                    type="button" 
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-vinilo-black transition-colors"
                >
                    {showConfirmPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                 </button>
             </div>

             {/* Texto de Ayuda */}
             <div className="px-1 text-[11px] text-gray-400 leading-tight">
                <p>* La contraseña debe tener al menos <span className="font-bold">8 caracteres</span>.</p>
                <p>* Incluye al menos <span className="font-bold">una letra</span> y <span className="font-bold">un número</span>.</p>
             </div>

             <Button variant="primary" size="full" type="submit" disabled={status === 'loading'}>
                {status === 'loading' ? (
                    <span className="flex items-center gap-2 justify-center">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> 
                        Procesando...
                    </span>
                ) : 'Restablecer Contraseña'}
             </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;