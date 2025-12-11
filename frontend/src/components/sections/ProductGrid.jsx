import React from 'react';
import ProductCard from '../ui/ProductCard';

const ProductGrid = ({ title, subtitle, products }) => {
  return (
    <section className="py-16 md:py-24 px-4 bg-white">
      <div className="container mx-auto">
        
        {/* Encabezado de la Sección */}
        <div className="flex flex-col items-center mb-12 md:mb-16">
          {subtitle && (
            <span className="text-vinilo-red font-bold uppercase tracking-widest text-[10px] md:text-xs mb-3">
              {subtitle}
            </span>
          )}
          <h2 className="font-serif text-3xl md:text-5xl text-vinilo-black text-center font-medium">
            {title}
          </h2>
        </div>

        {/* Grilla de Productos */}
        {/* Grid-cols-2 en móvil para que las fotos se vean grandes (Estilo Mattelsa) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-12 md:gap-x-8">
          {products.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
            />
          ))}
        </div>

        {/* Botón/Link "Ver Todo" */}
        <div className="mt-16 text-center">
          <a 
            href="#" 
            className="inline-block border-b border-vinilo-black pb-1 text-xs md:text-sm uppercase tracking-widest font-bold text-vinilo-black hover:text-vinilo-red hover:border-vinilo-red transition-all duration-300"
          >
            Ver todo el catálogo
          </a>
        </div>

      </div>
    </section>
  );
};

export default ProductGrid;