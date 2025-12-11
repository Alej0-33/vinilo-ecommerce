import React from 'react';
import { Heart, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext'; // <--- 1. Importar el Hook del carrito

const ProductCard = ({ product }) => {
  // 2. Obtener la función addToCart del contexto
  const { addToCart } = useCart(); 

  // 3. Definir la función handleAddToCart
  const handleAddToCart = (e) => {
    e.preventDefault(); // Evita recargar si está dentro de un link
    e.stopPropagation(); // Evita que el click abra el detalle del producto si la carta es clickeable
    
    // Aquí agregamos el producto al carrito. 
    // Como ejemplo, enviamos una talla por defecto "38" y cantidad 1.
    // En una implementación completa, esto abriría un modal para elegir talla.
    addToCart(product, "38", 1); 
  };

  return (
    <div className="group relative flex flex-col cursor-pointer">
      {/* Imagen */}
      <div className="relative w-full aspect-[3/4] overflow-hidden bg-vinilo-gray">
        
        {/* Badge */}
        {product.tag && (
          <span className="absolute top-0 left-0 bg-vinilo-red text-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest z-10">
            {product.tag}
          </span>
        )}

        {/* Wishlist */}
        <button className="absolute top-2 right-2 z-10 p-2 rounded-full text-vinilo-black hover:text-vinilo-red hover:bg-white/50 transition-all opacity-0 group-hover:opacity-100">
          <Heart size={20} strokeWidth={1.5} />
        </button>

        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-1000 ease-in-out group-hover:scale-110"
        />

        {/* Quick Add - Aparece desde abajo */}
        <div className="absolute inset-x-0 bottom-0">
            <button 
                onClick={handleAddToCart} // <--- Ahora sí existe esta función
                className="w-full bg-white/95 backdrop-blur text-vinilo-black py-4 text-xs font-bold uppercase tracking-widest hover:bg-vinilo-black hover:text-white transition-all translate-y-full group-hover:translate-y-0 duration-300 flex items-center justify-center gap-2 border-t border-vinilo-black/10"
            >
               <ShoppingBag size={14} /> Agregar al Carrito
            </button>
        </div>
      </div>

      {/* Info */}
      <div className="mt-4 flex justify-between items-start">
        <div>
          <h3 className="font-serif text-lg leading-none text-vinilo-black group-hover:text-vinilo-red transition-colors">
            {product.name}
          </h3>
          <p className="font-sans text-xs text-gray-500 mt-1 uppercase tracking-wider">
            Ref: {product.id}00
          </p>
        </div>
        <p className="font-sans text-sm font-bold text-vinilo-black">
          ${product.price.toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default ProductCard;