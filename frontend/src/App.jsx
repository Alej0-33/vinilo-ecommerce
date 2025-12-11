import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';

// Layout Principal
import Layout from './components/layout/layout';
// Páginas
import Home from './pages/Home';
import Catalog from './pages/Catalog';

function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          
          {/* Layout envuelve todas las rutas */}
          <Route path="/" element={<Layout />}>
            
            {/* Ruta base renderiza Home */}
            <Route index element={<Home />} />
            
            {/* Otras rutas */}
            <Route path="catalogo" element={<Catalog />} />
            
            {/* Redirección por defecto */}
            <Route path="*" element={<Navigate to="/" replace />} />
            
          </Route>

        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;