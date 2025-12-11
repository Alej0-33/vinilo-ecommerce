import React, { useState, useEffect } from 'react';
import Logo from '../../assets/vinilo.png'; 
import { ShoppingBag, Search, Menu, X, User } from 'lucide-react';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'HOMBRE', href: '#' },
    { name: 'MUJER', href: '#' },
    { name: 'NUEVO', href: '#', isRed: true }, // Destacado en rojo
    { name: 'SALE', href: '#' }
  ];

  return (
    <>
      <header 
        className={`fixed top-0 w-full z-40 transition-all duration-300 border-b border-transparent ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-md border-gray-100 py-2 shadow-sm' 
            : 'bg-transparent py-4'
        }`}
      >
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex justify-between items-center h-12">
            
            {/* Mobile Menu Button & Search (Left on Mobile) */}
            <div className="flex items-center gap-4 md:hidden">
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <Search size={20} />
            </div>

            {/* Logo (Centered on Mobile, Left on Desktop) */}
            <div className="flex-shrink-0 flex items-center justify-center md:justify-start w-full md:w-auto absolute left-1/2 transform -translate-x-1/2 md:static md:transform-none">
              <img src={Logo} alt="Vinilo" className="h-8 md:h-10 object-contain" />
            </div>

            {/* Desktop Navigation (Centered) */}
            <nav className="hidden md:flex gap-8 absolute left-1/2 transform -translate-x-1/2">
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href} 
                  className={`font-serif text-sm font-bold tracking-widest hover:underline decoration-1 underline-offset-4 ${
                    link.isRed ? 'text-vinilo-red' : 'text-vinilo-black'
                  }`}
                >
                  {link.name}
                </a>
              ))}
            </nav>

            {/* Right Icons */}
            <div className="flex items-center gap-5 text-vinilo-black">
              <div className="hidden md:block cursor-pointer hover:text-vinilo-red transition-colors">
                 <Search size={20} strokeWidth={1.5} />
              </div>
              <div className="hidden md:block cursor-pointer hover:text-vinilo-red transition-colors">
                <User size={20} strokeWidth={1.5} />
              </div>
              <div className="relative cursor-pointer hover:text-vinilo-red transition-colors">
                <ShoppingBag size={20} strokeWidth={1.5} />
                <span className="absolute -top-1.5 -right-1.5 bg-vinilo-black text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">2</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 bg-white z-30 transform transition-transform duration-300 pt-24 px-6 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col gap-6">
           {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href} 
              className={`font-serif text-2xl border-b border-gray-100 pb-2 ${link.isRed ? 'text-vinilo-red' : 'text-vinilo-black'}`}
            >
              {link.name}
            </a>
          ))}
          <div className="mt-8 flex flex-col gap-4 text-gray-500 font-sans text-sm">
            <a href="#">Mi Cuenta</a>
            <a href="#">Ayuda</a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;