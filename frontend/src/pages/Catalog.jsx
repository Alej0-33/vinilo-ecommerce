import React, { useState } from 'react';
import ProductCard from '../components/ui/ProductCard';
import { SlidersHorizontal, ChevronDown } from 'lucide-react';

const mockCatalog = Array(8).fill(null).map((_, i) => ({
  id: i + 10,
  name: `Producto Vinilo Ref. 0${i + 1}`,
  price: 150000 + (i * 10000),
  tag: i % 3 === 0 ? "New" : null,
  image: `https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=600&auto=format&fit=crop`
}));

const Catalog = () => {
  return (
    <div className="bg-white min-h-screen pt-12 pb-24">
      
      {/* Catalog Header */}
      <div className="container mx-auto px-6 mb-12">
        <div className="flex flex-col items-center text-center py-10 border-b border-gray-100">
           <span className="text-vinilo-red text-xs font-bold uppercase tracking-widest mb-2">Colección 2025</span>
           <h1 className="font-serif text-5xl md:text-6xl text-vinilo-black mb-6">Calzado Mujer</h1>
           <p className="max-w-2xl text-gray-500 font-sans text-sm">
             Descubre nuestra selección de botas, mocasines y sandalias diseñados para destacar.
           </p>
        </div>

        {/* Toolbar de Filtros */}
        <div className="flex flex-wrap justify-between items-center py-6 sticky top-[60px] md:top-[80px] bg-white z-20">
          <div className="flex items-center gap-4">
             <button className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest border border-gray-300 px-5 py-2.5 hover:border-vinilo-black transition-colors">
                <SlidersHorizontal size={14} /> Filtros
             </button>
             <span className="text-xs text-gray-400 hidden md:block">{mockCatalog.length} Productos</span>
          </div>

          <div className="relative group">
            <button className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:text-vinilo-red">
               Ordenar por <ChevronDown size={14} />
            </button>
            {/* Dropdown simple */}
            <div className="absolute right-0 top-full pt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
               <div className="bg-white border border-gray-100 shadow-lg py-2 flex flex-col">
                  <a href="#" className="px-4 py-2 text-xs hover:bg-gray-50 text-left">Relevancia</a>
                  <a href="#" className="px-4 py-2 text-xs hover:bg-gray-50 text-left">Precio: Menor a Mayor</a>
                  <a href="#" className="px-4 py-2 text-xs hover:bg-gray-50 text-left">Precio: Mayor a Menor</a>
               </div>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-12 md:gap-x-8 md:gap-y-16">
          {mockCatalog.map((product) => (
             <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Load More */}
        <div className="mt-20 text-center">
           <button className="px-12 py-3 border border-vinilo-black text-vinilo-black text-xs font-bold uppercase tracking-widest hover:bg-vinilo-black hover:text-white transition-all">
             Cargar más productos
           </button>
        </div>
      </div>
    </div>
  );
};

export default Catalog;