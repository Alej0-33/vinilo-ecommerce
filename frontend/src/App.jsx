import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext'; // <--- 1. Importar

// Layout Principal
import Layout from './components/layout/Layout'; // Ojo: Layout con mayúscula
// Páginas
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import Checkout from './pages/Checkout'; 
import ProductPage from './pages/ProductPage';
import Wishlist from './pages/Wishlist'; 

function App() {
  return (
    // 2. AuthProvider envuelve a CartProvider para que el carrito pueda acceder al usuario si es necesario
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="catalogo" element={<Catalog />} />
              <Route path="checkout" element={<Checkout />} />
              <Route path="/product/:id" element={<ProductPage />} /> 
              <Route path="account/wishlist" element={<Wishlist />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;