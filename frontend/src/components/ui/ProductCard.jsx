import React from 'react';
import { Heart, ShoppingBag } from 'lucide-react';

const ProductCard = ({ product }) => {
  return (
    <div className="group relative flex flex-col">
      {/* Contenedor de Imagen */}
      <div className="relative w-full aspect-[4/5] overflow-hidden bg-gray-100">
        
        {/* Badge (Etiqueta) */}
        {product.tag && (
          <span className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-vinilo-black z-10">
            {product.tag}
          </span>
        )}

        {/* Botón Wishlist */}
        <button className="absolute top-2 right-2 z-10 p-2 rounded-full bg-transparent hover:bg-white text-vinilo-black transition-all opacity-0 group-hover:opacity-100">
          <Heart size={18} strokeWidth={1.5} />
        </button>

        {/* Imagen */}
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
        />

        {/* Quick Add Overlay (Estilo Mattelsa) */}
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out flex justify-center">
            <button className="w-full bg-white text-vinilo-black py-3 px-4 text-xs font-bold uppercase tracking-widest hover:bg-vinilo-red hover:text-white transition-colors shadow-lg flex items-center justify-center gap-2">
               <ShoppingBag size={16} /> Agregar
            </button>
        </div>
      </div>

      {/* Info del Producto */}
      <div className="mt-4 text-center md:text-left">
        <h3 className="font-serif text-base text-vinilo-black group-hover:text-vinilo-red transition-colors cursor-pointer">
          {product.name}
        </h3>
        <p className="font-sans text-sm text-gray-500 mt-1 font-medium">
          ${product.price.toLocaleString()} COP
        </p>
      </div>
    </div>
  );
};

export default ProductCard;