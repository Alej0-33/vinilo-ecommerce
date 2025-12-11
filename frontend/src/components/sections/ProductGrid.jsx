import React from 'react';
import ProductCard from '../ui/ProductCard';

const ProductGrid = ({ title, products }) => {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        
        {/* Header */}
        <div className="flex justify-between items-end mb-16 border-b border-gray-100 pb-4">
          <h2 className="font-serif text-3xl md:text-4xl text-vinilo-black">
            {title}<span className="text-vinilo-red">.</span>
          </h2>
          <a href="#" className="hidden md:block font-sans text-xs font-bold uppercase tracking-widest text-vinilo-black hover:text-vinilo-red transition-colors">
            Ver Todos
          </a>
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

        <div className="mt-12 text-center md:hidden">
            <button className="text-xs border-b border-black pb-1 uppercase tracking-widest">Ver Todo</button>
        </div>

      </div>
    </section>
  );
};

export default ProductGrid;