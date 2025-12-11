import React from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import Button from './Button';
import { useCart } from '../../context/CartContext'; // Importar Contexto

const CartDrawer = ({ isOpen, onClose }) => {
  // Usar datos reales del contexto
  const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();

  return (
    <>
      {/* Overlay Oscuro */}
      <div 
        className={`fixed inset-0 bg-black/40 z-50 transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-full md:w-[450px] bg-white z-50 transform transition-transform duration-500 ease-out shadow-2xl flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="font-serif text-2xl italic text-vinilo-black">
            Tu Bolsa <span className="text-sm font-sans not-italic text-gray-400">({cartItems.length})</span>
          </h2>
          <button onClick={onClose} className="hover:text-vinilo-red transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Lista de Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <ShoppingBag size={48} className="text-gray-200 mb-4" />
              <p className="font-serif text-lg text-gray-400">Tu bolsa está vacía.</p>
              <button 
                onClick={onClose}
                className="mt-4 text-xs font-bold uppercase tracking-widest text-vinilo-black underline hover:text-vinilo-red"
              >
                Seguir comprando
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={`${item.id}-${item.selectedSize}`} className="flex gap-4 animate-fade-in">
                <div className="w-24 h-32 bg-gray-50 flex-shrink-0 relative">
                   <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover" 
                   />
                </div>
                
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="font-serif text-base leading-tight text-vinilo-black line-clamp-2">
                        {item.name}
                      </h3>
                      <button 
                        onClick={() => removeFromCart(item.id, item.selectedSize)} 
                        className="text-gray-400 hover:text-vinilo-red transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    {item.selectedSize && (
                      <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-widest">
                        Talla: {item.selectedSize}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex justify-between items-end">
                    <div className="flex items-center border border-gray-200">
                      <button 
                        onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity - 1)}
                        className="p-1.5 hover:bg-gray-50 disabled:opacity-30 transition-colors"
                        disabled={item.quantity <= 1}
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-8 text-center text-xs font-bold text-vinilo-black">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity + 1)}
                        className="p-1.5 hover:bg-gray-50 transition-colors"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                    <p className="font-bold text-sm text-vinilo-black">
                      ${(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer / Totales (Solo visible si hay items) */}
        {cartItems.length > 0 && (
          <div className="p-6 bg-white border-t border-gray-100 shadow-[0_-5px_20px_-10px_rgba(0,0,0,0.1)]">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs uppercase tracking-widest text-gray-500 font-bold">Subtotal</span>
              <span className="font-serif text-xl font-bold text-vinilo-black">
                ${cartTotal.toLocaleString()}
              </span>
            </div>
            <p className="text-[10px] text-gray-400 mb-6 text-center">
              Impuestos y gastos de envío calculados en el checkout.
            </p>
            <Button variant="primary" size="full" className="flex items-center justify-center gap-2 group">
              Ir a Pagar <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;