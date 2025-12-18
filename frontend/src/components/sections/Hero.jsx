import React from 'react';
import { Link } from 'react-router-dom'; 
import Button from '../ui/Button';
import HeroImage from '../../assets/IMG_4681.PNG'; 
const Hero = () => {
  return (
    <section className="relative w-full h-[95vh] md:h-screen min-h-[600px] bg-vinilo-black overflow-hidden">
      
      {/* 1. IMAGEN DE FONDO */}
      <div className="absolute inset-0 z-0">
        <img 
            src={HeroImage} 
            alt="Nueva Colección Vinilo - Urban Style" 
            className="w-full h-full object-cover object-center md:object-[center_20%] opacity-90 transition-transform duration-[2s] hover:scale-105"
            loading="eager" // Carga prioritaria (Mejora LCP)
            fetchpriority="high"
        />
        
        {/* Overlay degradado mejorado para leer texto blanco */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-90"></div>
      </div>

      {/* 2. CONTENIDO */}
      <div className="relative z-10 h-full container mx-auto px-6 flex flex-col justify-end pb-24 md:justify-center md:pb-0">
        <div className="max-w-3xl w-full text-center md:text-left animate-fade-in-up">
          
          {/* Badge */}
          <div className="mb-4 md:mb-6">
            <span className="inline-block px-4 py-1.5 border border-vinilo-red/50 bg-vinilo-red/10 text-vinilo-red backdrop-blur-sm text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] rounded-sm">
              Temporada 2025
            </span>
          </div>

          {/* Título Principal */}
          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white mb-4 md:mb-6 leading-[0.9] drop-shadow-2xl">
            Elegancia <br/> 
            <span className="font-thin italic text-gray-200">Urbana</span>
            <span className="text-vinilo-red">.</span>
          </h1>

          {/* Descripción */}
          <p className="font-sans text-sm md:text-lg text-gray-300 mb-8 md:mb-10 max-w-lg mx-auto md:mx-0 font-light leading-relaxed text-balance drop-shadow-md">
            Descubre nuestra colección cápsula inspirada en la arquitectura moderna. Siluetas audaces diseñadas para destacar en la ciudad.
          </p>
          
          {/* Botones de Acción (Full width en móvil, normal en PC) */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Link to="/catalogo?genero=mujer" className="w-full sm:w-auto">
                <Button variant="primary" size="lg" className="w-full sm:w-auto shadow-lg shadow-vinilo-red/20">
                  Ver Mujer
                </Button>
            </Link>
            <Link to="/catalogo?genero=hombre" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-vinilo-black hover:border-white">
                  Ver Hombre
                </Button>
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;