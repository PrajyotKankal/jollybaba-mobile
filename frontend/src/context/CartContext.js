// src/context/CartContext.js
import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const stored = localStorage.getItem('jollybaba_cart');
    try {
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error('Error parsing cart:', e);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('jollybaba_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (mobile) => {
    if (!mobile || !mobile._id) return;
    if (cart.find((item) => item._id === mobile._id)) return;
    if (cart.length >= 20) {
      alert("❌ You can only add up to 20 mobiles in the cart.");
      return;
    }
    setCart([...cart, mobile]);
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item._id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
