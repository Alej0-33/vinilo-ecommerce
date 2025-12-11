import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useCart } from '../../context/CartContext'; // Asegúrate que esta ruta sea correcta

// Layout Components
import TopBar from './TopBar';
import Header from './Header';
import Footer from './Footer';

// UI Overlays (Drawers y Modales Globales)
import CartDrawer from '../ui/CartDrawer';
import SearchOverlay from '../ui/SearchOverlay';
import AuthModal from '../ui/AuthModal';

const Layout = () => {
  // Estado local para Search y Auth
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  
  // Estado global del carrito desde el contexto
  const { isCartOpen, setIsCartOpen } = useCart(); 

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans antialiased text-vinilo-black selection:bg-vinilo-red selection:text-white">
      {/* 1. Elementos Fijos Superiores */}
      <TopBar />
      <Header 
        onOpenCart={() => setIsCartOpen(true)} 
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAccount={() => setIsAuthOpen(true)}
      />
      
      {/* 2. Contenido Dinámico (Fondo de la mitad) 
          El padding-top (pt-*) compensa la altura del Header fijo */}
      <main className="flex-grow w-full pt-[100px] md:pt-[120px] lg:pt-[100px]">
        <Outlet />
      </main>
      
      {/* 3. Pie de página */}
      <Footer />

      {/* 4. Capas Superpuestas (Globales) */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
};

export default Layout;