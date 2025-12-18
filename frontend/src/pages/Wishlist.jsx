import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, ShoppingBag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ui/ProductCard'; // Asegúrate que la ruta sea correcta

const Wishlist = () => {
  const { isAuthenticated, logout } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // URL de tu Backend (ajústala si es diferente)
  const BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    // Si no está logueado, lo mandamos al login o home
    if (!isAuthenticated) {
        setLoading(false);
        return;
    }

    const fetchWishlist = async () => {
        try {
            const token = localStorage.getItem('access_token');
            const response = await fetch(`${BASE_URL}/store/wishlist/`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setItems(data);
            }
        } catch (error) {
            console.error("Error cargando wishlist", error);
        } finally {
            setLoading(false);
        }
    };

    fetchWishlist();
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center">
            <Heart size={48} className="text-gray-200 mb-4" />
            <h2 className="font-serif text-2xl text-vinilo-black mb-2">Inicia sesión</h2>
            <p className="text-gray-400 mb-6">Necesitas una cuenta para ver tus favoritos.</p>
            <Link to="/" className="text-vinilo-red font-bold underline">Volver al inicio</Link>
        </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Header de la sección */}
        <div className="flex items-center gap-4 mb-8">
            <button onClick={() => navigate(-1)} className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-vinilo-black transition-colors">
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                Volver
            </button>
            <div className="h-px bg-gray-200 flex-1 ml-4"></div>
            <h1 className="font-serif text-3xl italic text-vinilo-black pr-4 bg-white z-10">Tu Wishlist</h1>
        </div>

        {/* Estado de carga */}
        {loading ? (
             <div className="flex items-center justify-center h-40">
                <div className="w-8 h-8 border-4 border-gray-200 border-t-vinilo-red rounded-full animate-spin"></div>
            </div>
        ) : items.length > 0 ? (
            /* Grid de Productos */
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10">
                {items.map((item) => (
                    /* Nota: El endpoint suele devolver { id, product: {...}, added_at }. 
                       Pasamos item.product al ProductCard */
                    <ProductCard key={item.id} product={{...item.product, is_liked: true}} />
                ))}
            </div>
        ) : (
            /* Estado Vacío */
            <div className="text-center py-20 bg-gray-50">
                <Heart size={48} className="text-gray-300 mx-auto mb-4" />
                <h3 className="font-serif text-xl text-vinilo-black mb-2">Tu lista está vacía</h3>
                <p className="text-gray-400 text-sm mb-6">Guarda lo que te gusta para no perderlo de vista.</p>
                <Link to="/catalogo" className="inline-flex items-center gap-2 px-8 py-3 bg-vinilo-black text-white text-xs font-bold uppercase tracking-widest hover:bg-vinilo-red transition-colors">
                    <ShoppingBag size={16} /> Explorar Catálogo
                </Link>
            </div>
        )}
    </div>
  );
};

export default Wishlist;