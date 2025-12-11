import React from 'react';
import Hero from '../components/sections/Hero';
import ProductGrid from '../components/sections/ProductGrid';
import Button from '../components/ui/Button';

// Mock Data
const newArrivals = [
  { 
    id: 1, 
    name: "Botín Oxford Black", 
    price: 245000, 
    tag: "Exclusive", 
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=2000&auto=format&fit=crop" 
  },
  { 
    id: 2, 
    name: "Sandalia Vinilo Red", 
    price: 180000, 
    tag: "New", 
    image: "https://images.unsplash.com/photo-1562273138-f46be4ebdf6c?q=80&w=2000&auto=format&fit=crop" 
  },
  { 
    id: 3, 
    name: "Mocasín Chunky", 
    price: 210000, 
    tag: null,
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=2000&auto=format&fit=crop" 
  },
  { 
    id: 4, 
    name: "Sneaker Minimal", 
    price: 165000, 
    tag: "Bestseller",
    image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=2000&auto=format&fit=crop" 
  },
];

const Home = () => {
  return (
    <>
      {/* 1. Hero Principal */}
      <Hero />
      
      {/* 2. Sección Destacada */}
      <ProductGrid 
        title="Novedades" 
        products={newArrivals} 
      />

      {/* 3. Banner Manifiesto (Estilo Editorial Vinilo) */}
      <section className="relative w-full h-[70vh] bg-vinilo-black flex items-center justify-center overflow-hidden">
         <div className="absolute inset-0 opacity-40 mix-blend-overlay">
            <img 
               src="https://images.unsplash.com/photo-1533036881765-b1a92e42c2f7?q=80&w=2000&auto=format&fit=crop"
               alt="Background Texture"
               className="w-full h-full object-cover grayscale"
            />
         </div>
         <div className="relative z-10 text-center px-4 max-w-2xl">
            <p className="text-vinilo-red font-bold uppercase tracking-[0.3em] text-xs mb-6">Manifiesto 2025</p>
            <h2 className="font-serif text-4xl md:text-6xl text-white mb-8 italic leading-tight">
              "No solo vendemos zapatos, vendemos <span className="text-vinilo-red">actitud</span>."
            </h2>
            <Button variant="secondary" className="border-white text-white hover:bg-white hover:text-vinilo-black">
              Descubrir Manifiesto
            </Button>
         </div>
      </section>
    </>
  );
};

export default Home;