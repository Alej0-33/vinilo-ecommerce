import React from 'react';
import { Link } from 'react-router-dom'; // Importamos Link para la navegación
import { Heart, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart(); 

  const handleAddToCart = (e) => {
    e.preventDefault(); // Evita navegar a la página del producto al dar click en el botón
    e.stopPropagation(); 
    
    // Intentamos obtener la primera talla disponible de las variantes del backend
    // Si no hay variantes, asumimos talla "Única"
    const defaultSize = product.variants && product.variants.length > 0 
        ? product.variants[0].size 
        : "Única";

    addToCart(product, defaultSize, 1); 
  };

  return (
    // Envolvemos todo en Link para ir al detalle del producto
    <Link to={`/product/${product.id}`} className="group relative flex flex-col cursor-pointer">
      
      {/* Imagen */}
      <div className="relative w-full aspect-[3/4] overflow-hidden bg-vinilo-gray">
        
        {/* Badge (Tag) */}
        {product.tag && (
          <span className="absolute top-0 left-0 bg-vinilo-red text-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest z-10">
            {product.tag}
          </span>
        )}

        {/* Wishlist */}
        <button 
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
          className="absolute top-2 right-2 z-10 p-2 rounded-full text-vinilo-black hover:text-vinilo-red hover:bg-white/50 transition-all opacity-0 group-hover:opacity-100"
        >
          <Heart size={20} strokeWidth={1.5} />
        </button>

        <img 
          // Manejo seguro de imagen: si es null usa placeholder
          src={product.image || 'https://via.placeholder.com/400x600?text=Sin+Imagen'} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-1000 ease-in-out group-hover:scale-110"
        />

        {/* Quick Add - Aparece desde abajo */}
        <div className="absolute inset-x-0 bottom-0">
            <button 
                onClick={handleAddToCart}
                className="w-full bg-white/95 backdrop-blur text-vinilo-black py-4 text-xs font-bold uppercase tracking-widest hover:bg-vinilo-black hover:text-white transition-all translate-y-full group-hover:translate-y-0 duration-300 flex items-center justify-center gap-2 border-t border-vinilo-black/10"
            >
               <ShoppingBag size={14} /> Agregar al Carrito
            </button>
        </div>
      </div>

      {/* Info */}
      <div className="mt-4 flex justify-between items-start">
        <div>
          <h3 className="font-serif text-lg leading-none text-vinilo-black group-hover:text-vinilo-red transition-colors line-clamp-2">
            {product.name}
          </h3>
          <p className="font-sans text-xs text-gray-500 mt-1 uppercase tracking-wider">
            {/* Mostramos la Marca o el ID si no hay marca */}
            {product.brand || `Ref: ${product.id}`}
          </p>
        </div>
        <p className="font-sans text-sm font-bold text-vinilo-black whitespace-nowrap ml-2">
          {/* Aseguramos que el precio sea número antes de formatear */}
          ${parseFloat(product.price).toLocaleString()}
        </p>
      </div>
    </Link>
  );
};

export default ProductCard;