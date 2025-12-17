import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const BASE_URL = import.meta.VITE_API_URL;

  // --- 1. VERIFICAR SESIÓN AL CARGAR APP ---
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    const token = localStorage.getItem('access_token');
    if (token) {
        try {
            const response = await fetch(`${BASE_URL}/auth/me/`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const userData = await response.json();
                setUser(userData);
                setIsAuthenticated(true);
            } else {
                await refreshToken(); 
            }
        } catch (err) {
            logout();
        }
    }
    setLoading(false);
  };

  // --- 2. LOGIN (SANITIZADO) ---
  const login = async (email, password) => {
    setError(null);
    
    // Sanitización: quitar espacios y minúsculas
    const cleanEmail = email.trim().toLowerCase();

    try {
        const response = await fetch(`${BASE_URL}/auth/login/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: cleanEmail, password }) 
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('access_token', data.access);
            localStorage.setItem('refresh_token', data.refresh);
            setUser(data.user);
            setIsAuthenticated(true);
            return { success: true };
        } else {
            const msg = data.detail || "Credenciales incorrectas";
            setError(msg);
            return { success: false, message: msg };
        }
    } catch (err) {
        return { success: false, message: "Error de conexión con el servidor" };
    }
  };

  // --- 3. REGISTER (SANITIZADO) ---
  const register = async (userData) => {
    setError(null);
    try {
        // Sanitización de datos antes de enviar
        const payload = {
            username: userData.email.trim().toLowerCase(), // Django requiere username
            email: userData.email.trim().toLowerCase(),
            first_name: userData.firstName.trim(),
            last_name: userData.lastName.trim(),
            password: userData.password // La contraseña NO se toca (espacios pueden ser válidos)
        };

        const response = await fetch(`${BASE_URL}/auth/register/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (response.ok) {
            // Retornamos success y una bandera para pedir el código OTP.
            return { success: true, needVerification: true, email: payload.email };
        } else {
            let msg = "Error en el registro";
            // Manejo de errores de validación de Django
            if (data.username) msg = `Usuario: ${data.username[0]}`;
            else if (data.email) msg = `Email: ${data.email[0]}`;
            else if (data.password) msg = `Contraseña: ${data.password[0]}`;
            else if (data.detail) msg = data.detail;
            
            setError(msg);
            return { success: false, message: msg };
        }
    } catch (err) {
        return { success: false, message: "Error al conectar con el servidor" };
    }
  };

  // --- 4. VERIFICAR EMAIL (SANITIZADO) ---
  const verifyEmail = async (email, code) => {
      setError(null);
      // Sanitización
      const cleanEmail = email.trim().toLowerCase();
      const cleanCode = code.trim();

      try {
          const response = await fetch(`${BASE_URL}/auth/register/verify/`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email: cleanEmail, code: cleanCode })
          });
          
          const data = await response.json();
          if (response.ok) {
              return { success: true };
          } else {
              return { success: false, message: data.error || "Código inválido" };
          }
      } catch (err) {
          return { success: false, message: "Error de conexión" };
      }
  };

  // --- 5. ACTUALIZAR PERFIL (SANITIZADO) ---
  const updateProfile = async (userData) => {
    setError(null);
    const token = localStorage.getItem('access_token');
    
    if (!token) return { success: false, message: "No estás autenticado" };

    try {
        const response = await fetch(`${BASE_URL}/auth/me/`, {
            method: 'PATCH',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify({
                first_name: userData.firstName.trim(),
                last_name: userData.lastName.trim(),
                email: userData.email.trim().toLowerCase()
            })
        });

        const data = await response.json();

        if (response.ok) {
            setUser(data);
            return { success: true };
        } else {
            let msg = "No se pudo actualizar.";
            if (data.email) msg = data.email[0];
            return { success: false, message: msg };
        }
    } catch (err) {
        return { success: false, message: "Error de conexión." };
    }
  };

  // --- 6. REFRESH TOKEN ---
  const refreshToken = async () => {
      const refresh = localStorage.getItem('refresh_token');
      if (!refresh) {
          logout();
          return false;
      }
      try {
          const response = await fetch(`${BASE_URL}/auth/login/refresh/`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ refresh })
          });
          if (response.ok) {
              const data = await response.json();
              localStorage.setItem('access_token', data.access);
              setIsAuthenticated(true);
              return true;
          } else {
              logout();
              return false;
          }
      } catch {
          logout();
          return false;
      }
  };

  // --- 7. LOGOUT ---
  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
    setIsAuthenticated(false);
  };

  // --- 8. SOLICITUD RECUPERAR PASSWORD (SANITIZADO) ---
  const recoverPassword = async (email) => {
      const cleanEmail = email.trim().toLowerCase();
      try {
          const response = await fetch(`${BASE_URL}/auth/password-reset/`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email: cleanEmail })
          });
          // Retornamos true si es 200 OK
          return { success: response.ok }; 
      } catch (err) {
          return { success: false, message: "Error al intentar recuperar contraseña" };
      }
  };

  // --- 9. CONFIRMAR NUEVA PASSWORD ---
  const confirmPasswordReset = async (uid, token, password) => {
    try {
        const response = await fetch(`${BASE_URL}/auth/password-reset/confirm/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ uid, token, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            return { success: true };
        } else {
            return { success: false, message: data.error || data.detail || "Error al restablecer" };
        }
    } catch (err) {
        return { success: false, message: "Error de conexión" };
    }
  };

  // --- 10. WISHLIST TOGGLE ---
  const toggleWishlist = async (productId) => {
    const token = localStorage.getItem('access_token');
    if (!token) return { success: false, error: 'auth_required' };

    try {
        const response = await fetch(`${BASE_URL}/store/wishlist/toggle/${productId}/`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            }
        });

        if (response.ok) {
            const data = await response.json();
            return { success: true, action: data.status }; 
        } else {
            return { success: false, error: 'api_error' };
        }
    } catch (err) {
        return { success: false, error: 'network_error' };
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    verifyEmail,
    updateProfile,
    logout,
    recoverPassword,
    confirmPasswordReset,
    toggleWishlist
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};