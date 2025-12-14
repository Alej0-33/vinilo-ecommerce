import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ui/ProductCard';
import { SlidersHorizontal, ChevronDown, X, Check, Loader2 } from 'lucide-react';

// --- CONSTANTES UI ---
const CATEGORIES = ["Nike", "Adidas", "Reebok", "Puma"]; // Esto en el backend se mapea a 'brand'
const GENDERS = ["Hombre", "Mujer"];
const SIZES = ["35", "36", "37", "38", "39", "40", "41", "42"];

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
          
          {/* 1. Género */}
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

          {/* 2. Categoría (MARCA) */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest mb-4 text-vinilo-black">Marca</h3>
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
  const genderUrlParam = searchParams.get('genero'); 

  // --- ESTADOS BACKEND ---
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeSort, setActiveSort] = useState('relevance'); 
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  // Estados de filtros locales
  const [localFilters, setLocalFilters] = useState({
    gender: [],
    category: [], // Se usará como BRAND
    sizes: []
  });

  // 1. FETCH API CON FILTROS (SERVER SIDE FILTERING)
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // Construir URL base
        const baseUrl = new URL('http://127.0.0.1:8000/api/products/');
        
        // A. Agregar Filtro de Género
        if (genderUrlParam) {
            // Prioridad a la URL
            const g = genderUrlParam.toLowerCase() === 'hombre' ? 'M' : 'F';
            baseUrl.searchParams.append('gender', g);
        } else if (localFilters.gender.length > 0) {
            // Filtro local del sidebar
            localFilters.gender.forEach(g => {
                const val = g === 'Hombre' ? 'M' : 'F';
                baseUrl.searchParams.append('gender', val);
            });
        }

        // B. Agregar Filtro de Marca (Usamos 'category' del state para filtrar 'brand' en backend)
        if (localFilters.category.length > 0) {
            localFilters.category.forEach(brand => {
                // Django Filter es case-insensitive gracias a 'iexact' configurado
                baseUrl.searchParams.append('brand', brand);
            });
        }

        // C. Agregar Filtro de Talla
        if (localFilters.sizes.length > 0) {
            localFilters.sizes.forEach(size => {
                // Django Filter buscará en variantes gracias a la configuración
                baseUrl.searchParams.append('size', size);
            });
        }

        // Realizar la petición
        const response = await fetch(baseUrl.toString());
        if (!response.ok) throw new Error('Error de conexión con el servidor');
        
        const data = await response.json();
        setProducts(data);
        setError(null);

      } catch (err) {
        console.error("Error fetching products:", err);
        setError("No se pudieron cargar los productos.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [genderUrlParam, localFilters]); // Se ejecuta cada vez que cambian los filtros

  // 2. LOGICA DE ORDENAMIENTO (Client Side Sorting)
  // Nota: Ya no filtramos aquí porque el Backend entregó los datos filtrados. Solo ordenamos.
  const processedProducts = useMemo(() => {
    let result = [...products];

    if (activeSort === 'price-asc') {
      result.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    } else if (activeSort === 'price-desc') {
      result.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    }

    return result;
  }, [products, activeSort]);


  // Helpers de filtros
  const clearAllFilters = () => {
      setLocalFilters({ gender: [], category: [], sizes: [] });
  };
  
  const clearUrlFilter = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('genero');
    setSearchParams(newParams);
  }
  
  const getActiveFiltersCount = () => {
      return localFilters.gender.length + localFilters.category.length + localFilters.sizes.length;
  };

  // --- RENDER DE CARGA O ERROR ---
  if (loading) {
      return (
          <div className="min-h-screen bg-white flex flex-col items-center justify-center">
              <Loader2 className="animate-spin text-vinilo-red mb-2" size={40} />
              <p className="text-xs uppercase tracking-widest text-gray-500">Cargando catálogo...</p>
          </div>
      );
  }

  if (error) {
      return (
          <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
              <p className="text-vinilo-red font-serif text-lg mb-4">Ups, ocurrió un error.</p>
              <p className="text-gray-500 text-sm mb-6">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="bg-vinilo-black text-white px-6 py-2 text-xs font-bold uppercase tracking-widest"
              >
                  Recargar Página
              </button>
          </div>
      );
  }

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
            hasUrlGender={!!genderUrlParam}
        />
      )}

      {/* Header Visual */}
      <div className="container mx-auto px-6 mb-8">
        <div className="flex flex-col items-center text-center py-12 border-b border-gray-100 animate-fade-in">
           <span className="text-vinilo-red text-xs font-bold uppercase tracking-widest mb-3">Colección 2025</span>
           
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

             {/* Chip para filtro de URL */}
             {genderUrlParam && (
               <button 
                 onClick={clearUrlFilter}
                 className="hidden sm:flex items-center gap-1 bg-gray-100 text-[10px] font-bold uppercase px-3 py-1 rounded-full hover:bg-gray-200 transition-colors text-vinilo-black"
               >
                 {genderUrlParam} <X size={12} />
               </button>
             )}

             <span className="text-xs text-gray-400 hidden sm:block tracking-wide ml-2">
                {products.length} Resultados
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

        {/* Grid de Productos Reales */}
        {processedProducts.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-12 md:gap-x-8 md:gap-y-16 animate-fade-in-up mt-8">
                {processedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        ) : (
            <div className="flex flex-col items-center justify-center py-32 border border-dashed border-gray-200 mt-8">
                <p className="text-gray-400 text-lg font-serif italic mb-4">No se encontraron productos con estos filtros.</p>
                <button 
                    onClick={() => { clearAllFilters(); clearUrlFilter(); }} 
                    className="text-xs font-bold uppercase tracking-widest border-b border-vinilo-red pb-0.5 hover:text-vinilo-red transition-colors"
                >
                    Ver todo el catálogo
                </button>
            </div>
        )}

        {/* Botón Cargar Más */}
        {processedProducts.length > 8 && (
            <div className="mt-24 text-center">
                <p className="text-[10px] text-gray-400 mb-2">Has visto todos los productos disponibles</p>
                <div className="w-12 h-[1px] bg-gray-200 mx-auto"></div>
            </div>
        )}
      </div>
    </div>
  );
};

export default Catalog;