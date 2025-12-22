import React, { useState } from 'react';
import { Link } from 'react-router-dom'; 
import { Heart, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart(); 
  const { toggleWishlist, isAuthenticated } = useAuth();

  const [isLiked, setIsLiked] = useState(product.is_liked || false);
  const [loadingWishlist, setLoadingWishlist] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false); // Estado para la animación

  const handleAddToCart = (e) => {
    e.preventDefault(); 
    e.stopPropagation(); 
    
    const defaultSize = product.variants && product.variants.length > 0 
        ? product.variants[0].size 
        : "Única";

    addToCart(product, defaultSize, 1); 
  };

  const handleWishlistClick = async (e) => {
    e.preventDefault(); 
    e.stopPropagation();

    if (!isAuthenticated) {
        alert("Debes iniciar sesión para agregar a favoritos");
        return;
    }

    if (loadingWishlist) return;
    setLoadingWishlist(true);
    
    // Dispara la animación
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);

    const response = await toggleWishlist(product.id);

    if (response.success) {
        setIsLiked(response.action === 'added');
    }
    
    setLoadingWishlist(false);
  };

  return (
    <Link to={`/product/${product.id}`} className="group relative flex flex-col cursor-pointer">
      
      <div className="relative w-full aspect-[3/4] overflow-hidden bg-vinilo-gray">
        
        {product.tag && (
          <span className="absolute top-0 left-0 bg-vinilo-red text-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest z-10">
            {product.tag}
          </span>
        )}

        {/* Wishlist Button con Animación */}
        <button 
          onClick={handleWishlistClick}
          className={`absolute top-2 right-2 z-10 p-2 rounded-full transition-all duration-300
            ${isLiked 
                ? 'text-vinilo-red bg-white opacity-100 shadow-sm'
                : 'text-vinilo-black hover:text-vinilo-red hover:bg-white/50 opacity-0 group-hover:opacity-100'
            }`}
        >
          <Heart 
            size={20} 
            strokeWidth={1.5} 
            fill={isLiked ? "currentColor" : "none"}
            className={`transition-transform
              ${isAnimating ? 'animate-heart-beat' : ''}
              ${loadingWishlist && !isAnimating ? 'animate-pulse' : ''}
            `}
          />
        </button>

        <img 
          src={product.image || 'https://via.placeholder.com/400x600?text=Sin+Imagen'} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-1000 ease-in-out group-hover:scale-110"
        />

        <div className="absolute inset-x-0 bottom-0">
            <button 
                onClick={handleAddToCart}
                className="w-full bg-white/95 backdrop-blur text-vinilo-black py-4 text-xs font-bold uppercase tracking-widest hover:bg-vinilo-black hover:text-white transition-all translate-y-full group-hover:translate-y-0 duration-300 flex items-center justify-center gap-2 border-t border-vinilo-black/10"
            >
               <ShoppingBag size={14} /> Agregar al Carrito
            </button>
        </div>
      </div>

      <div className="mt-4 flex justify-between items-start">
        <div>
          <h3 className="font-serif text-lg leading-none text-vinilo-black group-hover:text-vinilo-red transition-colors line-clamp-2">
            {product.name}
          </h3>
          <p className="font-sans text-xs text-gray-500 mt-1 uppercase tracking-wider">
            {product.brand || `Ref: ${product.id}`}
          </p>
        </div>
        <p className="font-sans text-sm font-bold text-vinilo-black whitespace-nowrap ml-2">
          ${parseFloat(product.price).toLocaleString()}
        </p>
      </div>
    </Link>
  );
};

export default ProductCard;