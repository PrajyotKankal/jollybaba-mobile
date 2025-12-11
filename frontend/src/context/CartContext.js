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

  // addToCart now accepts optional quantity (default 1)
  const addToCart = (mobile, quantity = 1) => {
    if (!mobile || !mobile._id) return;

    setCart(prevCart => {
      const existingIndex = prevCart.findIndex(item => item._id === mobile._id);

      if (existingIndex !== -1) {
        // Item exists - update quantity
        const updatedCart = [...prevCart];
        const currentQty = updatedCart[existingIndex].quantity || 1;
        const newQty = Math.min(currentQty + quantity, 99); // Max 99
        updatedCart[existingIndex] = { ...updatedCart[existingIndex], quantity: newQty };
        return updatedCart;
      } else {
        // New item - check cart limit
        if (prevCart.length >= 20) {
          alert("❌ You can only add up to 20 different mobiles in the cart.");
          return prevCart;
        }
        // Add new item with quantity
        return [...prevCart, { ...mobile, quantity }];
      }
    });
  };

  // Update quantity for an item
  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item._id === id ? { ...item, quantity: Math.min(quantity, 99) } : item
      )
    );
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item._id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  // Calculate total items count (sum of all quantities)
  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      clearCart,
      updateQuantity,
      totalItems
    }}>
      {children}
    </CartContext.Provider>
  );
};
