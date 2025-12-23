import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ChevronLeft, ChevronRight, Star, ShoppingBag, Truck, ShieldCheck, RefreshCw } from 'lucide-react';
import Button from '../components/ui/Button';
import ReviewForm from '../components/ui/ReviewForm';

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState(null);
  
  // Estado para el carrusel
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [images, setImages] = useState([]);

  const API_URL = import.meta.env.VITE_API_URL;

  // Fetch del producto individual
  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        const response = await fetch(`${API_URL}/store/products/${id}/`);
        if (!response.ok) throw new Error('Producto no encontrado');
        const data = await response.json();
        setProduct(data);
        
        // Construir array de imágenes: [imagen principal, ...galería]
        const allImages = [];
        
        // Agregar imagen principal primero
        if (data.image) {
          allImages.push({ url: data.image, type: 'main' });
        }
        
        // Agregar imágenes de galería
        if (data.gallery && data.gallery.length > 0) {
          data.gallery.forEach(img => {
            allImages.push({ url: img.image_url, type: 'gallery' });
          });
        }
        
        setImages(allImages);
        
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetail();
  }, [id]);

  const handleAddToCart = () => {
    if (!selectedSize) {
        alert("Por favor selecciona una talla");
        return;
    }
    addToCart(product, selectedSize, 1);
  };

  // Navegación del carrusel
  const goToNextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % images.length);
  };

  const goToPrevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center text-vinilo-black">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vinilo-red mx-auto mb-4"></div>
        <p className="text-sm text-gray-500">Cargando producto...</p>
      </div>
    </div>
  );
  
  if (!product) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <p className="text-xl font-serif text-vinilo-black mb-4">Producto no encontrado</p>
        <button 
          onClick={() => navigate('/catalogo')}
          className="text-sm text-vinilo-red hover:underline"
        >
          Volver al catálogo
        </button>
      </div>
    </div>
  );

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
            
            {/* 1. Carrusel de Imágenes (Izquierda) */}
            <div className="lg:w-1/2">
              {images.length > 0 ? (
                <div className="space-y-4">
                  {/* Imagen Principal */}
                  <div className="relative bg-vinilo-gray w-full aspect-[3/4] overflow-hidden group">
                    {product.tag && (
                      <span className="absolute top-4 left-4 bg-vinilo-red text-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest z-10">
                        {product.tag}
                      </span>
                    )}
                    
                    <img 
                      src={images[selectedImageIndex].url} 
                      alt={`${product.name} - Imagen ${selectedImageIndex + 1}`}
                      className="w-full h-full object-cover transition-opacity duration-300" 
                    />
                    
                    {/* Flechas de navegación (solo si hay más de 1 imagen) */}
                    {images.length > 1 && (
                      <>
                        <button 
                          onClick={goToPrevImage}
                          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 z-10"
                        >
                          <ChevronLeft size={20} className="text-vinilo-black" />
                        </button>
                        <button 
                          onClick={goToNextImage}
                          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 z-10"
                        >
                          <ChevronRight size={20} className="text-vinilo-black" />
                        </button>
                      </>
                    )}
                    
                    {/* Indicador de posición */}
                    {images.length > 1 && (
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                        {images.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setSelectedImageIndex(index)}
                            className={`h-1.5 rounded-full transition-all ${
                              index === selectedImageIndex 
                                ? 'w-8 bg-white' 
                                : 'w-1.5 bg-white/50 hover:bg-white/75'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Miniaturas */}
                  {images.length > 1 && (
                    <div className="grid grid-cols-4 gap-3">
                      {images.map((img, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImageIndex(index)}
                          className={`relative aspect-[3/4] overflow-hidden border-2 transition-all ${
                            index === selectedImageIndex 
                              ? 'border-vinilo-black' 
                              : 'border-gray-200 hover:border-gray-400'
                          }`}
                        >
                          <img 
                            src={img.url} 
                            alt={`Thumbnail ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          {index === selectedImageIndex && (
                            <div className="absolute inset-0 bg-vinilo-black/10"></div>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-gray-100 w-full aspect-[3/4] flex items-center justify-center">
                  <p className="text-gray-400">Sin imágenes disponibles</p>
                </div>
              )}
            </div>

            {/* 2. Información (Derecha) */}
            <div className="lg:w-1/2 flex flex-col pt-4">
                
                <div className="mb-2 text-xs font-bold text-gray-500 uppercase tracking-widest">
                    {product.brand} • {product.gender === 'M' ? 'Hombre' : product.gender === 'F' ? 'Mujer' : 'Unisex'}
                </div>

                <h1 className="font-serif text-4xl md:text-5xl text-vinilo-black mb-4 leading-tight">
                    {product.name}
                </h1>

                <div className="text-2xl font-sans font-bold text-vinilo-black mb-8">
                    ${parseFloat(product.price).toLocaleString('es-CO')}
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
                                    onClick={() => setSelectedSize(variant.size)}
                                    className={`
                                        py-3 text-sm font-bold border transition-all
                                        ${selectedSize === variant.size 
                                            ? 'bg-vinilo-black text-white border-vinilo-black' 
                                            : 'bg-white text-vinilo-black border-gray-200 hover:border-vinilo-black'}
                                    `}
                                >
                                    {variant.size}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="text-sm text-red-500 italic">No hay tallas disponibles.</div>
                    )}
                </div>

                {/* Acciones */}
                <div className="flex flex-col gap-3 mb-10">
                    {/* Botón WhatsApp */}
                    <button
                        onClick={() => {
                            if (!selectedSize) {
                                alert("Por favor selecciona una talla");
                                return;
                            }
                            // Construir mensaje de WhatsApp
                            const message = `Hola! Estoy interesado en:\n\n📦 ${product.name}\n👔 Marca: ${product.brand}\n📏 Talla: ${selectedSize}\n💰 Precio: $${parseFloat(product.price).toLocaleString('es-CO')}\n\n🔗 Link: ${window.location.href}`;
                            const whatsappNumber = import.meta.env.VITE_STORE_WHATSAPP; 
                            const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
                            window.open(whatsappURL, '_blank');
                        }}
                        disabled={!selectedSize}
                        className={`py-4 flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-widest transition-all border-2 ${
                            selectedSize 
                                ? 'bg-[#25D366] hover:bg-[#20BA5A] text-white border-[#25D366] hover:border-[#20BA5A]' 
                                : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                        }`}
                    >
                        {/* Logo WhatsApp SVG */}
                        <svg 
                            className="w-5 h-5" 
                            fill="currentColor" 
                            viewBox="0 0 24 24" 
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                        </svg>
                        Confirmar en WhatsApp
                    </button>

                    {/* Botón Agregar al Carrito */}
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
        <div className="border-t border-gray-100 mt-12">
            {product && <ReviewForm productId={product.id} />}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;