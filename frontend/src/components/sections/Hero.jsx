import React from 'react';
import HeroImage from '../../assets/IMG_4681.PNG'; 

const Hero = () => {
  return (
    <section className="relative w-full h-[90vh] bg-vinilo-light-gray overflow-hidden mt-8">
      {/* Background Split o Full */}
      <div className="absolute inset-0 flex flex-col md:flex-row">
        {/* Texto sobrepuesto (Estilo Editorial) */}
        <div className="absolute inset-0 z-10 flex flex-col justify-center items-center md:items-start md:pl-24 text-center md:text-left bg-black/10 md:bg-transparent">
          <h2 className="text-white md:text-vinilo-black font-serif text-5xl md:text-8xl italic mb-2 mix-blend-difference md:mix-blend-normal">
            Vinilo
          </h2>
          <h1 className="text-white md:text-vinilo-black font-serif text-4xl md:text-7xl font-bold uppercase tracking-tighter mb-6 mix-blend-difference md:mix-blend-normal">
            Collection <br/> 2025
          </h1>
          <a 
            href="#coleccion" 
            className="bg-vinilo-red text-white px-8 py-3 text-sm tracking-widest uppercase hover:bg-vinilo-black transition-colors duration-300"
          >
            Ver Colección
          </a>
        </div>

        {/* Imagen - Ajuste para que la modelo se vea bien */}
        <div className="w-full h-full">
            <img 
                src={HeroImage} 
                alt="Nueva Colección" 
                className="w-full h-full object-cover object-top md:object-center"
            />
        </div>
      </div>
    </section>
  );
};

export default Hero;