import React from 'react';
import Button from '../ui/Button';
// Usa una imagen de alta calidad, preferiblemente vertical para móviles, horizontal para desktop
// O usa una imagen de un servicio externo como placeholder
import HeroImage from '../../assets/IMG_4681.png'

const Hero = () => {
  return (
    <section className="relative w-full h-screen min-h-[600px] bg-vinilo-light-gray overflow-hidden">
      <div className="absolute inset-0">
        <img 
            src={HeroImage} 
            alt="Nueva Colección Vinilo" 
            className="w-full h-full object-cover object-center grayscale hover:grayscale-0 transition-all duration-[2s]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      </div>

      <div className="relative h-full container mx-auto px-6 flex flex-col justify-end pb-24 md:justify-center md:pb-0 md:items-start">
        <div className="max-w-2xl text-white">
          <span className="inline-block px-3 py-1 bg-vinilo-red text-white text-[10px] font-bold uppercase tracking-[0.3em] mb-4">
            Nuevo Lanzamiento
          </span>
          <h1 className="font-serif text-5xl md:text-8xl mb-6 leading-none">
            Elegancia <br/> <i className="font-thin text-vinilo-red">Urbana</i>
          </h1>
          <p className="font-sans text-sm md:text-base text-gray-200 mb-8 max-w-md font-light leading-relaxed">
            Descubre nuestra colección cápsula inspirada en la arquitectura moderna. Siluetas audaces y comodidad sin compromisos.
          </p>
          <div className="flex gap-4">
            <Button variant="outline" size="md">Ver Colección</Button>
            <Button variant="primary" size="md">Best Sellers</Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;