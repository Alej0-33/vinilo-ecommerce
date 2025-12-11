import React from 'react';
import Logo from '../../assets/vinilologo.png'; // Asegúrate de la ruta

const Footer = () => {
  return (
    <footer className="bg-white text-vinilo-black border-t border-gray-100 pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Columna 1: Marca */}
          <div className="flex flex-col gap-4">
            <img src={Logo} alt="Vinilo Store" className="h-8 w-auto object-contain self-start" />
            <p className="font-sans text-xs text-gray-500 leading-relaxed max-w-xs">
              Redefiniendo el calzado urbano con elegancia atemporal. Diseñado y fabricado en Colombia.
            </p>
          </div>

          {/* Enlaces Rápidos */}
          <div>
            <h4 className="font-serif font-bold text-lg mb-6">Explorar</h4>
            <ul className="font-sans text-sm text-gray-600 space-y-3">
              <li><a href="#" className="hover:text-vinilo-red transition-colors">Nuevos Lanzamientos</a></li>
              <li><a href="#" className="hover:text-vinilo-red transition-colors">Hombre</a></li>
              <li><a href="#" className="hover:text-vinilo-red transition-colors">Mujer</a></li>
              <li><a href="#" className="hover:text-vinilo-red transition-colors">Sale</a></li>
            </ul>
          </div>

          {/* Ayuda */}
          <div>
            <h4 className="font-serif font-bold text-lg mb-6">Ayuda</h4>
            <ul className="font-sans text-sm text-gray-600 space-y-3">
              <li><a href="#" className="hover:text-vinilo-red transition-colors">Rastrear Pedido</a></li>
              <li><a href="#" className="hover:text-vinilo-red transition-colors">Cambios y Devoluciones</a></li>
              <li><a href="#" className="hover:text-vinilo-red transition-colors">Guía de Tallas</a></li>
              <li><a href="#" className="hover:text-vinilo-red transition-colors">Preguntas Frecuentes</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-serif font-bold text-lg mb-6">Legal</h4>
            <ul className="font-sans text-sm text-gray-600 space-y-3">
              <li><a href="#" className="hover:text-vinilo-red transition-colors">Términos y Condiciones</a></li>
              <li><a href="#" className="hover:text-vinilo-red transition-colors">Política de Privacidad</a></li>
              <li><a href="#" className="hover:text-vinilo-red transition-colors">Tratamiento de Datos</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-sans text-[10px] text-gray-400 uppercase tracking-widest">
            © 2025 Vinilo Store. Todos los derechos reservados.
          </p>
          {/* Aquí podrías poner iconos de redes sociales */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;