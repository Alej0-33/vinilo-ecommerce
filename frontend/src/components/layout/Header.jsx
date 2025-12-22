import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Search, Menu, X, User } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext'; 

const Header = ({ onOpenCart, onOpenSearch, onOpenAccount }) => { 
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const { cartCount } = useCart(); 
  const { user, isAuthenticated } = useAuth(); 
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'INICIO', path: '/', isHighlight: false },
    { name: 'CATÁLOGO', path: '/catalogo', isHighlight: true }, 
    { name: 'HOMBRE', path: '/catalogo?genero=hombre', isHighlight: false }, 
    { name: 'MUJER', path: '/catalogo?genero=mujer', isHighlight: false }
  ];

  const isActive = (linkPath) => {
      if (linkPath === '/') return location.pathname === '/';
      return (location.pathname + location.search) === linkPath || 
             (linkPath === '/catalogo' && location.pathname === '/catalogo' && location.search === ''); 
  };

  return (
    <>
      <header 
        className={`fixed top-0 w-full z-40 transition-all duration-500 ${
          isScrolled 
            ? 'bg-white text-vinilo-black py-3 shadow-sm' 
            : 'bg-transparent text-vinilo-black py-6'
        }`}
      >
        <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
          
          {/* IZQUIERDA MÓVIL: Menú + Buscar */}
          <div className="flex items-center gap-3 md:hidden">
            <button onClick={() => setIsMobileMenuOpen(true)}> <Menu size={24} /> </button>
            <button onClick={onOpenSearch}><Search size={20} /></button>
          </div>

          {/* LOGO CENTRADO */}
          <div className="flex-1 md:flex-none text-center md:text-left">
            <Link to="/" className="font-serif text-2xl md:text-3xl font-bold tracking-tighter italic">
              Vinilo<span className="text-vinilo-red">.</span>
            </Link>
          </div>

          {/* CENTRO DESKTOP: Navegación */}
          <nav className="hidden md:flex gap-10 mx-auto">
            {navLinks.map((link) => {
               const active = isActive(link.path);
               return (
                <Link 
                    key={link.name} 
                    to={link.path} 
                    className={`text-xs font-bold tracking-[0.15em] transition-colors relative group 
                        ${link.isHighlight ? 'text-vinilo-red' : 'hover:text-vinilo-red text-vinilo-black'}
                        ${active ? 'text-vinilo-red' : ''}
                    `}
                >
                    {link.name}
                    <span className={`absolute -bottom-2 left-0 h-0.5 bg-vinilo-red transition-all duration-300 
                        ${active ? 'w-full' : 'w-0 group-hover:w-full'}`}>
                    </span>
                </Link>
               )
            })}
          </nav>

          {/* DERECHA: Iconos (Usuario + Carrito) */}
          <div className="flex items-center gap-4 md:gap-6 justify-end">
            
            {/* Buscar solo Desktop (en móvil está a la izquierda) */}
            <button onClick={onOpenSearch} className="hidden md:block hover:text-vinilo-red transition-colors">
               <Search size={20} />
            </button>
            
            {/* --- CORRECCIÓN AQUÍ: Eliminado 'hidden md:block' para que aparezca siempre --- */}
            <button onClick={onOpenAccount} className="hover:text-vinilo-red transition-colors">
              <User size={20} className={isAuthenticated ? "text-vinilo-black fill-current" : ""} />
            </button>

            <button onClick={onOpenCart} className="relative hover:text-vinilo-red transition-colors">
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-vinilo-red text-white text-[9px] w-3.5 h-3.5 flex items-center justify-center rounded-full font-bold animate-scale-in">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE MENU SIDEBAR */}
      <div className={`fixed inset-0 z-50 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 bg-white shadow-2xl`}>
        <div className="p-6 flex flex-col h-full">
            <div className="flex justify-between items-center mb-10 border-b border-gray-100 pb-4">
                <span className="font-serif text-2xl italic text-vinilo-black">Menú</span>
                <button onClick={() => setIsMobileMenuOpen(false)}><X size={24} /></button>
            </div>
             
             <nav className="flex flex-col gap-6">
                {navLinks.map((link) => (
                  <Link 
                    key={link.name} 
                    to={link.path} 
                    className={`text-xl font-serif 
                        ${link.isHighlight ? 'text-vinilo-red italic' : 'text-vinilo-black'}
                        ${isActive(link.path) ? 'text-vinilo-red italic underline decoration-1 underline-offset-4' : ''}
                    `}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
             </nav>

             {/* Sección Inferior del Menú Móvil Mejorada */}
             <div className="mt-auto pt-6 border-t border-gray-100">
                <button 
                    onClick={() => { setIsMobileMenuOpen(false); onOpenAccount(); }} 
                    className="flex items-center gap-3 w-full py-3 px-4 bg-gray-50 rounded-lg group hover:bg-vinilo-black transition-colors"
                >
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-gray-200 group-hover:border-gray-600">
                        <User size={20} className="text-vinilo-black" />
                    </div>
                    <div className="text-left">
                        <span className="block text-xs font-bold uppercase tracking-widest text-vinilo-black group-hover:text-white">
                            {isAuthenticated ? `Hola, ${user?.first_name || 'Usuario'}` : 'Mi Cuenta'}
                        </span>
                        <span className="block text-[10px] text-gray-500 group-hover:text-gray-400">
                            {isAuthenticated ? 'Ver perfil y pedidos' : 'Inicia sesión o regístrate'}
                        </span>
                    </div>
                </button>
             </div>
        </div>
      </div>
    </>
  );
};

export default Header;