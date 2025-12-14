import React from 'react';
import { Link } from 'react-router-dom'; // Importar Link
import Button from '../ui/Button';
import HeroImage from '../../assets/IMG_4681.png'

const Hero = () => {
  return (
    <section className="relative w-full h-screen min-h-[600px] bg-vinilo-gray overflow-hidden">
      <div className="absolute inset-0">
        <img 
            src={HeroImage} 
            alt="Nueva Colección Vinilo" 
            className="w-full h-full object-cover object-center grayscale hover:grayscale-0 transition-all duration-[2s]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
      </div>

      <div className="relative h-full container mx-auto px-6 flex flex-col justify-end pb-32 md:justify-center md:pb-0 md:items-start animate-fade-in-up">
        <div className="max-w-2xl text-white">
          <span className="inline-block px-3 py-1 bg-vinilo-red text-white text-[10px] font-bold uppercase tracking-[0.3em] mb-4">
            Colección 2025
          </span>
          <h1 className="font-serif text-5xl md:text-8xl mb-6 leading-none drop-shadow-lg">
            Elegancia <br/> <i className="font-thin text-vinilo-red">Urbana</i>
          </h1>
          <p className="font-sans text-sm md:text-base text-gray-200 mb-8 max-w-md font-light leading-relaxed drop-shadow-md">
            Descubre nuestra colección cápsula inspirada en la arquitectura moderna. Siluetas audaces diseñadas en Colombia.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/catalogo?genero=mujer">
                <Button variant="primary" size="md">Ver Mujer</Button>
            </Link>
            <Link to="/catalogo?genero=hombre">
                <Button variant="outline" size="md">Ver Hombre</Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;