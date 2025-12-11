import React from 'react';

const Newsletter = () => {
  return (
    <section className="py-20 bg-vinilo-black text-white text-center px-6">
      <div className="max-w-2xl mx-auto">
        <h2 className="font-serif text-3xl md:text-4xl mb-4">Únete al Club Vinilo</h2>
        <p className="font-sans text-gray-400 text-sm mb-8 font-light">
          Suscríbete y recibe un 10% OFF en tu primera compra. Sé el primero en enterarte de nuevos lanzamientos.
        </p>
        <div className="flex flex-col md:flex-row gap-4">
          <input 
            type="email" 
            placeholder="Tu correo electrónico" 
            className="w-full bg-transparent border-b border-gray-600 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-vinilo-red transition-colors font-sans"
          />
          <button className="bg-white text-vinilo-black px-8 py-3 font-bold uppercase tracking-widest text-xs hover:bg-vinilo-red hover:text-white transition-colors">
            Suscribirme
          </button>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;