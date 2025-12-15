import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext'; 


// Layout Principal
import Layout from './components/layout/Layout'; // Ojo: Layout con mayúscula
// Páginas
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import Checkout from './pages/Checkout'; 
import ProductPage from './pages/ProductPage';
import Wishlist from './pages/Wishlist'; 
import TermsConditions from './pages/TermsConditions';
import Tracking from './pages/TrackOrder';
import Privacy from './pages/Privacy';
import Contact from './pages/Contact';


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
              <Route path="tracking" element={<Tracking/>} />
              <Route path="terms-conditions" element={<TermsConditions />} />
              <Route path="privacy-policy" element={<Privacy/>} />
              <Route path='contact' element={<Contact/>}/>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;