import React from 'react';
import { Instagram, Facebook } from 'lucide-react';
// Importando las imágenes
import VisaLogo from '../../assets/visa.png';
import MastercardLogo from '../../assets/mastercard.png';
import PseLogo from '../../assets/pse.png';
import NequiLogo from '../../assets/nequi.png';
import BancolombiaLogo from '../../assets/bancolombia.png';
import AmexLogo from '../../assets/amex.png';

const Footer = () => {
  return (
    <footer className="bg-vinilo-black text-white pt-20 pb-10 border-t-[3px] border-vinilo-red relative overflow-hidden">
      
      {/* Elemento decorativo de fondo (Marca de agua) */}
      <div className="absolute top-0 right-0 font-serif text-[15rem] leading-none text-white/5 opacity-5 pointer-events-none select-none -translate-y-1/2 translate-x-1/4">
        V.
      </div>

      <div className="container mx-auto px-6 relative z-10">
        
        {/* Contenido Principal */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 mb-16 border-b border-gray-800 pb-12">
          
          {/* Columna 1: Marca y Redes (Más ancha) */}
          <div className="md:col-span-4 flex flex-col justify-between">
            <div>
              <h2 className="font-serif text-4xl italic mb-6">Vinilo<span className="text-vinilo-red">.</span></h2>
              <p className="font-sans text-sm text-gray-400 font-light leading-relaxed max-w-sm">
                Redefiniendo el paso urbano con elegancia atemporal. Zapatos para quienes caminan con propósito.
              </p>
            </div>
            
            <div className="mt-8">
              <div className="flex gap-4">
                <a href="https://www.instagram.com/v1nilostore" className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center text-gray-400 hover:border-vinilo-red hover:bg-vinilo-red hover:text-white transition-all duration-300">
                  <Instagram size={18} />
                </a>
                <a href="#" className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center text-gray-400 hover:border-vinilo-red hover:bg-vinilo-red hover:text-white transition-all duration-300">
                  <Facebook size={18} />
                </a>
              </div>
            </div>
          </div>

          <div className="hidden md:block md:col-span-1"></div>

          {/* Columna 2: Shop */}
          <div className="md:col-span-2">
            <h4 className="font-serif text-lg mb-6 text-white">Explorar</h4>
            <ul className="space-y-3 font-sans text-xs tracking-wider text-gray-400">
              <li><a href="/catalogo" className="hover:text-vinilo-red transition-colors">Novedades</a></li>
              <li><a href="/catalogo" className="hover:text-vinilo-red transition-colors">Mas Vendidos</a></li>
              <li><a href="/catalogo" className="hover:text-vinilo-red transition-colors">Calzado</a></li>
            </ul>
          </div>

          {/* Columna 3: Soporte */}
          <div className="md:col-span-2">
            <h4 className="font-serif text-lg mb-6 text-white">Ayuda</h4>
            <ul className="space-y-3 font-sans text-xs tracking-wider text-gray-400">
              <li><a href="/tracking" className="hover:text-vinilo-red transition-colors">Rastrear Pedido</a></li>
              <li><a href="/contact" className="hover:text-vinilo-red transition-colors">Cambios y Devoluciones</a></li>
              <li><a href="/contact" className="hover:text-vinilo-red transition-colors">Contáctanos</a></li>
            </ul>
          </div>

          {/* Columna 4: Legal */}
          <div className="md:col-span-3">
            <h4 className="font-serif text-lg mb-6 text-white">Legal</h4>
            <ul className="space-y-3 font-sans text-xs tracking-wider text-gray-400">
              <li><a href="/terms-conditions" className="hover:text-vinilo-red transition-colors">Términos y Condiciones</a></li>
              <li><a href="/privacy-policy" className="hover:text-vinilo-red transition-colors">Política de Privacidad</a></li>
            </ul>
          </div>
        </div>

        {/* Fila Inferior: Copyright y Métodos de Pago */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="font-sans text-[10px] text-gray-500 uppercase tracking-widest text-center md:text-left">
            © 2025 Vinilo Store. Todos los derechos reservados.
          </p>
          
          {/* Contenedor de Logos de Pago */}
          <div className="flex flex-wrap justify-center md:justify-end gap-3 opacity-80 grayscale hover:grayscale-0 transition-all duration-500 items-center">
            {/* AMEX */} 
            <div className="bg-white/10 rounded px-2 py-1 flex items-center justify-center w-12 h-8">
              <img 
                src={AmexLogo} 
                alt="Amex" 
                className="max-h-full max-w-full object-contain" // Quitamos mix-blend-screen e invert
                // Eliminamos el style={{ filter... }}
              />
            </div>
            {/* VISA */}
            <div className="bg-white/10 rounded px-2 py-1 flex items-center justify-center w-12 h-8">
              <img 
                src={VisaLogo} 
                alt="Visa" 
                className="max-h-full max-w-full object-contain mix-blend-screen invert" 
                style={{ filter: "brightness(0) invert(1)" }} 
              />
            </div>

            {/* MASTERCARD */}
            <div className="bg-white/10 rounded px-2 py-1 flex items-center justify-center w-12 h-8">
              <img 
                src={MastercardLogo} 
                alt="Mastercard" 
                className="max-h-full max-w-full object-contain"
              />
            </div>

            {/* PSE */}
            <div className="bg-white/10 rounded px-2 py-1 flex items-center justify-center w-12 h-8">
              <img 
                src={PseLogo} 
                alt="PSE" 
                className="max-h-full max-w-full object-contain"
              />
            </div>

            {/* NEQUI - Aumentado de tamaño */}
            <div className="bg-white/10 rounded px-2 py-1 flex items-center justify-center w-16 h-10">
              <img 
                src={NequiLogo} 
                alt="Nequi" 
                className="max-h-full max-w-full object-contain"
              />
            </div>

            {/* BANCOLOMBIA - Aumentado de tamaño */}
            <div className="bg-white/10 rounded px-2 py-1 flex items-center justify-center w-16 h-10">
              <img 
                src={BancolombiaLogo} 
                alt="Bancolombia" 
                className="max-h-full max-w-full object-contain"
              />
            </div>
            
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;