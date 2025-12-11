import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Search, Menu, X, User } from 'lucide-react';
import { useCart } from '../../context/CartContext'; // <--- Importar Contexto
// import Logo from '../../assets/vinilo.png'; 

const Header = ({ onOpenCart, onOpenSearch, onOpenAccount }) => { 
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cartCount } = useCart(); 

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'INICIO', href: '/', isHighlight: false },
    { name: 'CATÁLOGO', href: '/catalogo', isHighlight: true },
    { name: 'HOMBRE', href: '/catalogo', isHighlight: false }, 
    { name: 'MUJER', href: '/catalogo', isHighlight: false }
  ];

  return (
    <>
      <header 
        className={`fixed top-0 w-full z-40 transition-all duration-500 ${
          isScrolled 
            ? 'bg-white text-vinilo-black py-3 shadow-sm' 
            : 'bg-transparent text-vinilo-black py-6'
        }`}
      >
        <div className="container mx-auto px-6 flex justify-between items-center">
          
          {/* Menu Mobile & Search */}
          <div className="flex items-center gap-4 md:hidden">
            <button onClick={() => setIsMobileMenuOpen(true)}> <Menu size={24} /> </button>
            <button onClick={onOpenSearch}><Search size={20} /></button>
          </div>

          {/* Logo (Ahora es un Link al inicio) */}
          <div className="flex-1 md:flex-none text-center md:text-left">
            <Link to="/" className="font-serif text-3xl font-bold tracking-tighter italic">
              Vinilo<span className="text-vinilo-red">.</span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-10 mx-auto">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.href} 
                className={`text-xs font-bold tracking-[0.15em] hover:text-vinilo-red transition-colors relative group ${link.isHighlight ? 'text-vinilo-red' : ''}`}
              >
                {link.name}
                <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-vinilo-red transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </nav>

          {/* Icons */}
          <div className="flex items-center gap-6">
            <button onClick={onOpenSearch} className="hidden md:block hover:text-vinilo-red transition-colors">
               <Search size={20} />
            </button>
            <button onClick={onOpenAccount} className="hidden md:block hover:text-vinilo-red transition-colors">
              <User size={20} />
            </button>
            <button 
              onClick={onOpenCart} 
              className="relative hover:text-vinilo-red transition-colors"
            >
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

      {/* Mobile Menu Sidebar */}
      <div className={`fixed inset-0 z-50 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 bg-white`}>
        <div className="p-6 flex flex-col h-full">
            <div className="flex justify-between items-center mb-10">
                <h2 className="font-serif text-2xl italic">Menú</h2>
                <button onClick={() => setIsMobileMenuOpen(false)}><X size={24} /></button>
            </div>
             
             {/* Navegación Móvil */}
             <nav className="flex flex-col gap-6">
                {navLinks.map((link) => (
                  <Link 
                    key={link.name} 
                    to={link.href} 
                    className={`text-xl font-serif ${link.isHighlight ? 'text-vinilo-red italic' : 'text-vinilo-black'}`}
                    onClick={() => setIsMobileMenuOpen(false)} // Cierra el menú al navegar
                  >
                    {link.name}
                  </Link>
                ))}
             </nav>

             <div className="mt-auto border-t border-gray-100 pt-6">
                <button 
                    onClick={() => { setIsMobileMenuOpen(false); onOpenAccount(); }} 
                    className="text-sm font-sans uppercase tracking-widest text-gray-500 hover:text-vinilo-red transition-colors"
                >
                    Mi Cuenta
                </button>
             </div>
        </div>
      </div>
    </>
  );
};

export default Header;