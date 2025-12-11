import React from 'react';
import { X, Search } from 'lucide-react';

const SearchOverlay = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white/95 backdrop-blur-xl z-50 flex flex-col animate-fade-in">
      
      {/* Botón Cerrar */}
      <div className="absolute top-6 right-6">
        <button onClick={onClose} className="p-2 hover:rotate-90 transition-transform duration-300">
          <X size={32} strokeWidth={1} />
        </button>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center px-4 max-w-4xl mx-auto w-full">
        <label className="font-serif text-vinilo-black mb-4 text-lg italic">¿Qué estás buscando?</label>
        
        <div className="relative w-full border-b-2 border-vinilo-black pb-2">
          <input 
            type="text" 
            placeholder="Botines, sandalias, accesorios..." 
            className="w-full text-3xl md:text-5xl font-sans font-bold uppercase tracking-tight bg-transparent outline-none placeholder-gray-300 text-vinilo-black"
            autoFocus
          />
          <button className="absolute right-0 bottom-4 text-vinilo-black hover:text-vinilo-red transition-colors">
            <Search size={32} />
          </button>
        </div>

        {/* Sugerencias Rápidas */}
        <div className="mt-12 w-full text-center md:text-left">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Tendencias Ahora</p>
          <div className="flex flex-wrap gap-3 justify-center md:justify-start">
            {['Botas Militares', 'Plataformas', 'Nueva Colección', 'Outlet'].map((tag) => (
              <button 
                key={tag} 
                className="px-4 py-2 border border-gray-200 text-sm hover:border-vinilo-red hover:text-vinilo-red transition-colors bg-white"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchOverlay;