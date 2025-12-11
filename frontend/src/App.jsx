import React from 'react';
// Layouts
import TopBar from './components/layout/TopBar';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
// Secciones
import Hero from './components/sections/Hero';
import Newsletter from './components/sections/Newsletter';
import ProductGrid from './components/sections/ProductGrid';

// Mock Data (Datos de ejemplo para que se vea la grilla llena)
const featuredProducts = [
  { 
    id: 1, 
    name: "Botín Chelsea Negro", 
    price: 210000, 
    tag: "Best Seller", 
    image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=1974&auto=format&fit=crop" 
  },
  { 
    id: 2, 
    name: "Sneaker Vinilo White", 
    price: 145000, 
    tag: "Nuevo", 
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1974&auto=format&fit=crop" 
  },
  { 
    id: 3, 
    name: "Bota Militar Roja", 
    price: 180000, 
    tag: null,
    image: "https://images.unsplash.com/photo-1520639888713-7851188b21c4?q=80&w=1974&auto=format&fit=crop" 
  },
  { 
    id: 4, 
    name: "Mocasín Clásico", 
    price: 120000, 
    tag: "Exclusivo",
    image: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=2078&auto=format&fit=crop" 
  },
];

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* 1. Barra superior y Navegación */}
      <TopBar />
      <Header />
      
      <main className="flex-grow">
        {/* 2. Imagen Principal */}
        <Hero />
        
        {/* 3. Grilla de Productos "Favoritos" */}
        <ProductGrid 
          title="Tendencias de la Semana" 
          subtitle="Colección 2025" 
          products={featuredProducts} 
        />

        {/* 4. Banner Intermedio (Estilo Editorial) */}
        <section className="relative w-full h-[60vh] md:h-[70vh] bg-gray-900 flex items-center justify-center overflow-hidden group">
           <img 
              src="https://images.unsplash.com/photo-1460353581641-37baddab0fa2?q=80&w=2071&auto=format&fit=crop" 
              alt="Urban Collection" 
              className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000 grayscale"
           />
           <div className="relative z-10 text-center text-white px-4">
              <h2 className="font-serif text-4xl md:text-6xl mb-6">Urban Soul</h2>
              <button className="bg-white text-vinilo-black px-10 py-3 text-xs font-bold uppercase tracking-widest hover:bg-vinilo-red hover:text-white transition-colors duration-300">
                  Explorar Campaña
              </button>
           </div>
        </section>

        {/* 5. Suscripción */}
        <Newsletter />
      </main>
      
      {/* 6. Pie de página */}
      <Footer />
    </div>
  );
}

export default App;