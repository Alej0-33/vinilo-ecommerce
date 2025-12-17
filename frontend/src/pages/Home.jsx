import React, { useState, useEffect } from 'react'; 
import { Link } from 'react-router-dom';
import Hero from '../components/sections/Hero';
import ProductGrid from '../components/sections/ProductGrid';
import Button from '../components/ui/Button';
import { Truck, ShieldCheck, ArrowRight, Star, Info, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import axios from 'axios';

// --- IMPORTACIÓN DE ASSETS LOCALES ---
import imgCategory1 from '../assets/IMG_4668.PNG';
import imgCategory2 from '../assets/IMG_4669.PNG';
import imgCategory3 from '../assets/IMG_4671.PNG';
import imgManifesto from '../assets/IMG_4681.PNG';

// Datos Categorías Visuales
const categories = [
    { name: 'Streetwear', img: imgCategory1, link: '/catalogo?category=streetwear' },
    { name: 'Luxury', img: imgCategory2, link: '/catalogo?category=luxury' },
    { name: 'Sport', img: imgCategory3, link: '/catalogo?category=sport' },
];

const Home = () => {
  // Estado Productos
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estado Newsletter
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState('idle'); // idle, loading, success, error
  const [newsletterMessage, setNewsletterMessage] = useState('');

  // Hook para traer la data del backend (Productos seleccionados en Admin)
  useEffect(() => {
    const fetchStoreConfig = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/store/config/');
        
        if (response.data && response.data.highlighted_products) {
           if (response.data.highlighted_products.length > 0) {
               setFeaturedProducts(response.data.highlighted_products);
           }
        }
      } catch (error) {
        console.error("Error al cargar configuración", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStoreConfig();
  }, []);

  // --- LÓGICA DE NEWSLETTER (SEGURA) ---
  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    setNewsletterStatus('loading');
    setNewsletterMessage('');

    // 1. Sanitización Básica (Anti-XSS leve & UX)
    const cleanEmail = newsletterEmail.trim();

    // 2. Validación de Formato de Correo (Regex)
    // Esto previene enviar scripts (<script>...) o SQL obvios antes de tocar el servidor.
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(cleanEmail)) {
        setNewsletterStatus('error');
        setNewsletterMessage('Por favor ingresa un correo electrónico válido.');
        return;
    }

    try {
        // 3. Petición Segura al Backend
        const response = await axios.post('http://127.0.0.1:8000/api/store/newsletter/subscribe/', {
            email: cleanEmail
        });

        // 4. Éxito
        setNewsletterStatus('success');
        setNewsletterMessage(response.data.message || '¡Gracias por suscribirte!');
        setNewsletterEmail(''); // Limpiar input

    } catch (error) {
        setNewsletterStatus('error');
        // Manejo seguro de errores sin exponer trazas del servidor
        if (error.response && error.response.data) {
             // Si el backend envía un error específico (ej: "correo invalido")
             setNewsletterMessage(error.response.data.error || 'Hubo un error al suscribirte.');
        } else {
             setNewsletterMessage('Error de conexión. Inténtalo más tarde.');
        }
    }
  };

  return (
    <>
      {/* 1. HERO PRINCIPAL */}
      <Hero />
      
      {/* 2. FRANJA DE CALIDAD 1.1 */}
      <div className="bg-vinilo-black text-white py-6 border-b border-gray-800">
        <div className="container mx-auto px-6 text-center">
            <p className="font-sans text-[10px] font-bold uppercase tracking-[0.3em] text-vinilo-red mb-2">
                Máxima Fidelidad
            </p>
            <h2 className="font-serif text-lg md:text-xl italic text-gray-200 flex items-center justify-center gap-2">
                <Info size={16} className="text-gray-500" />
                Sneakers Importados Calidad 1.1 & Top Quality
            </h2>
            <p className="text-gray-500 text-xs mt-2 max-w-xl mx-auto leading-relaxed">
                Obtén el estilo de las grandes marcas (Nike, Amiri, Valentino) con una precisión estética y de materiales del 99%.
            </p>
        </div>
      </div>

      {/* 3. BARRA DE CONFIANZA */}
      <section className="bg-white border-b border-gray-100 py-12">
        <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-gray-100">
                <div className="flex flex-col items-center gap-2 p-2">
                    <Truck className="text-vinilo-red" size={24} />
                    <h3 className="font-serif italic text-lg text-vinilo-black">Envíos Nacionales</h3>
                    <p className="text-[10px] text-gray-400 font-sans uppercase tracking-widest">Cobertura total en Colombia</p>
                </div>
                <div className="flex flex-col items-center gap-2 p-2">
                    <ShieldCheck className="text-vinilo-red" size={24} />
                    <h3 className="font-serif italic text-lg text-vinilo-black">Pago Contraentrega</h3>
                    <p className="text-[10px] text-gray-400 font-sans uppercase tracking-widest">Paga al recibir en tu puerta</p>
                </div>
                <div className="flex flex-col items-center gap-2 p-2">
                    <Star className="text-vinilo-red" size={24} />
                    <h3 className="font-serif italic text-lg text-vinilo-black">Calidad Garantizada</h3>
                    <p className="text-[10px] text-gray-400 font-sans uppercase tracking-widest">Revisión detallada par por par</p>
                </div>
            </div>
        </div>
      </section>

      {/* 4. NAVEGACIÓN POR CATEGORÍAS */}
      <section className="py-20 bg-vinilo-gray/20">
        <div className="container mx-auto px-6">
            <div className="flex justify-between items-end mb-10">
                <h2 className="font-serif text-3xl md:text-4xl text-vinilo-black">Explora tu Estilo</h2>
                <Link to="/catalogo" className="text-xs font-bold uppercase tracking-widest text-vinilo-red hover:text-vinilo-black transition-colors">
                    Ver todo
                </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {categories.map((cat) => (
                    <Link key={cat.name} to={cat.link} className="group relative h-[450px] overflow-hidden block">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10 transition-opacity opacity-80 group-hover:opacity-90"></div>
                        <img 
                            src={cat.img} 
                            alt={cat.name} 
                            className="w-full h-full object-cover transition-transform duration-[1s] group-hover:scale-110" 
                        />
                        <div className="absolute bottom-8 left-8 z-20">
                            <span className="text-vinilo-red text-[10px] font-bold uppercase tracking-[0.2em] mb-2 block">Colección</span>
                            <h3 className="text-white font-serif text-4xl italic group-hover:translate-x-2 transition-transform duration-500">{cat.name}</h3>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
      </section>
      
      {/* 5. PRODUCTOS DESTACADOS */}
      {!loading && featuredProducts.length > 0 ? (
        <ProductGrid 
          title="Drops Recientes" 
          products={featuredProducts} 
        />
      ) : !loading && featuredProducts.length === 0 ? (
        <section className="py-24 bg-white text-center">
            <div className="container mx-auto px-6">
                <h2 className="font-serif text-2xl md:text-3xl text-gray-400 italic mb-6">
                    No hay drops destacados en este momento.
                </h2>
                <Link to="/catalogo">
                    <Button variant="primary">Explorar Catálogo Completo</Button>
                </Link>
            </div>
        </section>
      ) : (
        <div className="py-24 flex justify-center">
             <div className="animate-pulse text-vinilo-red font-bold">Cargando colección...</div>
        </div>
      )}

      {/* 6. MANIFIESTO DE MARCA */}
      <section className="relative w-full min-h-[70vh] flex items-center justify-center overflow-hidden py-24">
         <div className="absolute inset-0">
            <img 
               src={imgManifesto}
               alt="Lifestyle Vinilo"
               className="w-full h-full object-cover object-center grayscale brightness-[0.4]"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-vinilo-black/10 via-transparent to-vinilo-black/90"></div>
         </div>
         
         <div className="relative z-10 container mx-auto px-6">
            <div className="max-w-4xl mx-auto border border-white/10 p-8 md:p-16 backdrop-blur-sm bg-black/20 text-center rounded-sm shadow-2xl">
                <p className="text-vinilo-red font-bold uppercase tracking-[0.3em] text-xs mb-6">Manifiesto</p>
                <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl text-white mb-8 italic leading-tight">
                  "No solo vendemos zapatos, vendemos <span className="text-vinilo-red not-italic">actitud</span>."
                </h2>
                <p className="text-gray-300 font-sans mb-12 leading-relaxed max-w-lg mx-auto text-sm md:text-base tracking-wide">
                    Diseñamos para quienes caminan con propósito. Cada par es una fusión de lujo y diseño contemporáneo.
                </p>
                <div className="pb-2">
                    <Link to="/catalogo">
                        <Button variant="outline" className="border-white text-white hover:bg-white hover:text-vinilo-black px-10 py-4 tracking-[0.2em]">
                        Ir al Catálogo
                        </Button>
                    </Link>
                </div>
            </div>
         </div>
      </section>

      {/* 7. NEWSLETTER */}
      <section className="bg-vinilo-black text-white py-24">
          <div className="container mx-auto px-6 text-center max-w-2xl">
              <h2 className="font-serif text-3xl md:text-4xl italic mb-4">Únete al Club Vinilo</h2>
              <p className="text-gray-400 font-sans text-sm mb-8">Suscríbete y recibe un <span className="text-white font-bold">10% OFF</span> en tu primera compra y acceso anticipado a drops exclusivos.</p>
              
              {/* Formulario con Manejo de Estado */}
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 relative">
                  <input 
                    id="newsletter_email"
                    name="email"
                    autoComplete="email"
                    aria-label="Correo electrónico"
                    type="email" 
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Tu correo electrónico" 
                    className="flex-1 bg-white/5 border border-white/20 text-white px-6 py-4 focus:outline-none focus:border-vinilo-red transition-colors text-sm disabled:opacity-50"
                    disabled={newsletterStatus === 'loading' || newsletterStatus === 'success'}
                  />
                  <button 
                    type="submit"
                    disabled={newsletterStatus === 'loading' || newsletterStatus === 'success'}
                    className={`bg-vinilo-red text-white px-8 py-4 font-bold uppercase tracking-widest text-xs hover:bg-white hover:text-vinilo-black transition-all flex items-center justify-center gap-2 disabled:bg-gray-500 disabled:cursor-not-allowed`}
                  >
                      {newsletterStatus === 'loading' ? (
                          <>Enviando <Loader2 size={14} className="animate-spin" /></>
                      ) : newsletterStatus === 'success' ? (
                          <>Suscrito <CheckCircle size={14} /></>
                      ) : (
                          <>Suscribirse <ArrowRight size={14} /></>
                      )}
                  </button>
              </form>

              {/* Mensajes de Feedback (Error / Éxito) */}
              {newsletterMessage && (
                  <div className={`mt-4 text-xs font-bold flex items-center justify-center gap-2 animate-fade-in ${newsletterStatus === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                      {newsletterStatus === 'success' ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                      {newsletterMessage}
                  </div>
              )}

          </div>
      </section>
    </>
  );
};

export default Home;