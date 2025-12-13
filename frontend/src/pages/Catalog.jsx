import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ui/ProductCard';
import { SlidersHorizontal, ChevronDown, X, Check } from 'lucide-react';

// --- DATA ---
const CATEGORIES = ["Botas", "Mocasines", "Sandalias", "Tenis"];
const GENDERS = ["Hombre", "Mujer"]; // Nuevo filtro
const SIZES = ["35", "36", "37", "38", "39", "40"];

// Generador de datos simulados
const mockCatalog = Array(24).fill(null).map((_, i) => ({
  id: i + 10,
  name: `Vinilo ${CATEGORIES[i % 4]} Ref. 0${i + 1}`,
  price: 120000 + (Math.floor(Math.random() * 20) * 10000),
  tag: i % 5 === 0 ? "New" : (i % 8 === 0 ? "Sale" : null),
  gender: i % 2 === 0 ? 'hombre' : 'mujer',
  category: CATEGORIES[i % 4],
  sizes: ["36", "37", "38", "39"],
  image: `https://images.unsplash.com/photo-${[
      "1543163521-1bf539c55dd2", // Botas
      "1614252235316-8c857d38b5f4", // Mocasines
      "1562273138-f46be4ebdf6c", // Sandalias
      "1560769629-975ec94e6a86"  // Tenis
  ][i % 4]}?q=80&w=600&auto=format&fit=crop`
}));

// --- DRAWER DE FILTROS ---
const FilterSidebar = ({ isOpen, onClose, filters, setFilters, clearFilters, hasUrlGender }) => {
  
  const toggleFilter = (type, value) => {
    setFilters(prev => {
      const current = prev[type];
      const updated = current.includes(value)
        ? current.filter(item => item !== value)
        : [...current, value];
      return { ...prev, [type]: updated };
    });
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/40 z-50 transition-opacity animate-fade-in" onClick={onClose} />
      
      {/* Drawer */}
      <div className="fixed inset-y-0 left-0 w-80 bg-white z-50 shadow-2xl flex flex-col animate-slide-in-left">
        
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="font-serif text-xl italic text-vinilo-black">Filtros</h2>
          <button onClick={onClose}><X size={24} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {/* 1. Género (Solo se muestra si NO hay un filtro fijo en la URL para evitar conflictos, 
              o puedes dejarlo siempre visible si prefieres) */}
          {!hasUrlGender && (
            <div>
                <h3 className="text-xs font-bold uppercase tracking-widest mb-4 text-vinilo-black">Género</h3>
                <div className="space-y-3">
                {GENDERS.map(gen => (
                    <label key={gen} className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-4 h-4 border flex items-center justify-center transition-colors ${filters.gender.includes(gen) ? 'bg-vinilo-red border-vinilo-red' : 'border-gray-300 group-hover:border-vinilo-black'}`}>
                        {filters.gender.includes(gen) && <Check size={10} className="text-white" />}
                    </div>
                    <input type="checkbox" className="hidden" checked={filters.gender.includes(gen)} onChange={() => toggleFilter('gender', gen)} />
                    <span className="text-sm font-sans text-gray-600 group-hover:text-vinilo-black transition-colors">{gen}</span>
                    </label>
                ))}
                </div>
                <hr className="border-gray-100 mt-6" />
            </div>
          )}

          {/* 2. Categoría */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest mb-4 text-vinilo-black">Categoría</h3>
            <div className="space-y-3">
              {CATEGORIES.map(cat => (
                <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                  <div className={`w-4 h-4 border flex items-center justify-center transition-colors ${filters.category.includes(cat) ? 'bg-vinilo-red border-vinilo-red' : 'border-gray-300 group-hover:border-vinilo-black'}`}>
                    {filters.category.includes(cat) && <Check size={10} className="text-white" />}
                  </div>
                  <input type="checkbox" className="hidden" checked={filters.category.includes(cat)} onChange={() => toggleFilter('category', cat)} />
                  <span className="text-sm font-sans text-gray-600 group-hover:text-vinilo-black transition-colors">{cat}</span>
                </label>
              ))}
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* 3. Tallas */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest mb-4 text-vinilo-black">Talla</h3>
            <div className="grid grid-cols-4 gap-2">
              {SIZES.map(size => (
                <button
                  key={size}
                  onClick={() => toggleFilter('sizes', size)}
                  className={`py-2 text-xs font-sans transition-all border ${
                    filters.sizes.includes(size) 
                      ? 'bg-vinilo-black text-white border-vinilo-black' 
                      : 'bg-white text-gray-500 border-gray-200 hover:border-vinilo-black'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Drawer */}
        <div className="p-6 border-t border-gray-100 flex gap-4">
            <button onClick={clearFilters} className="flex-1 py-3 text-xs font-bold uppercase tracking-widest border border-gray-200 hover:border-vinilo-black hover:text-vinilo-black text-gray-400 transition-colors">
                Limpiar
            </button>
            <button onClick={onClose} className="flex-1 py-3 text-xs font-bold uppercase tracking-widest bg-vinilo-black text-white hover:bg-vinilo-red transition-colors">
                Ver Resultados
            </button>
        </div>
      </div>
    </>
  );
};


// --- PAGE COMPONENT ---
const Catalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const genderUrlParam = searchParams.get('genero'); // Parametro de URL (si venimos del header)

  const [activeSort, setActiveSort] = useState('relevance'); 
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  // Estados de filtros locales (Sidebar)
  const [localFilters, setLocalFilters] = useState({
    gender: [],
    category: [],
    sizes: []
  });

  // LOGICA CENTRAL DE FILTRADO
  const processedProducts = useMemo(() => {
    let result = [...mockCatalog];

    // 1. Filtro Género
    // Prioridad: URL param > Filtro Local
    if (genderUrlParam) {
      result = result.filter(
        p => p.gender && p.gender.toLowerCase() === genderUrlParam.toLowerCase()
      );
    } else if (localFilters.gender.length > 0) {
      // Si no hay URL param, usamos el filtro del sidebar (permite multiselección: hombre OR mujer)
      result = result.filter(p => localFilters.gender.some(g => g.toLowerCase() === p.gender.toLowerCase()));
    }

    // 2. Filtro Categoría
    if (localFilters.category.length > 0) {
      result = result.filter(p => localFilters.category.includes(p.category));
    }

    // 3. Filtro Tallas
    if (localFilters.sizes.length > 0) {
      result = result.filter(p => p.sizes.some(s => localFilters.sizes.includes(s)));
    }

    // 4. Ordenamiento
    if (activeSort === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (activeSort === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [genderUrlParam, localFilters, activeSort]);


  const clearAllFilters = () => {
      setLocalFilters({ gender: [], category: [], sizes: [] });
  };

  const clearUrlFilter = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('genero');
    setSearchParams(newParams);
  }

  const getActiveFiltersCount = () => {
      // Si hay param URL no contamos el genero local para no confundir, o sumamos todo.
      return localFilters.gender.length + localFilters.category.length + localFilters.sizes.length;
  };

  return (
    <div className="bg-white min-h-screen pb-24 relative">
      
      {/* Sidebar Overlay */}
      {isFilterOpen && (
        <FilterSidebar 
            isOpen={isFilterOpen} 
            onClose={() => setIsFilterOpen(false)}
            filters={localFilters}
            setFilters={setLocalFilters}
            clearFilters={clearAllFilters}
            hasUrlGender={!!genderUrlParam} // Pasamos si hay un filtro de URL activo para ocultar esa sección si se desea
        />
      )}

      {/* Header Visual */}
      <div className="container mx-auto px-6 mb-8">
        <div className="flex flex-col items-center text-center py-12 border-b border-gray-100 animate-fade-in">
           <span className="text-vinilo-red text-xs font-bold uppercase tracking-widest mb-3">Colección 2025</span>
           
           {/* Título Dinámico */}
           <h1 className="font-serif text-5xl md:text-7xl text-vinilo-black mb-4 capitalize">
             {genderUrlParam ? `Colección ${genderUrlParam}` : 'Catálogo Completo'}
           </h1>
           
           <p className="max-w-xl text-gray-500 font-sans text-sm font-light">
             {genderUrlParam 
                ? `Explora la selección exclusiva de calzado y accesorios diseñada para ${genderUrlParam}.`
                : 'Diseños exclusivos que fusionan la estética contemporánea con la comodidad absoluta.'
             }
           </p>
        </div>

        {/* Toolbar Sticky */}
        <div className="flex flex-wrap justify-between items-center py-4 sticky top-[57px] md:top-[68px] lg:top-[60px] bg-white/95 backdrop-blur-sm z-30 transition-all border-b border-transparent md:border-gray-50">
          
          <div className="flex items-center gap-3">
             {/* Botón Filtros */}
             <button 
                onClick={() => setIsFilterOpen(true)}
                className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest border border-gray-300 px-5 py-2.5 hover:border-vinilo-black hover:bg-vinilo-black hover:text-white transition-all group"
             >
                <SlidersHorizontal size={14} /> Filtros
                {getActiveFiltersCount() > 0 && (
                    <span className="ml-1 bg-vinilo-red text-white w-4 h-4 rounded-full text-[9px] flex items-center justify-center">
                        {getActiveFiltersCount()}
                    </span>
                )}
             </button>

             {/* Chip para filtro de URL (si existe) */}
             {genderUrlParam && (
               <button 
                 onClick={clearUrlFilter}
                 className="hidden sm:flex items-center gap-1 bg-gray-100 text-[10px] font-bold uppercase px-3 py-1 rounded-full hover:bg-gray-200 transition-colors text-vinilo-black"
               >
                 {genderUrlParam} <X size={12} />
               </button>
             )}

             <span className="text-xs text-gray-400 hidden sm:block tracking-wide ml-2">
                {processedProducts.length} Resultados
             </span>
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <button 
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:text-vinilo-red transition-colors"
            >
               <span className="text-gray-400 font-normal hidden sm:inline">Ordenar por:</span>
               {activeSort === 'relevance' ? 'Relevancia' : activeSort === 'price-asc' ? 'Menor Precio' : 'Mayor Precio'}
               <ChevronDown size={14} className={`transition-transform duration-300 ${isSortOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isSortOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-100 shadow-xl z-40 animate-fade-in-up">
                    <div className="flex flex-col py-1">
                        {[
                            { label: 'Relevancia', value: 'relevance' },
                            { label: 'Precio: Menor a Mayor', value: 'price-asc' },
                            { label: 'Precio: Mayor a Menor', value: 'price-desc' }
                        ].map((opt) => (
                            <button 
                                key={opt.value}
                                onClick={() => { setActiveSort(opt.value); setIsSortOpen(false); }}
                                className={`px-5 py-3 text-xs text-left hover:bg-gray-50 transition-colors flex justify-between items-center ${activeSort === opt.value ? 'font-bold text-vinilo-black' : 'text-gray-500'}`}
                            >
                                {opt.label}
                                {activeSort === opt.value && <Check size={12} className="text-vinilo-red"/>}
                            </button>
                        ))}
                    </div>
                </div>
            )}
          </div>
        </div>

        {/* Grid de Productos */}
        {processedProducts.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-12 md:gap-x-8 md:gap-y-16 animate-fade-in-up mt-8">
                {processedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        ) : (
            <div className="flex flex-col items-center justify-center py-32 border border-dashed border-gray-200 mt-8">
                <p className="text-gray-400 text-lg font-serif italic mb-4">No se encontraron productos.</p>
                <button 
                    onClick={() => { clearAllFilters(); clearUrlFilter(); }} 
                    className="text-xs font-bold uppercase tracking-widest border-b border-vinilo-red pb-0.5 hover:text-vinilo-red transition-colors"
                >
                    Ver todo el catálogo
                </button>
            </div>
        )}

        {/* Load More */}
        {processedProducts.length > 0 && (
            <div className="mt-24 text-center">
                <button className="px-12 py-4 border border-gray-200 text-vinilo-black text-xs font-bold uppercase tracking-[0.2em] hover:bg-vinilo-black hover:text-white hover:border-vinilo-black transition-all duration-300">
                    Cargar más
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default Catalog;