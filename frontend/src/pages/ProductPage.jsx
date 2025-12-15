import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ChevronLeft, Star, ShoppingBag, Truck, ShieldCheck, RefreshCw } from 'lucide-react';
import Button from '../components/ui/Button';
import ReviewForm from '../components/ui/ReviewForm';

const ProductPage = () => {
  const { id } = useParams(); // Obtenemos el ID de la URL
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState(null);

  // Fetch del producto individual
  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/store/products/${id}/`);
        if (!response.ok) throw new Error('Producto no encontrado');
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error(error);
        // Podríamos redirigir a 404
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetail();
  }, [id]);

  if (loading) return <div className="min-h-screen bg-white flex items-center justify-center text-vinilo-black">Cargando...</div>;
  if (!product) return <div className="min-h-screen bg-white flex items-center justify-center">Producto no encontrado</div>;

  const handleAddToCart = () => {
    if (!selectedSize) {
        alert("Por favor selecciona una talla");
        return;
    }
    addToCart(product, selectedSize, 1);
  };

  return (
    <div className="bg-white min-h-screen pb-20">
      
      {/* Breadcrumb / Back */}
      <div className="container mx-auto px-6 py-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-vinilo-black transition-colors">
            <ChevronLeft size={16} /> Volver
        </button>
      </div>

      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
            
            {/* 1. Imagen (Izquierda) */}
            <div className="lg:w-1/2">
                <div className="bg-vinilo-gray w-full aspect-[3/4] relative overflow-hidden">
                     {product.tag && (
                        <span className="absolute top-4 left-4 bg-vinilo-red text-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest z-10">
                            {product.tag}
                        </span>
                     )}
                    <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-cover animate-fade-in" 
                    />
                </div>
            </div>

            {/* 2. Información (Derecha) */}
            <div className="lg:w-1/2 flex flex-col pt-4">
                
                <div className="mb-2 text-xs font-bold text-gray-500 uppercase tracking-widest">
                    {product.brand} • {product.gender === 'M' ? 'Hombre' : 'Mujer'}
                </div>

                <h1 className="font-serif text-4xl md:text-5xl text-vinilo-black mb-4 leading-tight">
                    {product.name}
                </h1>

                <div className="text-2xl font-sans font-bold text-vinilo-black mb-8">
                    ${parseFloat(product.price).toLocaleString()}
                </div>

                <p className="text-gray-600 font-sans leading-relaxed mb-8 max-w-md">
                    {product.description || "Diseño exclusivo de Vinilo Platform. Calidad premium y confort garantizado para el día a día."}
                </p>

                {/* Selector de Tallas (Variantes) */}
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-xs font-bold uppercase tracking-widest text-vinilo-black">Seleccionar Talla</span>
                        <button className="text-[10px] text-gray-400 underline decoration-gray-300 hover:text-vinilo-black">Guía de tallas</button>
                    </div>
                    
                    {product.variants && product.variants.length > 0 ? (
                        <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                            {product.variants.map((variant) => (
                                <button
                                    key={variant.id}
                                    disabled={variant.stock === 0}
                                    onClick={() => setSelectedSize(variant.size)}
                                    className={`
                                        py-3 text-sm font-bold border transition-all relative
                                        ${selectedSize === variant.size 
                                            ? 'bg-vinilo-black text-white border-vinilo-black' 
                                            : 'bg-white text-vinilo-black border-gray-200 hover:border-vinilo-black'}
                                        ${variant.stock === 0 ? 'opacity-40 cursor-not-allowed bg-gray-50' : ''}
                                    `}
                                >
                                    {variant.size}
                                    {/* Tachado si no hay stock */}
                                    {variant.stock === 0 && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-full h-[1px] bg-gray-400 rotate-45 transform"></div>
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="text-sm text-red-500 italic">No hay tallas disponibles.</div>
                    )}
                </div>

                {/* Acciones */}
                <div className="flex flex-col gap-4 mb-10">
                    <Button 
                        onClick={handleAddToCart}
                        variant="primary" 
                        size="full"
                        disabled={!selectedSize}
                        className="py-4 flex items-center justify-center gap-2 group"
                    >
                        <ShoppingBag size={18} /> 
                        {selectedSize ? "Agregar a la Bolsa" : "Selecciona una talla"}
                    </Button>
                </div>

                {/* Información Adicional (Beneficios) */}
                <div className="grid grid-cols-1 gap-4 py-6 border-t border-gray-100">
                    <div className="flex items-start gap-3">
                        <Truck size={20} className="text-vinilo-black flex-shrink-0" />
                        <div>
                            <h4 className="text-xs font-bold uppercase text-vinilo-black mb-1">Envío Gratis & Pago Contraentrega</h4>
                            <p className="text-[11px] text-gray-500">En pedidos superiores a $100.000 a nivel nacional.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <RefreshCw size={20} className="text-vinilo-black flex-shrink-0" />
                        <div>
                            <h4 className="text-xs font-bold uppercase text-vinilo-black mb-1">Devoluciones Fáciles</h4>
                            <p className="text-[11px] text-gray-500">30 días para cambios o devoluciones sin costo.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <ShieldCheck size={20} className="text-vinilo-black flex-shrink-0" />
                        <div>
                            <h4 className="text-xs font-bold uppercase text-vinilo-black mb-1">Garantía Vinilo</h4>
                            <p className="text-[11px] text-gray-500">Productos 99% de calidad garantizados.</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
        <div className="border-t border-gray-100">
            {product && <ReviewForm productId={product.id} />}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;