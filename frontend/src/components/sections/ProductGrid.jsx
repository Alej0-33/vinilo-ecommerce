import React from 'react';
import { Link } from 'react-router-dom'; // 1. Importar Link
import ProductCard from '../ui/ProductCard';

const ProductGrid = ({ title, products }) => {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        
        {/* Header con Enlace Funcional */}
        <div className="flex justify-between items-end mb-16 border-b border-gray-100 pb-4">
          <h2 className="font-serif text-3xl md:text-4xl text-vinilo-black">
            {title}<span className="text-vinilo-red">.</span>
          </h2>
          
          {/* 2. Usar Link hacia /catalogo */}
          <Link 
            to="/catalogo" 
            className="hidden md:block font-sans text-xs font-bold uppercase tracking-widest text-vinilo-black hover:text-vinilo-red transition-colors"
          >
            Ver Todos
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-12 md:gap-8">
          {products.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
            />
          ))}
        </div>

        {/* Botón Móvil Funcional */}
        <div className="mt-12 text-center md:hidden">
            <Link 
                to="/catalogo"
                className="text-xs border-b border-black pb-1 uppercase tracking-widest text-vinilo-black hover:text-vinilo-red hover:border-vinilo-red transition-colors"
            >
                Ver Todo
            </Link>
        </div>

      </div>
    </section>
  );
};

export default ProductGrid;