import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchCart();
    }
  }, []);

  const fetchCart = async () => {
    try {
      const res = await axios.get(`${API_URL}/cart`);
      setCartItems(res.data);
    } catch (err) {
      console.error('Error fetching cart:', err);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      setLoading(true);
      await axios.post(`${API_URL}/cart/add`, { productId, quantity });
      await fetchCart();
      setCartOpen(true);
    } catch (err) {
      console.error('Error adding to cart:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateCartItem = async (itemId, quantity) => {
    try {
      await axios.put(`${API_URL}/cart/${itemId}`, { quantity });
      await fetchCart();
    } catch (err) {
      console.error('Error updating cart:', err);
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      await axios.delete(`${API_URL}/cart/${itemId}`);
      await fetchCart();
    } catch (err) {
      console.error('Error removing from cart:', err);
    }
  };

  const clearCart = async () => {
    try {
      await axios.delete(`${API_URL}/cart`);
      setCartItems([]);
    } catch (err) {
      console.error('Error clearing cart:', err);
    }
  };

  const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      cartOpen,
      setCartOpen,
      loading,
      addToCart,
      updateCartItem,
      removeFromCart,
      clearCart,
      cartTotal,
      cartCount,
      fetchCart
    }}>
      {children}
    </CartContext.Provider>
  );
};
