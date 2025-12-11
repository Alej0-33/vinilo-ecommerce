import React, { createContext, useContext, useState, useEffect } from 'react';

// Crear el contexto
const CartContext = createContext();

// Custom Hook para usar el carrito fácilmente
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  // Inicializar estado desde localStorage (temporalmente hasta tener backend)
  const [cartItems, setCartItems] = useState(() => {
    try {
      const storedCart = localStorage.getItem('vinilo_cart');
      return storedCart ? JSON.parse(storedCart) : [];
    } catch (error) {
      console.error('Error parsing cart from localStorage', error);
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  // Guardar en localStorage cada vez que cambie (Persistencia Local)
  useEffect(() => {
    localStorage.setItem('vinilo_cart', JSON.stringify(cartItems));
    
    // TODO: Aquí iría la lógica para sincronizar con Django
    // if (userIsLoggedIn) { syncCartWithBackend(cartItems); }
  }, [cartItems]);

  // Agregar producto al carrito
  const addToCart = (product, size = null, quantity = 1) => {
    setCartItems(prevItems => {
      // Clave única para identificar item (ID + Talla)
      const itemIndex = prevItems.findIndex(
        item => item.id === product.id && item.selectedSize === size
      );

      if (itemIndex > -1) {
        // Si existe, actualizamos cantidad
        const newItems = [...prevItems];
        newItems[itemIndex].quantity += quantity;
        return newItems;
      } else {
        // Si no, agregamos nuevo
        return [...prevItems, { 
            ...product, 
            quantity: quantity, 
            selectedSize: size || 'Única' 
        }];
      }
    });
    // Abrir el carrito para feedback visual inmediato
    setIsCartOpen(true);
  };

  // Eliminar producto
  const removeFromCart = (id, size) => {
    setCartItems(prevItems => prevItems.filter(item => !(item.id === id && item.selectedSize === size)));
  };

  // Actualizar cantidad
  const updateQuantity = (id, size, newQuantity) => {
    if (newQuantity < 1) return;
    
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === id && item.selectedSize === size 
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  // Limpiar carrito (útil para checkout)
  const clearCart = () => setCartItems([]);

  // Calcular totales
  const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  const toggleCart = () => setIsCartOpen(!isCartOpen);

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartTotal,
      cartCount,
      isCartOpen,
      setIsCartOpen,
      toggleCart
    }}>
      {children}
    </CartContext.Provider>
  );
};