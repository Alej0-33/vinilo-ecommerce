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

  const BASE_URL = 'http://127.0.0.1:8000/api';

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

  // --- 2. LOGIN ---
  const login = async (email, password) => {
    setError(null);
    try {
        const response = await fetch(`${BASE_URL}/auth/login/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: email, password }) 
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

  // --- 3. REGISTER ---
  const register = async (userData) => {
    setError(null);
    try {
        // Django requiere 'username'. Usamos el email como username.
        const payload = {
            username: userData.email,
            email: userData.email,
            first_name: userData.firstName,
            last_name: userData.lastName,
            password: userData.password
        };

        const response = await fetch(`${BASE_URL}/auth/register/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (response.ok) {
            await login(userData.email, userData.password);
            return { success: true };
        } else {
            // Manejo detallado de errores del serializer
            let msg = "Error en el registro";
            if (data.username) msg = `Usuario: ${data.username[0]}`;
            else if (data.email) msg = `Email: ${data.email[0]}`;
            else if (data.password) msg = `Contraseña: ${data.password[0]}`;
            
            setError(msg);
            return { success: false, message: msg };
        }
    } catch (err) {
        return { success: false, message: "Error al conectar con el servidor" };
    }
  };

  // --- 4. ACTUALIZAR PERFIL ---
  const updateProfile = async (userData) => {
    setError(null);
    const token = localStorage.getItem('access_token');
    
    if (!token) return { success: false, message: "No estás autenticado" };

    try {
        const response = await fetch(`${BASE_URL}/auth/me/`, {
            method: 'PATCH', // Actualización parcial
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify({
                first_name: userData.firstName,
                last_name: userData.lastName,
                email: userData.email
            })
        });

        const data = await response.json();

        if (response.ok) {
            setUser(data); // Actualizamos el estado local con los nuevos datos
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

  // --- 5. REFRESH TOKEN ---
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

  // --- 6. LOGOUT ---
  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
    setIsAuthenticated(false);
  };

  // --- 7. PASSWORD RECOVERY ---
  const recoverPassword = async (email) => {
      // Simulado por ahora, requiere endpoint Django
      return { success: true };
  };

  // --- 8. SOCIAL LOGIN ---
  const socialLogin = async (provider, token) => {
      alert("Configuración backend requerida");
  };

  // --- 9. WISHLIST TOGGLE (NUEVO) ---
  const toggleWishlist = async (productId) => {
    const token = localStorage.getItem('access_token');
    
    // Si no está logueado, retornamos error auth_required
    if (!token) return { success: false, error: 'auth_required' };

    try {
        // La URL debe coincidir con la de urls.py. Usualmente en store.
        const response = await fetch(`${BASE_URL}/store/wishlist/toggle/${productId}/`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            }
        });

        if (response.ok) {
            const data = await response.json();
            // Retorna: { success: true, action: 'added' | 'removed' }
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
    updateProfile,
    logout,
    recoverPassword,
    socialLogin,
    toggleWishlist // Exportamos la nueva función aquí
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};